import Database from "better-sqlite3";
import path from "path";

const dbPath = path.join(process.cwd(), "designhunt_v2.db");
console.log("DB Path:", dbPath);
const db = new Database(dbPath);

const email = "shivampatel2330@gmail.com";

// 1. Get User
console.log("--- Step 1: Fetch User ---");
const user = db
  .prepare("SELECT * FROM users WHERE email = ?")
  .get(email) as any;
if (!user) {
  console.error("User not found!");
  process.exit(1);
}
console.log(`User: ${user.email} (ID: ${user.id})`);

// 2. Generate and Update OTP
const otp = "123456";
const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();
console.log(`--- Step 2: Update OTP to '${otp}' ---`);

const info = db
  .prepare("UPDATE users SET otp_code = ?, otp_expires_at = ? WHERE id = ?")
  .run(otp, expiresAt, user.id);
console.log(`Rows updated: ${info.changes}`);

// 3. Read back immediately
console.log("--- Step 3: Read back OTP ---");
const updatedUser = db
  .prepare("SELECT * FROM users WHERE email = ?")
  .get(email) as any;
console.log(`Stored OTP: '${updatedUser.otp_code}'`);

if (updatedUser.otp_code === otp) {
  console.log("SUCCESS: OTP persisted.");
} else {
  console.error("FAILURE: OTP did not persist.");
}
