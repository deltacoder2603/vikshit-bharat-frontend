import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  Bell, 
  AlertCircle, 
  Clock, 
  CheckCircle, 
  Search, 
  Filter,
  Calendar,
  MapPin,
  User,
  ArrowLeft,
  AlertTriangle,
  Info,
  Star,
  MessageSquare,
  Target,
  Zap,
  Award,
  TrendingUp,
  ChevronRight,
  Eye,
  Users,
  Building,
  BarChart3,
  FileText,
  Megaphone,
  Shield
} from 'lucide-react';
import { Report, User as UserType } from '../App';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { getTranslations, Language } from '../utils/translations';
import ResponsiveNavbar from './EnhancedResponsiveNavbar';

interface DepartmentHeadNotificationsProps {
  user: UserType;
  reports: Report[];
  allUsers?: UserType[];
  onNavigate: (page: string) => void;
  onLogout: () => void;
  onUpdateReport: (reportId: string, updates: Partial<Report>) => void;
  language?: Language;
  onLanguageChange?: (language: Language) => void;
}

interface Notification {
  id: string;
  type: 'new_complaint' | 'worker_assignment' | 'high_priority' | 'performance_alert' | 'budget_update' | 'policy_change' | 'escalation' | 'team_achievement';
  title: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
  relatedReportId?: string;
  priority: 'low' | 'medium' | 'high';
  actionRequired?: boolean;
  category: 'complaints' | 'workforce' | 'performance' | 'policy' | 'budget' | 'escalation';
}

