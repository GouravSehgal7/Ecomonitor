import { NextResponse } from "next/server";
import UserModel from "@/lib/usermodel";
import connectDB from "@/lib/mongodb";
import redis from "@/lib/radisconfig";

export async function DELETE(req: Request) {
    try {
        await connectDB();

        const { email } = await req.json(); // Get email from request body

        if (!email) {
            return NextResponse.json({ success: false, message: "Email is required." }, { status: 400 });
        }

        const deletedUser = await UserModel.findOneAndDelete({ email });
        console.log(deletedUser);
        
        if (!deletedUser) {
            return NextResponse.json({ success: false, message: "User not found." }, { status: 404 });
        }
        const data = await redis.zrem("Notification token",deletedUser.token)

        console.log("removed from redis",data);
        

        return NextResponse.json({ success: true, message: "User deleted successfully." }, { status: 200 });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ success: false, message: "Server error." }, { status: 500 });
    }
}
