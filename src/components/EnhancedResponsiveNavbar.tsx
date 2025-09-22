import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu';
import { ArrowLeft, Clock, Bell, Settings, LogOut, Building, Briefcase, Shield, Menu, X, Crown, User, ChevronDown, Globe, MapPin } from 'lucide-react';
import LanguageToggle from './LanguageToggle';
import { Language } from '../utils/translations';
import { User as UserType } from '../App';

interface EnhancedResponsiveNavbarProps {
  user: UserType;
  currentTime?: Date;
  notifications?: any[];
  language: Language;
  onLanguageChange?: (language: Language) => void;
  onNavigate: (page: string) => void;
  onLogout: () => void;
  title: string;
  subtitle?: string;
  showTime?: boolean;
  backPage?: string;
  hideSettings?: boolean; // New prop to conditionally hide settings
}

export default function EnhancedResponsiveNavbar({
  user,
  currentTime,
  notifications = [],
  language,
  onLanguageChange,
  onNavigate,
  onLogout,
  title,
  subtitle,
  showTime = false,
  backPage = 'admin-login',
  hideSettings = false
}: EnhancedResponsiveNavbarProps) {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  
  const getRoleIcon = () => {
    switch (user.role) {
      case 'district-magistrate':
        return Crown;
      case 'department-head':
        return Building;
      case 'field-worker':
        return Briefcase;
      default:
        return Shield;
    }
  };

  const RoleIcon = getRoleIcon();

  const getRoleText = () => {
    if (language === 'hindi') {
      switch (user.role) {
        case 'district-magistrate':
          return 'जिला मजिस्ट्रेट';
        case 'department-head':
          return 'विभाग प्रमुख';
        case 'field-worker':
          return 'फील्ड वर्कर';
        default:
          return 'एडमिन';
      }
    } else {
      switch (user.role) {
        case 'district-magistrate':
          return 'District Magistrate';
        case 'department-head':
          return 'Department Head';
        case 'field-worker':
          return 'Field Worker';
        default:
          return 'Admin';
      }
    }
  };

  const getRoleColor = () => {
    switch (user.role) {
      case 'district-magistrate':
        return 'from-purple-50 to-blue-50 border-purple-200';
      case 'department-head':
        return 'from-green-50 to-blue-50 border-green-200';
      case 'field-worker':
        return 'from-blue-50 to-green-50 border-blue-200';
      default:
        return 'from-gray-50 to-blue-50 border-gray-200';
    }
  };

  const getIconColor = () => {
    switch (user.role) {
      case 'district-magistrate':
        return 'text-purple-600';
      case 'department-head':
        return 'text-green-600';
      case 'field-worker':
        return 'text-blue-600';
      default:
        return 'text-gray-600';
    }
  };

  // Determine if settings should be shown based on user role (exclude field workers)
  const shouldShowSettings = !hideSettings && (user.role === 'citizen');

  return (
    <motion.header
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="bg-white/95 backdrop-blur-md border-b border-orange-200/50 shadow-xl w-full"
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20">
          {/* Left Section */}
          <div className="flex items-center space-x-2 sm:space-x-4 min-w-0 flex-1">
            {/* Back Button */}
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onNavigate(backPage)}
                className="text-gray-600 hover:text-gray-800 hover:bg-gray-100 p-2 rounded-xl"
              >
                <ArrowLeft className="h-4 w-4" />
                <span className="hidden sm:inline ml-2">
                  {language === 'hindi' ? 'वापस' : 'Back'}
                </span>
              </Button>
            </motion.div>
            
            {/* Indian Flag with enhanced design */}
            <motion.div 
              className="flex space-x-1"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <div className="w-3 h-6 sm:w-4 sm:h-8 bg-gradient-to-b from-orange-400 to-orange-600 rounded-sm shadow-lg border border-orange-300" />
              <div className="w-3 h-6 sm:w-4 sm:h-8 bg-white border-2 border-gray-300 rounded-sm shadow-lg" />
              <div className="w-3 h-6 sm:w-4 sm:h-8 bg-gradient-to-b from-green-500 to-green-700 rounded-sm shadow-lg border border-green-400" />
            </motion.div>
            
            {/* Logo and Title */}
            <div className="min-w-0 flex-1">
              <motion.h1 
                className="text-lg sm:text-2xl font-bold truncate bg-gradient-to-r from-orange-500 to-green-600 bg-clip-text text-transparent"
                whileHover={{ scale: 1.02 }}
              >
                VIKSIT KANPUR
              </motion.h1>
              <p className="text-xs sm:text-sm text-gray-600 hidden sm:block truncate font-medium">
                {title}
              </p>
              {subtitle && (
                <p className="text-xs text-gray-500 hidden lg:block truncate">
                  {subtitle}
                </p>
              )}
            </div>
          </div>
          
          {/* Right Section - Desktop */}
          <div className="hidden md:flex items-center space-x-3">
            {/* Language Toggle */}
            {onLanguageChange && (
              <LanguageToggle 
                language={language} 
                onToggle={onLanguageChange}
              />
            )}
            
            {/* Time Display */}
            {showTime && currentTime && (
              <motion.div 
                className="flex items-center text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-xl border"
                whileHover={{ scale: 1.02, backgroundColor: "#f9fafb" }}
              >
                <Clock className="h-4 w-4 mr-2 text-blue-500" />
                <span className="font-mono">
                  {currentTime.toLocaleTimeString(language === 'hindi' ? 'hi-IN' : 'en-US')}
                </span>
              </motion.div>
            )}

            {/* User Profile */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button variant="ghost" className={`flex items-center space-x-2 bg-gradient-to-r ${getRoleColor()} px-4 py-2 rounded-xl border hover:shadow-md transition-all duration-200`}>
                    <RoleIcon className={`h-4 w-4 ${getIconColor()}`} />
                    <div className="text-sm min-w-0">
                      <p className="font-medium text-gray-800 truncate max-w-32">
                        {user.name.split(' / ')[language === 'hindi' ? 0 : 1] || user.name}
                      </p>
                      <p className="text-xs text-gray-600">
                        {getRoleText()}
                      </p>
                    </div>
                    <ChevronDown className="h-3 w-3 text-gray-400" />
                  </Button>
                </motion.div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem 
                  className="flex items-center space-x-2 cursor-pointer"
                  onClick={() => {
                    if (user.role === 'field-worker') {
                      onNavigate('field-worker-profile');
                    } else if (user.role === 'department-head') {
                      onNavigate('department-head-profile');
                    } else if (user.role === 'district-magistrate') {
                      onNavigate('district-magistrate-profile');
                    } else if (user.role === 'citizen') {
                      onNavigate('profile');
                    }
                  }}
                >
                  <User className="h-4 w-4" />
                  <span>{language === 'hindi' ? 'प्रोफाइल' : 'Profile'}</span>
                </DropdownMenuItem>
                
                {/* Department info for non-citizens */}
                {user.role !== 'citizen' && user.department && (
                  <DropdownMenuItem className="flex items-center space-x-2">
                    <Building className="h-4 w-4" />
                    <span className="truncate">{user.department}</span>
                  </DropdownMenuItem>
                )}
                
                {/* Location info for District Magistrate */}
                {user.role === 'district-magistrate' && (
                  <DropdownMenuItem className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4" />
                    <span>{language === 'hindi' ? 'कानपुर जिला' : 'Kanpur District'}</span>
                  </DropdownMenuItem>
                )}
                
                {/* Show Settings only for certain roles */}
                {shouldShowSettings && (
                  <DropdownMenuItem className="flex items-center space-x-2">
                    <Settings className="h-4 w-4" />
                    <span>{language === 'hindi' ? 'सेटिंग्स' : 'Settings'}</span>
                  </DropdownMenuItem>
                )}
                
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={onLogout}
                  className="flex items-center space-x-2 text-red-600 focus:text-red-600"
                >
                  <LogOut className="h-4 w-4" />
                  <span>{language === 'hindi' ? 'लॉगआउट' : 'Logout'}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Notifications */}
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button 
                variant="ghost" 
                size="sm" 
                className="relative p-3 rounded-xl hover:bg-gray-100"
                onClick={() => {
                  if (user.role === 'field-worker') {
                    onNavigate('field-worker-notifications');
                  } else if (user.role === 'department-head') {
                    onNavigate('department-head-notifications');
                  } else if (user.role === 'district-magistrate') {
                    onNavigate('district-magistrate-notifications');
                  } else {
                    onNavigate('admin-notifications');
                  }
                }}
              >
                <Bell className="h-5 w-5 text-gray-600" />
                {notifications.length > 0 && (
                  <motion.div 
                    className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center shadow-lg"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  >
                    <span className="text-xs text-white font-medium">{notifications.length}</span>
                  </motion.div>
                )}
              </Button>
            </motion.div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            {/* Mobile Notifications */}
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button 
                variant="ghost" 
                size="sm" 
                className="relative p-2 rounded-lg"
                onClick={() => {
                  if (user.role === 'field-worker') {
                    onNavigate('field-worker-notifications');
                  } else if (user.role === 'department-head') {
                    onNavigate('department-head-notifications');
                  } else if (user.role === 'district-magistrate') {
                    onNavigate('district-magistrate-notifications');
                  } else {
                    onNavigate('admin-notifications');
                  }
                }}
              >
                <Bell className="h-4 w-4 text-gray-600" />
                {notifications.length > 0 && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="text-xs text-white">{notifications.length}</span>
                  </div>
                )}
              </Button>
            </motion.div>

            {/* Mobile Menu Toggle */}
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="p-2 rounded-lg"
              >
                {showMobileMenu ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </motion.div>
          </div>
        </div>
        
        {/* Enhanced Mobile Menu */}
        <AnimatePresence>
          {showMobileMenu && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden border-t border-gray-200 bg-white/95 backdrop-blur-sm"
            >
              <div className="py-4 space-y-3">
                {/* Mobile Title */}
                <div className="px-2">
                  <p className="text-sm text-gray-600 font-medium">{title}</p>
                  {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
                </div>

                {/* Mobile User Info */}
                <div className={`mx-2 flex items-center space-x-3 bg-gradient-to-r ${getRoleColor()} p-3 rounded-xl`}>
                  <RoleIcon className={`h-5 w-5 ${getIconColor()}`} />
                  <div className="flex-1">
                    <p className="font-medium text-gray-800 text-sm truncate">
                      {user.name.split(' / ')[language === 'hindi' ? 0 : 1] || user.name}
                    </p>
                    <p className="text-xs text-gray-600">{getRoleText()}</p>
                    {user.department && (
                      <p className="text-xs text-gray-500 truncate">{user.department}</p>
                    )}
                  </div>
                </div>

                {/* Mobile Time */}
                {showTime && currentTime && (
                  <div className="mx-2 flex items-center space-x-2 text-sm text-gray-600 bg-gray-50 p-3 rounded-xl">
                    <Clock className="h-4 w-4 text-blue-500" />
                    <span className="font-mono">
                      {currentTime.toLocaleTimeString(language === 'hindi' ? 'hi-IN' : 'en-US')}
                    </span>
                  </div>
                )}

                {/* Mobile Language Toggle */}
                {onLanguageChange && (
                  <div className="mx-2">
                    <LanguageToggle 
                      language={language} 
                      onToggle={onLanguageChange}
                    />
                  </div>
                )}

                {/* Mobile Actions */}
                <div className="mx-2 space-y-2">
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start" 
                    size="sm"
                    onClick={() => {
                      if (user.role === 'field-worker') {
                        onNavigate('field-worker-profile');
                      } else if (user.role === 'department-head') {
                        onNavigate('department-head-profile');
                      } else if (user.role === 'district-magistrate') {
                        onNavigate('district-magistrate-profile');
                      } else if (user.role === 'citizen') {
                        onNavigate('profile');
                      }
                      setShowMobileMenu(false);
                    }}
                  >
                    <User className="h-4 w-4 mr-2" />
                    {language === 'hindi' ? 'प्रोफाइल' : 'Profile'}
                  </Button>
                  
                  {/* Show Settings only for certain roles */}
                  {shouldShowSettings && (
                    <Button variant="ghost" className="w-full justify-start" size="sm">
                      <Settings className="h-4 w-4 mr-2" />
                      {language === 'hindi' ? 'सेटिंग्स' : 'Settings'}
                    </Button>
                  )}
                  
                  <Button 
                    variant="ghost" 
                    onClick={onLogout}
                    className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50" 
                    size="sm"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    {language === 'hindi' ? 'लॉगआउट' : 'Logout'}
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
}