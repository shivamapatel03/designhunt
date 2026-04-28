import db from "./db";
import { randomUUID } from "crypto";

async function seedVisualHierarchy() {
  console.log("Seeding 15 Levels of Visual Hierarchy Mastery...");
  
  // Enable foreign keys
  db.exec("PRAGMA foreign_keys = ON;");

  try {
    // 1. Create Visual Hierarchy Topic
    const topicId = "visual-hierarchy-001";
    
    // Check if topic exists, if not insert
    const existing = db.prepare("SELECT id FROM learning_topics WHERE slug = ?").get('visual-hierarchy');
    if (!existing) {
      db.prepare(`
        INSERT INTO learning_topics (id, title, slug, description, icon)
        VALUES (?, 'Visual Hierarchy', 'visual-hierarchy', 'Master the arrangement of elements to imply importance and guide the user through your interface.', 'Layers')
      `).run(topicId);
    } else {
      console.log("Topic 'visual-hierarchy' already exists, updating content...");
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

    // L1: Intro
    const l1 = addLevel(1, 'NORMAL');
    addSection(l1, 'intro', 1, 'READ', [{ type: 'text', value: 'Visual hierarchy is the order in which the human eye perceives what it sees. It helps users process information by highlighting what is most important.' }]);
    addQuiz(addSection(l1, 'quiz', 2, 'TEST', {}), 'What is the main goal of visual hierarchy?', ['To make things look pretty', 'To guide the user to the most important info', 'To use as many colors as possible'], 1);

    // L2: Size & Scale
    const l2 = addLevel(2, 'NORMAL');
    addSection(l2, 'size', 1, 'READ', [{ type: 'text', value: 'The bigger an element is, the more attention it grabs. Large headings immediately signal to the user where a new section starts.' }]);
    addQuiz(addSection(l2, 'quiz', 2, 'TEST', {}), 'How does size affect importance?', ['Smaller elements are more important', 'Larger elements are perceived as more important', 'Size has no effect'], 1);

    // L3: Color & Contrast
    const l3 = addLevel(3, 'NORMAL');
    addSection(l3, 'contrast', 1, 'READ', [{ type: 'text', value: 'Bold colors and high contrast create focal points. A bright button on a neutral background is a classic way to draw the eye to a Call to Action.' }]);
    addQuiz(addSection(l3, 'quiz', 2, 'TEST', {}), 'Why use high contrast for a button?', ['To hide it from users', 'To make it stand out as a primary action', 'To save on ink'], 1);

    // L4: Typography Hierarchy
    const l4 = addLevel(4, 'NORMAL');
    addSection(l4, 'typo-hierarchy', 1, 'READ', [{ type: 'text', value: 'Using different weights (Bold, Regular, Light) and sizes for text creates a clear path. H1 > H2 > Body text is the standard structure.' }]);
    addQuiz(addSection(l4, 'quiz', 2, 'TEST', {}), 'Which heading should be the largest?', ['H1', 'H3', 'Body'], 0);

    // L5: Proximity
    const l5 = addLevel(5, 'NORMAL');
    addSection(l5, 'proximity', 1, 'READ', [{ type: 'text', value: 'Elements that are close together are perceived as related. This is the Law of Proximity in Gestalt principles.' }]);
    addQuiz(addSection(l5, 'quiz', 2, 'TEST', {}), 'What does proximity help with?', ['Separating unrelated items', 'Grouping related information', 'Changing colors'], 1);

    // L6: Whitespace
    const l6 = addLevel(6, 'NORMAL');
    addSection(l6, 'whitespace', 1, 'READ', [{ type: 'text', value: 'Giving an element space isolates it, making it stand out more. Whitespace is a powerful tool for emphasis and clarity.' }]);
    addQuiz(addSection(l6, 'quiz', 2, 'TEST', {}), 'What happens when you add whitespace around an object?', ['It becomes less visible', 'It becomes more emphasized', 'It disappears'], 1);

    // L7: Alignment
    const l7 = addLevel(7, 'NORMAL');
    addSection(l7, 'alignment', 1, 'READ', [{ type: 'text', value: 'Alignment creates a visual line that the eye follows. Consistent alignment makes a layout feel organized and easier to scan.' }]);
    addQuiz(addSection(l7, 'quiz', 2, 'TEST', {}), 'What does consistent alignment provide?', ['Chaos', 'Visual stability and order', 'Randomness'], 1);

    // L8: Texture & Style
    const l8 = addLevel(8, 'MEDIUM');
    addSection(l8, 'texture', 1, 'READ', [{ type: 'text', value: 'Adding texture or a distinct style (like a drop shadow or gradient) can elevate an element above others in the hierarchy.' }]);
    addQuiz(addSection(l8, 'quiz', 2, 'TEST', {}), 'Can style be used to create hierarchy?', ['No', 'Yes, by making elements look unique', 'Only for background colors'], 1);

    // L9: Repetition
    const l9 = addLevel(9, 'MEDIUM');
    addSection(l9, 'repetition', 1, 'READ', [{ type: 'text', value: 'Repeating styles (like the same icon style for all menu items) creates a pattern. Breaking that pattern immediately draws attention.' }]);
    addQuiz(addSection(l9, 'quiz', 2, 'TEST', {}), 'How can repetition help focus?', ['By being boring', 'By setting a pattern that can be broken for emphasis', 'By removing all text'], 1);

    // L10: F-Pattern
    const l10 = addLevel(10, 'MEDIUM');
    addSection(l10, 'f-pattern', 1, 'READ', [{ type: 'text', value: 'Users often scan text-heavy pages in an "F" shape: across the top, then down, then across a shorter distance.' }]);
    addQuiz(addSection(l10, 'quiz', 2, 'TEST', {}), 'Where do users look first in an F-Pattern?', ['Bottom right', 'Top left', 'The center'], 1);

    // L11: Z-Pattern
    const l11 = addLevel(11, 'MEDIUM');
    addSection(l11, 'z-pattern', 1, 'READ', [{ type: 'text', value: 'For pages with less text, users often follow a "Z" shape: Top-left to top-right, then diagonally down to bottom-left, then across to bottom-right.' }]);
    addQuiz(addSection(l11, 'quiz', 2, 'TEST', {}), 'Z-Pattern is most common for:', ['Blogs', 'Landing pages with images', 'Books'], 1);

    // L12: Focal Points
    const l12 = addLevel(12, 'MEDIUM');
    addSection(l12, 'focal-points', 1, 'READ', [{ type: 'text', value: 'A focal point is the specific area of interest that captures the user\'s attention first. Every screen should have one clear primary focal point.' }]);
    addQuiz(addSection(l12, 'quiz', 2, 'TEST', {}), 'How many primary focal points should a screen have?', ['One', 'Ten', 'Zero'], 0);

    // L13: Visual Anchor
    const l13 = addLevel(13, 'HARD');
    addSection(l13, 'anchors', 1, 'READ', [{ type: 'text', value: 'An anchor is a large or high-contrast element that grounds the design and provides a starting point for the user\'s eye.' }]);
    addQuiz(addSection(l13, 'quiz', 2, 'TEST', {}), 'What does a visual anchor do?', ['Weights down the file size', 'Grounds the design and provides a starting point', 'Changes the font size'], 1);

    // L14: Depth & Layers
    const l14 = addLevel(14, 'HARD');
    addSection(l14, 'depth', 1, 'READ', [{ type: 'text', value: 'Using shadows, blur, and layering (Z-index) creates depth. Elements that appear "closer" to the user are perceived as more important.' }]);
    addQuiz(addSection(l14, 'quiz', 2, 'TEST', {}), 'How does depth affect hierarchy?', ['Closer objects are more important', 'Further objects are more important', 'Depth doesn\'t matter'], 0);

    // L15: Final Review
    const l15 = addLevel(15, 'HARD');
    addSection(l15, 'review', 1, 'READ', [{ type: 'text', value: 'You\'ve completed Visual Hierarchy! You now know how to guide users through an interface using size, color, space, and patterns.' }]);
    addQuiz(addSection(l15, 'quiz', 2, 'TEST', {}), 'Visual hierarchy is primarily about:', ['Decoration', 'Information Architecture and Communication', 'Coding speed'], 1);

    console.log("Visual Hierarchy levels successfully seeded!");

  } catch (error) {
    console.error("Seeding failed:", error);
  }
}

seedVisualHierarchy();
