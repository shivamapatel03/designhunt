import db from "./db";
import { randomUUID } from "crypto";

async function seedProductStrategy() {
  console.log("Seeding 15 Levels of Product Strategy Mastery...");
  
  db.exec("PRAGMA foreign_keys = ON;");

  try {
    const topicId = "product-strategy-001";
    
    const existing = db.prepare("SELECT id FROM learning_topics WHERE slug = ?").get('product-strategy');
    if (!existing) {
      db.prepare(`
        INSERT INTO learning_topics (id, title, slug, description, icon)
        VALUES (?, 'Product Strategy', 'product-strategy', 'Think like a product owner. Learn how to align design with business goals and market needs.', 'Target')
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
    addSection(l1, 'intro', 1, 'READ', [{ type: 'text', value: 'Product Strategy is a high-level plan that describes what a business hopes to accomplish with its product and how it plans to do so. It bridges the gap between vision and execution.' }]);
    addQuiz(addSection(l1, 'quiz', 2, 'TEST', {}), 'What is Product Strategy?', ['A list of colors', 'A high-level plan to achieve a product vision', 'A coding framework'], 1);

    // L2: Vision
    const l2 = addLevel(2, 'NORMAL');
    addSection(l2, 'vision', 1, 'READ', [{ type: 'text', value: 'The Product Vision is the "True North." It describes the long-term impact the product will have on the world. It should be inspiring and enduring.' }]);
    addQuiz(addSection(l2, 'quiz', 2, 'TEST', {}), 'A good product vision should be:', ['Updated every week', 'Inspirational and long-term', 'Technically detailed'], 1);

    // L3: Target Audience
    const l3 = addLevel(3, 'NORMAL');
    addSection(l3, 'target-audience', 1, 'READ', [{ type: 'text', value: 'Product strategy starts with knowing who the product is for. Market segmentation helps you focus on the specific needs of different user groups.' }]);
    addQuiz(addSection(l3, 'quiz', 2, 'TEST', {}), 'Why is defining a target audience important?', ['To exclude people', 'To focus resources on solving problems for a specific group', 'To pick the right font'], 1);

    // L4: Value Prop
    const l4 = addLevel(4, 'NORMAL');
    addSection(l4, 'value-prop', 1, 'READ', [{ type: 'text', value: 'The Value Proposition is the unique benefit your product provides. It answers: "Why should a user choose your product over others?"' }]);
    addQuiz(addSection(l4, 'quiz', 2, 'TEST', {}), 'What does a value proposition describe?', ['The cost of the product', 'The unique benefit provided to the user', 'The team members'], 1);

    // L5: Competitive Positioning
    const l5 = addLevel(5, 'NORMAL');
    addSection(l5, 'positioning', 1, 'READ', [{ type: 'text', value: 'Competitive positioning is how your product is perceived in relation to competitors. You can compete on price, quality, innovation, or a niche focus.' }]);
    addQuiz(addSection(l5, 'quiz', 2, 'TEST', {}), 'What is the goal of competitive positioning?', ['To copy competitors', 'To define how your product is unique in the market', 'To lower prices'], 1);

    // L6: Roadmap
    const l6 = addLevel(6, 'NORMAL');
    addSection(l6, 'roadmap', 1, 'READ', [{ type: 'text', value: 'A Product Roadmap is a visual summary that maps out the vision and direction of your product offering over time. It communicates the "why" and "what" behind features.' }]);
    addQuiz(addSection(l6, 'quiz', 2, 'TEST', {}), 'What is a product roadmap?', ['A list of bug fixes', 'A high-level visual plan of product direction', 'A user manual'], 1);

    // L7: OKRs & KPIs
    const l7 = addLevel(7, 'NORMAL');
    addSection(l7, 'okr-kpi', 1, 'READ', [{ type: 'text', value: 'Objectives and Key Results (OKRs) track goals, while Key Performance Indicators (KPIs) measure ongoing performance (e.g., Conversion Rate).' }]);
    addQuiz(addSection(l7, 'quiz', 2, 'TEST', {}), 'Which is an example of a KPI?', ['Build a new feature', 'Increase user retention by 10%', 'Fix 5 bugs'], 1);

    // L8: MVP
    const l8 = addLevel(8, 'MEDIUM');
    addSection(l8, 'mvp', 1, 'READ', [{ type: 'text', value: 'A Minimum Viable Product (MVP) is the version of a new product that allows a team to collect the maximum amount of validated learning about customers with the least effort.' }]);
    addQuiz(addSection(l8, 'quiz', 2, 'TEST', {}), 'What is the primary goal of an MVP?', ['To make money instantly', 'To learn about users with minimal investment', 'To show off design skills'], 1);

    // L9: Product-Market Fit
    const l9 = addLevel(9, 'MEDIUM');
    addSection(l9, 'pm-fit', 1, 'READ', [{ type: 'text', value: 'Product-Market Fit (PMF) is being in a good market with a product that can satisfy that market. It\'s often measured by high user retention and organic growth.' }]);
    addQuiz(addSection(l9, 'quiz', 2, 'TEST', {}), 'What is a strong indicator of PMF?', ['High number of downloads', 'High user retention and repeat usage', 'A large marketing budget'], 1);

    // L10: Monetization
    const l10 = addLevel(10, 'MEDIUM');
    addSection(l10, 'monetization', 1, 'READ', [{ type: 'text', value: 'Monetization strategies include Freemium, Subscription, One-time purchase, and Ad-supported models. The strategy must align with user value.' }]);
    addQuiz(addSection(l10, 'quiz', 2, 'TEST', {}), 'The monetization model should align with:', ['The developer\'s preference', 'The value provided to the user', 'The stock market'], 1);

    // L11: Growth
    const l11 = addLevel(11, 'MEDIUM');
    addSection(l11, 'growth', 1, 'READ', [{ type: 'text', value: 'Growth focuses on acquiring new users and retaining them. Product-led growth uses the product itself as the main vehicle for acquisition (e.g., viral invites).' }]);
    addQuiz(addSection(l11, 'quiz', 2, 'TEST', {}), 'What is Product-Led Growth?', ['Hiring more sales people', 'The product itself driving user acquisition and expansion', 'Buying more ads'], 1);

    // L12: Risk Management
    const l12 = addLevel(12, 'HARD');
    addSection(l12, 'risk', 1, 'READ', [{ type: 'text', value: 'Product risks include Value risk (will they buy?), Usability risk (can they use it?), Feasibility risk (can we build it?), and Viability risk (should we build it?).' }]);
    addQuiz(addSection(l12, 'quiz', 2, 'TEST', {}), 'Which is a "Feasibility" risk?', ['Will users find value in this?', 'Can our engineering team build this with current tech?', 'Is this legal?'], 1);

    // L13: Stakeholders
    const l13 = addLevel(13, 'HARD');
    addSection(l13, 'stakeholders', 1, 'READ', [{ type: 'text', value: 'Stakeholder management involves communicating with everyone from developers to executives to ensure alignment on the product strategy.' }]);
    addQuiz(addSection(l13, 'quiz', 2, 'TEST', {}), 'Why manage stakeholders?', ['To tell them what to do', 'To ensure alignment and manage expectations across the organization', 'To avoid meetings'], 1);

    // L14: Data-Driven Decisions
    const l14 = addLevel(14, 'HARD');
    addSection(l14, 'data-decisions', 1, 'READ', [{ type: 'text', value: 'Data-driven decision making uses analytics and user feedback to prioritize the roadmap, rather than relying on "gut feeling" or the HIPPO (Highest Paid Person\'s Opinion).' }]);
    addQuiz(addSection(l14, 'quiz', 2, 'TEST', {}), 'What should drive product prioritization?', ['The designer\'s gut feeling', 'Data, analytics, and user feedback', 'The loudest person in the room'], 1);

    // L15: Final Mastery
    const l15 = addLevel(15, 'HARD');
    addSection(l15, 'mastery', 1, 'READ', [{ type: 'text', value: 'Congratulations! You\'ve completed Product Strategy Mastery. You now have the mindset of a product owner who can align design with business success.' }]);
    addQuiz(addSection(l15, 'quiz', 2, 'TEST', {}), 'Product strategy ensures that design work is:', ['Beautiful', 'Aligned with business goals and user needs', 'Finished on time'], 1);

    console.log("Product Strategy levels successfully seeded!");

  } catch (error) {
    console.error("Seeding failed:", error);
  }
}

seedProductStrategy();
