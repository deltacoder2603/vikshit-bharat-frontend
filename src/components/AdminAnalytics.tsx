import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { 
  BarChart3, 
  TrendingUp, 
  PieChart,
  Activity,
  Users,
  FileText,
  Clock,
  Target,
  Award,
  Building,
  MapPin,
  Calendar,
  Filter,
  Download,
  RefreshCw,
  Eye,
  AlertTriangle,
  CheckCircle,
  Zap,
  Timer
} from 'lucide-react';
import { User, Report } from '../App';
import AdminLayout from './AdminLayout';
import { api, getAuthToken } from '../utils/api';
import { getTranslations, Language } from '../utils/translations';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area,
  ComposedChart,
  Legend
} from 'recharts';

interface AdminAnalyticsProps {
  user: User;
  reports: Report[];
  allUsers: User[];
  onNavigate: (page: string) => void;
  onLogout: () => void;
  onUpdateReport: (reportId: string, updates: Partial<Report>) => void;
  language?: Language;
  onLanguageChange?: (language: Language) => void;
}

export default function AdminAnalytics({ 
  user, 
  reports, 
  allUsers, 
  onNavigate, 
  onLogout,
  onUpdateReport,
  language = 'hindi',
  onLanguageChange
}: AdminAnalyticsProps) {
  try {
    const t = getTranslations(language);
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedMetric, setSelectedMetric] = useState('complaints');
  const [realTimeData, setRealTimeData] = useState<any[]>([]);
  const [isAutoRefresh, setIsAutoRefresh] = useState(true);
  const [backendAnalytics, setBackendAnalytics] = useState<any>(null);
  const [departmentData, setDepartmentData] = useState<any[]>([]);
  const [workerData, setWorkerData] = useState<any[]>([]);
  const [wardData, setWardData] = useState<any[]>([]);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [activityAnalytics, setActivityAnalytics] = useState<any[]>([]);
  const [monthlyTrends, setMonthlyTrends] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Load backend analytics data
  const loadAnalyticsData = async () => {
    try {
      setLoading(true);
      
      // Check if user is authenticated
      const token = getAuthToken();
      
      if (!token) {
        console.warn('No authentication token found, using mock data');
        setLoading(false);
        return;
      }
      
      // Try to load analytics data with individual error handling
      const promises = [
        api.getDashboardAnalytics().catch(err => {
          console.warn('Failed to load dashboard analytics:', err.message);
          return null;
        }),
        api.getDepartmentAnalytics().catch(err => {
          console.warn('Failed to load department analytics:', err.message);
          return { departments: [] };
        }),
        api.getWorkerAnalytics().catch(err => {
          console.warn('Failed to load worker analytics:', err.message);
          return { workers: [] };
        }),
        api.getWardAnalytics().catch(err => {
          console.warn('Failed to load ward analytics:', err.message);
          return { wards: [] };
        }),
        api.getActivityAnalytics().catch(err => {
          console.warn('Failed to load activity analytics:', err.message);
          return { activity: [] };
        }),
        api.getRecentActivity(10).catch(err => {
          console.warn('Failed to load recent activity:', err.message);
          return { activities: [] };
        })
      ];

      const [analytics, departments, workers, wards, activity, recent] = await Promise.all(promises);
      
      // Only set data if it was successfully loaded
      if (analytics) {
        setBackendAnalytics(analytics);
        generateMonthlyTrends(analytics);
      }
      
      setDepartmentData(departments?.departments || []);
      setWorkerData(workers?.workers || []);
      setWardData(wards?.wards || []);
      setActivityAnalytics(activity?.activity || []);
      setRecentActivity(recent?.activities || []);
      
    } catch (error) {
      console.warn('Failed to load analytics data:', error);
      // Keep using mock data if API fails
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Safety wrapper to prevent uncaught errors
    const safeLoadAnalytics = async () => {
      try {
        await loadAnalyticsData();
      } catch (error) {
        console.warn('Error in useEffect loadAnalyticsData:', error);
        setLoading(false);
      }
    };
    
    safeLoadAnalytics();
  }, []);

  // Generate monthly trends from real analytics data
  const generateMonthlyTrends = (analytics: any) => {
    try {
      if (!analytics || !analytics.recentComplaints) {
        return;
      }

      const monthlyData: { [key: string]: any } = {};
      const currentDate = new Date();
    
    // Group complaints by month for the last 6 months
    analytics.recentComplaints.forEach((complaint: any) => {
      const complaintDate = new Date(complaint.createdAt);
      const monthKey = complaintDate.toLocaleDateString('hi-IN', { month: 'long' });
      
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = {
          month: monthKey,
          complaints: 0,
          resolved: 0,
          efficiency: 0,
          satisfaction: 4.2 // Default satisfaction rating
        };
      }
      
      monthlyData[monthKey].complaints++;
      if (complaint.status === 'completed') {
        monthlyData[monthKey].resolved++;
      }
    });

    // Calculate efficiency for each month
    Object.keys(monthlyData).forEach(month => {
      const data = monthlyData[month];
      data.efficiency = data.complaints > 0 ? Math.round((data.resolved / data.complaints) * 100) : 0;
    });

      // Convert to array and sort by month
      const trendsArray = Object.values(monthlyData);
      setMonthlyTrends(trendsArray);
    } catch (error) {
      console.warn('Error generating monthly trends:', error);
      setMonthlyTrends([]);
    }
  };

  // Optimized real-time data update - less frequent to reduce re-renders
  useEffect(() => {
    if (isAutoRefresh) {
      const interval = setInterval(() => {
        // Simulate real-time data updates less frequently
        setRealTimeData(prev => {
          const newEntry = {
            time: new Date().toLocaleTimeString('hi-IN', { hour: '2-digit', minute: '2-digit' }),
            complaints: Math.floor(Math.random() * 10) + 5,
            resolved: Math.floor(Math.random() * 8) + 2,
            timestamp: Date.now()
          };
          return [...prev, newEntry].slice(-10); // Keep only last 10 entries
        });
      }, 60000); // Update every 60 seconds instead of 30

      return () => clearInterval(interval);
    }
  }, [isAutoRefresh]);

  // Use backend analytics data when available, fallback to mock data
  const performanceMetrics = (backendAnalytics && typeof backendAnalytics === 'object') ? {
    totalComplaints: Number(backendAnalytics.totalComplaints) || 0,
    resolvedComplaints: Number(backendAnalytics.completedComplaints) || 0,
    pendingComplaints: Number(backendAnalytics.pendingComplaints) || 0,
    avgResolutionTime: `${Number(backendAnalytics.avgResolutionDays)?.toFixed(1) || '3.2'} दिन`,
    citizenSatisfaction: 4.2, // This would come from ratings in the future
    workerEfficiency: 78, // This would be calculated from worker data
    departmentEfficiency: 85, // This would be calculated from department data
    responseTime: '2.4 घंटे' // This would be calculated from status history
  } : {
    totalComplaints: reports.length + 456,
    resolvedComplaints: reports.filter(r => r.status === 'resolved').length + 356,
    pendingComplaints: reports.filter(r => r.status === 'pending').length + 67,
    avgResolutionTime: '3.2 दिन',
    citizenSatisfaction: 4.2,
    workerEfficiency: 78,
    departmentEfficiency: 85,
    responseTime: '2.4 घंटे'
  };

  // Use real monthly trends data with safe fallback
  const displayMonthlyTrends = Array.isArray(monthlyTrends) && monthlyTrends.length > 0 ? monthlyTrends : [];

  // Use backend department data with safe handling
  const departmentAnalytics = Array.isArray(departmentData) && departmentData.length > 0 ? 
    departmentData.map(dept => ({
      name: String(dept?.name || dept?.name_en || 'Unknown Department'),
      complaints: Number(dept?.total_complaints) || 0,
      resolved: Number(dept?.resolved_complaints) || 0,
      efficiency: dept?.total_complaints ? 
        Math.round((Number(dept.resolved_complaints) / Number(dept.total_complaints)) * 100) : 0,
      budget: Number(dept?.budget) || 0,
      rating: Number(dept?.rating) || 0
    })) : [];

  // Use backend category breakdown with safe handling
  const categoryDistribution = (backendAnalytics?.categoryBreakdown && typeof backendAnalytics.categoryBreakdown === 'object') ? 
    Object.entries(backendAnalytics.categoryBreakdown).map(([name, count], index) => {
      const colors = ['#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6', '#EC4899', '#14B8A6'];
      const total = Object.values(backendAnalytics.categoryBreakdown).reduce((sum: number, c: any) => sum + Number(c || 0), 0);
      const numCount = Number(count) || 0;
      return {
        name: String(name || 'Unknown'),
        value: total > 0 ? Math.round((numCount / total) * 100) : 0,
        count: numCount,
        color: colors[index % colors.length]
      };
    }).filter(item => item.count > 0) : [];

  // Use real ward data with safe handling
  const areaWiseData = Array.isArray(wardData) && wardData.length > 0 ? 
    wardData.map(ward => {
      const population = Number(ward?.population) || 50000;
      return {
        area: String(ward?.name || ward?.name_en || 'अज्ञात क्षेत्र'),
        complaints: Number(ward?.total_complaints) || 0,
        resolved: Number(ward?.resolved_complaints) || 0,
        population: population,
        density: population > 100000 ? 'उच्च' : population > 70000 ? 'मध्यम' : 'कम'
      };
    }) : [];

  // Use real worker data with safe handling
  const workerProductivity = Array.isArray(workerData) && workerData.length > 0 ? 
    workerData.map(worker => {
      const efficiencyRating = Number(worker?.efficiency_rating) || 0;
      return {
        name: String(worker?.name || 'अज्ञात कर्मचारी'),
        completed: Number(worker?.total_completed) || 0,
        target: Number(worker?.total_assigned) || 30, // Default target if not available
        efficiency: efficiencyRating,
        rating: efficiencyRating > 0 ? Math.min(efficiencyRating / 20, 5.0) : 4.0 // Convert to 5-point scale
      };
    }) : [];

  // Use real priority analysis from complaints data with safe handling
  const priorityAnalysis = (backendAnalytics?.recentComplaints && Array.isArray(backendAnalytics.recentComplaints)) ? 
    (() => {
      try {
        const priorityData: { [key: string]: any } = {};
        
        backendAnalytics.recentComplaints.forEach((complaint: any) => {
          const priority = String(complaint?.priority || 'medium');
          const priorityKey = priority === 'high' ? 'उच्च' : priority === 'medium' ? 'मध्यम' : 'कम';
          
          if (!priorityData[priorityKey]) {
            priorityData[priorityKey] = {
              priority: priorityKey,
              count: 0,
              resolved: 0,
              totalTime: 0,
              resolvedCount: 0
            };
          }
          
          priorityData[priorityKey].count++;
          if (complaint?.status === 'completed') {
            priorityData[priorityKey].resolved++;
            
            // Calculate resolution time safely
            try {
              const created = new Date(complaint.created_at);
              const updated = new Date(complaint.updated_at);
              if (!isNaN(created.getTime()) && !isNaN(updated.getTime())) {
                const timeDiff = (updated.getTime() - created.getTime()) / (1000 * 60 * 60 * 24); // days
                if (timeDiff >= 0) {
                  priorityData[priorityKey].totalTime += timeDiff;
                  priorityData[priorityKey].resolvedCount++;
                }
              }
            } catch (dateError) {
              console.warn('Error parsing dates for priority analysis:', dateError);
            }
          }
        });
        
        // Calculate average resolution times
        Object.keys(priorityData).forEach(priority => {
          const data = priorityData[priority];
          const avgTime = data.resolvedCount > 0 ? (data.totalTime / data.resolvedCount).toFixed(1) : '0.0';
          data.avgTime = `${avgTime} दिन`;
        });
        
        return Object.values(priorityData);
      } catch (error) {
        console.warn('Error processing priority analysis:', error);
        return [];
      }
    })() : [];

  const getEfficiencyColor = (efficiency: number) => {
    if (efficiency >= 90) return 'text-green-600';
    if (efficiency >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'उच्च': return 'bg-red-100 text-red-800';
      case 'मध्यम': return 'bg-yellow-100 text-yellow-800';
      case 'कम': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const pendingCount = reports.filter(r => r.status === 'pending').length + 23;
  const urgentCount = 7;

  if (loading) {
    return (
      <AdminLayout
        user={user}
        currentPage="admin-analytics"
        onNavigate={onNavigate}
        onLogout={onLogout}
        pendingCount={pendingCount}
        urgentCount={urgentCount}
        language={language}
        onLanguageChange={onLanguageChange || (() => {})}
      >
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
              <p className="text-gray-600">
                {language === 'hindi' ? 'एनालिटिक्स डेटा लोड हो रहा है...' : 'Loading analytics data...'}
              </p>
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout
      user={user}
      currentPage="admin-analytics"
      onNavigate={onNavigate}
      onLogout={onLogout}
      pendingCount={pendingCount}
      urgentCount={urgentCount}
      language={language}
      onLanguageChange={onLanguageChange || (() => {})}
    >
      <div className="p-6 space-y-6">

          {/* Header */}
          <div className="mb-8">
            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg p-6 border border-purple-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full">
                    <BarChart3 className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                      {language === 'hindi' ? 'एनालिटिक्स डैशबोर्ड' : 'Analytics Dashboard'}
                    </h1>
                    <p className="text-gray-600">
                      {language === 'hindi' ? 'डेटा-चालित अंतर्दृष्टि और प���रदर्शन मेट्रिक्स' : 'Data-driven insights and performance metrics'}
                    </p>
                  </div>
                </div>
                
                {/* Period and Metric Selectors */}
                <div className="flex items-center space-x-4">
                  <select 
                    value={selectedPeriod}
                    onChange={(e) => setSelectedPeriod(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg bg-white/80"
                  >
                    <option value="day">{language === 'hindi' ? 'आज' : 'Today'}</option>
                    <option value="week">{language === 'hindi' ? 'इस सप्ताह' : 'This Week'}</option>
                    <option value="month">{language === 'hindi' ? 'इस महीने' : 'This Month'}</option>
                    <option value="quarter">{language === 'hindi' ? 'इस तिमाही' : 'This Quarter'}</option>
                    <option value="year">{language === 'hindi' ? 'इस वर्ष' : 'This Year'}</option>
                  </select>

                  <select 
                    value={selectedMetric}
                    onChange={(e) => setSelectedMetric(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg bg-white/80"
                  >
                    <option value="complaints">{language === 'hindi' ? 'शिकायतें' : 'Complaints'}</option>
                    <option value="resolution">{language === 'hindi' ? 'समाधान दर' : 'Resolution Rate'}</option>
                    <option value="efficiency">{language === 'hindi' ? 'दक्षता' : 'Efficiency'}</option>
                    <option value="satisfaction">{language === 'hindi' ? 'संतुष्टि' : 'Satisfaction'}</option>
                  </select>
                  
                  <Button
                    variant="outline"
                    onClick={() => setIsAutoRefresh(!isAutoRefresh)}
                    className={`${isAutoRefresh ? 'text-green-600 border-green-200' : 'text-gray-600 border-gray-200'}`}
                  >
                    <RefreshCw className={`h-4 w-4 mr-2 ${isAutoRefresh ? 'animate-spin' : ''}`} />
                    {language === 'hindi' ? 'ऑटो रिफ्रेश' : 'Auto Refresh'}
                  </Button>
                  
                  <Button
                    variant="outline"
                    className="text-blue-600 border-blue-200 hover:bg-blue-50"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    {language === 'hindi' ? 'एक्सपोर्ट' : 'Export'}
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Key Performance Indicators */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          >
            <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0 shadow-xl hover:shadow-2xl transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm font-medium">
                      {language === 'hindi' ? 'कुल शिकायतें' : 'Total Complaints'}
                    </p>
                    <p className="text-3xl font-bold">{performanceMetrics.totalComplaints}</p>
                    <div className="flex items-center mt-2">
                      <TrendingUp className="h-4 w-4 mr-1" />
                      <span className="text-xs text-blue-100">
                        {language === 'hindi' ? '+12% इस महीने' : '+12% this month'}
                      </span>
                    </div>
                  </div>
                  <FileText className="h-8 w-8 text-white/80" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white border-0 shadow-xl hover:shadow-2xl transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100 text-sm font-medium">
                      {language === 'hindi' ? 'समाधान दर' : 'Resolution Rate'}
                    </p>
                    <p className="text-3xl font-bold">
                      {Math.round((performanceMetrics.resolvedComplaints / performanceMetrics.totalComplaints) * 100)}%
                    </p>
                    <div className="flex items-center mt-2">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      <span className="text-xs text-green-100">
                        {performanceMetrics.resolvedComplaints} {language === 'hindi' ? 'हल हुईं' : 'resolved'}
                      </span>
                    </div>
                  </div>
                  <Target className="h-8 w-8 text-white/80" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0 shadow-xl hover:shadow-2xl transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-sm font-medium">
                      {language === 'hindi' ? 'औसत समाधान समय' : 'Average Resolution Time'}
                    </p>
                    <p className="text-3xl font-bold">
                      {language === 'hindi' ? performanceMetrics.avgResolutionTime : '3.2 days'}
                    </p>
                    <div className="flex items-center mt-2">
                      <Timer className="h-4 w-4 mr-1" />
                      <span className="text-xs text-purple-100">
                        {language === 'hindi' ? 'लक्ष्य: 5 दिन' : 'Target: 5 days'}
                      </span>
                    </div>
                  </div>
                  <Clock className="h-8 w-8 text-white/80" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-orange-500 to-red-500 text-white border-0 shadow-xl hover:shadow-2xl transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-100 text-sm font-medium">
                      {language === 'hindi' ? 'नागरिक संतुष्टि' : 'Citizen Satisfaction'}
                    </p>
                    <p className="text-3xl font-bold">{performanceMetrics.citizenSatisfaction}/5</p>
                    <div className="flex items-center mt-2">
                      <Award className="h-4 w-4 mr-1" />
                      <span className="text-xs text-orange-100">
                        {language === 'hindi' ? '+0.3 से पिछले महीने' : '+0.3 from last month'}
                      </span>
                    </div>
                  </div>
                  <Users className="h-8 w-8 text-white/80" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Charts Section */}
            <div className="lg:col-span-2 space-y-8">
              {/* Monthly Trends */}
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <Card className="bg-white/90 backdrop-blur-sm border border-orange-200 shadow-xl">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <BarChart3 className="h-5 w-5 text-blue-600" />
                      <span>
                        {language === 'hindi' ? 'मासिक प्रदर्शन ट्रेंड' : 'Monthly Performance Trends'}
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart data={displayMonthlyTrends}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis yAxisId="left" />
                          <YAxis yAxisId="right" orientation="right" />
                          <Tooltip />
                          <Legend />
                          <Bar yAxisId="left" dataKey="complaints" fill="#FF9933" name="शिकायतें" />
                          <Bar yAxisId="left" dataKey="resolved" fill="#10B981" name="हल हुईं" />
                          <Line yAxisId="right" type="monotone" dataKey="efficiency" stroke="#8B5CF6" strokeWidth={3} name="दक्षता %" />
                        </ComposedChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Department Analytics */}
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <Card className="bg-white/90 backdrop-blur-sm border border-orange-200 shadow-xl">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Building className="h-5 w-5 text-green-600" />
                      <span>
                        {language === 'hindi' ? 'विभागीय प्रदर्शन विश्लेषण' : 'Department Performance Analysis'}
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={departmentAnalytics} layout="horizontal">
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis type="number" />
                          <YAxis dataKey="name" type="category" width={80} />
                          <Tooltip />
                          <Bar dataKey="resolved" fill="#10B981" name="हल हुईं" />
                          <Bar dataKey="complaints" fill="#EF4444" name="कुल शिकायतें" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Area-wise Analysis */}
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                <Card className="bg-white/90 backdrop-blur-sm border border-orange-200 shadow-xl">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <MapPin className="h-5 w-5 text-red-600" />
                      <span>
                        {language === 'hindi' ? 'क्षेत्रवार विश्लेषण' : 'Area-wise Analysis'}
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {areaWiseData.map((area, index) => (
                        <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-medium">{area.area}</h4>
                              <div className="flex items-center space-x-4">
                                <Badge variant="outline">
                                  {area.density} {language === 'hindi' ? 'घनत्व' : 'density'}
                                </Badge>
                                <span className="text-sm text-gray-600">
                                  {area.population.toLocaleString('hi-IN')} {language === 'hindi' ? 'जनसंख्या' : 'population'}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-4">
                                <span className="text-sm">
                                  {language === 'hindi' ? 'शिकायतें' : 'Complaints'}: {area.complaints}
                                </span>
                                <span className="text-sm text-green-600">
                                  {language === 'hindi' ? 'हल हुईं' : 'Resolved'}: {area.resolved}
                                </span>
                              </div>
                              <div className="w-32">
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                  <div
                                    className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full"
                                    style={{ width: `${(area.resolved / area.complaints) * 100}%` }}
                                  ></div>
                                </div>
                                <span className="text-xs text-gray-500">
                                  {Math.round((area.resolved / area.complaints) * 100)}% {language === 'hindi' ? 'दर' : 'rate'}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Right Sidebar Analytics */}
            <div className="space-y-6">
              {/* Category Distribution */}
              <motion.div
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <Card className="bg-white/90 backdrop-blur-sm border border-orange-200 shadow-xl">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <PieChart className="h-5 w-5 text-purple-600" />
                      <span>
                        {language === 'hindi' ? 'श्रेणी वितरण' : 'Category Distribution'}
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <RechartsPieChart>
                          <Pie
                            data={categoryDistribution}
                            cx="50%"
                            cy="50%"
                            innerRadius={40}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                          >
                            {categoryDistribution.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </RechartsPieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="space-y-2 mt-4">
                      {categoryDistribution.map((item, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                            <span className="text-sm">{item.name}</span>
                          </div>
                          <div className="text-right">
                            <span className="text-sm font-medium">{item.count}</span>
                            <span className="text-xs text-gray-500 ml-1">({item.value}%)</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Worker Productivity */}
              <motion.div
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <Card className="bg-white/90 backdrop-blur-sm border border-orange-200 shadow-xl">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Users className="h-5 w-5 text-blue-600" />
                      <span>
                        {language === 'hindi' ? 'कर्मचारी उत्पादकता' : 'Worker Productivity'}
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {workerProductivity.map((worker, index) => (
                        <div key={index} className="p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium text-sm">{worker.name}</h4>
                            <div className="flex items-center space-x-1">
                              <Award className="h-3 w-3 text-yellow-500" />
                              <span className="text-xs">{worker.rating}</span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span>
                              {language === 'hindi' ? 'पूर्ण' : 'Completed'}: {worker.completed}/{worker.target}
                            </span>
                            <span className={`font-medium ${getEfficiencyColor(worker.efficiency)}`}>
                              {worker.efficiency.toFixed(1)}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                            <div
                              className={`h-2 rounded-full ${
                                worker.efficiency >= 90 ? 'bg-green-500' :
                                worker.efficiency >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                              }`}
                              style={{ width: `${Math.min(worker.efficiency, 100)}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Priority Analysis */}
              <motion.div
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                <Card className="bg-white/90 backdrop-blur-sm border border-orange-200 shadow-xl">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <AlertTriangle className="h-5 w-5 text-yellow-600" />
                      <span>
                        {language === 'hindi' ? 'प्राथमिकता विश्लेषण' : 'Priority Analysis'}
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {priorityAnalysis.map((priority, index) => (
                        <div key={index} className="p-3 border border-gray-200 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <Badge className={getPriorityColor(priority.priority)}>
                              {priority.priority} {language === 'hindi' ? 'प्राथमिकता' : 'Priority'}
                            </Badge>
                            <span className="text-sm font-medium">
                              {priority.count} {language === 'hindi' ? 'शिकायतें' : 'complaints'}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span>
                              {language === 'hindi' ? 'हल हुईं' : 'Resolved'}: {priority.resolved}
                            </span>
                            <span>
                              {language === 'hindi' ? 'औसत समय' : 'Avg time'}: {language === 'hindi' ? priority.avgTime : priority.avgTime.replace('दिन', 'days')}
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                            <div
                              className="bg-gradient-to-r from-blue-400 to-blue-600 h-2 rounded-full"
                              style={{ width: `${(priority.resolved / priority.count) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Real-time Activity */}
              <motion.div
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 1.0 }}
              >
                <Card className="bg-white/90 backdrop-blur-sm border border-orange-200 shadow-xl">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Activity className="h-5 w-5 text-green-600" />
                      <span>
                        {language === 'hindi' ? 'रीयल-टाइम एक्टिविटी' : 'Real-time Activity'}
                      </span>
                      <Badge className="bg-green-100 text-green-800 ml-auto">
                        {language === 'hindi' ? 'लाइव' : 'Live'}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span>
                          {language === 'hindi' ? 'आज की शिकायतें:' : 'Today\'s Complaints:'}
                        </span>
                        <span className="font-medium text-blue-600">
                          {(() => {
                            try {
                              if (backendAnalytics?.recentComplaints && Array.isArray(backendAnalytics.recentComplaints)) {
                                const today = new Date();
                                return backendAnalytics.recentComplaints.filter((c: any) => {
                                  try {
                                    const complaintDate = new Date(c?.created_at);
                                    return !isNaN(complaintDate.getTime()) && complaintDate.toDateString() === today.toDateString();
                                  } catch {
                                    return false;
                                  }
                                }).length;
                              }
                              return 42;
                            } catch {
                              return 42;
                            }
                          })()}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span>
                          {language === 'hindi' ? 'सक्रिय कार्यकर्ता:' : 'Active Workers:'}
                        </span>
                        <span className="font-medium text-green-600">
                          {Array.isArray(workerData) ? workerData.filter(w => w?.current_status === 'active').length : 28}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span>
                          {language === 'hindi' ? 'प्रतिक्रिया समय:' : 'Response Time:'}
                        </span>
                        <span className="font-medium text-purple-600">
                          {backendAnalytics?.avgResponseTime ? 
                            `${backendAnalytics.avgResponseTime} ${language === 'hindi' ? 'मिनट' : 'mins'}` :
                            language === 'hindi' ? '18 मिनट' : '18 mins'
                          }
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
      </div>
    </AdminLayout>
  );
  } catch (error) {
    console.error('Error in AdminAnalytics component:', error);
    return (
      <AdminLayout
        user={user}
        currentPage="admin-analytics"
        onNavigate={onNavigate}
        onLogout={onLogout}
        pendingCount={0}
        urgentCount={0}
        language={language}
        onLanguageChange={onLanguageChange || (() => {})}
      >
        <div className="p-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <h2 className="text-red-800 text-xl font-semibold mb-2">
              {language === 'hindi' ? 'एनालिटिक्स लोड करने में त्रुटि' : 'Error Loading Analytics'}
            </h2>
            <p className="text-red-600 mb-4">
              {language === 'hindi' ? 'डेटा लोड करने में समस्या हुई है। कृपया पेज को रिफ्रेश करें।' : 'There was an error loading the analytics data. Please refresh the page.'}
            </p>
            <button 
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              {language === 'hindi' ? 'पेज रिफ्रेश करें' : 'Refresh Page'}
            </button>
          </div>
        </div>
      </AdminLayout>
    );
  }
}