import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "supersecretkey";

export async function hashPassword(password: string) {
  return await bcrypt.hash(password, 10);
}

export async function comparePasswords(password: string, hashedPassword: string) {
  return await bcrypt.compare(password, hashedPassword);
}

export function generateToken(user: { id: string; email: string }) {
  return jwt.sign(user, SECRET, { expiresIn: "1h" });
}

// export function ConvertToSec(time:string){
//   const [hours, minutes] = time.split(':').map(Number);
//   const localDate = new Date();
// localDate.setHours(hours, minutes, 0, 0);

// // Get the equivalent UTC time in seconds since midnight
// const utcHours = localDate.getUTCHours();
// const utcMinutes = localDate.getUTCMinutes();
// const utcSeconds = localDate.getUTCSeconds();

// const utcTotalSeconds = utcHours * 3600 + utcMinutes * 60 + utcSeconds;
// console.log("usertime",utcTotalSeconds);

// return utcTotalSeconds
// }

export function ConvertToSec(time: string) {
  const [hours, minutes] = time.split(':').map(Number);

  // Assume input is in IST (UTC+5:30)
  const istTotalSeconds = hours * 3600 + minutes * 60;

  // Convert to UTC by subtracting the offset (5.5 hours = 19800 seconds)
  let utcTotalSeconds = istTotalSeconds - (5.5 * 3600); // = 19800

  // If the result is negative, add 24h to wrap around
  if (utcTotalSeconds < 0) {
    utcTotalSeconds += 86400;
  }

  console.log("usertime (UTC seconds)", utcTotalSeconds);
  return Math.floor(utcTotalSeconds);
}


