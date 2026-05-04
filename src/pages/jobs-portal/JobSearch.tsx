import { ReactElement, useEffect, useMemo, useState } from 'react';
import {
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Slider,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';

import IconifyIcon from 'components/base/IconifyIcon';
import JobCardSkeleton from 'pages/jobs-portal/components/JobCardSkeleton';
import BrowseJobCard from 'pages/jobs-portal/components/BrowseJobCard';
import JobsShell from 'pages/jobs-portal/components/JobsShell';
import { browseMatchScore } from 'pages/jobs-portal/utils/browseMatchScore';
import { paths } from 'routes/paths';
import { getCompanyDisplayName, listJobs } from 'services/jobs/jobsApi';
import type {
  EmploymentType,
  ExperienceFilterLevel,
  JobPost,
  JobSearchFilters,
  WorkArrangement,
} from 'services/jobs/types';

const SALARY_SLIDER_MAX = 15000;
const SALARY_SLIDER_MIN = 2000;

type SortKey = 'relevance' | 'newest' | 'salary';

type WorkFilter = 'all' | WorkArrangement;
type EmpFilter = 'all' | EmploymentType;
type ExpFilter = 'all' | ExperienceFilterLevel;

const JobSearch = (): ReactElement => {
  const [keyword, setKeyword] = useState('');
  const [work, setWork] = useState<WorkFilter>('all');
  const [emp, setEmp] = useState<EmpFilter>('all');
  const [exp, setExp] = useState<ExpFilter>('all');
  const [industry, setIndustry] = useState<string>('all');
  const [salaryRange, setSalaryRange] = useState<[number, number]>([SALARY_SLIDER_MIN, SALARY_SLIDER_MAX]);
  const [sort, setSort] = useState<SortKey>('relevance');

  const [jobs, setJobs] = useState<JobPost[]>([]);
  const [loading, setLoading] = useState(true);

  const apiFilters: JobSearchFilters = useMemo(() => {
    const f: JobSearchFilters = {
      keyword: keyword.trim() || undefined,
      workArrangement: work === 'all' ? undefined : work,
      employmentType: emp === 'all' ? undefined : emp,
      experienceLevel: exp === 'all' ? undefined : exp,
      industry: industry === 'all' ? undefined : industry,
      salaryMin: salaryRange[0],
      salaryMax: salaryRange[1],
    };
    return f;
  }, [keyword, work, emp, exp, industry, salaryRange]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    listJobs(apiFilters)
      .then((j) => {
        if (!cancelled) setJobs(j);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [apiFilters]);

  const sortedJobs = useMemo(() => {
    const out = [...jobs].map((j) => ({
      job: j,
      score: browseMatchScore(j),
    }));

    if (sort === 'newest') {
      out.sort((a, b) => new Date(b.job.postedAt).getTime() - new Date(a.job.postedAt).getTime());
      return out;
    }
    if (sort === 'salary') {
      out.sort((a, b) => b.job.salaryMax - a.job.salaryMax);
      return out;
    }
    // relevance: featured first, then match score
    out.sort((a, b) => {
      const fa = a.job.featured ? 1 : 0;
      const fb = b.job.featured ? 1 : 0;
      if (fb !== fa) return fb - fa;
      return b.score - a.score;
    });
    return out;
  }, [jobs, sort]);

  const filterPaperSx = {
    p: 2,
    borderRadius: 2,
    border: '1px solid',
    borderColor: 'divider',
    bgcolor: 'background.paper',
    position: 'sticky' as const,
    top: 16,
  };

  const pillSx = {
    '& .MuiToggleButton-root': {
      textTransform: 'none',
      fontWeight: 600,
      fontSize: '0.8125rem',
      px: 1.5,
      py: 0.5,
      borderRadius: '999px',
      border: '1px solid',
      borderColor: 'divider',
      color: 'text.secondary',
      '&.Mui-selected': {
        bgcolor: 'primary.dark',
        color: '#fff',
        borderColor: 'primary.dark',
        '&:hover': {
          bgcolor: 'primary.dark',
        },
      },
    },
  };

  return (
    <JobsShell>
      <Typography variant="h4" component="h1" fontWeight={700} sx={{ mb: 0.5, letterSpacing: '-0.02em' }}>
        Browse jobs
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Filter by workplace, role level, and salary — results update as you go.
      </Typography>

      <Paper
        elevation={0}
        sx={{
          p: 2,
          mb: 3,
          borderRadius: 2,
          border: '1px solid',
          borderColor: 'divider',
        }}
      >
        <TextField
          fullWidth
          placeholder="Title, skill, or company"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          InputProps={{
            startAdornment: (
              <IconifyIcon icon="mdi:magnify" width={22} height={22} style={{ marginRight: 8, opacity: 0.55 }} />
            ),
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
              bgcolor: 'rgba(0,0,0,0.03)',
            },
          }}
        />
      </Paper>

      <Grid container spacing={3} alignItems="flex-start">
        {/* Filters sidebar */}
        <Grid xs={12} md={4} lg={3.5}>
          <Paper elevation={0} sx={filterPaperSx}>
            <Typography
              variant="overline"
              fontWeight={800}
              letterSpacing="0.12em"
              color="text.secondary"
              sx={{ display: 'block', mb: 2 }}
            >
              Filters
            </Typography>

            <Typography variant="caption" fontWeight={700} color="text.primary" sx={{ display: 'block', mb: 1 }}>
              Work arrangement
            </Typography>
            <ToggleButtonGroup
              exclusive
              size="small"
              value={work}
              onChange={(_, v) => v != null && setWork(v)}
              sx={{ ...pillSx, flexWrap: 'wrap', gap: 0.75, mb: 2.5 }}
            >
              <ToggleButton value="all">All</ToggleButton>
              <ToggleButton value="on_site">On-site</ToggleButton>
              <ToggleButton value="hybrid">Hybrid</ToggleButton>
              <ToggleButton value="remote">Remote</ToggleButton>
            </ToggleButtonGroup>

            <Typography variant="caption" fontWeight={700} color="text.primary" sx={{ display: 'block', mb: 1 }}>
              Employment type
            </Typography>
            <ToggleButtonGroup
              exclusive
              size="small"
              value={emp}
              onChange={(_, v) => v != null && setEmp(v)}
              sx={{ ...pillSx, flexWrap: 'wrap', gap: 0.75, mb: 2.5 }}
            >
              <ToggleButton value="all">All</ToggleButton>
              <ToggleButton value="full_time">Full-time</ToggleButton>
              <ToggleButton value="part_time">Part-time</ToggleButton>
              <ToggleButton value="contract">Contract</ToggleButton>
              <ToggleButton value="internship">Internship</ToggleButton>
            </ToggleButtonGroup>

            <Typography variant="caption" fontWeight={700} color="text.primary" sx={{ display: 'block', mb: 1 }}>
              Experience level
            </Typography>
            <ToggleButtonGroup
              exclusive
              size="small"
              value={exp}
              onChange={(_, v) => v != null && setExp(v)}
              sx={{ ...pillSx, flexWrap: 'wrap', gap: 0.75, mb: 2.5 }}
            >
              <ToggleButton value="all">All</ToggleButton>
              <ToggleButton value="entry">Entry</ToggleButton>
              <ToggleButton value="mid">Mid</ToggleButton>
              <ToggleButton value="senior">Senior</ToggleButton>
              <ToggleButton value="director">Director</ToggleButton>
            </ToggleButtonGroup>

            <Typography variant="caption" fontWeight={700} color="text.primary" sx={{ display: 'block', mb: 1 }}>
              Salary range (SGD/mo)
            </Typography>
            <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}>
              <Typography variant="caption" color="text.secondary">
                ${salaryRange[0].toLocaleString()}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                ${salaryRange[1].toLocaleString()}
              </Typography>
            </Stack>
            <Slider
              value={salaryRange}
              onChange={(_, v) => setSalaryRange(v as [number, number])}
              valueLabelDisplay="auto"
              min={SALARY_SLIDER_MIN}
              max={SALARY_SLIDER_MAX}
              step={500}
              sx={{
                color: 'primary.main',
                mb: 2.5,
                '& .MuiSlider-thumb': { width: 18, height: 18 },
              }}
            />

            <Typography variant="caption" fontWeight={700} color="text.primary" sx={{ display: 'block', mb: 1 }}>
              Industry
            </Typography>
            <FormControl fullWidth size="small">
              <InputLabel id="industry-filter">Industry</InputLabel>
              <Select
                labelId="industry-filter"
                label="Industry"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
              >
                <MenuItem value="all">All industries</MenuItem>
                <MenuItem value="Finance & Accounting">Finance &amp; Accounting</MenuItem>
                <MenuItem value="Technology">Technology</MenuItem>
                <MenuItem value="Aviation">Aviation</MenuItem>
                <MenuItem value="Professional Services">Professional Services</MenuItem>
              </Select>
            </FormControl>
          </Paper>
        </Grid>

        {/* Results */}
        <Grid xs={12} md={8} lg={8.5}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={1} sx={{ mb: 2 }}>
            <Typography variant="body2" fontWeight={700} color="text.primary">
              {loading ? 'Searching…' : `${sortedJobs.length} job${sortedJobs.length === 1 ? '' : 's'} found`}
            </Typography>
            <FormControl size="small" sx={{ minWidth: 200 }}>
              <InputLabel id="sort-jobs">Sort</InputLabel>
              <Select
                labelId="sort-jobs"
                label="Sort"
                value={sort}
                onChange={(e) => setSort(e.target.value as SortKey)}
              >
                <MenuItem value="relevance">Most relevant</MenuItem>
                <MenuItem value="newest">Newest</MenuItem>
                <MenuItem value="salary">Highest salary</MenuItem>
              </Select>
            </FormControl>
          </Stack>

          <Stack spacing={1.75}>
            {loading ? (
              <>
                <JobCardSkeleton />
                <JobCardSkeleton />
                <JobCardSkeleton />
              </>
            ) : sortedJobs.length === 0 ? (
              <Paper
                sx={{
                  p: 5,
                  textAlign: 'center',
                  borderRadius: 2,
                  border: '1px dashed',
                  borderColor: 'divider',
                }}
              >
                <Typography color="text.secondary">No jobs match your filters. Try adjusting salary or industry.</Typography>
              </Paper>
            ) : (
              sortedJobs.map(({ job, score }) => (
                <BrowseJobCard
                  key={job.jobId}
                  job={job}
                  companyName={getCompanyDisplayName(job.companyId)}
                  to={paths.jobsPortal.jobDetail(job.jobId)}
                  matchScore={score}
                />
              ))
            )}
          </Stack>
        </Grid>
      </Grid>
    </JobsShell>
  );
};

export default JobSearch;
