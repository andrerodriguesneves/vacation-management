import React from 'react';
import { Menu, User, Calendar, LogOut } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  toggleSidebar: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ toggleSidebar }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  
  const getTitle = () => {
    switch (location.pathname) {
      case '/':
        return 'Dashboard';
      case '/employees':
        return 'Funcionários';
      case '/vacation-periods':
        return 'Períodos de Férias';
      case '/calendar':
        return 'Calendário';
      default:
        if (location.pathname.startsWith('/employees/')) {
          return 'Detalhes do Funcionário';
        }
        if (location.pathname.startsWith('/vacation-periods/')) {
          return 'Detalhes do Período de Férias';
        }
        return 'Sistema de Gerenciamento de Férias';
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <nav className="bg-white border-b border-gray-200 fixed z-30 w-full shadow-sm">
      <div className="px-3 py-3 lg:px-5 lg:pl-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <button
              onClick={toggleSidebar}
              aria-expanded="true"
              aria-controls="sidebar"
              className="lg:hidden mr-2 text-gray-600 hover:text-gray-900 focus:outline-none"
            >
              <Menu size={24} />
              <span className="sr-only">Toggle sidebar</span>
            </button>
            <Link to="/" className="flex items-center">
              <Calendar className="h-8 w-8 text-blue-600 mr-2" />
              <span className="self-center text-xl font-semibold whitespace-nowrap">FériasApp</span>
            </Link>
          </div>
          <div className="flex items-center">
            <h1 className="text-xl font-semibold text-gray-700 mr-4 hidden md:block">
              {getTitle()}
            </h1>
            <div className="relative ml-3">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <User className="h-8 w-8 p-1 rounded-full bg-gray-700 text-white" />
                  <div className="hidden md:block">
                    <div className="text-sm font-medium text-gray-700">{user?.email}</div>
                    <div className="text-xs text-gray-500">{user?.role === 'admin' ? 'Administrador' : 'Usuário'}</div>
                  </div>
                </div>
                <button
                  type="button"
                  className="text-gray-500 hover:text-gray-700"
                  onClick={handleLogout}
                >
                  <LogOut size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;