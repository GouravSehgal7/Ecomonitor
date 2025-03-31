
// import connectDB from "@/lib/mongodb";
// import { model, Schema, Document, Model } from "mongoose";

// interface IHealthProfile extends Document {
//   userId: string;
//   age?: number;
//   conditions?: string[];
//   location?: string;
//   createdAt?: Date;
//   updatedAt?: Date;
// }

// const HealthProfileSchema = new Schema<IHealthProfile>(
//   {
//     userId: { type: String, required: true, unique: true },
//     age: { type: Number, min: 0, max: 120 },
//     conditions: { type: [String], default: [] },
//     location: String,
//   },
//   { timestamps: true }
// );

// // Check if model already exists before creating it
// let HealthProfile: Model<IHealthProfile>;
// try {
//   HealthProfile = model<IHealthProfile>("HealthProfile");
// } catch {
//   HealthProfile = model<IHealthProfile>("HealthProfile", HealthProfileSchema);
// }

// export async function saveHealthProfile(profileData: {
//   userId: string;
//   age?: number;
//   conditions?: string[];
//   location?: string;
// }): Promise<{ success: boolean; message?: string }> {
//   try {
//     await connectDB();
//     const { userId, age, conditions, location } = profileData;

//     // Validate input
//     if (!userId) {
//       return { success: false, message: "User ID is required" };
//     }

//     if (age && (age < 0 || age > 120)) {
//       return { success: false, message: "Age must be between 0 and 120" };
//     }

//     // Update or insert the profile
//     await HealthProfile.findOneAndUpdate(
//       { userId },
//       {
//         age,
//         conditions: conditions || [],
//         location,
//       },
//       { upsert: true, new: true }
//     );

//     return { success: true };
//   } catch (error) {
//     console.error("Error saving health profile:", error);
//     return {
//       success: false,
//       message: "An error occurred while saving your health profile",
//     };
//   }
// }

// export async function getHealthProfile(
//   userId: string
// ): Promise<{ success: boolean; data?: Omit<IHealthProfile, "_id">; message?: string }> {
//   try {
//     await connectDB();

//     if (!userId) {
//       return { success: false, message: "User ID is required" };
//     }

//     const profile = await HealthProfile.findOne(
//       { userId },
//       { _id: 0, __v: 0 } // Exclude MongoDB _id and version fields
//     ).lean();

//     if (!profile) {
//       return { success: false, message: "Health profile not found" };
//     }

//     return { success: true, data: profile };
//   } catch (error) {
//     console.error("Error fetching health profile:", error);
//     return {
//       success: false,
//       message: "An error occurred while fetching your health profile",
//     };
//   }
// }