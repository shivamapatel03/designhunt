import db from "./db";
import { randomUUID } from "crypto";

async function seedUXLaws() {
  console.log("Seeding 15 Levels of Laws of UX Mastery...");
  
  db.exec("PRAGMA foreign_keys = ON;");

  try {
    const topicId = "ux-laws-001";
    
    const existing = db.prepare("SELECT id FROM learning_topics WHERE slug = ?").get('ux-laws');
    if (!existing) {
      db.prepare(`
        INSERT INTO learning_topics (id, title, slug, description, icon)
        VALUES (?, 'Laws of UX', 'ux-laws', 'The psychological principles that define how users interact with digital interfaces.', 'Scale')
      `).run(topicId);
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

    // L1: Hick's Law
    const l1 = addLevel(1, 'NORMAL');
    addSection(l1, 'hicks', 1, 'READ', [{ type: 'text', value: 'Hick\'s Law states that the time it takes to make a decision increases with the number and complexity of choices.' }]);
    addQuiz(addSection(l1, 'quiz', 2, 'TEST', {}), 'How can you apply Hick\'s Law?', ['Add more options', 'Minimize choices for critical actions', 'Make all buttons the same color'], 1);

    // L2: Fitts's Law
    const l2 = addLevel(2, 'NORMAL');
    addSection(l2, 'fitts', 1, 'READ', [{ type: 'text', value: 'The time to acquire a target is a function of the distance to and size of the target. Larger buttons are easier to click.' }]);
    addQuiz(addSection(l2, 'quiz', 2, 'TEST', {}), 'What makes a button easier to click?', ['Making it small and far away', 'Making it large and close to the user\'s pointer/thumb', 'Making it invisible'], 1);

    // L3: Jakob's Law
    const l3 = addLevel(3, 'NORMAL');
    addSection(l3, 'jakob', 1, 'READ', [{ type: 'text', value: 'Users spend most of their time on other sites. This means users prefer your site to work the same way as all the other sites they already know.' }]);
    addQuiz(addSection(l3, 'quiz', 2, 'TEST', {}), 'According to Jakob\'s Law, should you reinvent common UI patterns?', ['Yes, to be unique', 'No, use familiar patterns to reduce cognitive load', 'Only if the client pays more'], 1);

    // L4: Law of Proximity
    const l4 = addLevel(4, 'NORMAL');
    addSection(l4, 'proximity', 1, 'READ', [{ type: 'text', value: 'Objects that are near or proximate to each other tend to be grouped together.' }]);
    addQuiz(addSection(l4, 'quiz', 2, 'TEST', {}), 'Why group related items close together?', ['To save space', 'To help users perceive them as a single related unit', 'To make the layout messy'], 1);

    // L5: Law of Similarity
    const l5 = addLevel(5, 'NORMAL');
    addSection(l5, 'similarity', 1, 'READ', [{ type: 'text', value: 'The human eye tends to perceive similar elements in a design as a complete picture, shape, or group, even if those elements are separated.' }]);
    addQuiz(addSection(l5, 'quiz', 2, 'TEST', {}), 'How does similarity affect UI?', ['Similar looking items are seen as having a similar function', 'It makes the UI boring', 'It increases loading time'], 0);

    // L6: Miller's Law
    const l6 = addLevel(6, 'NORMAL');
    addSection(l6, 'miller', 1, 'READ', [{ type: 'text', value: 'The average person can only keep 7 (plus or minus 2) items in their working memory.' }]);
    addQuiz(addSection(l6, 'quiz', 2, 'TEST', {}), 'How to apply Miller\'s Law?', ['Show 50 items at once', 'Chunk information into smaller, manageable groups', 'Remove all text'], 1);

    // L7: Postel's Law
    const l7 = addLevel(7, 'MEDIUM');
    addSection(l7, 'postel', 1, 'READ', [{ type: 'text', value: 'Be liberal in what you accept, and conservative in what you send. (The Robustness Principle)' }]);
    addQuiz(addSection(l7, 'quiz', 2, 'TEST', {}), 'In UI, Postel\'s Law means:', ['Being strict with user input', 'Accepting various input formats while providing a consistent output', 'Blocking all invalid data immediately'], 1);

    // L8: Peak-End Rule
    const l8 = addLevel(8, 'MEDIUM');
    addSection(l8, 'peak-end', 1, 'READ', [{ type: 'text', value: 'People judge an experience largely based on how they felt at its peak and at its end, rather than the total sum or average of every moment.' }]);
    addQuiz(addSection(l8, 'quiz', 2, 'TEST', {}), 'Where should you focus delight?', ['At the very beginning only', 'At the most intense point and the conclusion of the journey', 'Everywhere equally'], 1);

    // L9: Aesthetic-Usability Effect
    const l9 = addLevel(9, 'MEDIUM');
    addSection(l9, 'aesthetic', 1, 'READ', [{ type: 'text', value: 'Users often perceive aesthetically pleasing design as design that’s more usable.' }]);
    addQuiz(addSection(l9, 'quiz', 2, 'TEST', {}), 'Why does visual design matter for UX?', ['It doesn\'t', 'Good aesthetics can mask minor usability issues and build trust', 'It makes the code faster'], 1);

    // L10: Von Restorff Effect
    const l10 = addLevel(10, 'MEDIUM');
    addSection(l10, 'restorff', 1, 'READ', [{ type: 'text', value: 'Also known as the Isolation Effect, it predicts that when multiple similar objects are present, the one that differs from the rest is most likely to be remembered.' }]);
    addQuiz(addSection(l10, 'quiz', 2, 'TEST', {}), 'How to use the Von Restorff effect?', ['Make everything the same color', 'Make the primary call-to-action visually distinct', 'Hide the buttons'], 1);

    // L11: Zeigarnik Effect
    const l11 = addLevel(11, 'MEDIUM');
    addSection(l11, 'zeigarnik', 1, 'READ', [{ type: 'text', value: 'People remember uncompleted or interrupted tasks better than completed tasks.' }]);
    addQuiz(addSection(l11, 'quiz', 2, 'TEST', {}), 'How is this used in UX?', ['Progress bars and "profile incomplete" prompts', 'Giving users infinite tasks', 'Removing task lists'], 0);

    // L12: Law of Common Region
    const l12 = addLevel(12, 'HARD');
    addSection(l12, 'common-region', 1, 'READ', [{ type: 'text', value: 'Elements tend to be perceived into groups if they are sharing an area with a clearly defined boundary.' }]);
    addQuiz(addSection(l12, 'quiz', 2, 'TEST', {}), 'Example of Common Region:', ['A card component with a border', 'Text on a white background', 'Randomly placed icons'], 0);

    // L13: Occam's Razor
    const l13 = addLevel(13, 'HARD');
    addSection(l13, 'occam', 1, 'READ', [{ type: 'text', value: 'Among competing hypotheses, the one with the fewest assumptions should be selected. In design, the simplest solution is usually the best.' }]);
    addQuiz(addSection(l13, 'quiz', 2, 'TEST', {}), 'How to apply Occam\'s Razor?', ['Add more features to be safe', 'Remove unnecessary elements without compromising function', 'Use complex animations'], 1);

    // L14: Pareto Principle
    const l14 = addLevel(14, 'HARD');
    addSection(l14, 'pareto', 1, 'READ', [{ type: 'text', value: 'The Pareto principle states that, for many events, roughly 80% of the effects come from 20% of the causes.' }]);
    addQuiz(addSection(l14, 'quiz', 2, 'TEST', {}), 'In UX, this means:', ['80% of users use 20% of features', '20% of users do 80% of the work', 'Focus on 100% of features equally'], 0);

    // L15: Final Mastery
    const l15 = addLevel(15, 'HARD');
    addSection(l15, 'mastery', 1, 'READ', [{ type: 'text', value: 'Congratulations! You\'ve mastered the Laws of UX. Apply these principles to create intuitive, human-centered designs.' }]);
    addQuiz(addSection(l15, 'quiz', 2, 'TEST', {}), 'UX Laws are based on:', ['Opinion', 'Psychology and Human Behavior', 'Fashion trends'], 1);

    console.log("Laws of UX levels successfully seeded!");

  } catch (error) {
    console.error("Seeding failed:", error);
  }
}

seedUXLaws();
