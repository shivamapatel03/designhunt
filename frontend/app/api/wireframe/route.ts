import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { prompt } = await req.json();
  const lowerPrompt = prompt.toLowerCase();

  let layout = "generic";
  if (lowerPrompt.includes("login") || lowerPrompt.includes("sign in")) layout = "login";
  if (lowerPrompt.includes("dashboard") || lowerPrompt.includes("analytics")) layout = "dashboard";
  if (lowerPrompt.includes("landing") || lowerPrompt.includes("hero")) layout = "landing";
  if (lowerPrompt.includes("profile") || lowerPrompt.includes("user")) layout = "profile";

  const layouts: Record<string, any> = {
    login: {
      type: "login",
      elements: [
        { type: "box", class: "w-full max-w-md p-8 border-2 border-black rounded-3xl space-y-4 mx-auto mt-20" },
        { type: "text", content: "Welcome Back", class: "text-3xl font-black text-center" },
        { type: "input", placeholder: "Email", class: "w-full p-4 border-2 border-black rounded-xl" },
        { type: "input", placeholder: "Password", class: "w-full p-4 border-2 border-black rounded-xl" },
        { type: "button", content: "Sign In", class: "w-full p-4 bg-black text-white font-bold rounded-xl" }
      ]
    },
    dashboard: {
      type: "dashboard",
      elements: [
        { type: "grid", class: "grid grid-cols-4 gap-4" },
        { type: "box", class: "col-span-1 h-screen border-r-2 border-black p-4" },
        { type: "box", class: "col-span-3 p-8 space-y-8" },
        { type: "row", class: "flex justify-between items-center" },
        { type: "text", content: "Dashboard Overview", class: "text-4xl font-black" },
        { type: "grid", class: "grid grid-cols-3 gap-4" },
        { type: "card", class: "p-6 border-2 border-black rounded-2xl h-32" },
        { type: "card", class: "p-6 border-2 border-black rounded-2xl h-32" },
        { type: "card", class: "p-6 border-2 border-black rounded-2xl h-32" }
      ]
    },
    landing: {
        type: "landing",
        elements: [
            { type: "nav", class: "flex justify-between p-6 border-b-2 border-black" },
            { type: "hero", class: "py-20 text-center space-y-6" },
            { type: "text", content: "Hero Headline", class: "text-6xl font-black" },
            { type: "text", content: "Subheadline text goes here.", class: "text-xl text-gray-500" },
            { type: "row", class: "flex justify-center gap-4" },
            { type: "button", content: "Get Started", class: "px-8 py-4 bg-black text-white rounded-full font-bold" },
            { type: "button", content: "Learn More", class: "px-8 py-4 border-2 border-black rounded-full font-bold" }
        ]
    },
    profile: {
        type: "profile",
        elements: [
            { type: "header", class: "h-48 bg-gray-100 border-b-2 border-black relative" },
            { type: "avatar", class: "w-32 h-32 rounded-full border-4 border-white bg-gray-300 absolute -bottom-16 left-8" },
            { type: "container", class: "pt-20 px-8 space-y-4" },
            { type: "text", content: "User Name", class: "text-4xl font-black" },
            { type: "grid", class: "grid grid-cols-3 gap-4" },
            { type: "card", class: "aspect-square border-2 border-black rounded-xl" },
            { type: "card", class: "aspect-square border-2 border-black rounded-xl" },
            { type: "card", class: "aspect-square border-2 border-black rounded-xl" }
        ]
    },
    generic: {
        type: "generic",
        elements: [
            { type: "text", content: "Try keywords like 'Login', 'Dashboard', 'Landing', or 'Profile'", class: "text-center text-gray-400 font-bold mt-20" }
        ]
    }
  };

  return NextResponse.json(layouts[layout]);
}
