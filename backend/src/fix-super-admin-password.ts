import db from "./db";
import bcrypt from "bcryptjs";

async function checkAndFixPassword() {
    const email = "shivampatel2330@gmail.com";
    const testPassword = "shivam1714";
    
    const user = await db.get("SELECT email, role, password FROM users WHERE email = $1", [email]) as any;
    console.log("User found:", user?.email, "| Role:", user?.role);
    console.log("Has password set:", !!user?.password);
    
    if (user?.password) {
        const isMatch = await bcrypt.compare(testPassword, user.password);
        console.log(`Password '${testPassword}' matches:`, isMatch);
        
        if (!isMatch) {
            console.log("\nPassword does NOT match. Resetting to 'shivam1714'...");
            const hashed = await bcrypt.hash(testPassword, 10);
            await db.run("UPDATE users SET password = $1 WHERE email = $2", [hashed, email]);
            console.log("✅ Password reset to 'shivam1714' successfully.");
        } else {
            console.log("✅ Password is already correct!");
        }
    } else {
        console.log("\nNo password set. Setting to 'shivam1714'...");
        const hashed = await bcrypt.hash(testPassword, 10);
        await db.run("UPDATE users SET password = $1 WHERE email = $2", [hashed, email]);
        console.log("✅ Password set to 'shivam1714' successfully.");
    }
}

checkAndFixPassword().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
