import { createBrowserRouter} from 'react-router-dom';

import AuthLayout from '../layouts/AuthLayout';
import LoginPage from '@/features/auth/pages/Loginpage';
import ProtectedRoute from './ProtectedRoute';
import MainLayout from '../layouts/MainLayout';
import DashBoard from '@/features/Dashboard/Pages/DashBoard';
import RegisterPage from '@/features/auth/pages/RegisterPage';
import CoursePage from '@/features/courses/pages/CoursePage';
export const router = createBrowserRouter([
  /******************** AUTH *********************/
  {
    element: <ProtectedRoute requireAuth={false} />,
    children: [
      {
        path: '/auth',
        element: <AuthLayout />,
        children: [
          {
            path: 'login',
            element: <LoginPage />,
          },
          {
            path:'register',
            element: <RegisterPage/>
          }
        ],
      },
    ],
  },
  /******************** MAIN *********************/
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: '/',
        element: <MainLayout />,
        children: [
          {
            index: true,
            element: <DashBoard />,
          },
          { path: '/courses',
           element: <CoursePage/> },
     ],
      },
    ],
  },
]);
