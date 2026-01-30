// Root path constants
export const ROOT_PATHS = {
  HOME: '',
  AUTH: 'authentication',
  ERROR: 'error',
} as const;

// Feature path segments
const PROFILE_MEMBERSHIP = 'profile-membership';
const CREDENTIALS_RECOGNITION = 'credentials-recognition';
const CPE_LEARNING = 'cpe-learning';
const PAYMENTS_CREDITS = 'payments-credits';
const FACILITIES_SERVICES = 'facilities-services';
const SUPPORT_COMMUNITY = 'support-community';

// Authentication sub-paths
const AUTH_PATHS = {
  LOGIN: 'login',
  SIGNUP: 'sign-up',
  RESET_PASSWORD: 'reset-password',
  FORGOT_PASSWORD: 'forgot-password',
} as const;

// Helper function to build paths
const buildPath = (...segments: string[]): string => `/${segments.filter(Boolean).join('/')}`;

// Main application paths
export const paths = {
  // Home/Dashboard
  home: buildPath(ROOT_PATHS.HOME),
  dashboard: buildPath(ROOT_PATHS.HOME),

  // My Profile & Membership
  profileMembership: {
    root: buildPath(ROOT_PATHS.HOME, PROFILE_MEMBERSHIP),
    editProfile: buildPath(ROOT_PATHS.HOME, PROFILE_MEMBERSHIP, 'edit-profile'),
    changePassword: buildPath(ROOT_PATHS.HOME, PROFILE_MEMBERSHIP, 'change-password'),
    membershipRenewal: buildPath(ROOT_PATHS.HOME, PROFILE_MEMBERSHIP, 'membership-renewal'),
    myMembership: buildPath(ROOT_PATHS.HOME, PROFILE_MEMBERSHIP, 'my-membership'),
    membershipApplication: buildPath(ROOT_PATHS.HOME, PROFILE_MEMBERSHIP, 'membership-application'),
    membershipRequests: {
      root: buildPath(ROOT_PATHS.HOME, PROFILE_MEMBERSHIP, 'membership-requests'),
      letterOfGoodStanding: buildPath(ROOT_PATHS.HOME, PROFILE_MEMBERSHIP, 'membership-requests', 'letter-of-good-standing'),
      reprintCertificate: buildPath(ROOT_PATHS.HOME, PROFILE_MEMBERSHIP, 'membership-requests', 'reprint-membership-certificate'),
    },
  },

  // Credentials & Recognition
  credentialsRecognition: {
    root: buildPath(ROOT_PATHS.HOME, CREDENTIALS_RECOGNITION),
    digitalBadge: buildPath(ROOT_PATHS.HOME, CREDENTIALS_RECOGNITION, 'digital-badge'),
    myCertificates: buildPath(ROOT_PATHS.HOME, CREDENTIALS_RECOGNITION, 'my-certificates'),
  },

  // CPE & Learning
  cpeLearning: {
    root: buildPath(ROOT_PATHS.HOME, CPE_LEARNING),
    cpeCompliance: buildPath(ROOT_PATHS.HOME, CPE_LEARNING, 'cpe-compliance'),
    myCpeRecords: buildPath(ROOT_PATHS.HOME, CPE_LEARNING, 'my-cpe-records'),
    browseCoursesEvents: buildPath(ROOT_PATHS.HOME, CPE_LEARNING, 'browse-courses-events'),
    myEvents: {
      root: buildPath(ROOT_PATHS.HOME, CPE_LEARNING, 'my-events'),
      registrations: buildPath(ROOT_PATHS.HOME, CPE_LEARNING, 'my-events', 'registrations'),
      agmRegistrations: buildPath(ROOT_PATHS.HOME, CPE_LEARNING, 'my-events', 'agm-registrations'),
    },
    pqPortal: buildPath(ROOT_PATHS.HOME, CPE_LEARNING, 'pq-portal'),
  },

  // Payments & Credits
  paymentsCredits: {
    root: buildPath(ROOT_PATHS.HOME, PAYMENTS_CREDITS),
    myPayments: buildPath(ROOT_PATHS.HOME, PAYMENTS_CREDITS, 'my-payments'),
    myVouchers: buildPath(ROOT_PATHS.HOME, PAYMENTS_CREDITS, 'my-vouchers'),
    prepaidBalance: buildPath(ROOT_PATHS.HOME, PAYMENTS_CREDITS, 'prepaid-balance'),
  },

  // Facilities & Services
  facilitiesServices: {
    root: buildPath(ROOT_PATHS.HOME, FACILITIES_SERVICES),
    facilitiesBooking: buildPath(ROOT_PATHS.HOME, FACILITIES_SERVICES, 'facilities-booking'),
    myFacilitiesBooking: buildPath(ROOT_PATHS.HOME, FACILITIES_SERVICES, 'my-facilities-booking'),
    iscaccountify: buildPath(ROOT_PATHS.HOME, FACILITIES_SERVICES, 'iscaccountify'),
  },

  // Support & Community
  supportCommunity: {
    root: buildPath(ROOT_PATHS.HOME, SUPPORT_COMMUNITY),
    iscaCares: buildPath(ROOT_PATHS.HOME, SUPPORT_COMMUNITY, 'isca-cares'),
    contactUs: buildPath(ROOT_PATHS.HOME, SUPPORT_COMMUNITY, 'contact-us'),
  },

  // Authentication
  auth: {
    login: buildPath(ROOT_PATHS.AUTH, AUTH_PATHS.LOGIN),
    signup: buildPath(ROOT_PATHS.AUTH, AUTH_PATHS.SIGNUP),
    resetPassword: buildPath(ROOT_PATHS.AUTH, AUTH_PATHS.RESET_PASSWORD),
    forgotPassword: buildPath(ROOT_PATHS.AUTH, AUTH_PATHS.FORGOT_PASSWORD),
  },

  // Error
  error404: buildPath(ROOT_PATHS.ERROR, '404'),
} as const;

// Legacy exports for backward compatibility
export const rootPaths = {
  homeRoot: ROOT_PATHS.HOME,
  authRoot: ROOT_PATHS.AUTH,
  errorRoot: ROOT_PATHS.ERROR,
};

export default paths;
