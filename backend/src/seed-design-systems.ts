import db from "./db";
import { randomUUID } from "crypto";

async function seedDesignSystems() {
  console.log("Seeding 15 Levels of Design Systems Mastery...");
  
  try {
    const topicId = "design-systems-001";
    
    const existing = await db.get("SELECT id FROM learning_topics WHERE slug = $1", ['design-systems']);
    if (!existing) {
      await db.run(`
        INSERT INTO learning_topics (id, title, slug, description, icon)
        VALUES ($1, $2, $3, $4, $5)
      `, [topicId, 'Design Systems', 'design-systems', 'Build at scale. Learn how to create and maintain a collection of reusable components and clear standards.', 'LayoutTemplate']);
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
    await addSection(l1, 'intro', 1, 'READ', [{ type: 'text', value: 'A design system is a complete set of standards to manage design at scale by reducing redundancy and creating a shared language for teams.' }]);
    await addQuiz(await addSection(l1, 'quiz', 2, 'TEST', {}), 'What is the main benefit of a design system?', ['To make the designer\'s life harder', 'To ensure consistency and speed at scale', 'To use more colors'], 1);

    // L2: Style Guides vs Libraries
    const l2 = await addLevel(2, 'NORMAL');
    await addSection(l2, 'guides-vs-libraries', 1, 'READ', [{ type: 'text', value: 'A Style Guide focuses on aesthetics (brand, colors). A Component Library focuses on UI implementation (buttons, cards). A Design System includes both, plus documentation.' }]);
    await addQuiz(await addSection(l2, 'quiz', 2, 'TEST', {}), 'What does a design system include that a style guide might lack?', ['A logo', 'Reusable code components and documentation', 'A color palette'], 1);

    // L3: Design Tokens
    const l3 = await addLevel(3, 'NORMAL');
    await addSection(l3, 'tokens', 1, 'READ', [{ type: 'text', value: 'Design Tokens are the visual atoms of the design system: colors, spacing, and typography values stored as variables (e.g., $color-primary-500).' }]);
    await addQuiz(await addSection(l3, 'quiz', 2, 'TEST', {}), 'Why use design tokens instead of hardcoded hex values?', ['They are shorter to type', 'They allow for easy updates across all platforms (e.g., changing a color once)', 'They make the code faster'], 1);

    // L4: Iconography
    const l4 = await addLevel(4, 'NORMAL');
    await addSection(l4, 'iconography', 1, 'READ', [{ type: 'text', value: 'A consistent iconography system ensures all icons share the same weight, style (filled vs outlined), and grid size.' }]);
    await addQuiz(await addSection(l4, 'quiz', 2, 'TEST', {}), 'What makes a good iconography system?', ['Every icon has a different style', 'Consistent line weights and visual metaphors', 'Icons are as large as possible'], 1);

    // L5: Atomic Design
    const l5 = await addLevel(5, 'NORMAL');
    await addSection(l5, 'atomic', 1, 'READ', [{ type: 'text', value: 'Atomic Design (by Brad Frost) breaks UI into: Atoms (labels), Molecules (input fields), Organisms (headers), Templates, and Pages.' }]);
    await addQuiz(await addSection(l5, 'quiz', 2, 'TEST', {}), 'In Atomic Design, what is a \"molecule\"?', ['A single HTML tag', 'A group of atoms bonded together (e.g., label + input + button)', 'A full page'], 1);

    // L6: Pattern Libraries
    const l6 = await addLevel(6, 'NORMAL');
    await addSection(l6, 'patterns', 1, 'READ', [{ type: 'text', value: 'Pattern libraries are collections of user interface patterns (like navigation or search flows) that solve common problems consistently.' }]);
    await addQuiz(await addSection(l6, 'quiz', 2, 'TEST', {}), 'A pattern library focuses on:', ['Specific UI interactions and flows', 'The brand logo', 'Server-side code'], 0);

    // L7: Documentation
    const l7 = await addLevel(7, 'NORMAL');
    await addSection(l7, 'documentation', 1, 'READ', [{ type: 'text', value: 'Documentation is the \"why\" and \"how\". It explains when to use a component, which variants exist, and accessibility requirements.' }]);
    await addQuiz(await addSection(l7, 'quiz', 2, 'TEST', {}), 'Why is documentation crucial for a design system?', ['To fill up server space', 'To provide guidance on when and how to use components correctly', 'To show off the design'], 1);

    // L8: a11y in Systems
    const l8 = await addLevel(8, 'MEDIUM');
    await addSection(l8, 'a11y-systems', 1, 'READ', [{ type: 'text', value: 'Building accessibility into the design system (e.g., accessible color pairs, keyboard-friendly buttons) ensures all products using it are accessible by default.' }]);
    await addQuiz(await addSection(l8, 'quiz', 2, 'TEST', {}), 'What is the \"built-in\" benefit of an accessible design system?', ['It makes the UI green', 'Accessibility is inherited by any product using the system components', 'It disables all animations'], 1);

    // L9: Version Control
    const l9 = await addLevel(9, 'MEDIUM');
    await addSection(l9, 'version-control', 1, 'READ', [{ type: 'text', value: 'Design systems need version control (like Figma branching or Git) to track changes, manage updates, and avoid breaking live products.' }]);
    await addQuiz(await addSection(l9, 'quiz', 2, 'TEST', {}), 'How should you manage updates to a core component?', ['Just change it in the master file', 'Use versioning and branching to test and communicate changes', 'Delete the old one'], 1);

    // L10: Handoff
    const l10 = await addLevel(10, 'MEDIUM');
    await addSection(l10, 'handoff', 1, 'READ', [{ type: 'text', value: 'Handoff is the process of translating design into code. A shared design system bridge this gap by providing developers with ready-to-use specs.' }]);
    await addQuiz(await addSection(l10, 'quiz', 2, 'TEST', {}), 'How does a design system improve handoff?', ['By removing the need for developers', 'By providing a shared library of pre-defined components and specs', 'By making designs look like code'], 1);

    // L11: Governance
    const l11 = await addLevel(11, 'MEDIUM');
    await addSection(l11, 'governance', 1, 'READ', [{ type: 'text', value: 'Governance defines how new components are added, existing ones are modified, and who has the authority to make those changes.' }]);
    await addQuiz(await addSection(l11, 'quiz', 2, 'TEST', {}), 'What does Design System governance manage?', ['The company\'s budget', 'The process for maintaining and evolving the system', 'The office layout'], 1);

    // L12: Auditing
    const l12 = await addLevel(12, 'HARD');
    await addSection(l12, 'audit', 1, 'READ', [{ type: 'text', value: 'A design audit is the process of reviewing all UI elements across a product to identify inconsistencies and redundancies before building the system.' }]);
    await addQuiz(await addSection(l12, 'quiz', 2, 'TEST', {}), 'What is the goal of a UI audit?', ['To find more colors to use', 'To identify inconsistencies and consolidate UI elements', 'To check for typos'], 1);

    // L13: Theming
    const l13 = await addLevel(13, 'HARD');
    await addSection(l13, 'theming', 1, 'READ', [{ type: 'text', value: 'Theming allows a single design system to support different visual styles (e.g., Light vs Dark mode) by swapping design token values.' }]);
    await addQuiz(await addSection(l13, 'quiz', 2, 'TEST', {}), 'Theming is mostly achieved through:', ['Redesigning every page', 'Swapping Design Token values', 'Using different fonts'], 1);

    // L14: Lifecycle
    const l14 = await addLevel(14, 'HARD');
    await addSection(l14, 'lifecycle', 1, 'READ', [{ type: 'text', value: 'Components follow a lifecycle: Discovery -> Design -> Development -> Documentation -> Maintenance -> Deprecation.' }]);
    await addQuiz(await addSection(l14, 'quiz', 2, 'TEST', {}), 'What is the final stage of a component\'s lifecycle?', ['Maintenance', 'Deprecation (removal)', 'Design'], 1);

    // L15: Mastery
    const l15 = await addLevel(15, 'HARD');
    await addSection(l15, 'mastery', 1, 'READ', [{ type: 'text', value: 'Congratulations! You\'ve completed Design Systems Mastery. You now know how to build products that are consistent, scalable, and efficient.' }]);
    await addQuiz(await addSection(l15, 'quiz', 2, 'TEST', {}), 'A design system is a ________ product.', ['Static', 'Living and constantly evolving', 'One-time'], 1);

    console.log("Design Systems levels successfully seeded!");

  } catch (error) {
    console.error("Seeding failed:", error);
  }
}

seedDesignSystems().then(() => process.exit(0));
