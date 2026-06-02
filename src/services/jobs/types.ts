/**
 * Jobs Portal domain types (PRD-aligned). Replace mock layer with API responses later.
 */

export type JobsPortalRole = 'individual' | 'corporate' | 'admin';

export type WorkArrangement = 'remote' | 'hybrid' | 'on_site';
export type EmploymentType = 'full_time' | 'part_time' | 'contract' | 'internship';
export type JobPostStatus = 'draft' | 'pending_moderation' | 'active' | 'paused' | 'closed' | 'filled';
export type ApplicationStatus =
  | 'submitted'
  | 'viewed'
  | 'shortlisted'
  | 'interview'
  | 'rejected'
  | 'offer'
  | 'hired'
  | 'withdrawn';

export type CompanyVerificationStatus = 'pending' | 'approved' | 'rejected';

export type ScreeningQuestionType = 'text' | 'yes_no' | 'multiple_choice';

export interface ScreeningQuestion {
  id: string;
  questionText: string;
  questionType: ScreeningQuestionType;
  options?: string[];
}

export interface Company {
  companyId: string;
  name: string;
  industry: string;
  size: string;
  website?: string;
  logoUrl?: string;
  description: string;
  location: string;
  verificationStatus: CompanyVerificationStatus;
}

export interface JobPost {
  jobId: string;
  companyId: string;
  title: string;
  description: string;
  requirements: string;
  benefits?: string;
  location: string;
  salaryMin: number;
  salaryMax: number;
  salaryCurrency: string;
  employmentType: EmploymentType;
  workArrangement: WorkArrangement;
  seniority: string;
  industry: string;
  skills: string[];
  postedAt: string;
  closingAt: string;
  status: JobPostStatus;
  screeningQuestions: ScreeningQuestion[];
  viewsCount?: number;
  applicationsCount?: number;
  /** Promoted listing — gold border / badge in browse UI */
  featured?: boolean;
  /** e.g. "Raffles Place" — shown after company name */
  officeDistrict?: string;
}

export type ExperienceFilterLevel = 'entry' | 'mid' | 'senior' | 'director';

export interface JobSearchFilters {
  keyword?: string;
  location?: string;
  workArrangement?: WorkArrangement | '';
  employmentType?: EmploymentType | '';
  salaryMin?: number;
  salaryMax?: number;
  /** Maps to `JobPost.seniority` (Entry, Mid, Senior, Director) */
  experienceLevel?: ExperienceFilterLevel | '';
  /** Substring match on job / company industry */
  industry?: string;
}

export interface ApplyPayload {
  resumeLabel: string;
  coverLetter?: string;
  screeningAnswers: Record<string, string>;
}

export interface ApplicationRecord {
  applicationId: string;
  jobId: string;
  jobTitle: string;
  companyName: string;
  status: ApplicationStatus;
  appliedAt: string;
  coverLetter?: string;
  screeningAnswers: Record<string, string>;
}

/** Mock seeker inbox counts for dashboard header (replace with API). */
export interface SeekerInboxSummary {
  applicationUpdatesCount: number;
  recommendedJobsCount: number;
  unreadNotificationCount: number;
}

export type SeekerNotificationKind = 'apply_submitted' | 'status_change' | 'recommendations' | 'system';

export interface SeekerNotification {
  id: string;
  kind: SeekerNotificationKind;
  title: string;
  body: string;
  createdAt: string;
  read: boolean;
}

export interface EmployerApplicantRow {
  applicationId: string;
  profileSummary: string;
  expectedSalary: string;
  status: ApplicationStatus;
  appliedAt: string;
  screeningAnswers: Record<string, string>;
  matchScore: number;
}

export interface PendingModerationJob {
  jobId: string;
  title: string;
  companyName: string;
  submittedAt: string;
}

export interface PendingEmployer {
  companyId: string;
  name: string;
  submittedAt: string;
  verificationStatus: CompanyVerificationStatus;
}
