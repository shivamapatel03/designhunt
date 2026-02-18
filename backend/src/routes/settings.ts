import express from "express";
import { getAllSettings } from "../lib/settings";

const router = express.Router();

// Get Public Settings (Maintenance Mode, Banner, etc.)
router.get("/", (req, res) => {
  try {
    const allSettings = getAllSettings();
    // Filter only public settings
    const publicSettings = {
      MAINTENANCE_MODE: allSettings.MAINTENANCE_MODE === "true",
      DISABLE_REGISTRATIONS: allSettings.DISABLE_REGISTRATIONS === "true",
      SHOW_BANNER: allSettings.SHOW_BANNER === "true",
      BANNER_MESSAGE: allSettings.BANNER_MESSAGE || "",
      MAINTENANCE_END_TIME: allSettings.MAINTENANCE_END_TIME || "",
      ENABLE_MARKETPLACE: allSettings.ENABLE_MARKETPLACE === "true",
    };
    res.json(publicSettings);
  } catch (err) {
    console.error("Failed to fetch public settings:", err);
    res.status(500).json({ error: "Failed to fetch settings" });
  }
});

export default router;
