
import db from "./db";
import jwt from "jsonwebtoken";
import axios from "axios";

const JWT_SECRET = process.env.JWT_SECRET || "designhunt_secret_key_123";

async function checkApiResponses() {
  try {
    const users = await db.all(`SELECT * FROM users`);
    console.log(`Testing ${users.length} users via API call...`);

    for (const user of users as any[]) {
      const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET);
      
      try {
        const response = await axios.get("http://localhost:5000/api/profile", {
          headers: {
            Cookie: `token=${token}`
          }
        });
        console.log(`User ${user.email}: SUCCESS`);
      } catch (err: any) {
        console.log(`User ${user.email}: FAILED (${err.response?.status || err.message})`);
        if (err.response?.data) {
          console.log(`Response Body:`, JSON.stringify(err.response.data, null, 2));
        }
      }
    }
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

checkApiResponses();
