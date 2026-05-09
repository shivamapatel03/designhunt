import db from "./db";

async function syncBadges(email: string) {
  console.log(`Syncing badges for ${email}...`);
  
  const user = db.prepare("SELECT id, badges_json FROM users WHERE email = ?").get(email) as any;
  if (!user) {
    console.error("User not found");
    return;
  }

  const currentBadges = JSON.parse(user.badges_json || "[]");
  const topicSlug = "typography";
  const topicTitle = "Typography";

  const milestones: any = {
    12: { tier: 'NORMAL', name: 'Typography Apprentice', image: 'typography_normal_theory_shield_badge_1775632202926.png' },
    28: { tier: 'MEDIUM', name: 'Typography Architect', image: 'typography_medium_theory_badge_circular_1775632619934.png' },
    50: { tier: 'HARD', name: 'Typography Master', image: 'typography_hard_theory_badge_circular_1775632729811.png' }
  };

  const completedMilestones = db.prepare(`
    SELECT DISTINCT l.level_number
    FROM learning_levels l
    JOIN learning_sections s ON l.id = s.level_id
    JOIN learning_progress p ON s.id = p.section_id
    WHERE p.user_id = ? AND l.level_number IN (12, 28, 50)
  `).all(user.id) as any[];

  let updated = false;

  completedMilestones.forEach(m => {
    const milestone = milestones[m.level_number];
    const alreadyEarned = currentBadges.find((b: any) => b.tier === milestone.tier && b.topic === topicTitle);
    
    if (!alreadyEarned) {
      console.log(`Awarding missing badge: ${milestone.name}`);
      currentBadges.push({
        ...milestone,
        earned_at: new Date().toISOString(),
        topic: topicTitle,
        topic_slug: topicSlug
      });
      updated = true;
    }
  });

  if (updated) {
    db.prepare("UPDATE users SET badges_json = ? WHERE id = ?").run(JSON.stringify(currentBadges), user.id);
    console.log("Badges updated successfully!");
  } else {
    console.log("No missing badges found.");
  }
}

syncBadges("shivamapatel.edunet@gmail.com");
