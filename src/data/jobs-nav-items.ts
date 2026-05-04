import type { NavItem } from 'data/nav-items';
import { paths } from 'routes/paths';
import type { JobsPortalRole } from 'services/jobs/types';

/**
 * Role-based sidebar for Jobs Portal (E‑Services). Dev role is toggled in JobsPortalLayout.
 */
export function getJobsPortalNavItem(role: JobsPortalRole): NavItem {
  const base: Omit<NavItem, 'sublist'> = {
    title: 'Jobs Portal',
    path: paths.jobsPortal.root,
    icon: 'mdi:briefcase-search',
    active: false,
    collapsible: true,
  };

  if (role === 'individual') {
    return {
      ...base,
      sublist: [
        {
          title: 'Seeker dashboard',
          path: 'seeker-dashboard',
          active: false,
          collapsible: false,
        },
        {
          title: 'Browse jobs',
          path: 'browse-jobs',
          active: false,
          collapsible: false,
        },
        {
          title: 'My applications',
          path: 'my-applications',
          active: false,
          collapsible: false,
        },
        {
          title: 'Saved jobs',
          path: 'saved-jobs',
          active: false,
          collapsible: false,
        },
        {
          title: 'Career profile',
          path: 'career-profile',
          active: false,
          collapsible: false,
        },
      ],
    };
  }

  if (role === 'corporate') {
    return {
      ...base,
      sublist: [
        {
          title: 'Employer dashboard',
          path: 'employer-dashboard',
          active: false,
          collapsible: false,
        },
        {
          title: 'My job posts',
          path: 'my-job-posts',
          active: false,
          collapsible: false,
        },
      ],
    };
  }

  return {
    ...base,
    sublist: [
      {
        title: 'Admin overview',
        path: 'admin-overview',
        active: false,
        collapsible: false,
      },
      {
        title: 'Moderate jobs',
        path: 'moderate-jobs',
        active: false,
        collapsible: false,
      },
      {
        title: 'Verify employers',
        path: 'verify-employers',
        active: false,
        collapsible: false,
      },
    ],
  };
}
