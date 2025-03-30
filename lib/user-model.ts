import { ObjectId } from "mongodb"
import clientPromise from "./mongodb"

// Define the User interface
export interface User {
  _id?: ObjectId
  name: string
  email?: string
  password:string
  createdAt: Date
  updatedAt: Date
}

// Database and collection names
const DB_NAME = "pollution_monitoring"
const COLLECTION_NAME = "users"

// User database operations
export async function createUser(userData: Omit<User, "_id" | "createdAt" | "updatedAt">): Promise<User> {
  try {
    const client = await clientPromise
    const db = client.db(DB_NAME)
    const collection = db.collection<User>(COLLECTION_NAME)

    const now = new Date()
    const newUser: User = {
      ...userData,
      createdAt: now,
      updatedAt: now,
    }

    const result = await collection.insertOne(newUser)

    return {
      ...newUser,
      _id: result.insertedId,
    }
  } catch (error) {
    console.error("Error creating user:", error)
    throw new Error("Failed to create user")
  }
}

export async function getUserById(userId: string): Promise<User | null> {
  try {
    const client = await clientPromise
    const db = client.db(DB_NAME)
    const collection = db.collection<User>(COLLECTION_NAME)

    return await collection.findOne({ _id: new ObjectId(userId) })
  } catch (error) {
    console.error("Error fetching user:", error)
    throw new Error("Failed to fetch user")
  }
}


export async function updateUser(userId: string, userData: Partial<User>): Promise<User | null> {
  try {
    const client = await clientPromise
    const db = client.db(DB_NAME)
    const collection = db.collection<User>(COLLECTION_NAME)

    const result = await collection.findOneAndUpdate(
      { _id: new ObjectId(userId) },
      {
        $set: {
          ...userData,
          updatedAt: new Date(),
        },
      },
      { returnDocument: "after" },
    )

    return result
  } catch (error) {
    console.error("Error updating user:", error)
    throw new Error("Failed to update user")
  }
}

export async function deleteUser(userId: string): Promise<boolean> {
  try {
    const client = await clientPromise
    const db = client.db(DB_NAME)
    const collection = db.collection<User>(COLLECTION_NAME)

    const result = await collection.deleteOne({ _id: new ObjectId(userId) })

    return result.deletedCount === 1
  } catch (error) {
    console.error("Error deleting user:", error)
    throw new Error("Failed to delete user")
  }
}

