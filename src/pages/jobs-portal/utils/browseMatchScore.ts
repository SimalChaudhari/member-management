import type { JobPost } from 'services/jobs/types';

/** Deterministic mock relevance score (70–98) for browse cards */
export function browseMatchScore(job: JobPost): number {
  let n = 0;
  for (let i = 0; i < job.jobId.length; i += 1) n += job.jobId.charCodeAt(i);
  for (let i = 0; i < job.title.length; i += 1) n += job.title.charCodeAt(i);
  return 70 + (n % 29);
}
