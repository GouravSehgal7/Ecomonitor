import redis from "@/lib/radisconfig";
import connectDB from "./mongodb";
import usermodel from "./usermodel";


export default async function handler() {
  try {
    await connectDB()
    
    await redis.zremrangebyrank("Notification token", 0, -1);
    // console.log(res);
    
    const data = await usermodel.find({})
    if(data.length == 0){
        return
    }
    data.map(async(user)=>{
        // console.log(user.token);
        await redis.zadd("Notification token",user.time,user.token)
    })

    // console.log(data);
    

    

  } catch (error) {
    console.error("Error occurred during the cron job:", error);
  }
}
