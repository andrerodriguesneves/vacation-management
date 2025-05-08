import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Users, Calendar, BarChart, Clock, Settings, UserCog } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
  const location = useLocation();
  const { user } = useAuth();
  
  const menuItems = [
    {
      name: 'Dashboard',
      icon: <BarChart className="w-5 h-5" />,
      path: '/',
    },
    ...(user?.role === 'admin' ? [
      {
        name: 'Usuários',
        icon: <UserCog className="w-5 h-5" />,
        path: '/users',
      }
    ] : []),
    {
      name: 'Períodos de Férias',
      icon: <Clock className="w-5 h-5" />,
      path: '/vacation-periods',
    },
    {
      name: 'Calendário',
      icon: <Calendar className="w-5 h-5" />,
      path: '/calendar',
    },
    ...(user?.role === 'admin' ? [{
      name: 'Configurações',
      icon: <Settings className="w-5 h-5" />,
      path: '/settings',
    }] : []),
  ];

  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden"
          onClick={toggleSidebar}
        ></div>
      )}

      <aside
        id="sidebar"
        className={`fixed top-0 left-0 z-40 w-64 h-screen pt-16 transition-transform 
                   ${isOpen ? 'translate-x-0' : '-translate-x-full'} bg-white border-r 
                   border-gray-200 lg:translate-x-0 lg:w-64`}
        aria-label="Sidebar"
      >
        <div className="h-full px-3 py-4 overflow-y-auto bg-white">
          <ul className="space-y-2 font-medium">
            {menuItems.map((item) => (
              <li key={item.name}>
                <Link
                  to={item.path}
                  className={`flex items-center p-2 text-gray-900 rounded-lg hover:bg-primary-50 group ${
                    location.pathname === item.path ? 'bg-primary-100 text-primary-700' : ''
                  }`}
                >
                  <span className={`${
                    location.pathname === item.path ? 'text-primary-600' : 'text-gray-500'
                  }`}>
                    {item.icon}
                  </span>
                  <span className="ml-3">{item.name}</span>
                </Link>
              </li>
            ))}
          </ul>
          <div className="pt-5 mt-5 border-t border-gray-200">
            <div className="px-4 py-3">
              <h5 className="text-sm font-medium text-gray-500">Sistema</h5>
              <p className="text-sm text-gray-700 mt-1">Versão 1.0.0</p>
              <p className="text-xs text-gray-500 mt-1">MVP - Controle de Férias</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;