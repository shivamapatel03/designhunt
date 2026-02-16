import { NextResponse } from "next/server";

const CURRENT_DUEL = {
  id: "duel-101",
  status: "live",
  prompt: "Music Player UI: Dark Mode",
  timeLeft: "04:32",
  viewers: 1420,
  contestants: [
    {
      id: "c1",
      name: "Sarah K.",
      handle: "@sk_design",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100",
      votes: 45,
      color: "accent-blue"
    },
    {
      id: "c2",
      name: "Mike R.",
      handle: "@mike_ui",
      avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=100",
      votes: 55,
      color: "accent-pink"
    }
  ],
  chat: [
    { user: "DesignFreak", message: "That gradient is sick! 🔥" },
    { user: "UX_Ninja", message: "Sarah needs to fix the contrast..." },
    { user: "PixelPerfect", message: "Mike is winning this 100%" }
  ]
};

export async function GET() {
  return NextResponse.json(CURRENT_DUEL);
}
