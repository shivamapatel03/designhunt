import db from "./db";

const SUPER_ADMIN_EMAIL = "shivampatel2330@gmail.com";

const cleanup = () => {
    console.log(`Starting cleanup... Finding Super Admin: ${SUPER_ADMIN_EMAIL}`);

    const admin = db.prepare("SELECT id FROM users WHERE email = ?").get(SUPER_ADMIN_EMAIL) as { id: string } | undefined;

    if (!admin) {
        console.error("Super Admin not found. Please run ensure-super-admin.ts first.");
        return;
    }

    const adminId = admin.id;
    console.log(`Super Admin ID: ${adminId}`);

    // Get all tables
    const tables = db.prepare("SELECT name FROM sqlite_master WHERE type = 'table'").all() as { name: string }[];

    // Disable Foreign Keys temporarily
    db.exec("PRAGMA foreign_keys = OFF");

    try {
        db.transaction(() => {
            for (const { name } of tables) {
                if (name === 'users') continue;

                // Check for user_id or userId columns
                const columns = db.prepare(`PRAGMA table_info(${name})`).all() as any[];
                const userIdColumn = columns.find(c => c.name.toLowerCase() === "user_id" || c.name.toLowerCase() === "userid");

                if (userIdColumn) {
                    console.log(`Cleaning table ${name} (filtering by ${userIdColumn.name})...`);
                    const result = db.prepare(`DELETE FROM ${name} WHERE ${userIdColumn.name} != ?`).run(adminId);
                    console.log(`Deleted ${result.changes} records from ${name}`);
                }
            }

            // Finally, delete all users except the super admin
            console.log(`Deleting all users except ${SUPER_ADMIN_EMAIL}...`);
            const userDeleteResult = db.prepare("DELETE FROM users WHERE id != ?").run(adminId);
            console.log(`Deleted ${userDeleteResult.changes} user records.`);
        })();
    } finally {
        // Re-enable Foreign Keys
        db.exec("PRAGMA foreign_keys = ON");
    }

    console.log("Cleanup complete. Running VACUUM...");
    db.exec("VACUUM");
    console.log("VACUUM finished.");
};

cleanup();
