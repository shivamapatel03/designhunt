import db from "./db";
import { storeOtp } from "./lib/otp";

async function test() {
    const email = "shivampatel2330@gmail.com";
    const otp = "112233";
    console.log("Starting test for email:", email);
    
    const result = await storeOtp(email, otp, "admin");
    console.log("Store OTP Result:", result);
    
    const user = await db.get("SELECT email, otp_code, otp_expires_at FROM users WHERE email = $1", [email]) as any;
    console.log("Updated User Data:", JSON.stringify(user, null, 2));
    
    if (user && user.otp_expires_at) {
        console.log("DB Time (NOW):", (await db.query("SELECT NOW()")).rows[0].now);
        console.log("OTP Expires At:", user.otp_expires_at);
        
        const now = new Date((await db.query("SELECT NOW()")).rows[0].now).getTime();
        const expires = new Date(user.otp_expires_at).getTime();
        console.log("Is Valid Time? (Relative to DB NOW):", expires > now);
    }
}

test().then(() => process.exit(0));
