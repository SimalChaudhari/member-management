export const rootPaths = {
  homeRoot: '',
  pagesRoot: 'pages',
  applicationsRoot: 'applications',
  ecommerceRoot: 'ecommerce',
  authRoot: 'authentication',
  notificationsRoot: 'notifications',
  calendarRoot: 'calendar',
  messageRoot: 'messages',
  errorRoot: 'error',
};

export default {
  home: `/${rootPaths.homeRoot}`,
  account: `/${rootPaths.homeRoot}/settings/account`,
  payments: `/${rootPaths.homeRoot}/settings/payments`,
  contact: `/${rootPaths.homeRoot}/settings/contact`,
  resetPassword: `/${rootPaths.homeRoot}/settings/reset-password`,
  settingsResetPassword: `/${rootPaths.homeRoot}/settings/reset-password`,
  Badges: `/${rootPaths.homeRoot}/settings/badges`,

  // Membership
  membership: `/${rootPaths.homeRoot}/membership`,
  
  // CPE Compliance
  cpeCompliance: `/${rootPaths.homeRoot}/cpe-compliance`,
  
  // Course & Events
  courseEvents: `/${rootPaths.homeRoot}/course-events`,

  login: `/${rootPaths.authRoot}/login`,
  signup: `/${rootPaths.authRoot}/sign-up`,
  forgotPassword: `/${rootPaths.authRoot}/forgot-password`,
  404: `/${rootPaths.errorRoot}/404`,
};
