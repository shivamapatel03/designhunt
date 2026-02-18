import Database from "better-sqlite3";
import path from "path";

const dbPath = path.join(process.cwd(), "designhunt_v2.db");
const db = new Database(dbPath);

const email = "shivampatel2330@gmail.com";
const user = db
  .prepare("SELECT email, otp_code, otp_expires_at FROM users WHERE email = ?")
  .get(email) as any;

if (user) {
  console.log("User:", user.email);
  console.log("Stored OTP:", user.otp_code);
  console.log("Expires At:", user.otp_expires_at);
  console.log("Current Time:", new Date().toISOString());

  if (user.otp_expires_at) {
    const expires = new Date(user.otp_expires_at);
    const now = new Date();
    console.log("Is Expired?", expires < now);
  }
} else {
  console.log("User not found");
}
