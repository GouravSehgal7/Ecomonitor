import connectDB from "@/lib/mongodb";

import { messaging } from "@/lib/firebase-admin";
import { NextResponse } from "next/server";
import { fetchAQIData } from "@/lib/api-services";
import { getAQIHealthRecommendations } from "@/lib/aqi-service";
import usermodel from "@/lib/usermodel";

export async function POST(req: Request) {
  try {
    await connectDB();

    // Fetch AQI Data
    const data1 = await fetchAQIData();
    const title = `AQI Level: ${data1?.aqi}`;
    const bodyData = getAQIHealthRecommendations(data1?.aqi);
    const body = bodyData?.[0] || "No health recommendations available.";

    console.log("Fetched AQI Data:", { title, body });

    // Fetch FCM tokens from MongoDB
    const tokens = await usermodel.find().select("token");
    if (!tokens.length) {
      return NextResponse.json({ error: "No registered devices found" }, { status: 400 });
    }

    const tokenList = tokens.map((t) => t.token);
    console.log("Sending notification to tokens:", tokenList);

    // Prepare FCM message
    const message = {
      notification: { title, body },
      tokens: tokenList,
    };

    // Send notification via Firebase Cloud Messaging
    const response = await messaging.sendEachForMulticast(message);

    console.log("FCM Response:", response);

    return NextResponse.json({ success: true, response });
  } catch (error) {
    console.error("FCM Notification Error:", error);
    return NextResponse.json({ error: "Failed to send notification" }, { status: 500 });
  }
}
