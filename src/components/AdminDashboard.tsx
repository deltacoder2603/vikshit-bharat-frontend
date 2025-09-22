import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Input } from './ui/input';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area
} from 'recharts';
import { 
  Users,
  FileText,
  Clock,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  Building,
  MapPin,
  LogOut,
  Settings,
  Bell,
  Search,
  Filter,
  Download,
  Eye,
  UserCheck,
  Crown,
  Shield,
  Zap,
  Timer,
  Award,
  Activity,
  Calendar,
  Briefcase,
  BarChart3
} from 'lucide-react';
import { User, Report } from '../App';
import AdminSidebar from './AdminSidebar';
import { api } from '../utils/api';

interface AdminDashboardProps {
  user: User;
  reports: Report[];
  allUsers: User[];
  onNavigate: (page: string) => void;
  onLogout: () => void;
  onUpdateReport: (reportId: string, updates: Partial<Report>) => void;
}

export default function AdminDashboard({ 
  user, 
  reports, 
  allUsers, 
  onNavigate, 
  onLogout,
  onUpdateReport 
}: AdminDashboardProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [notifications, setNotifications] = useState<any[]>([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [backendAnalytics, setBackendAnalytics] = useState<any>(null);
  const [departmentData, setDepartmentData] = useState<any[]>([]);
  const [realNotifications, setRealNotifications] = useState<any[]>([]);

  // Load backend data
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [analytics, departments, notifications] = await Promise.all([
          api.getDashboardAnalytics(),
          api.getDepartmentAnalytics(),
          api.getNotifications({ limit: 10 })
        ]);
        
        setBackendAnalytics(analytics);
        setDepartmentData(departments.departments || []);
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
      const formattedNotifications = realNotifications.slice(0, 3).map(notification => ({
        id: notification.id,
        message: notification.title,
        type: notification.category,
        time: new Date(notification.created_at).toLocaleString('hi-IN')
      }));
      setNotifications(formattedNotifications);
    } else {
      // Fallback to mock notifications
      const mockNotifications = [
        { id: 1, message: 'नई शिकायत प्राप्त: कचरा निपटान', type: 'new', time: '2 मिनट पहले' },
        { id: 2, message: 'कार्यकर्ता ने कार्य पूरा किया', type: 'completed', time: '5 मिनट पहले' },
        { id: 3, message: 'उच्च प्राथमिकता: ट्रैफिक जाम', type: 'urgent', time: '10 मिनट पहले' },
      ];
      setNotifications(mockNotifications);
    }
  }, [realNotifications]);

  // Enhanced statistics - use backend data when available
  const totalComplaints = backendAnalytics ? backendAnalytics.totalComplaints : (reports.length + 156);
  const pendingComplaints = backendAnalytics ? backendAnalytics.pendingComplaints : (reports.filter(r => r.status === 'pending').length + 23);
  const inProgressComplaints = backendAnalytics ? backendAnalytics.inProgressComplaints : (reports.filter(r => r.status === 'in-progress').length + 45);
  const resolvedComplaints = backendAnalytics ? backendAnalytics.completedComplaints : (reports.filter(r => r.status === 'resolved').length + 88);
  const resolutionRate = totalComplaints ? Math.round((resolvedComplaints / totalComplaints) * 100) : 0;
  const avgResolutionTime = backendAnalytics ? 
    `${backendAnalytics.avgResolutionDays?.toFixed(1) || '3.2'} दिन` : '3.2 दिन';
  const citizenSatisfaction = 4.2; // This would come from ratings in the future
  const urgentCount = backendAnalytics ? 
    Math.min(Object.values(backendAnalytics.categoryBreakdown || {}).reduce((sum: number, count: any) => sum + (count > 20 ? 1 : 0), 0), 10) : 7;

  // Role-specific data filtering
  const getFilteredReports = () => {
    let filtered = reports;
    
    if (user.role === 'field-worker') {
      filtered = reports.filter(r => r.assignedWorker === user.id || r.assignedDepartment === user.department);
    } else if (user.role === 'department-head') {
      filtered = reports.filter(r => r.assignedDepartment === user.department);
    }
    
    if (selectedFilter !== 'all') {
      filtered = filtered.filter(r => r.status === selectedFilter);
    }
    
    if (searchTerm) {
      filtered = filtered.filter(r => 
        r.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return filtered;
  };

  const filteredReports = getFilteredReports();

  // Chart data
  const statusData = [
    { name: 'Pending', value: pendingComplaints, color: '#EF4444' },
    { name: 'In Progress', value: inProgressComplaints, color: '#F59E0B' },
    { name: 'Resolved', value: resolvedComplaints, color: '#10B981' }
  ];

  // Category data - use backend data when available
  const categoryData = backendAnalytics?.categoryBreakdown || reports.reduce((acc, report) => {
    const category = report.category.split('/')[0].trim();
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const categoryChartData = Object.entries(categoryData).map(([name, value]) => ({ name, value }));

  // Department performance data - use backend data when available
  const departmentPerformance = departmentData.length > 0 ? 
    departmentData.slice(0, 5).map(dept => ({
      name: dept.name,
      resolved: dept.resolved_complaints || 0,
      pending: (dept.total_complaints || 0) - (dept.resolved_complaints || 0),
      efficiency: dept.total_complaints ? 
        Math.round((dept.resolved_complaints / dept.total_complaints) * 100) : 0
    })) : [
      { name: 'सफाई विभाग', resolved: 45, pending: 12, efficiency: 78 },
      { name: 'सड़क विभाग', resolved: 32, pending: 18, efficiency: 64 },
      { name: 'जल विभाग', resolved: 28, pending: 8, efficiency: 77 },
      { name: 'विद्युत विभाग', resolved: 24, pending: 15, efficiency: 61 },
      { name: 'आवास विभाग', resolved: 19, pending: 22, efficiency: 46 }
    ];

  // Real-time activity data
  const todayActivity = [
    { time: '09:00', complaints: 5, resolved: 2 },
    { time: '10:00', complaints: 8, resolved: 3 },
    { time: '11:00', complaints: 12, resolved: 5 },
    { time: '12:00', complaints: 15, resolved: 7 },
    { time: '13:00', complaints: 18, resolved: 9 },
    { time: '14:00', complaints: 22, resolved: 12 },
    { time: '15:00', complaints: 25, resolved: 15 }
  ];

  // Ward-wise data
  const wardData = [
    { ward: 'Ward 1', complaints: 23, resolved: 18, pending: 5 },
    { ward: 'Ward 2', complaints: 31, resolved: 22, pending: 9 },
    { ward: 'Ward 3', complaints: 19, resolved: 15, pending: 4 },
    { ward: 'Ward 4', complaints: 27, resolved: 20, pending: 7 },
    { ward: 'Ward 5', complaints: 35, resolved: 25, pending: 10 }
  ];

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
      case 'district-magistrate': return 'text-purple-600 bg-purple-100';
      case 'department-head': return 'text-green-600 bg-green-100';
      case 'field-worker': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const RoleIcon = getRoleIcon(user.role);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-green-50 flex">
      {/* Sidebar */}
      <AdminSidebar
        user={user}
        currentPage="admin-dashboard"
        onNavigate={onNavigate}
        pendingCount={pendingComplaints}
        urgentCount={urgentCount}
      />

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <motion.header
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white/90 backdrop-blur-sm border-b border-orange-200 shadow-sm sticky top-0 z-40"
        >
          <div className="px-6 py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-6">
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">
                    डैशबोर्ड ओवरव्यू / Dashboard Overview
                  </h1>
                  <p className="text-gray-600">
                    {currentTime.toLocaleString('hi-IN', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
                
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="शिकायत खोजें... / Search complaints..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-64 bg-white/80"
                  />
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <Button variant="outline" size="sm" className="relative">
                  <Bell className="h-4 w-4" />
                  {urgentCount > 0 && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center"
                    >
                      {urgentCount}
                    </motion.div>
                  )}
                </Button>
                
                <div className="flex items-center space-x-3 px-4 py-2 bg-white/80 rounded-lg border border-orange-200">
                  <div className="w-8 h-8 bg-gradient-to-r from-orange-400 to-red-500 rounded-full flex items-center justify-center text-white font-bold">
                    {user.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">{user.name}</p>
                    <p className="text-xs text-gray-600">
                      {user.role === 'district-magistrate' ? 'जिला मजिस्ट्रेट' :
                       user.role === 'department-head' ? 'विभाग प्रमुख' : 'फील्ड वर्कर'}
                    </p>
                  </div>
                </div>

                <Button
                  variant="outline"
                  onClick={onLogout}
                  className="border-red-200 text-red-700 hover:bg-red-50"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  लॉगआउट
                </Button>
              </div>
            </div>
          </div>
        </motion.header>

        <div className="p-6">
          {/* KPI Cards */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8"
          >
            <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0 shadow-xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm font-medium">कुल शिकायतें</p>
                    <motion.p 
                      className="text-3xl font-bold"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.5, type: "spring" }}
                    >
                      {totalComplaints}
                    </motion.p>
                    <p className="text-xs text-blue-100 flex items-center mt-2">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      +12% इस महीने
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                    <FileText className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white border-0 shadow-xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-red-100 text-sm font-medium">लंबित</p>
                    <motion.p 
                      className="text-3xl font-bold"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.6, type: "spring" }}
                    >
                      {pendingComplaints}
                    </motion.p>
                    <p className="text-xs text-red-100">तत्काल ध्यान चाहिए</p>
                  </div>
                  <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                    <AlertTriangle className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0 shadow-xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-yellow-100 text-sm font-medium">प्रगति में</p>
                    <motion.p 
                      className="text-3xl font-bold"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.7, type: "spring" }}
                    >
                      {inProgressComplaints}
                    </motion.p>
                    <p className="text-xs text-yellow-100">कार्य जारी है</p>
                  </div>
                  <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                    <Clock className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white border-0 shadow-xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100 text-sm font-medium">हल हुईं</p>
                    <motion.p 
                      className="text-3xl font-bold"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.8, type: "spring" }}
                    >
                      {resolvedComplaints}
                    </motion.p>
                    <p className="text-xs text-green-100">{resolutionRate}% दर</p>
                  </div>
                  <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                    <CheckCircle className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0 shadow-xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-sm font-medium">संतुष्टि स्कोर</p>
                    <motion.p 
                      className="text-3xl font-bold"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.9, type: "spring" }}
                    >
                      {citizenSatisfaction}/5
                    </motion.p>
                    <p className="text-xs text-purple-100">नागरिक रेटिंग</p>
                  </div>
                  <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                    <Award className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Real-time Activity & Notifications */}
          <div className="grid lg:grid-cols-4 gap-6 mb-8">
            {/* Real-time Activity Chart */}
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="lg:col-span-3"
            >
              <Card className="bg-white/90 backdrop-blur-sm border border-orange-200 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Activity className="h-5 w-5 text-blue-600" />
                    <span>आज की गतिविधि / Today's Activity</span>
                    <Badge className="bg-green-100 text-green-800 ml-auto">लाइव</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={todayActivity}>
                        <defs>
                          <linearGradient id="complaints" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#FF9933" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#FF9933" stopOpacity={0.1}/>
                          </linearGradient>
                          <linearGradient id="resolved" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#10B981" stopOpacity={0.1}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="time" />
                        <YAxis />
                        <Tooltip />
                        <Area type="monotone" dataKey="complaints" stroke="#FF9933" fillOpacity={1} fill="url(#complaints)" />
                        <Area type="monotone" dataKey="resolved" stroke="#10B981" fillOpacity={1} fill="url(#resolved)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Live Notifications */}
            <motion.div
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <Card className="bg-white/90 backdrop-blur-sm border border-orange-200 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Bell className="h-5 w-5 text-yellow-600" />
                    <span>लाइव अपडेट</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {notifications.map((notification, index) => (
                    <motion.div
                      key={notification.id}
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.8 + index * 0.1 }}
                      className={`p-3 rounded-lg border-l-4 ${
                        notification.type === 'urgent' ? 'bg-red-50 border-red-500' :
                        notification.type === 'completed' ? 'bg-green-50 border-green-500' :
                        'bg-blue-50 border-blue-500'
                      }`}
                    >
                      <p className="text-sm font-medium">{notification.message}</p>
                      <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                    </motion.div>
                  ))}
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => onNavigate('admin-notifications')}
                    className="w-full mt-3"
                  >
                    सभी देखें / View All
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Charts Section */}
            <div className="lg:col-span-2 space-y-6">
              {/* Department Performance */}
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                <Card className="bg-white/90 backdrop-blur-sm border border-orange-200 shadow-xl">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Building className="h-5 w-5 text-green-600" />
                      <span>विभागीय प्रदर्शन / Department Performance</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={departmentPerformance}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="resolved" fill="#10B981" name="हल हुई" />
                          <Bar dataKey="pending" fill="#EF4444" name="लंबित" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Status Distribution Chart */}
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 1.0 }}
              >
                <Card className="bg-white/90 backdrop-blur-sm border border-orange-200 shadow-xl">
                  <CardHeader>
                    <CardTitle>शिकायत स्थिति वितरण / Complaint Status Distribution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={statusData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={100}
                            paddingAngle={5}
                            dataKey="value"
                          >
                            {statusData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="flex justify-center space-x-4 mt-4">
                      {statusData.map((item, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                          <span className="text-sm">{item.name}: {item.value}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

            {/* Category Distribution */}
            {user.role === 'district-magistrate' && (
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                <Card className="bg-white/90 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle>श्रेणी वितरण / Category Distribution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={categoryChartData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="value" fill="#FF9933" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>

            {/* Recent Complaints & Quick Actions */}
            <div className="space-y-6">
              <motion.div
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                <Card className="bg-white/90 backdrop-blur-sm border border-orange-200 shadow-xl">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      हाल की शिकायतें / Recent Complaints
                      <Button size="sm" onClick={() => onNavigate('admin-complaints')}>
                        <Eye className="h-4 w-4 mr-1" />
                        सभी देखें
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {filteredReports.slice(0, 5).map((report, index) => (
                      <motion.div
                        key={report.id}
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 1.0 + index * 0.1 }}
                        className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-all duration-200 hover:shadow-md"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">#{String(report.id).slice(-6)}</span>
                          <Badge className={
                            report.status === 'resolved' ? 'bg-green-100 text-green-800' :
                            report.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }>
                            {report.status === 'resolved' ? 'हल हो गया' :
                             report.status === 'in-progress' ? 'प्रगति में' : 'लंबित'}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-1">{report.category.split('/')[0]}</p>
                        <p className="text-xs text-gray-500 flex items-center">
                          <MapPin className="h-3 w-3 mr-1" />
                          {report.location}
                        </p>
                      </motion.div>
                    ))}
                  </CardContent>
                </Card>
              </motion.div>

              {/* Performance Metrics */}
              <motion.div
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 1.0 }}
              >
                <Card className="bg-white/90 backdrop-blur-sm border border-orange-200 shadow-xl">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Timer className="h-5 w-5 text-blue-600" />
                      <span>प्रदर्शन मेट्रिक्स</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-blue-800">औसत समाधान समय</span>
                        <Timer className="h-4 w-4 text-blue-600" />
                      </div>
                      <p className="text-2xl font-bold text-blue-700">{avgResolutionTime}</p>
                      <Progress value={72} className="mt-2" />
                      <p className="text-xs text-blue-600 mt-1">लक्ष्य: 2 दिन</p>
                    </div>

                    <div className="bg-purple-50 p-4 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-purple-800">नागरिक संतुष्टि</span>
                        <Award className="h-4 w-4 text-purple-600" />
                      </div>
                      <p className="text-2xl font-bold text-purple-700">{citizenSatisfaction}/5</p>
                      <Progress value={84} className="mt-2" />
                      <p className="text-xs text-purple-600 mt-1">लक्ष्य: 4.5/5</p>
                    </div>

                    <div className="bg-green-50 p-4 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-green-800">दक्षता दर</span>
                        <TrendingUp className="h-4 w-4 text-green-600" />
                      </div>
                      <p className="text-2xl font-bold text-green-700">{resolutionRate}%</p>
                      <Progress value={resolutionRate} className="mt-2" />
                      <p className="text-xs text-green-600 mt-1">लक्ष्य: 90%</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Quick Actions */}
              <motion.div
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 1.2 }}
              >
                <Card className="bg-white/90 backdrop-blur-sm border border-orange-200 shadow-xl">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Zap className="h-5 w-5 text-orange-600" />
                      <span>त्वरित कार्य</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button 
                      onClick={() => onNavigate('admin-complaints')}
                      className="w-full justify-start bg-blue-50 hover:bg-blue-100 text-blue-700 border-0"
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      सभी शिकायतें देखें
                    </Button>
                    
                    <Button 
                      onClick={() => onNavigate('admin-map')}
                      className="w-full justify-start bg-orange-50 hover:bg-orange-100 text-orange-700 border-0"
                    >
                      <MapPin className="h-4 w-4 mr-2" />
                      मैप व्यू खोलें
                    </Button>
                    
                    {user.role === 'district-magistrate' && (
                      <Button 
                        onClick={() => onNavigate('admin-analytics')}
                        className="w-full justify-start bg-green-50 hover:bg-green-100 text-green-700 border-0"
                      >
                        <BarChart3 className="h-4 w-4 mr-2" />
                        विश्लेषण रिपोर्ट
                      </Button>
                    )}
                    
                    {/* Removed Reports button */}

                    <Button 
                      onClick={() => onNavigate('admin-workers')}
                      variant="outline"
                      className="w-full justify-start"
                    >
                      <Users className="h-4 w-4 mr-2" />
                      कार्यकर्ता प्रबंधन
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}