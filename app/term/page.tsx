import Link from "next/link";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Header */}
        <div className="mb-12">
          <Link href="/" className="text-blue-600 hover:text-blue-800 mb-4 inline-block">
            ← Back to Home
          </Link>
          <h1 className="text-4xl font-bold mb-2">Terms of Service</h1>
          <p className="text-gray-600">Last updated: November 2025</p>
        </div>

        {/* Content */}
        <div className="space-y-8 text-gray-700">
          <section>
            <h2 className="text-2xl font-bold mb-4">1. Acceptance of Terms</h2>
            <p>
              By accessing and using SocialScheduler ("the Service"), you accept and agree to be bound by
              the terms and provision of this agreement. If you do not agree to abide by the above, please
              do not use this service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">2. Use License</h2>
            <p className="mb-3">
              Permission is granted to temporarily download one copy of the materials (information or software)
              on SocialScheduler for personal, non-commercial transitory viewing only. This is the grant of a
              license, not a transfer of title, and under this license you may not:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Modify or copy the materials</li>
              <li>Use the materials for any commercial purpose or for any public display</li>
              <li>Attempt to decompile or reverse engineer any software contained on the Service</li>
              <li>Remove any copyright or other proprietary notations from the materials</li>
              <li>Transfer the materials to another person or "mirror" the materials on any other server</li>
              <li>Use automated tools to access the Service without permission</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">3. Disclaimer of Warranties</h2>
            <p>
              The materials on SocialScheduler are provided on an 'as is' basis. SocialScheduler makes no
              warranties, expressed or implied, and hereby disclaims and negates all other warranties including,
              without limitation, implied warranties or conditions of merchantability, fitness for a particular
              purpose, or non-infringement of intellectual property or other violation of rights.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">4. Limitations of Liability</h2>
            <p>
              In no event shall SocialScheduler or its suppliers be liable for any damages (including, without
              limitation, damages for loss of data or profit, or due to business interruption) arising out of
              the use or inability to use the materials on SocialScheduler, even if SocialScheduler or an
              authorized representative has been notified orally or in writing of the possibility of such damage.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">5. Accuracy of Materials</h2>
            <p>
              The materials appearing on SocialScheduler could include technical, typographical, or photographic
              errors. SocialScheduler does not warrant that any of the materials on SocialScheduler are accurate,
              complete, or current. SocialScheduler may make changes to the materials contained on SocialScheduler
              at any time without notice.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">6. Materials and Links</h2>
            <p>
              SocialScheduler has not reviewed all of the sites linked to its website and is not responsible
              for the contents of any such linked site. The inclusion of any link does not imply endorsement by
              SocialScheduler of the site. Use of any such linked website is at the user's own risk.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">7. Modifications</h2>
            <p>
              SocialScheduler may revise these terms of service for its website at any time without notice.
              By using this website, you are agreeing to be bound by the then current version of these terms
              of service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">8. Governing Law</h2>
            <p>
              These terms and conditions are governed by and construed in accordance with the laws of the
              jurisdiction in which SocialScheduler operates, and you irrevocably submit to the exclusive
              jurisdiction of the courts in that location.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">9. User Accounts and Credentials</h2>
            <p className="mb-3">
              You are responsible for maintaining the confidentiality of your account and password and for
              restricting access to your computer. You agree to accept responsibility for all activities that
              occur under your account or password. You should:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Notify SocialScheduler immediately of any unauthorized use of your account</li>
              <li>Never share your password or credentials with third parties</li>
              <li>Log out of your account when finished using the Service</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">10. Third-Party Services</h2>
            <p>
              SocialScheduler integrates with third-party social media platforms (TikTok, LinkedIn, Twitter/X).
              Your use of these platforms is subject to their respective terms of service. SocialScheduler is not
              responsible for the actions, policies, or content of these third-party platforms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">11. Contact Information</h2>
            <p>
              If you have any questions about these Terms of Service, please contact us at support@landingbits.net
            </p>
          </section>
        </div>

        {/* Footer Links */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex gap-6 text-sm text-gray-600">
            <Link href="/" className="hover:text-gray-900">
              Home
            </Link>
            <Link href="/policy" className="hover:text-gray-900">
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
