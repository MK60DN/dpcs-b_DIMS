import React from 'react';
import { Check, AlertTriangle, Info } from 'lucide-react';

const NotificationBar = ({ type, message, onClose }) => {
  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return 'bg-green-100 text-green-800 border-l-4 border-green-500';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 border-l-4 border-yellow-500';
      case 'error':
        return 'bg-red-100 text-red-800 border-l-4 border-red-500';
      default:
        return 'bg-blue-100 text-blue-800 border-l-4 border-blue-500';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <Check className="mr-2" size={18} />;
      case 'warning':
      case 'error':
        return <AlertTriangle className="mr-2" size={18} />;
      default:
        return <Info className="mr-2" size={18} />;
    }
  };

  return (
    <div className={`mb-4 p-3 rounded flex items-center justify-between ${getTypeStyles()}`}>
      <div className="flex items-center">
        {getIcon()}
        <span>{message}</span>
      </div>
      <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
        &times;
      </button>
    </div>
  );
};

export default NotificationBar;