import db from "./db";

const email = "shivampatel2330@gmail.com";
const user = db
  .prepare("SELECT id, email, password, role FROM users WHERE email = ?")
  .get(email) as any;

console.log("User Record:");
if (user) {
  console.log({
    ...user,
    password: user.password
      ? user.password.substring(0, 10) + "..."
      : "NULL/UNDEFINED",
  });
} else {
  console.log("User not found");
}
