import { NextResponse } from "next/server";

export async function GET() {
  const activeSprint = {
    id: "sprint-42",
    title: "Space-Travel Agency Login",
    description: "Design a futuristic, high-contrast login screen for a luxury interstellar travel agency.",
    timeLeft: "18:42:10",
    participants: 124,
    leaderboard: [
      { id: 1, name: "Alex Rivet", score: 98, time: "45m", avatar: "AR", isMaster: true },
      { id: 2, name: "Jordan Flex", score: 95, time: "1h 12m", avatar: "JF", isMaster: false },
      { id: 3, name: "Sam Grid", score: 92, time: "58m", avatar: "SG", isMaster: true },
      { id: 4, name: "Casey Flow", score: 89, time: "2h 5m", avatar: "CF", isMaster: false },
      { id: 5, name: "Morgan Type", score: 87, time: "1h 30m", avatar: "MT", isMaster: false },
    ]
  };

  return NextResponse.json(activeSprint);
}
