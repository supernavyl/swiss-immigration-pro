from __future__ import annotations

from datetime import date
from enum import Enum
from typing import Optional

from pydantic import BaseModel, Field


class SwissPermitType(str, Enum):
    CITIZEN = "Citizen"
    PERMIT_C = "Permit C"
    PERMIT_B = "Permit B"
    PERMIT_L = "Permit L"
    PERMIT_G = "Permit G"
    NON_EU = "Non-EU"


class MaritalStatus(str, Enum):
    SINGLE = "Single"
    MARRIED = "Married"
    DIVORCED = "Divorced"
    WIDOWED = "Widowed"
    PARTNERSHIP = "Partnership"


class CEFRLevel(str, Enum):
    A1 = "A1"
    A2 = "A2"
    B1 = "B1"
    B2 = "B2"
    C1 = "C1"
    C2 = "C2"
    NATIVE = "Native"


class SkillCategory(str, Enum):
    TECHNICAL = "technical"
    SOFT = "soft"
    TOOLS = "tools"
    OTHER = "other"


class PersonalInfo(BaseModel):
    first_name: str = ""
    last_name: str = ""
    title: str = ""
    email: str = ""
    phone: str = ""
    address: str = ""
    postal_code: str = ""
    city: str = ""
    country: str = "Switzerland"
    date_of_birth: str = ""
    nationality: str = ""
    marital_status: Optional[MaritalStatus] = None
    permit_type: SwissPermitType = SwissPermitType.PERMIT_B
    photo_url: Optional[str] = None
    linkedin_url: Optional[str] = None
    github_url: Optional[str] = None
    website_url: Optional[str] = None


class WorkExperience(BaseModel):
    id: str
    job_title: str = ""
    company: str = ""
    location: str = ""
    start_date: str = ""
    end_date: Optional[str] = None
    is_current: bool = False
    achievements: list[str] = Field(default_factory=list)
    tags: list[str] = Field(default_factory=list)


class Education(BaseModel):
    id: str
    degree: str = ""
    institution: str = ""
    location: str = ""
    start_date: str = ""
    end_date: Optional[str] = None
    is_current: bool = False
    gpa: Optional[str] = None
    honors: list[str] = Field(default_factory=list)


class Skill(BaseModel):
    id: str
    name: str = ""
    category: SkillCategory = SkillCategory.TECHNICAL
    proficiency: int = Field(default=3, ge=1, le=5)


class Language(BaseModel):
    id: str
    name: str = ""
    level: CEFRLevel = CEFRLevel.B1
    certificate: Optional[str] = None


class Certification(BaseModel):
    id: str
    name: str = ""
    issuer: str = ""
    date: Optional[str] = None
    expiry: Optional[str] = None
    url: Optional[str] = None


class Reference(BaseModel):
    id: str
    name: str = ""
    title: str = ""
    company: str = ""
    email: str = ""
    phone: Optional[str] = None
    relationship: str = ""


class Project(BaseModel):
    id: str
    name: str = ""
    description: str = ""
    url: Optional[str] = None
    technologies: list[str] = Field(default_factory=list)
    start_date: Optional[str] = None
    end_date: Optional[str] = None


class CustomSection(BaseModel):
    id: str
    title: str = ""
    items: list[str] = Field(default_factory=list)


class CVData(BaseModel):
    personal_info: PersonalInfo = Field(default_factory=PersonalInfo)
    summary: str = ""
    work_experience: list[WorkExperience] = Field(default_factory=list)
    education: list[Education] = Field(default_factory=list)
    skills: list[Skill] = Field(default_factory=list)
    languages: list[Language] = Field(default_factory=list)
    certifications: list[Certification] = Field(default_factory=list)
    references: list[Reference] = Field(default_factory=list)
    projects: list[Project] = Field(default_factory=list)
    custom_sections: list[CustomSection] = Field(default_factory=list)


class SaveCVRequest(BaseModel):
    cv_data: CVData
    name: str = "Untitled CV"
    template_id: str = "swiss-classic"
    cv_id: Optional[str] = None


class ExportRequest(BaseModel):
    cv_data: CVData
    template_id: str = "swiss-classic"


class AIGenerateRequest(BaseModel):
    job_description: str
    personal_info: Optional[PersonalInfo] = None
    target_role: Optional[str] = None
    industry: Optional[str] = None


class AIImproveRequest(BaseModel):
    section: str
    content: str
    context: Optional[str] = None
    tone: str = "professional"


class AISuggestRequest(BaseModel):
    field: str
    current_value: str = ""
    context: dict = Field(default_factory=dict)


class ATSAnalyzeRequest(BaseModel):
    cv_data: CVData
    job_description: Optional[str] = None


class ATSIssue(BaseModel):
    severity: str  # "critical", "warning", "info"
    field: str
    message: str
    suggestion: str


class ATSResult(BaseModel):
    score: int = Field(ge=0, le=100)
    issues: list[ATSIssue] = Field(default_factory=list)
    keywords_found: list[str] = Field(default_factory=list)
    keywords_missing: list[str] = Field(default_factory=list)
    suggestions: list[str] = Field(default_factory=list)
