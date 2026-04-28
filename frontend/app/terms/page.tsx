import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default function TermsPage() {
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
            Terms & Conditions
          </h1>
          <p className="text-gray-500 text-sm font-medium">
            Last updated: April 13, 2026
          </p>
        </header>

        <div className="prose prose-gray max-w-none space-y-10">
          <section>
            <h2 className="text-xl font-bold font-figtree text-black mb-4">1. Introduction</h2>
            <p className="text-gray-600 leading-relaxed font-medium">
              Welcome to Designhunt. By accessing our website and platform, you agree to be bound by these Terms & Conditions. Please read them carefully. If you do not agree with any part of these terms, you must not use our services.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold font-figtree text-black mb-4">2. Intellectual Property</h2>
            <p className="text-gray-600 leading-relaxed font-medium">
              All content provided on Designhunt, including but not limited to course materials, UI kits, wireframes, illustrations, and theoretical guides, is the intellectual property of Designhunt or its content creators. You are granted a limited, non-exclusive license to use these materials for personal learning purposes only.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold font-figtree text-black mb-4">3. User Conduct</h2>
            <p className="text-gray-600 leading-relaxed font-medium">
              You agree to use our platform in a manner that is lawful and respectful. You must not:
            </p>
            <ul className="list-disc pl-5 mt-4 space-y-2 text-gray-600 font-medium">
              <li>Attempt to scrape or download content in bulk without authorization.</li>
              <li>Share your account credentials with others.</li>
              <li>Post harmful, offensive, or derogatory comments in community spaces.</li>
              <li>Use the platform to distribute spam or unauthorized marketing.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold font-figtree text-black mb-4">4. Limitation of Liability</h2>
            <p className="text-gray-600 leading-relaxed font-medium">
              Designhunt provides educational content "as is." While we strive for accuracy, we do not guarantee specific career outcomes or professional results. Designhunt shall not be liable for any indirect, incidental, or consequential damages resulting from your use of the platform.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold font-figtree text-black mb-4">5. Modifications</h2>
            <p className="text-gray-600 leading-relaxed font-medium">
              We reserve the right to modify these terms at any time. Significant changes will be communicated via email or through a prominent notice on our platform. Your continued use of Designhunt after such changes constitutes acceptance of the new terms.
            </p>
          </section>

          <section className="pt-10 border-t border-gray-100">
            <h2 className="text-xl font-bold font-figtree text-black mb-4">Contact Us</h2>
            <p className="text-gray-600 leading-relaxed font-medium">
              If you have any questions about these Terms, please contact us at <a href="mailto:support@designhunt.io" className="text-black underline underline-offset-4 hover:text-blue-600 transition-colors">support@designhunt.io</a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
