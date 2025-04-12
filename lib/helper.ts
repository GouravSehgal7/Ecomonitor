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
  console.log("hours",hours);
  console.log("minutes",minutes);
  return hours * 3600 + minutes*60;
}
