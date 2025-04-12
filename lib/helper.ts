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


export function ConvertToSec(time: string) {
  const [hours, minutes] = time.split(':').map(Number);

  // Create a date using UTC context, assuming the input is local time
  const utcDate = new Date(Date.UTC(1970, 0, 1, hours, minutes, 0)); // Always UTC

  const utcHours = utcDate.getUTCHours();
  const utcMinutes = utcDate.getUTCMinutes();
  const utcSeconds = utcDate.getUTCSeconds();

  const utcTotalSeconds = utcHours * 3600 + utcMinutes * 60 + utcSeconds;
  console.log("usertime (in UTC seconds)", utcTotalSeconds);

  return utcTotalSeconds;
}
