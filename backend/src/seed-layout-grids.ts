import db from "./db";
import { randomUUID } from "crypto";

async function seedLayoutGrids() {
  console.log("Seeding 10 Levels of Layout & Grids Mastery...");
  
  try {
    // 1. Create Layout & Grids Topic
    const topicId = "layout-grids-001";
    
    // Check if topic exists, if not insert
    const existing = await db.get("SELECT id FROM learning_topics WHERE slug = $1", ['layout-grids']);
    if (!existing) {
      await db.run(`
        INSERT INTO learning_topics (id, title, slug, description, icon)
        VALUES ($1, $2, $3, $4, $5)
      `, [topicId, 'Layout & Grids', 'layout-grids', 'Learn to organize content with structure, balance, and rhythm using grid systems.', 'Layout']);
    } else {
      console.log("Topic 'layout-grids' already exists, updating content...");
    }

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

    // L1: Intro to Grids
    const l1 = await addLevel(1, 'NORMAL');
    await addSection(l1, 'intro', 1, 'READ', [
      { type: 'text', value: 'A grid is a skeleton for your design. It provides a series of intersecting vertical and horizontal lines that help you align and size your elements consistently.' }
    ]);
    await addQuiz(await addSection(l1, 'quiz', 2, 'TEST', {}), 'What is the primary purpose of a design grid?', ['To add decoration', 'To provide structure and alignment', 'To make the file size smaller'], 1);

    // L2: The 8pt Grid
    const l2 = await addLevel(2, 'NORMAL');
    await addSection(l2, '8pt-grid', 1, 'READ', [
      { type: 'text', value: 'The 8pt grid system uses multiples of 8 (8, 16, 24, 32...) to define dimensions, padding, and margins. This ensures consistency and makes scaling easier for developers.' }
    ]);
    await addQuiz(await addSection(l2, 'quiz', 2, 'TEST', {}), 'Why is the number 8 commonly used in grid systems?', ['It is a lucky number', 'It is easily divisible and scales well across screens', 'It is the default font size'], 1);

    // L3: Column Systems
    const l3 = await addLevel(3, 'NORMAL');
    await addSection(l3, 'columns', 1, 'READ', [
      { type: 'text', value: 'Modern web layouts often use a 12-column grid. This is because 12 is highly flexible and can be divided into halves, thirds, fourths, and sixths.' }
    ]);
    await addQuiz(await addSection(l3, 'quiz', 2, 'TEST', {}), 'How many columns are standard in a flexible desktop grid?', ['5 columns', '10 columns', '12 columns'], 2);

    // L4: Gutter & Margin
    const l4 = await addLevel(4, 'NORMAL');
    await addSection(l4, 'spacing', 1, 'READ', [
      { type: 'text', value: 'Gutters are the spaces between columns. Margins are the spaces between the edge of the grid and the edge of the screen.' }
    ]);
    await addQuiz(await addSection(l4, 'quiz', 2, 'TEST', {}), 'What is the space between two columns called?', ['Margin', 'Gutter', 'Padding'], 1);

    // L5: Layout Balance
    const l5 = await addLevel(5, 'NORMAL');
    await addSection(l5, 'balance', 1, 'READ', [
      { type: 'text', value: 'Balance can be symmetrical (mirrored) or asymmetrical. Asymmetrical balance uses different weights and sizes to create a dynamic but stable feel.' }
    ]);
    await addQuiz(await addSection(l5, 'quiz', 2, 'TEST', {}), 'What is Asymmetrical Balance?', ['Equal weight on both sides', 'Uneven weight that still feels stable', 'Randomly placed elements'], 1);

    // L6: Whitespace
    const l6 = await addLevel(6, 'MEDIUM');
    await addSection(l6, 'whitespace', 1, 'READ', [
      { type: 'text', value: 'Whitespace (or negative space) is the empty area between design elements. It reduces cognitive load and allows the content to "breathe".' }
    ]);
    await addQuiz(await addSection(l6, 'quiz', 2, 'TEST', {}), 'What is a major benefit of using whitespace?', ['It makes the design look unfinished', 'It improves focus and readability', 'It fills up the background'], 1);

    // L7: Responsive Layouts
    const l7 = await addLevel(7, 'MEDIUM');
    await addSection(l7, 'responsive', 1, 'READ', [
      { type: 'text', value: 'Responsive design uses breakpoints to change the layout based on screen size. For example, a 12-column grid might collapse to a 4-column grid on mobile.' }
    ]);
    await addQuiz(await addSection(l7, 'quiz', 2, 'TEST', {}), 'What is a "breakpoint"?', ['A point where the screen breaks', 'A specific screen width where the layout changes', 'The end of a work session'], 1);

    // L8: Rule of Thirds
    const l8 = await addLevel(8, 'MEDIUM');
    await addSection(l8, 'rule-of-thirds', 1, 'READ', [
      { type: 'text', value: 'The Rule of Thirds involves dividing your layout into a 3x3 grid. Placing key elements at the intersections creates more interest than centering them.' }
    ]);
    await addQuiz(await addSection(l8, 'quiz', 2, 'TEST', {}), 'How many sections does the Rule of Thirds divide a layout into?', ['3', '6', '9'], 2);

    // L9: Modular Grids
    const l9 = await addLevel(9, 'MEDIUM');
    await addSection(l9, 'modular', 1, 'READ', [
      { type: 'text', value: 'Modular grids add horizontal rows to vertical columns, creating "modules" or boxes. This is common in complex editorial layouts and dashboards.' }
    ]);
    await addQuiz(await addSection(l9, 'quiz', 2, 'TEST', {}), 'A Modular grid adds what to a standard column grid?', ['Horizontal rows', 'More colors', 'Larger margins'], 0);

    // L10: Final Review
    const l10 = await addLevel(10, 'HARD');
    await addSection(l10, 'review', 1, 'READ', [
      { type: 'text', value: 'You\'ve mastered Layout & Grids! You now understand how to use column systems, 8pt spacing, and balance to build professional interfaces.' }
    ]);
    await addQuiz(await addSection(l10, 'quiz', 2, 'TEST', {}), 'Which grid increment is standard for mobile touch targets?', ['8px', '44px or 48px', '100px'], 1);

    console.log("Layout & Grids levels successfully seeded!");

  } catch (error) {
    console.error("Seeding failed:", error);
  }
}

seedLayoutGrids().then(() => process.exit(0));
