import { MongoClient } from 'mongodb';

const client = new MongoClient(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  maxPoolSize: 10,
});

let cached = global.mongo;
if (!cached) cached = global.mongo = { conn: null, promise: null };

export const clientPromise = (async () => {
  const { client } = await connectDB();
  return client;
})();

export async function connectDB() {
  if (cached.conn) return cached.conn;
  
  if (!cached.promise) {
    cached.promise = MongoClient.connect(process.env.MONGODB_URI).then(client => ({
      client,
      db: client.db("academic-transcript-system")
    })).catch(err => {
      console.error('MongoDB connection error:', err);
      throw err;
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

// Local MongoDB connection (default port)
// const LOCAL_URI = 'mongodb://127.0.0.1:27017/academic-transcript-system';

// Use environment variable if available, otherwise local
// const MONGODB_URI = process.env.MONGODB_URI || LOCAL_URI;