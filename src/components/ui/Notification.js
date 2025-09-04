'use client';

import { useEffect } from 'react';
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';

const Notification = () => {
  const { notification, clearNotification } = useApp();

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        clearNotification();
      }, 5000); // Auto-hide after 5 seconds

      return () => clearTimeout(timer);
    }
  }, [notification, clearNotification]);

  if (!notification) return null;

  const getIcon = () => {
    switch (notification.type) {
      case 'success':
        return <CheckCircle size={20} />;
      case 'error':
        return <AlertCircle size={20} />;
      case 'warning':
        return <AlertTriangle size={20} />;
      case 'info':
        return <Info size={20} />;
      default:
        return <Info size={20} />;
    }
  };

  const getNotificationClass = () => {
    switch (notification.type) {
      case 'success':
        return "";
      case 'error':
        return "";
      case 'warning':
        return "";
      case 'info':
        return "";
      default:
        return "";
    }
  };

  return (
    <div className="">
      <div className="">
        {getIcon()}
      </div>
      <div className="">
        {notification.title && (
          <h4 className="">{notification.title}</h4>
        )}
        <p className="">{notification.message}</p>
      </div>
      <button 
        className=""
        onClick={clearNotification}
        aria-label="Bildirishnomani yopish"
      >
        <X size={16} />
      </button>
    </div>
  );
};

export default Notification; 