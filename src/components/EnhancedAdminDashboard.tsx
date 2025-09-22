import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  Filter, 
  Brain, 
  TrendingUp, 
  Users, 
  AlertTriangle, 
  CheckCircle,
  Clock,
  MapPin,
  Eye,
  UserPlus,
  Settings,
  BarChart3,
  Sparkles
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { api } from '../utils/api';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ScrollArea } from './ui/scroll-area';
import { toast } from 'sonner@2.0.3';
import { apiClient } from '../utils/api';

interface Complaint {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: string;
  status: string;
  location: string;
  imageUrl?: string;
  createdAt: string;
  assignedWorker?: string;
  citizen: {
    name: string;
    phone: string;
  };
}

interface Analytics {
  totalComplaints: number;
  pendingComplaints: number;
  inProgressComplaints: number;
  completedComplaints: number;
  categoryBreakdown: { [key: string]: number };
  recentComplaints: Complaint[];
}

interface Department {
  id: string;
  name: string;
  description: string;
  relevanceScore?: number;
}

const statusColors = {
  pending: 'bg-red-100 text-red-800 border-red-200',
  in_progress: 'bg-orange-100 text-orange-800 border-orange-200',
  completed: 'bg-green-100 text-green-800 border-green-200'
};

const priorityColors = {
  low: 'bg-blue-100 text-blue-800 border-blue-200',
  medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  high: 'bg-red-100 text-red-800 border-red-200'
};

