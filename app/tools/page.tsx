import { ToolCard } from "@/components/tools/ToolCard";
import { Layout } from "lucide-react";

interface Tool {
  id: string;
  name: string;
  description: string;
  category: string;
  url: string;
  icon?: string;
}

async function getTools(): Promise<Tool[]> {
  try {
    const res = await fetch("http://localhost:3000/api/tools", { cache: 'no-store' });
    if (!res.ok) return [];
    return res.json();
  } catch (error) {
    return [];
  }
}

export default async function ToolsPage() {
  const tools = await getTools();

  return (
    <div className="container mx-auto px-6 py-12 md:px-16 lg:px-24">
       <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
         <div>
            <div className="flex items-center gap-3 mb-4">
               <div className="p-3 bg-accent-blue rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_#000]">
                 <Layout className="w-6 h-6 text-white" />
               </div>
               <h1 className="text-4xl font-bold">Design Tools</h1>
            </div>
            <p className="text-xl text-muted-foreground max-w-2xl">
              Curated collection of the best design resources and utilities.
            </p>
         </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {tools.length > 0 ? (
          tools.map(tool => (
            <ToolCard 
              key={tool.id} 
              name={tool.name}
              category={tool.category}
              description={tool.description}
              url={tool.url}
              pricing="Free" // Defaulting to Free as it's not in DB yet
              color="bg-black"
            />
          ))
        ) : (
          <div className="col-span-full text-center py-20">
            <p className="text-xl text-muted-foreground">No tools found.</p>
          </div>
        )}
      </div>
    </div>
  );
}
