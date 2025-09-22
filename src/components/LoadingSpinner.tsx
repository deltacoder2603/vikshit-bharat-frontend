import React from 'react';

interface LoadingSpinnerProps {
  language?: 'hindi' | 'english';
}

export default function LoadingSpinner({ language = 'english' }: LoadingSpinnerProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-green-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-4"></div>
        <p className="text-gray-600">
          {language === 'hindi' ? 'लोड हो रहा है...' : 'Loading...'}
        </p>
      </div>
    </div>
  );
}