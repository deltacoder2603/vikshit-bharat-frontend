import React, { ReactNode, Suspense } from 'react';

interface SafeComponentProps {
  children: ReactNode;
  fallback?: ReactNode;
  language?: 'hindi' | 'english';
}

export default function SafeComponent({ children, fallback, language = 'hindi' }: SafeComponentProps) {
  const loadingText = language === 'hindi' ? 'लोड हो रहा है...' : 'Loading component...';
  
  return (
    <Suspense 
      fallback={
        fallback || (
          <div className="min-h-screen bg-gradient-to-br from-orange-100 via-white to-green-100 flex items-center justify-center">
            <div className="text-center">
              <div className="flex items-center justify-center space-x-2 mb-4">
                <div className="w-3 h-6 bg-orange-500 rounded-sm animate-pulse"></div>
                <div className="w-3 h-6 bg-white border border-gray-300 rounded-sm animate-pulse"></div>
                <div className="w-3 h-6 bg-green-600 rounded-sm animate-pulse"></div>
              </div>
              <h2 className="text-xl font-bold text-orange-600 mb-2">VIKSIT KANPUR</h2>
              <p className="text-gray-600">{loadingText}</p>
            </div>
          </div>
        )
      }
    >
      {children}
    </Suspense>
  );
}