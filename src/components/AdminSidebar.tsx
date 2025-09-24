import React from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  LayoutDashboard,
  FileText,
  Building,
  Users,
  BarChart3,
  FileDown,
  Settings,
  MapPin,
  Bell,
  Shield,
  Zap,
  Wrench,
  Crown,
  UserCheck,
  Video,
  Calendar,
  Clock,
  Activity
} from 'lucide-react';
import { User } from '../App';
import { getTranslations, Language } from '../utils/translations';

interface AdminSidebarProps {
  user: User;
  currentPage: string;
  onNavigate: (page: string) => void;
  pendingCount: number;
  urgentCount: number;
  language?: Language;
}

export default function AdminSidebar({ 
  user, 
  currentPage, 
  onNavigate, 
  pendingCount, 
  urgentCount,
  language = 'hindi'
}: AdminSidebarProps) {
  const t = getTranslations(language);
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

  const navigationItems = [
    {
      id: user.role === 'district-magistrate' ? 'admin-dashboard' : 
          user.role === 'department-head' ? 'department-head-dashboard' : 
          user.role === 'field-worker' ? 'field-worker-dashboard' : 'admin-dashboard',
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
      id: 'meeting-management',
      label: language === 'hindi' ? 'मीटिंग प्रबंधन' : 'Meetings',
      icon: Video,
      color: 'text-indigo-600',
      available: user.role === 'district-magistrate' || user.role === 'department-head'
    },
    {
      id: 'admin-map',
      label: language === 'hindi' ? 'मैप व्यू' : 'Map View',
      icon: MapPin,
      color: 'text-orange-600',
      available: true
    },
    {
      id: 'admin-analytics',
      label: language === 'hindi' ? 'एनालिटिक्स' : 'Analytics',
      icon: BarChart3,
      color: 'text-teal-600',
      available: user.role === 'district-magistrate'
    },
    // Removed reports menu item
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
      available: true
    }
  ];

  const RoleIcon = getRoleIcon(user.role);

  return (
    <motion.div
      initial={{ x: -300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed left-0 top-0 w-80 bg-white/95 backdrop-blur-sm border-r border-orange-200 shadow-xl h-screen overflow-y-auto z-40"
    >
      {/* Header */}
      <div className="p-6 border-b border-orange-200">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="flex items-center space-x-3 mb-4"
        >
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
        </motion.div>

        {/* User Info */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className={`bg-gradient-to-r ${getRoleColor(user.role)} p-4 rounded-lg text-white`}
        >
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
        </motion.div>
      </div>

      {/* Navigation */}
      <div className="p-4">
        <div className="space-y-2">
          {navigationItems.map((item, index) => {
            if (!item.available) return null;
            
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            
            return (
              <motion.div
                key={item.id}
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.6 + index * 0.1, duration: 0.5 }}
              >
                <Button
                  variant={isActive ? "default" : "ghost"}
                  onClick={() => onNavigate(item.id)}
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
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="ml-2"
                      >
                        <Badge 
                          className={`${
                            isActive 
                              ? 'bg-white/20 text-white' 
                              : 'bg-red-500 text-white'
                          } min-w-[20px] h-5 rounded-full text-xs`}
                        >
                          {item.badge > 99 ? '99+' : item.badge}
                        </Badge>
                      </motion.div>
                    )}
                  </div>
                </Button>
              </motion.div>
            );
          })}
        </div>

        {/* Real-time Activity Feed */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.5 }}
          className="mt-8 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border border-indigo-200"
        >
          <h4 className="text-sm font-medium text-indigo-800 mb-3 flex items-center">
            <Activity className="h-4 w-4 mr-2" />
            {language === 'hindi' ? 'लाइव गतिविधि' : 'Live Activity'}
          </h4>
          <div className="space-y-3">
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mt-1.5"></div>
              <div>
                <p className="text-xs text-gray-700">
                  {language === 'hindi' ? 'नई शिकायत प्राप्त' : 'New complaint received'}
                </p>
                <p className="text-xs text-gray-500">
                  {language === 'hindi' ? '2 मिनट पहले' : '2 minutes ago'}
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse mt-1.5"></div>
              <div>
                <p className="text-xs text-gray-700">
                  {language === 'hindi' ? 'कार्यकर्ता असाइन किया गया' : 'Worker assigned'}
                </p>
                <p className="text-xs text-gray-500">
                  {language === 'hindi' ? '5 मिनट पहले' : '5 minutes ago'}
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse mt-1.5"></div>
              <div>
                <p className="text-xs text-gray-700">
                  {language === 'hindi' ? 'शिकायत हल हुई' : 'Complaint resolved'}
                </p>
                <p className="text-xs text-gray-500">
                  {language === 'hindi' ? '12 मिनट पहले' : '12 minutes ago'}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* System Status */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.5 }}
          className="mt-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200"
        >
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
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-yellow-700">
                  {language === 'hindi' ? 'नोटिफिकेशन' : 'Notifications'}
                </span>
              </div>
              <span className="text-xs text-yellow-600">
                {urgentCount} {language === 'hindi' ? 'नए' : 'new'}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Performance Summary */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.6, duration: 0.5 }}
          className="mt-6 p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg border border-orange-200"
        >
          <h4 className="text-sm font-medium text-orange-800 mb-3 flex items-center">
            <BarChart3 className="h-4 w-4 mr-2" />
            {language === 'hindi' ? 'आज का प्रदर्शन' : "Today's Performance"}
          </h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-700">
                {language === 'hindi' ? 'हल की गई शिकायतें' : 'Resolved'}
              </span>
              <span className="text-xs font-medium text-green-600">24</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-700">
                {language === 'hindi' ? 'नई शिकायतें' : 'New Reports'}
              </span>
              <span className="text-xs font-medium text-blue-600">18</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-700">
                {language === 'hindi' ? 'दक्षता दर' : 'Efficiency'}
              </span>
              <span className="text-xs font-medium text-purple-600">87%</span>
            </div>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.8, duration: 0.5 }}
          className="mt-6 space-y-2 pb-6"
        >
          <h4 className="text-sm font-medium text-gray-700 mb-3">
            {language === 'hindi' ? 'त्वरित कार्य' : 'Quick Actions'}
          </h4>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onNavigate('admin-complaints')}
            className="w-full justify-start text-xs border-blue-200 text-blue-700 hover:bg-blue-50 transition-all duration-200"
          >
            <Zap className="h-3 w-3 mr-2" />
            {language === 'hindi' ? 'नई शिकायत असाइन करें' : 'Assign New Complaint'}
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onNavigate('admin-workers')}
            className="w-full justify-start text-xs border-green-200 text-green-700 hover:bg-green-50 transition-all duration-200"
          >
            <Wrench className="h-3 w-3 mr-2" />
            {language === 'hindi' ? 'वर्कर पर्फॉर्मेंस देखें' : 'View Worker Performance'}
          </Button>
          {user.role === 'district-magistrate' && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => onNavigate('meeting-management')}
              className="w-full justify-start text-xs border-purple-200 text-purple-700 hover:bg-purple-50 transition-all duration-200"
            >
              <Calendar className="h-3 w-3 mr-2" />
              {language === 'hindi' ? 'मीटिंग शेड्यूल करें' : 'Schedule Meeting'}
            </Button>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}