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

export function ConvertToSec(time:string){
  const [hours, minutes] = time.split(':').map(Number);
  const localDate = new Date();
localDate.setHours(hours, minutes, 0, 0);

// Get the equivalent UTC time in seconds since midnight
const utcHours = localDate.getUTCHours();
const utcMinutes = localDate.getUTCMinutes();
const utcSeconds = localDate.getUTCSeconds();

const utcTotalSeconds = utcHours * 3600 + utcMinutes * 60 + utcSeconds;
return utcTotalSeconds
}
