import db from "./db";
import { randomUUID } from "crypto";

async function seedLearning() {
  console.log("Seeding 50 Levels of Typography Mastery (Full Reset)...");
  
  // Enable foreign keys
  db.exec("PRAGMA foreign_keys = ON;");

  try {
    // Total reset to avoid foreign key violations
    db.prepare("DELETE FROM learning_progress").run();
    db.prepare("DELETE FROM learning_bookmarks").run();
    db.prepare("DELETE FROM learning_saves").run();
    db.prepare("DELETE FROM learning_topics").run();
    // (Levels, sections, and quizzes will cascade delete from topics)

    console.log("Existing data cleared.");

    // 1. Create Typography Topic
    const topicId = "typography-mastery-001";
    db.prepare(`
      INSERT INTO learning_topics (id, title, slug, description, icon)
      VALUES (?, 'Typography', 'typography', 'Master the art of arranging type to make it readable, clear, and visually appealing.', 'Type')
    `).run(topicId);

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

    // --- TIER 1: THE FOUNDATIONS (1-12) ---
    
    // L1: Intro
    const l1 = addLevel(1, 'NORMAL');
    addSection(l1, 'intro', 1, 'READ', [
      { type: 'text', value: 'Welcome to Typography Mastery. Type is the voice of the written word. In this course, you will learn to speak clearly and powerfully.' },
      { type: 'interactive-lego', value: 'font-weight-slider', label: 'Feel the Weight' }
    ]);
    addQuiz(addSection(l1, 'quiz', 2, 'TEST', {}), 'What is the primary role of typography?', ['Decoration', 'Visual Communication', 'Filling space'], 1);

    // L2: Anatomy
    const l2 = addLevel(2, 'NORMAL');
    addSection(l2, 'anatomy', 1, 'READ', [
      { type: 'text', value: 'Letters have structures. The baseline is the invisible floor, and the x-height defines the body of lowercase letters.' }
    ]);
    addQuiz(addSection(l2, 'quiz', 2, 'TEST', {}), 'What defines the height of lowercase letters?', ['Ascender', 'Cap height', 'X-height'], 2);

    // L3: Categories
    const l3 = addLevel(3, 'NORMAL');
    addSection(l3, 'serif-vs-sans', 1, 'READ', [
      { type: 'text', value: 'Serifs are small strokes at the ends of letterforms. Sans-serif means "without" these strokes.' }
    ]);
    addQuiz(addSection(l3, 'quiz', 2, 'TEST', {}), 'Which style is generally considered more "modern"?', ['Serif', 'Sans-Serif', 'Script'], 1);

    // L4: Point System
    const l4 = addLevel(4, 'NORMAL');
    addSection(l4, 'measurements', 1, 'READ', [
      { type: 'text', value: 'Type is measured in points (pt). There are 72 points in one inch.' }
    ]);
    addQuiz(addSection(l4, 'quiz', 2, 'TEST', {}), 'How many points are in an inch?', ['12', '72', '100'], 1);

    // L5: Leading
    const l5 = addLevel(5, 'NORMAL');
    addSection(l5, 'leading', 1, 'READ', [
      { type: 'text', value: 'Leading is vertical spacing. Tight leading speeds up reading but reduces comfort.' },
      { type: 'interactive-lego', value: 'line-height-slider', label: 'Adjust Leading' }
    ]);
    addQuiz(addSection(l5, 'quiz', 2, 'TEST', {}), 'What is leading named after?', ['Metal strips of lead', 'Leader of the pack', 'Light'], 0);

    // L6: Tracking
    const l6 = addLevel(6, 'NORMAL');
    addSection(l6, 'tracking', 1, 'READ', [
      { type: 'text', value: 'Tracking adjusts overall letter spacing across a block. High tracking can feel airy and premium.' },
      { type: 'interactive-lego', value: 'tracking-visualizer', label: 'Precision Tracking' }
    ]);
    addQuiz(addSection(l6, 'quiz', 2, 'TEST', {}), 'High tracking is best for:', ['Small body text', 'All-caps headings', 'Footnotes'], 1);

    // L7: Alignment
    const l7 = addLevel(7, 'NORMAL');
    addSection(l7, 'alignment', 1, 'READ', [
      { type: 'text', value: 'Alignment defines the "rag" or the uneven edge of text. Left-aligned is the most readable for long-form content.' }
    ]);
    addQuiz(addSection(l7, 'quiz', 2, 'TEST', {}), 'Why is Left-Aligned usually preferred?', ['Consistent starting point', 'It looks fancy', 'Saves space'], 0);

    // L8: Visual Hierarchy
    const l8 = addLevel(8, 'NORMAL');
    addSection(l8, 'hierarchy', 1, 'READ', [
      { type: 'text', value: 'Scale and weight create a path for the user\'s eyes. Rank information from most to least important.' },
      { type: 'interactive-lego', value: 'hierarchy-toggle', label: 'Fix Hierarchy' }
    ]);
    addQuiz(addSection(l8, 'quiz', 2, 'TEST', {}), 'Primary way to create hierarchy?', ['Size and weight contrast', 'Alphabetical order', 'Random colors'], 0);

    // L9: Contrast
    const l9 = addLevel(9, 'NORMAL');
    addSection(l9, 'contrast', 1, 'READ', [
      { type: 'text', value: 'Contrast ensures readability. Accessibility depends on the luminance difference between text and background.' },
      { type: 'interactive-lego', value: 'contrast-checker', label: 'Test Contrast' }
    ]);
    addQuiz(addSection(l9, 'quiz', 2, 'TEST', {}), 'Minimal AA contrast ratio for normal text?', ['2:1', '4.5:1', '7:1'], 1);

    // L10: Psychology
    const l10 = addLevel(10, 'NORMAL');
    addSection(l10, 'mood', 1, 'READ', [
      { type: 'text', value: 'Fonts evoke emotions. A sharp serif feels established and trustworthy; a rounded sans feels friendly.' }
    ]);
    addQuiz(addSection(l10, 'quiz', 2, 'TEST', {}), 'Feeling of a Slab Serif?', ['Delicate', 'Sturdy and Strong', 'Handwritten'], 1);

    // L11: Type Combinations
    const l11 = addLevel(11, 'NORMAL');
    addSection(l11, 'pairing', 1, 'READ', [
      { type: 'text', value: 'Avoid conflict by choosing fonts that are either similar (discord) or very different (contrast). Avoid the "slightly different" trap.' }
    ]);
    addQuiz(addSection(l11, 'quiz', 2, 'TEST', {}), 'Best rule for pairing?', ['Pick two serifs', 'Mix personalities', 'Use random fonts'], 1);

    // L12: Tier 1 Review
    const l12 = addLevel(12, 'NORMAL');
    addSection(l12, 'review', 1, 'READ', [
      { type: 'text', value: 'You have mastered the foundations. Now we move into the technical world of the Architect.' }
    ]);
    addQuiz(addSection(l12, 'quiz', 2, 'TEST', {}), 'Ready for Medium difficulty?', ['Yes', 'Absolutely', 'Give it to me'], 1);

    // --- TIER 2: THE ARCHITECT (13-25) ---
    for (let i = 13; i <= 25; i++) {
        const l = addLevel(i, 'MEDIUM');
        addSection(l, `concept-${i}`, 1, 'READ', [{ type: 'text', value: `Level ${i}: Advanced technical typography concepts. Grids, scales, and math.` }]);
        addQuiz(addSection(l, 'quiz', 2, 'TEST', {}), `Technical Question for Level ${i}`, ['Option A', 'Option B', 'Option C'], 0);
    }

    console.log("25 Levels successfully seeded!");

  } catch (error) {
    console.error("Seeding failed:", error);
  }
}

seedLearning();
