import db from "./db";
import { randomUUID } from "crypto";

async function seedAccessibility() {
  console.log("Seeding 15 Levels of Accessibility Mastery...");
  
  try {
    const topicId = "accessibility-001";
    
    const existing = await db.get("SELECT id FROM learning_topics WHERE slug = $1", ['accessibility']);
    if (!existing) {
      await db.run(`
        INSERT INTO learning_topics (id, title, slug, description, icon)
        VALUES ($1, $2, $3, $4, $5)
      `, [topicId, 'Accessibility', 'accessibility', 'Learn how to design for everyone, regardless of ability or situation.', 'UserCheck']);
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
    await addSection(l1, 'intro', 1, 'READ', [{ type: 'text', value: 'Accessibility (a11y) is about making sure that as many people as possible can use your product. This includes people with visual, motor, auditory, or cognitive disabilities.' }]);
    await addQuiz(await addSection(l1, 'quiz', 2, 'TEST', {}), 'Who is accessibility for?', ['Only people with permanent disabilities', 'Everyone, including people in different situations (e.g., bright sunlight)', 'Only for developers'], 1);

    // L2: Color Contrast
    const l2 = await addLevel(2, 'NORMAL');
    await addSection(l2, 'contrast', 1, 'READ', [{ type: 'text', value: 'WCAG 2.1 AA requires a contrast ratio of at least 4.5:1 for normal text and 3:1 for large text. This ensures readability for users with low vision.' }]);
    await addQuiz(await addSection(l2, 'quiz', 2, 'TEST', {}), 'What is the minimum contrast ratio for normal text (AA)?', ['2.0:1', '4.5:1', '10:1'], 1);

    // L3: Alt Text
    const l3 = await addLevel(3, 'NORMAL');
    await addSection(l3, 'alt-text', 1, 'READ', [{ type: 'text', value: 'Screen readers read alt text for images. Alt text should describe the function or content of the image, not just say \"image\".' }]);
    await addQuiz(await addSection(l3, 'quiz', 2, 'TEST', {}), 'Good alt text for a \"Save\" button icon would be:', ['Icon 123', 'Save', 'Floppy disk image'], 1);

    // L4: Keyboard Nav
    const l4 = await addLevel(4, 'NORMAL');
    await addSection(l4, 'keyboard', 1, 'READ', [{ type: 'text', value: 'Many users navigate using only a keyboard. All interactive elements must be focusable and have a clear visual focus indicator (like an outline).' }]);
    await addQuiz(await addSection(l4, 'quiz', 2, 'TEST', {}), 'Why is a focus indicator important?', ['It looks cool', 'It tells keyboard users which element they are currently on', 'It makes the site faster'], 1);

    // L5: Semantic HTML
    const l5 = await addLevel(5, 'NORMAL');
    await addSection(l5, 'semantic', 1, 'READ', [{ type: 'text', value: 'Using semantic elements like <header>, <nav>, <main>, and <button> helps screen readers understand the structure and purpose of the page.' }]);
    await addQuiz(await addSection(l5, 'quiz', 2, 'TEST', {}), 'Which element should be used for a clickable action that doesn\'t change the URL?', ['<div onClick={...}>', '<button>', '<a>'], 1);

    // L6: Touch Targets
    const l6 = await addLevel(6, 'NORMAL');
    await addSection(l6, 'touch', 1, 'READ', [{ type: 'text', value: 'Touch targets (buttons, links) should be at least 44x44 points to be easily tappable by users with limited motor control or \"fat fingers\".' }]);
    await addQuiz(await addSection(l6, 'quiz', 2, 'TEST', {}), 'What is the recommended minimum touch target size?', ['10x10 px', '44x44 pt/px', '100x100 px'], 1);

    // L7: Visual Cues
    const l7 = await addLevel(7, 'NORMAL');
    await addSection(l7, 'visual-cues', 1, 'READ', [{ type: 'text', value: 'Don\'t rely on color alone to convey meaning. For example, use an error icon AND red color for error messages, so colorblind users can see it.' }]);
    await addQuiz(await addSection(l7, 'quiz', 2, 'TEST', {}), 'How to make a \"success\" state accessible?', ['Use green text only', 'Use green text and a checkmark icon', 'Use a very bright green'], 1);

    // L8: Labels
    const l8 = await addLevel(8, 'MEDIUM');
    await addSection(l8, 'labels', 1, 'READ', [{ type: 'text', value: 'Every form input must have a visible label. Placeholders are not a substitute for labels because they disappear when the user starts typing.' }]);
    await addQuiz(await addSection(l8, 'quiz', 2, 'TEST', {}), 'Why are placeholders bad as labels?', ['They are too small', 'They disappear when typing, losing context for the user', 'They use too much RAM'], 1);

    // L9: Animations
    const l9 = await addLevel(9, 'MEDIUM');
    await addSection(l9, 'animations-a11y', 1, 'READ', [{ type: 'text', value: 'Avoid fast flashing or large moving animations. They can trigger seizures or dizziness for users with vestibular disorders.' }]);
    await addQuiz(await addSection(l9, 'quiz', 2, 'TEST', {}), 'What should you do if a user has \"prefers-reduced-motion\" enabled?', ['Ignore it', 'Disable or simplify non-essential animations', 'Make animations faster'], 1);

    // L10: Cognitive
    const l10 = await addLevel(10, 'MEDIUM');
    await addSection(l10, 'cognitive', 1, 'READ', [{ type: 'text', value: 'Keep language simple and layouts consistent. This helps users with cognitive disabilities, like ADHD or dyslexia, process information.' }]);
    await addQuiz(await addSection(l10, 'quiz', 2, 'TEST', {}), 'Which helps cognitive accessibility?', ['Using complex jargon', 'Clear, consistent navigation and simple language', 'Adding many popups'], 1);

    // L11: Headings
    const l11 = await addLevel(11, 'MEDIUM');
    await addSection(l11, 'headings', 1, 'READ', [{ type: 'text', value: 'Headings should follow a logical nesting (H1 -> H2 -> H3). Screen reader users often use headings to navigate and skim the page.' }]);
    await addQuiz(await addSection(l11, 'quiz', 2, 'TEST', {}), 'Can you skip a heading level (e.g., H1 to H3)?', ['Yes, if it looks better', 'No, it breaks the document structure for screen readers', 'Only on mobile'], 1);

    // L12: ARIA
    const l12 = await addLevel(12, 'HARD');
    await addSection(l12, 'aria', 1, 'READ', [{ type: 'text', value: 'The first rule of ARIA is: \"Don\'t use ARIA if you can use a native HTML element.\" ARIA should only be used to enhance accessibility when HTML falls short.' }]);
    await addQuiz(await addSection(l12, 'quiz', 2, 'TEST', {}), 'When should you use ARIA?', ['For every element', 'Only when native HTML cannot provide the necessary accessibility information', 'To change the font'], 1);

    // L13: Captions
    const l13 = await addLevel(13, 'HARD');
    await addSection(l13, 'captions', 1, 'READ', [{ type: 'text', value: 'Video content must have captions for users who are deaf or hard of hearing. Transcripts are also helpful for screen reader users and SEO.' }]);
    await addQuiz(await addSection(l13, 'quiz', 2, 'TEST', {}), 'What is the benefit of video captions?', ['It looks professional', 'It makes content accessible to the deaf and hearing-impaired', 'It saves bandwidth'], 1);

    // L14: Testing
    const l14 = await addLevel(14, 'HARD');
    await addSection(l14, 'testing-a11y', 1, 'READ', [{ type: 'text', value: 'Use tools like Lighthouse, Axe, or Screen Readers (VoiceOver/NVDA) to test your designs. Automated tools catch about 30-40% of issues.' }]);
    await addQuiz(await addSection(l14, 'quiz', 2, 'TEST', {}), 'Can automated tools catch ALL accessibility issues?', ['Yes', 'No, manual testing with screen readers is still essential', 'Only on Chrome'], 1);

    // L15: Final Mastery
    const l15 = await addLevel(15, 'HARD');
    await addSection(l15, 'mastery', 1, 'READ', [{ type: 'text', value: 'Congratulations! You\'ve completed Accessibility Mastery. Remember: Accessibility is not a checklist, it\'s a mindset of inclusive design.' }]);
    await addQuiz(await addSection(l15, 'quiz', 2, 'TEST', {}), 'Accessibility makes products better for:', ['Disabled users only', 'Everyone', 'Only older people'], 1);

    console.log("Accessibility levels successfully seeded!");

  } catch (error) {
    console.error("Seeding failed:", error);
  }
}

seedAccessibility().then(() => process.exit(0));
