
import db from "./db";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "designhunt_secret_key_123";

async function findFailingUser() {
  try {
    const users = await db.all(`SELECT * FROM users`);
    console.log(`Testing ${users.length} users...`);

    for (const user of users as any[]) {
      const userId = user.id;
      try {
        // --- Logic from profile.ts ---
        const enrollments = await db.all(
          `
          SELECT e.*, c.title, c.thumbnail, c.difficulty 
          FROM enrollments e 
          JOIN courses c ON e.course_id = c.id 
          WHERE e.user_id = $1
        `,
          [userId]
        );

        const tutorRequest = await db.get("SELECT status FROM tutor_requests WHERE user_id = $1", [userId]) as any;

        const typographyTopic = await db.get("SELECT id FROM learning_topics WHERE slug = 'typography'") as any;
        let typographyStats = { completed: 0, total: 30 };
        
        if (typographyTopic) {
            const totalLevels = await db.get("SELECT COUNT(*) as count FROM learning_levels WHERE topic_id = $1", [typographyTopic.id]) as any;
            const completedLevels = await db.get(`
                SELECT COUNT(DISTINCT l.id) as count 
                FROM learning_levels l
                JOIN learning_sections s ON l.id = s.level_id
                JOIN learning_progress p ON s.id = p.section_id
                WHERE l.topic_id = $1 AND p.user_id = $2
            `, [typographyTopic.id, userId]) as any;
            
            typographyStats = {
                completed: parseInt(completedLevels?.count || "0"),
                total: parseInt(totalLevels?.count || "0")
            };
        }

        const topicsToLearnRaw = user.topics_to_learn ? JSON.parse(user.topics_to_learn) : [];
        const topicsWithProgress = await Promise.all(topicsToLearnRaw.map(async (topicName: string) => {
            const slug = topicName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
            const topic = await db.get("SELECT id FROM learning_topics WHERE slug = $1 OR title = $2", [slug, topicName]) as any;
            
            let percentage = 0;
            if (topic) {
                const totalRes = await db.get("SELECT COUNT(*) as count FROM learning_levels WHERE topic_id = $1", [topic.id]) as any;
                const completedRes = await db.get(`
                    SELECT COUNT(DISTINCT l.id) as count 
                    FROM learning_levels l
                    JOIN learning_sections s ON l.id = s.level_id
                    JOIN learning_progress p ON s.id = p.section_id
                    WHERE l.topic_id = $1 AND p.user_id = $2
                `, [topic.id, userId]) as any;
                
                const total = parseInt(totalRes?.count || "1");
                const completed = parseInt(completedRes?.count || "0");
                percentage = Math.round((completed / (total || 1)) * 100);
            }
            
            return {
                title: topicName,
                percentage
            };
        }));

        const userProfile = {
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            tutor_request_status: tutorRequest?.status || null,
            handle: user.username
              ? `@${user.username}`
              : `@${user.name?.toLowerCase().replace(/\s+/g, "") || "user"}`,
            avatar:
              user.avatar ||
              "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200",
            profession: user.profession || "Designer",
            level: 2,
            current_course: "Typography",
            streak: user.current_streak || 0,
            xp: user.total_xp || 0,
            current_streak: user.current_streak || 0,
            total_xp: user.total_xp || 0,
            xp_percentile: await (async () => {
                const totalUsersRes = await db.get("SELECT COUNT(*) as count FROM users") as any;
                const usersAheadRes = await db.get("SELECT COUNT(*) as count FROM users WHERE total_xp > $1", [user.total_xp || 0]) as any;
                const totalUsers = parseInt(totalUsersRes?.count || "1");
                const usersAhead = parseInt(usersAheadRes?.count || "0");
                const topPercent = Math.max(1, Math.round((usersAhead / (totalUsers || 1)) * 100));
                return `Top ${topPercent}%`;
            })(),
            typography_progress: typographyStats,
            stats: {
              lessons_completed: typographyStats.completed,
              badges_earned: (user.badges_json ? JSON.parse(user.badges_json).length : 0) || 0,
              total_xp: user.total_xp || 0,
            },
            bio: user.bio || "Design enthusiast.",
            skills: user.skills ? JSON.parse(user.skills) : [],
            topics_to_learn: topicsWithProgress,
            portfolio_items: user.portfolio_items ? JSON.parse(user.portfolio_items) : [],
            looking_for_work: !!user.looking_for_work,
          },
          history: [],
          enrollments: enrollments,
          badges: user.badges_json ? JSON.parse(user.badges_json) : [],
        };
        // ------------------------------
      } catch (err: any) {
        console.log(`User FAILED: ${user.email} (${user.id})`);
        console.log(`Error: ${err.message}`);
        console.log(`Stack: ${err.stack}`);
      }
    }
    console.log("Finished testing all users.");
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

findFailingUser();
