import { storeOtp, getStoredOtp, clearOtp } from "./lib/otp";

async function test() {
    const email = "shivampatel2330@gmail.com";
    const testOtp = "999888";
    
    console.log("=== OTP Flow Test ===");
    
    // 1. Store
    console.log("\n[1] Storing OTP:", testOtp);
    const storeResult = await storeOtp(email, testOtp, "admin");
    console.log("    Stored in:", storeResult.storedIn);
    
    // 2. Retrieve immediately (should work)
    console.log("\n[2] Retrieving OTP immediately...");
    const retrieved = await getStoredOtp(email, "admin");
    console.log("    Retrieved:", retrieved);
    
    if (retrieved === testOtp) {
        console.log("    ✅ SUCCESS - OTP matches and is valid!");
    } else {
        console.log("    ❌ FAIL - OTP mismatch or expired.");
    }
    
    // 3. Clear
    console.log("\n[3] Clearing OTP...");
    await clearOtp(email, "admin");
    
    // 4. Verify cleared
    console.log("[4] Verifying OTP is cleared...");
    const afterClear = await getStoredOtp(email, "admin");
    console.log("    After clear:", afterClear, afterClear === null ? "✅ Cleared" : "❌ Still exists");
    
    console.log("\n=== Test Complete ===");
}

test().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
