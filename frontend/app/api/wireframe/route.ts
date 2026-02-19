import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

export async function POST(req: Request) {
  try {
    const { prompt, style = "modern" } = await req.json();

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "Gemini API key is missing" },
        { status: 500 },
      );
    }

    const aiPrompt = `
      You are an expert UI designer. Generate a high-fidelity wireframe layout in JSON format based on the following prompt: "${prompt}".
      Style direction: ${style}.
      
      The output MUST be a nested JSON structure where each object represents a UI element.
      Supported element types: "box", "text", "button", "input", "avatar", "icon", "grid", "row".
      Each element should have:
      - "type": string
      - "class": string (Tailwind CSS classes for styling, use the ${style} aesthetic)
      - "content": string (if applicable, e.g., for text or button)
      - "placeholder": string (for inputs)
      - "children": array of elements (for nested structures)
      
      The design should be modern, clean, and use professional spacing. 
      Return ONLY the raw JSON object, no markdown or extra text.
    `;

    const result = await model.generateContent(aiPrompt);
    const responseText = result.response.text();

    // Extract JSON from response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    const layout = jsonMatch
      ? JSON.parse(jsonMatch[0])
      : JSON.parse(responseText);

    return NextResponse.json(layout);
  } catch (error: any) {
    console.error("Wireframe Generation Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate wireframe" },
      { status: 500 },
    );
  }
}
