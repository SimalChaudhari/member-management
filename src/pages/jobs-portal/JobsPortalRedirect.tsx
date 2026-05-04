import { ReactElement } from 'react';
import { Navigate } from 'react-router-dom';

import { paths } from 'routes/paths';
import { useJobsPortalRole } from 'services/jobs/useJobsPortalRole';

const JobsPortalRedirect = (): ReactElement => {
  const { role } = useJobsPortalRole();

  if (role === 'individual') {
    return <Navigate to={paths.jobsPortal.seekerDashboard} replace />;
  }
  if (role === 'corporate') {
    return <Navigate to={paths.jobsPortal.employerDashboard} replace />;
  }
  return <Navigate to={paths.jobsPortal.adminOverview} replace />;
};

export default JobsPortalRedirect;
