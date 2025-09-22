import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { 
  FileDown, 
  BarChart3, 
  TrendingUp, 
  Calendar,
  Download,
  Filter,
  Search,
  FileText,
  PieChart,
  Activity,
  Users,
  Clock,
  Target,
  Award,
  Building,
  AlertTriangle,
  CheckCircle,
  Eye,
  Printer,
  Share2,
  Mail
} from 'lucide-react';
import { User, Report } from '../App';
import AdminLayout from './AdminLayout';
import { getTranslations, Language } from '../utils/translations';
import { api, getAuthToken } from '../utils/api';
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
  Area
} from 'recharts';

interface AdminReportsProps {
  user: User;
  reports: Report[];
  allUsers: User[];
  onNavigate: (page: string) => void;
  onLogout: () => void;
  onUpdateReport: (reportId: string, updates: Partial<Report>) => void;
  language?: Language;
  onLanguageChange?: (language: Language) => void;
}

interface ReportTemplate {
  id: string;
  name: string;
  nameEn: string;
  description: string;
  type: 'summary' | 'detailed' | 'performance' | 'analytics';
  icon: any;
  color: string;
  lastGenerated?: Date;
  downloadCount: number;
}

export default function AdminReports({ 
  user, 
  reports, 
  allUsers, 
  onNavigate, 
  onLogout,
  onUpdateReport,
  language = 'hindi',
  onLanguageChange
}: AdminReportsProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedTemplate, setSelectedTemplate] = useState<ReportTemplate | null>(null);
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [backendAnalytics, setBackendAnalytics] = useState<any>(null);
  const [departmentData, setDepartmentData] = useState<any[]>([]);

  const t = getTranslations(language);

  // Load backend analytics data
  useEffect(() => {
    const loadAnalyticsData = async () => {
      // Check if user is authenticated
      const token = getAuthToken();
      if (!token) {
        console.warn('No authentication token found, using mock data');
        return;
      }
      
      try {
        const promises = [
          api.getDashboardAnalytics().catch(err => {
            console.warn('Failed to load dashboard analytics:', err);
            return null;
          }),
          api.getDepartmentAnalytics().catch(err => {
            console.warn('Failed to load department analytics:', err);
            return { departments: [] };
          })
        ];
        
        const [analytics, departments] = await Promise.all(promises);
        
        if (analytics) {
          setBackendAnalytics(analytics);
        }
        setDepartmentData(departments?.departments || []);
      } catch (error) {
        console.warn('Failed to load analytics data:', error);
        // Keep using mock data if API fails
      }
    };

    loadAnalyticsData();
  }, []);

  // Report templates
  const reportTemplates: ReportTemplate[] = [
    {
      id: 'daily-summary',
      name: 'दैनिक सारांश रिपोर्ट',
      nameEn: 'Daily Summary Report',
      description: 'आज की सभी गतिविधियों का विस्तृत विवरण',
      type: 'summary',
      icon: Calendar,
      color: 'from-blue-500 to-blue-600',
      lastGenerated: new Date('2024-01-17'),
      downloadCount: 45
    },
    {
      id: 'monthly-analytics',
      name: 'मासिक एनालिटिक्स',
      nameEn: 'Monthly Analytics',
      description: 'पिछले महीने का प्रदर्शन विश्लेषण और ट्रेंड्स',
      type: 'analytics',
      icon: BarChart3,
      color: 'from-green-500 to-green-600',
      lastGenerated: new Date('2024-01-15'),
      downloadCount: 23
    },
    {
      id: 'department-performance',
      name: 'विभागीय प्रदर्शन',
      nameEn: 'Department Performance',
      description: 'सभी विभागों की कार्यक्षमता और तुलनात्मक विश्लेषण',
      type: 'performance',
      icon: Building,
      color: 'from-purple-500 to-purple-600',
      lastGenerated: new Date('2024-01-16'),
      downloadCount: 31
    },
    {
      id: 'worker-productivity',
      name: 'कर्मचारी उत्पादकता',
      nameEn: 'Worker Productivity',
      description: 'फील्ड वर्कर्स की उत्पादकता और कार्य गुणवत्ता',
      type: 'performance',
      icon: Users,
      color: 'from-orange-500 to-red-500',
      lastGenerated: new Date('2024-01-14'),
      downloadCount: 18
    },
    {
      id: 'complaint-analysis',
      name: 'शिकायत विश्लेषण',
      nameEn: 'Complaint Analysis',
      description: 'शिकायतों की श्रेणी-वार और क्षेत्र-वार विस्तृत रिपोर्ट',
      type: 'detailed',
      icon: FileText,
      color: 'from-teal-500 to-teal-600',
      lastGenerated: new Date('2024-01-13'),
      downloadCount: 27
    },
    {
      id: 'resolution-time',
      name: 'समाधान समय रिपोर्ट',
      nameEn: 'Resolution Time Report',
      description: 'शिकायतों के समाधान में लगने वाले समय का विश्लेषण',
      type: 'analytics',
      icon: Clock,
      color: 'from-indigo-500 to-indigo-600',
      lastGenerated: new Date('2024-01-12'),
      downloadCount: 22
    },
    {
      id: 'citizen-satisfaction',
      name: 'नागरिक संतुष्टि सर्वे',
      nameEn: 'Citizen Satisfaction Survey',
      description: 'नागरिकों की संतुष्टि और फीडबैक रिपोर्ट',
      type: 'summary',
      icon: Award,
      color: 'from-pink-500 to-pink-600',
      lastGenerated: new Date('2024-01-10'),
      downloadCount: 35
    },
    {
      id: 'budget-utilization',
      name: 'बजट उपयोग रिपोर्ट',
      nameEn: 'Budget Utilization Report',
      description: 'विभागीय बजट का उपयोग और व्यय विश्लेषण',
      type: 'detailed',
      icon: Target,
      color: 'from-yellow-500 to-orange-500',
      lastGenerated: new Date('2024-01-11'),
      downloadCount: 19
    }
  ];

  // Use real analytics data when available, fallback to mock data
  const monthlyTrends = backendAnalytics?.recentComplaints ? 
    (() => {
      const monthlyData: { [key: string]: any } = {};
      
      backendAnalytics.recentComplaints.forEach((complaint: any) => {
        const complaintDate = new Date(complaint.created_at);
        const monthKey = complaintDate.toLocaleDateString('hi-IN', { month: 'short' });
        
        if (!monthlyData[monthKey]) {
          monthlyData[monthKey] = {
            month: monthKey,
            complaints: 0,
            resolved: 0,
            pending: 0
          };
        }
        
        monthlyData[monthKey].complaints++;
        if (complaint.status === 'completed') {
          monthlyData[monthKey].resolved++;
        } else {
          monthlyData[monthKey].pending++;
        }
      });
      
      return Object.values(monthlyData);
    })() : [
      { month: 'जन', complaints: 245, resolved: 198, pending: 47 },
      { month: 'फर', complaints: 267, resolved: 223, pending: 44 },
      { month: 'मार', complaints: 289, resolved: 251, pending: 38 },
      { month: 'अप्र', complaints: 312, resolved: 284, pending: 28 },
      { month: 'मई', complaints: 298, resolved: 276, pending: 22 },
      { month: 'जून', complaints: 276, resolved: 259, pending: 17 }
    ];

  const categoryDistribution = backendAnalytics?.categoryBreakdown ? 
    Object.entries(backendAnalytics.categoryBreakdown).map(([name, count], index) => {
      const colors = ['#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6'];
      const total = Object.values(backendAnalytics.categoryBreakdown).reduce((sum: number, c: any) => sum + c, 0);
      return {
        name,
        value: Math.round((count as number / total) * 100),
        color: colors[index % colors.length]
      };
    }) : [
      { name: 'सफाई', value: 35, color: '#EF4444' },
      { name: 'सड़क', value: 28, color: '#F59E0B' },
      { name: 'विद्युत', value: 18, color: '#10B981' },
      { name: 'जल', value: 12, color: '#3B82F6' },
      { name: 'अन्य', value: 7, color: '#8B5CF6' }
    ];

  const departmentEfficiency = departmentData.length > 0 ? 
    departmentData.map(dept => ({
      name: dept.name || dept.name_en,
      efficiency: dept.total_complaints ? 
        Math.round((dept.resolved_complaints / dept.total_complaints) * 100) : 0,
      complaints: dept.total_complaints || 0
    })) : [
      { name: 'स्वास्थ्य', efficiency: 92, complaints: 67 },
      { name: 'विद्युत', efficiency: 88, complaints: 78 },
      { name: 'जल', efficiency: 84, complaints: 123 },
      { name: 'सफाई', efficiency: 76, complaints: 156 },
      { name: 'सड़क', efficiency: 68, complaints: 189 }
    ];

  const filteredTemplates = reportTemplates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.nameEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || template.type === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const handleGenerateReport = (template: ReportTemplate) => {
    setSelectedTemplate(template);
    setShowGenerateModal(true);
  };

  const handleDownloadReport = (template: ReportTemplate) => {
    // Mock download functionality
    console.log(`Downloading ${template.name} for period: ${selectedPeriod}`);
    // Update download count
    template.downloadCount += 1;
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'summary': return 'bg-blue-100 text-blue-800';
      case 'detailed': return 'bg-green-100 text-green-800';
      case 'performance': return 'bg-purple-100 text-purple-800';
      case 'analytics': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeText = (type: string) => {
    if (language === 'hindi') {
      switch (type) {
        case 'summary': return 'सारांश';
        case 'detailed': return 'विस्तृत';
        case 'performance': return 'प्रदर्शन';
        case 'analytics': return 'विश्लेषण';
        default: return 'अन्य';
      }
    } else {
      switch (type) {
        case 'summary': return 'Summary';
        case 'detailed': return 'Detailed';
        case 'performance': return 'Performance';
        case 'analytics': return 'Analytics';
        default: return 'Other';
      }
    }
  };

  const pendingCount = reports.filter(r => r.status === 'pending').length + 23;
  const urgentCount = 7;

  return (
    <AdminLayout
      user={user}
      currentPage="admin-reports"
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
            <div className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-lg p-6 border border-cyan-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-gradient-to-r from-cyan-500 to-cyan-600 rounded-full">
                    <FileDown className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                      {language === 'hindi' ? 'रिपोर्ट्स व एनालिटिक्स' : 'Reports & Analytics'}
                    </h1>
                    <p className="text-gray-600">
                      {user.role === 'district-magistrate' 
                        ? (language === 'hindi' ? 'सभी जिला रिपोर्ट्स और डेटा विश्लेषण' : 'All district reports and data analysis')
                        : `${user.department} ${language === 'hindi' ? 'विभाग की रिपोर्ट्स और विश्लेषण' : 'department reports and analysis'}`}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="text-sm text-gray-600">
                      {language === 'hindi' ? 'कुल रिपोर्ट्स' : 'Total Reports'}
                    </div>
                    <div className="text-2xl font-bold text-cyan-600">{reportTemplates.length}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-600">
                      {language === 'hindi' ? 'डाउनलोड्स' : 'Downloads'}
                    </div>
                    <div className="text-2xl font-bold text-green-600">{reportTemplates.reduce((sum, r) => sum + r.downloadCount, 0)}</div>
                  </div>
                  <Button
                    variant="outline"
                    className="text-green-600 border-green-200 hover:bg-green-50"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    {language === 'hindi' ? 'सभी रिपोर्ट्स' : 'All Reports'}
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Search and Filters */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <Card className="bg-white/90 backdrop-blur-sm border border-orange-200 shadow-xl">
              <CardContent className="p-3 sm:p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder={language === 'hindi' ? 'रिपोर्ट खोजें...' : 'Search reports...'}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  
                  <select 
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg bg-white/80"
                  >
                    <option value="all">{language === 'hindi' ? 'सभी प्रकार' : 'All Types'}</option>
                    <option value="summary">{language === 'hindi' ? 'सारांश' : 'Summary'}</option>
                    <option value="detailed">{language === 'hindi' ? 'विस्तृत' : 'Detailed'}</option>
                    <option value="performance">{language === 'hindi' ? 'प्रदर्शन' : 'Performance'}</option>
                    <option value="analytics">{language === 'hindi' ? 'विश्लेषण' : 'Analytics'}</option>
                  </select>

                  <select 
                    value={selectedPeriod}
                    onChange={(e) => setSelectedPeriod(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg bg-white/80"
                  >
                    <option value="today">{language === 'hindi' ? 'आज' : 'Today'}</option>
                    <option value="week">{language === 'hindi' ? 'इस सप्ताह' : 'This Week'}</option>
                    <option value="month">{language === 'hindi' ? 'इस महीने' : 'This Month'}</option>
                    <option value="quarter">{language === 'hindi' ? 'इस तिमाही' : 'This Quarter'}</option>
                    <option value="year">{language === 'hindi' ? 'इस वर्ष' : 'This Year'}</option>
                  </select>

                  <Button className="bg-orange-500 hover:bg-orange-600 text-white">
                    <Filter className="h-4 w-4 mr-2" />
                    {language === 'hindi' ? 'फिल्टर लगाएं' : 'Apply Filter'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Report Templates */}
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="lg:col-span-2 space-y-6"
            >
              <Card className="bg-white/90 backdrop-blur-sm border border-orange-200 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <FileDown className="h-5 w-5 text-blue-600" />
                    <span>{language === 'hindi' ? 'उपलब्ध रिपोर्ट टेम्प्लेट्स' : 'Available Report Templates'}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredTemplates.map((template, index) => {
                      const IconComponent = template.icon;
                      return (
                        <motion.div
                          key={template.id}
                          initial={{ scale: 0.9, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ delay: 0.1 * index }}
                          whileHover={{ scale: 1.02 }}
                          className="group"
                        >
                          <Card className="bg-white border border-gray-200 hover:shadow-lg transition-all duration-300 cursor-pointer">
                            <CardContent className="p-4">
                              <div className="flex items-start space-x-3">
                                <div className={`w-12 h-12 bg-gradient-to-r ${template.color} rounded-lg flex items-center justify-center text-white`}>
                                  <IconComponent className="h-6 w-6" />
                                </div>
                                <div className="flex-1">
                                  <h3 className="font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                                    {language === 'hindi' ? template.name : template.nameEn}
                                  </h3>
                                  <p className="text-sm text-gray-600 mt-1">{template.description}</p>
                                  <div className="flex items-center justify-between mt-3">
                                    <Badge className={getTypeColor(template.type)}>
                                      {getTypeText(template.type)}
                                    </Badge>
                                    <span className="text-xs text-gray-500">
                                      {template.downloadCount} {language === 'hindi' ? 'डाउनलोड्स' : 'downloads'}
                                    </span>
                                  </div>
                                  {template.lastGenerated && (
                                    <p className="text-xs text-gray-400 mt-2">
                                      {language === 'hindi' ? 'अंतिम बार जेनरेट:' : 'Last generated:'} {template.lastGenerated.toLocaleDateString('hi-IN')}
                                    </p>
                                  )}
                                </div>
                              </div>
                              
                              <div className="flex space-x-2 mt-4">
                                <Button
                                  size="sm"
                                  onClick={() => handleGenerateReport(template)}
                                  className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 text-white"
                                >
                                  <Eye className="h-4 w-4 mr-1" />
                                  {language === 'hindi' ? 'जेनरेट करें' : 'Generate'}
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleDownloadReport(template)}
                                  className="text-green-600 border-green-200 hover:bg-green-50"
                                >
                                  <Download className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="text-blue-600 border-blue-200 hover:bg-blue-50"
                                >
                                  <Share2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Analytics Dashboard */}
            <motion.div
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="space-y-6"
            >
              {/* Monthly Trends */}
              <Card className="bg-white/90 backdrop-blur-sm border border-orange-200 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                    <span>{language === 'hindi' ? 'मासिक ट्रेंड्स' : 'Monthly Trends'}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={monthlyTrends}>
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
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Area type="monotone" dataKey="complaints" stroke="#FF9933" fillOpacity={1} fill="url(#complaints)" />
                        <Area type="monotone" dataKey="resolved" stroke="#10B981" fillOpacity={1} fill="url(#resolved)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Category Distribution */}
              <Card className="bg-white/90 backdrop-blur-sm border border-orange-200 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <PieChart className="h-5 w-5 text-purple-600" />
                    <span>{language === 'hindi' ? 'श्रेणी वितरण' : 'Category Distribution'}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-48">
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
                  <div className="flex flex-wrap gap-2 mt-4">
                    {categoryDistribution.map((item, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                        <span className="text-sm">{item.name}: {item.value}%</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Department Efficiency */}
              <Card className="bg-white/90 backdrop-blur-sm border border-orange-200 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Building className="h-5 w-5 text-blue-600" />
                    <span>{language === 'hindi' ? 'विभागीय दक्षता' : 'Department Efficiency'}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {departmentEfficiency.map((dept, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex justify-between text-sm">
                            <span>{dept.name}</span>
                            <span className="font-medium">{dept.efficiency}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                            <div
                              className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${dept.efficiency}%` }}
                            ></div>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            {dept.complaints} {language === 'hindi' ? 'शिकायतें' : 'complaints'}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Generate Report Modal */}
          {showGenerateModal && selectedTemplate && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
              onClick={() => setShowGenerateModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-white rounded-xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">
                      {language === 'hindi' ? selectedTemplate.name : selectedTemplate.nameEn}
                    </h2>
                    <p className="text-gray-600">{selectedTemplate.description}</p>
                  </div>
                  <Button
                    variant="ghost"
                    onClick={() => setShowGenerateModal(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </Button>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-lg mb-4">{language === 'hindi' ? 'रिपोर्ट कॉन्फ़िगरेशन' : 'Report Configuration'}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {language === 'hindi' ? 'समय अवधि' : 'Time Period'}
                        </label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                          <option value="today">{language === 'hindi' ? 'आज' : 'Today'}</option>
                          <option value="week">{language === 'hindi' ? 'इस सप्ताह' : 'This Week'}</option>
                          <option value="month">{language === 'hindi' ? 'इस महीने' : 'This Month'}</option>
                          <option value="quarter">{language === 'hindi' ? 'इस तिमाही' : 'This Quarter'}</option>
                          <option value="year">{language === 'hindi' ? 'इस वर्ष' : 'This Year'}</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {language === 'hindi' ? 'फॉर्मेट' : 'Format'}
                        </label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                          <option value="pdf">PDF</option>
                          <option value="excel">Excel</option>
                          <option value="csv">CSV</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-3">
                    <Button
                      variant="outline"
                      onClick={() => setShowGenerateModal(false)}
                    >
                      {language === 'hindi' ? 'रद्द करें' : 'Cancel'}
                    </Button>
                    <Button
                      onClick={() => {
                        handleDownloadReport(selectedTemplate);
                        setShowGenerateModal(false);
                      }}
                      className="bg-gradient-to-r from-orange-500 to-red-500 text-white"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      {language === 'hindi' ? 'रिपोर्ट जनरेट करें' : 'Generate Report'}
                    </Button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
      </div>
    </AdminLayout>
  );
}