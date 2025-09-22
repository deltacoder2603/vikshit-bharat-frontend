import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  Users, FileText, Building, BarChart3, Settings, LogOut, 
  Shield, MapPin, Bell, Eye, Network, UserCheck, Menu, X,
  Home, Calendar, Target, Award, Activity, Languages
} from 'lucide-react';
import { User as UserType } from '../App';
import { getTranslations, Language } from '../utils/translations';

interface EnhancedAdminSidebarProps {
  user: UserType;
  currentPage: string;
  onNavigate: (page: string) => void;
  onLogout: () => void;
  language: Language;
  onLanguageChange: (language: Language) => void;
  notificationCount?: number;
}

export default function EnhancedAdminSidebar({
  user,
  currentPage,
  onNavigate,
  onLogout,
  language,
  onLanguageChange,
  notificationCount = 0
}: EnhancedAdminSidebarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const t = getTranslations(language);

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isMobileMenuOpen && !(event.target as Element).closest('.mobile-sidebar')) {
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMobileMenuOpen]);

  const getMenuItems = () => {
    const baseItems = [
      {
        id: 'dashboard',
        page: user.role === 'district-magistrate' ? 'admin-dashboard' : 
              user.role === 'department-head' ? 'department-head-dashboard' : 'admin-dashboard',
        icon: Home,
        label: language === 'hindi' ? 'डैशबोर्ड' : 'Dashboard',
        description: language === 'hindi' ? 'मुख्य पृष्ठ' : 'Main overview'
      },
      {
        id: 'complaints',
        page: 'admin-complaints',
        icon: FileText,
        label: language === 'hindi' ? 'शिकायतें' : 'Complaints',
        description: language === 'hindi' ? 'शिकायत प्रबंधन' : 'Manage complaints'
      }
    ];

    // Add role-specific items
    if (user.role === 'district-magistrate') {
      baseItems.push(
        {
          id: 'departments',
          page: 'admin-departments',
          icon: Building,
          label: language === 'hindi' ? 'विभाग' : 'Departments',
          description: language === 'hindi' ? 'विभाग प्रबंधन' : 'Manage departments'
        },
        {
          id: 'workers',
          page: 'admin-workers',
          icon: Users,
          label: language === 'hindi' ? 'कार्यकर्ता' : 'Workers',
          description: language === 'hindi' ? 'कार्यकर्ता प्रबंधन' : 'Manage workers'
        },
        {
          id: 'analytics',
          page: 'admin-analytics',
          icon: BarChart3,
          label: language === 'hindi' ? 'विश्लेषण' : 'Analytics',
          description: language === 'hindi' ? 'डेटा विश्लेषण' : 'Data analysis'
        },
        {
          id: 'map',
          page: 'admin-map',
          icon: MapPin,
          label: language === 'hindi' ? 'मैप व्यू' : 'Map View',
          description: language === 'hindi' ? 'स्थान आधारित दृश्य' : 'Location-based view'
        }
      );
    } else if (user.role === 'department-head') {
      baseItems.push(
        {
          id: 'workers',
          page: 'admin-workers',
          icon: Users,
          label: language === 'hindi' ? 'कार्यकर्ता' : 'Workers',
          description: language === 'hindi' ? 'विभागीय कार्यकर्ता' : 'Department workers'
        }
      );
    }

    // Add common items
    baseItems.push(
      // Removed reports menu item
      {
        id: 'notifications',
        page: 'admin-notifications',
        icon: Bell,
        label: language === 'hindi' ? 'सूचनाएं' : 'Notifications',
        description: language === 'hindi' ? 'अलर्ट और सूचनाएं' : 'Alerts and notifications',
        badge: notificationCount > 0 ? notificationCount : undefined
      }
    );

    // Add settings only for district magistrate
    if (user.role === 'district-magistrate') {
      baseItems.push({
        id: 'settings',
        page: 'admin-settings',
        icon: Settings,
        label: language === 'hindi' ? 'सेटिंग्स' : 'Settings',
        description: language === 'hindi' ? 'सिस्टम सेटिंग्स' : 'System settings'
      });
    }

    return baseItems;
  };

  const menuItems = getMenuItems();

  const handleNavigation = (page: string) => {
    onNavigate(page);
    if (isMobile) {
      setIsMobileMenuOpen(false);
    }
  };

  // Mobile Header with Hamburger Menu
  if (isMobile) {
    return (
      <>
        {/* Mobile Header */}
        <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-green-600 to-green-700 shadow-lg lg:hidden">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center space-x-3">
              <Button
                onClick={() => setIsMobileMenuOpen(true)}
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20 p-2"
              >
                <Menu className="h-6 w-6" />
              </Button>
              <div>
                <h1 className="text-white font-medium">
                  {language === 'hindi' ? 'विकसित कानपुर' : 'VIKSIT KANPUR'}
                </h1>
                <p className="text-white/80 text-sm">
                  {user.role === 'district-magistrate' 
                    ? (language === 'hindi' ? 'जिला मजिस्ट्रेट' : 'District Magistrate')
                    : (language === 'hindi' ? 'विभाग प्रमुख' : 'Department Head')}
                </p>
              </div>
            </div>
            
            {/* Language Toggle and Logout */}
            <div className="flex items-center space-x-2">
              <Button
                onClick={() => onLanguageChange(language === 'hindi' ? 'english' : 'hindi')}
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20 p-2"
              >
                <Languages className="h-4 w-4" />
              </Button>
              <Button
                onClick={onLogout}
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20 p-2"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Sidebar Overlay */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                onClick={() => setIsMobileMenuOpen(false)}
              />
              
              {/* Mobile Sidebar */}
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'tween', duration: 0.3 }}
                className="mobile-sidebar fixed left-0 top-0 bottom-0 w-80 bg-white shadow-xl z-50 lg:hidden overflow-y-auto"
              >
                {/* Mobile Sidebar Header */}
                <div className="bg-gradient-to-r from-green-600 to-green-700 p-6 text-white">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="font-medium">
                      {language === 'hindi' ? 'नेवीगेशन मेन्यू' : 'Navigation Menu'}
                    </h2>
                    <Button
                      onClick={() => setIsMobileMenuOpen(false)}
                      variant="ghost"
                      size="sm"
                      className="text-white hover:bg-white/20 p-1"
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  </div>
                  
                  {/* User Info */}
                  <div className="flex items-center space-x-3">
                    <div className="bg-white/20 rounded-full p-3">
                      <Shield className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">
                        {user.name.split(' / ')[language === 'hindi' ? 0 : 1] || user.name}
                      </p>
                      <p className="text-white/80 text-xs">
                        {user.department}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Mobile Menu Items */}
                <div className="p-4 space-y-2">
                  {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = currentPage === item.page;
                    
                    return (
                      <motion.button
                        key={item.id}
                        onClick={() => handleNavigation(item.page)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`w-full text-left p-4 rounded-lg transition-all duration-200 flex items-center justify-between ${
                          isActive
                            ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg'
                            : 'hover:bg-gray-100 text-gray-700'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <Icon className={`h-5 w-5 ${isActive ? 'text-white' : 'text-gray-500'}`} />
                          <div>
                            <p className={`font-medium text-sm ${isActive ? 'text-white' : 'text-gray-900'}`}>
                              {item.label}
                            </p>
                            <p className={`text-xs ${isActive ? 'text-green-100' : 'text-gray-500'}`}>
                              {item.description}
                            </p>
                          </div>
                        </div>
                        {item.badge && (
                          <Badge variant="destructive" className="text-xs">
                            {item.badge}
                          </Badge>
                        )}
                      </motion.button>
                    );
                  })}
                </div>

                {/* Mobile Footer */}
                <div className="p-4 border-t border-gray-200 mt-auto">
                  <div className="text-center text-xs text-gray-500">
                    {language === 'hindi' ? 'विकसित कानपुर' : 'VIKSIT KANPUR'} © 2024
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </>
    );
  }

  // Desktop Sidebar
  return (
    <div className="fixed left-0 top-0 bottom-0 w-80 bg-white shadow-xl z-40 hidden lg:flex lg:flex-col border-r border-gray-200">
      {/* Desktop Sidebar Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 p-6 text-white">
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-medium text-lg">
            {language === 'hindi' ? 'विकसित कानपुर' : 'VIKSIT KANPUR'}
          </h1>
          <Button
            onClick={() => onLanguageChange(language === 'hindi' ? 'english' : 'hindi')}
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/20 p-2"
            title={language === 'hindi' ? 'भाषा बदलें' : 'Change Language'}
          >
            <Languages className="h-4 w-4" />
          </Button>
        </div>
        
        {/* User Profile Section */}
        <div className="flex items-center space-x-4">
          <div className="bg-white/20 rounded-full p-4">
            <Shield className="h-8 w-8" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-white truncate">
              {user.name.split(' / ')[language === 'hindi' ? 0 : 1] || user.name}
            </p>
            <p className="text-green-100 text-sm truncate">
              {user.role === 'district-magistrate' 
                ? (language === 'hindi' ? 'जिला मजिस्ट्रेट' : 'District Magistrate')
                : (language === 'hindi' ? 'विभाग प्रमुख' : 'Department Head')}
            </p>
            <p className="text-green-200 text-xs truncate">
              {user.department}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.page;
            
            return (
              <motion.button
                key={item.id}
                onClick={() => handleNavigation(item.page)}
                whileHover={{ scale: 1.02, x: 4 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full text-left p-4 rounded-xl transition-all duration-200 flex items-center justify-between group ${
                  isActive
                    ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg'
                    : 'hover:bg-gradient-to-r hover:from-green-50 hover:to-green-100 text-gray-700 hover:shadow-md'
                }`}
              >
                <div className="flex items-center space-x-4">
                  <div className={`p-2 rounded-lg transition-colors ${
                    isActive 
                      ? 'bg-white/20' 
                      : 'bg-green-100 group-hover:bg-green-200'
                  }`}>
                    <Icon className={`h-5 w-5 ${
                      isActive ? 'text-white' : 'text-green-600'
                    }`} />
                  </div>
                  <div>
                    <p className={`font-medium ${isActive ? 'text-white' : 'text-gray-900'}`}>
                      {item.label}
                    </p>
                    <p className={`text-sm ${isActive ? 'text-green-100' : 'text-gray-500'}`}>
                      {item.description}
                    </p>
                  </div>
                </div>
                {item.badge && (
                  <Badge variant="destructive" className="text-xs">
                    {item.badge}
                  </Badge>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Logout Button */}
      <div className="p-4 border-t border-gray-200">
        <motion.button
          onClick={onLogout}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full p-4 text-left rounded-xl bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 transition-all duration-200 flex items-center space-x-4 shadow-lg"
        >
          <div className="p-2 bg-white/20 rounded-lg">
            <LogOut className="h-5 w-5" />
          </div>
          <div>
            <p className="font-medium">
              {language === 'hindi' ? 'लॉगआउट' : 'Logout'}
            </p>
            <p className="text-red-100 text-sm">
              {language === 'hindi' ? 'सत्र समाप्त करें' : 'End session'}
            </p>
          </div>
        </motion.button>

        {/* Footer */}
        <div className="text-center text-xs text-gray-500 mt-4">
          {language === 'hindi' ? 'विकसित कानपुर' : 'VIKSIT KANPUR'} © 2024
        </div>
      </div>
    </div>
  );
}