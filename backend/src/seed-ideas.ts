import db from "./db";

console.log("Seeding ideas...");

try {
  const insertIdea = db.prepare(
    "INSERT INTO ideas (idea, image, user_id, user_handle, user_avatar, name, email) VALUES (?, ?, ?, ?, ?, ?, ?)",
  );

  const idea1 = {
    idea: "What if we had a dedicated 'dark mode' only design challenge for the week? It forces us to think about contrast and low-light accessibility.",
    image:
      "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1000&auto=format&fit=crop",
    user_id: "user_seed_1",
    user_handle: "DarkKnightDesigns",
    user_avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=dark",
    name: "Bruce W.",
    email: "bruce@example.com",
  };

  const idea2 = {
    idea: "I've been experimenting with glassmorphism in my recent dashboards. Thinking about writing a short guide on how to get the blur and borders just right without looking muddy. Who's interested?",
    image: null,
    user_id: "user_seed_2",
    user_handle: "GlassMaster",
    user_avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=glass",
    name: "Alex G.",
    email: "alex@example.com",
  };

  insertIdea.run(
    idea1.idea,
    idea1.image,
    idea1.user_id,
    idea1.user_handle,
    idea1.user_avatar,
    idea1.name,
    idea1.email,
  );

  insertIdea.run(
    idea2.idea,
    idea2.image,
    idea2.user_id,
    idea2.user_handle,
    idea2.user_avatar,
    idea2.name,
    idea2.email,
  );

  console.log("Successfully seeded 2 ideas!");
} catch (e) {
  console.error("Error seeding ideas:", e);
}
