import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    name:{type: String, required: true,},
    email:{type: String, required: true,unique: true },
    age:{type: Number, required: true},
    token: { type: String, required: true, unique: true },
    time: { type: String, required: true },
});

export default mongoose.models.Userdata || mongoose.model("Userdata", UserSchema);
