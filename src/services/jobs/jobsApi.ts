/**
 * Dev mock API for Jobs Portal. Swap implementations to call real REST endpoints later.
 */
import { mockCompanies, mockJobsSeed } from './mockData';
import type {
  ApplicationRecord,
  ApplyPayload,
  Company,
  EmployerApplicantRow,
  JobPost,
  JobSearchFilters,
  JobsPortalRole,
  PendingEmployer,
  PendingModerationJob,
} from './types';

const delay = (ms = 280) => new Promise((r) => setTimeout(r, ms));

let jobs: JobPost[] = mockJobsSeed.map((j) => ({ ...j }));
const companies: Company[] = mockCompanies.map((c) => ({ ...c }));

let savedJobIds = new Set<string>(['job2']);
let applications: ApplicationRecord[] = [
  {
    applicationId: 'app_seed1',
    jobId: 'job1',
    jobTitle: 'Senior Audit Manager',
    companyName: 'Deloitte Singapore',
    status: 'viewed',
    appliedAt: new Date(Date.now() - 4 * 86400000).toISOString(),
    screeningAnswers: { sq1: 'Yes', sq2: '4' },
  },
];

function companyName(id: string): string {
  return companies.find((c) => c.companyId === id)?.name ?? 'Unknown company';
}

/** Resolve company name for UI (sync). */
export function getCompanyDisplayName(companyId: string): string {
  return companyName(companyId);
}

function isJobVisible(j: JobPost): boolean {
  return j.status === 'active' || j.status === 'filled';
}

export async function listJobs(filters: JobSearchFilters = {}): Promise<JobPost[]> {
  await delay();
  let list = jobs.filter(isJobVisible);

  const kw = filters.keyword?.trim().toLowerCase();
  if (kw) {
    list = list.filter(
      (j) =>
        j.title.toLowerCase().includes(kw) ||
        j.description.toLowerCase().includes(kw) ||
        j.skills.some((s) => s.toLowerCase().includes(kw)) ||
        companyName(j.companyId).toLowerCase().includes(kw),
    );
  }
  if (filters.location?.trim()) {
    const loc = filters.location.trim().toLowerCase();
    list = list.filter((j) => j.location.toLowerCase().includes(loc));
  }
  if (filters.workArrangement) {
    list = list.filter((j) => j.workArrangement === filters.workArrangement);
  }
  if (filters.employmentType) {
    list = list.filter((j) => j.employmentType === filters.employmentType);
  }
  if (filters.salaryMin != null) {
    const min = filters.salaryMin;
    list = list.filter((j) => j.salaryMax >= min);
  }
  if (filters.salaryMax != null) {
    const max = filters.salaryMax;
    list = list.filter((j) => j.salaryMin <= max);
  }

  if (filters.experienceLevel) {
    const map: Record<string, string> = {
      entry: 'Entry',
      mid: 'Mid',
      senior: 'Senior',
      director: 'Director',
    };
    const want = map[filters.experienceLevel];
    if (want) {
      list = list.filter((j) => j.seniority === want);
    }
  }

  if (filters.industry && filters.industry !== 'all') {
    const q = filters.industry.toLowerCase();
    list = list.filter((j) => j.industry.toLowerCase().includes(q));
  }

  return list.sort((a, b) => new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime());
}

export async function getJob(jobId: string): Promise<JobPost | null> {
  await delay(120);
  const j = jobs.find((x) => x.jobId === jobId);
  if (!j) return null;
  if (!isJobVisible(j) && j.status !== 'pending_moderation') return null;
  return { ...j };
}

export async function listRecommendedJobs(_role: JobsPortalRole): Promise<JobPost[]> {
  const all = await listJobs({});
  return all.slice(0, 4);
}

export async function listMyApplications(): Promise<ApplicationRecord[]> {
  await delay();
  return [...applications].sort(
    (a, b) => new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime(),
  );
}

export async function applyToJob(jobId: string, payload: ApplyPayload): Promise<ApplicationRecord> {
  await delay();
  const job = jobs.find((j) => j.jobId === jobId);
  if (!job || !isJobVisible(job)) {
    throw new Error('Job not available for application');
  }
  if (applications.some((a) => a.jobId === jobId)) {
    throw new Error('You have already applied to this job');
  }
  const rec: ApplicationRecord = {
    applicationId: `app_${Date.now()}`,
    jobId,
    jobTitle: job.title,
    companyName: companyName(job.companyId),
    status: 'submitted',
    appliedAt: new Date().toISOString(),
    coverLetter: payload.coverLetter,
    screeningAnswers: payload.screeningAnswers,
  };
  applications = [rec, ...applications];
  const idx = jobs.findIndex((j) => j.jobId === jobId);
  if (idx !== -1) {
    jobs[idx] = {
      ...jobs[idx],
      applicationsCount: (jobs[idx].applicationsCount ?? 0) + 1,
    };
  }
  return rec;
}

export async function getSavedJobIds(): Promise<string[]> {
  await delay(50);
  return [...savedJobIds];
}

