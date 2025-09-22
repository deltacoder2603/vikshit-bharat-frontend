import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from './ui/dialog';
import { 
  Bell,
  BellRing,
  AlertTriangle,
  CheckCircle,
  Info,
  Mail,
  MessageSquare,
  Send,
  Plus,
  Search,
  Filter,
  Trash2,
  Eye,
  EyeOff,
  Users,
  Building,
  MapPin,
  Clock,
  Calendar,
  Star,
  ArrowLeft,
  Megaphone,
  Zap,
  Target,
  Settings
} from 'lucide-react';
import { User, Report } from '../App';
import AdminLayout from './AdminLayout';
import { getTranslations, Language } from '../utils/translations';
import { toast } from 'sonner';

interface AdminNotificationsProps {
  user: User;
  reports: Report[];
  allUsers: User[];
  onNavigate: (page: string) => void;
  onLogout: () => void;
  onUpdateReport: (reportId: string, updates: Partial<Report>) => void;
  language?: Language;
  onLanguageChange?: (language: Language) => void;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'urgent' | 'info' | 'success' | 'warning';
  priority: 'high' | 'medium' | 'low';
  sender: string;
  recipients: string[];
  department?: string;
  isRead: boolean;
  timestamp: Date;
  relatedComplaint?: string;
  actionRequired: boolean;
  expiresAt?: Date;
  category: 'system' | 'complaint' | 'worker' | 'citizen' | 'department' | 'emergency';
}

