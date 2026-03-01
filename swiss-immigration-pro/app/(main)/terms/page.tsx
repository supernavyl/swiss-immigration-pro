import PolicyLayout from '@/components/policies/PolicyLayout'
import { AlertTriangle, FileText, Shield, CreditCard, Mail, Scale } from 'lucide-react'

const sections = [
  { id: 'acceptance', title: '1. Acceptance of Terms', level: 1 },
  { id: 'not-legal-advice', title: '2. Not Legal Advice', level: 1 },
  { id: 'use-license', title: '3. Use License', level: 1 },
  { id: 'accuracy', title: '4. Accuracy of Information', level: 1 },
  { id: 'limitation-liability', title: '5. Limitation of Liability', level: 1 },
  { id: 'subscriptions', title: '6. Subscriptions and Payments', level: 1 },
  { id: 'user-content', title: '7. User Content', level: 1 },
  { id: 'changes-terms', title: '8. Changes to Terms', level: 1 },
  { id: 'contact', title: '9. Contact', level: 1 },
]

export default function TermsOfServicePage() {
  return (
    <PolicyLayout
      title="Terms of Service"
      lastUpdated="January 2025"
      sections={sections}
      disclaimer={
        <div className="bg-gradient-to-r from-red-50 to-orange-50 border-l-4 border-red-500 p-6 mb-8 rounded-r-lg shadow-sm">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-xl font-bold text-red-900 mb-2 flex items-center gap-2">
                ⚠️ Important Legal Disclaimer
              </h3>
              <p className="text-red-800 mb-3 font-semibold text-lg leading-relaxed">
                This platform provides general educational information only. It does NOT constitute legal advice, immigration advice, or professional consultation.
              </p>
              <p className="text-red-700 leading-relaxed">
                Swiss immigration laws are complex and change frequently. Always verify information with official sources (SEM.admin.ch, Fedlex.admin.ch) and consult with a certified Swiss immigration lawyer or authorized immigration consultant for your specific case.
              </p>
            </div>
          </div>
        </div>
      }
    >
      <section id="acceptance" className="mb-12 scroll-mt-24">
        <div className="flex items-center gap-3 mb-6">
          <FileText className="w-6 h-6 text-blue-600" />
          <h2 className="text-3xl font-bold text-gray-900">
            1. Acceptance of Terms
          </h2>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <p className="text-gray-700 text-lg leading-relaxed">
            By accessing and using Swiss Immigration Pro (&quot;the Service&quot;), you accept and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the Service.
          </p>
        </div>
      </section>

      <section id="not-legal-advice" className="mb-12 scroll-mt-24">
        <div className="flex items-center gap-3 mb-6">
          <Scale className="w-6 h-6 text-blue-600" />
          <h2 className="text-3xl font-bold text-gray-900">
            2. Not Legal Advice
          </h2>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm mb-6">
          <p className="text-gray-700 mb-4 text-lg leading-relaxed">
            The information provided on this platform is for educational and informational purposes only. It is not a substitute for professional legal advice, immigration consultation, or official government guidance. We are not a law firm, and we do not provide legal services.
          </p>
          <p className="text-gray-700 mb-6 text-lg leading-relaxed">
            You should not rely on information from this Service as legal advice. For your specific immigration situation, you must consult with:
          </p>
          <div className="bg-gray-50 rounded-lg p-5 border border-gray-100">
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                <span className="text-gray-700">A certified Swiss immigration lawyer</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                <span className="text-gray-700">An authorized immigration consultant</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                <span className="text-gray-700">Official government sources (SEM, cantonal migration offices)</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section id="use-license" className="mb-12 scroll-mt-24">
        <div className="flex items-center gap-3 mb-6">
          <Shield className="w-6 h-6 text-blue-600" />
          <h2 className="text-3xl font-bold text-gray-900">
            3. Use License
          </h2>
        </div>
        <p className="text-gray-700 mb-6 text-lg leading-relaxed">
          Permission is granted to temporarily access the materials on our website for personal, non-commercial use only. This license does not include:
        </p>
        <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
              <span className="text-gray-700">Modification or copying of materials</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
              <span className="text-gray-700">Use of materials for commercial purposes</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
              <span className="text-gray-700">Removal of copyright or proprietary notations</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
              <span className="text-gray-700">Transfer of materials to another person or server</span>
            </li>
          </ul>
        </div>
      </section>

      <section id="accuracy" className="mb-12 scroll-mt-24">
        <div className="flex items-center gap-3 mb-6">
          <FileText className="w-6 h-6 text-blue-600" />
          <h2 className="text-3xl font-bold text-gray-900">
            4. Accuracy of Information
          </h2>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm mb-6">
          <p className="text-gray-700 mb-6 text-lg leading-relaxed">
            While we strive to provide accurate and up-to-date information, Swiss immigration laws and regulations change frequently. We cannot guarantee the accuracy, completeness, or timeliness of any information on this Service. Information may become outdated without notice.
          </p>
          <p className="text-gray-700 mb-6 text-lg leading-relaxed">
            Always verify current regulations with official sources:
          </p>
          <div className="bg-blue-50 rounded-lg p-5 border border-blue-100">
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                <span className="text-gray-700">
                  State Secretariat for Migration (SEM):{' '}
                  <a href="https://www.sem.admin.ch" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-medium">
                    sem.admin.ch
                  </a>
                </span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                <span className="text-gray-700">
                  Federal Law Collection:{' '}
                  <a href="https://www.fedlex.admin.ch" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-medium">
                    fedlex.admin.ch
                  </a>
                </span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                <span className="text-gray-700">Your local cantonal migration office</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section id="limitation-liability" className="mb-12 scroll-mt-24">
        <div className="flex items-center gap-3 mb-6">
          <AlertTriangle className="w-6 h-6 text-blue-600" />
          <h2 className="text-3xl font-bold text-gray-900">
            5. Limitation of Liability
          </h2>
        </div>
        <p className="text-gray-700 mb-6 text-lg leading-relaxed">
          To the fullest extent permitted by law, Swiss Immigration Pro, its operators, employees, and affiliates shall not be liable for any direct, indirect, incidental, special, consequential, or punitive damages resulting from:
        </p>
        <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
              <span className="text-gray-700">Your use or inability to use the Service</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
              <span className="text-gray-700">Any errors or omissions in the content</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
              <span className="text-gray-700">Any decisions made based on information from this Service</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
              <span className="text-gray-700">Any immigration application outcomes</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
              <span className="text-gray-700">Loss of data, profits, or business opportunities</span>
            </li>
          </ul>
        </div>
      </section>

      <section id="subscriptions" className="mb-12 scroll-mt-24">
        <div className="flex items-center gap-3 mb-6">
          <CreditCard className="w-6 h-6 text-blue-600" />
          <h2 className="text-3xl font-bold text-gray-900">
            6. Subscriptions and Payments
          </h2>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <p className="text-gray-700 text-lg leading-relaxed">
            Subscription fees are charged monthly or annually as selected. You may cancel your subscription at any time. All prices are in CHF (Swiss Francs).
          </p>
        </div>
      </section>

      <section id="user-content" className="mb-12 scroll-mt-24">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">
          7. User Content
        </h2>
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <p className="text-gray-700 text-lg leading-relaxed">
            You are responsible for any content you submit through the Service. You agree not to submit false, misleading, or illegal information. We reserve the right to remove any content that violates these terms.
          </p>
        </div>
      </section>

      <section id="changes-terms" className="mb-12 scroll-mt-24">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">
          8. Changes to Terms
        </h2>
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <p className="text-gray-700 text-lg leading-relaxed">
            We reserve the right to modify these terms at any time. Continued use of the Service after changes constitutes acceptance of the new terms.
          </p>
        </div>
      </section>

      <section id="contact" className="mb-12 scroll-mt-24">
        <div className="flex items-center gap-3 mb-6">
          <Mail className="w-6 h-6 text-blue-600" />
          <h2 className="text-3xl font-bold text-gray-900">
            9. Contact
          </h2>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <p className="text-gray-700 text-lg leading-relaxed">
            For questions about these Terms of Service, please contact us at:{' '}
            <a href="mailto:legal@swissimmigrationpro.com" className="text-blue-600 hover:underline font-medium">
              legal@swissimmigrationpro.com
            </a>
          </p>
        </div>
      </section>
    </PolicyLayout>
  )
}