export function EnhancedAdminDashboard() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [departmentSearch, setDepartmentSearch] = useState('');
  const [departmentResults, setDepartmentResults] = useState<Department[]>([]);
  const [isSearchingDepartments, setIsSearchingDepartments] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Set a timeout for loading to prevent indefinite loading states
    const loadTimeout = setTimeout(() => {
      if (isLoading) {
        console.warn('Dashboard loading timeout, using fallback data');
        setComplaints([]);
        setAnalytics({
          totalComplaints: 0,
          pendingComplaints: 0,
          inProgressComplaints: 0,
          completedComplaints: 0,
          categoryBreakdown: {},
          recentComplaints: []
        });
        setIsLoading(false);
        toast.info('Using demo mode - full features available in production');
      }
    }, 3000); // 3 second timeout

    loadData();

    return () => clearTimeout(loadTimeout);
  }, [isLoading]);

  // AI-powered department search
  useEffect(() => {
    const isProd = window.location.hostname !== 'localhost' && 
                   !window.location.hostname.includes('figma') &&
                   !window.location.hostname.includes('preview');

    const searchDepartments = async () => {
      if (departmentSearch.length > 2) {
        setIsSearchingDepartments(true);
        try {
          if (isProd) {
            const results = await apiClient.searchDepartments(departmentSearch);
            setDepartmentResults(results.departments);
          } else {
            // Mock search results for development/preview
            const mockDepartments = [
              { id: 'kmc', name: 'Kanpur Municipal Corporation', description: 'Waste management, sanitation, public amenities', relevanceScore: 90 },
              { id: 'traffic', name: 'Traffic Police Department', description: 'Traffic management, road safety', relevanceScore: 75 },
              { id: 'pollution', name: 'Pollution Control Board', description: 'Air quality, water pollution control', relevanceScore: 60 }
            ].filter(dept => dept.name.toLowerCase().includes(departmentSearch.toLowerCase()));
            
            setDepartmentResults(mockDepartments);
          }
        } catch (error) {
          console.error('Department search error:', error);
          // Fallback to mock data
          setDepartmentResults([
            { id: 'kmc', name: 'Kanpur Municipal Corporation', description: 'Mock department for demo', relevanceScore: 50 }
          ]);
        } finally {
          setIsSearchingDepartments(false);
        }
      } else {
        setDepartmentResults([]);
      }
    };

    const debounce = setTimeout(searchDepartments, 500);
    return () => clearTimeout(debounce);
  }, [departmentSearch]);

  const loadData = async () => {
    try {
      // Always try to load real data from backend
      try {
        const [complaintsData, analyticsData] = await Promise.all([
          api.getAllProblems(),
          api.getDashboardAnalytics()
        ]);
        
        // Convert backend problems to frontend complaint format
        const formattedComplaints = complaintsData.problems.map(problem => ({
          id: problem.id,
          title: problem.problem_categories[0] || 'General Issue',
          description: problem.others_text || 'No description',
          category: problem.problem_categories[0] || 'Other Issues',
          priority: problem.priority,
          status: problem.status === 'not completed' ? 'pending' : 
                  problem.status === 'in-progress' ? 'in_progress' : 'completed',
          location: `${problem.latitude}, ${problem.longitude}`,
          createdAt: problem.created_at,
          citizen: { 
            name: problem.user_name || 'Unknown', 
            phone: problem.user_email || 'N/A' 
          }
        }));
        
        setComplaints(formattedComplaints);
        setAnalytics(analyticsData);
        
      } catch (apiError) {
        console.warn('Failed to load real data, using mock data:', apiError);
        
        // Fallback to mock data if API fails
        const mockComplaints = [
          {
            id: 'demo-1',
            title: 'Mall Road पर कचरा समस्या',
            description: 'Mall Road पर कचरा जमा हो गया है',
            category: 'Garbage & Waste',
            priority: 'high',
            status: 'pending',
            location: 'Mall Road, Kanpur',
            createdAt: new Date().toISOString(),
            citizen: { name: 'रमेश कुमार', phone: '+91 9876543210' }
          },
          {
            id: 'demo-2',
            title: 'Civil Lines में सड़क की समस्या',
            description: 'सड़क में गड्ढे हैं',
            category: 'Traffic & Roads',
            priority: 'medium',
            status: 'in_progress',
            location: 'Civil Lines, Kanpur',
            createdAt: new Date().toISOString(),
            citizen: { name: 'सुनीता देवी', phone: '+91 9876543211' }
          }
        ];
        
        const mockAnalytics = {
          totalComplaints: 6,
          pendingComplaints: 3,
          inProgressComplaints: 2,
          completedComplaints: 1,
          avgResolutionDays: 3.2,
          categoryBreakdown: {
            'Garbage & Waste': 2,
            'Traffic & Roads': 2,
            'Other Issues': 2
          },
          recentComplaints: mockComplaints.map(c => ({
            id: c.id,
            user_id: '1',
            problem_categories: [c.category],
            others_text: c.description,
            user_image_base64: '',
            user_image_mimetype: 'image/jpeg',
            latitude: 26.4499,
            longitude: 80.3319,
            status: c.status === 'pending' ? 'not completed' : c.status,
            priority: c.priority,
            created_at: c.createdAt,
            updated_at: c.createdAt,
            user_name: c.citizen.name,
            user_email: c.citizen.phone
          }))
        };
        
        setComplaints(mockComplaints);
        setAnalytics(mockAnalytics);
      }
    } catch (error) {
      console.error('Data loading error:', error);
      // Provide fallback mock data
      setComplaints([]);
      setAnalytics({
        totalComplaints: 0,
        pendingComplaints: 0,
        inProgressComplaints: 0,
        completedComplaints: 0,
        categoryBreakdown: {},
        recentComplaints: []
      });
      toast.error('Using demo data - backend connection failed');
    } finally {
      setIsLoading(false);
    }
  };

  const updateComplaintStatus = async (complaintId: string, newStatus: string, assignedWorker?: string) => {
    try {
      await apiClient.updateComplaintStatus(complaintId, newStatus, assignedWorker);
      await loadData(); // Refresh data
      toast.success('Complaint status updated successfully');
    } catch (error) {
      console.error('Status update error:', error);
      toast.error('Failed to update complaint status');
    }
  };

  const filteredComplaints = complaints.filter(complaint => {
    const matchesSearch = complaint.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         complaint.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         complaint.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || complaint.status === filterStatus;
    const matchesCategory = filterCategory === 'all' || complaint.category === filterCategory;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const categories = Array.from(new Set(complaints.map(c => c.category)));

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-green-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full mx-auto mb-4"
          />
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-green-50 p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto space-y-6"
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Brain className="w-8 h-8 text-orange-600" />
              AI-Enhanced Admin Dashboard
            </h1>
            <p className="text-gray-600 mt-1">Real-time civic complaint management with AI insights</p>
          </div>
          
          <div className="flex items-center gap-3">
            <Button variant="outline" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Settings
            </Button>
            <Button className="bg-gradient-to-r from-orange-500 to-green-600 hover:from-orange-600 hover:to-green-700">
              <UserPlus className="w-4 h-4 mr-2" />
              Add Worker
            </Button>
          </div>
        </div>

        {/* Analytics Cards */}
        {analytics && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-4 gap-6"
          >
            <Card className="border-2 border-orange-200 hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Complaints</p>
                    <p className="text-2xl font-bold text-gray-900">{analytics.totalComplaints}</p>
                  </div>
                  <BarChart3 className="w-8 h-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-red-200 hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Pending</p>
                    <p className="text-2xl font-bold text-red-600">{analytics.pendingComplaints}</p>
                  </div>
                  <AlertTriangle className="w-8 h-8 text-red-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-yellow-200 hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">In Progress</p>
                    <p className="text-2xl font-bold text-yellow-600">{analytics.inProgressComplaints}</p>
                  </div>
                  <Clock className="w-8 h-8 text-yellow-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-green-200 hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Completed</p>
                    <p className="text-2xl font-bold text-green-600">{analytics.completedComplaints}</p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        <Tabs defaultValue="complaints" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="complaints">Complaints Management</TabsTrigger>
            <TabsTrigger value="departments">AI Department Search</TabsTrigger>
            <TabsTrigger value="analytics">Advanced Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="complaints" className="space-y-6">
            {/* Search and Filters */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="border-2 border-gray-200">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row gap-4">
                    <div className="flex-1">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                          placeholder="Search complaints by title, description, or location..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-10 border-2 border-gray-200 focus:border-orange-400"
                        />
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="px-3 py-2 border-2 border-gray-200 rounded-md focus:border-orange-400"
                      >
                        <option value="all">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="in_progress">In Progress</option>
                        <option value="completed">Completed</option>
                      </select>
                      
                      <select
                        value={filterCategory}
                        onChange={(e) => setFilterCategory(e.target.value)}
                        className="px-3 py-2 border-2 border-gray-200 rounded-md focus:border-orange-400"
                      >
                        <option value="all">All Categories</option>
                        {categories.map(category => (
                          <option key={category} value={category}>{category}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Complaints List */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="border-2 border-gray-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Filter className="w-5 h-5" />
                    Complaints ({filteredComplaints.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[600px]">
                    <div className="space-y-4">
                      <AnimatePresence>
                        {filteredComplaints.map((complaint, index) => (
                          <motion.div
                            key={complaint.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ delay: index * 0.05 }}
                            className="border-2 border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                            onClick={() => setSelectedComplaint(complaint)}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                  <h3 className="font-semibold text-gray-900">{complaint.title}</h3>
                                  <Badge className={statusColors[complaint.status as keyof typeof statusColors]}>
                                    {complaint.status.replace('_', ' ').toUpperCase()}
                                  </Badge>
                                  <Badge className={priorityColors[complaint.priority as keyof typeof priorityColors]}>
                                    {complaint.priority.toUpperCase()}
                                  </Badge>
                                </div>
                                
                                <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                                  {complaint.description}
                                </p>
                                
                                <div className="flex items-center gap-4 text-sm text-gray-500">
                                  <span className="flex items-center gap-1">
                                    <MapPin className="w-3 h-3" />
                                    {complaint.location}
                                  </span>
                                  <span>{new Date(complaint.createdAt).toLocaleDateString()}</span>
                                  <span className="font-medium">{complaint.category}</span>
                                </div>
                              </div>
                              
                              <div className="flex items-center gap-2">
                                {complaint.imageUrl && (
                                  <img
                                    src={complaint.imageUrl}
                                    alt="Complaint"
                                    className="w-16 h-16 object-cover rounded-lg border"
                                  />
                                )}
                                <Button variant="outline" size="sm">
                                  <Eye className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                            
                            {complaint.status === 'pending' && (
                              <div className="flex gap-2 mt-3 pt-3 border-t">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    updateComplaintStatus(complaint.id, 'in_progress');
                                  }}
                                >
                                  Start Work
                                </Button>
                                <Button
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    updateComplaintStatus(complaint.id, 'completed');
                                  }}
                                  className="bg-green-600 hover:bg-green-700"
                                >
                                  Mark Complete
                                </Button>
                              </div>
                            )}
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="departments" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="border-2 border-blue-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-blue-600" />
                    AI-Powered Department Search
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      placeholder="Search for departments by function, keywords, or problem type..."
                      value={departmentSearch}
                      onChange={(e) => setDepartmentSearch(e.target.value)}
                      className="pl-10 border-2 border-blue-200 focus:border-blue-400"
                    />
                    {isSearchingDepartments && (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full"
                      />
                    )}
                  </div>
                  
                  <AnimatePresence>
                    {departmentResults.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-3"
                      >
                        {departmentResults.map((dept, index) => (
                          <motion.div
                            key={dept.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="border-2 border-blue-100 rounded-lg p-4 hover:bg-blue-50 cursor-pointer"
                          >
                            <div className="flex items-start justify-between">
                              <div>
                                <h3 className="font-semibold text-blue-900">{dept.name}</h3>
                                <p className="text-sm text-blue-700 mt-1">{dept.description}</p>
                              </div>
                              {dept.relevanceScore && (
                                <Badge variant="outline" className="text-blue-600 border-blue-300">
                                  {Math.round(dept.relevanceScore)}% match
                                </Badge>
                              )}
                            </div>
                          </motion.div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                  
                  {departmentSearch.length > 2 && departmentResults.length === 0 && !isSearchingDepartments && (
                    <p className="text-gray-500 text-center py-4">
                      No departments found for "{departmentSearch}"
                    </p>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="analytics">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="border-2 border-purple-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-purple-600" />
                    Advanced Analytics Dashboard
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Category Breakdown */}
                    {analytics && (
                      <div className="space-y-4">
                        <h3 className="font-semibold text-gray-900">Category Breakdown</h3>
                        {Object.entries(analytics.categoryBreakdown).map(([category, count]) => (
                          <div key={category} className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">{category}</span>
                            <div className="flex items-center gap-2">
                              <div className="w-32 h-2 bg-gray-200 rounded-full">
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: `${(count / analytics.totalComplaints) * 100}%` }}
                                  transition={{ duration: 1, delay: 0.2 }}
                                  className="h-full bg-gradient-to-r from-orange-500 to-green-600 rounded-full"
                                />
                              </div>
                              <span className="text-sm font-medium w-8">{count}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {/* Recent Activity */}
                    <div className="space-y-4">
                      <h3 className="font-semibold text-gray-900">Recent Activity</h3>
                      <ScrollArea className="h-64">
                        <div className="space-y-3">
                          {analytics?.recentComplaints.map((complaint, index) => (
                            <motion.div
                              key={complaint.id}
                              initial={{ opacity: 0, x: 20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.1 }}
                              className="flex items-center gap-3 p-2 rounded-lg border border-gray-200"
                            >
                              <div className="w-2 h-2 bg-orange-500 rounded-full" />
                              <div className="flex-1">
                                <p className="text-sm font-medium text-gray-900">{complaint.title}</p>
                                <p className="text-xs text-gray-500">{complaint.category}</p>
                              </div>
                              <Badge className={statusColors[complaint.status as keyof typeof statusColors]} size="sm">
                                {complaint.status}
                              </Badge>
                            </motion.div>
                          ))}
                        </div>
                      </ScrollArea>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}