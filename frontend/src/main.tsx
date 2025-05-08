import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { VacationProvider } from './context/VacationContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import EmployeeList from './pages/EmployeeList';
import EmployeeForm from './pages/EmployeeForm';
import UserList from './pages/UserList';
import UserForm from './pages/UserForm';
import VacationPeriodList from './pages/VacationPeriodList';
import VacationPeriodForm from './pages/VacationPeriodForm';
import Calendar from './pages/Calendar';
import SystemSettings from './pages/SystemSettings';
import './index.css';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};

const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user || user.role !== 'admin') {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
};

const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: 'users',
        element: (
          <AdminRoute>
            <UserList />
          </AdminRoute>
        ),
      },
      {
        path: 'users/:id',
        element: (
          <AdminRoute>
            <UserForm />
          </AdminRoute>
        ),
      },
      {
        path: 'employees',
        element: (
          <AdminRoute>
            <EmployeeList />
          </AdminRoute>
        ),
      },
      {
        path: 'employees/:id',
        element: (
          <AdminRoute>
            <EmployeeForm />
          </AdminRoute>
        ),
      },
      {
        path: 'vacation-periods',
        element: <VacationPeriodList />,
      },
      {
        path: 'vacation-periods/:id',
        element: <VacationPeriodForm />,
      },
      {
        path: 'calendar',
        element: <Calendar />,
      },
      {
        path: 'settings',
        element: (
          <AdminRoute>
            <SystemSettings />
          </AdminRoute>
        ),
      },
    ],
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <VacationProvider>
        <RouterProvider router={router} />
      </VacationProvider>
    </AuthProvider>
  </StrictMode>
);