export default function EnhancedAdminNotifications({ 
  user, 
  reports, 
  allUsers,
  onNavigate, 
  onLogout,
  onUpdateReport,
  language = 'hindi',
  onLanguageChange
}: AdminNotificationsProps) {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 'notif-1',
      title: 'उच्च प्राथमिकता: सफाई आपातकाल',
      message: 'Mall Road पर कचरा जमा होने से गंभीर स्वास्थ्य समस्या हो सकती है। तत्काल कार्रवाई की आवश्यकता है।',
      type: 'urgent',
      priority: 'high',
      sender: 'सिस्टम अलर्ट',
      recipients: ['सफाई विभाग', 'स्वास्थ्य विभाग'],
      department: 'सफाई विभाग',
      isRead: false,
      timestamp: new Date('2024-01-17T10:30:00'),
      relatedComplaint: 'report-1',
      actionRequired: true,
      expiresAt: new Date('2024-01-18T10:30:00'),
      category: 'emergency'
    },
    {
      id: 'notif-2',
      title: 'नया कार्यकर्ता असाइनमेंट',
      message: 'विकास शर्मा को Civil Lines में सड़क की मरम्मत का कार्य सौंपा गया है।',
      type: 'info',
      priority: 'medium',
      sender: 'श्री प्रदीप सिंह',
      recipients: ['विकास शर्मा'],
      department: 'सड़क विभाग',
      isRead: false,
      timestamp: new Date('2024-01-17T09:15:00'),
      relatedComplaint: 'report-2',
      actionRequired: false,
      category: 'worker'
    },
    {
      id: 'notif-3',
      title: 'शिकायत समाधान पूर्ण',
      message: 'Kidwai Nagar में स्ट्रीट लाइट की मरम्मत सफलतापूर्वक पूरी की गई है।',
      type: 'success',
      priority: 'low',
      sender: 'संजय वर्मा',
      recipients: ['डॉ. अजय कुमार सिंह'],
      department: 'विद्युत विभाग',
      isRead: true,
      timestamp: new Date('2024-01-16T16:45:00'),
      relatedComplaint: 'report-3',
      actionRequired: false,
      category: 'complaint'
    },
    {
      id: 'notif-4',
      title: 'मासिक प्रदर्शन रिपोर्ट तैयार',
      message: 'दिसंबर 2023 की विभागीय प्रदर्शन रिपोर्ट डाउनलोड के लिए तैयार है।',
      type: 'info',
      priority: 'medium',
      sender: 'Analytics System',
      recipients: ['सभी विभाग प्रमुख'],
      isRead: false,
      timestamp: new Date('2024-01-15T08:00:00'),
      actionRequired: false,
      category: 'system'
    },
    {
      id: 'notif-5',
      title: 'नागरिक फीडबैक: उत्कृष्ट सेवा',
      message: 'रमेश कुमार ने कचरा निपटान सेवा के लिए 5-स्टार रेटिंग दी है।',
      type: 'success',
      priority: 'low',
      sender: 'नागरिक फीडबैक सिस्टम',
      recipients: ['सफाई विभाग'],
      department: 'सफाई विभाग',
      isRead: false,
      timestamp: new Date('2024-01-16T14:20:00'),
      actionRequired: false,
      category: 'citizen'
    }
  ]);

  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateNotification, setShowCreateNotification] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
  const [newNotification, setNewNotification] = useState({
    title: '',
    message: '',
    type: 'info' as const,
    priority: 'medium' as const,
    recipients: [] as string[],
    department: '',
    category: 'system' as const,
    actionRequired: false
  });

  const t = getTranslations(language);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'urgent': return AlertTriangle;
      case 'success': return CheckCircle;
      case 'warning': return AlertTriangle;
      default: return Info;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'urgent': return 'text-red-600 bg-red-50 border-red-200';
      case 'success': return 'text-green-600 bg-green-50 border-green-200';
      case 'warning': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default: return 'text-blue-600 bg-blue-50 border-blue-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const filteredNotifications = notifications.filter(notif => {
    const matchesFilter = selectedFilter === 'all' || 
                         (selectedFilter === 'unread' && !notif.isRead) ||
                         (selectedFilter === 'urgent' && notif.type === 'urgent') ||
                         (selectedFilter === 'action-required' && notif.actionRequired) ||
                         selectedFilter === notif.category;
    
    const matchesSearch = notif.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notif.message.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;
  const urgentCount = notifications.filter(n => n.type === 'urgent' && !n.isRead).length;
  const actionRequiredCount = notifications.filter(n => n.actionRequired && !n.isRead).length;

  const markAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === notificationId ? { ...notif, isRead: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(notif => ({ ...notif, isRead: true })));
    toast.success('सभी सूचनाएं पढ़ी गई चिह्नित!');
  };

  const deleteNotification = (notificationId: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== notificationId));
    toast.success('सूचना हटाई गई!');
  };

  const createNotification = () => {
    const notification: Notification = {
      id: 'notif-' + Date.now(),
      ...newNotification,
      sender: user.name,
      isRead: false,
      timestamp: new Date(),
      recipients: newNotification.recipients
    };
    
    setNotifications(prev => [notification, ...prev]);
    setShowCreateNotification(false);
    setNewNotification({
      title: '',
      message: '',
      type: 'info',
      priority: 'medium',
      recipients: [],
      department: '',
      category: 'system',
      actionRequired: false
    });
    
    toast.success('नई सूचना भेजी गई!');
  };

  return (
    <AdminLayout
      user={user}
      currentPage="admin-notifications"
      onNavigate={onNavigate}
      onLogout={onLogout}
      pendingCount={urgentCount}
      urgentCount={urgentCount}
      language={language}
      onLanguageChange={onLanguageChange || (() => {})}
    >
      <div className="p-6 space-y-6 max-w-none overflow-hidden">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-red-500 to-red-600 rounded-lg">
                <Bell className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  {language === 'hindi' ? 'सूचनाएं' : 'Notifications'}
                </h1>
                <p className="text-sm text-gray-600">
                  {user.role === 'district-magistrate' 
                    ? (language === 'hindi' ? 'सभी जिला सूचनाएं' : 'All district notifications')
                    : `${user.department} ${language === 'hindi' ? 'सूचनाएं' : 'notifications'}`}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                onClick={markAllAsRead}
                className="bg-green-600 hover:bg-green-700"
              >
                <Eye className="h-4 w-4 mr-2" />
                {language === 'hindi' ? 'सभी पढ़ें' : 'Mark All Read'}
              </Button>
              <Button
                onClick={() => setShowCreateNotification(true)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                {language === 'hindi' ? 'नई सूचना' : 'New Notification'}
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-100">
                        {language === 'hindi' ? 'कुल सूचनाएं' : 'Total Notifications'}
                      </p>
                      <p className="text-2xl font-bold">{notifications.length}</p>
                    </div>
                    <Bell className="h-8 w-8 text-blue-200" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-red-100">
                        {language === 'hindi' ? 'अपठित' : 'Unread'}
                      </p>
                      <p className="text-2xl font-bold">{unreadCount}</p>
                    </div>
                    <BellRing className="h-8 w-8 text-red-200" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-orange-100">
                        {language === 'hindi' ? 'तत्काल' : 'Urgent'}
                      </p>
                      <p className="text-2xl font-bold">{urgentCount}</p>
                    </div>
                    <AlertTriangle className="h-8 w-8 text-orange-200" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-100">
                        {language === 'hindi' ? 'कार्रवाई आवश्यक' : 'Action Required'}
                      </p>
                      <p className="text-2xl font-bold">{actionRequiredCount}</p>
                    </div>
                    <Zap className="h-8 w-8 text-purple-200" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Filters and Search */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-lg shadow-md p-6 mb-6"
          >
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="सूचनाएं खोजें..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                {[
                  { key: 'all', label: 'सभी', icon: Bell },
                  { key: 'unread', label: 'अपठित', icon: BellRing },
                  { key: 'urgent', label: 'तत्काल', icon: AlertTriangle },
                  { key: 'action-required', label: 'कार्रवाई आवश्यक', icon: Zap },
                  { key: 'emergency', label: 'आपातकाल', icon: AlertTriangle },
                  { key: 'system', label: 'सिस्टम', icon: Settings }
                ].map((filter) => {
                  const Icon = filter.icon;
                  return (
                    <Button
                      key={filter.key}
                      variant={selectedFilter === filter.key ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedFilter(filter.key)}
                      className="flex items-center space-x-1"
                    >
                      <Icon className="h-3 w-3" />
                      <span>{filter.label}</span>
                    </Button>
                  );
                })}
              </div>
            </div>
          </motion.div>

          {/* Notifications List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="space-y-4"
          >
            {filteredNotifications.length === 0 ? (
              <Card className="p-8 text-center">
                <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">कोई सूचना नहीं मिली</h3>
                <p className="text-gray-600">फ़िल्टर बदलें या खोज पद को संशोधित करें</p>
              </Card>
            ) : (
              filteredNotifications.map((notification, index) => {
                const Icon = getNotificationIcon(notification.type);
                
                return (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.01 }}
                    className={`${getNotificationColor(notification.type)} border rounded-lg p-6 cursor-pointer transition-all duration-200 ${
                      !notification.isRead ? 'shadow-lg' : 'shadow-sm'
                    }`}
                    onClick={() => {
                      setSelectedNotification(notification);
                      if (!notification.isRead) {
                        markAsRead(notification.id);
                      }
                    }}
                  >
                    <div className="flex items-start space-x-4">
                      <div className={`p-2 rounded-full ${notification.isRead ? 'opacity-60' : ''}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <h3 className={`font-bold ${!notification.isRead ? 'text-gray-900' : 'text-gray-700'}`}>
                                {notification.title}
                              </h3>
                              <div className={`w-2 h-2 rounded-full ${getPriorityColor(notification.priority)}`}></div>
                              {!notification.isRead && (
                                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                              )}
                            </div>
                            
                            <p className={`text-sm mb-3 ${!notification.isRead ? 'text-gray-800' : 'text-gray-600'}`}>
                              {notification.message}
                            </p>
                            
                            <div className="flex flex-wrap items-center gap-2 text-xs">
                              <Badge variant="outline" className="bg-white/50">
                                {notification.sender}
                              </Badge>
                              
                              {notification.department && (
                                <Badge variant="outline" className="bg-white/50">
                                  <Building className="h-3 w-3 mr-1" />
                                  {notification.department}
                                </Badge>
                              )}
                              
                              <Badge 
                                className={`${
                                  notification.category === 'emergency' ? 'bg-red-500 text-white' :
                                  notification.category === 'urgent' ? 'bg-orange-500 text-white' :
                                  'bg-gray-100 text-gray-800'
                                }`}
                              >
                                {notification.category}
                              </Badge>
                              
                              {notification.actionRequired && (
                                <Badge className="bg-yellow-100 text-yellow-800">
                                  <Zap className="h-3 w-3 mr-1" />
                                  कार्रवाई आवश्यक
                                </Badge>
                              )}
                              
                              <span className="text-gray-500 flex items-center">
                                <Clock className="h-3 w-3 mr-1" />
                                {new Intl.DateTimeFormat('hi-IN', {
                                  dateStyle: 'short',
                                  timeStyle: 'short'
                                }).format(notification.timestamp)}
                              </span>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2 ml-4">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteNotification(notification.id);
                              }}
                              className="text-red-600 hover:text-red-800 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })
            )}
          </motion.div>

        {/* Create Notification Dialog */}
        <Dialog open={showCreateNotification} onOpenChange={setShowCreateNotification}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>नई सूचना बनाएं</DialogTitle>
              <DialogDescription>
                नई सूचना भेजने के लिए विवरण भरें
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">शीर्षक</label>
                <Input
                  value={newNotification.title}
                  onChange={(e) => setNewNotification(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="सूचना का शीर्षक"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">संदेश</label>
                <Textarea
                  value={newNotification.message}
                  onChange={(e) => setNewNotification(prev => ({ ...prev, message: e.target.value }))}
                  placeholder="विस्तृत संदेश"
                  rows={4}
                />
              </div>
              
              <div className="flex space-x-4">
                <Button
                  onClick={createNotification}
                  disabled={!newNotification.title || !newNotification.message}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Send className="h-4 w-4 mr-2" />
                  भेजें
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowCreateNotification(false)}
                >
                  रद्द करें
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Notification Detail Dialog */}
        {selectedNotification && (
          <Dialog open={!!selectedNotification} onOpenChange={() => setSelectedNotification(null)}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{selectedNotification.title}</DialogTitle>
                <DialogDescription>
                  सूचना का पूरा विवरण और संबंधित जानकारी
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <p>{selectedNotification.message}</p>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <strong>भेजकर्ता:</strong> {selectedNotification.sender}
                  </div>
                  <div>
                    <strong>प्राथमिकता:</strong> {selectedNotification.priority}
                  </div>
                  <div>
                    <strong>विभाग:</strong> {selectedNotification.department || 'सामान्य'}
                  </div>
                  <div>
                    <strong>समय:</strong> {new Intl.DateTimeFormat('hi-IN', {
                      dateStyle: 'full',
                      timeStyle: 'short'
                    }).format(selectedNotification.timestamp)}
                  </div>
                </div>
                
                {selectedNotification.relatedComplaint && (
                  <div className="mt-4">
                    <Button
                      onClick={() => {
                        onNavigate('admin-complaints');
                        setSelectedNotification(null);
                      }}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      संबंधित शिकायत देखें
                    </Button>
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </AdminLayout>
  );
}