export default function DepartmentHeadNotifications({
  user,
  reports,
  allUsers = [],
  onNavigate,
  onLogout,
  onUpdateReport,
  language = 'hindi',
  onLanguageChange
}: DepartmentHeadNotificationsProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'unread' | 'high_priority' | 'escalations'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);

  const t = getTranslations(language);

  // Generate notifications specific to department head responsibilities
  const generateNotifications = (): Notification[] => {
    const departmentReports = reports.filter(report => 
      report.assignedDepartment === user.department
    );
    
    const departmentWorkers = allUsers.filter(worker => 
      worker.department === user.department && worker.role === 'field-worker'
    );

    const notifications: Notification[] = [
      // New complaints in department
      ...departmentReports.slice(0, 2).map(report => ({
        id: `complaint-${report.id}`,
        type: 'new_complaint' as const,
        title: language === 'hindi' ? 'नई शिकायत प्राप्त' : 'New Complaint Received',
        message: language === 'hindi' 
          ? `${report.location} में ${report.category} की शिकायत प्राप्त हुई है।`
          : `New ${report.category} complaint received from ${report.location}.`,
        timestamp: new Date(Date.now() - Math.random() * 86400000),
        isRead: Math.random() > 0.6,
        relatedReportId: report.id,
        priority: report.priority as 'low' | 'medium' | 'high' || 'medium',
        actionRequired: true,
        category: 'complaints' as const
      })),

      // High priority escalations
      {
        id: 'escalation-1',
        type: 'escalation',
        title: language === 'hindi' ? 'उच्च प्राथमिकता एस्केलेशन' : 'High Priority Escalation',
        message: language === 'hindi' 
          ? 'सिविल लाइन्स में सड़क की समस्या 48 घंटे से अधिक समय से लंबित है।'
          : 'Civil Lines road issue has been pending for more than 48 hours.',
        timestamp: new Date(Date.now() - 2 * 3600000),
        isRead: false,
        priority: 'high',
        actionRequired: true,
        category: 'escalation'
      },

      // Worker performance alerts
      {
        id: 'performance-1',
        type: 'performance_alert',
        title: language === 'hindi' ? 'कार्यकर्ता प्रदर्शन अलर्ट' : 'Worker Performance Alert',
        message: language === 'hindi' 
          ? 'पिछले सप्ताह 3 कार्यकर्ताओं का प्रदर्शन लक्ष्य से कम है।'
          : '3 workers performance below target for last week.',
        timestamp: new Date(Date.now() - 4 * 3600000),
        isRead: true,
        priority: 'medium',
        actionRequired: true,
        category: 'performance'
      },

      // Team achievement
      {
        id: 'achievement-1',
        type: 'team_achievement',
        title: language === 'hindi' ? 'टीम उपलब्धि' : 'Team Achievement',
        message: language === 'hindi' 
          ? 'बधाई! आपके विभाग ने इस महीने 95% शिकायतों का समाधान किया है।'
          : 'Congratulations! Your department resolved 95% complaints this month.',
        timestamp: new Date(Date.now() - 8 * 3600000),
        isRead: false,
        priority: 'low',
        actionRequired: false,
        category: 'performance'
      },

      // Budget update
      {
        id: 'budget-1',
        type: 'budget_update',
        title: language === 'hindi' ? 'बजट अपडेट' : 'Budget Update',
        message: language === 'hindi' 
          ? 'Q4 के लिए अतिरिक्त ₹2,50,000 का बजट स्वीकृत हुआ है।'
          : 'Additional budget of ₹2,50,000 approved for Q4.',
        timestamp: new Date(Date.now() - 12 * 3600000),
        isRead: true,
        priority: 'medium',
        actionRequired: false,
        category: 'budget'
      },

      // Policy change
      {
        id: 'policy-1',
        type: 'policy_change',
        title: language === 'hindi' ? 'नीति परिवर्तन' : 'Policy Change',
        message: language === 'hindi' 
          ? 'शिकायत समाधान की नई समय सीमा नीति लागू की गई है।'
          : 'New complaint resolution timeline policy has been implemented.',
        timestamp: new Date(Date.now() - 18 * 3600000),
        isRead: false,
        priority: 'medium',
        actionRequired: true,
        category: 'policy'
      },

      // Worker assignment notification
      {
        id: 'assignment-1',
        type: 'worker_assignment',
        title: language === 'hindi' ? 'कार्यकर्ता असाइनमेंट' : 'Worker Assignment',
        message: language === 'hindi' 
          ? 'राजू सिंह को नई उच्च प्राथमिकता शिकायत सौंपी गई है।'
          : 'Raju Singh has been assigned a new high priority complaint.',
        timestamp: new Date(Date.now() - 24 * 3600000),
        isRead: true,
        priority: 'low',
        actionRequired: false,
        category: 'workforce'
      }
    ];

    return notifications.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  };

  const notifications = generateNotifications();

  const getFilteredNotifications = () => {
    let filtered = notifications;

    switch (activeTab) {
      case 'unread':
        filtered = filtered.filter(n => !n.isRead);
        break;
      case 'high_priority':
        filtered = filtered.filter(n => n.priority === 'high');
        break;
      case 'escalations':
        filtered = filtered.filter(n => n.category === 'escalation' || n.actionRequired);
        break;
    }

    if (searchQuery) {
      filtered = filtered.filter(n => 
        n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.message.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'new_complaint': return AlertCircle;
      case 'worker_assignment': return Users;
      case 'high_priority': return AlertTriangle;
      case 'performance_alert': return BarChart3;
      case 'budget_update': return Award;
      case 'policy_change': return FileText;
      case 'escalation': return Megaphone;
      case 'team_achievement': return Star;
      default: return Bell;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-red-200 bg-red-50';
      case 'medium': return 'border-yellow-200 bg-yellow-50';
      case 'low': return 'border-blue-200 bg-blue-50';
      default: return 'border-gray-200 bg-gray-50';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'new_complaint': return 'text-red-600';
      case 'worker_assignment': return 'text-blue-600';
      case 'high_priority': return 'text-orange-600';
      case 'performance_alert': return 'text-purple-600';
      case 'budget_update': return 'text-green-600';
      case 'policy_change': return 'text-indigo-600';
      case 'escalation': return 'text-red-600';
      case 'team_achievement': return 'text-yellow-600';
      default: return 'text-gray-600';
    }
  };

  const markAsRead = (notificationId: string) => {
    console.log('Mark as read:', notificationId);
  };

  const markAllAsRead = () => {
    console.log('Mark all as read');
  };

  const formatTime = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (days > 0) {
      return language === 'hindi' ? `${days} दिन पहले` : `${days} days ago`;
    } else if (hours > 0) {
      return language === 'hindi' ? `${hours} घंटे पहले` : `${hours} hours ago`;
    } else {
      return language === 'hindi' ? 'अभी' : 'Now';
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;
  const highPriorityCount = notifications.filter(n => n.priority === 'high').length;
  const escalationCount = notifications.filter(n => n.category === 'escalation' || n.actionRequired).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-green-50">
      <ResponsiveNavbar
        user={user}
        notifications={notifications.filter(n => !n.isRead)}
        language={language}
        onLanguageChange={onLanguageChange}
        onNavigate={onNavigate}
        onLogout={onLogout}
        title={language === 'hindi' ? 'सूचनाएं' : 'Notifications'}
        subtitle={`${unreadCount} ${language === 'hindi' ? 'नई सूचनाएं' : 'new notifications'}`}
        backPage="department-head-dashboard"
      />

      <div className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-8 pb-24 md:pb-8">
        {/* Header Section */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-6"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
            <div>
              <h2 className="text-2xl sm:text-3xl mb-2">
                {language === 'hindi' ? 'विभाग प्रमुख सूचना केंद्र' : 'Department Head Notification Center'}
              </h2>
              <p className="text-gray-600">
                {language === 'hindi' 
                  ? `${user.department} विभाग - कुल ${notifications.length} सूचनाएं`
                  : `${user.department} Department - ${notifications.length} total notifications`}
              </p>
            </div>
            
            {unreadCount > 0 && (
              <Button
                onClick={markAllAsRead}
                variant="outline"
                className="border-blue-200 text-blue-700 hover:bg-blue-50"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                {language === 'hindi' ? 'सभी पढ़ा हुआ मार्क करें' : 'Mark All Read'}
              </Button>
            )}
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
              <CardContent className="p-4 text-center">
                <div className="text-2xl text-red-600 mb-1">{highPriorityCount}</div>
                <div className="text-red-700 text-sm">{language === 'hindi' ? 'उच्च प्राथमिकता' : 'High Priority'}</div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
              <CardContent className="p-4 text-center">
                <div className="text-2xl text-orange-600 mb-1">{escalationCount}</div>
                <div className="text-orange-700 text-sm">{language === 'hindi' ? 'एस्केलेशन' : 'Escalations'}</div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
              <CardContent className="p-4 text-center">
                <div className="text-2xl text-blue-600 mb-1">{unreadCount}</div>
                <div className="text-blue-700 text-sm">{language === 'hindi' ? 'अपठित' : 'Unread'}</div>
              </CardContent>
            </Card>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder={language === 'hindi' ? 'सूचनाएं खोजें...' : 'Search notifications...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
            <TabsList className="grid w-full grid-cols-4 mb-6">
              <TabsTrigger value="all" className="text-xs sm:text-sm">
                {language === 'hindi' ? 'सभी' : 'All'} ({notifications.length})
              </TabsTrigger>
              <TabsTrigger value="unread" className="text-xs sm:text-sm">
                {language === 'hindi' ? 'अपठित' : 'Unread'} ({unreadCount})
              </TabsTrigger>
              <TabsTrigger value="high_priority" className="text-xs sm:text-sm">
                {language === 'hindi' ? 'उच्च' : 'High'} ({highPriorityCount})
              </TabsTrigger>
              <TabsTrigger value="escalations" className="text-xs sm:text-sm">
                {language === 'hindi' ? 'एस्केलेशन' : 'Escalations'} ({escalationCount})
              </TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab}>
              <AnimatePresence mode="wait">
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -20, opacity: 0 }}
                  className="space-y-4"
                >
                  {getFilteredNotifications().map((notification, index) => {
                    const IconComponent = getNotificationIcon(notification.type);
                    
                    return (
                      <motion.div
                        key={notification.id}
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <Card 
                          className={`hover:shadow-lg transition-all duration-300 cursor-pointer ${
                            !notification.isRead ? 'border-l-4 border-l-blue-500' : ''
                          } ${getPriorityColor(notification.priority)}`}
                          onClick={() => {
                            setSelectedNotification(notification);
                            if (!notification.isRead) {
                              markAsRead(notification.id);
                            }
                          }}
                        >
                          <CardContent className="p-4 sm:p-6">
                            <div className="flex items-start justify-between">
                              <div className="flex items-start space-x-4 flex-1">
                                <div className={`p-2 rounded-full bg-white shadow-sm`}>
                                  <IconComponent className={`h-5 w-5 ${getTypeColor(notification.type)}`} />
                                </div>
                                
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center space-x-2 mb-1">
                                    <h3 className={`font-semibold ${!notification.isRead ? 'text-gray-900' : 'text-gray-700'}`}>
                                      {notification.title}
                                    </h3>
                                    {!notification.isRead && (
                                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                    )}
                                    {notification.actionRequired && (
                                      <Badge variant="destructive" className="text-xs">
                                        {language === 'hindi' ? 'कार्रवाई आवश्यक' : 'Action Required'}
                                      </Badge>
                                    )}
                                  </div>
                                  
                                  <p className={`text-sm mb-2 ${!notification.isRead ? 'text-gray-800' : 'text-gray-600'}`}>
                                    {notification.message}
                                  </p>
                                  
                                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                                    <span className="flex items-center">
                                      <Clock className="h-3 w-3 mr-1" />
                                      {formatTime(notification.timestamp)}
                                    </span>
                                    <Badge 
                                      variant="outline" 
                                      className={`text-xs ${
                                        notification.priority === 'high' ? 'border-red-300 text-red-700' :
                                        notification.priority === 'medium' ? 'border-yellow-300 text-yellow-700' :
                                        'border-blue-300 text-blue-700'
                                      }`}
                                    >
                                      {notification.priority === 'high' ? (language === 'hindi' ? 'उच्च' : 'High') :
                                       notification.priority === 'medium' ? (language === 'hindi' ? 'मध्यम' : 'Medium') :
                                       (language === 'hindi' ? 'कम' : 'Low')}
                                    </Badge>
                                  </div>
                                </div>
                              </div>
                              
                              <ChevronRight className="h-5 w-5 text-gray-400 flex-shrink-0" />
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    );
                  })}
                  
                  {getFilteredNotifications().length === 0 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center py-12"
                    >
                      <Bell className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-xl text-gray-500 mb-2">
                        {language === 'hindi' ? 'कोई सूचना नहीं मिली' : 'No Notifications Found'}
                      </h3>
                      <p className="text-gray-400">
                        {language === 'hindi' 
                          ? 'इस श्रेणी में कोई सूचना उपलब्ध नहीं है।'
                          : 'No notifications available in this category.'}
                      </p>
                    </motion.div>
                  )}
                </motion.div>
              </AnimatePresence>
            </TabsContent>
          </Tabs>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-8"
        >
          <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
            <CardContent className="p-6">
              <h3 className="font-semibold mb-4">
                {language === 'hindi' ? 'त्वरित कार्य' : 'Quick Actions'}
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <Button
                  variant="outline"
                  onClick={() => onNavigate('admin-complaints')}
                  className="flex flex-col items-center space-y-2 h-auto py-4"
                >
                  <AlertCircle className="h-6 w-6 text-red-600" />
                  <span className="text-xs">{language === 'hindi' ? 'शिकायतें' : 'Complaints'}</span>
                </Button>
                <Button
                  variant="outline"
                  onClick={() => onNavigate('admin-workers')}
                  className="flex flex-col items-center space-y-2 h-auto py-4"
                >
                  <Users className="h-6 w-6 text-blue-600" />
                  <span className="text-xs">{language === 'hindi' ? 'कार्यकर्ता' : 'Workers'}</span>
                </Button>
                <Button
                  variant="outline"
                  onClick={() => onNavigate('admin-analytics')}
                  className="flex flex-col items-center space-y-2 h-auto py-4"
                >
                  <BarChart3 className="h-6 w-6 text-purple-600" />
                  <span className="text-xs">{language === 'hindi' ? 'एनालिटिक्स' : 'Analytics'}</span>
                </Button>
                <Button
                  variant="outline"
                  onClick={() => onNavigate('department-head-dashboard')}
                  className="flex flex-col items-center space-y-2 h-auto py-4"
                >
                  <Building className="h-6 w-6 text-green-600" />
                  <span className="text-xs">{language === 'hindi' ? 'डैशबोर्ड' : 'Dashboard'}</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}