
import db from "./db";

async function testProfileRoute() {
  const userId = "fef2ad37-6f34-4eb9-953e-c069c583188d";
  try {
    console.log("Fetching user...");
    const user = await db.get("SELECT * FROM users WHERE id = $1", [userId]) as any;
    if (!user) {
        console.log("User not found");
        return;
    }
    console.log("User found:", user.email);

    console.log("Fetching enrollments...");
    const enrollments = await db.all(
      `
      SELECT e.*, c.title, c.thumbnail, c.difficulty 
      FROM enrollments e 
      JOIN courses c ON e.course_id = c.id 
      WHERE e.user_id = $1
    `,
      [userId]
    );
    console.log("Enrollments fetched:", enrollments.length);

    console.log("Fetching tutor request...");
    const tutorRequest = await db.get("SELECT status FROM tutor_requests WHERE user_id = $1", [userId]) as any;
    console.log("Tutor request fetched");

    console.log("Fetching typography stats...");
    const typographyTopic = await db.get("SELECT id FROM learning_topics WHERE slug = 'typography'") as any;
    let typographyStats = { completed: 0, total: 30 };
    if (typographyTopic) {
        // ...
    }
    console.log("Typography stats fetched");

    console.log("Parsing topics_to_learn...");
    const topicsToLearnRaw = user.topics_to_learn ? JSON.parse(user.topics_to_learn) : [];
    console.log("Topics parsed:", topicsToLearnRaw);

    console.log("Fetching topics with progress...");
    const topicsWithProgress = await Promise.all(topicsToLearnRaw.map(async (topicName: string) => {
        const slug = topicName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
        const topic = await db.get("SELECT id FROM learning_topics WHERE slug = $1 OR title = $2", [slug, topicName]) as any;
        let percentage = 0;
        if (topic) {
            // ...
        }
        return { title: topicName, percentage };
    }));
    console.log("Topics with progress fetched");

    console.log("Calculating percentile...");
    const xp_percentile = await (async () => {
        const totalUsersRes = await db.get("SELECT COUNT(*) as count FROM users") as any;
        const usersAheadRes = await db.get("SELECT COUNT(*) as count FROM users WHERE total_xp > $1", [user.total_xp || 0]) as any;
        const totalUsers = parseInt(totalUsersRes?.count || "1");
        const usersAhead = parseInt(usersAheadRes?.count || "0");
        const topPercent = Math.max(1, Math.round((usersAhead / (totalUsers || 1)) * 100));
        return `Top ${topPercent}%`;
    })();
    console.log("Percentile calculated:", xp_percentile);

    console.log("Constructing profile object...");
    const userProfile = {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        tutor_request_status: tutorRequest?.status || null,
        handle: user.username
          ? `@${user.username}`
          : `@${user.name.toLowerCase().replace(/\s+/g, "")}`,
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
        xp_percentile,
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
    console.log("Profile constructed successfully");
    process.exit(0);
  } catch (error) {
    console.error("FAILED AT STEP:", error);
    process.exit(1);
  }
}

testProfileRoute();
