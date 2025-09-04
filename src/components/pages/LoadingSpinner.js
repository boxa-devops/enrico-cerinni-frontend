'use client';

const LoadingSpinner = ({ 
  size = 'medium', 
  message = 'Yuklanmoqda...', 
  className = '' 
}) => {
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8',
    large: 'w-12 h-12'
  };

  return (
    <div className={`flex flex-col items-center justify-center min-h-[300px] text-gray-400 ${className}`}>
      <div className={`animate-spin rounded-full border-2 border-gray-200 border-t-blue-500 ${sizeClasses[size]}`} />
      {message && <p className="mt-4 text-sm font-medium">{message}</p>}
    </div>
  );
};

export default LoadingSpinner; 