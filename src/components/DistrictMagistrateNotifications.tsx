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
  Shield,
  Crown,
  Globe,
  Briefcase,
  PieChart,
  Settings,
  Mail
} from 'lucide-react';
import { Report, User as UserType } from '../App';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { getTranslations, Language } from '../utils/translations';
import ResponsiveNavbar from './EnhancedResponsiveNavbar';

interface DistrictMagistrateNotificationsProps {
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
  type: 'district_alert' | 'dept_performance' | 'citizen_grievance' | 'policy_directive' | 'budget_approval' | 'media_coverage' | 'emergency_alert' | 'govt_directive' | 'public_meeting';
  title: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
  relatedReportId?: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  actionRequired?: boolean;
  category: 'administration' | 'public_safety' | 'governance' | 'budget' | 'policy' | 'emergency';
  department?: string;
}

export default function DistrictMagistrateNotifications({
  user,
  reports,
  allUsers = [],
  onNavigate,
  onLogout,
  onUpdateReport,
  language = 'hindi',
  onLanguageChange
}: DistrictMagistrateNotificationsProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'unread' | 'critical' | 'governance'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);

  const t = getTranslations(language);

  // Generate notifications specific to district magistrate responsibilities
  const generateNotifications = (): Notification[] => {
    const departments = [...new Set(allUsers.map(u => u.department).filter(Boolean))];
    
    const notifications: Notification[] = [
      // District-wide alerts
      {
        id: 'district-1',
        type: 'district_alert',
        title: language === 'hindi' ? 'जिला स्तरीय अलर्ट' : 'District-wide Alert',
        message: language === 'hindi' 
          ? 'कानपुर जिले में 24 घंटे में 47 नई शिकायतें दर्ज हुई हैं।'
          : '47 new complaints registered in Kanpur district in last 24 hours.',
        timestamp: new Date(Date.now() - 1 * 3600000),
        isRead: false,
        priority: 'critical',
        actionRequired: true,
        category: 'administration'
      },

      // Department performance review
      {
        id: 'dept-performance-1',
        type: 'dept_performance',
        title: language === 'hindi' ? 'विभागीय प्रदर्शन समीक्षा' : 'Department Performance Review',
        message: language === 'hindi' 
          ? 'सफाई विभाग का प्रदर्शन इस महीने 78% है - लक्ष्य से 7% कम।'
          : 'Sanitation Department performance at 78% this month - 7% below target.',
        timestamp: new Date(Date.now() - 3 * 3600000),
        isRead: false,
        priority: 'high',
        actionRequired: true,
        category: 'governance',
        department: 'Sanitation'
      },

      // Emergency alert
      {
        id: 'emergency-1',
        type: 'emergency_alert',
        title: language === 'hindi' ? 'आपातकालीन अलर्ट' : 'Emergency Alert',
        message: language === 'hindi' 
          ? 'कल्याणपुर क्षेत्र में जल आपूर्ति बंद - तत्काल कार्रवाई की आवश्यकता।'
          : 'Water supply disruption in Kalyanpur area - immediate action required.',
        timestamp: new Date(Date.now() - 5 * 3600000),
        isRead: true,
        priority: 'critical',
        actionRequired: true,
        category: 'emergency'
      },

      // Government directive
      {
        id: 'govt-directive-1',
        type: 'govt_directive',
        title: language === 'hindi' ? 'सरकारी निर्देश' : 'Government Directive',
        message: language === 'hindi' 
          ? 'राज्य सरकार से स्वच्छता अभियान तेज करने का निर्देश प्राप्त हुआ है।'
          : 'State government directive received to accelerate cleanliness campaign.',
        timestamp: new Date(Date.now() - 8 * 3600000),
        isRead: false,
        priority: 'high',
        actionRequired: true,
        category: 'policy'
      },

      // Budget approval
      {
        id: 'budget-1',
        type: 'budget_approval',
        title: language === 'hindi' ? 'बजट अनुमोदन' : 'Budget Approval',
        message: language === 'hindi' 
          ? '₹75 लाख का इन्फ्रास्ट्रक्चर बजट अनुमोदित - सभी विभागों को सूचित करें।'
          : '₹75 lakh infrastructure budget approved - notify all departments.',
        timestamp: new Date(Date.now() - 12 * 3600000),
        isRead: true,
        priority: 'medium',
        actionRequired: true,
        category: 'budget'
      },

      // Citizen grievance escalation
      {
        id: 'grievance-1',
        type: 'citizen_grievance',
        title: language === 'hindi' ? 'नागरिक शिकायत एस्केलेशन' : 'Citizen Grievance Escalation',
        message: language === 'hindi' 
          ? 'सिविल लाइन्स की सड़क मरम्मत शिकायत मुख्यमंत्री कार्यालय तक पहुंची है।'
          : 'Civil Lines road repair complaint has reached Chief Minister office.',
        timestamp: new Date(Date.now() - 15 * 3600000),
        isRead: false,
        priority: 'critical',
        actionRequired: true,
        category: 'administration'
      },

      // Media coverage
      {
        id: 'media-1',
        type: 'media_coverage',
        title: language === 'hindi' ? 'मीडिया कवरेज' : 'Media Coverage',
        message: language === 'hindi' 
          ? 'दैनिक जागरण में कानपुर की सफाई व्यवस्था पर सकारात्मक रिपोर्ट प्रकाशित।'
          : 'Positive report on Kanpur sanitation system published in Dainik Jagran.',
        timestamp: new Date(Date.now() - 18 * 3600000),
        isRead: true,
        priority: 'low',
        actionRequired: false,
        category: 'public_safety'
      },

      // Public meeting
      {
        id: 'meeting-1',
        type: 'public_meeting',
        title: language === 'hindi' ? 'जनसभा आयोजन' : 'Public Meeting',
        message: language === 'hindi' 
          ? 'कल शाम 5 बजे टाउन हॉल में जनसभा - मुख्य मुद्दे तैयार करें।'
          : 'Public meeting tomorrow 5 PM at Town Hall - prepare key issues.',
        timestamp: new Date(Date.now() - 24 * 3600000),
        isRead: false,
        priority: 'high',
        actionRequired: true,
        category: 'governance'
      },

      // Policy directive implementation
      {
        id: 'policy-impl-1',
        type: 'policy_directive',
        title: language === 'hindi' ? 'नीति कार्यान्वयन' : 'Policy Implementation',
        message: language === 'hindi' 
          ? 'डिजिटल शिकायत प्रणाली का सफल कार्यान्वयन - 89% ऑनलाइन रजिस्ट्रेशन।'
          : 'Successful digital complaint system implementation - 89% online registration.',
        timestamp: new Date(Date.now() - 30 * 3600000),
        isRead: true,
        priority: 'medium',
        actionRequired: false,
        category: 'administration'
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
      case 'critical':
        filtered = filtered.filter(n => n.priority === 'critical' || n.priority === 'high');
        break;
      case 'governance':
        filtered = filtered.filter(n => n.category === 'governance' || n.category === 'policy');
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
      case 'district_alert': return AlertTriangle;
      case 'dept_performance': return BarChart3;
      case 'citizen_grievance': return Users;
      case 'policy_directive': return FileText;
      case 'budget_approval': return Award;
      case 'media_coverage': return Megaphone;
      case 'emergency_alert': return AlertCircle;
      case 'govt_directive': return Crown;
      case 'public_meeting': return Calendar;
      default: return Bell;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'border-red-300 bg-red-100';
      case 'high': return 'border-orange-200 bg-orange-50';
      case 'medium': return 'border-yellow-200 bg-yellow-50';
      case 'low': return 'border-blue-200 bg-blue-50';
      default: return 'border-gray-200 bg-gray-50';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'district_alert': return 'text-red-600';
      case 'dept_performance': return 'text-purple-600';
      case 'citizen_grievance': return 'text-blue-600';
      case 'policy_directive': return 'text-indigo-600';
      case 'budget_approval': return 'text-green-600';
      case 'media_coverage': return 'text-pink-600';
      case 'emergency_alert': return 'text-red-600';
      case 'govt_directive': return 'text-yellow-600';
      case 'public_meeting': return 'text-teal-600';
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
  const criticalCount = notifications.filter(n => n.priority === 'critical' || n.priority === 'high').length;
  const governanceCount = notifications.filter(n => n.category === 'governance' || n.category === 'policy').length;

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
        backPage="admin-dashboard"
      />

      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-8 pb-24 md:pb-8">
        {/* Header Section */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-6"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <Crown className="h-6 w-6 text-purple-600" />
                <h2 className="text-2xl sm:text-3xl">
                  {language === 'hindi' ? 'जिला मजिस्ट्रेट सूचना केंद्र' : 'District Magistrate Command Center'}
                </h2>
              </div>
              <p className="text-gray-600">
                {language === 'hindi' 
                  ? `कानपुर जिला - कुल ${notifications.length} सूचनाएं`
                  : `Kanpur District - ${notifications.length} total notifications`}
              </p>
            </div>
            
            {unreadCount > 0 && (
              <Button
                onClick={markAllAsRead}
                variant="outline"
                className="border-purple-200 text-purple-700 hover:bg-purple-50"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                {language === 'hindi' ? 'सभी पढ़ा हुआ मार्क करें' : 'Mark All Read'}
              </Button>
            )}
          </div>

          {/* Executive Stats Dashboard */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
              <CardContent className="p-4 text-center">
                <AlertTriangle className="h-6 w-6 text-red-600 mx-auto mb-2" />
                <div className="text-2xl text-red-600 mb-1">{criticalCount}</div>
                <div className="text-red-700 text-sm">{language === 'hindi' ? 'अत्यावश्यक' : 'Critical'}</div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
              <CardContent className="p-4 text-center">
                <FileText className="h-6 w-6 text-purple-600 mx-auto mb-2" />
                <div className="text-2xl text-purple-600 mb-1">{governanceCount}</div>
                <div className="text-purple-700 text-sm">{language === 'hindi' ? 'शासन' : 'Governance'}</div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
              <CardContent className="p-4 text-center">
                <Bell className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                <div className="text-2xl text-blue-600 mb-1">{unreadCount}</div>
                <div className="text-blue-700 text-sm">{language === 'hindi' ? 'अपठित' : 'Unread'}</div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
              <CardContent className="p-4 text-center">
                <TrendingUp className="h-6 w-6 text-green-600 mx-auto mb-2" />
                <div className="text-2xl text-green-600 mb-1">87%</div>
                <div className="text-green-700 text-sm">{language === 'hindi' ? 'प्रदर्शन' : 'Performance'}</div>
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
              <TabsTrigger value="critical" className="text-xs sm:text-sm">
                {language === 'hindi' ? 'अत्यावश्यक' : 'Critical'} ({criticalCount})
              </TabsTrigger>
              <TabsTrigger value="governance" className="text-xs sm:text-sm">
                {language === 'hindi' ? 'शासन' : 'Governance'} ({governanceCount})
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
                          className={`hover:shadow-xl transition-all duration-300 cursor-pointer ${
                            !notification.isRead ? 'border-l-4 border-l-purple-500' : ''
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
                                <div className={`p-3 rounded-full bg-white shadow-md`}>
                                  <IconComponent className={`h-6 w-6 ${getTypeColor(notification.type)}`} />
                                </div>
                                
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center space-x-2 mb-2">
                                    <h3 className={`font-semibold text-lg ${!notification.isRead ? 'text-gray-900' : 'text-gray-700'}`}>
                                      {notification.title}
                                    </h3>
                                    {!notification.isRead && (
                                      <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                                    )}
                                    {notification.actionRequired && (
                                      <Badge variant="destructive" className="text-xs">
                                        {language === 'hindi' ? 'तत्काल कार्रवाई' : 'Immediate Action'}
                                      </Badge>
                                    )}
                                    {notification.priority === 'critical' && (
                                      <Badge className="bg-red-600 text-white text-xs">
                                        {language === 'hindi' ? 'अत्यावश्यक' : 'CRITICAL'}
                                      </Badge>
                                    )}
                                  </div>
                                  
                                  <p className={`text-base mb-3 ${!notification.isRead ? 'text-gray-800' : 'text-gray-600'}`}>
                                    {notification.message}
                                  </p>
                                  
                                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                                    <span className="flex items-center">
                                      <Clock className="h-4 w-4 mr-1" />
                                      {formatTime(notification.timestamp)}
                                    </span>
                                    {notification.department && (
                                      <span className="flex items-center">
                                        <Building className="h-4 w-4 mr-1" />
                                        {notification.department}
                                      </span>
                                    )}
                                    <Badge 
                                      variant="outline" 
                                      className={`text-xs ${
                                        notification.priority === 'critical' ? 'border-red-300 text-red-700 bg-red-50' :
                                        notification.priority === 'high' ? 'border-orange-300 text-orange-700 bg-orange-50' :
                                        notification.priority === 'medium' ? 'border-yellow-300 text-yellow-700 bg-yellow-50' :
                                        'border-blue-300 text-blue-700 bg-blue-50'
                                      }`}
                                    >
                                      {notification.priority === 'critical' ? (language === 'hindi' ? 'अत्यावश्यक' : 'Critical') :
                                       notification.priority === 'high' ? (language === 'hindi' ? 'उच्च' : 'High') :
                                       notification.priority === 'medium' ? (language === 'hindi' ? 'मध्यम' : 'Medium') :
                                       (language === 'hindi' ? 'कम' : 'Low')}
                                    </Badge>
                                  </div>
                                </div>
                              </div>
                              
                              <ChevronRight className="h-6 w-6 text-gray-400 flex-shrink-0" />
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
                      className="text-center py-16"
                    >
                      <Crown className="h-20 w-20 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-2xl text-gray-500 mb-2">
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

        {/* Executive Quick Actions */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-8 grid md:grid-cols-2 gap-6"
        >
          <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
            <CardContent className="p-6">
              <h3 className="font-semibold mb-4 flex items-center">
                <Shield className="h-5 w-5 mr-2 text-purple-600" />
                {language === 'hindi' ? 'प्रशासनिक कार्य' : 'Administrative Actions'}
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  onClick={() => onNavigate('admin-dashboard')}
                  className="flex flex-col items-center space-y-2 h-auto py-4"
                >
                  <BarChart3 className="h-6 w-6 text-purple-600" />
                  <span className="text-xs">{language === 'hindi' ? 'डैशबोर्ड' : 'Dashboard'}</span>
                </Button>
                <Button
                  variant="outline"
                  onClick={() => onNavigate('admin-analytics')}
                  className="flex flex-col items-center space-y-2 h-auto py-4"
                >
                  <PieChart className="h-6 w-6 text-blue-600" />
                  <span className="text-xs">{language === 'hindi' ? 'एनालिटिक्स' : 'Analytics'}</span>
                </Button>
                <Button
                  variant="outline"
                  onClick={() => onNavigate('admin-departments')}
                  className="flex flex-col items-center space-y-2 h-auto py-4"
                >
                  <Building className="h-6 w-6 text-green-600" />
                  <span className="text-xs">{language === 'hindi' ? 'विभाग' : 'Departments'}</span>
                </Button>
                <Button
                  variant="outline"
                  onClick={() => onNavigate('admin-workers')}
                  className="flex flex-col items-center space-y-2 h-auto py-4"
                >
                  <Users className="h-6 w-6 text-orange-600" />
                  <span className="text-xs">{language === 'hindi' ? 'कार्यकर्ता' : 'Workers'}</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-50 to-teal-50 border-green-200">
            <CardContent className="p-6">
              <h3 className="font-semibold mb-4 flex items-center">
                <Globe className="h-5 w-5 mr-2 text-green-600" />
                {language === 'hindi' ? 'जनसेवा कार्य' : 'Public Service Actions'}
              </h3>
              <div className="grid grid-cols-2 gap-3">
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
                  onClick={() => onNavigate('admin-map')}
                  className="flex flex-col items-center space-y-2 h-auto py-4"
                >
                  <MapPin className="h-6 w-6 text-blue-600" />
                  <span className="text-xs">{language === 'hindi' ? 'मैप व्यू' : 'Map View'}</span>
                </Button>
                {/* Removed Reports button */}
                <Button
                  variant="outline"
                  onClick={() => onNavigate('admin-settings')}
                  className="flex flex-col items-center space-y-2 h-auto py-4"
                >
                  <Settings className="h-6 w-6 text-gray-600" />
                  <span className="text-xs">{language === 'hindi' ? 'सेटिंग्स' : 'Settings'}</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}