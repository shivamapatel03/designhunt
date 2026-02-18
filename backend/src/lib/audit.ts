import db from "../db";
import { v4 as uuidv4 } from "uuid";

export const logAction = (
  adminId: string,
  action: string,
  targetId: string = "",
  details: any = {},
) => {
  try {
    const id = uuidv4();
    db.prepare(
      `
            INSERT INTO audit_logs (id, admin_id, action, target_id, details)
            VALUES (?, ?, ?, ?, ?)
        `,
    ).run(id, adminId, action, targetId, JSON.stringify(details));
  } catch (err) {
    console.error("Failed to log action:", err);
  }
};

export const getAuditLogs = () => {
  try {
    // limit to last 100 logs for now
    return db
      .prepare(
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
      )
      .all();
  } catch (err) {
    console.error("Failed to fetch logs:", err);
    return [];
  }
};
