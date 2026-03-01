'use client'

import { useState } from 'react'
import { 
  FileText, 
  User, 
  Briefcase, 
  Home, 
  CheckCircle2, 
  Download, 
  ArrowRight, 
  ShieldCheck, 
  Info,
  Loader2,
  Plus,
  Trash2,
  AlertCircle,
  Sparkles,
  CreditCard,
  Building2
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'

interface DossierData {
  personal: {
    fullName: string
    email: string
    phone: string
    currentAddress: string
    nationality: string
    permitType: string
    civilStatus: string
  }
  employment: {
    employer: string
    position: string
    salary: string
    startDate: string
    contractType: string
  }
  documents: {
    idCopy: boolean
    permitCopy: boolean
    debtExtract: boolean
    salarySlips: boolean
    liabilityInsurance: boolean
  }
}

export default function DossierGenerator() {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [generated, setGenerated] = useState(false)
  
  const [data, setData] = useState<DossierData>({
    personal: {
      fullName: '',
      email: '',
      phone: '',
      currentAddress: '',
      nationality: '',
      permitType: 'B Permit',
      civilStatus: 'Single'
    },
    employment: {
      employer: '',
      position: '',
      salary: '',
      startDate: '',
      contractType: 'Permanent'
    },
    documents: {
      idCopy: false,
      permitCopy: false,
      debtExtract: false,
      salarySlips: false,
      liabilityInsurance: false
    }
  })

  const updatePersonal = (field: string, value: string) => {
    setData(prev => ({ ...prev, personal: { ...prev.personal, [field]: value } }))
  }

  const updateEmployment = (field: string, value: string) => {
    setData(prev => ({ ...prev, employment: { ...prev.employment, [field]: value } }))
  }

  const toggleDocument = (field: keyof DossierData['documents']) => {
    setData(prev => ({ ...prev, documents: { ...prev.documents, [field]: !prev.documents[field] } }))
  }

  const handleGenerate = async () => {
    setLoading(true)
    // Simulate generation
    await new Promise(resolve => setTimeout(resolve, 2500))
    setLoading(false)
    setGenerated(true)
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 text-slate-900 dark:text-white selection:bg-blue-100 dark:selection:bg-blue-900/30 selection:text-blue-900 dark:selection:text-blue-200">
      {/* Premium Header */}
      <header className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 border-b border-slate-100 dark:border-gray-700 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_-20%,rgba(59,130,246,0.05),transparent_70%)] pointer-events-none" />
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 dark:bg-gray-800 text-white text-[10px] font-bold uppercase tracking-widest mb-6">
              <Sparkles className="w-3 h-3 text-blue-400" />
              Swiss Application Standard
            </div>
            <h1 className="text-5xl md:text-6xl font-black text-slate-900 dark:text-white mb-6 tracking-tight">
              Application <span className="text-blue-600">Dossier</span>.
            </h1>
            <p className="text-xl text-slate-500 dark:text-gray-400 max-w-2xl mx-auto font-medium leading-relaxed">
              Generate a professional, Swiss-standard application package that landlords will actually read.
            </p>
          </motion.div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Progress Tracker */}
        {!generated && (
          <div className="flex items-center justify-between mb-16 relative">
            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-100 dark:bg-gray-700 -translate-y-1/2 -z-10" />
            {[1, 2, 3].map((s) => (
              <div 
                key={s}
                className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black transition-all ${step >= s ? 'bg-blue-600 text-white shadow-xl shadow-blue-500/20' : 'bg-white dark:bg-gray-800 border-2 border-slate-100 dark:border-gray-700 text-slate-300 dark:text-gray-500'}`}
              >
                {s < step ? <CheckCircle2 className="w-6 h-6" /> : s}
              </div>
            ))}
          </div>
        )}

        <AnimatePresence mode="wait">
          {!generated ? (
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white dark:bg-gray-800 rounded-[40px] border border-slate-100 dark:border-gray-700 shadow-2xl shadow-blue-900/5 p-8 md:p-12"
            >
              {step === 1 && (
                <div className="space-y-8">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 flex items-center justify-center">
                      <User className="w-7 h-7" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-black text-slate-900 dark:text-white">Personal Profile</h2>
                      <p className="text-slate-500 dark:text-gray-400 font-medium text-sm">Basic details required for the Mietinteressenten form.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-gray-500">Full Name</label>
                      <input 
                        type="text" 
                        value={data.personal.fullName}
                        onChange={(e) => updatePersonal('fullName', e.target.value)}
                        placeholder="Jean-Pierre Muller"
                        className="w-full px-6 py-4 bg-slate-50 dark:bg-gray-900 border-0 focus:ring-2 focus:ring-blue-500/20 rounded-2xl font-bold text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-gray-500">Nationality</label>
                      <input 
                        type="text" 
                        value={data.personal.nationality}
                        onChange={(e) => updatePersonal('nationality', e.target.value)}
                        placeholder="French / US / etc."
                        className="w-full px-6 py-4 bg-slate-50 dark:bg-gray-900 border-0 focus:ring-2 focus:ring-blue-500/20 rounded-2xl font-bold text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-gray-500">Email Address</label>
                      <input 
                        type="email" 
                        value={data.personal.email}
                        onChange={(e) => updatePersonal('email', e.target.value)}
                        placeholder="jean.muller@example.com"
                        className="w-full px-6 py-4 bg-slate-50 dark:bg-gray-900 border-0 focus:ring-2 focus:ring-blue-500/20 rounded-2xl font-bold text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-gray-500">Phone Number</label>
                      <input 
                        type="tel" 
                        value={data.personal.phone}
                        onChange={(e) => updatePersonal('phone', e.target.value)}
                        placeholder="+41 79 000 00 00"
                        className="w-full px-6 py-4 bg-slate-50 dark:bg-gray-900 border-0 focus:ring-2 focus:ring-blue-500/20 rounded-2xl font-bold text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-8">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 flex items-center justify-center">
                      <Briefcase className="w-7 h-7" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-black text-slate-900 dark:text-white">Employment & Income</h2>
                      <p className="text-slate-500 dark:text-gray-400 font-medium text-sm">Landlords require proof of 3x rent income.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-gray-500">Current Employer</label>
                      <input 
                        type="text" 
                        value={data.employment.employer}
                        onChange={(e) => updateEmployment('employer', e.target.value)}
                        placeholder="Google Switzerland / Credit Suisse / etc."
                        className="w-full px-6 py-4 bg-slate-50 dark:bg-gray-900 border-0 focus:ring-2 focus:ring-blue-500/20 rounded-2xl font-bold text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-gray-500">Position / Job Title</label>
                      <input 
                        type="text" 
                        value={data.employment.position}
                        onChange={(e) => updateEmployment('position', e.target.value)}
                        placeholder="Software Engineer"
                        className="w-full px-6 py-4 bg-slate-50 dark:bg-gray-900 border-0 focus:ring-2 focus:ring-blue-500/20 rounded-2xl font-bold text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-gray-500">Gross Annual Salary (CHF)</label>
                      <input 
                        type="number" 
                        value={data.employment.salary}
                        onChange={(e) => updateEmployment('salary', e.target.value)}
                        placeholder="120000"
                        className="w-full px-6 py-4 bg-slate-50 dark:bg-gray-900 border-0 focus:ring-2 focus:ring-blue-500/20 rounded-2xl font-bold text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-gray-500">Contract Type</label>
                      <select 
                        value={data.employment.contractType}
                        onChange={(e) => updateEmployment('contractType', e.target.value)}
                        className="w-full px-6 py-4 bg-slate-50 dark:bg-gray-900 border-0 focus:ring-2 focus:ring-blue-500/20 rounded-2xl font-bold text-slate-900 dark:text-white appearance-none"
                      >
                        <option value="Permanent">Permanent (Unlimited)</option>
                        <option value="Fixed-term">Fixed-term</option>
                        <option value="Self-employed">Self-employed</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-8">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-14 h-14 rounded-2xl bg-purple-50 dark:bg-purple-900/30 text-purple-600 flex items-center justify-center">
                      <ShieldCheck className="w-7 h-7" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-black text-slate-900 dark:text-white">Checklist & Verification</h2>
                      <p className="text-slate-500 dark:text-gray-400 font-medium text-sm">Select the documents you have ready to include.</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {[
                      { id: 'idCopy', label: 'Copy of Passport / ID', desc: 'Required for all adults' },
                      { id: 'permitCopy', label: 'Copy of Residence Permit (B/L/C)', desc: 'Proof of legal stay' },
                      { id: 'debtExtract', label: 'Debt Registry Extract (Betreibungsauszug)', desc: 'Must be less than 3 months old' },
                      { id: 'salarySlips', label: 'Last 3 Salary Slips', desc: 'Verified income proof' },
                      { id: 'liabilityInsurance', label: 'Liability Insurance (Privathaftpflicht)', desc: 'Standard requirement in Switzerland' }
                    ].map((doc) => (
                      <button
                        key={doc.id}
                        onClick={() => toggleDocument(doc.id as keyof DossierData['documents'])}
                        className={`w-full flex items-center justify-between p-6 rounded-3xl border-2 transition-all ${data.documents[doc.id as keyof DossierData['documents']] ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-900/30 shadow-lg shadow-blue-500/5' : 'border-slate-100 dark:border-gray-700 hover:border-slate-200 dark:hover:border-gray-600 bg-white dark:bg-gray-800'}`}
                      >
                        <div className="text-left">
                          <div className="font-black text-slate-900 dark:text-white">{doc.label}</div>
                          <div className="text-xs text-slate-500 dark:text-gray-400 font-medium mt-1">{doc.desc}</div>
                        </div>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${data.documents[doc.id as keyof DossierData['documents']] ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-gray-700 text-slate-300 dark:text-gray-500'}`}>
                          <CheckCircle2 className="w-5 h-5" />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-12 flex items-center justify-between pt-12 border-t border-slate-100 dark:border-gray-700">
                <button
                  onClick={() => setStep(Math.max(1, step - 1))}
                  disabled={step === 1}
                  className="px-8 py-4 text-slate-500 dark:text-gray-400 font-bold hover:text-slate-900 dark:hover:text-white disabled:opacity-0 transition-all"
                >
                  Back
                </button>
                
                {step < 3 ? (
                  <button
                    onClick={() => setStep(step + 1)}
                    className="px-10 py-5 bg-slate-900 text-white rounded-2xl font-black flex items-center gap-2 hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10"
                  >
                    Continue
                    <ArrowRight className="w-5 h-5" />
                  </button>
                ) : (
                  <button
                    onClick={handleGenerate}
                    disabled={loading}
                    className="px-10 py-5 bg-blue-600 text-white rounded-2xl font-black flex items-center gap-3 hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20 disabled:opacity-70"
                  >
                    {loading ? (
                      <Loader2 className="w-6 h-6 animate-spin" />
                    ) : (
                      <Sparkles className="w-6 h-6" />
                    )}
                    <span>{loading ? 'Generating...' : 'Generate Dossier'}</span>
                  </button>
                )}
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white dark:bg-gray-800 rounded-[48px] border-2 border-slate-100 dark:border-gray-700 p-12 text-center"
            >
              <div className="w-24 h-24 bg-emerald-50 dark:bg-emerald-900/30 rounded-[32px] flex items-center justify-center mx-auto mb-10 rotate-12 shadow-xl shadow-emerald-500/10">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 -rotate-12" />
              </div>
              <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-6 tracking-tight">Dossier Ready!</h2>
              <p className="text-lg text-slate-500 dark:text-gray-400 max-w-lg mx-auto font-medium mb-12">
                Your professional application package has been generated. It includes a tailored cover letter and organized document sheets.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
                <div className="bg-slate-50 dark:bg-gray-900 p-6 rounded-[32px] border border-slate-100 dark:border-gray-700">
                  <FileText className="w-8 h-8 text-blue-600 mb-4 mx-auto" />
                  <div className="font-black text-slate-900 dark:text-white mb-1">Application Form</div>
                  <div className="text-xs text-slate-500 dark:text-gray-400">Filled & Validated</div>
                </div>
                <div className="bg-slate-50 dark:bg-gray-900 p-6 rounded-[32px] border border-slate-100 dark:border-gray-700">
                  <CreditCard className="w-8 h-8 text-emerald-600 mb-4 mx-auto" />
                  <div className="font-black text-slate-900 dark:text-white mb-1">Financial Sheet</div>
                  <div className="text-xs text-slate-500 dark:text-gray-400">3.2x Rent Ratio</div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button className="flex-1 py-6 bg-slate-900 text-white rounded-2xl font-black flex items-center justify-center gap-3 hover:bg-slate-800 transition-all">
                  <Download className="w-6 h-6" />
                  Download Package (PDF)
                </button>
                <Link 
                  href="/tools/apartment-finder"
                  className="flex-1 py-6 bg-blue-600 text-white rounded-2xl font-black flex items-center justify-center gap-3 hover:bg-blue-700 transition-all"
                >
                  <Building2 className="w-6 h-6" />
                  Find Apartments
                </Link>
              </div>

              <button 
                onClick={() => {setGenerated(false); setStep(1);}}
                className="mt-10 text-slate-400 dark:text-gray-500 font-bold hover:text-slate-900 dark:hover:text-white transition-all"
              >
                Start New Dossier
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pro Tips Section */}
        {!generated && (
          <div className="mt-24 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-8 bg-slate-50 dark:bg-gray-900 rounded-[40px] border border-slate-100 dark:border-gray-700">
              <div className="w-12 h-12 bg-white dark:bg-gray-800 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
                <Info className="w-6 h-6 text-blue-600" />
              </div>
              <h4 className="text-xl font-black text-slate-900 dark:text-white mb-3">Swiss Application Secret</h4>
              <p className="text-slate-500 dark:text-gray-400 font-medium leading-relaxed">
                Landlords in Switzerland receive hundreds of emails. A professionally organized PDF dossier with a clear summary page increases your response rate by 65%.
              </p>
            </div>
            <div className="p-8 bg-slate-50 dark:bg-gray-900 rounded-[40px] border border-slate-100 dark:border-gray-700">
              <div className="w-12 h-12 bg-white dark:bg-gray-800 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
                <ShieldCheck className="w-6 h-6 text-emerald-600" />
              </div>
              <h4 className="text-xl font-black text-slate-900 dark:text-white mb-3">Privacy First</h4>
              <p className="text-slate-500 dark:text-gray-400 font-medium leading-relaxed">
                Your sensitive employment and identity data is processed locally. We don't store your personal documents on our servers.
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
