import { MongoClient, ServerApiVersion } from "mongodb"

// Environment variables should be set in your .env.local file
const username = process.env.MONGODB_USERNAME || "your_username"
const password = process.env.MONGODB_PASSWORD || "your_password"
const cluster = "users.nlqqf6y.mongodb.net"
const uri = `mongodb+srv://${username}:${password}@${cluster}/?appName=Users&tls=true&retryWrites=true&w=majority`

// Create a MongoClient with a MongoClientOptions object
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
})

if(client){
  console.log("client exist ");
  console.log(client);
}else{
  console.log("no client .........................");
  
}
// Connection pool for better performance
let clientPromise: Promise<MongoClient>

if (process.env.NODE_ENV === "development") {
  // In development, use a global variable so that the value
  // is preserved across module reloads caused by HMR
  const globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>
  }

  if (!globalWithMongo._mongoClientPromise) {
    globalWithMongo._mongoClientPromise = client.connect()
  }
  clientPromise = globalWithMongo._mongoClientPromise
} else {
  // In production, it's best to not use a global variable
  clientPromise = client.connect()
}

export default clientPromise

