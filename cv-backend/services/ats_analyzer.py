from __future__ import annotations

import re

from models.cv_data import CVData, ATSResult, ATSIssue

ACTION_VERBS = {
    "achieved", "administered", "analyzed", "built", "coached", "conducted",
    "created", "delivered", "designed", "developed", "directed", "established",
    "executed", "generated", "implemented", "improved", "increased", "initiated",
    "launched", "led", "managed", "negotiated", "optimized", "organized",
    "planned", "produced", "reduced", "resolved", "spearheaded", "streamlined",
    "supervised", "transformed",
}

SWISS_KEYWORDS = {
    "permit", "visa", "CEFR", "german", "french", "italian", "english",
    "zurich", "geneva", "basel", "bern", "lausanne", "switzerland",
    "cross-cultural", "multilingual", "international",
}


def analyze_ats(cv_data: CVData, job_description: str | None = None) -> ATSResult:
    issues: list[ATSIssue] = []
    score = 100
    keywords_found: list[str] = []
    keywords_missing: list[str] = []
    suggestions: list[str] = []

    pi = cv_data.personal_info

    if not pi.email:
        issues.append(ATSIssue(severity="critical", field="email", message="Email is missing", suggestion="Add a professional email address"))
        score -= 15

    if not pi.phone:
        issues.append(ATSIssue(severity="critical", field="phone", message="Phone number is missing", suggestion="Add a phone number with country code (+41)"))
        score -= 10

    if not pi.first_name or not pi.last_name:
        issues.append(ATSIssue(severity="critical", field="name", message="Full name is missing", suggestion="Add your first and last name"))
        score -= 15

    if not cv_data.summary or len(cv_data.summary) < 50:
        issues.append(ATSIssue(severity="warning", field="summary", message="Professional summary is too short or missing", suggestion="Write a 3-4 sentence summary highlighting your key qualifications"))
        score -= 10

    if len(cv_data.work_experience) == 0:
        issues.append(ATSIssue(severity="critical", field="work_experience", message="No work experience listed", suggestion="Add your relevant work experience"))
        score -= 20
    else:
        total_achievements = sum(len(w.achievements) for w in cv_data.work_experience)
        if total_achievements < len(cv_data.work_experience):
            issues.append(ATSIssue(severity="warning", field="achievements", message="Some positions lack achievement bullets", suggestion="Add 2-4 quantified achievements per position"))
            score -= 5

        all_text = " ".join(" ".join(w.achievements) for w in cv_data.work_experience).lower()
        verbs_used = ACTION_VERBS & set(re.findall(r'\b\w+\b', all_text))
        if len(verbs_used) < 3:
            issues.append(ATSIssue(severity="info", field="achievements", message="Few action verbs detected", suggestion="Start achievement bullets with strong action verbs (Led, Developed, Implemented...)"))
            score -= 3

    if len(cv_data.education) == 0:
        issues.append(ATSIssue(severity="warning", field="education", message="No education listed", suggestion="Add your educational background"))
        score -= 5

    if len(cv_data.skills) < 5:
        issues.append(ATSIssue(severity="warning", field="skills", message="Too few skills listed", suggestion="Add at least 8-10 relevant skills across technical and soft categories"))
        score -= 5

    if len(cv_data.languages) == 0:
        issues.append(ATSIssue(severity="warning", field="languages", message="No languages listed (important for Swiss employers)", suggestion="Add your language proficiencies with CEFR levels"))
        score -= 8

    if not pi.linkedin_url:
        issues.append(ATSIssue(severity="info", field="linkedin", message="LinkedIn profile not included", suggestion="Add your LinkedIn URL for credibility"))
        score -= 2

    if job_description:
        jd_lower = job_description.lower()
        jd_words = set(re.findall(r'\b[a-z]{3,}\b', jd_lower))
        cv_text = _extract_all_text(cv_data).lower()
        cv_words = set(re.findall(r'\b[a-z]{3,}\b', cv_text))

        important_jd_words = jd_words - {"the", "and", "for", "with", "that", "this", "from", "will", "are", "you", "your", "our", "have", "has", "been", "can", "should", "would", "could", "about", "into", "over", "such", "also", "than", "more", "other"}
        for word in sorted(important_jd_words):
            if word in cv_words:
                keywords_found.append(word)
            elif len(word) > 4:
                keywords_missing.append(word)

        if keywords_missing:
            match_ratio = len(keywords_found) / max(len(keywords_found) + len(keywords_missing), 1)
            if match_ratio < 0.4:
                score -= 10
                suggestions.append("Your CV matches less than 40% of job description keywords. Consider tailoring it.")
            elif match_ratio < 0.6:
                score -= 5
                suggestions.append("Good keyword coverage, but you could add more relevant terms.")

    score = max(0, min(100, score))

    return ATSResult(
        score=score,
        issues=issues,
        keywords_found=keywords_found[:20],
        keywords_missing=keywords_missing[:15],
        suggestions=suggestions,
    )


def optimize_for_ats(cv_data: CVData, job_description: str | None = None) -> dict:
    result = analyze_ats(cv_data, job_description)
    optimized = cv_data.model_dump()

    if not optimized["summary"] and job_description:
        optimized["summary"] = "Experienced professional seeking to leverage expertise in a challenging role."

    return {
        "cv_data": optimized,
        "ats_result": result.model_dump(),
        "changes_made": [issue.suggestion for issue in result.issues if issue.severity == "critical"],
    }


def _extract_all_text(cv_data: CVData) -> str:
    parts = [
        cv_data.summary,
        cv_data.personal_info.title,
    ]
    for w in cv_data.work_experience:
        parts.extend([w.job_title, w.company, *w.achievements, *w.tags])
    for e in cv_data.education:
        parts.extend([e.degree, e.institution, *e.honors])
    for s in cv_data.skills:
        parts.append(s.name)
    for c in cv_data.certifications:
        parts.extend([c.name, c.issuer])
    for p in cv_data.projects:
        parts.extend([p.name, p.description, *p.technologies])
    return " ".join(p for p in parts if p)
