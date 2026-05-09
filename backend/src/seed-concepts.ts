import db from "./db";

const concepts = [
  {
    id: "concept-1",
    term: "Kerning",
    slug: "kerning",
    definition: "The spacing between individual characters.",
    content:
      "Kerning adjusts the space between individual letter forms. Unlike tracking (which adjusts spacing uniformly), kerning is about the specific relationship between two letters.",
    category: "Typography",
    widget_type: "kerning-slider",
    visual_example: "https://example.com/kerning.png",
  },
  {
    id: "concept-2",
    term: "Color Theory",
    slug: "color-theory",
    definition:
      "Practical guidance to color mixing and the visual effects of a specific color combination.",
    content:
      "Color theory is a body of practical guidance to color mixing and the visual effects of a specific color combination. It encompasses the color wheel, color harmony, and the context of how colors are used.",
    category: "Color",
    widget_type: "color-mixer",
    visual_example: "https://example.com/color-wheel.png",
  },
  {
    id: "concept-3",
    term: "Golden Ratio",
    slug: "golden-ratio",
    definition:
      "A mathematical ratio commonly found in nature and design, approximately equal to 1.618.",
    content:
      "The Golden Ratio is a mathematical ratio. It is commonly found in nature, and when used in a design, it fosters organic and natural-looking compositions that are aesthetically pleasing to the eye.",
    category: "Layout",
    widget_type: "standard",
    visual_example: "https://example.com/golden-ratio.png",
  },
];

async function seedConcepts() {
  console.log("🌱 Seeding Concepts...");

  try {
    // Re-create table to ensure schema update
    await db.exec("DROP TABLE IF EXISTS concepts");
    await db.exec(`
      CREATE TABLE IF NOT EXISTS concepts (
        id TEXT PRIMARY KEY,
        term TEXT UNIQUE NOT NULL,
        slug TEXT UNIQUE NOT NULL,
        definition TEXT NOT NULL,
        content TEXT,
        category TEXT,
        widget_type TEXT DEFAULT 'standard',
        visual_example TEXT,
        related_lesson_id TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    for (const concept of concepts) {
      await db.run(`
        INSERT INTO concepts (id, term, slug, definition, content, category, widget_type, visual_example)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      `, [
        concept.id,
        concept.term,
        concept.slug,
        concept.definition,
        concept.content,
        concept.category,
        concept.widget_type,
        concept.visual_example
      ]);
    }

    console.log("✅ Concepts seeded successfully!");
  } catch (error) {
    console.error("Seeding failed:", error);
  }
}

seedConcepts().then(() => process.exit(0));
