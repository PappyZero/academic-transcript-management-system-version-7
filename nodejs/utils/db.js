import { MongoClient } from 'mongodb';

// Local MongoDB connection (default port)
const LOCAL_URI = 'mongodb://127.0.0.1:27017/academic-transcript-system';

// Use environment variable if available, otherwise local
const MONGODB_URI = process.env.MONGODB_URI || LOCAL_URI;

let client;
let clientPromise;

if (process.env.NODE_ENV === 'development') 
  {
  // In development mode, using a global variable  preserves connection.
  if (!global._mongoClientPromise) {
    client = new MongoClient(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // But in production mode, I will create new connection.
  client = new MongoClient(MONGODB_URI);
  clientPromise = client.connect();
}

export default clientPromise;