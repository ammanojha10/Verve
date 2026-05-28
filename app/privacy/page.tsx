import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy | VERVE Run Club',
  description: 'How Verve Run Club collects, uses, and protects your data when using our platform and Strava integration.',
}

export default function PrivacyPage() {
  return (
    <div className="flex-1 min-h-screen font-sans">
      {/* Header */}
      <section className="pt-32 pb-12 md:pt-44 md:pb-16 px-8 md:px-16 max-w-[900px] mx-auto">
        <div className="text-[9px] tracking-[0.25em] uppercase font-bold text-[#E74431] mb-8">Legal</div>
        <h1 className="font-heading font-normal tracking-[-0.04em] leading-[0.9] text-[clamp(36px,6vw,72px)] mb-6">
          Privacy Policy
        </h1>
        <p className="text-sm text-foreground/50">
          Last updated: May 28, 2026
        </p>
      </section>

      {/* Content */}
      <section className="px-8 md:px-16 pb-24 md:pb-32 max-w-[900px] mx-auto">
        <div className="space-y-12 text-[15px] leading-relaxed text-foreground/80">

          {/* 1 */}
          <div>
            <h2 className="font-heading text-xl font-bold tracking-tight mb-4 text-foreground">1. Introduction</h2>
            <p>
              Verve Run Club (&quot;Verve,&quot; &quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) operates the web application located at{' '}
              <Link href="https://verve-nu.vercel.app" className="text-[#E74431] hover:underline">verve-nu.vercel.app</Link>.
              This Privacy Policy explains how we collect, use, store, and protect your personal information when you use our platform.
            </p>
          </div>

          {/* 2 */}
          <div>
            <h2 className="font-heading text-xl font-bold tracking-tight mb-4 text-foreground">2. Data We Collect</h2>
            <p className="mb-4">When you connect your Strava account to Verve, we collect the following information through the Strava API:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Profile Information:</strong> Your name, profile photo, and Strava athlete ID.</li>
              <li><strong>Activity Data:</strong> Running activities including distance, duration, pace, elevation, and timestamps.</li>
              <li><strong>Authentication Tokens:</strong> OAuth access and refresh tokens to maintain your Strava connection.</li>
            </ul>
            <p className="mt-4">We do <strong>not</strong> collect your email address, payment information, or any data from non-running activities unless explicitly required for platform features.</p>
          </div>

          {/* 3 */}
          <div>
            <h2 className="font-heading text-xl font-bold tracking-tight mb-4 text-foreground">3. How We Use Your Data</h2>
            <p className="mb-4">Your data is used exclusively to power the Verve platform:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Display your personal running statistics and dashboard.</li>
              <li>Calculate XP, tiers, and leaderboard rankings.</li>
              <li>Track challenge participation and progress.</li>
              <li>Generate community-wide analytics and insights.</li>
              <li>Personalize your experience on the platform.</li>
            </ul>
          </div>

          {/* 4 */}
          <div>
            <h2 className="font-heading text-xl font-bold tracking-tight mb-4 text-foreground">4. Data Storage & Security</h2>
            <p className="mb-4">
              Your data is stored securely in our database hosted on Supabase (powered by PostgreSQL). Authentication tokens are stored server-side and are <strong>never</strong> exposed to the client or browser.
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>All API communication uses HTTPS encryption.</li>
              <li>OAuth tokens are refreshed automatically and stored only on the server.</li>
              <li>Session cookies are HTTP-only and use the <code className="bg-foreground/10 px-1.5 py-0.5 rounded text-sm">SameSite=Lax</code> attribute.</li>
              <li>Service role keys are never shipped to the frontend.</li>
            </ul>
          </div>

          {/* 5 */}
          <div>
            <h2 className="font-heading text-xl font-bold tracking-tight mb-4 text-foreground">5. Third-Party Services</h2>
            <p className="mb-4">We integrate with the following third-party services:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Strava API:</strong> For activity and profile data syncing. See <Link href="https://www.strava.com/legal/privacy" className="text-[#E74431] hover:underline">Strava&apos;s Privacy Policy</Link>.</li>
              <li><strong>Supabase:</strong> For database and authentication services.</li>
              <li><strong>Vercel:</strong> For hosting and deployment. See <Link href="https://vercel.com/legal/privacy-policy" className="text-[#E74431] hover:underline">Vercel&apos;s Privacy Policy</Link>.</li>
              <li><strong>Vercel Analytics:</strong> Anonymous, cookie-free page view analytics.</li>
            </ul>
          </div>

          {/* 6 */}
          <div>
            <h2 className="font-heading text-xl font-bold tracking-tight mb-4 text-foreground">6. Data Sharing</h2>
            <p>
              We do <strong>not</strong> sell, rent, or share your personal data with any third parties for marketing or advertising purposes. Your activity data is only visible to other Verve users through public features like leaderboards and challenges, where participation is voluntary.
            </p>
          </div>

          {/* 7 */}
          <div>
            <h2 className="font-heading text-xl font-bold tracking-tight mb-4 text-foreground">7. Data Deletion & Your Rights</h2>
            <p className="mb-4">You have the right to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Disconnect Strava:</strong> Revoke Verve&apos;s access at any time from your <Link href="https://www.strava.com/settings/apps" className="text-[#E74431] hover:underline">Strava Connected Apps</Link> settings.</li>
              <li><strong>Request Data Deletion:</strong> Email us at <a href="mailto:support@verve.run" className="text-[#E74431] hover:underline">support@verve.run</a> to request complete deletion of your account and all associated data.</li>
              <li><strong>Access Your Data:</strong> Request a copy of all personal data we hold about you.</li>
            </ul>
            <p className="mt-4">Upon receiving a valid deletion request, we will permanently remove your profile, activity history, and authentication tokens within 30 days.</p>
          </div>

          {/* 8 */}
          <div>
            <h2 className="font-heading text-xl font-bold tracking-tight mb-4 text-foreground">8. Cookies</h2>
            <p>
              Verve uses a minimal set of session cookies to maintain your login state. These cookies store your user ID and display name. We do not use tracking cookies, advertising cookies, or any third-party cookie-based analytics.
            </p>
          </div>

          {/* 9 */}
          <div>
            <h2 className="font-heading text-xl font-bold tracking-tight mb-4 text-foreground">9. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated revision date. Continued use of the platform after changes constitutes acceptance of the revised policy.
            </p>
          </div>

          {/* 10 */}
          <div>
            <h2 className="font-heading text-xl font-bold tracking-tight mb-4 text-foreground">10. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy or your data, please contact us at:{' '}
              <a href="mailto:support@verve.run" className="text-[#E74431] hover:underline">support@verve.run</a>
            </p>
          </div>

        </div>
      </section>
    </div>
  )
}
