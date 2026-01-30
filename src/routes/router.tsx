import { Suspense, lazy } from 'react';
import { Navigate, Outlet, RouteObject, createBrowserRouter } from 'react-router-dom';

import { paths, rootPaths } from './paths';
import PageLoader from '../components/loading/PageLoader';
import Splash from 'components/loading/Splash';
import { RedirectIfAuth } from 'components/auth/RedirectIfAuth';
import { RequireAuth } from 'components/auth/RequireAuth';

// Layout components
const App = lazy(() => import('App'));
const MainLayout = lazy(async () => {
  return Promise.all([
    import('layouts/main-layout'),
    new Promise((resolve) => setTimeout(resolve, 1000)),
  ]).then(([moduleExports]) => moduleExports);
});
const AuthLayout = lazy(async () => {
  return Promise.all([
    import('layouts/auth-layout'),
    new Promise((resolve) => setTimeout(resolve, 1000)),
  ]).then(([moduleExports]) => moduleExports);
});

// Page components
const Error404 = lazy(async () => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return import('pages/errors/Error404');
});

const Sales = lazy(async () => {
  return Promise.all([
    import('pages/home/Sales'),
    new Promise((resolve) => setTimeout(resolve, 500)),
  ]).then(([moduleExports]) => moduleExports);
});

const Account = lazy(async () => {
  return Promise.all([
    import('pages/settings/Account'),
    new Promise((resolve) => setTimeout(resolve, 500)),
  ]).then(([moduleExports]) => moduleExports);
});

const Contact = lazy(async () => {
  return Promise.all([
    import('pages/settings/Contact'),
    new Promise((resolve) => setTimeout(resolve, 500)),
  ]).then(([moduleExports]) => moduleExports);
});

const Badges = lazy(async () => {
  return Promise.all([
    import('pages/settings/Badges'),
    new Promise((resolve) => setTimeout(resolve, 500)),
  ]).then(([moduleExports]) => moduleExports);
});

const ComingSoon = lazy(async () => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return import('pages/ComingSoon');
});

// Authentication pages
const Login = lazy(async () => import('pages/authentication/Login'));
const SignUp = lazy(async () => import('pages/authentication/SignUp'));
const ResetPassword = lazy(async () => import('pages/authentication/ResetPassword'));
const ForgotPassword = lazy(async () => import('pages/authentication/ForgotPassword'));

// Main layout routes
const mainLayoutRoutes: RouteObject[] = [
  // Dashboard
  {
    index: true,
    element: <Sales />,
  },
  
  // My Profile & Membership
  {
    path: 'profile-membership',
    element: <ComingSoon />,
  },
  {
    path: 'profile-membership/edit-profile',
    element: <Account />,
  },
  {
    path: 'profile-membership/change-password',
    element: <ComingSoon />,
  },
  {
    path: 'profile-membership/membership-renewal',
    element: <ComingSoon />,
  },
  {
    path: 'profile-membership/my-membership',
    element: <ComingSoon />,
  },
  {
    path: 'profile-membership/membership-application',
    element: <ComingSoon />,
  },
  {
    path: 'profile-membership/membership-requests/letter-of-good-standing',
    element: <ComingSoon />,
  },
  {
    path: 'profile-membership/membership-requests/reprint-membership-certificate',
    element: <ComingSoon />,
  },
  
  // Credentials & Recognition
  {
    path: 'credentials-recognition',
    element: <ComingSoon />,
  },
  {
    path: 'credentials-recognition/digital-badge',
    element: <Badges />,
  },
  {
    path: 'credentials-recognition/my-certificates',
    element: <ComingSoon />,
  },
  
  // CPE & Learning
  {
    path: 'cpe-learning',
    element: <ComingSoon />,
  },
  {
    path: 'cpe-learning/cpe-compliance',
    element: <ComingSoon />,
  },
  {
    path: 'cpe-learning/my-cpe-records',
    element: <ComingSoon />,
  },
  {
    path: 'cpe-learning/browse-courses-events',
    element: <ComingSoon />,
  },
  {
    path: 'cpe-learning/my-events/registrations',
    element: <ComingSoon />,
  },
  {
    path: 'cpe-learning/my-events/agm-registrations',
    element: <ComingSoon />,
  },
  {
    path: 'cpe-learning/pq-portal',
    element: <ComingSoon />,
  },
  
  // Payments & Credits
  {
    path: 'payments-credits',
    element: <ComingSoon />,
  },
  {
    path: 'payments-credits/my-payments',
    element: <ComingSoon />,
  },
  {
    path: 'payments-credits/my-vouchers',
    element: <ComingSoon />,
  },
  {
    path: 'payments-credits/prepaid-balance',
    element: <ComingSoon />,
  },
  
  // Facilities & Services
  {
    path: 'facilities-services',
    element: <ComingSoon />,
  },
  {
    path: 'facilities-services/facilities-booking',
    element: <ComingSoon />,
  },
  {
    path: 'facilities-services/my-facilities-booking',
    element: <ComingSoon />,
  },
  {
    path: 'facilities-services/iscaccountify',
    element: <ComingSoon />,
  },
  
  // Support & Community
  {
    path: 'support-community',
    element: <ComingSoon />,
  },
  {
    path: 'support-community/isca-cares',
    element: <ComingSoon />,
  },
  {
    path: 'support-community/contact-us',
    element: <Contact />,
  },
];

// Authentication routes
const authRoutes: RouteObject[] = [
  {
    path: 'login',
    element: <Login />,
  },
  {
    path: 'sign-up',
    element: <SignUp />,
  },
  {
    path: 'reset-password',
    element: <ResetPassword />,
  },
  {
    path: 'forgot-password',
    element: <ForgotPassword />,
  },
];

// Root routes configuration
const routes: RouteObject[] = [
  {
    element: (
      <Suspense fallback={<Splash />}>
        <App />
      </Suspense>
    ),
    children: [
      {
        path: rootPaths.homeRoot,
        element: (
          <RequireAuth>
            <MainLayout>
              <Suspense fallback={<PageLoader />}>
                <Outlet />
              </Suspense>
            </MainLayout>
          </RequireAuth>
        ),
        children: mainLayoutRoutes,
      },
      {
        path: rootPaths.authRoot,
        element: (
          <RedirectIfAuth>
            <AuthLayout>
              <Suspense fallback={<PageLoader />}>
                <Outlet />
              </Suspense>
            </AuthLayout>
          </RedirectIfAuth>
        ),
        children: authRoutes,
      },
      {
        path: '*',
        element: <Navigate to={paths.auth.login} replace />,
      },
    ],
  },
];

const router = createBrowserRouter(routes, { basename: '/' });

export default router;
