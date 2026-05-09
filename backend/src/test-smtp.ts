import { sendVerificationEmail } from "./lib/email";
import dotenv from "dotenv";

dotenv.config();

async function test() {
  console.log("Testing SMTP...");
  console.log("SMTP_HOST:", process.env.SMTP_HOST);
  console.log("SMTP_USER:", process.env.SMTP_USER);
  
  try {
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error("SMTP Timeout (60s)")), 60000)
    );

    const result: any = await Promise.race([
      sendVerificationEmail("designhunt.community@gmail.com", "123456"),
      timeoutPromise
    ]);

    console.log("Result:", result);
    process.exit(result.success ? 0 : 1);
  } catch (err: any) {
    console.error("Test Failed:", err.message);
    process.exit(1);
  }
}

test();
