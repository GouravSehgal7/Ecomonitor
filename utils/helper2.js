const { redis } = require('./redis');
const { getUser } = require('./getuserdata');

async function handler() {
  try {
    await redis.zremrangebyrank("Notification token", 0, -1);
    const data = await getUser();
    if (!data || data.length === 0) {
      return;
    }
    await Promise.all(
      data.map(async (user) => {
        if (user.token && user.time) { 
          await redis.zadd("Notification token", user.time, user.token);
        }
      })
    );

    console.log("✅ Redis updated with user tokens");

  } catch (error) {
    console.error("❌ Error occurred during the cron job:", error);
  }
}

module.exports = { handler };
