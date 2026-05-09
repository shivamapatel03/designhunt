import db from "./db";

const SUPER_ADMIN_EMAIL = "shivampatel2330@gmail.com";

async function cleanup() {
    console.log(`Starting cleanup... Finding Super Admin: ${SUPER_ADMIN_EMAIL}`);

    const admin = await db.get("SELECT id FROM users WHERE email = $1", [SUPER_ADMIN_EMAIL]) as { id: string } | undefined;

    if (!admin) {
        console.error("Super Admin not found. Please run ensure-super-admin.ts first.");
        return;
    }

    const adminId = admin.id;
    console.log(`Super Admin ID: ${adminId}`);

    // Get all tables in the current schema
    const tables = await db.all(`
        SELECT table_name as name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
    `) as { name: string }[];

    try {
        for (const { name } of tables) {
            if (name === 'users') continue;

            // Check for user_id or userId columns
            const columns = await db.all(`
                SELECT column_name as name 
                FROM information_schema.columns 
                WHERE table_name = $1
            `, [name]) as any[];
            const userIdColumn = columns.find(c => c.name.toLowerCase() === "user_id" || c.name.toLowerCase() === "userid");

            if (userIdColumn) {
                console.log(`Cleaning table ${name} (filtering by ${userIdColumn.name})...`);
                await db.run(`DELETE FROM "${name}" WHERE "${userIdColumn.name}" != $1`, [adminId]);
                console.log(`Cleaned ${name}`);
            }
        }

        // Finally, delete all users except the super admin
        console.log(`Deleting all users except ${SUPER_ADMIN_EMAIL}...`);
        await db.run("DELETE FROM users WHERE id != $1", [adminId]);
        console.log(`Cleaned user records.`);
    } catch (error) {
        console.error("Cleanup error:", error);
    }

    console.log("Cleanup complete.");
}

cleanup().then(() => process.exit(0));
