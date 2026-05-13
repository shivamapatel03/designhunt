import db from "./db";

async function check() {
    const res = await db.query("SHOW TIMEZONE");
    console.log("Postgres Timezone:", res.rows[0].timezone);
    
    const now = await db.query("SELECT NOW()");
    console.log("Postgres NOW():", now.rows[0].now);
    
    const nowUtc = await db.query("SELECT CURRENT_TIMESTAMP AT TIME ZONE 'UTC'");
    console.log("Postgres UTC:", nowUtc.rows[0].timezone); // Actually it might be in 'timezone' column
}

check().then(() => process.exit(0));
