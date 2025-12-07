
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const BottomNav = () => {
  const location = useLocation();
  const isPos = location.pathname.includes('/employee/pos');
  const isOrders = location.pathname.includes('/employee/orders');

  return (
    <div className="fixed bottom-0 left-0 w-full flex justify-center pb-4 pointer-events-none z-50">
      <div className="bg-secondary rounded-xl shadow-lg border-2 border-black flex overflow-hidden w-96 pointer-events-auto">
        <Link 
          to="/employee/pos" 
          className={`flex-1 text-center py-3 font-bold text-xl hover:bg-yellow-200 border-r border-black ${isPos ? 'bg-yellow-300' : ''}`}
        >
          POS
        </Link>
        <Link 
          to="/employee/orders" 
          className={`flex-1 text-center py-3 font-bold text-xl hover:bg-yellow-200 border-l border-black ${isOrders ? 'bg-yellow-300' : ''}`}
        >
          Order
        </Link>
      </div>
    </div>
  );
};

export default BottomNav;
