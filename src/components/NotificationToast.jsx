import React, { useEffect, useState } from 'react';

const NotificationToast = () => {
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const handleShowToast = (event) => {
      setToast(event.detail);
      
      // Auto hide after 4 seconds
      setTimeout(() => {
        setToast(null);
      }, 4000);
    };

    window.addEventListener('SHOW_TOAST', handleShowToast);
    return () => {
      window.removeEventListener('SHOW_TOAST', handleShowToast);
    };
  }, []);

  if (!toast) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-bounce">
      <div className={`p-4 rounded-xl shadow-2xl flex items-center gap-3 min-w-[300px] border-2 border-black ${
        toast.type === 'warning' ? 'bg-red-100 text-red-900' : 'bg-blue-100 text-blue-900'
      }`}>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${
             toast.type === 'warning' ? 'bg-red-600' : 'bg-blue-600'
        }`}>
            !
        </div>
        <div>
            <h4 className="font-bold">{toast.type === 'warning' ? 'Alert' : 'Info'}</h4>
            <p className="text-sm">{toast.message}</p>
        </div>
      </div>
    </div>
  );
};

export default NotificationToast;