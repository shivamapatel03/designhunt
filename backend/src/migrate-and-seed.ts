import db from "./db";
import { randomUUID } from "crypto";

async function migrateAndSeed() {
  console.log("Starting migration and seed...");

  try {
    // 1. Check for columns in PostgreSQL
    const tableInfo = await db.all(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'challenges'
    `) as any[];
    const columns = tableInfo.map((c) => c.column_name);

    if (!columns.includes("type")) {
      console.log("Adding 'type' column...");
      await db.run(
        "ALTER TABLE challenges ADD COLUMN type TEXT DEFAULT 'STANDARD'",
      );
    }

    if (!columns.includes("expires_at")) {
      console.log("Adding 'expires_at' column...");
      await db.run("ALTER TABLE challenges ADD COLUMN expires_at TIMESTAMP");
    }

    if (!columns.includes("cover_image")) {
      console.log("Adding 'cover_image' column...");
      await db.run("ALTER TABLE challenges ADD COLUMN cover_image TEXT");
    }

    if (!columns.includes("requirements")) {
      console.log("Adding 'requirements' column...");
      await db.run("ALTER TABLE challenges ADD COLUMN requirements TEXT"); // Stored as JSON string
    }

    // 2. Ensure submission_votes table exists
    await db.exec(`
      CREATE TABLE IF NOT EXISTS submission_votes (
          id TEXT PRIMARY KEY,
          user_id TEXT NOT NULL,
          submission_id TEXT NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users(id),
          FOREIGN KEY (submission_id) REFERENCES submissions(id),
          UNIQUE(user_id, submission_id)
      );
    `);

    // 3. Seed Daily Challenge
    const existingDaily = await db.get("SELECT * FROM challenges WHERE type = 'DAILY'");

    const requirements = JSON.stringify([
      "Must use a geometric sans-serif typeface.",
      "Include a 'Dark Mode' variation.",
      "The play button must be the focal point.",
      "No gradients - stick to flat colors.",
      "Submit high-fidelity PNG or Figma link.",
    ]);

    const coverImage =
      "https://images.unsplash.com/photo-1614680376593-902f74cf0d41?q=80&w=2574&auto=format&fit=crop";

    if (existingDaily) {
      console.log("Found existing daily challenge. Updating details.");
      const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
      await db.run(
        `
          UPDATE challenges 
          SET expires_at = $1, cover_image = $2, requirements = $3 
          WHERE id = $4
        `,
        [tomorrow, coverImage, requirements, (existingDaily as any).id]
      );
    } else {
      console.log("Creating new daily challenge.");
      const id = randomUUID();
      const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

      await db.run(
        `
          INSERT INTO challenges (id, title, description, difficulty, points, category, created_at, type, expires_at, cover_image, requirements)
          VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP, $7, $8, $9, $10)
        `,
        [
          id,
          "Reimagine the Spotify UI",
          "Design a fresh, geometric take on the music player interface. Focus on typography and bold visual hierarchy.",
          "Medium",
          500,
          "UI Design",
          "DAILY",
          tomorrow,
          coverImage,
          requirements,
        ]
      );
    }

    // 4. Seed Tools
    const toolCountRes = await db.get("SELECT COUNT(*) as count FROM tools") as any;
    const toolCount = parseInt(toolCountRes?.count || "0");

    if (toolCount < 10) {
      console.log("Seeding comprehensive tools list...");
      // Clear existing to avoid duplicates during dev
      await db.run("DELETE FROM tools");

      const toolsList = [
        // UI/UX Design
        {
          name: "Figma",
          description:
            "The industry standard for interface design and prototyping.",
          category: "UI Design",
          url: "https://www.figma.com",
          icon: "https://upload.wikimedia.org/wikipedia/commons/3/33/Figma-logo.svg",
        },
        {
          name: "Sketch",
          description: "The original vector design tool for Mac.",
          category: "UI Design",
          url: "https://www.sketch.com",
          icon: "https://upload.wikimedia.org/wikipedia/commons/5/59/Sketch_Logo.svg",
        },
        {
          name: "Adobe XD",
          description: "Vector-based UX design tool for web and mobile apps.",
          category: "UI Design",
          url: "https://helpx.adobe.com/xd/get-started.html",
          icon: "https://upload.wikimedia.org/wikipedia/commons/c/c2/Adobe_XD_CC_icon.svg",
        },
        {
          name: "Penpot",
          description: "Open-source design and prototyping platform.",
          category: "UI Design",
          url: "https://penpot.app",
          icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Penpot_Logo.svg/1024px-Penpot_Logo.svg.png",
        },
        {
          name: "Canva",
          description: "Free-to-use online graphic design tool.",
          category: "Graphic Design",
          url: "https://www.canva.com",
          icon: "https://upload.wikimedia.org/wikipedia/commons/0/08/Canva_icon_2021.svg",
        },
  
        // 3D & Animation
        {
          name: "Spline",
          description: "Free 3D design software with real-time collaboration.",
          category: "3D Design",
          url: "https://spline.design",
          icon: "https://cdn.iconscout.com/icon/free/png-256/free-spline-3629633-3032332.png",
        },
        {
          name: "Rive",
          description: "Build interactive animations that run anywhere.",
          category: "Animation",
          url: "https://rive.app",
          icon: "https://cdn.prod.website-files.com/5f850d0615558f3ee336d0b9/62d556ad593d48268c743e43_Favicon%20-%20White.png",
        },
        {
          name: "Blender",
          description: "Free and open source 3D creation suite.",
          category: "3D Design",
          url: "https://www.blender.org",
          icon: "https://upload.wikimedia.org/wikipedia/commons/0/0c/Blender_logo_no_text.svg",
        },
        {
          name: "LottieFiles",
          description:
            "Lightweight, scalable animations for your websites and apps.",
          category: "Animation",
          url: "https://lottiefiles.com",
          icon: "https://static.lottiefiles.com/images/logo/icon.svg",
        },
  
        // Colors
        {
          name: "Coolors",
          description: "The super fast color palettes generator.",
          category: "Colors",
          url: "https://coolors.co",
          icon: "https://coolors.co/assets/img/logo_brand.png",
        },
        {
          name: "Adobe Color",
          description: "Create color palettes with the color wheel or image.",
          category: "Colors",
          url: "https://color.adobe.com",
          icon: "https://upload.wikimedia.org/wikipedia/commons/8/82/Adobe_Color_icon.png",
        },
        {
          name: "Color Hunt",
          description: "Hand-picked color palettes for your inspiration.",
          category: "Colors",
          url: "https://colorhunt.co",
          icon: "https://colorhunt.co/img/color-hunt-icon-ios.png",
        },
  
        // Typography
        {
          name: "Google Fonts",
          description: "A library of 1,600+ open source font families.",
          category: "Typography",
          url: "https://fonts.google.com",
          icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/28/Google_Fonts_2021_Icon.svg/1200px-Google_Fonts_2021_Icon.svg.png",
        },
        {
          name: "Fontshare",
          description: "Free fonts service launched by the Indian Type Foundry.",
          category: "Typography",
          url: "https://www.fontshare.com",
          icon: "https://avatars.githubusercontent.com/u/84223659?s=200&v=4",
        },
        {
          name: "Type Scale",
          description: "Visual Calculator for Typography.",
          category: "Typography",
          url: "https://typescale.com",
          icon: "https://typescale.com/assets/images/favicon.png",
        },
  
        // Icons
        {
          name: "Lucide",
          description: "Beautiful & consistent icons.",
          category: "Icons",
          url: "https://lucide.dev",
          icon: "https://lucide.dev/logo.svg",
        },
        {
          name: "Phosphor",
          description: "Flexible icon family for interfaces.",
          category: "Icons",
          url: "https://phosphoricons.com",
          icon: "https://phosphoricons.com/assets/favicon.png",
        },
        {
          name: "Noun Project",
          description: "Icons and photos for everything.",
          category: "Icons",
          url: "https://thenounproject.com",
          icon: "https://static.thenounproject.com/png/1157-200.png",
        },
  
        // Productivity & Inspiration
        {
          name: "Linear",
          description: "A better way to build products.",
          category: "Productivity",
          url: "https://linear.app",
          icon: "https://static-00.iconduck.com/assets.00/linear-icon-2048x2048-j29h4k8r.png",
        },
        {
          name: "Mobbin",
          description: "Discover the latest mobile design patterns.",
          category: "Inspiration",
          url: "https://mobbin.com",
          icon: "https://media.licdn.com/dms/image/D560BAQGjC2o_8i6XbQ/company-logo_200_200/0/1688544838634?e=2147483647&v=beta&t=H_8J_l_o_o_o_o_o_o_o_o_o_o_o_o_o_o_o_o",
        },
        {
          name: "Dribbble",
          description:
            "Discover the world’s top designers & creative professionals.",
          category: "Inspiration",
          url: "https://dribbble.com",
          icon: "https://upload.wikimedia.org/wikipedia/commons/3/32/Dribbble_logo.svg",
        },
        {
          name: "Behance",
          description: "Search for creative work on Behance.",
          category: "Inspiration",
          url: "https://www.behance.net",
          icon: "https://upload.wikimedia.org/wikipedia/commons/c/c5/Behance_logo.svg",
        },
  
        // No-Code / Site Builders
        {
          name: "Webflow",
          description: "Build professional, custom websites in a visual canvas.",
          category: "No-Code",
          url: "https://webflow.com",
          icon: "https://upload.wikimedia.org/wikipedia/commons/a/a6/Webflow_logo_2023.svg",
        },
        {
          name: "Framer",
          description: "The internet is your canvas.",
          category: "No-Code",
          url: "https://framer.com",
          icon: "https://upload.wikimedia.org/wikipedia/commons/b/b4/Framer_logo_2021.svg",
        },
      ];

      for (const tool of toolsList) {
        await db.run(
          "INSERT INTO tools (id, name, description, category, url, icon) VALUES ($1, $2, $3, $4, $5, $6)",
          [
            randomUUID(),
            tool.name,
            tool.description,
            tool.category,
            tool.url,
            tool.icon,
          ]
        );
      }
      console.log(`Seeded ${toolsList.length} tools.`);
    }

    console.log("Migration and seeding complete!");
  } catch (error) {
    console.error("Migration and seed failed:", error);
  }
}

migrateAndSeed().then(() => process.exit(0));
