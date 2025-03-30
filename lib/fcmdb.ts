import mongoose from "mongoose";

const FCMTokenSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  token: { type: String, required: true, unique: true },
  bodt:{type: String, required: true, unique: true},
  phonenum:{ type: String, required: true, unique: true },
  email:{ type: String, required: true, unique: true },
}, { timestamps: true });

export default mongoose.models.FCMToken || mongoose.model("FCMToken", FCMTokenSchema);
