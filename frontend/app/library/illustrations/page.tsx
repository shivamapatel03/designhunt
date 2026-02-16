import Link from "next/link";
import { ChevronRight, ExternalLink, Image as ImageIcon } from "lucide-react";

const ILLUSTRATION_RESOURCES = [
  {
    name: "unDraw",
    description: "Open-source illustrations for any idea you can imagine and create. Matches your brand color instantly.",
    url: "https://undraw.co/illustrations",
    tags: ["Flat", "SVG", "Customizable Color"],
    previewColor: "bg-[#6c63ff]",
    image: "/library/illustrations/flat.svg"
  },
  {
    name: "Storyset",
    description: "Awesome free customizable illustrations for your next project. Animate them with their online editor.",
    url: "https://storyset.com/",
    tags: ["5 Styles", "Animated", "SVG"],
    previewColor: "bg-[#2ECC71]",
     image: "/library/illustrations/3d.svg"
  },
  {
    name: "Humaaans",
    description: "Mix-&-match illustrations of people with a design library. Great for adding human touch.",
    url: "https://www.humaaans.com/",
    tags: ["People", "Mix & Match", "Sketch/Figma"],
    previewColor: "bg-[#FFABAB]",
     image: "/library/illustrations/flat.svg"
  },
  {
    name: "Open Peeps",
    description: "A hand-drawn illustration library. Usage is free under CC0 with no attribution required.",
    url: "https://www.openpeeps.com/",
    tags: ["Hand-drawn", "Characters", "CC0"],
    previewColor: "bg-[#333333]",
     image: "/library/illustrations/hand-drawn.svg"
  },
    {
    name: "DrawKit",
    description: "Beautiful, free vector illustrations. Updated weekly with new packs.",
    url: "https://drawkit.com/",
    tags: ["3D", "Icons", "Vector"],
    previewColor: "bg-[#FF5733]",
     image: "/library/illustrations/3d.svg"
  },
   {
    name: "Ouch!",
    description: "Free vector illustrations to class up your project. Styles for every type of interface.",
    url: "https://icons8.com/illustrations",
    tags: ["3D", "Trendy", "Huge Library"],
    previewColor: "bg-[#FFC300]",
     image: "/library/illustrations/3d.svg"
  }
];

export default function IllustrationsPage() {
  return (
    <div className="min-h-screen bg-white pt-24 pb-12">
      <div className="container mx-auto px-4 md:px-8 max-w-6xl">
        
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-8 font-medium">
            <Link href="/library" className="hover:text-black">Library</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-black">Illustrations</span>
        </div>

        <h1 className="text-5xl font-black mb-6">Illustration Sets</h1>
        <p className="text-xl text-gray-600 mb-12 max-w-2xl">
            Curated list of high-quality, open-source illustration libraries to bring your UI to life.
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {ILLUSTRATION_RESOURCES.map((res, i) => (
                <a 
                    key={i} 
                    href={res.url} 
                    target="_blank" 
                    className="group block bg-gray-50 border-2 border-black rounded-3xl overflow-hidden hover:-translate-y-1 transition-transform shadow-sm hover:shadow-[4px_4px_0px_0px_#000]"
                >
                    {/* Visual Preview */}
                    <div className="h-48 w-full relative overflow-hidden bg-white border-b-2 border-black">
                        <img 
                            src={res.image} 
                            alt={res.name} 
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-black/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-[2px]">
                            <span className="font-bold flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-black shadow-sm text-xs uppercase tracking-wider">
                                Visit Website <ExternalLink className="w-3 h-3" />
                            </span>
                        </div>
                    </div>

                    <div className="p-8">
                        <h3 className="text-2xl font-black mb-3">{res.name}</h3>
                        <p className="text-gray-600 mb-6 font-medium leading-relaxed">
                            {res.description}
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {res.tags.map((tag, j) => (
                                <span key={j} className="px-3 py-1 bg-white border border-black/10 rounded-full text-xs font-bold text-gray-600 uppercase">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>
                </a>
            ))}
        </div>

      </div>
    </div>
  );
}
