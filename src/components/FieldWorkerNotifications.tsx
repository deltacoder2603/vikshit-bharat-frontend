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
  Eye
} from 'lucide-react';
import { Report, User as UserType } from '../App';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { getTranslations, Language } from '../utils/translations';
import ResponsiveNavbar from './EnhancedResponsiveNavbar';

interface FieldWorkerNotificationsProps {
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
  type: 'new_assignment' | 'priority_update' | 'deadline_reminder' | 'feedback' | 'system_alert' | 'achievement';
  title: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
  relatedReportId?: string;
  priority: 'low' | 'medium' | 'high';
  actionRequired?: boolean;
  category: 'assignment' | 'deadline' | 'feedback' | 'system' | 'achievement';
}

export default function FieldWorkerNotifications({
  user,
  reports,
  allUsers = [],
  onNavigate,
  onLogout,
  onUpdateReport,
  language = 'hindi',
  onLanguageChange
}: FieldWorkerNotificationsProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'unread' | 'assignments' | 'alerts'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);

  const t = getTranslations(language);

  // Generate mock notifications based on user's assigned reports
  const generateNotifications = (): Notification[] => {
    const assignedReports = reports.filter(report => 
      report.assignedWorker === user.id || 
      (report.assignedDepartment === user.department && report.status === 'pending')
    );

    const notifications: Notification[] = [
      // New assignment notifications
      ...assignedReports.slice(0, 3).map(report => ({
        id: `assignment-${report.id}`,
        type: 'new_assignment' as const,
        title: language === 'hindi' ? 'नया कार्य सौंपा गया' : 'New Task Assigned',
        message: language === 'hindi' 
          ? `${report.description.substring(0, 50)}... के लिए कार्य सौंपा गया है।`
          : `Task assigned for "${report.description.substring(0, 50)}..."`,
        timestamp: new Date(Date.now() - Math.random() * 86400000), // Random time within last day
        isRead: Math.random() > 0.5,
        relatedReportId: report.id,
        priority: report.priority as 'low' | 'medium' | 'high' || 'medium',
        actionRequired: true,
        category: 'assignment' as const
      })),

      // Priority update notifications
      {
        id: 'priority-update-1',
        type: 'priority_update',
        title: language === 'hindi' ? 'प्राथमिकता अपडेट' : 'Priority Updated',
        message: language === 'hindi' 
          ? 'सड़क की मरम्मत का कार्य उच्च प्राथमिकता में बदला गया।'
          : 'Road repair task has been changed to high priority.',
        timestamp: new Date(Date.now() - 2 * 3600000), // 2 hours ago
        isRead: false,
        priority: 'high',
        actionRequired: true,
        category: 'assignment'
      },

      // Deadline reminders
      {
        id: 'deadline-1',
        type: 'deadline_reminder',
        title: language === 'hindi' ? 'समय सीमा अनुस्मारक' : 'Deadline Reminder',
        message: language === 'hindi' 
          ? 'मॉल रोड सफाई का कार्य कल तक पूरा करना है।'
          : 'Mall Road cleaning task needs to be completed by tomorrow.',
        timestamp: new Date(Date.now() - 4 * 3600000), // 4 hours ago
        isRead: true,
        priority: 'high',
        actionRequired: true,
        category: 'deadline'
      },

      // Citizen feedback
      {
        id: 'feedback-1',
        type: 'feedback',
        title: language === 'hindi' ? 'नागरिक प्रतिक्रिया' : 'Citizen Feedback',
        message: language === 'hindi' 
          ? 'राम कुमार ने आपके कार्य के लिए 5 स्टार रेटिंग दी है!'
          : 'Ram Kumar gave 5-star rating for your work!',
        timestamp: new Date(Date.now() - 12 * 3600000), // 12 hours ago
        isRead: false,
        priority: 'medium',
        actionRequired: false,
        category: 'feedback'
      },

      // Achievement notification
      {
        id: 'achievement-1',
        type: 'achievement',
        title: language === 'hindi' ? 'उपलब्धि अनलॉक' : 'Achievement Unlocked',
        message: language === 'hindi' 
          ? 'बधाई! आपने इस महीने 20 कार्य पूरे किए हैं।'
          : 'Congratulations! You completed 20 tasks this month.',
        timestamp: new Date(Date.now() - 18 * 3600000), // 18 hours ago
        isRead: true,
        priority: 'low',
        actionRequired: false,
        category: 'achievement'
      },

      // System alerts
      {
        id: 'system-1',
        type: 'system_alert',
        title: language === 'hindi' ? 'सिस्टम अपडेट' : 'System Update',
        message: language === 'hindi' 
          ? 'मोबाइल ऐप का नया वर्शन उपलब्ध है।'
          : 'New version of mobile app is available.',
        timestamp: new Date(Date.now() - 24 * 3600000), // 1 day ago
        isRead: true,
        priority: 'low',
        actionRequired: false,
        category: 'system'
      }
    ];

    return notifications.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  };

  const notifications = generateNotifications();

  const getFilteredNotifications = () => {
    let filtered = notifications;

    // Apply tab filter
    switch (activeTab) {
      case 'unread':
        filtered = filtered.filter(n => !n.isRead);
        break;
      case 'assignments':
        filtered = filtered.filter(n => n.category === 'assignment');
        break;
      case 'alerts':
        filtered = filtered.filter(n => n.priority === 'high' || n.actionRequired);
        break;
    }

    // Apply search filter
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
      case 'new_assignment': return Target;
      case 'priority_update': return AlertTriangle;
      case 'deadline_reminder': return Clock;
      case 'feedback': return Star;
      case 'achievement': return Award;
      case 'system_alert': return Info;
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
      case 'new_assignment': return 'text-blue-600';
      case 'priority_update': return 'text-orange-600';
      case 'deadline_reminder': return 'text-red-600';
      case 'feedback': return 'text-green-600';
      case 'achievement': return 'text-purple-600';
      case 'system_alert': return 'text-gray-600';
      default: return 'text-blue-600';
    }
  };

  const markAsRead = (notificationId: string) => {
    // In a real app, this would update the backend
    console.log('Mark as read:', notificationId);
  };

  const markAllAsRead = () => {
    // In a real app, this would update the backend
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-green-50">
      <ResponsiveNavbar
        user={user}
        notifications={[
          { id: 1, type: 'new_assignment', isRead: false },
          { id: 2, type: 'priority_update', isRead: false },
          { id: 3, type: 'feedback', isRead: true },
          { id: 4, type: 'deadline_reminder', isRead: false },
          { id: 5, type: 'achievement', isRead: true }
        ]}
        language={language}
        onLanguageChange={onLanguageChange}
        onNavigate={onNavigate}
        onLogout={onLogout}
        title={language === 'hindi' ? 'सूचनाएं' : 'Notifications'}
        subtitle={`${unreadCount} ${language === 'hindi' ? 'नई सूचनाएं' : 'new notifications'}`}
        backPage="field-worker-dashboard"
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
                {language === 'hindi' ? 'सूचना केंद्र' : 'Notification Center'}
              </h2>
              <p className="text-gray-600">
                {language === 'hindi' 
                  ? `कुल ${notifications.length} सूचनाएं, ${unreadCount} अपठित`
                  : `${notifications.length} total notifications, ${unreadCount} unread`}
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

          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder={language === 'hindi' ? 'सूचनाएं खोजें...' : 'Search notifications...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
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
              <TabsTrigger value="assignments" className="text-xs sm:text-sm">
                {language === 'hindi' ? 'कार्य' : 'Tasks'} ({notifications.filter(n => n.category === 'assignment').length})
              </TabsTrigger>
              <TabsTrigger value="alerts" className="text-xs sm:text-sm">
                {language === 'hindi' ? 'अलर्ट' : 'Alerts'} ({notifications.filter(n => n.priority === 'high' || n.actionRequired).length})
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
                            
                            {notification.relatedReportId && (
                              <div className="mt-4 pt-4 border-t border-gray-200">
                                <div className="flex items-center text-sm text-blue-600">
                                  <Eye className="h-4 w-4 mr-2" />
                                  {language === 'hindi' ? 'संबंधित रिपोर्ट देखें' : 'View Related Report'}
                                </div>
                              </div>
                            )}
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
          <Card className="bg-gradient-to-r from-blue-50 to-green-50 border-blue-200">
            <CardContent className="p-6">
              <h3 className="font-semibold mb-4">
                {language === 'hindi' ? 'त्वरित कार्य' : 'Quick Actions'}
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <Button
                  variant="outline"
                  onClick={() => onNavigate('field-worker-dashboard')}
                  className="flex flex-col items-center space-y-2 h-auto py-4"
                >
                  <Target className="h-6 w-6 text-blue-600" />
                  <span className="text-xs">{language === 'hindi' ? 'कार्य देखें' : 'View Tasks'}</span>
                </Button>
                <Button
                  variant="outline"
                  className="flex flex-col items-center space-y-2 h-auto py-4"
                >
                  <MessageSquare className="h-6 w-6 text-green-600" />
                  <span className="text-xs">{language === 'hindi' ? 'संदेश' : 'Messages'}</span>
                </Button>
                <Button
                  variant="outline"
                  className="flex flex-col items-center space-y-2 h-auto py-4"
                >
                  <Calendar className="h-6 w-6 text-purple-600" />
                  <span className="text-xs">{language === 'hindi' ? 'कैलेंडर' : 'Calendar'}</span>
                </Button>
                <Button
                  variant="outline"
                  className="flex flex-col items-center space-y-2 h-auto py-4"
                >
                  <TrendingUp className="h-6 w-6 text-orange-600" />
                  <span className="text-xs">{language === 'hindi' ? 'प्रदर्शन' : 'Performance'}</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}