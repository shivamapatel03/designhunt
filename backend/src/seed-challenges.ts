import db from "./db";
import { randomUUID } from "crypto";

const CHALLENGES = [
  {
    title: "Redesign Spotify Player",
    description:
      "Create a modern, minimal music player interface focusing on album art and easy controls.",
    difficulty: "Medium",
    points: 50,
    category: "UI Design",
    requirements: "Must include play/pause, skip, album art, progress bar.",
  },
  {
    title: "Eco-Friendly Dashboard",
    description:
      "Design a dashboard for tracking carbon footprint usage in a smart home app.",
    difficulty: "Hard",
    points: 100,
    category: "Dashboard",
    requirements: "Data visualization for energy usage, green color palette.",
  },
  {
    title: "Login Screen",
    description: "Create a secure and friendly login screen for a banking app.",
    difficulty: "Easy",
    points: 20,
    category: "Authentication",
    requirements: "Email, Password, Forgot Password link, Social Login.",
  },
  {
    title: "Travel Booking App",
    description:
      "Design a search result card for a flight booking application.",
    difficulty: "Medium",
    points: 60,
    category: "Mobile App",
    requirements: "Flight times, airline logo, price, direct/stops indicator.",
  },
  {
    title: "E-commerce Product Page",
    description:
      "Design a high-converting product page for a luxury watch brand.",
    difficulty: "Hard",
    points: 120,
    category: "E-commerce",
    requirements: "High-quality imagery, clear CTA, detailed specs section.",
  },
  {
    title: "Settings Menu",
    description:
      "Design a settings menu for a productivity app with toggle switches.",
    difficulty: "Easy",
    points: 30,
    category: "UI Components",
    requirements: "Profile, Notifications, Theme, Privacy sections.",
  },
  {
    title: "404 Error Page",
    description:
      "Create a creative and helpful 404 page that guides users back home.",
    difficulty: "Medium",
    points: 40,
    category: "Web Design",
    requirements: "Link to home, search bar, fun illustration.",
  },
  {
    title: "Onboarding Flow",
    description: "Design a 3-step onboarding flow for a fitness tracking app.",
    difficulty: "Hard",
    points: 90,
    category: "UX Design",
    requirements: "Step 1: Welcome, Step 2: Set Goal, Step 3: Permissions.",
  },
  {
    title: "Chat Interface",
    description: "Design a messaging interface for a team collaboration tool.",
    difficulty: "Medium",
    points: 70,
    category: "Messaging",
    requirements: "User avatars, message bubbles, timestamp, input field.",
  },
  {
    title: "Weather Widget",
    description:
      "Create a compact weather widget showing current temp and forecast.",
    difficulty: "Easy",
    points: 25,
    category: "Widget",
    requirements: "Current temp, icon (sun/cloud), location, 3-day forecast.",
  },
];

// Helper to generate more variations
function generateMoreChallenges(count: number) {
  const categories = [
    "Mobile App",
    "Web Design",
    "Dashboard",
    "Iconography",
    "Typography",
  ];
  const difficulties = ["Easy", "Medium", "Hard"];
  const adjectives = [
    "Futuristic",
    "Minimalist",
    "Retro",
    "Dark Mode",
    "Accessible",
  ];

  const more = [];
  for (let i = 0; i < count; i++) {
    const cat = categories[Math.floor(Math.random() * categories.length)];
    const diff = difficulties[Math.floor(Math.random() * difficulties.length)];
    const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
    const points = diff === "Easy" ? 30 : diff === "Medium" ? 60 : 100;

    more.push({
      title: `${adj} ${cat} Challenge`,
      description: `Design a ${adj.toLowerCase()} concept for a ${cat.toLowerCase()} interface. Focus on usability and style.`,
      difficulty: diff,
      points: points,
      category: cat,
      requirements: "Creative freedom.",
    });
  }
  return more;
}

const ALL_CHALLENGES = [...CHALLENGES, ...generateMoreChallenges(40)];

async function seedChallenges() {
  console.log("Seeding challenges...");

  try {
    await db.run("DELETE FROM challenges");

    for (const challenge of ALL_CHALLENGES) {
      await db.run(
        `
        INSERT INTO challenges (id, title, description, difficulty, points, category, requirements)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
      `,
        [
          randomUUID(),
          challenge.title,
          challenge.description,
          challenge.difficulty,
          challenge.points,
          challenge.category,
          challenge.requirements,
        ]
      );
    }

    console.log(`Seeded ${ALL_CHALLENGES.length} challenges!`);
  } catch (error) {
    console.error("Seeding failed:", error);
  }
}

seedChallenges().then(() => process.exit(0));
