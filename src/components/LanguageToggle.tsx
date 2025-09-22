import React from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/button';

interface LanguageToggleProps {
  language: 'hindi' | 'english';
  onToggle: (language: 'hindi' | 'english') => void;
  className?: string;
}

export default function LanguageToggle({ language, onToggle, className = '' }: LanguageToggleProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className={`flex items-center ${className}`}
    >
      <div className="flex items-center bg-white/90 backdrop-blur-sm border-2 border-orange-200 rounded-full p-1 shadow-lg">
        <div className="flex items-center space-x-1">
          <span className="text-lg ml-2">🇮🇳</span>
          
          <motion.button
            onClick={() => onToggle('hindi')}
            className={`px-3 py-1 rounded-full transition-all duration-300 ${
              language === 'hindi'
                ? 'bg-gradient-to-r from-orange-500 to-green-600 text-white shadow-md'
                : 'text-gray-600 hover:text-orange-600'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="font-medium text-sm">हिं</span>
          </motion.button>
          
          <motion.button
            onClick={() => onToggle('english')}
            className={`px-3 py-1 rounded-full transition-all duration-300 ${
              language === 'english'
                ? 'bg-gradient-to-r from-orange-500 to-green-600 text-white shadow-md'
                : 'text-gray-600 hover:text-orange-600'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="font-medium text-sm">EN</span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}