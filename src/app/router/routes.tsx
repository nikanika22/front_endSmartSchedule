import { createBrowserRouter} from 'react-router-dom';

import AuthLayout from '../layouts/AuthLayout';
import LoginPage from '@/features/auth/pages/Loginpage';
import ProtectedRoute from './ProtectedRoute';
import MainLayout from '../layouts/MainLayout';
import DashBoard from '@/features/Dashboard/Pages/DashBoard';
import RegisterPage from '@/features/auth/pages/RegisterPage';
import CoursePage from '@/features/courses/pages/CoursePage';
import ScheduleConfigPage from '@/features/schedule-config/pages/ScheduleConfigPage';
import SchedulePage from '@/features/schedules/pages/SchedulePage';
import ProfilePage from '@/features/auth/pages/ProfilePage';
import CourseClassPage from '@/features/courses/pages/CourseClassPage';
import ImportSchedulePage from '@/features/upload/pages/ImportSchedulePage';

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
          { 
            path: '/addCourses',
            element: (
              <CourseClassPage/>
            )
          },
          {
            path: '/create-admin',
            element: <RegisterPage isAdminMode={true} />
          },
          {
            path: '/import-schedule',
            element: <ImportSchedulePage />
          },
          { 
            path: '/courses',
           element: <CoursePage/> },
          { path: '/schedule-config',
           element: <ScheduleConfigPage/> },
          { path: '/schedules',
           element: <SchedulePage/> },
           {
            path: '/profile',
            element: <ProfilePage/>
           }
     ],
      },
    ],
  },
]);
