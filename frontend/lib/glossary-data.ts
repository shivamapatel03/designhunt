export interface GlossaryTerm {
  term: string;
  definition: string;
  category: "Typography" | "Color" | "Layout" | "UX" | "General";
  image?: string; // Optional path to diagram
}

export const GLOSSARY_TERMS: Record<string, GlossaryTerm> = {
  Kerning: {
    term: "Kerning",
    definition:
      "The spacing between individual characters. Adjusting kerning improves legibility and visual harmony, especially in headlines.",
    category: "Typography",
  },
  Leading: {
    term: "Leading",
    definition:
      "The vertical distance between lines of text (line height). Good leading (usually 1.5x font size) improves readability.",
    category: "Typography",
  },
  Tracking: {
    term: "Tracking",
    definition:
      "The uniform spacing between all characters in a block of text. Often increased for uppercase text.",
    category: "Typography",
  },
  "White Space": {
    term: "White Space",
    definition:
      "Also known as negative space. The empty space around elements that gives the design breathing room and defines structure.",
    category: "Layout",
  },
  Hue: {
    term: "Hue",
    definition:
      "The pure color pigment without tint or shade (e.g., Red, Blue, Green). Measured in degrees on the color wheel.",
    category: "Color",
  },
  Contrast: {
    term: "Contrast",
    definition:
      "The difference in luminance or color that makes an object (or its representation in an image or display) distinguishable.",
    category: "Color",
  },
  Affordance: {
    term: "Affordance",
    definition:
      "A property of an object that suggests how it can be used (e.g., a button looking clickable via shadows or borders).",
    category: "UX",
  },
};
