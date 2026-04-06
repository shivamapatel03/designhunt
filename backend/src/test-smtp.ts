import { sendVerificationEmail } from "./lib/email";
import dotenv from "dotenv";
import path from "path";

dotenv.config();

async function test() {
  console.log("Testing SMTP...");
  console.log("SMTP_HOST:", process.env.SMTP_HOST);
  console.log("SMTP_USER:", process.env.SMTP_USER);
  
  const result = await sendVerificationEmail("shivampatel2330@gmail.com", "123456");
  console.log("Result:", result);
  process.exit(result.success ? 0 : 1);
}

test();
