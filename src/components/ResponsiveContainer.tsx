import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';

interface ResponsiveContainerProps {
  children: React.ReactNode;
  className?: string;
  enableSafeArea?: boolean;
  fullHeight?: boolean;
}

// Hook to detect device type
export const useDeviceType = () => {
  const [deviceType, setDeviceType] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');
  const [screenSize, setScreenSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateDeviceType = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      setScreenSize({ width, height });
      
      if (width < 640) {
        setDeviceType('mobile');
      } else if (width < 1024) {
        setDeviceType('tablet');
      } else {
        setDeviceType('desktop');
      }
    };

    // Set initial values
    updateDeviceType();
    
    // Add event listener
    window.addEventListener('resize', updateDeviceType);
    window.addEventListener('orientationchange', updateDeviceType);
    
    return () => {
      window.removeEventListener('resize', updateDeviceType);
      window.removeEventListener('orientationchange', updateDeviceType);
    };
  }, []);

  return { deviceType, screenSize };
};

// Hook to detect orientation
export const useOrientation = () => {
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');

  useEffect(() => {
    const updateOrientation = () => {
      const isPortrait = window.innerHeight > window.innerWidth;
      setOrientation(isPortrait ? 'portrait' : 'landscape');
    };

    updateOrientation();
    
    window.addEventListener('resize', updateOrientation);
    window.addEventListener('orientationchange', updateOrientation);
    
    return () => {
      window.removeEventListener('resize', updateOrientation);
      window.removeEventListener('orientationchange', updateOrientation);
    };
  }, []);

  return orientation;
};

// Hook to detect if device supports touch
export const useTouchDevice = () => {
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    const checkTouch = () => {
      setIsTouch('ontouchstart' in window || navigator.maxTouchPoints > 0);
    };

    checkTouch();
  }, []);

  return isTouch;
};

// Responsive container component
export default function ResponsiveContainer({
  children,
  className = '',
  enableSafeArea = true,
  fullHeight = true
}: ResponsiveContainerProps) {
  const { deviceType, screenSize } = useDeviceType();
  const orientation = useOrientation();
  const isTouch = useTouchDevice();

  const baseClasses = [
    'w-full',
    fullHeight ? 'min-h-screen' : '',
    deviceType === 'mobile' ? 'px-4 py-2' : '',
    deviceType === 'tablet' ? 'px-6 py-4' : '',
    deviceType === 'desktop' ? 'px-8 py-6' : '',
    enableSafeArea ? 'safe-area-top safe-area-bottom' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <motion.div
      className={baseClasses}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
      style={{
        maxWidth: deviceType === 'mobile' ? '100vw' : 
                 deviceType === 'tablet' ? '100vw' : 
                 '100%'
      }}
      data-device={deviceType}
      data-orientation={orientation}
      data-touch={isTouch}
    >
      {children}
    </motion.div>
  );
}

// Responsive grid component
export function ResponsiveGrid({
  children,
  className = '',
  cols = { mobile: 1, tablet: 2, desktop: 3 }
}: {
  children: React.ReactNode;
  className?: string;
  cols?: { mobile: number; tablet: number; desktop: number };
}) {
  const { deviceType } = useDeviceType();
  
  const gridCols = deviceType === 'mobile' ? cols.mobile :
                   deviceType === 'tablet' ? cols.tablet :
                   cols.desktop;

  const gridClasses = `grid grid-cols-${gridCols} gap-4 ${className}`;

  return (
    <div className={gridClasses}>
      {children}
    </div>
  );
}

// Responsive flex component
export function ResponsiveFlex({
  children,
  className = '',
  direction = { mobile: 'col', tablet: 'row', desktop: 'row' }
}: {
  children: React.ReactNode;
  className?: string;
  direction?: { mobile: 'row' | 'col'; tablet: 'row' | 'col'; desktop: 'row' | 'col' };
}) {
  const { deviceType } = useDeviceType();
  
  const flexDirection = deviceType === 'mobile' ? direction.mobile :
                       deviceType === 'tablet' ? direction.tablet :
                       direction.desktop;

  const flexClasses = `flex flex-${flexDirection} gap-4 ${className}`;

  return (
    <div className={flexClasses}>
      {children}
    </div>
  );
}

// Responsive text component
export function ResponsiveText({
  children,
  size = 'base',
  className = ''
}: {
  children: React.ReactNode;
  size?: 'sm' | 'base' | 'lg' | 'xl' | '2xl';
  className?: string;
}) {
  return (
    <span className={`text-responsive-${size} ${className}`}>
      {children}
    </span>
  );
}

// Responsive button component
export function ResponsiveButton({
  children,
  onClick,
  className = '',
  variant = 'primary',
  fullWidth = false,
  ...props
}: {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: 'primary' | 'secondary' | 'outline';
  fullWidth?: boolean;
  [key: string]: any;
}) {
  const { deviceType } = useDeviceType();
  const isTouch = useTouchDevice();

  const baseClasses = [
    'btn-responsive',
    'transition-all duration-200',
    isTouch ? 'touch-target' : '',
    deviceType === 'mobile' && fullWidth ? 'w-full' : '',
    variant === 'primary' ? 'bg-orange-500 hover:bg-orange-600 text-white' : '',
    variant === 'secondary' ? 'bg-gray-200 hover:bg-gray-300 text-gray-800' : '',
    variant === 'outline' ? 'border border-orange-500 text-orange-500 hover:bg-orange-50' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <motion.button
      className={baseClasses}
      onClick={onClick}
      whileTap={{ scale: 0.98 }}
      whileHover={{ scale: 1.02 }}
      {...props}
    >
      {children}
    </motion.button>
  );
}

// Responsive card component
export function ResponsiveCard({
  children,
  className = '',
  padding = true
}: {
  children: React.ReactNode;
  className?: string;
  padding?: boolean;
}) {
  return (
    <motion.div
      className={`card-responsive ${padding ? 'spacing-responsive-md' : ''} ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
}