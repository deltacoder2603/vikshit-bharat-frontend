import React, { useState, useEffect, useMemo } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, AreaChart, Area
} from 'recharts';
import { 
  Users, FileText, Clock, CheckCircle, AlertTriangle, Building, LogOut,
  Search, UserCheck, BarChart3, Phone, Mail, ArrowLeft, Plus, Eye,
  Bell, Calendar, Target, TrendingUp, Award, Activity, Settings,
  MapPin, Timer, Star, Briefcase, Shield, Network, Zap, Video,
  Crown, Filter, Download, DollarSign, Megaphone, Globe, AlertCircle,
  TrendingDown, ArrowUp, ArrowDown, ArrowRight, ThumbsUp, MessageSquare,
  Camera, UserPlus, Wrench, Gauge, PieChart as PieChartIcon
} from 'lucide-react';
import { Report, User as UserType } from '../App';
import AdminLayout from './AdminLayout';
import { getTranslations, Language } from '../utils/translations';
import { api } from '../utils/api';

interface DepartmentHeadDashboardProps {
  user: UserType;
  reports: Report[];
  allUsers: UserType[];
  onNavigate: (page: string) => void;
  onLogout: () => void;
  onUpdateReport: (reportId: string, updates: Partial<Report>) => void;
  language?: Language;
  onLanguageChange?: (language: Language) => void;
}

