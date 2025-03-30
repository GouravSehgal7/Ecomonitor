import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"

export async function GET() {
  try {
    // Connect to MongoDB
    const client = await clientPromise

    // Ping the database to confirm connection
    await client.db("admin").command({ ping: 1 })

    // Get the list of databases to further verify connection
    const dbList = await client.db().admin().listDatabases()

    return NextResponse.json({
      success: true,
      message: "Successfully connected to MongoDB!",
      databases: dbList.databases.map((db) => db.name),
    })
  } catch (error) {
    console.error("MongoDB connection error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Failed to connect to MongoDB",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}

