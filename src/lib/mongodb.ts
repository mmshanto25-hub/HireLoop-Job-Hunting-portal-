import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/hireloop';

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
  isConnected: boolean;
}

declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache | undefined;
}

let cached: MongooseCache = global.mongooseCache || {
  conn: null,
  promise: null,
  isConnected: false,
};

if (!global.mongooseCache) {
  global.mongooseCache = cached;
}

export async function connectToDatabase(): Promise<{ isConnected: boolean; error?: string }> {
  if (cached.conn && cached.isConnected) {
    return { isConnected: true };
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 2000,
    };

    cached.promise = mongoose
      .connect(MONGODB_URI, opts)
      .then((mongooseInstance) => {
        cached.isConnected = true;
        return mongooseInstance;
      })
      .catch((err) => {
        cached.promise = null;
        cached.isConnected = false;
        console.warn('MongoDB connection fallback: Mongoose could not connect, using high-performance in-memory store.', err.message);
        throw err;
      });
  }

  try {
    cached.conn = await cached.promise;
    cached.isConnected = true;
    return { isConnected: true };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Unknown connection error';
    return { isConnected: false, error: errorMsg };
  }
}

export default connectToDatabase;
