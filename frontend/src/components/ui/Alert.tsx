import React from 'react';
import { AlertCircle, CheckCircle, Info, X, AlertTriangle } from 'lucide-react';

type AlertVariant = 'info' | 'success' | 'warning' | 'error';

interface AlertProps {
  variant?: AlertVariant;
  title?: string;
  message: string;
  onClose?: () => void;
  className?: string;
}

const Alert: React.FC<AlertProps> = ({
  variant = 'info',
  title,
  message,
  onClose,
  className = '',
}) => {
  const baseClasses = 'p-4 rounded-md mb-4';

  const variantConfig = {
    info: {
      containerClasses: 'bg-blue-50 border border-blue-100',
      iconClasses: 'text-blue-500',
      titleClasses: 'text-blue-800',
      textClasses: 'text-blue-700',
      icon: <Info className="h-5 w-5" />,
    },
    success: {
      containerClasses: 'bg-green-50 border border-green-100',
      iconClasses: 'text-green-500',
      titleClasses: 'text-green-800',
      textClasses: 'text-green-700',
      icon: <CheckCircle className="h-5 w-5" />,
    },
    warning: {
      containerClasses: 'bg-yellow-50 border border-yellow-100',
      iconClasses: 'text-yellow-500',
      titleClasses: 'text-yellow-800',
      textClasses: 'text-yellow-700',
      icon: <AlertTriangle className="h-5 w-5" />,
    },
    error: {
      containerClasses: 'bg-red-50 border border-red-100',
      iconClasses: 'text-red-500',
      titleClasses: 'text-red-800',
      textClasses: 'text-red-700',
      icon: <AlertCircle className="h-5 w-5" />,
    },
  };

  const { containerClasses, iconClasses, titleClasses, textClasses, icon } = variantConfig[variant];

  return (
    <div className={`${baseClasses} ${containerClasses} ${className}`}>
      <div className="flex">
        <div className={`flex-shrink-0 ${iconClasses}`}>{icon}</div>
        <div className="ml-3 flex-1">
          {title && <h3 className={`text-sm font-medium ${titleClasses}`}>{title}</h3>}
          <div className={`text-sm ${title ? 'mt-2' : ''} ${textClasses}`}>{message}</div>
        </div>
        {onClose && (
          <button
            type="button"
            className={`ml-auto -mx-1.5 -my-1.5 rounded-md p-1.5 focus:outline-none focus:ring-2 ${iconClasses}`}
            onClick={onClose}
          >
            <span className="sr-only">Dismiss</span>
            <X className="h-5 w-5" />
          </button>
        )}
      </div>
    </div>
  );
};

export default Alert;