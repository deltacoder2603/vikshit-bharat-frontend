import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { 
  LogOut, 
  Bell, 
  Search, 
  Settings, 
  User as UserIcon, 
  Globe,
  Clock,
  Shield,
  Crown,
  Building,
  UserCheck,
  ChevronDown,
  Menu,
  Sun,
  Moon,
  Wifi,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { User } from '../App';
import { Language } from '../utils/translations';

interface EnhancedNavbarProps {
  user: User;
  language: Language;
  onLanguageChange: (language: Language) => void;
  onLogout: () => void;
  notifications?: number;
  showSearch?: boolean;
  onSearch?: (term: string) => void;
}

export default function EnhancedNavbar({
  user,
  language,
  onLanguageChange,
  onLogout,
  notifications = 0,
  showSearch = true,
  onSearch
}: EnhancedNavbarProps) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [searchTerm, setSearchTerm] = useState('');
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

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
      case 'district-magistrate': return 'text-purple-600';
      case 'department-head': return 'text-green-600';
      case 'field-worker': return 'text-blue-600';
      default: return 'text-gray-600';
    }
  };

  const formatTime = (date: Date) => {
    return language === 'hindi' 
      ? date.toLocaleTimeString('hi-IN', { hour: '2-digit', minute: '2-digit' })
      : date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (date: Date) => {
    return language === 'hindi'
      ? date.toLocaleDateString('hi-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
      : date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  };

  const RoleIcon = getRoleIcon(user.role);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch && searchTerm.trim()) {
      onSearch(searchTerm);
    }
  };

  return (
    <motion.div
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-lg z-50 sticky top-0"
    >
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left Section - User Info & Status */}
          <div className="flex items-center space-x-6">
            {/* User Profile */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex items-center space-x-3"
            >
              <div className={`p-2 rounded-full bg-gradient-to-r ${
                user.role === 'district-magistrate' 
                  ? 'from-purple-100 to-purple-200' 
                  : user.role === 'department-head'
                  ? 'from-green-100 to-green-200'
                  : 'from-blue-100 to-blue-200'
              }`}>
                <RoleIcon className={`h-6 w-6 ${getRoleColor(user.role)}`} />
              </div>
              <div>
                <h2 className="font-semibold text-gray-900">
                  {language === 'hindi' ? 'नमस्ते' : 'Welcome'}, {user.name.split(' / ')[language === 'hindi' ? 0 : 1] || user.name}
                </h2>
                <p className="text-sm text-gray-600 flex items-center space-x-2">
                  <span>
                    {user.role === 'district-magistrate' 
                      ? (language === 'hindi' ? 'जिला मजिस्ट्रेट' : 'District Magistrate')
                      : user.role === 'department-head' 
                      ? (language === 'hindi' ? 'विभाग प्रमुख' : 'Department Head')
                      : (language === 'hindi' ? 'फील्ड वर्कर' : 'Field Worker')}
                  </span>
                  {user.department && (
                    <>
                      <span>•</span>
                      <span>{user.department}</span>
                    </>
                  )}
                </p>
              </div>
            </motion.div>

            {/* System Status */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex items-center space-x-4 pl-4 border-l border-gray-200"
            >
              <div className="flex items-center space-x-2">
                {isOnline ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-red-500" />
                )}
                <span className="text-xs text-gray-600">
                  {isOnline 
                    ? (language === 'hindi' ? 'ऑनलाइन' : 'Online')
                    : (language === 'hindi' ? 'ऑफलाइन' : 'Offline')}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-blue-500" />
                <div className="text-xs">
                  <div className="font-medium text-gray-900">{formatTime(currentTime)}</div>
                  <div className="text-gray-600">{formatDate(currentTime).split(',')[0]}</div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Center Section - Search */}
          {showSearch && (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="flex-1 max-w-md mx-8"
            >
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder={language === 'hindi' ? 'शिकायत, कार्यकर्ता या विभाग खोजें...' : 'Search complaints, workers or departments...'}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border-gray-300 rounded-lg focus:border-orange-500 focus:ring-orange-500 bg-gray-50 hover:bg-white transition-colors"
                />
              </form>
            </motion.div>
          )}

          {/* Right Section - Actions */}
          <div className="flex items-center space-x-4">
            {/* Language Toggle */}
            <motion.div
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <Button
                variant="outline"
                size="sm"
                onClick={() => onLanguageChange(language === 'hindi' ? 'english' : 'hindi')}
                className="border-gray-300 hover:bg-orange-50 hover:border-orange-300 transition-all duration-200"
              >
                <Globe className="h-4 w-4 mr-2" />
                {language === 'hindi' ? 'EN' : 'हिं'}
              </Button>
            </motion.div>

            {/* Notifications */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="relative"
            >
              <Button
                variant="ghost"
                size="sm"
                className="relative hover:bg-orange-50 transition-colors"
              >
                <Bell className="h-5 w-5 text-gray-600" />
                {notifications > 0 && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1"
                  >
                    <Badge className="bg-red-500 text-white text-xs rounded-full min-w-[18px] h-[18px] flex items-center justify-center">
                      {notifications > 99 ? '99+' : notifications}
                    </Badge>
                  </motion.div>
                )}
              </Button>
            </motion.div>

            {/* Settings */}
            <motion.div
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              <Button
                variant="ghost"
                size="sm"
                className="hover:bg-gray-100 transition-colors"
              >
                <Settings className="h-5 w-5 text-gray-600" />
              </Button>
            </motion.div>

            {/* Logout */}
            <motion.div
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <Button
                variant="outline"
                size="sm"
                onClick={onLogout}
                className="border-red-300 text-red-600 hover:bg-red-50 hover:border-red-400 transition-all duration-200"
              >
                <LogOut className="h-4 w-4 mr-2" />
                {language === 'hindi' ? 'लॉगआउट' : 'Logout'}
              </Button>
            </motion.div>
          </div>
        </div>

        {/* Quick Stats Bar */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="mt-4 pt-4 border-t border-gray-100"
        >
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-gray-600">
                  {language === 'hindi' ? 'सिस्टम चालू' : 'System Active'}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-gray-600">
                  {language === 'hindi' ? 'वास्तविक समय अपडेट' : 'Real-time Updates'}
                </span>
              </div>
            </div>
            <div className="text-gray-500">
              {language === 'hindi' ? 'विकसित कानपुर डैशबोर्ड' : 'Viksit Kanpur Dashboard'}
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}