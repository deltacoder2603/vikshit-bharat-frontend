import React from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Languages, ArrowLeft } from 'lucide-react';
import { Language } from '../utils/translations';

interface EnhancedComponentHeaderProps {
  title: string;
  subtitle?: string;
  description?: string;
  icon?: React.ComponentType<{ className?: string }>;
  language: Language;
  onLanguageChange: (language: Language) => void;
  onBack?: () => void;
  backLabel?: string;
  stats?: Array<{
    label: string;
    value: string | number;
    color?: string;
  }>;
  actions?: React.ReactNode;
}

export default function EnhancedComponentHeader({
  title,
  subtitle,
  description,
  icon: Icon,
  language,
  onLanguageChange,
  onBack,
  backLabel,
  stats,
  actions
}: EnhancedComponentHeaderProps) {
  return (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="bg-gradient-to-r from-green-600 via-green-700 to-green-800 text-white p-6 rounded-xl shadow-xl mb-6"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {onBack && (
            <Button
              onClick={onBack}
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20 p-2"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          )}
          
          {Icon && (
            <div className="bg-white/20 rounded-lg p-3">
              <Icon className="h-8 w-8" />
            </div>
          )}
          
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <h1 className="text-2xl font-medium">{title}</h1>
              {onBack && backLabel && (
                <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                  {backLabel}
                </Badge>
              )}
            </div>
            
            {subtitle && (
              <p className="text-green-100 text-lg mb-1">{subtitle}</p>
            )}
            
            {description && (
              <p className="text-green-200 text-sm opacity-90">{description}</p>
            )}
            
            {stats && stats.length > 0 && (
              <div className="flex items-center space-x-6 mt-3">
                {stats.map((stat, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${
                      stat.color || 'bg-white'
                    }`} />
                    <span className="text-sm text-green-100">
                      {stat.label}: <span className="font-medium text-white">{stat.value}</span>
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          {actions && (
            <div className="flex items-center space-x-2">
              {actions}
            </div>
          )}
          
          {/* Language Toggle */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              onClick={() => onLanguageChange(language === 'hindi' ? 'english' : 'hindi')}
              variant="ghost"
              size="sm"
              className="bg-white/10 hover:bg-white/20 text-white border border-white/20 hover:border-white/30 transition-all duration-200"
              title={language === 'hindi' ? 'Switch to English' : 'हिंदी में बदलें'}
            >
              <Languages className="h-4 w-4 mr-2" />
              <span className="text-sm font-medium">
                {language === 'hindi' ? 'English' : 'हिंदी'}
              </span>
            </Button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}