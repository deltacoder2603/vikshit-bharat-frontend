import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Input } from './ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  Crown, Shield, Users, FileText, Clock, CheckCircle, AlertTriangle, TrendingUp,
  Building, MapPin, LogOut, Settings, Bell, Search, Filter, Download, Eye,
  UserCheck, Zap, Timer, Award, Activity, Calendar, Briefcase, BarChart3,
  DollarSign, Target, Megaphone, Network, PieChart as PieChartIcon, Globe,
  Phone, Mail, AlertCircle, TrendingDown, Plus, ArrowLeft, ArrowRight,
  ArrowUp, ArrowDown, Star, ThumbsUp, MessageSquare, Camera, Video
} from 'lucide-react';
import { User, Report } from '../App';
import AdminLayout from './AdminLayout';
import { getTranslations, Language } from '../utils/translations';
import { api } from '../utils/api';

interface DistrictMagistrateDashboardProps {
  user: User;
  reports: Report[];
  allUsers: User[];
  onNavigate: (page: string) => void;
  onLogout: () => void;
  onUpdateReport: (reportId: string, updates: Partial<Report>) => void;
  language?: Language;
  onLanguageChange?: (language: Language) => void;
}

export default function DistrictMagistrateDashboard({ 
  user, 
  reports, 
  allUsers, 
  onNavigate, 
  onLogout,
  onUpdateReport,
  language = 'hindi',
  onLanguageChange
}: DistrictMagistrateDashboardProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [notifications, setNotifications] = useState<any[]>([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeTab, setActiveTab] = useState('overview');
  const [backendAnalytics, setBackendAnalytics] = useState<any>(null);
  const [departmentData, setDepartmentData] = useState<any[]>([]);
  const [workerData, setWorkerData] = useState<any[]>([]);
  const [realNotifications, setRealNotifications] = useState<any[]>([]);

  const t = getTranslations(language);

  // Load backend data
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [analytics, departments, workers, notifications] = await Promise.all([
          api.getDashboardAnalytics(),
          api.getDepartmentAnalytics(),
          api.getWorkerAnalytics(),
          api.getNotifications({ limit: 20 })
        ]);
        
        setBackendAnalytics(analytics);
        setDepartmentData(departments.departments || []);
        setWorkerData(workers.workers || []);
        setRealNotifications(notifications.notifications || []);
      } catch (error) {
        console.warn('Failed to load dashboard data:', error);
        // Keep using mock data if API fails
      }
    };

    loadDashboardData();
  }, []);

  // Real-time clock update
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Use real notifications from backend when available, fallback to mock
  useEffect(() => {
    if (realNotifications.length > 0) {
      // Use real notifications from backend
      const formattedNotifications = realNotifications.slice(0, 4).map(notification => ({
        id: notification.id,
        message: notification.title,
        type: notification.category,
        time: new Date(notification.created_at).toLocaleString(language === 'hindi' ? 'hi-IN' : 'en-IN'),
        priority: notification.priority
      }));
      setNotifications(formattedNotifications);
    } else {
      // Fallback to mock notifications
      const dmNotifications = [
        { 
          id: 1, 
          message: language === 'hindi' ? 'नई आपातकालीन शिकायत: मुख्य मार्ग बंद' : 'New emergency complaint: Main road blocked', 
          type: 'urgent', 
          time: language === 'hindi' ? '1 मिनट पहले' : '1 minute ago', 
          priority: 'high' 
        },
        { 
          id: 2, 
          message: language === 'hindi' ? 'सफाई विभाग की मासिक रिपोर्ट प्राप्त' : 'Monthly report received from Sanitation Dept', 
          type: 'report', 
          time: language === 'hindi' ? '5 मिनट पहले' : '5 minutes ago', 
          priority: 'medium' 
        },
        { 
          id: 3, 
          message: language === 'hindi' ? 'नया बजट अनुमोदन अनुरोध' : 'New budget approval request', 
          type: 'budget', 
          time: language === 'hindi' ? '10 मिनट पहले' : '10 minutes ago', 
          priority: 'high' 
        },
        { 
          id: 4, 
          message: language === 'hindi' ? 'मीडिया से संपर्क अनुरोध' : 'Media contact request', 
          type: 'media', 
          time: language === 'hindi' ? '15 मिनट पहले' : '15 minutes ago', 
          priority: 'medium' 
        }
      ];
      setNotifications(dmNotifications);
    }
  }, [language, realNotifications]);

  // Enhanced district-wide statistics - use backend data when available
  const totalComplaints = backendAnalytics ? backendAnalytics.totalComplaints : (reports.length + 245);
  const pendingComplaints = backendAnalytics ? backendAnalytics.pendingComplaints : (reports.filter(r => r.status === 'pending').length + 45);
  const inProgressComplaints = backendAnalytics ? backendAnalytics.inProgressComplaints : (reports.filter(r => r.status === 'in-progress').length + 78);
  const resolvedComplaints = backendAnalytics ? backendAnalytics.completedComplaints : (reports.filter(r => r.status === 'resolved').length + 122);
  const resolutionRate = totalComplaints ? Math.round((resolvedComplaints / totalComplaints) * 100) : 0;
  const avgResolutionTime = backendAnalytics ? 
    `${backendAnalytics.avgResolutionDays?.toFixed(1) || '2.8'} ${language === 'hindi' ? 'दिन' : 'days'}` :
    (language === 'hindi' ? '2.8 दिन' : '2.8 days');
  const citizenSatisfaction = 4.3; // This would come from ratings in the future
  const urgentCount = backendAnalytics ? 
    Object.values(backendAnalytics.categoryBreakdown || {}).reduce((sum: number, count: any) => sum + (count > 50 ? 1 : 0), 0) : 12;
  const totalDepartments = departmentData.length || 15;
  const activeDepartments = departmentData.filter(d => d.status === 'active').length || 13;
  const totalWorkers = workerData.length || 156;
  const activeWorkers = workerData.filter(w => w.current_status === 'available').length || 142;
  const budgetUtilization = 78; // This would be calculated from department budgets
  const monthlyBudget = language === 'hindi' ? '₹2.45 करोड़' : '₹2.45 Crores';

  // District-wide department performance - use backend data when available
  const departmentPerformance = departmentData.length > 0 ? 
    departmentData.map(dept => ({
      name: language === 'hindi' ? dept.name : dept.name_en,
      resolved: dept.resolved_complaints || 0,
      pending: (dept.total_complaints || 0) - (dept.resolved_complaints || 0),
      efficiency: dept.total_complaints ? 
        Math.round((dept.resolved_complaints / dept.total_complaints) * 100) : 0,
      budget: dept.budget ? Math.round((dept.budget / 10000000) * 100) : 0, // Convert to percentage
      satisfaction: dept.rating || 0
    })) : [
      { 
        name: language === 'hindi' ? 'सफाई विभाग' : 'Sanitation Dept', 
        resolved: 78, pending: 22, efficiency: 78, budget: 85, satisfaction: 4.2 
      },
      { 
        name: language === 'hindi' ? 'सड़क विभाग' : 'Roads Dept', 
        resolved: 65, pending: 28, efficiency: 70, budget: 92, satisfaction: 3.8 
      },
      { 
        name: language === 'hindi' ? 'जल विभाग' : 'Water Dept', 
        resolved: 58, pending: 18, efficiency: 76, budget: 68, satisfaction: 4.1 
      },
      { 
        name: language === 'hindi' ? 'विद्युत विभाग' : 'Electricity Dept', 
        resolved: 45, pending: 25, efficiency: 64, budget: 88, satisfaction: 3.7 
      },
      { 
        name: language === 'hindi' ? 'आवास विभाग' : 'Housing Dept', 
        resolved: 32, pending: 35, efficiency: 48, budget: 72, satisfaction: 3.4 
      },
      { 
        name: language === 'hindi' ? 'स्वास्थ्य विभाग' : 'Health Dept', 
        resolved: 42, pending: 18, efficiency: 70, budget: 95, satisfaction: 4.5 
      }
    ];

  return (
    <AdminLayout
      user={user}
      currentPage="admin-dashboard"
      onNavigate={onNavigate}
      onLogout={onLogout}
      pendingCount={pendingComplaints}
      urgentCount={urgentCount}
      language={language}
      onLanguageChange={onLanguageChange || (() => {})}
    >
      <div className="p-6 space-y-6 max-w-none overflow-hidden">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg">
                <Crown className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  {language === 'hindi' ? 'जिला मजिस्ट्रेट डैशबोर्ड' : 'District Magistrate Dashboard'}
                </h1>
                <p className="text-sm text-gray-600">
                  {language === 'hindi' 
                    ? 'कानपुर जिला प्रशासन - संपूर्ण जिला स्तरीय प्रबंधन' 
                    : 'Kanpur District Administration - Complete district-level management'}
                </p>
              </div>
            </div>
          </div>

          {/* Enhanced Statistics Cards */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-6"
          >
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:shadow-lg transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-blue-600 mb-1 truncate">
                    {language === 'hindi' ? 'कुल शिकायतें' : 'Total Complaints'}
                  </p>
                  <p className="text-2xl font-bold text-blue-700">{totalComplaints}</p>
                  <p className="text-xs text-blue-500 mt-1">
                    {language === 'hindi' ? 'जिला स��तर पर' : 'District-wide'}
                  </p>
                </div>
                <FileText className="h-10 w-10 text-blue-500 flex-shrink-0" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 hover:shadow-lg transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-green-600 mb-1 truncate">
                    {language === 'hindi' ? 'हल हो गईं' : 'Resolved'}
                  </p>
                  <p className="text-2xl font-bold text-green-700">{resolvedComplaints}</p>
                  <p className="text-xs text-green-500 mt-1">
                    {resolutionRate}% {language === 'hindi' ? 'सफलता दर' : 'success rate'}
                  </p>
                </div>
                <CheckCircle className="h-10 w-10 text-green-500 flex-shrink-0" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200 hover:shadow-lg transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-yellow-600 mb-1 truncate">
                    {language === 'hindi' ? 'प्रगति में' : 'In Progress'}
                  </p>
                  <p className="text-2xl font-bold text-yellow-700">{inProgressComplaints}</p>
                  <p className="text-xs text-yellow-500 mt-1">
                    {language === 'hindi' ? 'औसत: ' + avgResolutionTime : 'Avg: ' + avgResolutionTime}
                  </p>
                </div>
                <Timer className="h-10 w-10 text-yellow-500 flex-shrink-0" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 hover:shadow-lg transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-purple-600 mb-1 truncate">
                    {language === 'hindi' ? 'नागरिक संतुष्टि' : 'Satisfaction'}
                  </p>
                  <p className="text-2xl font-bold text-purple-700">{citizenSatisfaction}</p>
                  <p className="text-xs text-purple-500 mt-1">
                    {language === 'hindi' ? '5 में से' : 'out of 5'}
                  </p>
                </div>
                <Star className="h-10 w-10 text-purple-500 flex-shrink-0" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

          {/* District Overview Section */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6"
          >
          {/* Department Performance */}
          <Card className="bg-white/95 backdrop-blur-sm shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Building className="h-6 w-6 text-blue-600" />
                <span>{language === 'hindi' ? 'विभागीय प्रदर्शन' : 'Department Performance'}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {departmentPerformance.slice(0, 5).map((dept, index) => (
                  <motion.div
                    key={dept.name}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.1 * index }}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-sm">{dept.name}</span>
                        <Badge 
                          variant={dept.efficiency > 70 ? "default" : "secondary"}
                          className={dept.efficiency > 70 ? "bg-green-500" : "bg-yellow-500"}
                        >
                          {dept.efficiency}%
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-4 text-xs text-gray-600">
                        <span>
                          {language === 'hindi' ? 'हल' : 'Resolved'}: {dept.resolved}
                        </span>
                        <span>
                          {language === 'hindi' ? 'लंबित' : 'Pending'}: {dept.pending}
                        </span>
                        <span>
                          {language === 'hindi' ? 'संतुष्टि' : 'Rating'}: {dept.satisfaction}⭐
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Notifications */}
          <Card className="bg-white/95 backdrop-blur-sm shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="h-6 w-6 text-red-600" />
                <span>{language === 'hindi' ? 'नवीनतम सूचनाएं' : 'Recent Notifications'}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {notifications.slice(0, 4).map((notification, index) => (
                  <motion.div
                    key={notification.id}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1 * index }}
                    className={`p-3 rounded-lg border-l-4 ${
                      notification.priority === 'high' 
                        ? 'bg-red-50 border-red-500' 
                        : notification.priority === 'medium'
                        ? 'bg-yellow-50 border-yellow-500'
                        : 'bg-blue-50 border-blue-500'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 mb-1">
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-500">{notification.time}</p>
                      </div>
                      <Badge 
                        variant={notification.priority === 'high' ? 'destructive' : 'secondary'}
                        className="text-xs"
                      >
                        {notification.priority === 'high' 
                          ? (language === 'hindi' ? 'तत्काल' : 'Urgent')
                          : notification.priority === 'medium'
                          ? (language === 'hindi' ? 'सामान्य' : 'Normal')
                          : (language === 'hindi' ? 'कम' : 'Low')}
                      </Badge>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6"
          >
          <Button
            onClick={() => onNavigate('admin-complaints')}
            className="h-16 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white flex flex-col items-center justify-center space-y-1"
          >
            <FileText className="h-5 w-5" />
            <span className="text-xs text-center px-1">
              {language === 'hindi' ? 'शिकायत प्रबंधन' : 'Complaints'}
            </span>
          </Button>

          <Button
            onClick={() => onNavigate('admin-departments')}
            className="h-16 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white flex flex-col items-center justify-center space-y-1"
          >
            <Building className="h-5 w-5" />
            <span className="text-xs text-center px-1">
              {language === 'hindi' ? 'विभाग प्रबंधन' : 'Departments'}
            </span>
          </Button>

          <Button
            onClick={() => {
              // Simple meeting action placeholder
              alert(language === 'hindi' ? 'मीटिंग सुविधा जल्द आएगी!' : 'Meeting feature coming soon!');
            }}
            className="h-16 bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white flex flex-col items-center justify-center space-y-1"
          >
            <Video className="h-5 w-5" />
            <span className="text-xs text-center px-1">
              {language === 'hindi' ? 'मीटिंग' : 'Meeting'}
            </span>
          </Button>

          <Button
            onClick={() => onNavigate('admin-analytics')}
            className="h-16 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white flex flex-col items-center justify-center space-y-1"
          >
            <BarChart3 className="h-5 w-5" />
            <span className="text-xs text-center px-1">
              {language === 'hindi' ? 'एनालिटिक्स' : 'Analytics'}
            </span>
          </Button>

          {/* Removed Reports button */}
        </motion.div>

          {/* Recent Complaints */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
          <Card className="bg-white/95 backdrop-blur-sm shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center space-x-2">
                  <AlertTriangle className="h-6 w-6 text-orange-600" />
                  <span>{language === 'hindi' ? 'हाल की शिकायतें' : 'Recent Complaints'}</span>
                </span>
                <Button
                  onClick={() => onNavigate('admin-complaints')}
                  variant="outline"
                  size="sm"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  {language === 'hindi' ? 'सभी देखें' : 'View All'}
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {reports.slice(0, 3).map((report, index) => (
                  <motion.div
                    key={report.id}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.1 * index }}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-sm mb-1">{report.description}</p>
                      <div className="flex items-center space-x-4 text-xs text-gray-600">
                        <span className="flex items-center">
                          <MapPin className="h-3 w-3 mr-1" />
                          {report.location}
                        </span>
                        <span className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          {new Date(report.submittedAt).toLocaleDateString(language === 'hindi' ? 'hi-IN' : 'en-US')}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge 
                        className={
                          report.status === 'resolved' ? 'bg-green-500 text-white' :
                          report.status === 'in-progress' ? 'bg-yellow-500 text-white' :
                          'bg-red-500 text-white'
                        }
                      >
                        {report.status === 'resolved' 
                          ? (language === 'hindi' ? 'हल हो गया' : 'Resolved')
                          : report.status === 'in-progress' 
                          ? (language === 'hindi' ? 'प्रगति में' : 'In Progress')
                          : (language === 'hindi' ? 'लंबित' : 'Pending')}
                      </Badge>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </AdminLayout>
  );
}