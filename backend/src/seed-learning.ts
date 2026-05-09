import db from "./db";
import { randomUUID } from "crypto";

async function seedLearning() {
  console.log("Seeding 50 Levels of Typography Mastery (Full Reset)...");
  
  try {
    // Total reset to avoid foreign key violations
    await db.run("DELETE FROM learning_progress");
    await db.run("DELETE FROM learning_bookmarks");
    await db.run("DELETE FROM learning_saves");
    await db.run("DELETE FROM learning_topics");
    // (Levels, sections, and quizzes will cascade delete from topics if configured, 
    // but in our schema we might need to delete them manually or trust cascade)

    console.log("Existing data cleared.");

    // 1. Create Typography Topic
    const topicId = "typography-mastery-001";
    await db.run(`
      INSERT INTO learning_topics (id, title, slug, description, icon)
      VALUES ($1, 'Typography', 'typography', 'Master the art of arranging type to make it readable, clear, and visually appealing.', 'Type')
    `, [topicId]);

    const addLevel = async (num: number, difficulty: string) => {
      const levelId = randomUUID();
      await db.run(`
        INSERT INTO learning_levels (id, topic_id, level_number, difficulty, "order")
        VALUES ($1, $2, $3, $4, $5)
      `, [levelId, topicId, num, difficulty, num]);
      return levelId;
    };

    const addSection = async (levelId: string, title: string, order: number, type: 'READ' | 'TEST', content: any) => {
      const sectionId = randomUUID();
      await db.run(`
        INSERT INTO learning_sections (id, level_id, title, content_json, duration_mins, type, "order")
        VALUES ($1, $2, $3, $4, $5, $6, $7)
      `, [sectionId, levelId, title, JSON.stringify(content), 5, type, order]);
      return sectionId;
    };

    const addQuiz = async (sectionId: string, question: string, options: string[], correctIdx: number) => {
      const quizId = randomUUID();
      await db.run(`
        INSERT INTO learning_quizzes (id, section_id, question, options_json, correct_answer)
        VALUES ($1, $2, $3, $4, $5)
      `, [quizId, sectionId, question, JSON.stringify(options), correctIdx]);
    };

    // --- TIER 1: THE FOUNDATIONS (1-12) ---
    
    // L1: Intro
    const l1 = await addLevel(1, 'NORMAL');
    await addSection(l1, 'intro', 1, 'READ', [
      { type: 'text', value: 'Welcome to Typography Mastery. Type is the voice of the written word. In this course, you will learn to speak clearly and powerfully.' },
      { type: 'interactive-lego', value: 'font-weight-slider', label: 'Feel the Weight' }
    ]);
    await addQuiz(await addSection(l1, 'quiz', 2, 'TEST', {}), 'What is the primary role of typography?', ['Decoration', 'Visual Communication', 'Filling space'], 1);

    // L2: Anatomy
    const l2 = await addLevel(2, 'NORMAL');
    await addSection(l2, 'anatomy', 1, 'READ', [
      { type: 'text', value: 'Letters have structures. The baseline is the invisible floor, and the x-height defines the body of lowercase letters.' }
    ]);
    await addQuiz(await addSection(l2, 'quiz', 2, 'TEST', {}), 'What defines the height of lowercase letters?', ['Ascender', 'Cap height', 'X-height'], 2);

    // L3: Categories
    const l3 = await addLevel(3, 'NORMAL');
    await addSection(l3, 'serif-vs-sans', 1, 'READ', [
      { type: 'text', value: 'Serifs are small strokes at the ends of letterforms. Sans-serif means "without" these strokes.' }
    ]);
    await addQuiz(await addSection(l3, 'quiz', 2, 'TEST', {}), 'Which style is generally considered more "modern"?', ['Serif', 'Sans-Serif', 'Script'], 1);

    // L4: Point System
    const l4 = await addLevel(4, 'NORMAL');
    await addSection(l4, 'measurements', 1, 'READ', [
      { type: 'text', value: 'Type is measured in points (pt). There are 72 points in one inch.' }
    ]);
    await addQuiz(await addSection(l4, 'quiz', 2, 'TEST', {}), 'How many points are in an inch?', ['12', '72', '100'], 1);

    // L5: Leading
    const l5 = await addLevel(5, 'NORMAL');
    await addSection(l5, 'leading', 1, 'READ', [
      { type: 'text', value: 'Leading is vertical spacing. Tight leading speeds up reading but reduces comfort.' },
      { type: 'interactive-lego', value: 'line-height-slider', label: 'Adjust Leading' }
    ]);
    await addQuiz(await addSection(l5, 'quiz', 2, 'TEST', {}), 'What is leading named after?', ['Metal strips of lead', 'Leader of the pack', 'Light'], 0);

    // L6: Tracking
    const l6 = await addLevel(6, 'NORMAL');
    await addSection(l6, 'tracking', 1, 'READ', [
      { type: 'text', value: 'Tracking adjusts overall letter spacing across a block. High tracking can feel airy and premium.' },
      { type: 'interactive-lego', value: 'tracking-visualizer', label: 'Precision Tracking' }
    ]);
    await addQuiz(await addSection(l6, 'quiz', 2, 'TEST', {}), 'High tracking is best for:', ['Small body text', 'All-caps headings', 'Footnotes'], 1);

    // L7: Alignment
    const l7 = await addLevel(7, 'NORMAL');
    await addSection(l7, 'alignment', 1, 'READ', [
      { type: 'text', value: 'Alignment defines the "rag" or the uneven edge of text. Left-aligned is the most readable for long-form content.' }
    ]);
    await addQuiz(await addSection(l7, 'quiz', 2, 'TEST', {}), 'Why is Left-Aligned usually preferred?', ['Consistent starting point', 'It looks fancy', 'Saves space'], 0);

    // L8: Visual Hierarchy
    const l8 = await addLevel(8, 'NORMAL');
    await addSection(l8, 'hierarchy', 1, 'READ', [
      { type: 'text', value: 'Scale and weight create a path for the user\'s eyes. Rank information from most to least important.' },
      { type: 'interactive-lego', value: 'hierarchy-toggle', label: 'Fix Hierarchy' }
    ]);
    await addQuiz(await addSection(l8, 'quiz', 2, 'TEST', {}), 'Primary way to create hierarchy?', ['Size and weight contrast', 'Alphabetical order', 'Random colors'], 0);

    // L9: Contrast
    const l9 = await addLevel(9, 'NORMAL');
    await addSection(l9, 'contrast', 1, 'READ', [
      { type: 'text', value: 'Contrast ensures readability. Accessibility depends on the luminance difference between text and background.' },
      { type: 'interactive-lego', value: 'contrast-checker', label: 'Test Contrast' }
    ]);
    await addQuiz(await addSection(l9, 'quiz', 2, 'TEST', {}), 'Minimal AA contrast ratio for normal text?', ['2:1', '4.5:1', '7:1'], 1);

    // L10: Psychology
    const l10 = await addLevel(10, 'NORMAL');
    await addSection(l10, 'mood', 1, 'READ', [
      { type: 'text', value: 'Fonts evoke emotions. A sharp serif feels established and trustworthy; a rounded sans feels friendly.' }
    ]);
    await addQuiz(await addSection(l10, 'quiz', 2, 'TEST', {}), 'Feeling of a Slab Serif?', ['Delicate', 'Sturdy and Strong', 'Handwritten'], 1);

    // L11: Type Combinations
    const l11 = await addLevel(11, 'NORMAL');
    await addSection(l11, 'pairing', 1, 'READ', [
      { type: 'text', value: 'Avoid conflict by choosing fonts that are either similar (discord) or very different (contrast). Avoid the "slightly different" trap.' }
    ]);
    await addQuiz(await addSection(l11, 'quiz', 2, 'TEST', {}), 'Best rule for pairing?', ['Pick two serifs', 'Mix personalities', 'Use random fonts'], 1);

    // L12: Tier 1 Review
    const l12 = await addLevel(12, 'NORMAL');
    await addSection(l12, 'review', 1, 'READ', [
      { type: 'text', value: 'You have mastered the foundations: hierarchy, leading, tracking, and contrast. Now we enter Tier 2: The Architect, where we focus on tech and math.' }
    ]);
    await addQuiz(await addSection(l12, 'quiz', 2, 'TEST', {}), 'Which property controls the space between letters across a whole block?', ['Kerning', 'Tracking', 'Leading'], 1);

    // --- TIER 2: THE ARCHITECT (13-25) ---

    // L13: The Type Scale
    const l13 = await addLevel(13, 'MEDIUM');
    await addSection(l13, 'type-scales', 1, 'READ', [
      { type: 'text', value: 'A type scale is a system of font sizes that follow a specific ratio (like 1.25). Using a scale ensures visual harmony across different screens.' }
    ]);
    await addQuiz(await addSection(l13, 'quiz', 2, 'TEST', {}), 'Why use a ratio-based type scale?', ['Mathematical harmony', 'It saves memory', 'Because clients like it'], 0);

    // L14: Fluid Typography
    const l14 = await addLevel(14, 'MEDIUM');
    await addSection(l14, 'fluid-type', 1, 'READ', [
      { type: 'text', value: 'Fluid typography uses the CSS clamp() function to scale text smoothly between a minimum and maximum size based on the viewport width.' },
      { type: 'interactive-lego', value: 'fluid-scale-interactive', label: 'Viewport Simulator' }
    ]);
    await addQuiz(await addSection(l14, 'quiz', 2, 'TEST', {}), 'What CSS function is used for fluid type?', ['calc()', 'var()', 'clamp()'], 2);

    // L15: Vertical Rhythm
    const l15 = await addLevel(15, 'MEDIUM');
    await addSection(l15, 'vertical-rhythm', 1, 'READ', [
      { type: 'text', value: 'Vertical rhythm is the consistency of vertical spacing between elements. Using a baseline grid (usually 4px or 8px) creates a stable structure.' },
      { type: 'interactive-lego', value: 'baseline-grid-visualizer', label: 'Grid Inspector' }
    ]);
    await addQuiz(await addSection(l15, 'quiz', 2, 'TEST', {}), 'Standard baseline grid increment for web?', ['5px', '8px', '20px'], 1);

    // L16: Variable Fonts
    const l16 = await addLevel(16, 'MEDIUM');
    await addSection(l16, 'variable-fonts', 1, 'READ', [
      { type: 'text', value: 'Variable fonts (OTF/TTF-VF) allow a single font file to behave like multiple weights, widths, and styles through mathematical interpolation.' }
    ]);
    await addQuiz(await addSection(l16, 'quiz', 2, 'TEST', {}), 'What is the main advantage of variable fonts?', ['Performance (one file)', 'More colors', 'Easier to install'], 0);

    // L17: OpenType Features
    const l17 = await addLevel(17, 'MEDIUM');
    await addSection(l17, 'opentype', 1, 'READ', [
      { type: 'text', value: 'OpenType features allow for advanced typographic effects like ligatures (joining characters), stylistic alternates, and tabular figures.' },
      { type: 'interactive-lego', value: 'opentype-feature-toggle', label: 'Feature Tester' }
    ]);
    await addQuiz(await addSection(l17, 'quiz', 2, 'TEST', {}), 'What does a "ligature" do?', ['Joins two letters', 'Changes font color', 'Scales the text'], 0);

    // L18: Micro-Typography
    const l18 = await addLevel(18, 'MEDIUM');
    await addSection(l18, 'micro-type', 1, 'READ', [
      { type: 'text', value: 'Micro-typography focuses on the finest details: kerning pairs (spacing between specific letter pairs like "AV"), hanging punctuation, and optical corrections.' }
    ]);
    await addQuiz(await addSection(l18, 'quiz', 2, 'TEST', {}), 'Definition of Kerning?', ['Spacing between all letters', 'Spacing between two specific letters', 'Spacing between lines'], 1);

    // L19: The Golden Ratio
    const l19 = await addLevel(19, 'MEDIUM');
    await addSection(l19, 'golden-ratio', 1, 'READ', [
      { type: 'text', value: 'The Golden Ratio (1.618) is often used to calculate font sizes and line heights for "perfect" proportions that feel natural to the human eye.' }
    ]);
    await addQuiz(await addSection(l19, 'quiz', 2, 'TEST', {}), 'Numerical value of the Golden Ratio?', ['1.250', '1.618', '3.141'], 1);

    // L20: Wayfinding
    const l20 = await addLevel(20, 'MEDIUM');
    await addSection(l20, 'wayfinding', 1, 'READ', [
      { type: 'text', value: 'Typography in interface design acts as wayfinding. Large headers act as "landmarks" to help users understand their location in the app.' }
    ]);
    await addQuiz(await addSection(l20, 'quiz', 2, 'TEST', {}), 'Role of wayfinding type?', ['To distract users', 'To guide users through content', 'To save space'], 1);

    // L21: Columnar Math
    const l21 = await addLevel(21, 'MEDIUM');
    await addSection(l21, 'line-length', 1, 'READ', [
      { type: 'text', value: 'The Ideal Line Length (Measure) for desktop body text is typically between 45 to 75 characters. Too short feels choppy; too long is tiring.' }
    ]);
    await addQuiz(await addSection(l21, 'quiz', 2, 'TEST', {}), 'Ideal char count per line?', ['10-20', '45-75', '120-150'], 1);

    // L22: Rendering Tech
    const l22 = await addLevel(22, 'MEDIUM');
    await addSection(l22, 'rendering', 1, 'READ', [
      { type: 'text', value: 'Rendering refers to how pixels are used to draw type on screen. "Hinting" is a technique that aligns font paths with the pixel grid for sharpness.' }
    ]);
    await addQuiz(await addSection(l22, 'quiz', 2, 'TEST', {}), 'What is font hinting?', ['Adding advice', 'Pixel-grid alignment', 'Naming the font'], 1);

    // L23: Global Typography
    const l23 = await addLevel(23, 'MEDIUM');
    await addSection(l23, 'global-type', 1, 'READ', [
      { type: 'text', value: 'Designing for the world means considering RTL (Right-to-Left) scripts and ensuring diacritics (accents) don\'t overflow with tight line heights.' }
    ]);
    await addQuiz(await addSection(l23, 'quiz', 2, 'TEST', {}), 'Typical flow of Hebrew text?', ['Left to Right', 'Right to Left', 'Top to Bottom'], 1);

    // L24: Typography Audits
    const l24 = await addLevel(24, 'MEDIUM');
    await addSection(l24, 'audits', 1, 'READ', [
      { type: 'text', value: 'A typography audit checks for consistency across a product. It helps identify "design debt" like orphaned sizes or duplicate font families.' }
    ]);
    await addQuiz(await addSection(l24, 'quiz', 2, 'TEST', {}), 'Goal of a Typography Audit?', ['Find inconsistency', 'Buy more fonts', 'Increase font sizes'], 0);

    // L25: The Architect Finale
    const l25 = await addLevel(25, 'MEDIUM');
    await addSection(l25, 'mastery', 1, 'READ', [
      { type: 'text', value: 'Congratulations! You have mastered the technical side of typography. You are now an Architect of Type. Ready for the final exam?' }
    ]);
    await addQuiz(await addSection(l25, 'quiz', 2, 'TEST', {}), 'What combines size, weight, and hierarchy?', ['Contrast', 'Typography', 'Color'], 1);


    console.log("25 Levels successfully seeded!");

  } catch (error) {
    console.error("Seeding failed:", error);
  }
}

seedLearning().then(() => process.exit(0));
