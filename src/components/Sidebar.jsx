import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Sidebar = ({ role }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear any session if needed, then redirect
    navigate('/');
  };

  return (
    <div className="h-screen w-64 bg-green-500 text-black flex flex-col shadow-xl fixed left-0 top-0 overflow-y-auto z-10">
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-8">GoodLand CAI</h1>
        
        <nav className="flex flex-col space-y-6">
          {role === 'MANAGER' && (
            <>
              <Link 
                to="/manager/dashboard" 
                className={`text-lg font-medium hover:text-white transition-colors ${location.pathname.includes('dashboard') ? 'text-white underline' : ''}`}
              >
                Dashboard
              </Link>
              <Link 
                to="/manager/inventory" 
                className={`text-lg font-medium hover:text-white transition-colors ${location.pathname.includes('inventory') ? 'text-white underline' : ''}`}
              >
                Inventory
              </Link>
              <Link 
                to="/manager/posm" 
                className={`text-lg font-medium hover:text-white transition-colors ${location.pathname.includes('posm') ? 'text-white underline' : ''}`}
              >
                POSM
              </Link>
            </>
          )}

        </nav>
      </div>

      <div className="mt-auto p-6 space-y-4">
        {/* Manager Button (Interactable but no-op as per instructions) */}
        <button 
          className="w-full py-2 px-4 border-2 border-black rounded-lg font-bold hover:bg-black hover:text-white transition-colors cursor-pointer"
          onClick={() => {}}
        >
          Manager
        </button>

        {/* Logout Button */}
        <button 
          onClick={handleLogout}
          className="w-full py-2 px-4 bg-red-600 text-white border-2 border-black rounded-lg font-bold hover:bg-red-700 transition-colors"
        >
          Log Out
        </button>
      </div>
    </div>
  );
};

export default Sidebar;