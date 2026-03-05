import PolicyLayout from '@/components/policies/PolicyLayout'
import { AlertTriangle, Scale, FileText, Shield, Mail, ExternalLink } from 'lucide-react'

const sections = [
  { id: 'general-disclaimer', title: '1. General Disclaimer', level: 1 },
  { id: 'not-legal-advice', title: '2. Not Legal Advice', level: 1 },
  { id: 'information-accuracy', title: '3. Information Accuracy', level: 1 },
  { id: 'no-warranties', title: '4. No Warranties', level: 1 },
  { id: 'limitation-liability', title: '5. Limitation of Liability', level: 1 },
  { id: 'third-party-links', title: '6. Third-Party Links', level: 1 },
  { id: 'immigration-outcomes', title: '7. Immigration Outcomes', level: 1 },
  { id: 'professional-advice', title: '8. Professional Advice Required', level: 1 },
  { id: 'changes', title: '9. Changes to Disclaimer', level: 1 },
  { id: 'contact', title: '10. Contact Us', level: 1 },
]

export default function DisclaimerPage() {
  return (
    <PolicyLayout
      title="Disclaimer"
      lastUpdated="January 2025"
      sections={sections}
      disclaimer={
        <div className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 border-l-4 border-red-500 p-6 mb-8 rounded-r-lg shadow-sm">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-xl font-bold text-red-900 dark:text-red-200 mb-2">
                ⚠️ Important Legal Disclaimer
              </h3>
              <p className="text-red-800 dark:text-red-300 leading-relaxed font-semibold text-lg mb-2">
                The information provided on this website is for general informational purposes only and does not constitute legal advice, 
                immigration advice, or professional consultation.
              </p>
              <p className="text-red-700 leading-relaxed">
                Swiss immigration laws are complex and change frequently. Always verify information with official sources and consult 
                with a certified Swiss immigration lawyer or authorized immigration consultant for your specific case.
              </p>
            </div>
          </div>
        </div>
      }
    >
      <section id="general-disclaimer" className="mb-12 scroll-mt-24">
        <div className="flex items-center gap-3 mb-6">
          <AlertTriangle className="w-6 h-6 text-blue-600" />
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            1. General Disclaimer
          </h2>
        </div>
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-sm">
          <p className="text-gray-700 dark:text-gray-200 text-lg leading-relaxed mb-4">
            Swiss Immigration Pro ("we," "our," or "us") provides educational and informational content related to Swiss immigration, 
            citizenship, and related topics. This platform is designed to assist users in understanding Swiss immigration processes, 
            requirements, and procedures.
          </p>
          <p className="text-gray-700 dark:text-gray-200 text-lg leading-relaxed">
            However, the information provided on this website is for general informational purposes only and should not be considered 
            as professional legal, immigration, or financial advice.
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
        <p className="text-gray-700 mb-6 text-lg leading-relaxed">
          The content on this platform does not constitute legal advice, immigration advice, or professional consultation. We are not a law firm, 
          and we do not provide legal services. The information presented is:
        </p>
        <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
              <span className="text-gray-700">General and educational in nature</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
              <span className="text-gray-700">Not tailored to your specific circumstances</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
              <span className="text-gray-700">Not a substitute for professional legal consultation</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
              <span className="text-gray-700">Not intended to create an attorney-client relationship</span>
            </li>
          </ul>
        </div>
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg mt-6">
          <p className="text-red-800 font-semibold">
            For legal advice specific to your situation, you must consult with a qualified Swiss immigration lawyer or authorized immigration consultant.
          </p>
        </div>
      </section>

      <section id="information-accuracy" className="mb-12 scroll-mt-24">
        <div className="flex items-center gap-3 mb-6">
          <FileText className="w-6 h-6 text-blue-600" />
          <h2 className="text-3xl font-bold text-gray-900">
            3. Information Accuracy
          </h2>
        </div>
        <p className="text-gray-700 mb-6 text-lg leading-relaxed">
          While we strive to provide accurate and up-to-date information:
        </p>
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm mb-6">
          <ul className="space-y-4">
            <li className="flex items-start gap-3">
              <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
              <div>
                <strong className="text-gray-900">Swiss immigration laws change frequently:</strong>
                <span className="text-gray-700 ml-2">Regulations, quotas, and requirements are updated regularly by SEM and cantonal authorities.</span>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
              <div>
                <strong className="text-gray-900">Cantonal variations:</strong>
                <span className="text-gray-700 ml-2">Each of Switzerland's 26 cantons may have different requirements and procedures.</span>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
              <div>
                <strong className="text-gray-900">No guarantee of accuracy:</strong>
                <span className="text-gray-700 ml-2">We cannot guarantee that all information is current, complete, or accurate.</span>
              </div>
            </li>
          </ul>
        </div>
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
          <p className="text-blue-800">
            <strong>Always verify current information:</strong> Check official sources such as{' '}
            <a href="https://www.sem.admin.ch" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-medium">
              SEM.admin.ch
            </a>{' '}
            and your local cantonal migration office before making decisions.
          </p>
        </div>
      </section>

      <section id="no-warranties" className="mb-12 scroll-mt-24">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
          4. No Warranties
        </h2>
        <p className="text-gray-700 dark:text-gray-200 mb-6 text-lg leading-relaxed">
          Swiss Immigration Pro makes no representations or warranties of any kind, express or implied, about:
        </p>
        <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6 border border-gray-100 dark:border-gray-700">
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
              <span className="text-gray-700 dark:text-gray-200">The completeness, accuracy, reliability, or suitability of the information</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
              <span className="text-gray-700 dark:text-gray-200">The availability, functionality, or performance of the platform</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
              <span className="text-gray-700 dark:text-gray-200">The results or outcomes of using our services</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
              <span className="text-gray-700 dark:text-gray-200">The accuracy of AI-generated responses or recommendations</span>
            </li>
          </ul>
        </div>
      </section>

      <section id="limitation-liability" className="mb-12 scroll-mt-24">
        <div className="flex items-center gap-3 mb-6">
          <Shield className="w-6 h-6 text-blue-600" />
          <h2 className="text-3xl font-bold text-gray-900">
            5. Limitation of Liability
          </h2>
        </div>
        <p className="text-gray-700 mb-6 text-lg leading-relaxed">
          To the fullest extent permitted by law, Swiss Immigration Pro, its operators, employees, affiliates, and partners shall not be liable for:
        </p>
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <ul className="space-y-4">
            <li className="flex items-start gap-3">
              <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
              <div>
                <strong className="text-gray-900">Any decisions made based on information from this platform</strong>
                <span className="text-gray-700 ml-2">including visa applications, permit choices, or immigration strategies</span>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
              <div>
                <strong className="text-gray-900">Any immigration application outcomes</strong>
                <span className="text-gray-700 ml-2">including denials, delays, or rejections</span>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
              <div>
                <strong className="text-gray-900">Financial losses</strong>
                <span className="text-gray-700 ml-2">including application fees, relocation costs, or lost opportunities</span>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
              <div>
                <strong className="text-gray-900">Errors or omissions in content</strong>
                <span className="text-gray-700 ml-2">including outdated information or technical inaccuracies</span>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
              <div>
                <strong className="text-gray-900">Technical issues</strong>
                <span className="text-gray-700 ml-2">including platform downtime, data loss, or service interruptions</span>
              </div>
            </li>
          </ul>
        </div>
      </section>

      <section id="third-party-links" className="mb-12 scroll-mt-24">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
          6. Third-Party Links
        </h2>
        <p className="text-gray-700 dark:text-gray-200 mb-6 text-lg leading-relaxed">
          Our platform may contain links to third-party websites, including official government sources, legal resources, and other immigration services. 
          These links are provided for convenience only.
        </p>
        <div className="bg-amber-50 dark:bg-amber-900/30 border-l-4 border-amber-500 p-4 rounded-r-lg">
          <p className="text-amber-800 dark:text-amber-200">
            We do not endorse, control, or assume responsibility for the content, privacy policies, or practices of third-party websites. 
            Accessing third-party links is at your own risk.
          </p>
        </div>
      </section>

      <section id="immigration-outcomes" className="mb-12 scroll-mt-24">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
          7. Immigration Outcomes
        </h2>
        <p className="text-gray-700 dark:text-gray-200 mb-6 text-lg leading-relaxed">
          We cannot guarantee any specific immigration outcomes, including:
        </p>
        <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6 border border-gray-100 dark:border-gray-700">
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
              <span className="text-gray-700 dark:text-gray-200">Visa or permit approval</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
              <span className="text-gray-700 dark:text-gray-200">Processing times or timelines</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
              <span className="text-gray-700 dark:text-gray-200">Citizenship eligibility or naturalization success</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
              <span className="text-gray-700 dark:text-gray-200">Job placement or employment opportunities</span>
            </li>
          </ul>
        </div>
        <p className="text-gray-700 dark:text-gray-200 mt-6 text-lg leading-relaxed">
          Immigration decisions are made solely by Swiss authorities (SEM, cantonal migration offices) based on individual circumstances, 
          current regulations, and available quotas.
        </p>
      </section>

      <section id="professional-advice" className="mb-12 scroll-mt-24">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
          8. Professional Advice Required
        </h2>
        <p className="text-gray-700 dark:text-gray-200 mb-6 text-lg leading-relaxed">
          For your specific immigration situation, we strongly recommend consulting with:
        </p>
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-5 shadow-sm">
            <div className="font-semibold text-gray-900 dark:text-white mb-2">Certified Immigration Lawyers</div>
            <div className="text-gray-600 dark:text-gray-400 text-sm">
              Licensed attorneys specializing in Swiss immigration law who can provide legal representation and advice.
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-5 shadow-sm">
            <div className="font-semibold text-gray-900 dark:text-white mb-2">Authorized Immigration Consultants</div>
            <div className="text-gray-600 dark:text-gray-400 text-sm">
              Certified consultants registered with Swiss authorities who can assist with applications and procedures.
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-5 shadow-sm">
            <div className="font-semibold text-gray-900 dark:text-white mb-2">Official Government Sources</div>
            <div className="text-gray-600 dark:text-gray-400 text-sm">
              State Secretariat for Migration (SEM) and cantonal migration offices for official requirements and procedures.
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-5 shadow-sm">
            <div className="font-semibold text-gray-900 dark:text-white mb-2">Swiss Embassies & Consulates</div>
            <div className="text-gray-600 dark:text-gray-400 text-sm">
              Official diplomatic missions for visa applications and country-specific requirements.
            </div>
          </div>
        </div>
      </section>

      <section id="changes" className="mb-12 scroll-mt-24">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
          9. Changes to Disclaimer
        </h2>
        <p className="text-gray-700 dark:text-gray-200 text-lg leading-relaxed">
          We reserve the right to modify this disclaimer at any time. Changes will be effective immediately upon posting to this page. 
          Your continued use of the platform after changes constitutes acceptance of the updated disclaimer.
        </p>
      </section>

      <section id="contact" className="mb-12 scroll-mt-24">
        <div className="flex items-center gap-3 mb-6">
          <Mail className="w-6 h-6 text-blue-600" />
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            10. Contact Us
          </h2>
        </div>
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-sm">
          <p className="text-gray-700 dark:text-gray-200 mb-4 text-lg leading-relaxed">
            If you have questions about this disclaimer, please contact:
          </p>
          <div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-5 border border-blue-100 dark:border-gray-700">
            <p className="font-semibold text-gray-900 dark:text-white mb-2">Legal Department</p>
            <p className="text-gray-700 dark:text-gray-200">
              Email:{' '}
              <a href="mailto:legal@swissimmigrationpro.com" className="text-blue-600 hover:underline font-medium">
                legal@swissimmigrationpro.com
              </a>
            </p>
          </div>
        </div>
      </section>
    </PolicyLayout>
  )
}
