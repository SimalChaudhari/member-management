// ============================================================================
// CONSTANTS
// ============================================================================

const ROOT_PATHS = {
  HOME: '',
  AUTH: 'authentication',
} as const;

const FEATURE_SEGMENTS = {
  PROFILE_MEMBERSHIP: 'profile-membership',
  CREDENTIALS_RECOGNITION: 'credentials-recognition',
  CPE_LEARNING: 'cpe-learning',
  PAYMENTS_CREDITS: 'payments-credits',
  FACILITIES_SERVICES: 'facilities-services',
  SUPPORT_COMMUNITY: 'support-community',
  JOBS_PORTAL: 'jobs-portal',
} as const;

const AUTH_SEGMENTS = {
  LOGIN: 'login',
  SIGNUP: 'sign-up',
  RESET_PASSWORD: 'reset-password',
  FORGOT_PASSWORD: 'forgot-password',
} as const;

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

const buildPath = (...segments: string[]): string => `/${segments.filter(Boolean).join('/')}`;

const getRelativePath = (fullPath: string): string => {
  return fullPath.replace(/^\//, '');
};

// ============================================================================
// PATH DEFINITIONS
// ============================================================================

export const paths = {
  home: buildPath(ROOT_PATHS.HOME),

  profileMembership: {
    root: buildPath(ROOT_PATHS.HOME, FEATURE_SEGMENTS.PROFILE_MEMBERSHIP),
    editProfile: buildPath(ROOT_PATHS.HOME, FEATURE_SEGMENTS.PROFILE_MEMBERSHIP, 'edit-profile'),
    changePassword: buildPath(ROOT_PATHS.HOME, FEATURE_SEGMENTS.PROFILE_MEMBERSHIP, 'change-password'),
    membershipRenewal: buildPath(ROOT_PATHS.HOME, FEATURE_SEGMENTS.PROFILE_MEMBERSHIP, 'membership-renewal'),
    myMembership: buildPath(ROOT_PATHS.HOME, FEATURE_SEGMENTS.PROFILE_MEMBERSHIP, 'my-membership'),
    membershipApplication: buildPath(ROOT_PATHS.HOME, FEATURE_SEGMENTS.PROFILE_MEMBERSHIP, 'membership-application'),
    membershipRequests: {
      root: buildPath(ROOT_PATHS.HOME, FEATURE_SEGMENTS.PROFILE_MEMBERSHIP, 'membership-requests'),
      letterOfGoodStanding: buildPath(ROOT_PATHS.HOME, FEATURE_SEGMENTS.PROFILE_MEMBERSHIP, 'membership-requests', 'letter-of-good-standing'),
      reprintCertificate: buildPath(ROOT_PATHS.HOME, FEATURE_SEGMENTS.PROFILE_MEMBERSHIP, 'membership-requests', 'reprint-membership-certificate'),
    },
  },

  credentialsRecognition: {
    root: buildPath(ROOT_PATHS.HOME, FEATURE_SEGMENTS.CREDENTIALS_RECOGNITION),
    digitalBadge: buildPath(ROOT_PATHS.HOME, FEATURE_SEGMENTS.CREDENTIALS_RECOGNITION, 'digital-badge'),
    myCertificates: buildPath(ROOT_PATHS.HOME, FEATURE_SEGMENTS.CREDENTIALS_RECOGNITION, 'my-certificates'),
  },

  cpeLearning: {
    root: buildPath(ROOT_PATHS.HOME, FEATURE_SEGMENTS.CPE_LEARNING),
    cpeCompliance: buildPath(ROOT_PATHS.HOME, FEATURE_SEGMENTS.CPE_LEARNING, 'cpe-compliance'),
    myCpeRecords: buildPath(ROOT_PATHS.HOME, FEATURE_SEGMENTS.CPE_LEARNING, 'my-cpe-records'),
    browseCoursesEvents: buildPath(ROOT_PATHS.HOME, FEATURE_SEGMENTS.CPE_LEARNING, 'browse-courses-events'),
    myEvents: {
      root: buildPath(ROOT_PATHS.HOME, FEATURE_SEGMENTS.CPE_LEARNING, 'my-events'),
      registrations: buildPath(ROOT_PATHS.HOME, FEATURE_SEGMENTS.CPE_LEARNING, 'my-events', 'registrations'),
      agmRegistrations: buildPath(ROOT_PATHS.HOME, FEATURE_SEGMENTS.CPE_LEARNING, 'my-events', 'agm-registrations'),
    },
    pqPortal: buildPath(ROOT_PATHS.HOME, FEATURE_SEGMENTS.CPE_LEARNING, 'pq-portal'),
  },

  paymentsCredits: {
    root: buildPath(ROOT_PATHS.HOME, FEATURE_SEGMENTS.PAYMENTS_CREDITS),
    myPayments: buildPath(ROOT_PATHS.HOME, FEATURE_SEGMENTS.PAYMENTS_CREDITS, 'my-payments'),
    myVouchers: buildPath(ROOT_PATHS.HOME, FEATURE_SEGMENTS.PAYMENTS_CREDITS, 'my-vouchers'),
    prepaidBalance: buildPath(ROOT_PATHS.HOME, FEATURE_SEGMENTS.PAYMENTS_CREDITS, 'prepaid-balance'),
  },

  facilitiesServices: {
    root: buildPath(ROOT_PATHS.HOME, FEATURE_SEGMENTS.FACILITIES_SERVICES),
    facilitiesBooking: buildPath(ROOT_PATHS.HOME, FEATURE_SEGMENTS.FACILITIES_SERVICES, 'facilities-booking'),
    myFacilitiesBooking: buildPath(ROOT_PATHS.HOME, FEATURE_SEGMENTS.FACILITIES_SERVICES, 'my-facilities-booking'),
    iscaccountify: buildPath(ROOT_PATHS.HOME, FEATURE_SEGMENTS.FACILITIES_SERVICES, 'iscaccountify'),
  },

  supportCommunity: {
    root: buildPath(ROOT_PATHS.HOME, FEATURE_SEGMENTS.SUPPORT_COMMUNITY),
    iscaCares: buildPath(ROOT_PATHS.HOME, FEATURE_SEGMENTS.SUPPORT_COMMUNITY, 'isca-cares'),
    contactUs: buildPath(ROOT_PATHS.HOME, FEATURE_SEGMENTS.SUPPORT_COMMUNITY, 'contact-us'),
  },

  /** Jobs Portal (E‑Services) — authenticated only; role drives nav (individual / corporate / admin). */
  jobsPortal: {
    root: buildPath(ROOT_PATHS.HOME, FEATURE_SEGMENTS.JOBS_PORTAL),
    seekerDashboard: buildPath(ROOT_PATHS.HOME, FEATURE_SEGMENTS.JOBS_PORTAL, 'seeker-dashboard'),
    browseJobs: buildPath(ROOT_PATHS.HOME, FEATURE_SEGMENTS.JOBS_PORTAL, 'browse-jobs'),
    myApplications: buildPath(ROOT_PATHS.HOME, FEATURE_SEGMENTS.JOBS_PORTAL, 'my-applications'),
    savedJobs: buildPath(ROOT_PATHS.HOME, FEATURE_SEGMENTS.JOBS_PORTAL, 'saved-jobs'),
    careerProfile: buildPath(ROOT_PATHS.HOME, FEATURE_SEGMENTS.JOBS_PORTAL, 'career-profile'),
    /** Employer console (inner header + sub-nav) — preferred entry for corporate */
    employer: {
      root: buildPath(ROOT_PATHS.HOME, FEATURE_SEGMENTS.JOBS_PORTAL, 'employer'),
      jobs: buildPath(ROOT_PATHS.HOME, FEATURE_SEGMENTS.JOBS_PORTAL, 'employer', 'jobs'),
      pipeline: buildPath(ROOT_PATHS.HOME, FEATURE_SEGMENTS.JOBS_PORTAL, 'employer', 'pipeline'),
      talent: buildPath(ROOT_PATHS.HOME, FEATURE_SEGMENTS.JOBS_PORTAL, 'employer', 'talent'),
      post: buildPath(ROOT_PATHS.HOME, FEATURE_SEGMENTS.JOBS_PORTAL, 'employer', 'post'),
      jobApplicants: (jobId: string) =>
        buildPath(ROOT_PATHS.HOME, FEATURE_SEGMENTS.JOBS_PORTAL, 'employer', 'jobs', jobId, 'applicants'),
    },
    /** @deprecated Use jobsPortal.employer.root — kept for redirects */
    employerDashboard: buildPath(ROOT_PATHS.HOME, FEATURE_SEGMENTS.JOBS_PORTAL, 'employer-dashboard'),
    postJob: buildPath(ROOT_PATHS.HOME, FEATURE_SEGMENTS.JOBS_PORTAL, 'post-job'),
    myJobPosts: buildPath(ROOT_PATHS.HOME, FEATURE_SEGMENTS.JOBS_PORTAL, 'my-job-posts'),
    adminOverview: buildPath(ROOT_PATHS.HOME, FEATURE_SEGMENTS.JOBS_PORTAL, 'admin-overview'),
    moderateJobs: buildPath(ROOT_PATHS.HOME, FEATURE_SEGMENTS.JOBS_PORTAL, 'moderate-jobs'),
    verifyEmployers: buildPath(ROOT_PATHS.HOME, FEATURE_SEGMENTS.JOBS_PORTAL, 'verify-employers'),
    jobDetail: (jobId: string) => buildPath(ROOT_PATHS.HOME, FEATURE_SEGMENTS.JOBS_PORTAL, 'jobs', jobId),
    jobApplicants: (jobId: string) =>
      buildPath(ROOT_PATHS.HOME, FEATURE_SEGMENTS.JOBS_PORTAL, 'employer', 'jobs', jobId, 'applicants'),
  },

  auth: {
    login: buildPath(ROOT_PATHS.AUTH, AUTH_SEGMENTS.LOGIN),
    signup: buildPath(ROOT_PATHS.AUTH, AUTH_SEGMENTS.SIGNUP),
    resetPassword: buildPath(ROOT_PATHS.AUTH, AUTH_SEGMENTS.RESET_PASSWORD),
    forgotPassword: buildPath(ROOT_PATHS.AUTH, AUTH_SEGMENTS.FORGOT_PASSWORD),
  },
} as const;

// ============================================================================
// ROUTER HELPERS
// ============================================================================

export const rootPaths = {
  homeRoot: ROOT_PATHS.HOME,
  authRoot: ROOT_PATHS.AUTH,
};

export const routePaths = {
  profileMembership: getRelativePath(paths.profileMembership.root),
  editProfile: getRelativePath(paths.profileMembership.editProfile),
  changePassword: getRelativePath(paths.profileMembership.changePassword),
  membershipRenewal: getRelativePath(paths.profileMembership.membershipRenewal),
  myMembership: getRelativePath(paths.profileMembership.myMembership),
  membershipApplication: getRelativePath(paths.profileMembership.membershipApplication),
  letterOfGoodStanding: getRelativePath(paths.profileMembership.membershipRequests.letterOfGoodStanding),
  reprintCertificate: getRelativePath(paths.profileMembership.membershipRequests.reprintCertificate),
  credentialsRecognition: getRelativePath(paths.credentialsRecognition.root),
  digitalBadge: getRelativePath(paths.credentialsRecognition.digitalBadge),
  myCertificates: getRelativePath(paths.credentialsRecognition.myCertificates),
  cpeLearning: getRelativePath(paths.cpeLearning.root),
  cpeCompliance: getRelativePath(paths.cpeLearning.cpeCompliance),
  myCpeRecords: getRelativePath(paths.cpeLearning.myCpeRecords),
  browseCoursesEvents: getRelativePath(paths.cpeLearning.browseCoursesEvents),
  eventRegistrations: getRelativePath(paths.cpeLearning.myEvents.registrations),
  agmRegistrations: getRelativePath(paths.cpeLearning.myEvents.agmRegistrations),
  pqPortal: getRelativePath(paths.cpeLearning.pqPortal),
  paymentsCredits: getRelativePath(paths.paymentsCredits.root),
  myPayments: getRelativePath(paths.paymentsCredits.myPayments),
  myVouchers: getRelativePath(paths.paymentsCredits.myVouchers),
  prepaidBalance: getRelativePath(paths.paymentsCredits.prepaidBalance),
  facilitiesServices: getRelativePath(paths.facilitiesServices.root),
  facilitiesBooking: getRelativePath(paths.facilitiesServices.facilitiesBooking),
  myFacilitiesBooking: getRelativePath(paths.facilitiesServices.myFacilitiesBooking),
  iscaccountify: getRelativePath(paths.facilitiesServices.iscaccountify),
  supportCommunity: getRelativePath(paths.supportCommunity.root),
  iscaCares: getRelativePath(paths.supportCommunity.iscaCares),
  contactUs: getRelativePath(paths.supportCommunity.contactUs),
  jobsPortal: getRelativePath(paths.jobsPortal.root),
  jobsPortalSeekerDashboard: getRelativePath(paths.jobsPortal.seekerDashboard),
  jobsPortalBrowseJobs: getRelativePath(paths.jobsPortal.browseJobs),
  jobsPortalMyApplications: getRelativePath(paths.jobsPortal.myApplications),
  jobsPortalSavedJobs: getRelativePath(paths.jobsPortal.savedJobs),
  jobsPortalCareerProfile: getRelativePath(paths.jobsPortal.careerProfile),
  jobsPortalEmployerDashboard: getRelativePath(paths.jobsPortal.employerDashboard),
  jobsPortalPostJob: getRelativePath(paths.jobsPortal.postJob),
  jobsPortalMyJobPosts: getRelativePath(paths.jobsPortal.myJobPosts),
  jobsPortalAdminOverview: getRelativePath(paths.jobsPortal.adminOverview),
  jobsPortalModerateJobs: getRelativePath(paths.jobsPortal.moderateJobs),
  jobsPortalVerifyEmployers: getRelativePath(paths.jobsPortal.verifyEmployers),
  login: AUTH_SEGMENTS.LOGIN,
  signup: AUTH_SEGMENTS.SIGNUP,
  resetPassword: AUTH_SEGMENTS.RESET_PASSWORD,
  forgotPassword: AUTH_SEGMENTS.FORGOT_PASSWORD,
};

export default paths;
