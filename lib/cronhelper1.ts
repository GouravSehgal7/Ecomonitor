import { messaging } from "@/lib/firebase-admin";
import redis from "@/lib/radisconfig";

export default async function handler() {
  try {
    // Get current time in UTC seconds
    const now = new Date();
    const secondsNow =
    now.getUTCHours() * 3600 + now.getUTCMinutes() * 60 + now.getUTCSeconds();
    console.log("current time",secondsNow);
    console.log(now.toISOString());
    
    // Set margin in seconds
    const margin = 70;

    // Fetch tokens within the specified time range
    const tokenlist = await redis.zrangebyscore(
      'Notification token',
      secondsNow - margin,
      secondsNow
    );
    
    // Validate if there are tokens to send the message
    if (tokenlist.length === 0) {
      console.warn("No tokens found within the specified time range.");
      return;
    }
    console.log(tokenlist);
    

    // Define message content
    const title = "Oops, spike in pollution!";
    const body = "Catch the latest details of pollution here.";

    const message = {
      notification: { title, body },
      tokens: tokenlist,
    };
// console.log(message);

    // Validate message format (basic validation)
    if (!title || !body || !Array.isArray(message.tokens) || message.tokens.length === 0) {
      throw new Error("Invalid message format or empty tokens list.");
    }

    // Send the message to all tokens
    const response = await messaging.sendEachForMulticast(message);
// console.log(response);

    // Check if the message was sent successfully
    if (response.successCount > 0) {
      console.log(`Successfully sent notifications to ${response.successCount} tokens.`);

      // Remove sent tokens from Redis
      for (const member of tokenlist) {
        await redis.zrem('Notification token', member);
      }
    } else {
      console.error("Failed to send messages to all tokens.");
    }

  } catch (error) {
    // Handle errors
    console.error("Error occurred during the cron job:", error);
  }
}
