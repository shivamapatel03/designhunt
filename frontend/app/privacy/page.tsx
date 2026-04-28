import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="bg-white min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-6 md:px-16 lg:px-24 max-w-4xl">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-black transition-colors mb-8 group"
        >
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </Link>
        
        <header className="mb-12">
          <h1 className="text-4xl md:text-5xl font-figtree font-semibold tracking-tight text-black mb-4">
            Privacy Policy
          </h1>
          <p className="text-gray-500 text-sm font-medium">
            Last updated: April 13, 2026
          </p>
        </header>

        <div className="prose prose-gray max-w-none space-y-10">
          <section>
            <h2 className="text-xl font-bold font-figtree text-black mb-4">1. Information We Collect</h2>
            <p className="text-gray-600 leading-relaxed font-medium">
              We collect information to provide a better learning experience. This includes:
            </p>
            <ul className="list-disc pl-5 mt-4 space-y-2 text-gray-600 font-medium">
              <li><strong>Personal Info:</strong> Explicitly provided data like your name, email address, and profile picture.</li>
              <li><strong>Learning Progress:</strong> Data about courses completed, challenges attempted, and XP earned.</li>
              <li><strong>Interaction Data:</strong> Log data, device information, and IP addresses for security and analytics.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold font-figtree text-black mb-4">2. How We Use Your Data</h2>
            <p className="text-gray-600 leading-relaxed font-medium">
              Your data allows us to personalize your learning path, track your achievements, and send you important updates or newsletter insights if you've subscribed. We do not sell your personal data to third parties.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold font-figtree text-black mb-4">3. Cookies & Tracking</h2>
            <p className="text-gray-600 leading-relaxed font-medium">
              Designhunt uses cookies to maintain your login session and understand how users navigate our site. You can manage your cookie preferences through our cookie consent banner.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold font-figtree text-black mb-4">4. Third-Party Services</h2>
            <p className="text-gray-600 leading-relaxed font-medium">
              We use trusted third-party services for specific purposes, such as:
            </p>
             <ul className="list-disc pl-5 mt-4 space-y-2 text-gray-600 font-medium">
              <li>Vercel for hosting and performance analytics.</li>
              <li>Stripe for secure payment processing (if applicable).</li>
              <li>Google Analytics for understanding site traffic.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold font-figtree text-black mb-4">5. Your Rights</h2>
            <p className="text-gray-600 leading-relaxed font-medium">
              You have the right to access, correct, or delete your personal data at any time. You can manage these settings directly in your profile dashboard or contact our support team.
            </p>
          </section>

          <section className="pt-10 border-t border-gray-100">
            <h2 className="text-xl font-bold font-figtree text-black mb-4">Privacy Concerns</h2>
            <p className="text-gray-600 leading-relaxed font-medium">
              If you have any questions regarding your privacy, please reach out to our team at <a href="mailto:privacy@designhunt.io" className="text-black underline underline-offset-4 hover:text-blue-600 transition-colors">privacy@designhunt.io</a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
