import db from "./db";
import { randomUUID } from "crypto";
import { addDays, format } from "date-fns"; // Date helper library might not be present, using native JS for now

const seedDuels = () => {
  console.log("Seeding daily duels...");

  // Create 7 duels for the next week
  const today = new Date();

  const duels = [
    {
      title: "Button Contrast",
      description: "Which button feels more clickable?",
      option_a_label: "High Contrast",
      option_a_image:
        "https://placehold.co/400x300/000000/FFFFFF?text=Button+A",
      option_b_label: "Low Contrast",
      option_b_image:
        "https://placehold.co/400x300/CCCCCC/FFFFFF?text=Button+B",
      category: "UI Design",
    },
    {
      title: "Navigation Style",
      description: "Which menu layout is cleaner?",
      option_a_label: "Hamburger",
      option_a_image: "https://placehold.co/400x300/FF5733/FFFFFF?text=Menu+A",
      option_b_label: "Tab Bar",
      option_b_image: "https://placehold.co/400x300/33FF57/FFFFFF?text=Menu+B",
      category: "UX Pattern",
    },
    {
      title: "Card Layout",
      description: "Which card design scans better?",
      option_a_label: "List View",
      option_a_image: "https://placehold.co/400x300/3357FF/FFFFFF?text=Card+A",
      option_b_label: "Grid View",
      option_b_image: "https://placehold.co/400x300/FF33A6/FFFFFF?text=Card+B",
      category: "Layout",
    },
    {
      title: "Typography Pairing",
      description: "Which font combination reads better?",
      option_a_label: "Serif + Sans",
      option_a_image:
        "https://placehold.co/400x300/F0F0F0/333333?text=Serif+Header",
      option_b_label: "Sans + Sans",
      option_b_image:
        "https://placehold.co/400x300/F0F0F0/333333?text=Sans+Header",
      category: "Typography",
    },
    {
      title: "Icon Style",
      description: "Which icon set fits a finance app?",
      option_a_label: "Outline",
      option_a_image:
        "https://placehold.co/400x300/E0E0E0/333333?text=Outline+Icons",
      option_b_label: "Solid",
      option_b_image:
        "https://placehold.co/400x300/E0E0E0/333333?text=Solid+Icons",
      category: "Iconography",
    },
    {
      title: "Color Palette",
      description: "Which scheme feels more 'trustworthy'?",
      option_a_label: "Blue & Grey",
      option_a_image:
        "https://placehold.co/400x300/0047AB/FFFFFF?text=Blue+Theme",
      option_b_label: "Orange & Black",
      option_b_image:
        "https://placehold.co/400x300/FF8C00/FFFFFF?text=Orange+Theme",
      category: "Color Theory",
    },
    {
      title: "Modal vs Inline",
      description: "Best way to edit a profile?",
      option_a_label: "Modal Popup",
      option_a_image:
        "https://placehold.co/400x300/DarkSlateGray/FFFFFF?text=Modal",
      option_b_label: "Inline Edit",
      option_b_image:
        "https://placehold.co/400x300/DarkSlateGray/FFFFFF?text=Inline",
      category: "Interaction",
    },
  ];

  duels.forEach((duel, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() + index);
    const dateStr = date.toISOString().split("T")[0]; // YYYY-MM-DD

    // Check if exists
    const existing = db
      .prepare("SELECT id FROM daily_duels WHERE date = ?")
      .get(dateStr);

    if (!existing) {
      const id = randomUUID();
      db.prepare(
        `
                INSERT INTO daily_duels (id, title, description, option_a_label, option_a_image, option_b_label, option_b_image, category, date)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
             `,
      ).run(
        id,
        duel.title,
        duel.description,
        duel.option_a_label,
        duel.option_a_image,
        duel.option_b_label,
        duel.option_b_image,
        duel.category,
        dateStr,
      );
      console.log(`Created duel for ${dateStr}: ${duel.title}`);
    } else {
      console.log(`Duel already exists for ${dateStr}, skipping.`);
    }
  });

  console.log("Seeding complete.");
};

seedDuels();
