import PolicyLayout from '@/components/policies/PolicyLayout'
import { Shield, Lock, Database, Users, Mail, FileText } from 'lucide-react'

const sections = [
  { id: 'information-collect', title: '1. Information We Collect', level: 1 },
  { id: 'how-we-use', title: '2. How We Use Your Information', level: 1 },
  { id: 'data-storage', title: '3. Data Storage and Security', level: 1 },
  { id: 'third-party', title: '4. Third-Party Services', level: 1 },
  { id: 'your-rights', title: '5. Your Rights (GDPR & FADP)', level: 1 },
  { id: 'cookies-tracking', title: '6. Cookies and Tracking', level: 1 },
  { id: 'data-retention', title: '7. Data Retention', level: 1 },
  { id: 'children-privacy', title: '8. Children\'s Privacy', level: 1 },
  { id: 'changes', title: '9. Changes to This Policy', level: 1 },
  { id: 'contact', title: '10. Contact Us', level: 1 },
]

export default function PrivacyPolicyPage() {
  return (
    <PolicyLayout
      title="Privacy Policy"
      lastUpdated="January 2025"
      sections={sections}
      disclaimer={
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-500 p-6 mb-8 rounded-r-lg shadow-sm">
          <div className="flex items-start gap-3">
            <Shield className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-xl font-bold text-blue-900 mb-2">
                GDPR & Swiss Data Protection Compliance
              </h3>
              <p className="text-blue-800 leading-relaxed">
                We are committed to protecting your privacy and comply with the General Data Protection Regulation (GDPR) and Swiss Federal Data Protection Act (FADP). Your data is processed securely and transparently.
              </p>
            </div>
          </div>
        </div>
      }
    >
      <section id="information-collect" className="mb-12 scroll-mt-24">
        <div className="flex items-center gap-3 mb-6">
          <FileText className="w-6 h-6 text-blue-600" />
          <h2 className="text-3xl font-bold text-gray-900">
            1. Information We Collect
          </h2>
        </div>
        <p className="text-gray-700 mb-6 text-lg leading-relaxed">
          We collect information that you provide directly to us:
        </p>
        <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
          <ul className="space-y-4">
            <li className="flex items-start gap-3">
              <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
              <div>
                <strong className="text-gray-900">Account Information:</strong>
                <span className="text-gray-700 ml-2">Name, email address, password (hashed)</span>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
              <div>
                <strong className="text-gray-900">Profile Data:</strong>
                <span className="text-gray-700 ml-2">Country of origin, immigration goals, quiz results</span>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
              <div>
                <strong className="text-gray-900">Usage Data:</strong>
                <span className="text-gray-700 ml-2">Chat messages, module progress, feature usage</span>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
              <div>
                <strong className="text-gray-900">Payment Information:</strong>
                <span className="text-gray-700 ml-2">Processed securely through Stripe (we do not store full card details)</span>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
              <div>
                <strong className="text-gray-900">Technical Data:</strong>
                <span className="text-gray-700 ml-2">IP address, browser type, device information</span>
              </div>
            </li>
          </ul>
        </div>
      </section>

      <section id="how-we-use" className="mb-12 scroll-mt-24">
        <div className="flex items-center gap-3 mb-6">
          <Users className="w-6 h-6 text-blue-600" />
          <h2 className="text-3xl font-bold text-gray-900">
            2. How We Use Your Information
          </h2>
        </div>
        <p className="text-gray-700 mb-6 text-lg leading-relaxed">
          We use your information to:
        </p>
        <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
              <span className="text-gray-700">Provide and improve our services</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
              <span className="text-gray-700">Process payments and manage subscriptions</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
              <span className="text-gray-700">Send important service updates and notifications</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
              <span className="text-gray-700">Personalize your experience (e.g., layer-specific content)</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
              <span className="text-gray-700">Analyze usage patterns to improve the platform</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
              <span className="text-gray-700">Comply with legal obligations</span>
            </li>
          </ul>
        </div>
        <div className="mt-6 bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg">
          <p className="text-green-800 font-medium">
            We do NOT sell your personal information to third parties.
          </p>
        </div>
      </section>

      <section id="data-storage" className="mb-12 scroll-mt-24">
        <div className="flex items-center gap-3 mb-6">
          <Lock className="w-6 h-6 text-blue-600" />
          <h2 className="text-3xl font-bold text-gray-900">
            3. Data Storage and Security
          </h2>
        </div>
        <p className="text-gray-700 mb-6 text-lg leading-relaxed">
          Your data is stored securely using industry-standard encryption:
        </p>
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
            <div className="font-semibold text-gray-900 mb-2">Database</div>
            <div className="text-gray-600">Encrypted PostgreSQL (Supabase)</div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
            <div className="font-semibold text-gray-900 mb-2">Authentication</div>
            <div className="text-gray-600">Secure password hashing (bcrypt)</div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
            <div className="font-semibold text-gray-900 mb-2">Payments</div>
            <div className="text-gray-600">PCI-DSS compliant (Stripe)</div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
            <div className="font-semibold text-gray-900 mb-2">Transmission</div>
            <div className="text-gray-600">HTTPS/TLS encryption</div>
          </div>
        </div>
        <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-lg">
          <p className="text-amber-800">
            While we implement strong security measures, no system is 100% secure. We cannot guarantee absolute security.
          </p>
        </div>
      </section>

      <section id="third-party" className="mb-12 scroll-mt-24">
        <div className="flex items-center gap-3 mb-6">
          <Database className="w-6 h-6 text-blue-600" />
          <h2 className="text-3xl font-bold text-gray-900">
            4. Third-Party Services
          </h2>
        </div>
        <p className="text-gray-700 mb-6 text-lg leading-relaxed">
          We use trusted third-party services that may process your data:
        </p>
        <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
          <ul className="space-y-4">
            <li className="flex items-start gap-3">
              <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
              <div>
                <strong className="text-gray-900">Supabase:</strong>
                <span className="text-gray-700 ml-2">Database and authentication (GDPR compliant)</span>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
              <div>
                <strong className="text-gray-900">Stripe:</strong>
                <span className="text-gray-700 ml-2">Payment processing (PCI-DSS certified)</span>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
              <div>
                <strong className="text-gray-900">Groq/OpenAI:</strong>
                <span className="text-gray-700 ml-2">AI chatbot responses (data not stored by AI providers)</span>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
              <div>
                <strong className="text-gray-900">Vercel:</strong>
                <span className="text-gray-700 ml-2">Hosting infrastructure (GDPR compliant)</span>
              </div>
            </li>
          </ul>
        </div>
        <p className="text-gray-700 mt-6 text-lg leading-relaxed">
          These services have their own privacy policies. We only share data necessary for service provision.
        </p>
      </section>

      <section id="your-rights" className="mb-12 scroll-mt-24">
        <div className="flex items-center gap-3 mb-6">
          <Shield className="w-6 h-6 text-blue-600" />
          <h2 className="text-3xl font-bold text-gray-900">
            5. Your Rights (GDPR & FADP)
          </h2>
        </div>
        <p className="text-gray-700 mb-6 text-lg leading-relaxed">
          You have the right to:
        </p>
        <div className="grid md:grid-cols-2 gap-4">
          {[
            { title: 'Access', desc: 'Request a copy of your personal data' },
            { title: 'Rectification', desc: 'Correct inaccurate information' },
            { title: 'Erasure', desc: 'Request deletion of your data ("right to be forgotten")' },
            { title: 'Portability', desc: 'Receive your data in a machine-readable format' },
            { title: 'Objection', desc: 'Object to processing of your data' },
            { title: 'Restriction', desc: 'Request limitation of data processing' },
          ].map((right, idx) => (
            <div key={idx} className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="font-semibold text-gray-900 mb-2">{right.title}</div>
              <div className="text-gray-600 text-sm">{right.desc}</div>
            </div>
          ))}
        </div>
        <div className="mt-6 bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
          <p className="text-blue-800">
            To exercise these rights, contact us at:{' '}
            <a href="mailto:privacy@swissimmigrationpro.com" className="font-semibold hover:underline">
              privacy@swissimmigrationpro.com
            </a>
          </p>
        </div>
      </section>

      <section id="cookies-tracking" className="mb-12 scroll-mt-24">
        <div className="flex items-center gap-3 mb-6">
          <FileText className="w-6 h-6 text-blue-600" />
          <h2 className="text-3xl font-bold text-gray-900">
            6. Cookies and Tracking
          </h2>
        </div>
        <p className="text-gray-700 mb-6 text-lg leading-relaxed">
          We use cookies and similar technologies to:
        </p>
        <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
              <span className="text-gray-700">Maintain your session and authentication</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
              <span className="text-gray-700">Remember your preferences</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
              <span className="text-gray-700">Analyze site usage (Google Analytics - anonymized)</span>
            </li>
          </ul>
        </div>
        <p className="text-gray-700 mt-6 text-lg leading-relaxed">
          You can control cookies through your browser settings. Some features may not work if cookies are disabled.
        </p>
      </section>

      <section id="data-retention" className="mb-12 scroll-mt-24">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">
          7. Data Retention
        </h2>
        <p className="text-gray-700 mb-6 text-lg leading-relaxed">
          We retain your data for as long as necessary to provide services or as required by law:
        </p>
        <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
          <ul className="space-y-4">
            <li className="flex items-start gap-3">
              <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
              <div>
                <strong className="text-gray-900">Active accounts:</strong>
                <span className="text-gray-700 ml-2">Until account deletion</span>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
              <div>
                <strong className="text-gray-900">Payment records:</strong>
                <span className="text-gray-700 ml-2">7 years (legal requirement)</span>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
              <div>
                <strong className="text-gray-900">Chat messages:</strong>
                <span className="text-gray-700 ml-2">Until account deletion or 2 years of inactivity</span>
              </div>
            </li>
          </ul>
        </div>
      </section>

      <section id="children-privacy" className="mb-12 scroll-mt-24">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">
          8. Children&apos;s Privacy
        </h2>
        <div className="bg-amber-50 border-l-4 border-amber-500 p-6 rounded-r-lg">
          <p className="text-amber-800 text-lg leading-relaxed">
            Our Service is not intended for users under 18 years of age. We do not knowingly collect personal information from children.
          </p>
        </div>
      </section>

      <section id="changes" className="mb-12 scroll-mt-24">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">
          9. Changes to This Policy
        </h2>
        <p className="text-gray-700 text-lg leading-relaxed">
          We may update this Privacy Policy from time to time. We will notify you of significant changes via email or a notice on the Service.
        </p>
      </section>

      <section id="contact" className="mb-12 scroll-mt-24">
        <div className="flex items-center gap-3 mb-6">
          <Mail className="w-6 h-6 text-blue-600" />
          <h2 className="text-3xl font-bold text-gray-900">
            10. Contact Us
          </h2>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <p className="text-gray-700 mb-4 text-lg leading-relaxed">
            For privacy-related questions or to exercise your rights, contact:
          </p>
          <div className="bg-blue-50 rounded-lg p-5 border border-blue-100">
            <p className="font-semibold text-gray-900 mb-2">Data Protection Officer</p>
            <p className="text-gray-700">
              Email:{' '}
              <a href="mailto:privacy@swissimmigrationpro.com" className="text-blue-600 hover:underline font-medium">
                privacy@swissimmigrationpro.com
              </a>
            </p>
          </div>
          <p className="text-gray-700 mt-6 text-lg leading-relaxed">
            You also have the right to lodge a complaint with your local data protection authority.
          </p>
        </div>
      </section>
    </PolicyLayout>
  )
}
