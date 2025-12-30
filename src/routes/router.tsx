import { Suspense, lazy } from 'react';
import { Outlet, RouteObject, createBrowserRouter } from 'react-router-dom';

import { rootPaths } from './paths';

import PageLoader from '../components/loading/PageLoader';
import Splash from 'components/loading/Splash';

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

const Login = lazy(async () => import('pages/authentication/Login'));
const SignUp = lazy(async () => import('pages/authentication/SignUp'));

const ResetPassword = lazy(async () => import('pages/authentication/ResetPassword'));
const ForgotPassword = lazy(async () => import('pages/authentication/ForgotPassword'));

const ComingSoon = lazy(async () => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return import('pages/ComingSoon');
});

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
          <MainLayout>
            <Suspense fallback={<PageLoader />}>
              <Outlet />
            </Suspense>
          </MainLayout>
        ),
        children: [
          {
            index: true,
            element: <Sales />,
          },
          {
            path: 'settings/account',
            element: <Account />,
          },
          {
            path: 'settings/payments',
            element: <ComingSoon />,
          },
          {
            path: 'settings/contact',
            element: <Contact/>,
          },
          {
            path: 'settings/badges',
            element: <Badges />,
          },
          {
            path: 'settings/reset-password',
            element: <ComingSoon />,
          },
          {
            path: 'membership',
            element: <ComingSoon />,
          },
          {
            path: 'cpe-compliance',
            element: <ComingSoon />,
          },
          {
            path: 'course-events',
            element: <ComingSoon />,
          },
        ],
      },
      {
        path: rootPaths.authRoot,
        element: (
          <AuthLayout>
            <Suspense fallback={<PageLoader />}>
              <Outlet />
            </Suspense>
          </AuthLayout>
        ),
        children: [
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
        ],
      },
      {
        path: '*',
        element: <Error404 />,
      },
    ],
  },
];

const router = createBrowserRouter(routes, { basename: '/' });

export default router;
