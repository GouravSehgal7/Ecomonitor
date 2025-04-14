import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import usermodel from "@/lib/usermodel";

export async function GET(req: Request) {
  try {
    await connectDB();
    const allUsers = await usermodel.find({});
    return NextResponse.json(
      { success: true, users: allUsers },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch users" },
      { status: 500 }
    );
  }
}
