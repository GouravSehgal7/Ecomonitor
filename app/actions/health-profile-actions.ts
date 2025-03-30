"use server"

import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"

interface HealthProfile {
  _id?: ObjectId
  userId: string
  age?: number
  conditions?: string[]
  location?: string
  createdAt?: Date
  updatedAt?: Date
}

export async function saveHealthProfile(profileData: {
  userId: string
  age?: number
  conditions?: string[]
  location?: string
}): Promise<{ success: boolean; message?: string }> {
  let client
  try {
    client = await clientPromise
    const db = client.db("Users") // Using your database name from connection string
    const { userId, age, conditions, location } = profileData

    // Validate input
    if (!userId) {
      return { success: false, message: "User ID is required" }
    }

    if (age && (age < 0 || age > 120)) {
      return { success: false, message: "Age must be between 0 and 120" }
    }

    // Prepare update data
    const updateData: Partial<HealthProfile> = {
      age,
      conditions: conditions || [],
      location,
      updatedAt: new Date(),
    }

    // Update or insert the profile
    await db.collection("healthprofiles").updateOne(
      { userId },
      {
        $set: updateData,
        $setOnInsert: {
          userId,
          createdAt: new Date(),
        },
      },
      { upsert: true }
    )

    return { success: true }
  } catch (error) {
    console.error("Error saving health profile:", error)
    return {
      success: false,
      message: "An error occurred while saving your health profile",
    }
  } finally {
    // Note: Don't close the connection as we're using connection pooling
    // if (client) await client.close()
  }
}

export async function getHealthProfile(
  userId: string
): Promise<{ success: boolean; data?: Omit<HealthProfile, "_id">; message?: string }> {
  let client
  try {
    client = await clientPromise
    const db = client.db("Users")

    if (!userId) {
      return { success: false, message: "User ID is required" }
    }

    const profile = await db.collection("healthprofiles").findOne<HealthProfile>(
      { userId },
      {
        projection: {
          _id: 0, // Exclude MongoDB _id field from results
          userId: 1,
          age: 1,
          conditions: 1,
          location: 1,
          createdAt: 1,
          updatedAt: 1,
        },
      }
    )

    if (!profile) {
      return { success: false, message: "Health profile not found" }
    }

    return { success: true, data: profile }
  } catch (error) {
    console.error("Error fetching health profile:", error)
    return {
      success: false,
      message: "An error occurred while fetching your health profile",
    }
  } finally {
    // Note: Don't close the connection as we're using connection pooling
    // if (client) await client.close()
  }
}