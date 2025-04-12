import connectDB from "@/lib/mongodb";
import usermodel from "@/lib/usermodel";
import { NextResponse } from "next/server";
import redis from "@/lib/radisconfig";
import { ConvertToSec } from "@/lib/helper";

export async function POST(req: Request) {
    try {
        await connectDB();
        // console.log("db connected");
        
        const {name,email,age,token,time} = await req.json();

        if (!name || !email || !age ||!token||!time) {
            // console.log(token,name,email,age);
            return NextResponse.json({ success: false, message: "Name, email, and password are required." }, { status: 400 });
          }
          const existingUser = await usermodel.findOne({ email });
          if (existingUser) {
            // console.log("existingUser",existingUser);
            
            return NextResponse.json({ success: false, message: "User already exists." }, { status: 400 });
          }
          const second = ConvertToSec(time)
          // console.log(second);
          
          const newUser = await usermodel.create({ name, email, age, token, time:second });
          // console.log("newuser",newUser);


          if(newUser){
            
            await redis.zadd("Notification token",newUser.time,newUser.token)
            console.log("newUser.time",newUser.time);
            

            //service worker code
            // await redis.zadd("Notification token",1,"kjjadskjbjdf")
            // await redis.zadd("Notification token",1,"efcd")
            // await redis.zadd("Notification token",1,"asnxji")
            // await redis.zadd("Notification token",2,"23erfg")


            // const [oneMember, score] = await redis.zrange("Notification token", 0, 0, 'WITHSCORES');
            // if (!score) return [];
            // const membersWithLowestScore = await redis.zrangebyscore("Notification token", score, score);
            // if (membersWithLowestScore.length > 0) {
            //   await redis.zrem("Notification token", ...membersWithLowestScore);
            // }
            // const data =  { score, members: membersWithLowestScore };
            
            
          }

          return NextResponse.json({ success: true, message: "User registered successfully", user: newUser }, { status: 201 });
    } catch (error) {
        console.log(error);
        // return error
        return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
    }
    }


// Replace with your actual model
