import db from "./db";

const inspect = () => {
  try {
    const schema = db.prepare("PRAGMA table_info(challenges)").all();
    console.log("Challenges Table Schema:", schema);
  } catch (error) {
    console.error("Error inspecting DB:", error);
  }
};

inspect();
