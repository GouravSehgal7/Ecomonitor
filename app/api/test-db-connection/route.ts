import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"

export async function GET() {
  try {
    // Connect to the MongoDB client
    const client = await clientPromise

    // Get the database and list all collections
    const db = client.db("pollution_monitoring")
    const collections = await db.listCollections().toArray()

    // Return success response with collection names
    return NextResponse.json({
      status: "Connected successfully to MongoDB!",
      collections: collections.map((col) => col.name),
      database: "pollution_monitoring",
    })
  } catch (error) {
    console.error("MongoDB connection error:", error)
    return NextResponse.json({ error: "Failed to connect to MongoDB", details: error.message }, { status: 500 })
  }
}

