import db from "../db";
import { v4 as uuidv4 } from "uuid";

export const logAction = async (
  adminId: string,
  action: string,
  targetId: string = "",
  details: any = {},
) => {
  try {
    const id = uuidv4();
    await db.run(
      `
            INSERT INTO audit_logs (id, admin_id, action, target_id, details)
            VALUES ($1, $2, $3, $4, $5)
        `,
      [id, adminId, action, targetId, JSON.stringify(details)]
    );
  } catch (err) {
    console.error("Failed to log action:", err);
  }
};

export const getAuditLogs = async () => {
  try {
    // limit to last 100 logs for now
    return await db.all(
      `
            SELECT 
                audit_logs.*, 
                users.name as admin_name, 
                users.email as admin_email 
            FROM audit_logs 
            LEFT JOIN users ON audit_logs.admin_id = users.id 
            ORDER BY created_at DESC 
            LIMIT 100
        `,
    );
  } catch (err) {
    console.error("Failed to fetch logs:", err);
    return [];
  }
};
