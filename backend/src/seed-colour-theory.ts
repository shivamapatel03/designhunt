import db from "./db";
import { randomUUID } from "crypto";

async function seedColourTheory() {
  console.log("Seeding 10 Levels of Colour Theory Mastery...");
  
  // Enable foreign keys
  db.exec("PRAGMA foreign_keys = ON;");

  try {
    // 1. Create Colour Theory Topic
    const topicId = "colour-theory-001";
    
    // Check if topic exists, if not insert
    const existing = db.prepare("SELECT id FROM learning_topics WHERE slug = ?").get('colour-theory');
    if (!existing) {
      db.prepare(`
        INSERT INTO learning_topics (id, title, slug, description, icon)
        VALUES (?, 'Colour Theory', 'colour-theory', 'Master the science and art of using color to create impactful designs.', 'Palette')
      `).run(topicId);
    } else {
      console.log("Topic 'colour-theory' already exists, updating content...");
    }

    const addLevel = (num: number, difficulty: string) => {
      const levelId = randomUUID();
      db.prepare(`
        INSERT INTO learning_levels (id, topic_id, level_number, difficulty, [order])
        VALUES (?, ?, ?, ?, ?)
      `).run(levelId, topicId, num, difficulty, num);
      return levelId;
    };

    const addSection = (levelId: string, title: string, order: number, type: 'READ' | 'TEST', content: any) => {
      const sectionId = randomUUID();
      db.prepare(`
        INSERT INTO learning_sections (id, level_id, title, content_json, duration_mins, type, [order])
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `).run(sectionId, levelId, title, JSON.stringify(content), 5, type, order);
      return sectionId;
    };

    const addQuiz = (sectionId: string, question: string, options: string[], correctIdx: number) => {
      const quizId = randomUUID();
      db.prepare(`
        INSERT INTO learning_quizzes (id, section_id, question, options_json, correct_answer)
        VALUES (?, ?, ?, ?, ?)
      `).run(quizId, sectionId, question, JSON.stringify(options), correctIdx);
    };

    // L1: The Basics
    const l1 = addLevel(1, 'NORMAL');
    addSection(l1, 'intro', 1, 'READ', [
      { type: 'text', value: 'Colour is one of the most powerful tools in a designer\'s kit. It can influence mood, guide focus, and define a brand. All colours start with the three primary colours: Red, Yellow, and Blue.' }
    ]);
    addQuiz(addSection(l1, 'quiz', 2, 'TEST', {}), 'What are the three primary colours in the traditional RYB model?', ['Red, Green, Blue', 'Red, Yellow, Blue', 'Cyan, Magenta, Yellow'], 1);

    // L2: Secondary & Tertiary
    const l2 = addLevel(2, 'NORMAL');
    addSection(l2, 'mixing', 1, 'READ', [
      { type: 'text', value: 'Mixing two primary colours creates a Secondary colour (Orange, Green, Purple). Mixing a primary with a secondary creates a Tertiary colour.' }
    ]);
    addQuiz(addSection(l2, 'quiz', 2, 'TEST', {}), 'Which of these is a secondary colour?', ['Red', 'Purple', 'Teal'], 1);

    // L3: Monochromatic & Complementary
    const l3 = addLevel(3, 'NORMAL');
    addSection(l3, 'schemes-basic', 1, 'READ', [
      { type: 'text', value: 'A Monochromatic scheme uses different shades of one colour. A Complementary scheme uses colours opposite each other on the wheel for high contrast.' }
    ]);
    addQuiz(addSection(l3, 'quiz', 2, 'TEST', {}), 'Which color scheme is known for having the highest contrast?', ['Monochromatic', 'Complementary', 'Analogous'], 1);

    // L4: Analogous & Triadic
    const l4 = addLevel(4, 'NORMAL');
    addSection(l4, 'schemes-adv', 1, 'READ', [
      { type: 'text', value: 'Analogous colours sit next to each other on the wheel, creating harmony. Triadic schemes use three colours evenly spaced, offering balance and vibrancy.' }
    ]);
    addQuiz(addSection(l4, 'quiz', 2, 'TEST', {}), 'What do you call colours that are side-by-side on the color wheel?', ['Complementary', 'Analogous', 'Split-Complementary'], 1);

    // L5: Hue, Saturation, Lightness
    const l5 = addLevel(5, 'NORMAL');
    addSection(l5, 'hsl', 1, 'READ', [
      { type: 'text', value: 'Hue is the color itself. Saturation is the intensity or "vibrancy." Lightness (Value) is how light or dark the color is.' }
    ]);
    addQuiz(addSection(l5, 'quiz', 2, 'TEST', {}), 'Which property refers to the purity or intensity of a color?', ['Hue', 'Saturation', 'Lightness'], 1);

    // L6: RGB vs CMYK
    const l6 = addLevel(6, 'MEDIUM');
    addSection(l6, 'color-models', 1, 'READ', [
      { type: 'text', value: 'RGB (Red, Green, Blue) is additive and used for digital screens. CMYK (Cyan, Magenta, Yellow, Key/Black) is subtractive and used for print.' }
    ]);
    addQuiz(addSection(l6, 'quiz', 2, 'TEST', {}), 'Which color model should be used for designing a website?', ['CMYK', 'RGB', 'Pantone'], 1);

    // L7: Color Psychology
    const l7 = addLevel(7, 'NORMAL');
    addSection(l7, 'psychology', 1, 'READ', [
      { type: 'text', value: 'Colors evoke feelings. Blue often represents trust and calm, while Red can signal energy, passion, or danger.' }
    ]);
    addQuiz(addSection(l7, 'quiz', 2, 'TEST', {}), 'Which color is most commonly associated with trust and stability?', ['Yellow', 'Blue', 'Orange'], 1);

    // L8: Accessibility & Contrast
    const l8 = addLevel(8, 'MEDIUM');
    addSection(l8, 'accessibility', 1, 'READ', [
      { type: 'text', value: 'Designing for everyone means ensuring high contrast for readability. WCAG standards suggest a minimum contrast ratio of 4.5:1 for normal text.' }
    ]);
    addQuiz(addSection(l8, 'quiz', 2, 'TEST', {}), 'What is the recommended minimum contrast ratio for normal text (WCAG AA)?', ['2.0:1', '4.5:1', '7.0:1'], 1);

    // L9: Color in UI Design
    const l9 = addLevel(9, 'MEDIUM');
    addSection(l9, 'ui-color', 1, 'READ', [
      { type: 'text', value: 'In UI, color is functional. Red is for errors, Green for success, and Blue is often the primary action color. Use the 60-30-10 rule for balanced palettes.' }
    ]);
    addQuiz(addSection(l9, 'quiz', 2, 'TEST', {}), 'In the 60-30-10 rule, what does the "10" represent?', ['Primary color', 'Accent color', 'Background color'], 1);

    // L10: Final Review
    const l10 = addLevel(10, 'HARD');
    addSection(l10, 'review', 1, 'READ', [
      { type: 'text', value: 'You\'ve completed the Colour Theory mastery! You now understand color mixing, schemes, psychology, and technical accessibility.' }
    ]);
    addQuiz(addSection(l10, 'quiz', 2, 'TEST', {}), 'A "tint" of a color is created by adding:', ['Black', 'White', 'Gray'], 1);

    console.log("Colour Theory levels successfully seeded!");

  } catch (error) {
    console.error("Seeding failed:", error);
  }
}

seedColourTheory();
