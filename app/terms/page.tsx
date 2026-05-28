import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service | VERVE Run Club',
  description: 'Terms and conditions governing your use of the Verve Run Club platform.',
}

export default function TermsPage() {
  return (
    <div className="flex-1 min-h-screen font-sans">
      {/* Header */}
      <section className="pt-32 pb-12 md:pt-44 md:pb-16 px-8 md:px-16 max-w-[900px] mx-auto">
        <div className="text-[9px] tracking-[0.25em] uppercase font-bold text-[#E74431] mb-8">Legal</div>
        <h1 className="font-heading font-normal tracking-[-0.04em] leading-[0.9] text-[clamp(36px,6vw,72px)] mb-6">
          Terms of Service
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
            <h2 className="font-heading text-xl font-bold tracking-tight mb-4 text-foreground">1. Acceptance of Terms</h2>
            <p>
              By accessing or using Verve Run Club (&quot;Verve,&quot; &quot;the Platform&quot;), available at{' '}
              <Link href="https://verve-nu.vercel.app" className="text-[#E74431] hover:underline">verve-nu.vercel.app</Link>,
              you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the Platform.
            </p>
          </div>

          {/* 2 */}
          <div>
            <h2 className="font-heading text-xl font-bold tracking-tight mb-4 text-foreground">2. Description of Service</h2>
            <p>
              Verve is a social fitness and performance platform that allows athletes to connect their Strava accounts, track runs and activities, compete on leaderboards, participate in challenges, and visualize performance data through a modern web experience.
            </p>
          </div>

          {/* 3 */}
          <div>
            <h2 className="font-heading text-xl font-bold tracking-tight mb-4 text-foreground">3. User Accounts</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>You must have a valid Strava account to use Verve.</li>
              <li>You are responsible for maintaining the security of your account.</li>
              <li>You must provide accurate information when connecting your Strava account.</li>
              <li>You may not use another person&apos;s account without permission.</li>
              <li>You must be at least 13 years old to use the Platform.</li>
            </ul>
          </div>

          {/* 4 */}
          <div>
            <h2 className="font-heading text-xl font-bold tracking-tight mb-4 text-foreground">4. Acceptable Use</h2>
            <p className="mb-4">You agree not to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Use the Platform for any unlawful purpose.</li>
              <li>Submit false, misleading, or fabricated activity data.</li>
              <li>Attempt to manipulate leaderboards, XP, or challenge rankings through fraudulent means.</li>
              <li>Interfere with or disrupt the Platform&apos;s infrastructure or other users&apos; experience.</li>
              <li>Reverse engineer, decompile, or attempt to extract the source code of the Platform.</li>
              <li>Scrape, harvest, or collect data from the Platform without authorization.</li>
            </ul>
          </div>

          {/* 5 */}
          <div>
            <h2 className="font-heading text-xl font-bold tracking-tight mb-4 text-foreground">5. Strava Integration</h2>
            <p className="mb-4">
              Verve accesses your Strava data through the official Strava API under the permissions you grant during OAuth authorization. By connecting your Strava account:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>You authorize Verve to read your profile and activity data.</li>
              <li>You can revoke access at any time through your <Link href="https://www.strava.com/settings/apps" className="text-[#E74431] hover:underline">Strava settings</Link>.</li>
              <li>Verve complies with Strava&apos;s API Agreement and Brand Guidelines.</li>
            </ul>
          </div>

          {/* 6 */}
          <div>
            <h2 className="font-heading text-xl font-bold tracking-tight mb-4 text-foreground">6. Intellectual Property</h2>
            <p>
              All content, design, code, and branding associated with Verve Run Club are the property of Verve and its creators. You may not reproduce, distribute, or create derivative works from any part of the Platform without express written permission.
            </p>
          </div>

          {/* 7 */}
          <div>
            <h2 className="font-heading text-xl font-bold tracking-tight mb-4 text-foreground">7. Disclaimer of Warranties</h2>
            <p>
              The Platform is provided &quot;as is&quot; and &quot;as available&quot; without warranties of any kind, either express or implied. We do not guarantee that the Platform will be uninterrupted, error-free, or free of harmful components. Use of the Platform is at your own risk.
            </p>
          </div>

          {/* 8 */}
          <div>
            <h2 className="font-heading text-xl font-bold tracking-tight mb-4 text-foreground">8. Limitation of Liability</h2>
            <p>
              To the fullest extent permitted by law, Verve Run Club and its creators shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising out of or relating to your use of the Platform, including but not limited to loss of data, loss of goodwill, or any other intangible loss.
            </p>
          </div>

          {/* 9 */}
          <div>
            <h2 className="font-heading text-xl font-bold tracking-tight mb-4 text-foreground">9. Account Termination</h2>
            <p>
              We reserve the right to suspend or terminate your account at any time, with or without notice, for conduct that we determine violates these Terms or is harmful to other users, us, or third parties. You may also delete your account at any time by contacting us.
            </p>
          </div>

          {/* 10 */}
          <div>
            <h2 className="font-heading text-xl font-bold tracking-tight mb-4 text-foreground">10. Changes to Terms</h2>
            <p>
              We may modify these Terms at any time. Changes will be posted on this page with an updated revision date. Your continued use of the Platform after any changes constitutes your acceptance of the new Terms.
            </p>
          </div>

          {/* 11 */}
          <div>
            <h2 className="font-heading text-xl font-bold tracking-tight mb-4 text-foreground">11. Contact</h2>
            <p>
              For any questions regarding these Terms of Service, please contact us at:{' '}
              <a href="mailto:support@verve.run" className="text-[#E74431] hover:underline">support@verve.run</a>
            </p>
          </div>

        </div>
      </section>
    </div>
  )
}
