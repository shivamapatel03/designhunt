import db from "./db";
import { randomUUID } from "crypto";

async function seedUserResearch() {
  console.log("Seeding 15 Levels of User Research Mastery...");
  
  db.exec("PRAGMA foreign_keys = ON;");

  try {
    const topicId = "user-research-001";
    
    const existing = db.prepare("SELECT id FROM learning_topics WHERE slug = ?").get('user-research');
    if (!existing) {
      db.prepare(`
        INSERT INTO learning_topics (id, title, slug, description, icon)
        VALUES (?, 'User Research', 'user-research', 'Understand your users. Learn methods to gather insights and validate your design decisions.', 'Search')
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
    addSection(l1, 'intro', 1, 'READ', [{ type: 'text', value: 'User research focuses on understanding user behaviors, needs, and motivations through various investigation techniques. It is the foundation of User-Centered Design.' }]);
    addQuiz(addSection(l1, 'quiz', 2, 'TEST', {}), 'What is the main goal of user research?', ['To prove the designer is always right', 'To understand user needs and validate assumptions', 'To make the UI look better'], 1);

    // L2: Qual vs Quant
    const l2 = addLevel(2, 'NORMAL');
    addSection(l2, 'qual-quant', 1, 'READ', [{ type: 'text', value: 'Qualitative research (Interviews) asks "Why?", while Quantitative research (Surveys/Analytics) asks "How many?". You need both for a complete picture.' }]);
    addQuiz(addSection(l2, 'quiz', 2, 'TEST', {}), 'Which method is best for understanding user motivations?', ['Qualitative (Interviews)', 'Quantitative (Analytics)', 'Both are equal'], 0);

    // L3: Interviews
    const l3 = addLevel(3, 'NORMAL');
    addSection(l3, 'interviews', 1, 'READ', [{ type: 'text', value: 'User interviews involve talking directly to users. The key is to ask open-ended questions and avoid leading the user to a specific answer.' }]);
    addQuiz(addSection(l3, 'quiz', 2, 'TEST', {}), 'Which is a good interview question?', ['Do you like this new feature?', 'Can you describe the last time you used a similar app?', 'Would you pay $10 for this?'], 1);

    // L4: Surveys
    const l4 = addLevel(4, 'NORMAL');
    addSection(l4, 'surveys', 1, 'READ', [{ type: 'text', value: 'Surveys allow you to gather data from a large number of users quickly. They are great for quantitative insights but lack the depth of interviews.' }]);
    addQuiz(addSection(l4, 'quiz', 2, 'TEST', {}), 'When are surveys most useful?', ['When you need deep emotional insights', 'When you need to gather data from a large sample size', 'When you have no users'], 1);

    // L5: Usability Testing
    const l5 = addLevel(5, 'NORMAL');
    addSection(l5, 'usability-testing', 1, 'READ', [{ type: 'text', value: 'Usability testing involves watching a user complete tasks with your product to identify friction points and areas for improvement.' }]);
    addQuiz(addSection(l5, 'quiz', 2, 'TEST', {}), 'What is the best way to conduct usability testing?', ['Tell the user exactly what to click', 'Give the user a task and observe them without interrupting', 'Ask them if they think it\'s easy'], 1);

    // L6: Personas
    const l6 = addLevel(6, 'NORMAL');
    addSection(l6, 'personas', 1, 'READ', [{ type: 'text', value: 'User personas are fictional characters created based on research to represent the different user types within your target audience.' }]);
    addQuiz(addSection(l6, 'quiz', 2, 'TEST', {}), 'What should a good persona be based on?', ['The designer\'s imagination', 'Actual user research and data', 'The marketing team\'s goals'], 1);

    // L7: Journey Maps
    const l7 = addLevel(7, 'NORMAL');
    addSection(l7, 'journey-maps', 1, 'READ', [{ type: 'text', value: 'A user journey map is a visual representation of the process a user goes through to achieve a goal with your product.' }]);
    addQuiz(addSection(l7, 'quiz', 2, 'TEST', {}), 'What does a journey map help identify?', ['The file size of images', 'Pain points and opportunities for improvement', 'The best font to use'], 1);

    // L8: Empathy Maps
    const l8 = addLevel(8, 'MEDIUM');
    addSection(l8, 'empathy-maps', 1, 'READ', [{ type: 'text', value: 'Empathy maps help teams understand what a user Says, Does, Thinks, and Feels. It’s a tool to align the team on the user\'s perspective.' }]);
    addQuiz(addSection(l8, 'quiz', 2, 'TEST', {}), 'The 4 quadrants of an empathy map are:', ['Who, What, Where, When', 'Says, Thinks, Does, Feels', 'Price, Quality, Speed, Style'], 1);

    // L9: Card Sorting
    const l9 = addLevel(9, 'MEDIUM');
    addSection(l9, 'card-sorting', 1, 'READ', [{ type: 'text', value: 'Card sorting is a method used to help design or evaluate the information architecture of a site. Users group items into categories.' }]);
    addQuiz(addSection(l9, 'quiz', 2, 'TEST', {}), 'What does card sorting help with?', ['Color selection', 'Information Architecture (organizing content)', 'Coding buttons'], 1);

    // L10: Tree Testing
    const l10 = addLevel(10, 'MEDIUM');
    addSection(l10, 'tree-testing', 1, 'READ', [{ type: 'text', value: 'Tree testing is a way to evaluate the findability of topics in a website. It’s often done with a text-only version of the navigation.' }]);
    addQuiz(addSection(l10, 'quiz', 2, 'TEST', {}), 'Tree testing is essentially:', ['Testing the visual design', 'Testing the navigation structure without visuals', 'Planting trees'], 1);

    // L11: A/B Testing
    const l11 = addLevel(11, 'MEDIUM');
    addSection(l11, 'ab-testing', 1, 'READ', [{ type: 'text', value: 'A/B testing involves showing two versions of a page (A and B) to different users to see which one performs better for a specific goal.' }]);
    addQuiz(addSection(l11, 'quiz', 2, 'TEST', {}), 'A/B testing is a ________ method.', ['Qualitative', 'Quantitative', 'Decorative'], 1);

    // L12: Heatmaps
    const l12 = addLevel(12, 'HARD');
    addSection(l12, 'heatmaps', 1, 'READ', [{ type: 'text', value: 'Heatmaps show where users click, move their mouse, or scroll on a page. Hotter colors indicate more interaction.' }]);
    addQuiz(addSection(l12, 'quiz', 2, 'TEST', {}), 'What does a red area on a heatmap mean?', ['The site is overheating', 'High level of user interaction or focus', 'A critical error'], 1);

    // L13: Competitive Analysis
    const l13 = addLevel(13, 'HARD');
    addSection(l13, 'competitive-analysis', 1, 'READ', [{ type: 'text', value: 'Competitive analysis involves researching your competitors to understand their strengths and weaknesses and identify market gaps.' }]);
    addQuiz(addSection(l13, 'quiz', 2, 'TEST', {}), 'Why conduct competitive analysis?', ['To copy their design exactly', 'To find opportunities to differentiate and improve', 'To report them for bad UX'], 1);

    // L14: Ethics
    const l14 = addLevel(14, 'HARD');
    addSection(l14, 'ethics', 1, 'READ', [{ type: 'text', value: 'Researchers must obtain informed consent, ensure user privacy, and avoid bias. Participants should know they can stop the research at any time.' }]);
    addQuiz(addSection(l14, 'quiz', 2, 'TEST', {}), 'What is "informed consent"?', ['Telling the user they have to finish', 'Ensuring the user understands the research and agrees to participate voluntarily', 'Giving the user a cookie'], 1);

    // L15: Mastery
    const l15 = addLevel(15, 'HARD');
    addSection(l15, 'mastery', 1, 'READ', [{ type: 'text', value: 'Congratulations! You\'ve completed User Research Mastery. You now have the tools to build products that truly solve user problems.' }]);
    addQuiz(addSection(l15, 'quiz', 2, 'TEST', {}), 'User research should happen:', ['Only at the beginning', 'Throughout the entire design and development lifecycle', 'Only if the product fails'], 1);

    console.log("User Research levels successfully seeded!");

  } catch (error) {
    console.error("Seeding failed:", error);
  }
}

seedUserResearch();
