import Link from "next/link";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Header */}
        <div className="mb-12">
          <Link
            href="/"
            className="text-blue-600 hover:text-blue-800 mb-4 inline-block"
          >
            ← Back to Home
          </Link>
          <h1 className="text-4xl font-bold mb-2">Privacy Policy</h1>
          <p className="text-gray-600">Last updated: November 2025</p>
        </div>

        {/* Content */}
        <div className="space-y-8 text-gray-700">
          <section>
            <h2 className="text-2xl font-bold mb-4">1. Introduction</h2>
            <p>
              SocialScheduler ("we," "us," "our," or "Company") is committed to
              protecting your privacy. This Privacy Policy explains how we
              collect, use, disclose, and safeguard your information when you
              use our website and services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">
              2. Information We Collect
            </h2>
            <p className="mb-3">
              We may collect information about you in a variety of ways. The
              information we may collect on the Site includes:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>
                <strong>Personal Data:</strong> Email address, name, and profile
                information
              </li>
              <li>
                <strong>Social Media Data:</strong> Your social media account
                handles and usernames (not passwords)
              </li>
              <li>
                <strong>Authentication Tokens:</strong> OAuth tokens from
                connected social platforms (TikTok, LinkedIn, Twitter)
              </li>
              <li>
                <strong>Usage Data:</strong> Information about how you interact
                with the Service
              </li>
              <li>
                <strong>Device Information:</strong> Browser type, IP address,
                operating system
              </li>
              <li>
                <strong>Cookies and Tracking:</strong> We use cookies to enhance
                your experience
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">
              3. Use of Your Information
            </h2>
            <p className="mb-3">
              Having accurate information about you permits us to provide you
              with a smooth, efficient, and customized experience. Specifically,
              we may use information collected about you via the Site to:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Create and manage your account</li>
              <li>Process transactions and send related information</li>
              <li>Authenticate your identity and access rights</li>
              <li>Generate AI content based on your preferences</li>
              <li>Schedule and publish posts to your social media accounts</li>
              <li>Provide customer service and respond to inquiries</li>
              <li>Monitor and improve the Service</li>
              <li>Send periodic emails regarding your account or purchase</li>
              <li>Fulfill and manage your orders or purchases</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">
              4. Social Media Authentication
            </h2>
            <p>
              SocialScheduler uses OAuth authentication with TikTok, LinkedIn,
              and Twitter/X. When you authorize SocialScheduler to access these
              platforms:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4 mt-3">
              <li>
                We receive an authentication token that allows us to post on
                your behalf
              </li>
              <li>We do NOT receive or store your social media passwords</li>
              <li>
                You can revoke access at any time through your social media
                account settings
              </li>
              <li>
                We only request the minimum permissions necessary (e.g., post
                creation, basic user info)
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">5. AI-Generated Content</h2>
            <p>
              SocialScheduler uses OpenAI's API to generate content suggestions.
              When you use our AI generation feature:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4 mt-3">
              <li>Your prompts are sent to OpenAI's servers</li>
              <li>
                Generated content is stored in your account for your reference
              </li>
              <li>
                We do not share your personal information with OpenAI beyond
                what's necessary
              </li>
              <li>
                Refer to OpenAI's privacy policy for their data handling
                practices
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">
              6. Disclosure of Your Information
            </h2>
            <p className="mb-3">
              We may disclose your information in the following situations:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>
                <strong>By Law or to Protect Rights:</strong> If required by law
                or to enforce our agreements
              </li>
              <li>
                <strong>Third-Party Service Providers:</strong> To vendors who
                assist us in operating our website
              </li>
              <li>
                <strong>Business Transfers:</strong> In connection with a merger
                or sale of assets
              </li>
              <li>
                <strong>Social Media Platforms:</strong> When posting content on
                your behalf through OAuth
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">
              7. Security of Your Information
            </h2>
            <p>
              We use administrative, technical, and physical security measures
              to protect your personal information. However, no method of
              transmission over the Internet or method of electronic storage is
              100% secure. While we strive to use commercially acceptable means
              to protect your personal information, we cannot guarantee its
              absolute security.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">
              8. Retention of Your Information
            </h2>
            <p>
              We will retain your personal information for as long as your
              account is active or as needed to provide you services. You can
              request deletion of your account and associated data at any time.
              We will also retain and use your information as necessary to
              comply with legal obligations.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">9. Your Privacy Rights</h2>
            <p className="mb-3">
              Depending on your location, you may have the following rights:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>
                <strong>Right to Access:</strong> You can request access to your
                personal information
              </li>
              <li>
                <strong>Right to Correct:</strong> You can request correction of
                inaccurate data
              </li>
              <li>
                <strong>Right to Delete:</strong> You can request deletion of
                your account and data
              </li>
              <li>
                <strong>Right to Data Portability:</strong> You can request your
                data in a portable format
              </li>
              <li>
                <strong>Right to Opt-Out:</strong> You can opt-out of marketing
                communications
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">
              10. Cookies and Tracking Technologies
            </h2>
            <p>
              We use cookies to enhance your browsing experience. These may
              include:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4 mt-3">
              <li>
                <strong>Session Cookies:</strong> Temporary cookies for
                authentication
              </li>
              <li>
                <strong>Persistent Cookies:</strong> Cookies that remain on your
                device for preference storage
              </li>
              <li>
                <strong>OAuth State Cookies:</strong> Cookies for secure OAuth
                flows
              </li>
            </ul>
            <p className="mt-3">
              You can control cookie settings in your browser, though disabling
              cookies may affect functionality.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">
              11. Changes to This Privacy Policy
            </h2>
            <p>
              We may update this privacy policy from time to time to reflect
              changes in our practices or for other operational, legal, or
              regulatory reasons. We will notify you of any material changes by
              updating the "Last updated" date of this Privacy Policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">12. Contact Us</h2>
            <p>
              If you have questions or comments about this Privacy Policy,
              please contact us at:
            </p>
            <div className="mt-4 p-4 bg-gray-100 rounded">
              <p>
                <strong>Email:</strong> support@landingbits.net
              </p>
              <p>
                <strong>Website:</strong> www.landingbits.net
              </p>
            </div>
          </section>
        </div>

        {/* Footer Links */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex gap-6 text-sm text-gray-600">
            <Link href="/" className="hover:text-gray-900">
              Home
            </Link>
            <Link href="/term" className="hover:text-gray-900">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
