import { Router } from "express";
import Razorpay from "razorpay";
import crypto from "crypto";
import db from "../db";
import jwt from "jsonwebtoken";

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || "designhunt_secret_key_123";

let razorpay: Razorpay;
try {
  razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || "rzp_test_placeholder",
    key_secret: process.env.RAZORPAY_KEY_SECRET || "placeholder_secret",
  });
} catch (error) {
  console.error("Razorpay initialization failed:", error);
}

// Create Order
router.post("/create-order", async (req, res) => {
  const { amount } = req.body;
  const token = req.cookies.token;

  if (!token) return res.status(401).json({ error: "Unauthorized" });

  try {
    const options = {
      amount: Math.round(amount * 100), // convert to paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);
    res.json({ 
        orderId: order.id, 
        amount: options.amount, 
        currency: options.currency,
        key: process.env.RAZORPAY_KEY_ID || "rzp_test_placeholder"
    });
  } catch (error) {
    console.error("Order creation failed:", error);
    res.status(500).json({ error: "Failed to create order" });
  }
});

// Verify Payment
router.post("/verify", async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, amount } = req.body;
  const amountNum = Number(amount) || 0;
  const token = req.cookies.token;

  if (!token) return res.status(401).json({ error: "Unauthorized" });

  try {
    const payload = jwt.verify(token, JWT_SECRET) as any;
    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || "placeholder_secret")
      .update(body.toString())
      .digest("hex");

    if (expectedSignature === razorpay_signature) {
      // Payment verified
      console.log(`[PAYMENT VERIFY] Success matching signature for user: ${payload.userId}, amount: ${amountNum}`);
      
      try {
        // Calculate Scan Increment
        let scanIncrement = 0;
        let description = "PRO Upgrade";
        
        if (amountNum === 10) {
          scanIncrement = 1;
          description = "1 Scan Top-Up";
        } else if (amountNum === 199) {
          scanIncrement = 10;
          description = "10 Scans Top-Up";
        } else if (amountNum === 599) {
          scanIncrement = 20;
          description = "20 Scans Top-Up";
        } else if (amountNum === 999) {
          scanIncrement = 45;
          description = "Monthly Pro (45 Scans)";
          // Mark as Pro for monthly plan
          await db.run("UPDATE users SET is_pro = true WHERE id = $1", [payload.userId]);
        }

        console.log(`[PAYMENT VERIFY] Incrementing scans by: ${scanIncrement}`);

        // Update User Credits
        if (scanIncrement > 0) {
          await db.run("UPDATE users SET scan_balance = scan_balance + $1 WHERE id = $2", [scanIncrement, payload.userId]);
        }

        // Record Transaction
        await db.run(`
          INSERT INTO transactions (id, user_id, amount, currency, status, type, description)
          VALUES ($1, $2, $3, $4, $5, $6, $7)
        `, [
          `txn_${Date.now()}`,
          payload.userId,
          amountNum,
          "INR",
          "completed",
          "subscription",
          description
        ]);

        res.json({ success: true, message: "Payment verified and Balance updated!" });
      } catch (dbError) {
        console.error("[PAYMENT VERIFY] Database error:", dbError);
        res.status(500).json({ error: "Failed to update user balance" });
      }
    } else {
      console.error(`[PAYMENT VERIFY] Signature mismatch for user ${payload.userId}`);
      res.status(400).json({ error: "Invalid signature" });
    }
  } catch (error) {
    console.error("Verification failed:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
