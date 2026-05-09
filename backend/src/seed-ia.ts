import db from "./db";
import { randomUUID } from "crypto";

async function seedIA() {
  console.log("Seeding 15 Levels of Information Architecture Mastery...");
  
  try {
    const topicId = "ia-001";
    
    const existing = await db.get("SELECT id FROM learning_topics WHERE slug = $1", ['information-architecture']);
    if (!existing) {
      await db.run(`
        INSERT INTO learning_topics (id, title, slug, description, icon)
        VALUES ($1, $2, $3, $4, $5)
      `, [topicId, 'Information Architecture', 'information-architecture', 'Design the skeleton. Learn how to organize and label content so users can find what they need.', 'Globe']);
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

    // L1: Intro
    const l1 = await addLevel(1, 'NORMAL');
    await addSection(l1, 'intro', 1, 'READ', [{ type: 'text', value: 'Information Architecture (IA) is the practice of deciding how to arrange the parts of something to be understandable. It is the structural design of shared information environments.' }]);
    await addQuiz(await addSection(l1, 'quiz', 2, 'TEST', {}), 'What is the primary focus of IA?', ['Visual design and colors', 'Organizing and labeling content for findability', 'Writing code'], 1);

    // L2: Taxonomy
    const l2 = await addLevel(2, 'NORMAL');
    await addSection(l2, 'taxonomy', 1, 'READ', [{ type: 'text', value: 'Taxonomy is the science of classification. In IA, it means grouping similar content together (e.g., categorizing products on an e-commerce site).' }]);
    await addQuiz(await addSection(l2, 'quiz', 2, 'TEST', {}), 'Taxonomy helps users by:', ['Showing them more ads', 'Providing a logical structure to find related items', 'Changing the font size'], 1);

    // L3: Navigation Models
    const l3 = await addLevel(3, 'NORMAL');
    await addSection(l3, 'nav-models', 1, 'READ', [{ type: 'text', value: 'Hierarchical navigation (Tree) starts broad and gets specific. Flat navigation (Linear) is better for simple tasks or storytelling.' }]);
    await addQuiz(await addSection(l3, 'quiz', 2, 'TEST', {}), 'Which model is better for a complex news site?', ['Hierarchical', 'Linear', 'Random'], 0);

    // L4: Wayfinding
    const l4 = await addLevel(4, 'NORMAL');
    await addSection(l4, 'wayfinding', 1, 'READ', [{ type: 'text', value: 'Wayfinding helps users know where they are, where they\'ve been, and where they can go. Breadcrumbs and active states are key wayfinding tools.' }]);
    await addQuiz(await addSection(l4, 'quiz', 2, 'TEST', {}), 'Which is a wayfinding tool?', ['A popup ad', 'Breadcrumbs', 'A scroll bar'], 1);

    // L5: Sitemaps
    const l5 = await addLevel(5, 'NORMAL');
    await addSection(l5, 'sitemaps', 1, 'READ', [{ type: 'text', value: 'A sitemap is a visual representation of the relationship between pages. It defines the \"bones\" of the entire website or app.' }]);
    await addQuiz(await addSection(l5, 'quiz', 2, 'TEST', {}), 'A sitemap is used to define:', ['The color palette', 'The high-level structure and hierarchy of pages', 'The button styles'], 1);

    // L6: User Flows
    const l6 = await addLevel(6, 'NORMAL');
    await addSection(l6, 'user-flows', 1, 'READ', [{ type: 'text', value: 'User flows map the path a user takes through the IA to complete a task. It ensures the architecture supports user goals.' }]);
    await addQuiz(await addSection(l6, 'quiz', 2, 'TEST', {}), 'What do user flows focus on?', ['The sequence of steps to reach a goal', 'The background image', 'The font weights'], 0);

    // L7: Scaffolding
    const l7 = await addLevel(7, 'NORMAL');
    await addSection(l7, 'scaffolding', 1, 'READ', [{ type: 'text', value: 'Information scaffolding involves providing enough structure (headers, lists, summaries) so users can scan and understand content quickly.' }]);
    await addQuiz(await addSection(l7, 'quiz', 2, 'TEST', {}), 'Why use scaffolding?', ['To make the page longer', 'To help users scan and find information faster', 'To hide content'], 1);

    // L8: Content Strategy
    const l8 = await addLevel(8, 'MEDIUM');
    await addSection(l8, 'content-strategy', 1, 'READ', [{ type: 'text', value: 'IA and Content Strategy work together. IA provides the container, while Content Strategy defines the message and voice.' }]);
    await addQuiz(await addSection(l8, 'quiz', 2, 'TEST', {}), 'IA provides the ________, Content Strategy provides the ________.', ['Message / Container', 'Container / Message', 'Style / Code'], 1);

    // L9: Metadata
    const l9 = await addLevel(9, 'MEDIUM');
    await addSection(l9, 'metadata', 1, 'READ', [{ type: 'text', value: 'Metadata is \"metadata is data about data.\" It helps search engines and internal search systems categorize and retrieve content accurately.' }]);
    await addQuiz(await addSection(l9, 'quiz', 2, 'TEST', {}), 'Example of metadata:', ['The actual article text', 'Tags like \"category: design\" or \"date: 2023\"', 'The logo image'], 1);

    // L10: Progressive Disclosure
    const l10 = await addLevel(10, 'MEDIUM');
    await addSection(l10, 'disclosure', 1, 'READ', [{ type: 'text', value: 'Progressive disclosure hides complex features until the user needs them, reducing initial cognitive load.' }]);
    await addQuiz(await addSection(l10, 'quiz', 2, 'TEST', {}), 'Benefit of progressive disclosure:', ['It makes the site look empty', 'It prevents overwhelming the user with too much info at once', 'It increases clicks'], 1);

    // L11: Mental Models
    const l11 = await addLevel(11, 'MEDIUM');
    await addSection(l11, 'mental-models', 1, 'READ', [{ type: 'text', value: 'Users have mental models of how systems should work based on past experiences. Your IA should match their expectations.' }]);
    await addQuiz(await addSection(l11, 'quiz', 2, 'TEST', {}), 'If your IA contradicts a user\'s mental model, they will likely:', ['Be delighted by the surprise', 'Feel confused and frustrated', 'Learn it instantly'], 1);

    // L12: Cognitive Load
    const l12 = await addLevel(12, 'HARD');
    await addSection(l12, 'cognitive-load', 1, 'READ', [{ type: 'text', value: 'Good IA reduces cognitive load—the amount of mental effort required to use the system. Don\'t make users think about the structure.' }]);
    await addQuiz(await addSection(l12, 'quiz', 2, 'TEST', {}), 'Goal of IA in relation to cognitive load:', ['To increase it for \"brain exercise\"', 'To minimize it so focus remains on the task', 'To ignore it'], 1);

    // L13: Wireframing
    const l13 = await addLevel(13, 'HARD');
    await addSection(l13, 'wireframes-ia', 1, 'READ', [{ type: 'text', value: 'Wireframes are where IA meets UI. They show the arrangement of content on a screen without distracting visual details.' }]);
    await addQuiz(await addSection(l13, 'quiz', 2, 'TEST', {}), 'Why use low-fidelity wireframes for IA?', ['To save time on drawing', 'To focus on structure and hierarchy rather than visual style', 'Because designers are lazy'], 1);

    // L14: Responsive IA
    const l14 = await addLevel(14, 'HARD');
    await addSection(l14, 'responsive-ia', 1, 'READ', [{ type: 'text', value: 'IA must adapt to different screen sizes. A 3-level sidebar on desktop might become a drill-down menu or search-first interface on mobile.' }]);
    await addQuiz(await addSection(l14, 'quiz', 2, 'TEST', {}), 'Responsive IA means:', ['Making the text smaller on mobile', 'Adapting the structure and navigation to different screen contexts', 'Keeping the exact same menu for all screens'], 1);

    // L15: Final Mastery
    const l15 = await addLevel(15, 'HARD');
    await addSection(l15, 'mastery', 1, 'READ', [{ type: 'text', value: 'Congratulations! You\'ve completed Information Architecture Mastery. You now know how to design the \"skeleton\" of successful products.' }]);
    await addQuiz(await addSection(l15, 'quiz', 2, 'TEST', {}), 'IA is important because it ensures:', ['Users can find information easily and reliably', 'The site uses the latest trends', 'The logo is visible'], 0);

    console.log("Information Architecture levels successfully seeded!");

  } catch (error) {
    console.error("Seeding failed:", error);
  }
}

seedIA().then(() => process.exit(0));
