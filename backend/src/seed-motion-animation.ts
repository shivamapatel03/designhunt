import db from "./db";
import { randomUUID } from "crypto";

async function seedMotionAnimation() {
  console.log("Seeding 15 Levels of Motion & Animation Mastery...");
  
  db.exec("PRAGMA foreign_keys = ON;");

  try {
    const topicId = "motion-animation-001";
    
    const existing = db.prepare("SELECT id FROM learning_topics WHERE slug = ?").get('motion-animation');
    if (!existing) {
      db.prepare(`
        INSERT INTO learning_topics (id, title, slug, description, icon)
        VALUES (?, 'Motion & Animation', 'motion-animation', 'Bring your designs to life. Learn how to use motion to provide feedback, guide users, and add personality.', 'Activity')
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
    addSection(l1, 'intro', 1, 'READ', [{ type: 'text', value: 'Motion in UI is more than just eye-candy. It explains how the interface is organized and how elements relate to each other.' }]);
    addQuiz(addSection(l1, 'quiz', 2, 'TEST', {}), 'What is the primary purpose of UI motion?', ['To show off technical skills', 'To explain interface relationships and provide feedback', 'To slow down the user'], 1);

    // L2: Easing Curves
    const l2 = addLevel(2, 'NORMAL');
    addSection(l2, 'easing', 1, 'READ', [{ type: 'text', value: 'In nature, nothing moves with a perfectly constant speed. Easing curves (Ease-in, Ease-out) make digital motion feel natural and physical.' }]);
    addQuiz(addSection(l2, 'quiz', 2, 'TEST', {}), 'Why use easing instead of linear motion?', ['Linear motion is too fast', 'Easing makes motion feel more natural and real', 'Easing saves battery'], 1);

    // L3: Duration
    const l3 = addLevel(3, 'NORMAL');
    addSection(l3, 'duration', 1, 'READ', [{ type: 'text', value: 'UI transitions should be fast enough to not keep the user waiting (typically 200ms-500ms), but slow enough to be noticed.' }]);
    addQuiz(addSection(l3, 'quiz', 2, 'TEST', {}), 'What is a typical range for UI animation duration?', ['10ms - 50ms', '200ms - 500ms', '2s - 5s'], 1);

    // L4: Feedback
    const l4 = addLevel(4, 'NORMAL');
    addSection(l4, 'feedback', 1, 'READ', [{ type: 'text', value: 'Motion provides instant feedback. For example, a button that slightly shrinks when pressed confirms the interaction to the user.' }]);
    addQuiz(addSection(l4, 'quiz', 2, 'TEST', {}), 'Example of feedback motion:', ['A button shrinking on click', 'A background image changing color', 'A text font getting thinner'], 0);

    // L5: Transitions
    const l5 = addLevel(5, 'NORMAL');
    addSection(l5, 'transitions', 1, 'READ', [{ type: 'text', value: 'Shared element transitions help users maintain context when moving between screens. An icon on a list expanding into a header is a classic example.' }]);
    addQuiz(addSection(l5, 'quiz', 2, 'TEST', {}), 'What do shared element transitions help with?', ['Reducing file size', 'Maintaining user context', 'Increasing contrast'], 1);

    // L6: Staggering
    const l6 = addLevel(6, 'NORMAL');
    addSection(l6, 'stagger', 1, 'READ', [{ type: 'text', value: 'Animating list items one by one with a small delay (staggering) creates a sense of flow and helps the eye track the content.' }]);
    addQuiz(addSection(l6, 'quiz', 2, 'TEST', {}), 'What is staggered animation?', ['All items move at once', 'Items animate sequentially with a delay', 'Items move randomly'], 1);

    // L7: Micro-interactions
    const l7 = addLevel(7, 'NORMAL');
    addSection(l7, 'micro', 1, 'READ', [{ type: 'text', value: 'Micro-interactions are small, functional animations like a heart icon filling up when liked or a toggle switch sliding.' }]);
    addQuiz(addSection(l7, 'quiz', 2, 'TEST', {}), 'Which is a micro-interaction?', ['A loading spinner', 'A toggle switch moving', 'A full-page 3D intro'], 1);

    // L8: Guiding Focus
    const l8 = addLevel(8, 'MEDIUM');
    addSection(l8, 'focus', 1, 'READ', [{ type: 'text', value: 'Motion can guide the eye to new information. A notification badge that "pops" in will immediately draw the user\'s attention.' }]);
    addQuiz(addSection(l8, 'quiz', 2, 'TEST', {}), 'How can motion guide focus?', ['By being invisible', 'By using sudden or distinct movement to draw attention', 'By staying static'], 1);

    // L9: Springs
    const l9 = addLevel(9, 'MEDIUM');
    addSection(l9, 'springs', 1, 'READ', [{ type: 'text', value: 'Spring physics (damping and stiffness) create bouncy, playful motion that feels tactile, like pulling on a real-world object.' }]);
    addQuiz(addSection(l9, 'quiz', 2, 'TEST', {}), 'What defines a spring animation?', ['Time and duration', 'Stiffness and damping', 'Width and height'], 1);

    // L10: Choreography
    const l10 = addLevel(10, 'MEDIUM');
    addSection(l10, 'choreography', 1, 'READ', [{ type: 'text', value: 'Choreography is the coordinated movement of multiple elements. Elements should move in a logical sequence, not all at once.' }]);
    addQuiz(addSection(l10, 'quiz', 2, 'TEST', {}), 'Good UI choreography avoids:', ['Sequential movement', 'Moving everything simultaneously (visual noise)', 'Using easing'], 1);

    // L11: Functional Motion
    const l11 = addLevel(11, 'MEDIUM');
    addSection(l11, 'functional', 1, 'READ', [{ type: 'text', value: 'Functional motion serves a purpose (confirming an action, showing hierarchy). If motion doesn\'t help the user, it might be a distraction.' }]);
    addQuiz(addSection(l11, 'quiz', 2, 'TEST', {}), 'What makes motion functional?', ['If it looks cool', 'If it assists user understanding or provides feedback', 'If it uses 100% CPU'], 1);

    // L12: Anticipation
    const l12 = addLevel(12, 'MEDIUM');
    addSection(l12, 'anticipation', 1, 'READ', [{ type: 'text', value: 'Anticipation is a small movement before the main action (like a wind-up). It prepares the user for what is about to happen.' }]);
    addQuiz(addSection(l12, 'quiz', 2, 'TEST', {}), 'What is anticipation in animation?', ['The feeling after an animation ends', 'A small movement that prepares for a larger one', 'A type of easing curve'], 1);

    // L13: Skeletons
    const l13 = addLevel(13, 'HARD');
    addSection(l13, 'skeletons', 1, 'READ', [{ type: 'text', value: 'Skeleton screens use subtle pulsing animations to indicate that content is loading, making the wait feel shorter than a static spinner.' }]);
    addQuiz(addSection(l13, 'quiz', 2, 'TEST', {}), 'Why use pulsing skeleton screens?', ['To hide the loading time completely', 'To indicate progress and make the wait feel shorter', 'To use more bandwidth'], 1);

    // L14: Reduce Motion
    const l14 = addLevel(14, 'HARD');
    addSection(l14, 'accessibility', 1, 'READ', [{ type: 'text', value: 'Some users have vestibular disorders and can get dizzy from motion. Always respect the "prefers-reduced-motion" CSS media query.' }]);
    addQuiz(addSection(l14, 'quiz', 2, 'TEST', {}), 'Why respect "prefers-reduced-motion"?', ['To save battery', 'For users who experience motion sickness or dizziness', 'To make the site faster'], 1);

    // L15: Mastery
    const l15 = addLevel(15, 'HARD');
    addSection(l15, 'mastery', 1, 'READ', [{ type: 'text', value: 'Congratulations! You now understand the principles of Motion & Animation. Use it wisely to delight and guide your users.' }]);
    addQuiz(addSection(l15, 'quiz', 2, 'TEST', {}), 'When is the best time to add motion?', ['At the very end as a layer', 'As an integral part of the design and UX process', 'Only when the client asks'], 1);

    console.log("Motion & Animation levels successfully seeded!");

  } catch (error) {
    console.error("Seeding failed:", error);
  }
}

seedMotionAnimation();
