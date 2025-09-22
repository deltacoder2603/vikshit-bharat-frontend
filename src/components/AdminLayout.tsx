import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  Menu, X, LayoutDashboard, FileText, Building, Users, BarChart3,
  Settings, MapPin, Bell, Shield, Zap, Wrench, Crown, UserCheck, User,
  Calendar, Clock, Activity, LogOut, Search, Globe, CheckCircle, AlertCircle
} from 'lucide-react';
import type { User } from '../App';
import { getTranslations, Language } from '../utils/translations';

interface AdminLayoutProps {
  user: User;
  currentPage: string;
  onNavigate: (page: string) => void;
  onLogout: () => void;
  pendingCount: number;
  urgentCount: number;
  language: Language;
  onLanguageChange: (language: Language) => void;
  children: React.ReactNode;
}

export default function AdminLayout({
  user,
  currentPage,
  onNavigate,
  onLogout,
  pendingCount,
  urgentCount,
  language,
  onLanguageChange,
  children
}: AdminLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [searchTerm, setSearchTerm] = useState('');

  const t = getTranslations(language);

  // Optimized clock update - only update every 30 seconds to reduce re-renders
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 30000);
    return () => clearInterval(timer);
  }, []);

  // Online/offline status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Memoize expensive calculations to prevent unnecessary re-renders
  const roleConfig = useMemo(() => {
    const getRoleIcon = (role?: string) => {
      switch (role) {
        case 'district-magistrate': return Crown;
        case 'department-head': return Building;
        case 'field-worker': return UserCheck;
        default: return Shield;
      }
    };

    const getRoleColor = (role?: string) => {
      switch (role) {
        case 'district-magistrate': return 'from-purple-500 to-purple-600';
        case 'department-head': return 'from-green-500 to-green-600';
        case 'field-worker': return 'from-blue-500 to-blue-600';
        default: return 'from-gray-500 to-gray-600';
      }
    };

    return {
      icon: getRoleIcon(user.role),
      color: getRoleColor(user.role)
    };
  }, [user.role]);

  const navigationItems = useMemo(() => [
    {
      id: 'admin-dashboard',
      label: language === 'hindi' ? 'डैशबोर्ड' : 'Dashboard',
      icon: LayoutDashboard,
      color: 'text-blue-600',
      available: true
    },
    {
      id: 'admin-complaints',
      label: language === 'hindi' ? 'शिकायतें' : 'Complaints',
      icon: FileText,
      color: 'text-red-600',
      badge: pendingCount,
      available: true
    },
    {
      id: 'admin-departments',
      label: language === 'hindi' ? 'विभाग' : 'Departments',
      icon: Building,
      color: 'text-green-600',
      available: user.role === 'district-magistrate' || user.role === 'department-head'
    },
    {
      id: 'admin-workers',
      label: language === 'hindi' ? 'कार्यकर्ता' : 'Workers',
      icon: Users,
      color: 'text-purple-600',
      available: user.role === 'district-magistrate' || user.role === 'department-head'
    },

    {
      id: 'admin-map',
      label: language === 'hindi' ? 'मैप व्यू' : 'Map View',
      icon: MapPin,
      color: 'text-orange-600',
      available: user.role === 'district-magistrate'
    },
    {
      id: 'admin-analytics',
      label: language === 'hindi' ? 'एनालिटिक्स' : 'Analytics',
      icon: BarChart3,
      color: 'text-teal-600',
      available: user.role === 'district-magistrate'
    },
    // Removed reports tab
    {
      id: 'admin-notifications',
      label: language === 'hindi' ? 'सूचनाएं' : 'Notifications',
      icon: Bell,
      color: 'text-yellow-600',
      badge: urgentCount,
      available: true
    },
    {
      id: 'admin-settings',
      label: language === 'hindi' ? 'सेटिंग्स' : 'Settings',
      icon: Settings,
      color: 'text-gray-600',
      available: user.role === 'district-magistrate'
    },
    {
      id: 'field-worker-profile',
      label: language === 'hindi' ? 'मेरी प्रोफाइल' : 'My Profile',
      icon: User,
      color: 'text-blue-600',
      available: user.role === 'field-worker'
    },
    {
      id: 'department-head-profile',
      label: language === 'hindi' ? 'मेरी प्रोफाइल' : 'My Profile',
      icon: User,
      color: 'text-green-600',
      available: user.role === 'department-head'
    },
    {
      id: 'district-magistrate-profile',
      label: language === 'hindi' ? 'मेरी प्रोफाइल' : 'My Profile',
      icon: User,
      color: 'text-purple-600',
      available: user.role === 'district-magistrate'
    }
  ], [language, pendingCount, urgentCount, user.role]);

  const RoleIcon = roleConfig.icon;

  const formatTime = (date: Date) => {
    return language === 'hindi' 
      ? date.toLocaleTimeString('hi-IN', { hour: '2-digit', minute: '2-digit' })
      : date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement search functionality
    console.log('Search:', searchTerm);
  };

  // Responsive sidebar widths based on screen size
  const getResponsiveSidebarWidth = () => {
    if (typeof window !== 'undefined') {
      const isMobile = window.innerWidth < 768;
      const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;
      
      if (isMobile) {
        return sidebarCollapsed ? 0 : 280; // Full width overlay on mobile when expanded
      } else if (isTablet) {
        return sidebarCollapsed ? 64 : 240; // Smaller sidebar on tablet
      } else {
        return sidebarCollapsed ? 64 : 320; // Original desktop sizes
      }
    }
    return sidebarCollapsed ? 64 : 320;
  };

  const [sidebarWidth, setSidebarWidth] = useState(getResponsiveSidebarWidth());

  // Update sidebar width on window resize and sidebar state change
  useEffect(() => {
    const handleResize = () => {
      setSidebarWidth(getResponsiveSidebarWidth());
    };

    // Set initial width
    setSidebarWidth(getResponsiveSidebarWidth());

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [sidebarCollapsed]);

  // Auto-collapse sidebar on mobile by default
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const handleResize = () => {
        if (window.innerWidth < 768) {
          setSidebarCollapsed(true);
        }
      };

      // Check initial screen size
      if (window.innerWidth < 768) {
        setSidebarCollapsed(true);
      }

      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-green-50 flex">
      {/* Responsive Sidebar */}
      <motion.div
        animate={{ 
          width: sidebarWidth,
          x: typeof window !== 'undefined' && window.innerWidth < 768 && sidebarCollapsed ? -280 : 0
        }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className={`fixed left-0 top-0 bg-white/95 backdrop-blur-sm border-r border-orange-200 shadow-xl h-screen z-40 flex flex-col ${
          typeof window !== 'undefined' && window.innerWidth < 768 
            ? 'max-w-[280px]' 
            : ''
        }`}
        style={{
          width: typeof window !== 'undefined' && window.innerWidth < 768 && !sidebarCollapsed 
            ? '280px' 
            : sidebarWidth
        }}
      >
        {/* Toggle Button and Collapsed Logo */}
        <div className="flex-shrink-0 p-4 space-y-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="w-8 h-8 p-0 bg-white/90 backdrop-blur-sm shadow-lg hover:bg-white border border-gray-200 rounded-lg"
          >
            {sidebarCollapsed ? <Menu className="h-4 w-4" /> : <X className="h-4 w-4" />}
          </Button>
          
          {/* Collapsed Navigation Icons */}
          {sidebarCollapsed && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2, delay: 0.1 }}
              className="flex flex-col items-center space-y-2"
            >
              {/* Navigation Icons */}
              <div className="flex flex-col space-y-2">
                {navigationItems.map((item, index) => {
                  if (!item.available) return null;
                  
                  const Icon = item.icon;
                  const isActive = currentPage === item.id ||
                    (item.id === 'admin-notifications' && 
                     (currentPage === 'department-head-notifications' || 
                      currentPage === 'district-magistrate-notifications'));
                  
                  return (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.2, delay: 0.1 + (index * 0.05) }}
                    >
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          if (item.id === 'admin-notifications') {
                            if (user.role === 'department-head') {
                              onNavigate('department-head-notifications');
                            } else if (user.role === 'district-magistrate') {
                              onNavigate('district-magistrate-notifications');
                            } else {
                              onNavigate('admin-notifications');
                            }
                          } else {
                            onNavigate(item.id);
                          }
                          // Auto-close sidebar on mobile after navigation
                          if (typeof window !== 'undefined' && window.innerWidth < 768) {
                            setSidebarCollapsed(true);
                          }
                        }}
                        className={`relative w-8 h-8 p-0 rounded-lg transition-all duration-200 ${
                          isActive 
                            ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg scale-110' 
                            : 'hover:bg-orange-100 text-gray-600 hover:text-orange-600 hover:scale-105'
                        }`}
                        title={item.label}
                      >
                        <Icon className={`h-4 w-4 ${isActive ? 'text-white' : item.color}`} />
                        {item.badge && item.badge > 0 && (
                          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full min-w-[16px] h-4 flex items-center justify-center">
                            {item.badge > 99 ? '99+' : item.badge}
                          </span>
                        )}
                      </Button>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </div>

        {/* Sidebar Content - Only show when expanded */}
        {!sidebarCollapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, delay: 0.1 }}
            className="flex-1 overflow-y-auto px-4 pb-4"
          >
            {/* Logo and User Info */}
            <div className="mb-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="flex space-x-1">
                  <motion.div
                    animate={{ scaleY: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity, delay: 0 }}
                    className="w-2 h-6 bg-orange-500 rounded-sm shadow-sm"
                  />
                  <motion.div
                    animate={{ scaleY: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity, delay: 0.2 }}
                    className="w-2 h-6 bg-white border border-gray-300 rounded-sm shadow-sm"
                  />
                  <motion.div
                    animate={{ scaleY: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity, delay: 0.4 }}
                    className="w-2 h-6 bg-green-600 rounded-sm shadow-sm"
                  />
                </div>
                <h2 className="font-bold text-lg" style={{ color: '#FF9933' }}>
                  VIKSIT KANPUR
                </h2>
              </div>

              {/* User Info */}
              <div className={`bg-gradient-to-r ${roleConfig.color} p-4 rounded-lg text-white`}>
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                    <RoleIcon className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{user.name}</p>
                    <p className="text-xs opacity-90">
                      {user.role === 'district-magistrate' 
                        ? (language === 'hindi' ? 'जिला मजिस्ट्रेट' : 'District Magistrate')
                        : user.role === 'department-head' 
                        ? (language === 'hindi' ? 'विभाग प्रमुख' : 'Department Head')
                        : (language === 'hindi' ? 'फील्ड वर्कर' : 'Field Worker')}
                    </p>
                    {user.department && (
                      <p className="text-xs opacity-75 mt-1">
                        {language === 'hindi' ? 'विभाग:' : 'Department:'} {user.department}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="space-y-2 mb-6">
              {navigationItems.map((item) => {
                if (!item.available) return null;
                
                const Icon = item.icon;
                const isActive = currentPage === item.id ||
                  (item.id === 'admin-notifications' && 
                   (currentPage === 'department-head-notifications' || 
                    currentPage === 'district-magistrate-notifications'));
                
                return (
                  <Button
                    key={item.id}
                    variant={isActive ? "default" : "ghost"}
                    onClick={() => {
                      if (item.id === 'admin-notifications') {
                        if (user.role === 'department-head') {
                          onNavigate('department-head-notifications');
                        } else if (user.role === 'district-magistrate') {
                          onNavigate('district-magistrate-notifications');
                        } else {
                          onNavigate('admin-notifications');
                        }
                      } else {
                        onNavigate(item.id);
                      }
                      // Auto-close sidebar on mobile after navigation
                      if (typeof window !== 'undefined' && window.innerWidth < 768) {
                        setSidebarCollapsed(true);
                      }
                    }}
                    className={`w-full justify-start h-auto p-3 ${
                      isActive 
                        ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg' 
                        : 'hover:bg-orange-50 text-gray-700 hover:text-orange-600'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center space-x-3">
                        <Icon className={`h-5 w-5 ${isActive ? 'text-white' : item.color}`} />
                        <div className="text-left">
                          <div className="text-sm font-medium">{item.label}</div>
                        </div>
                      </div>
                      {item.badge && item.badge > 0 && (
                        <Badge 
                          className={`${
                            isActive 
                              ? 'bg-white/20 text-white' 
                              : 'bg-red-500 text-white'
                          } min-w-[20px] h-5 rounded-full text-xs`}
                        >
                          {item.badge > 99 ? '99+' : item.badge}
                        </Badge>
                      )}
                    </div>
                  </Button>
                );
              })}
            </div>

            {/* System Status */}
            <div className="p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">
              <h4 className="text-sm font-medium text-green-800 mb-3">
                {language === 'hindi' ? 'सिस्टम स्टेटस' : 'System Status'}
              </h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-xs text-green-700">
                      {language === 'hindi' ? 'डेटाबेस' : 'Database'}
                    </span>
                  </div>
                  <span className="text-xs text-green-600">
                    {language === 'hindi' ? 'ऑनलाइन' : 'Online'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-xs text-green-700">
                      {language === 'hindi' ? 'API सर्विस' : 'API Service'}
                    </span>
                  </div>
                  <span className="text-xs text-green-600">
                    {language === 'hindi' ? 'सक्रिय' : 'Active'}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Responsive Main Content Area */}
      <motion.div 
        animate={{ 
          marginLeft: typeof window !== 'undefined' && window.innerWidth < 768 ? 0 : sidebarWidth 
        }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="flex-1 flex flex-col min-h-screen"
      >
        {/* Responsive Top Navigation */}
        <div className="bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
          <div className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4">
            <div className="flex items-center justify-between gap-2 sm:gap-4">
              {/* Left Section - Time & Status (Hidden on small mobile) */}
              <div className="hidden sm:flex items-center space-x-3 lg:space-x-6">
                <div className="flex items-center space-x-2 lg:space-x-4">
                  <div className="flex items-center space-x-1 lg:space-x-2">
                    {isOnline ? (
                      <CheckCircle className="h-3 w-3 lg:h-4 lg:w-4 text-green-500" />
                    ) : (
                      <AlertCircle className="h-3 w-3 lg:h-4 lg:w-4 text-red-500" />
                    )}
                    <span className="text-xs text-gray-600 hidden md:inline">
                      {isOnline 
                        ? (language === 'hindi' ? 'ऑनलाइन' : 'Online')
                        : (language === 'hindi' ? 'ऑफलाइन' : 'Offline')}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1 lg:space-x-2">
                    <Clock className="h-3 w-3 lg:h-4 lg:w-4 text-blue-500" />
                    <div className="text-xs">
                      <div className="font-medium text-gray-900">{formatTime(currentTime)}</div>
                      <div className="text-gray-600 hidden lg:block">
                        {language === 'hindi' ? 'शनिवार' : 'Saturday'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Center Section - Responsive Search */}
              <div className="flex-1 max-w-xs sm:max-w-sm lg:max-w-md mx-2 sm:mx-4 lg:mx-8">
                <form onSubmit={handleSearch} className="relative">
                  <Search className="absolute left-2 lg:left-3 top-1/2 transform -translate-y-1/2 h-3 w-3 lg:h-4 lg:w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder={
                      typeof window !== 'undefined' && window.innerWidth < 640
                        ? (language === 'hindi' ? 'खोजें...' : 'Search...')
                        : (language === 'hindi' ? 'शिकायत, कार्यकर्ता या विभाग खोजें...' : 'Search complaints, workers or departments...')
                    }
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8 lg:pl-10 pr-3 lg:pr-4 py-2 w-full border border-gray-300 rounded-lg focus:border-orange-500 focus:ring-1 focus:ring-orange-500 bg-gray-50 hover:bg-white transition-colors text-sm"
                  />
                </form>
              </div>

              {/* Right Section - Responsive Actions */}
              <div className="flex items-center space-x-1 sm:space-x-2 lg:space-x-4">
                {/* Language Toggle - Hidden on small mobile */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onLanguageChange(language === 'hindi' ? 'english' : 'hindi')}
                  className="border-gray-300 hover:bg-orange-50 hover:border-orange-300 transition-all duration-200 hidden sm:flex px-2 lg:px-3"
                >
                  <Globe className="h-3 w-3 lg:h-4 lg:w-4 sm:mr-1 lg:mr-2" />
                  <span className="hidden lg:inline">{language === 'hindi' ? 'EN' : 'हिं'}</span>
                </Button>

                {/* Notifications */}
                <div className="relative">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="relative hover:bg-orange-50 transition-colors p-2"
                    onClick={() => {
                      if (user.role === 'department-head') {
                        onNavigate('department-head-notifications');
                      } else if (user.role === 'district-magistrate') {
                        onNavigate('district-magistrate-notifications');
                      } else {
                        onNavigate('admin-notifications');
                      }
                    }}
                  >
                    <Bell className="h-4 w-4 lg:h-5 lg:w-5 text-gray-600" />
                    {urgentCount > 0 && (
                      <Badge className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full min-w-[16px] h-[16px] lg:min-w-[18px] lg:h-[18px] flex items-center justify-center">
                        {urgentCount > 99 ? '99+' : urgentCount}
                      </Badge>
                    )}
                  </Button>
                </div>

                {/* Logout - Responsive */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onLogout}
                  className="border-red-300 text-red-600 hover:bg-red-50 hover:border-red-400 transition-all duration-200 px-2 lg:px-3"
                >
                  <LogOut className="h-3 w-3 lg:h-4 lg:w-4 sm:mr-1 lg:mr-2" />
                  <span className="hidden sm:inline text-xs lg:text-sm">{language === 'hindi' ? 'लॉगआउट' : 'Logout'}</span>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Content Area - Scrollable */}
        <div className="flex-1 overflow-auto">
          {children}
        </div>
      </motion.div>

      {/* Enhanced Mobile Backdrop */}
      {!sidebarCollapsed && typeof window !== 'undefined' && window.innerWidth < 768 && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-30 backdrop-blur-sm"
          onClick={() => setSidebarCollapsed(true)}
        />
      )}
      
      {/* Mobile Language Toggle Floating Button (only when sidebar is collapsed on mobile) */}
      {typeof window !== 'undefined' && window.innerWidth < 640 && sidebarCollapsed && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="fixed bottom-20 right-4 z-50"
        >
          <Button
            variant="outline"
            size="sm"
            onClick={() => onLanguageChange(language === 'hindi' ? 'english' : 'hindi')}
            className="bg-white/95 backdrop-blur-sm shadow-lg border-orange-300 hover:bg-orange-50 hover:border-orange-400 transition-all duration-200 rounded-full w-12 h-12 p-0"
          >
            <Globe className="h-4 w-4" />
          </Button>
        </motion.div>
      )}
    </div>
  );
}