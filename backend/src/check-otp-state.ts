import db from "./db";

async function check() {
    const email = "shivampatel2330@gmail.com";
    const user = await db.get("SELECT email, role, otp_code, otp_expires_at FROM users WHERE email = $1", [email]) as any;
    console.log("User Data:", JSON.stringify(user, null, 2));
    
    if (user && user.otp_expires_at) {
        console.log("Current Time:", new Date().toISOString());
        console.log("OTP Expires At:", new Date(user.otp_expires_at).toISOString());
        console.log("Is Valid Time?", new Date(user.otp_expires_at) > new Date());
    }
}

check().then(() => process.exit(0));
