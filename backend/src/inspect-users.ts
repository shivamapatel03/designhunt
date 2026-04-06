import db from "./db";

const inspect = () => {
  try {
    const schema = db.prepare("PRAGMA table_info(users)").all() as any[];
    console.log("Users Table Schema:");
    schema.forEach(col => {
      console.log(`- ${col.name}: ${col.type}`);
    });
  } catch (error) {
    console.error("Error inspecting DB:", error);
  }
};

inspect();