export default function DepartmentHeadDashboard({ 
  user, 
  reports, 
  allUsers,
  onNavigate, 
  onLogout,
  onUpdateReport,
  language = 'hindi',
  onLanguageChange
}: DepartmentHeadDashboardProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [notifications, setNotifications] = useState<any[]>([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedTimeframe, setSelectedTimeframe] = useState('week');

  const t = getTranslations(language);

  // Real-time clock update (optimized)
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 30000);
    return () => clearInterval(timer);
  }, []);

  // Mock notifications for Department Head with department-specific context
  useEffect(() => {
    const deptNotifications = [
      { 
        id: 1, 
        message: language === 'hindi' 
          ? `${user.department} विभाग में आपातकालीन शिकायत` 
          : `Emergency complaint in ${user.department} department`, 
        type: 'urgent', 
        time: language === 'hindi' ? '2 मिनट पहले' : '2 minutes ago',
        priority: 'high' 
      },
      { 
        id: 2, 
        message: language === 'hindi' 
          ? 'कार्यकर्ता ने कार्य पूर्ण किया - फोटो सबमिट की' 
          : 'Worker completed task - Photo submitted', 
        type: 'success', 
        time: language === 'hindi' ? '15 मिनट पहले' : '15 minutes ago',
        priority: 'medium' 
      },
      { 
        id: 3, 
        message: language === 'hindi' 
          ? 'नया बजट अनुरोध अनुमोदन के लिए' 
          : 'New budget request for approval', 
        type: 'budget', 
        time: language === 'hindi' ? '45 मिनट पहले' : '45 minutes ago',
        priority: 'high' 
      },
      { 
        id: 4, 
        message: language === 'hindi' 
          ? 'कार्यकर्ता उपस्थिति रिपोर्ट तैयार' 
          : 'Worker attendance report ready', 
        type: 'report', 
        time: language === 'hindi' ? '1 घंटा पहले' : '1 hour ago',
        priority: 'low' 
      }
    ];
    setNotifications(deptNotifications);
  }, [language, user.department]);

  // Memoized data filtering for performance
  const departmentData = useMemo(() => {
    // Filter reports for this department
    const departmentReports = reports.filter(report => 
      report.assignedDepartment === user.department
    );

    // Get department workers
    const departmentWorkers = allUsers.filter(worker => 
      worker.department === user.department && worker.role === 'field-worker'
    );

    return {
      reports: departmentReports,
      workers: departmentWorkers
    };
  }, [reports, allUsers, user.department]);

  // Enhanced statistics for Department Head (department-specific scope)
  const stats = useMemo(() => {
    const totalReports = (departmentData.reports?.length || 0) + 35; // Department-level mock data
    const pending = (departmentData.reports || []).filter(r => r.status === 'pending').length + 8;
    const inProgress = (departmentData.reports || []).filter(r => r.status === 'in-progress').length + 12;
    const resolved = (departmentData.reports || []).filter(r => r.status === 'resolved').length + 15;
    const resolutionRate = totalReports ? Math.round((resolved / totalReports) * 100) : 0;
    const activeWorkers = (departmentData.workers?.length || 0) + 6;
    
    return {
      totalReports,
      pending,
      inProgress, 
      resolved,
      resolutionRate,
      activeWorkers,
      avgResolutionTime: language === 'hindi' ? '3.2 दिन' : '3.2 days',
      departmentRating: 4.1,
      efficiency: 75,
      budgetUtilization: 68,
      monthlyBudget: language === 'hindi' ? '₹45 लाख' : '₹45 Lakhs',
      citizenSatisfaction: 4.0,
      urgentCount: 6
    };
  }, [departmentData, language]);

  // Enhanced chart data for Department Head dashboard
  const statusData = useMemo(() => [
    { 
      name: language === 'hindi' ? 'लंबित' : 'Pending', 
      value: stats.pending, 
      color: '#ef4444' 
    },
    { 
      name: language === 'hindi' ? 'प्रगति में' : 'In Progress', 
      value: stats.inProgress, 
      color: '#f59e0b' 
    },
    { 
      name: language === 'hindi' ? 'हल' : 'Resolved', 
      value: stats.resolved, 
      color: '#10b981' 
    }
  ], [stats, language]);

  const departmentPerformanceData = useMemo(() => [
    { 
      day: language === 'hindi' ? 'सोम' : 'Mon', 
      completed: 12, 
      assigned: 15, 
      efficiency: 80,
      satisfaction: 4.2,
      budget: 72
    },
    { 
      day: language === 'hindi' ? 'मंगल' : 'Tue', 
      completed: 8, 
      assigned: 12, 
      efficiency: 67,
      satisfaction: 3.9,
      budget: 68 
    },
    { 
      day: language === 'hindi' ? 'बुध' : 'Wed', 
      completed: 15, 
      assigned: 18, 
      efficiency: 83,
      satisfaction: 4.1,
      budget: 75
    },
    { 
      day: language === 'hindi' ? 'गुरु' : 'Thu', 
      completed: 10, 
      assigned: 14, 
      efficiency: 71,
      satisfaction: 4.0,
      budget: 70
    },
    { 
      day: language === 'hindi' ? 'शुक्र' : 'Fri', 
      completed: 13, 
      assigned: 16, 
      efficiency: 81,
      satisfaction: 4.2,
      budget: 78
    },
    { 
      day: language === 'hindi' ? 'शनि' : 'Sat', 
      completed: 9, 
      assigned: 11, 
      efficiency: 82,
      satisfaction: 4.1,
      budget: 74
    },
    { 
      day: language === 'hindi' ? 'रवि' : 'Sun', 
      completed: 7, 
      assigned: 8, 
      efficiency: 88,
      satisfaction: 4.3,
      budget: 80
    }
  ], [language]);

  // Department worker performance data
  const workerPerformanceData = useMemo(() => {
    const baseWorkers = [
      {
        name: language === 'hindi' ? 'राजू सिंह' : 'Raju Singh',
        tasksCompleted: 45,
        efficiency: 92,
        rating: 4.8,
        area: language === 'hindi' ? 'क्षेत्र A' : 'Zone A'
      },
      {
        name: language === 'hindi' ? 'सुनील कुमार' : 'Sunil Kumar', 
        tasksCompleted: 38,
        efficiency: 85,
        rating: 4.5,
        area: language === 'hindi' ? 'क्षेत्र B' : 'Zone B'
      },
      {
        name: language === 'hindi' ? 'प्रेम चंद' : 'Prem Chand',
        tasksCompleted: 42,
        efficiency: 88,
        rating: 4.6,
        area: language === 'hindi' ? 'क्षेत्र C' : 'Zone C'
      }
    ];
    
    // Add actual department workers if any
    const actualWorkers = (departmentData.workers || []).slice(0, 2).map(worker => ({
      name: worker.name,
      tasksCompleted: Math.floor(Math.random() * 30) + 20,
      efficiency: Math.floor(Math.random() * 20) + 70,
      rating: Math.round((Math.random() * 1.5 + 3.5) * 10) / 10,
      area: `${language === 'hindi' ? 'क्षेत्र' : 'Zone'} ${String(worker.id).slice(-1).toUpperCase()}`
    }));
    
    return [...baseWorkers, ...actualWorkers];
  }, [departmentData.workers, language]);

  return (
    <AdminLayout
      user={user}
      currentPage="department-head-dashboard"
      onNavigate={onNavigate}
      onLogout={onLogout}
      pendingCount={stats.pending}
      urgentCount={stats.urgentCount}
      language={language}
      onLanguageChange={onLanguageChange || (() => {})}
    >
      <div className="p-6 space-y-6 max-w-none overflow-hidden">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-r from-green-500 to-green-600 rounded-lg">
              <Building className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                {language === 'hindi' ? 'विभाग प्रमुख डैशबोर्ड' : 'Department Head Dashboard'}
              </h1>
              <p className="text-sm text-gray-600">
                {`${user.department} ${language === 'hindi' 
                  ? 'विभाग - संपूर्ण विभागीय प्रबंधन और निगरानी' 
                  : 'Department - Complete departmental management and monitoring'}`}
              </p>
            </div>
          </div>
        </div>

        {/* Enhanced Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:shadow-lg transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-sm text-blue-600 mb-1 truncate">
                  {language === 'hindi' ? 'कुल शिकायतें' : 'Total Complaints'}
                </p>
                <p className="text-2xl font-bold text-blue-700">{stats.totalReports}</p>
                <p className="text-xs text-blue-500 mt-1">
                  {language === 'hindi' ? 'विभाग स्तर पर' : 'Department-wide'}
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
                <p className="text-2xl font-bold text-green-700">{stats.resolved}</p>
                <p className="text-xs text-green-500 mt-1">
                  {stats.resolutionRate}% {language === 'hindi' ? 'सफलता दर' : 'success rate'}
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
                <p className="text-2xl font-bold text-yellow-700">{stats.inProgress}</p>
                <p className="text-xs text-yellow-500 mt-1">
                  {language === 'hindi' ? 'औसत: ' + stats.avgResolutionTime : 'Avg: ' + stats.avgResolutionTime}
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
                <p className="text-2xl font-bold text-purple-700">{stats.citizenSatisfaction}</p>
                <p className="text-xs text-purple-500 mt-1">
                  {language === 'hindi' ? '5 में से' : 'out of 5'}
                </p>
              </div>
              <Star className="h-10 w-10 text-purple-500 flex-shrink-0" />
            </div>
          </CardContent>
        </Card>
      </div>

        {/* Department Overview Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Worker Performance */}
        <Card className="bg-white/95 backdrop-blur-sm shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-6 w-6 text-blue-600" />
              <span>{language === 'hindi' ? 'कार्यकर्ता प्रदर्शन' : 'Worker Performance'}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {workerPerformanceData.slice(0, 4).map((worker, index) => (
                <div
                  key={worker.name}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-sm">{worker.name}</span>
                      <Badge 
                        variant={worker.efficiency > 85 ? "default" : "secondary"}
                        className={worker.efficiency > 85 ? "bg-green-500" : "bg-yellow-500"}
                      >
                        {worker.efficiency}%
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-4 text-xs text-gray-600">
                      <span>
                        {language === 'hindi' ? 'कार्य' : 'Tasks'}: {worker.tasksCompleted}
                      </span>
                      <span>
                        {language === 'hindi' ? 'रेटिंग' : 'Rating'}: {worker.rating}⭐
                      </span>
                      <span>
                        {worker.area}
                      </span>
                    </div>
                  </div>
                </div>
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
                <div
                  key={notification.id}
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
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
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
          onClick={() => onNavigate('admin-workers')}
          className="h-16 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white flex flex-col items-center justify-center space-y-1"
        >
          <Users className="h-5 w-5" />
          <span className="text-xs text-center px-1">
            {language === 'hindi' ? 'कार्यकर्ता प्रबंधन' : 'Workers'}
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

        {/* Removed Reports button */}
      </div>

        {/* Recent Complaints */}
        <div>
        <Card className="bg-white/95 backdrop-blur-sm shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center space-x-2">
                <AlertTriangle className="h-6 w-6 text-orange-600" />
                <span>{language === 'hindi' ? 'विभागीय शिकायतें' : 'Department Complaints'}</span>
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
              {(departmentData.reports || []).slice(0, 3).map((report, index) => (
                <div
                  key={report.id}
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
                </div>
              ))}
              
              {(departmentData.reports || []).length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Shield className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium mb-2">
                    {language === 'hindi' ? 'कोई शिकायत नहीं मिली' : 'No complaints found'}
                  </p>
                  <p className="text-sm">
                    {language === 'hindi' 
                      ? 'आपके विभाग में अभी तक कोई शिकायत नहीं आई है'
                      : 'No complaints have been assigned to your department yet'}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      </div>
    </AdminLayout>
  );
}