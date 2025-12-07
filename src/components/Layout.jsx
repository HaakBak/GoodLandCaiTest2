
import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import BottomNav from './BottomNav';
import NotificationToast from '../components/NotificationToast';

const Layout = () => {
  const location = useLocation();
  const isManager = location.pathname.includes('/manager');
  const isEmployee = location.pathname.includes('/employee');
  // POS-specific route path -> make POS full viewport height and non-scrollable
  const isEmployeePOS = location.pathname === '/employee/pos' || location.pathname.includes('/employee/pos');

  return (
    <div className="flex min-h-screen">
      <NotificationToast />

      {/* Manager: sidebar + main content with left margin */}
      {isManager ? (
        <>
          <Sidebar role="MANAGER" />
          <div className="flex-1 ml-64">
            <Outlet />
          </div>
        </>
      ) : isEmployee ? (
        /* Employee: full-width main content, reserve space for bottom nav */
        // For the employee POS view we want the content to occupy the full
        // viewport height and prevent page-level scrolling. We keep the
        // bottom nav reserved space (pb-16) so content doesn't overlap it.
        <div className={`${isEmployeePOS ? 'flex-1 pb-16 h-screen overflow-hidden' : 'flex-1 pb-16'}`}>
          <Outlet />
        </div>
      ) : (
        /* Default: just main content */
        <div className="flex-1 sticky">
          <Outlet />
        </div>
      )}
      {isEmployee && <BottomNav />}
    </div>
  );
};

export default Layout;
