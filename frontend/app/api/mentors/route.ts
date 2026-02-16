import { NextResponse } from "next/server";

const MENTORS = [
  {
    id: "m1",
    name: "Sarah Jenkins",
    role: "Senior Product Designer @ Spotify",
    specialty: "Career Strategy",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200",
    rate: 150,
    rating: 4.9,
    reviews: 124,
    availability: ["Tue 10:00 AM", "Thu 2:00 PM", "Fri 11:00 AM"]
  },
  {
    id: "m2",
    name: "David Chen",
    role: "Lead UX Researcher @ Airbnb",
    specialty: "Portfolio Review",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
    rate: 120,
    rating: 4.8,
    reviews: 89,
    availability: ["Mon 3:00 PM", "Wed 1:00 PM", "Fri 4:00 PM"]
  },
  {
    id: "m3",
    name: "Elena Rodriguez",
    role: "Design Director @ Stripe",
    specialty: "Leadership",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200",
    rate: 200,
    rating: 5.0,
    reviews: 45,
    availability: ["Tue 9:00 AM", "Thu 10:00 AM"]
  },
  {
    id: "m4",
    name: "Marcus Johnson",
    role: "Freelance Brand Designer",
    specialty: "Visual Design",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200",
    rate: 90,
    rating: 4.7,
    reviews: 210,
    availability: ["Mon 11:00 AM", "Wed 3:00 PM", "Fri 1:00 PM"]
  }
];

export async function GET() {
  return NextResponse.json(MENTORS);
}
