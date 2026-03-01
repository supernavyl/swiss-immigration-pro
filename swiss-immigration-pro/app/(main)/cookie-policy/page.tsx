import PolicyLayout from '@/components/policies/PolicyLayout'
import { Cookie, Settings, Shield, BarChart3 } from 'lucide-react'

const sections = [
  { id: 'what-are-cookies', title: 'What Are Cookies', level: 1 },
  { id: 'how-we-use', title: 'How We Use Cookies', level: 1 },
  { id: 'types-cookies', title: 'Types of Cookies We Use', level: 1 },
  { id: 'managing-cookies', title: 'Managing Cookies', level: 1 },
  { id: 'third-party', title: 'Third-Party Cookies', level: 1 },
  { id: 'updates', title: 'Updates to This Policy', level: 1 },
]

export default function CookiePolicyPage() {
  return (
    <PolicyLayout
      title="Cookie Policy"
      lastUpdated={new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
      sections={sections}
    >
      <section id="what-are-cookies" className="mb-12 scroll-mt-24">
        <div className="flex items-center gap-3 mb-6">
          <Cookie className="w-6 h-6 text-blue-600" />
          <h2 className="text-3xl font-bold text-gray-900">
            What Are Cookies
          </h2>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <p className="text-gray-700 mb-4 text-lg leading-relaxed">
            Cookies are small text files that are placed on your computer or mobile device when you visit our website. They help us provide you with a better experience and allow us to understand how you use our site.
          </p>
          <p className="text-gray-700 text-lg leading-relaxed">
            Cookies are widely used to make websites work more efficiently and provide information to website owners. Most web browsers automatically accept cookies, but you can modify your browser settings to decline cookies if you prefer.
          </p>
        </div>
      </section>

      <section id="how-we-use" className="mb-12 scroll-mt-24">
        <div className="flex items-center gap-3 mb-6">
          <Settings className="w-6 h-6 text-blue-600" />
          <h2 className="text-3xl font-bold text-gray-900">
            How We Use Cookies
          </h2>
        </div>
        <p className="text-gray-700 mb-6 text-lg leading-relaxed">
          We use cookies for the following purposes:
        </p>
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-blue-600" />
              </div>
              <div className="font-semibold text-gray-900">Authentication</div>
            </div>
            <p className="text-gray-600 text-sm">Maintain your session and keep you logged in securely</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Settings className="w-5 h-5 text-blue-600" />
              </div>
              <div className="font-semibold text-gray-900">Preferences</div>
            </div>
            <p className="text-gray-600 text-sm">Remember your settings and preferences</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-blue-600" />
              </div>
              <div className="font-semibold text-gray-900">Analytics</div>
            </div>
            <p className="text-gray-600 text-sm">Analyze how you use our website (anonymized)</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Cookie className="w-5 h-5 text-blue-600" />
              </div>
              <div className="font-semibold text-gray-900">Functionality</div>
            </div>
            <p className="text-gray-600 text-sm">Enable enhanced features and functionality</p>
          </div>
        </div>
        <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
              <span className="text-gray-700">To remember your preferences and settings</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
              <span className="text-gray-700">To analyze how you use our website</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
              <span className="text-gray-700">To improve our services and user experience</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
              <span className="text-gray-700">To authenticate users and maintain sessions</span>
            </li>
          </ul>
        </div>
      </section>

      <section id="types-cookies" className="mb-12 scroll-mt-24">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">
          Types of Cookies We Use
        </h2>
        <div className="space-y-4">
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-3">Essential Cookies</h3>
            <p className="text-gray-600 mb-3">
              These cookies are necessary for the website to function properly. They enable core functionality such as security, network management, and accessibility.
            </p>
            <div className="text-sm text-gray-500">
              <strong>Duration:</strong> Session cookies (deleted when you close your browser)
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-3">Performance Cookies</h3>
            <p className="text-gray-600 mb-3">
              These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously.
            </p>
            <div className="text-sm text-gray-500">
              <strong>Duration:</strong> Up to 2 years
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-3">Functionality Cookies</h3>
            <p className="text-gray-600 mb-3">
              These cookies allow the website to remember choices you make (such as your language preference) and provide enhanced, personalized features.
            </p>
            <div className="text-sm text-gray-500">
              <strong>Duration:</strong> Up to 1 year
            </div>
          </div>
        </div>
      </section>

      <section id="managing-cookies" className="mb-12 scroll-mt-24">
        <div className="flex items-center gap-3 mb-6">
          <Settings className="w-6 h-6 text-blue-600" />
          <h2 className="text-3xl font-bold text-gray-900">
            Managing Cookies
          </h2>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm mb-6">
          <p className="text-gray-700 mb-6 text-lg leading-relaxed">
            You can control and manage cookies through your browser settings. Please note that disabling cookies may affect the functionality of our website.
          </p>
          <div className="bg-blue-50 rounded-lg p-5 border border-blue-100">
            <h4 className="font-semibold text-gray-900 mb-3">Browser Settings:</h4>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                <span><strong>Chrome:</strong> Settings → Privacy and Security → Cookies and other site data</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                <span><strong>Firefox:</strong> Options → Privacy & Security → Cookies and Site Data</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                <span><strong>Safari:</strong> Preferences → Privacy → Cookies and website data</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                <span><strong>Edge:</strong> Settings → Cookies and site permissions → Cookies and site data</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-lg">
          <p className="text-amber-800">
            <strong>Note:</strong> Disabling essential cookies may prevent you from using certain features of our website, such as logging in or accessing secure areas.
          </p>
        </div>
      </section>

      <section id="third-party" className="mb-12 scroll-mt-24">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">
          Third-Party Cookies
        </h2>
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <p className="text-gray-700 mb-4 text-lg leading-relaxed">
            We may use third-party services that set cookies on your device. These include:
          </p>
          <div className="bg-gray-50 rounded-lg p-5 border border-gray-100">
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                <div>
                  <strong className="text-gray-900">Google Analytics:</strong>
                  <span className="text-gray-700 ml-2">Helps us understand website usage (anonymized data)</span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                <div>
                  <strong className="text-gray-900">Stripe:</strong>
                  <span className="text-gray-700 ml-2">Payment processing (essential for transactions)</span>
                </div>
              </li>
            </ul>
          </div>
          <p className="text-gray-700 mt-6 text-lg leading-relaxed">
            These third-party services have their own privacy policies and cookie practices. We recommend reviewing their policies for more information.
          </p>
        </div>
      </section>

      <section id="updates" className="mb-12 scroll-mt-24">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">
          Updates to This Policy
        </h2>
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <p className="text-gray-700 text-lg leading-relaxed">
            We may update this Cookie Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons. We will notify you of any material changes by posting the new Cookie Policy on this page and updating the &quot;Last updated&quot; date.
          </p>
        </div>
      </section>
    </PolicyLayout>
  )
}
