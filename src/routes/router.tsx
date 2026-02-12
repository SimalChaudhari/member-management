import { Suspense, lazy } from 'react';
import { Navigate, Outlet, RouteObject, createBrowserRouter } from 'react-router-dom';

import { paths, rootPaths, routePaths } from './paths';
import PageLoader from '../components/loading/PageLoader';
import Splash from 'components/loading/Splash';
import { RedirectIfAuth } from 'components/auth/RedirectIfAuth';
import { RequireAuth } from 'components/auth/RequireAuth';

// ============================================================================
// LAYOUT COMPONENTS
// ============================================================================

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

// ============================================================================
// PAGE COMPONENTS
// ============================================================================

const Sales = lazy(async () => {
  return Promise.all([
    import('pages/home/Sales'),
    new Promise((resolve) => setTimeout(resolve, 500)),
  ]).then(([moduleExports]) => moduleExports);
});

const EditProfile = lazy(async () => {
  return Promise.all([
    import('pages/profile-membership/EditProfile'),
    new Promise((resolve) => setTimeout(resolve, 500)),
  ]).then(([moduleExports]) => moduleExports);
});

const ChangePassword = lazy(async () => {
  return Promise.all([
    import('pages/profile-membership/ChangePassword'),
    new Promise((resolve) => setTimeout(resolve, 500)),
  ]).then(([moduleExports]) => moduleExports);
});

const MyMembership = lazy(async () => {
  return Promise.all([
    import('pages/profile-membership/MyMembership'),
    new Promise((resolve) => setTimeout(resolve, 500)),
  ]).then(([moduleExports]) => moduleExports);
});

const MembershipApplication = lazy(async () => {
  return Promise.all([
    import('pages/profile-membership/MembershipApplication'),
    new Promise((resolve) => setTimeout(resolve, 500)),
  ]).then(([moduleExports]) => moduleExports);
});

const MyPayments = lazy(async () => {
  return Promise.all([
    import('pages/payments/MyPayments'),
    new Promise((resolve) => setTimeout(resolve, 500)),
  ]).then(([moduleExports]) => moduleExports);
});

const MyVouchers = lazy(async () => {
  return Promise.all([
    import('pages/payments/MyVouchers'),
    new Promise((resolve) => setTimeout(resolve, 500)),
  ]).then(([moduleExports]) => moduleExports);
});

const MyCertificates = lazy(async () => {
  return Promise.all([
    import('pages/credentials-recognition/MyCertificates'),
    new Promise((resolve) => setTimeout(resolve, 500)),
  ]).then(([moduleExports]) => moduleExports);
});

const EventRegistrations = lazy(async () => {
  return Promise.all([
    import('pages/cpe-learning/EventRegistrations'),
    new Promise((resolve) => setTimeout(resolve, 500)),
  ]).then(([moduleExports]) => moduleExports);
});

const Contact = lazy(async () => {
  return Promise.all([
    import('pages/settings/Contact'),
    new Promise((resolve) => setTimeout(resolve, 500)),
  ]).then(([moduleExports]) => moduleExports);
});

const ComingSoon = lazy(async () => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return import('pages/ComingSoon');
});

const Login = lazy(async () => import('pages/authentication/Login'));
const SignUp = lazy(async () => import('pages/authentication/SignUp'));
const ResetPassword = lazy(async () => import('pages/authentication/ResetPassword'));
const ForgotPassword = lazy(async () => import('pages/authentication/ForgotPassword'));

// ============================================================================
// ROUTE CONFIGURATIONS
// ============================================================================

const mainLayoutRoutes: RouteObject[] = [
  {
    index: true,
    element: <Sales />,
  },
  {
    path: routePaths.profileMembership,
    element: <ComingSoon />,
  },
  {
    path: routePaths.editProfile,
    element: <EditProfile />,
  },
  {
    path: routePaths.changePassword,
    element: <ChangePassword />,
  },
  {
    path: routePaths.membershipRenewal,
    element: <ComingSoon />,
  },
  {
    path: routePaths.myMembership,
    element: <MyMembership />,
  },
  {
    path: routePaths.membershipApplication,
    element: <MembershipApplication />,
  },
  {
    path: routePaths.letterOfGoodStanding,
    element: <ComingSoon />,
  },
  {
    path: routePaths.reprintCertificate,
    element: <ComingSoon />,
  },
  {
    path: routePaths.credentialsRecognition,
    element: <ComingSoon />,
  },
  {
    path: routePaths.digitalBadge,
    element: <ComingSoon />,
  },
  {
    path: routePaths.myCertificates,
    element: <MyCertificates />,
  },
  {
    path: routePaths.cpeLearning,
    element: <ComingSoon />,
  },
  {
    path: routePaths.cpeCompliance,
    element: <ComingSoon />,
  },
  {
    path: routePaths.myCpeRecords,
    element: <ComingSoon />,
  },
  {
    path: routePaths.browseCoursesEvents,
    element: <ComingSoon />,
  },
  {
    path: routePaths.eventRegistrations,
    element: <EventRegistrations />,
  },
  {
    path: routePaths.agmRegistrations,
    element: <ComingSoon />,
  },
  {
    path: routePaths.pqPortal,
    element: <ComingSoon />,
  },
  {
    path: routePaths.paymentsCredits,
    element: <ComingSoon />,
  },
  {
    path: routePaths.myPayments,
    element: <MyPayments />,
  },
  {
    path: routePaths.myVouchers,
    element: <MyVouchers />,
  },
  {
    path: routePaths.prepaidBalance,
    element: <ComingSoon />,
  },
  {
    path: routePaths.facilitiesServices,
    element: <ComingSoon />,
  },
  {
    path: routePaths.facilitiesBooking,
    element: <ComingSoon />,
  },
  {
    path: routePaths.myFacilitiesBooking,
    element: <ComingSoon />,
  },
  {
    path: routePaths.iscaccountify,
    element: <ComingSoon />,
  },
  {
    path: routePaths.supportCommunity,
    element: <ComingSoon />,
  },
  {
    path: routePaths.iscaCares,
    element: <ComingSoon />,
  },
  {
    path: routePaths.contactUs,
    element: <Contact />,
  },
];

const authRoutes: RouteObject[] = [
  {
    path: routePaths.login,
    element: <Login />,
  },
  {
    path: routePaths.signup,
    element: <SignUp />,
  },
  {
    path: routePaths.resetPassword,
    element: <ResetPassword />,
  },
  {
    path: routePaths.forgotPassword,
    element: <ForgotPassword />,
  },
];

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
