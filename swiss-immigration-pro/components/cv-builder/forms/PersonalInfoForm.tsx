'use client'

import { useCVBuilderStore } from '@/store/cvBuilderStore'
import type { SwissPermitType, MaritalStatus } from '@/types/cv-builder'
import { Camera, X, Mail, Phone, MapPin, Globe, Linkedin, Github } from 'lucide-react'

const PERMIT_TYPES: SwissPermitType[] = ['Citizen', 'Permit C', 'Permit B', 'Permit L', 'Permit G', 'Non-EU']
const MARITAL_STATUSES: MaritalStatus[] = ['Single', 'Married', 'Divorced', 'Widowed', 'Partnership']

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 ml-1">{label}</label>
      {children}
    </div>
  )
}

const inputCls = "w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 rounded-xl text-sm font-medium text-slate-900 dark:text-white placeholder:text-slate-300 dark:placeholder:text-slate-600 transition-all outline-none"
const iconInputCls = "w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 rounded-xl text-sm font-medium text-slate-900 dark:text-white placeholder:text-slate-300 dark:placeholder:text-slate-600 transition-all outline-none"

export default function PersonalInfoForm() {
  const { cvData, updatePersonalInfo } = useCVBuilderStore()
  const pi = cvData.personalInfo

  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onloadend = () => updatePersonalInfo({ photoUrl: reader.result as string })
    reader.readAsDataURL(file)
  }

  return (
    <div className="space-y-8">
      {/* Photo */}
      <div className="flex items-center gap-5">
        <div className="relative group">
          {pi.photoUrl ? (
            <div className="relative w-24 h-24">
              <img src={pi.photoUrl} alt="Photo" className="w-full h-full object-cover rounded-2xl border-2 border-white dark:border-slate-700 shadow-lg" />
              <button onClick={() => updatePersonalInfo({ photoUrl: null })} className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full p-1 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                <X className="w-3 h-3" />
              </button>
            </div>
          ) : (
            <label className="w-24 h-24 bg-slate-100 dark:bg-slate-800 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-2xl flex flex-col items-center justify-center gap-1 cursor-pointer hover:border-blue-400 transition-colors">
              <Camera className="w-6 h-6 text-slate-400" />
              <span className="text-[8px] font-bold text-slate-400 uppercase">Photo</span>
              <input type="file" accept="image/*" onChange={handlePhoto} className="hidden" />
            </label>
          )}
        </div>
        <div>
          <p className="text-xs font-semibold text-slate-600 dark:text-slate-400">Professional Portrait</p>
          <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">Swiss employers expect a professional headshot</p>
        </div>
      </div>

      {/* Name & Title */}
      <div className="grid grid-cols-2 gap-3">
        <Field label="First Name">
          <input value={pi.firstName} onChange={(e) => updatePersonalInfo({ firstName: e.target.value })} className={inputCls} placeholder="Max" />
        </Field>
        <Field label="Last Name">
          <input value={pi.lastName} onChange={(e) => updatePersonalInfo({ lastName: e.target.value })} className={inputCls} placeholder="Müller" />
        </Field>
      </div>
      <Field label="Professional Title">
        <input value={pi.title} onChange={(e) => updatePersonalInfo({ title: e.target.value })} className={inputCls} placeholder="Senior Software Engineer" />
      </Field>

      {/* Contact */}
      <div className="grid grid-cols-2 gap-3">
        <Field label="Email">
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input type="email" value={pi.email} onChange={(e) => updatePersonalInfo({ email: e.target.value })} className={iconInputCls} placeholder="max@example.ch" />
          </div>
        </Field>
        <Field label="Phone">
          <div className="relative">
            <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input type="tel" value={pi.phone} onChange={(e) => updatePersonalInfo({ phone: e.target.value })} className={iconInputCls} placeholder="+41 79 123 45 67" />
          </div>
        </Field>
      </div>

      {/* Address */}
      <div className="grid grid-cols-3 gap-3">
        <div className="col-span-2">
          <Field label="Street Address">
            <input value={pi.address} onChange={(e) => updatePersonalInfo({ address: e.target.value })} className={inputCls} placeholder="Bahnhofstrasse 42" />
          </Field>
        </div>
        <Field label="Postal Code">
          <input value={pi.postalCode} onChange={(e) => updatePersonalInfo({ postalCode: e.target.value })} className={inputCls} placeholder="8001" />
        </Field>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Field label="City">
          <div className="relative">
            <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input value={pi.city} onChange={(e) => updatePersonalInfo({ city: e.target.value })} className={iconInputCls} placeholder="Zürich" />
          </div>
        </Field>
        <Field label="Country">
          <input value={pi.country} onChange={(e) => updatePersonalInfo({ country: e.target.value })} className={inputCls} placeholder="Switzerland" />
        </Field>
      </div>

      {/* Swiss Context */}
      <div className="p-4 bg-blue-50/50 dark:bg-blue-950/20 rounded-2xl border border-blue-100 dark:border-blue-900/30 space-y-3">
        <p className="text-[10px] font-bold uppercase tracking-widest text-blue-600/60">Swiss Residency</p>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Date of Birth">
            <input type="date" value={pi.dateOfBirth} onChange={(e) => updatePersonalInfo({ dateOfBirth: e.target.value })} className={inputCls} />
          </Field>
          <Field label="Nationality">
            <input value={pi.nationality} onChange={(e) => updatePersonalInfo({ nationality: e.target.value })} className={inputCls} placeholder="Swiss / German" />
          </Field>
          <Field label="Marital Status">
            <select value={pi.maritalStatus} onChange={(e) => updatePersonalInfo({ maritalStatus: e.target.value as MaritalStatus })} className={inputCls}>
              <option value="">Select...</option>
              {MARITAL_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </Field>
          <Field label="Permit Type">
            <select value={pi.permitType} onChange={(e) => updatePersonalInfo({ permitType: e.target.value as SwissPermitType })} className={inputCls}>
              {PERMIT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </Field>
        </div>
      </div>

      {/* Links */}
      <div className="grid grid-cols-2 gap-3">
        <Field label="LinkedIn">
          <div className="relative">
            <Linkedin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input value={pi.linkedinUrl} onChange={(e) => updatePersonalInfo({ linkedinUrl: e.target.value })} className={iconInputCls} placeholder="linkedin.com/in/..." />
          </div>
        </Field>
        <Field label="GitHub">
          <div className="relative">
            <Github className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input value={pi.githubUrl} onChange={(e) => updatePersonalInfo({ githubUrl: e.target.value })} className={iconInputCls} placeholder="github.com/..." />
          </div>
        </Field>
      </div>
      <Field label="Website">
        <div className="relative">
          <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input value={pi.websiteUrl} onChange={(e) => updatePersonalInfo({ websiteUrl: e.target.value })} className={iconInputCls} placeholder="https://..." />
        </div>
      </Field>
    </div>
  )
}
