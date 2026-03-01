import type { CVData } from '@/types/cv-builder'
import type { ComponentType } from 'react'

import SwissClassic from './SwissClassic'
import ModernZurich from './ModernZurich'
import ExecutiveGeneva from './ExecutiveGeneva'
import TechStartup from './TechStartup'
import CreativePortfolio from './CreativePortfolio'
import MinimalBasel from './MinimalBasel'
import AcademicBern from './AcademicBern'
import FinanceLucerne from './FinanceLucerne'
import HealthcarePro from './HealthcarePro'
import LegalPrecision from './LegalPrecision'
import ConsultantElite from './ConsultantElite'
import MarketingBold from './MarketingBold'
import EngineeringBlue from './EngineeringBlue'
import HospitalityWarm from './HospitalityWarm'
import RetailFresh from './RetailFresh'

export interface TemplateProps {
  data: CVData
}

const TEMPLATE_MAP: Record<string, ComponentType<TemplateProps>> = {
  'swiss-classic': SwissClassic,
  'modern-zurich': ModernZurich,
  'executive-geneva': ExecutiveGeneva,
  'tech-startup': TechStartup,
  'creative-portfolio': CreativePortfolio,
  'minimal-basel': MinimalBasel,
  'academic-bern': AcademicBern,
  'finance-lucerne': FinanceLucerne,
  'healthcare-pro': HealthcarePro,
  'legal-precision': LegalPrecision,
  'consultant-elite': ConsultantElite,
  'marketing-bold': MarketingBold,
  'engineering-blue': EngineeringBlue,
  'hospitality-warm': HospitalityWarm,
  'retail-fresh': RetailFresh,
}

export function getTemplateComponent(id: string): ComponentType<TemplateProps> {
  return TEMPLATE_MAP[id] ?? SwissClassic
}

export const ALL_TEMPLATE_IDS = Object.keys(TEMPLATE_MAP)
