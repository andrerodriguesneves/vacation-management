import { ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { toast } from 'sonner';
import { HomeIcon, UsersIcon, BuildingOfficeIcon, CalendarIcon, ChartBarIcon, Cog6ToothIcon } from '@heroicons/react/24/outline';
import { Button } from '../ui/button';

interface AdminLayoutProps {
  children: ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { label: 'Dashboard', path: '/admin', icon: <HomeIcon className="w-5 h-5" /> },
    { label: 'Usuários', path: '/admin/users', icon: <UsersIcon className="w-5 h-5" /> },
    { label: 'Departamentos', path: '/admin/departments', icon: <BuildingOfficeIcon className="w-5 h-5" /> },
    { label: 'Férias', path: '/admin/vacations', icon: <CalendarIcon className="w-5 h-5" /> },
    { label: 'Relatórios', path: '/admin/reports', icon: <ChartBarIcon className="w-5 h-5" /> },
    { label: 'Configurações', path: '/admin/settings', icon: <Cog6ToothIcon className="w-5 h-5" /> },
  ];

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/login');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      toast.error('Erro ao fazer logout');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-md">
          <div className="p-4">
            <h1 className="text-xl font-bold text-gray-800">Painel Admin</h1>
          </div>
          <nav className="mt-4">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 ${
                  location.pathname === item.path ? 'bg-gray-100 border-r-4 border-primary' : ''
                }`}
              >
                {item.icon}
                <span className="ml-3">{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {/* Header */}
          <header className="bg-white shadow-sm">
            <div className="flex justify-between items-center px-6 py-4">
              <h2 className="text-xl font-semibold text-gray-800">
                {menuItems.find((item) => item.path === location.pathname)?.label || 'Dashboard'}
              </h2>
              <Button variant="ghost" onClick={handleLogout}>
                Sair
              </Button>
            </div>
          </header>

          {/* Page Content */}
          <main className="p-6">{children}</main>
        </div>
      </div>
    </div>
  );
} 