import PropTypes from 'prop-types';
import { NavLink, useNavigate } from 'react-router-dom';
import { Home, Users, Ticket, FileText, Bot, CreditCard, Menu, X, LogOut } from 'lucide-react';
import { useState } from 'react';
import { logoutUser } from '../../api/auth';

const AdminLayout = ({ children }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  const navLinks = [
    { to: '/admin/dashboard', icon: Home, text: 'Дашборд' },
    { to: '/admin/users', icon: Users, text: 'Пользователи' },
    { to: '/admin/promo-codes', icon: Ticket, text: 'Промокоды' },
    { to: '/admin/audit-log', icon: FileText, text: 'Аудит' },
    { to: '/admin/ai-content', icon: Bot, text: 'AI Контент' },
    { to: '/admin/payments', icon: CreditCard, text: 'Платежи' },
  ];

  const sidebarContent = (
    <div className="bg-gray-800 text-white w-64 flex flex-col space-y-2 py-7 px-2 absolute inset-y-0 left-0 transform md:relative md:translate-x-0 transition duration-200 ease-in-out">
      <div className="px-4 text-2xl font-bold">Админ-панель</div>
      <nav className="mt-10 flex-grow">
        {navLinks.map(link => (
          <NavLink
            key={link.to}
            to={link.to}
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center space-x-2 py-2.5 px-4 rounded transition duration-200 ${
                isActive ? 'bg-gray-700' : 'hover:bg-gray-700'
              }`
            }
          >
            <link.icon className="w-6 h-6" />
            <span>{link.text}</span>
          </NavLink>
        ))}
      </nav>
      <div>
        <button
          onClick={handleLogout}
          className="flex items-center space-x-2 py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700 w-full"
        >
          <LogOut className="w-6 h-6" />
          <span>Выйти</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Mobile sidebar toggle */}
      <div className="md:hidden">
        <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="p-4">
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <div className={`fixed inset-0 z-30 md:relative md:translate-x-0 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out`}>
        {sidebarContent}
      </div>


      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="flex justify-between items-center p-4 bg-white border-b">
          <h1 className="text-xl font-bold">Дашборд</h1>
        </header>
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200 p-4">
          {children}
        </main>
      </div>
    </div>
  );
};

AdminLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AdminLayout;
