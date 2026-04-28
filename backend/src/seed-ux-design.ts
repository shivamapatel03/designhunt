import db from "./db";
import { randomUUID } from "crypto";

async function seedUXDesign() {
  console.log("Seeding 15 Levels of UX Design Mastery...");
  
  db.exec("PRAGMA foreign_keys = ON;");

  try {
    const topicId = "ux-design-001";
    
    const existing = db.prepare("SELECT id FROM learning_topics WHERE slug = ?").get('ux-design');
    if (!existing) {
      db.prepare(`
        INSERT INTO learning_topics (id, title, slug, description, icon)
        VALUES (?, 'UX Design', 'ux-design', 'Master the principles of user experience. Learn how to create products that are useful, usable, and desirable.', 'UserGroup')
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

    // L1: Intro
    const l1 = addLevel(1, 'NORMAL');
    addSection(l1, 'intro', 1, 'READ', [{ type: 'text', value: 'UX Design is the process of creating products that provide meaningful and relevant experiences to users. It involves the design of the entire process of acquiring and integrating the product.' }]);
    addQuiz(addSection(l1, 'quiz', 2, 'TEST', {}), 'What does UX stand for?', ['User Expansion', 'User Experience', 'Unit X'], 1);

    // L2: Double Diamond
    const l2 = addLevel(2, 'NORMAL');
    addSection(l2, 'double-diamond', 1, 'READ', [{ type: 'text', value: 'The Double Diamond process has 4 stages: Discover, Define, Develop, and Deliver. It encourages divergent and convergent thinking.' }]);
    addQuiz(addSection(l2, 'quiz', 2, 'TEST', {}), 'What are the two diamonds in the Double Diamond?', ['Price and Quality', 'Problem Space and Solution Space', 'Desktop and Mobile'], 1);

    // L3: UCD
    const l3 = addLevel(3, 'NORMAL');
    addSection(l3, 'ucd', 1, 'READ', [{ type: 'text', value: 'User-Centered Design (UCD) is an iterative design process in which designers focus on the users and their needs in each phase of the design process.' }]);
    addQuiz(addSection(l3, 'quiz', 2, 'TEST', {}), 'Who is the focus of UCD?', ['The CEO', 'The User', 'The Developer'], 1);

    // L4: Affordances
    const l4 = addLevel(4, 'NORMAL');
    addSection(l4, 'affordances', 1, 'READ', [{ type: 'text', value: 'An affordance is a property of an object that suggests how it can be used (e.g., a button suggests it can be pressed).' }]);
    addQuiz(addSection(l4, 'quiz', 2, 'TEST', {}), 'A physical handle on a door is an example of:', ['A constraint', 'An affordance', 'A mapping'], 1);

    // L5: Signifiers
    const l5 = addLevel(5, 'NORMAL');
    addSection(l5, 'signifiers', 1, 'READ', [{ type: 'text', value: 'Signifiers are signals that communicate where the action should take place (e.g., a "Push" sign on a door or a blue underline on a link).' }]);
    addQuiz(addSection(l5, 'quiz', 2, 'TEST', {}), 'What is the purpose of a signifier?', ['To hide features', 'To communicate where and how an action should take place', 'To make the UI colorful'], 1);

    // L6: Constraints
    const l6 = addLevel(6, 'NORMAL');
    addSection(l6, 'constraints', 1, 'READ', [{ type: 'text', value: 'Constraints limit the possible actions a user can take, reducing the chance of error (e.g., graying out a "Submit" button until the form is valid).' }]);
    addQuiz(addSection(l6, 'quiz', 2, 'TEST', {}), 'Why use constraints in UX?', ['To annoy users', 'To prevent errors and guide users toward correct actions', 'To save space'], 1);

    // L7: Heuristics
    const l7 = addLevel(7, 'NORMAL');
    addSection(l7, 'heuristics', 1, 'READ', [{ type: 'text', value: 'Nielsen\'s 10 Heuristics are general principles for interaction design. Examples include "Visibility of system status" and "User control and freedom."' }]);
    addQuiz(addSection(l7, 'quiz', 2, 'TEST', {}), 'Which is a usability heuristic?', ['Make everything pop', 'Visibility of system status', 'Use at least 5 colors'], 1);

    // L8: Error Prevention
    const l8 = addLevel(8, 'MEDIUM');
    addSection(l8, 'error-prevention', 1, 'READ', [{ type: 'text', value: 'It\'s better to prevent errors from happening than to provide good error messages. Use defaults, constraints, and confirmations.' }]);
    addQuiz(addSection(l8, 'quiz', 2, 'TEST', {}), 'What is better than a great error message?', ['A colorful UI', 'Preventing the error from occurring in the first place', 'A fast server'], 1);

    // L9: Mental Models
    const l9 = addLevel(9, 'MEDIUM');
    addSection(l9, 'mental-models-ux', 1, 'READ', [{ type: 'text', value: 'A mental model is what the user believes about the system. An implementation model is how the system actually works. UX should close the gap.' }]);
    addQuiz(addSection(l9, 'quiz', 2, 'TEST', {}), 'UX design should strive to align with the user\'s:', ['Codebase', 'Mental Model', 'Budget'], 1);

    // L10: Response Time
    const l10 = addLevel(10, 'MEDIUM');
    addSection(l10, 'response-time', 1, 'READ', [{ type: 'text', value: 'System feedback should be immediate. 0.1s feels instantaneous, 1s is the limit for the user\'s flow of thought, and 10s is the limit for keeping their attention.' }]);
    addQuiz(addSection(l10, 'quiz', 2, 'TEST', {}), 'What happens if a response takes longer than 10 seconds?', ['The user will wait patiently', 'The user will likely lose focus or leave the task', 'The site will crash'], 1);

    // L11: Onboarding
    const l11 = addLevel(11, 'MEDIUM');
    addSection(l11, 'onboarding', 1, 'READ', [{ type: 'text', value: 'Onboarding is the process of introducing new users to your product. Good onboarding focuses on showing value quickly, not just listing features.' }]);
    addQuiz(addSection(l11, 'quiz', 2, 'TEST', {}), 'What is the goal of onboarding?', ['To show all settings', 'To help users reach their "Aha!" moment and see the product\'s value', 'To collect credit card info'], 1);

    // L12: Empty States
    const l12 = addLevel(12, 'HARD');
    addSection(l12, 'empty-states', 1, 'READ', [{ type: 'text', value: 'Empty states occur when there is no content to show. Use them as an opportunity to guide users on how to add content or what to do next.' }]);
    addQuiz(addSection(l12, 'quiz', 2, 'TEST', {}), 'A good empty state should:', ['Be completely blank', 'Guide the user on how to get started', 'Show an error message'], 1);

    // L13: Delight
    const l13 = addLevel(13, 'HARD');
    addSection(l13, 'delight', 1, 'READ', [{ type: 'text', value: 'Surface delight (animations) is great, but true delight comes from deep usability—the product solving a problem effortlessly.' }]);
    addQuiz(addSection(l13, 'quiz', 2, 'TEST', {}), 'Where does the most meaningful user delight come from?', ['A funny loading spinner', 'The product working seamlessly and solving a real need', 'High resolution images'], 1);

    // L14: Dark Patterns
    const l14 = addLevel(14, 'HARD');
    addSection(l14, 'dark-patterns', 1, 'READ', [{ type: 'text', value: 'Dark patterns are UI tricks used to manipulate users into doing things they didn\'t intend to (e.g., hidden costs, "roach motel" cancellations).' }]);
    addQuiz(addSection(l14, 'quiz', 2, 'TEST', {}), 'Dark patterns are:', ['A dark mode theme', 'Manipulative UI techniques that hurt user trust', 'Complex code patterns'], 1);

    // L15: Final Mastery
    const l15 = addLevel(15, 'HARD');
    addSection(l15, 'mastery', 1, 'READ', [{ type: 'text', value: 'Congratulations! You\'ve completed UX Design Mastery. You are now equipped to build products that are not just beautiful, but truly human-centered.' }]);
    addQuiz(addSection(l15, 'quiz', 2, 'TEST', {}), 'UX design is a ________ process.', ['One-time', 'Continuous and iterative', 'Simple'], 1);

    console.log("UX Design levels successfully seeded!");

  } catch (error) {
    console.error("Seeding failed:", error);
  }
}

seedUXDesign();