export async function setJobSaved(jobId: string, saved: boolean): Promise<void> {
  await delay(80);
  if (saved) savedJobIds.add(jobId);
  else savedJobIds.delete(jobId);
}

export async function listEmployerJobs(companyId: string = 'co1'): Promise<JobPost[]> {
  await delay();
  return jobs
    .filter((j) => j.companyId === companyId)
    .sort((a, b) => new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime());
}

export async function listApplicants(jobId: string): Promise<EmployerApplicantRow[]> {
  await delay();
  const job = jobs.find((j) => j.jobId === jobId);
  if (!job) return [];
  const rows: EmployerApplicantRow[] = applications
    .filter((a) => a.jobId === jobId)
    .map((a) => ({
      applicationId: a.applicationId,
      profileSummary: 'Candidate profile (mock) — full profile comes from API.',
      expectedSalary: 'Within range',
      status: a.status,
      appliedAt: a.appliedAt,
      screeningAnswers: a.screeningAnswers,
      matchScore: 72 + (a.applicationId.charCodeAt(a.applicationId.length - 1) % 18),
    }));
  if (rows.length === 0 && job.applicationsCount && job.applicationsCount > 0) {
    return [
      {
        applicationId: 'mock_ext',
        profileSummary: 'External applicant (mock)',
        expectedSalary: 'SGD 6,000',
        status: 'submitted',
        appliedAt: job.postedAt,
        screeningAnswers: { sq1: 'Yes', sq2: '5' },
        matchScore: 81,
      },
    ];
  }
  return rows;
}

export async function updateApplicationStatus(
  applicationId: string,
  status: ApplicationRecord['status'],
): Promise<void> {
  await delay();
  applications = applications.map((a) => (a.applicationId === applicationId ? { ...a, status } : a));
}

export async function listPendingModerationJobs(): Promise<PendingModerationJob[]> {
  await delay();
  return jobs
    .filter((j) => j.status === 'pending_moderation')
    .map((j) => ({
      jobId: j.jobId,
      title: j.title,
      companyName: companyName(j.companyId),
      submittedAt: j.postedAt,
    }));
}

export async function moderateJob(jobId: string, approve: boolean): Promise<void> {
  await delay();
  const idx = jobs.findIndex((j) => j.jobId === jobId);
  if (idx === -1) return;
  jobs[idx] = {
    ...jobs[idx],
    status: approve ? 'active' : 'closed',
  };
}

export async function listPendingEmployers(): Promise<PendingEmployer[]> {
  await delay();
  return companies
    .filter((c) => c.verificationStatus === 'pending')
    .map((c) => ({
      companyId: c.companyId,
      name: c.name,
      submittedAt: new Date(Date.now() - 86400000).toISOString(),
      verificationStatus: c.verificationStatus,
    }));
}

export async function setEmployerVerification(companyId: string, status: 'approved' | 'rejected'): Promise<void> {
  await delay();
  const c = companies.find((x) => x.companyId === companyId);
  if (c) c.verificationStatus = status;
}

export interface PostJobDraft {
  title: string;
  description: string;
  requirements: string;
  benefits?: string;
  location: string;
  salaryMin: number;
  salaryMax: number;
  employmentType: JobPost['employmentType'];
  workArrangement: JobPost['workArrangement'];
  seniority: string;
  closingAt: string;
}

export async function createJobDraft(
  companyId: string,
  draft: PostJobDraft,
  publish: boolean,
): Promise<JobPost> {
  await delay();
  const newJob: JobPost = {
    jobId: `job_${Date.now()}`,
    companyId,
    title: draft.title,
    description: draft.description,
    requirements: draft.requirements,
    benefits: draft.benefits,
    location: draft.location,
    salaryMin: draft.salaryMin,
    salaryMax: draft.salaryMax,
    salaryCurrency: 'SGD',
    employmentType: draft.employmentType,
    workArrangement: draft.workArrangement,
    seniority: draft.seniority,
    industry: companies.find((c) => c.companyId === companyId)?.industry ?? 'General',
    skills: [],
    postedAt: new Date().toISOString(),
    closingAt: draft.closingAt,
    status: publish ? 'pending_moderation' : 'draft',
    screeningQuestions: [],
    viewsCount: 0,
    applicationsCount: 0,
  };
  jobs = [newJob, ...jobs];
  return newJob;
}

/** Reset mock state (optional, for tests) */
export function __resetJobsMock(): void {
  jobs = mockJobsSeed.map((j) => ({ ...j }));
  savedJobIds = new Set<string>(['job2']);
  applications = [
    {
      applicationId: 'app_seed1',
      jobId: 'job1',
      jobTitle: 'Senior Audit Manager',
      companyName: 'Deloitte Singapore',
      status: 'viewed',
      appliedAt: new Date(Date.now() - 4 * 86400000).toISOString(),
      screeningAnswers: { sq1: 'Yes', sq2: '4' },
    },
  ];
}
