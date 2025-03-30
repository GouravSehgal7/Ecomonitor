// "use server"

// import { createUser, getUserByPhone, updateUser } from "@/lib/user-model"

// export async function registerUser(
//   formData: FormData,
// ): Promise<{ success: boolean; message: string; userId?: string }> {
//   try {
//     // Extract form data
//     const name = formData.get("name") as string
//     const phoneNumber = formData.get("phoneNumber") as string
//     const email = formData.get("email") as string

//     // Validate required fields
//     if (!name || !phoneNumber) {
//       return {
//         success: false,
//         message: "Name and phone number are required",
//       }
//     }

//     // Check if user already exists
//     const existingUser = await getUserByPhone(phoneNumber)
//     if (existingUser) {
//       return {
//         success: false,
//         message: "A user with this phone number already exists",
//         userId: existingUser._id?.toString(),
//       }
//     }

//     // Extract health profile data
//     const age = formData.get("age") ? Number.parseInt(formData.get("age") as string) : undefined
//     const conditions = formData.get("conditions") ? (formData.get("conditions") as string).split(",") : []
//     const medications = formData.get("medications") ? (formData.get("medications") as string).split(",") : []
//     const allergies = formData.get("allergies") ? (formData.get("allergies") as string).split(",") : []

//     // Extract notification preferences
//     const notificationTypes = []
//     if (formData.get("notifyAirQuality") === "on") notificationTypes.push("airQuality")
//     if (formData.get("notifyWaterQuality") === "on") notificationTypes.push("waterQuality")
//     if (formData.get("notifyUVIndex") === "on") notificationTypes.push("uvIndex")
//     if (formData.get("notifyTraffic") === "on") notificationTypes.push("trafficAlerts")

//     const notificationMethods = []
//     if (formData.get("notifySMS") === "on") notificationMethods.push("sms")
//     if (formData.get("notifyEmail") === "on") notificationMethods.push("email")
//     if (formData.get("notifyPush") === "on") notificationMethods.push("push")

//     const areaOfInterest = formData.get("areaOfInterest") as string

//     // Create new user
//     const newUser = await createUser({
//       name,
//       phoneNumber,
//       email,
//       healthProfile: {
//         age,
//         conditions,
//         medications,
//         allergies,
//       },
//       preferences: {
//         notificationTypes,
//         notificationMethods,
//         areaOfInterest,
//       },
//     })

//     return {
//       success: true,
//       message: "User registered successfully",
//       userId: newUser._id?.toString(),
//     }
//   } catch (error) {
//     console.error("Error registering user:", error)
//     return {
//       success: false,
//       message: "An error occurred while registering user",
//     }
//   }
// }

// export async function updateUserProfile(
//   userId: string,
//   formData: FormData,
// ): Promise<{ success: boolean; message: string }> {
//   try {
//     // Extract form data
//     const name = formData.get("name") as string
//     const email = formData.get("email") as string

//     // Extract health profile data
//     const age = formData.get("age") ? Number.parseInt(formData.get("age") as string) : undefined
//     const conditions = formData.get("conditions") ? (formData.get("conditions") as string).split(",") : []
//     const medications = formData.get("medications") ? (formData.get("medications") as string).split(",") : []
//     const allergies = formData.get("allergies") ? (formData.get("allergies") as string).split(",") : []

//     // Extract notification preferences
//     const notificationTypes = []
//     if (formData.get("notifyAirQuality") === "on") notificationTypes.push("airQuality")
//     if (formData.get("notifyWaterQuality") === "on") notificationTypes.push("waterQuality")
//     if (formData.get("notifyUVIndex") === "on") notificationTypes.push("uvIndex")
//     if (formData.get("notifyTraffic") === "on") notificationTypes.push("trafficAlerts")

//     const notificationMethods = []
//     if (formData.get("notifySMS") === "on") notificationMethods.push("sms")
//     if (formData.get("notifyEmail") === "on") notificationMethods.push("email")
//     if (formData.get("notifyPush") === "on") notificationMethods.push("push")

//     const areaOfInterest = formData.get("areaOfInterest") as string

//     // Update user
//     const updatedUser = await updateUser(userId, {
//       name,
//       email,
//       healthProfile: {
//         age,
//         conditions,
//         medications,
//         allergies,
//       },
//       preferences: {
//         notificationTypes,
//         notificationMethods,
//         areaOfInterest,
//       },
//     })

//     if (!updatedUser) {
//       return {
//         success: false,
//         message: "User not found",
//       }
//     }

//     return {
//       success: true,
//       message: "User profile updated successfully",
//     }
//   } catch (error) {
//     console.error("Error updating user profile:", error)
//     return {
//       success: false,
//       message: "An error occurred while updating user profile",
//     }
//   }
// }



"use server";

interface ApiResponse {
  success: boolean;
  message: string;
  data?: any;
}

// Register User
export async function registerUser(formData: FormData): Promise<ApiResponse> {
  console.log("hit");
  try {
    console.log("hit");
    
    const response = await fetch("/api/auth/register", {
      method: "POST",
      body: formData,
    });

    return response.json();
  } catch (error) {
    return { success: false, message: "Registration failed. Please try again." };
  }
}

// Login User
export async function loginUser(formData: FormData): Promise<ApiResponse> {
  try {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      body: formData,
      
    });

    return response.json();
  } catch (error) {
    return { success: false, message: "Login failed. Please check your credentials and try again." };
  }
}

// Logout User
export async function logoutUser(): Promise<ApiResponse> {
  try {
    const response = await fetch("/api/auth/logout", {
      method: "POST",
    });

    return response.json();
  } catch (error) {
    return { success: false, message: "Logout failed. Please try again." };
  }
}

// Fetch Current User
export async function fetchCurrentUser(): Promise<ApiResponse> {
  try {
    const response = await fetch("/api/auth/me", {
      method: "GET",
    });

    return response.json();
  } catch (error) {
    return { success: false, message: "Failed to fetch user data." };
  }
}
