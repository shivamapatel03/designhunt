import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <span className="text-lg font-bold border-2 border-primary px-2 py-1 bg-primary text-primary-foreground">
                DH
              </span>
              <span className="text-lg font-bold">Design-Hunt</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              The structured learning platform for designers. Master your craft with theory, tools, and practice.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Learn</h3>
            <ul className="space-y-2 text-sm">
              {/* <li><Link href="/learning-paths" className="hover:underline">Learning Paths</Link></li> */}
              <li><Link href="/theory" className="hover:underline">Theory Library</Link></li>
              <li><Link href="/tools" className="hover:underline">Tool Mastery</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/theory/color" className="hover:underline">Color Wheel</Link></li>
              <li><Link href="/theory/typography" className="hover:underline">Type Scale</Link></li>
              <li><Link href="/library/illustrations" className="hover:underline">Illustrations</Link></li>
              <li><Link href="/theory/layout" className="hover:underline">Grid Generator</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="hover:underline">About</Link></li>
               <li><Link href="/critique" className="hover:underline font-bold text-accent-yellow">Explore AI Execution Lab</Link></li>
              {/* <li><Link href="/career" className="hover:underline font-bold text-accent-pink">Career Opportunities</Link></li> */}
              <li><Link href="/critique" className="hover:underline">AI Feedback</Link></li>
              {/* <li><Link href="/staff/login" className="hover:underline text-xs text-gray-400 mt-4 block">Staff Login</Link></li> */}
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Design-Hunt. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
