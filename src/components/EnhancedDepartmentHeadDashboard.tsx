import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Users, 
  TrendingUp,
  MapPin,
  Filter,
  RefreshCw
} from 'lucide-react';
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
  Cell
} from 'recharts';
import { api } from '../utils/api';
import { toast } from 'sonner';

interface Problem {
  id: number;
  problem_categories: string[];
  others_text?: string;
  status: string;
  priority: string;
  created_at: string;
  updated_at: string;
  user_name: string;
  user_email: string;
  assigned_worker_name?: string;
  assigned_department?: string;
  latitude: number | string;
  longitude: number | string;
}

interface Worker {
  id: number;
  name: string;
  department: string;
  total_assigned: number;
  total_completed: number;
  efficiency_rating: number;
  current_status: string;
  active_assignments: number;
}

interface AnalyticsData {
  totalComplaints: number;
  pendingComplaints: number;
  inProgressComplaints: number;
  completedComplaints: number;
  avgResolutionDays: number;
  categoryBreakdown: Record<string, number>;
  recentComplaints: Problem[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

// Helper function to safely format coordinates
const formatCoordinate = (coord: any, decimals: number = 6): string => {
  if (typeof coord === 'number' && !isNaN(coord)) {
    return coord.toFixed(decimals);
  }
  if (typeof coord === 'string') {
    const num = parseFloat(coord);
    return isNaN(num) ? coord : num.toFixed(decimals);
  }
  return String(coord || 'N/A');
};

const EnhancedDepartmentHeadDashboard: React.FC = () => {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      const [problemsData, workersData, analyticsData] = await Promise.all([
        api.getAllProblems(),
        api.getWorkerAnalytics(),
        api.getDashboardAnalytics()
      ]);

      setProblems(problemsData.problems || []);
      setWorkers(workersData.workers || []);
      setAnalytics(analyticsData);

    } catch (error) {
      console.error('Error loading dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'in-progress': return 'text-blue-600 bg-blue-100';
      case 'not completed': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getWorkerStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'text-green-600 bg-green-100';
      case 'busy': return 'text-yellow-600 bg-yellow-100';
      case 'offline': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const filteredProblems = problems.filter(problem => {
    if (filterStatus === 'all') return true;
    return problem.status === filterStatus;
  });

  const handleAssignWorker = async (problemId: number, workerId: number) => {
    try {
      await api.assignWorker(problemId.toString(), {
        worker_id: workerId.toString(),
        department: 'सफाई विभाग', // This should come from user context
        estimated_completion: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      });
      
      toast.success('Worker assigned successfully');
      loadDashboardData();
    } catch (error) {
      console.error('Error assigning worker:', error);
      toast.error('Failed to assign worker');
    }
  };

  const handleUpdateStatus = async (problemId: number, status: string) => {
    try {
      await api.updateProblem(problemId.toString(), {
        status,
        notes: `Status updated to ${status}`
      });
      
      toast.success('Status updated successfully');
      loadDashboardData();
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Department Head Dashboard</h1>
          <p className="text-gray-600">Manage your department's complaints and workers</p>
        </div>
        <Button onClick={loadDashboardData} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Key Metrics */}
      {analytics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Complaints</p>
                  <p className="text-2xl font-bold text-gray-900">{analytics.totalComplaints}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending</p>
                  <p className="text-2xl font-bold text-red-600">{analytics.pendingComplaints}</p>
                </div>
                <Clock className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">In Progress</p>
                  <p className="text-2xl font-bold text-yellow-600">{analytics.inProgressComplaints}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Completed</p>
                  <p className="text-2xl font-bold text-green-600">{analytics.completedComplaints}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="problems">Problems</TabsTrigger>
          <TabsTrigger value="workers">Workers</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Category Breakdown */}
            {analytics && (
              <Card>
                <CardHeader>
                  <CardTitle>Problem Categories</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={Object.entries(analytics.categoryBreakdown).map(([name, value]) => ({
                          name,
                          value
                        }))}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {Object.entries(analytics.categoryBreakdown).map((_, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            )}

            {/* Worker Status */}
            <Card>
              <CardHeader>
                <CardTitle>Worker Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {workers.slice(0, 5).map((worker) => (
                    <div key={worker.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{worker.name}</p>
                        <p className="text-sm text-gray-600">
                          {worker.total_completed}/{worker.total_assigned} completed
                        </p>
                      </div>
                      <Badge className={getWorkerStatusColor(worker.current_status)}>
                        {worker.current_status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Problems Tab */}
        <TabsContent value="problems" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-4">
                <Filter className="h-5 w-5 text-gray-500" />
                <div className="flex space-x-2">
                  <Button
                    variant={filterStatus === 'all' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilterStatus('all')}
                  >
                    All ({problems.length})
                  </Button>
                  <Button
                    variant={filterStatus === 'not completed' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilterStatus('not completed')}
                  >
                    Pending ({problems.filter(p => p.status === 'not completed').length})
                  </Button>
                  <Button
                    variant={filterStatus === 'in-progress' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilterStatus('in-progress')}
                  >
                    In Progress ({problems.filter(p => p.status === 'in-progress').length})
                  </Button>
                  <Button
                    variant={filterStatus === 'completed' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilterStatus('completed')}
                  >
                    Completed ({problems.filter(p => p.status === 'completed').length})
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Problems List */}
          <div className="space-y-4">
            {filteredProblems.map((problem) => (
              <Card key={problem.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-semibold">Complaint #{problem.id}</h3>
                        <Badge className={getStatusColor(problem.status)}>
                          {problem.status}
                        </Badge>
                        <Badge className={getPriorityColor(problem.priority)}>
                          {problem.priority}
                        </Badge>
                      </div>
                      <p className="text-gray-600 mb-2">
                        <strong>Categories:</strong> {problem.problem_categories.join(', ')}
                      </p>
                      {problem.others_text && (
                        <p className="text-gray-600 mb-2">
                          <strong>Description:</strong> {problem.others_text}
                        </p>
                      )}
                      <p className="text-sm text-gray-500">
                        <strong>Reporter:</strong> {problem.user_name} ({problem.user_email})
                      </p>
                      <p className="text-sm text-gray-500">
                        <strong>Location:</strong> {formatCoordinate(problem.latitude)}, {formatCoordinate(problem.longitude)}
                      </p>
                      <p className="text-sm text-gray-500">
                        <strong>Created:</strong> {new Date(problem.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    {problem.status === 'not completed' && (
                      <>
                        <Button
                          size="sm"
                          onClick={() => handleUpdateStatus(problem.id, 'in-progress')}
                        >
                          Start Work
                        </Button>
                        <select
                          className="px-3 py-1 border rounded-md text-sm"
                          onChange={(e) => {
                            if (e.target.value) {
                              handleAssignWorker(problem.id, parseInt(e.target.value));
                            }
                          }}
                        >
                          <option value="">Assign Worker</option>
                          {workers
                            .filter(w => w.current_status === 'available')
                            .map(worker => (
                              <option key={worker.id} value={worker.id}>
                                {worker.name} (Rating: {worker.efficiency_rating.toFixed(1)})
                              </option>
                            ))}
                        </select>
                      </>
                    )}
                    
                    {problem.status === 'in-progress' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleUpdateStatus(problem.id, 'completed')}
                      >
                        Mark Complete
                      </Button>
                    )}

                    {problem.assigned_worker_name && (
                      <Badge variant="outline">
                        Assigned to: {problem.assigned_worker_name}
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Workers Tab */}
        <TabsContent value="workers" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="h-5 w-5 mr-2" />
                Department Workers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {workers.map((worker) => (
                  <div key={worker.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="font-semibold">{worker.name}</h3>
                        <p className="text-sm text-gray-600">{worker.department}</p>
                      </div>
                      <Badge className={getWorkerStatusColor(worker.current_status)}>
                        {worker.current_status}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center">
                        <p className="text-lg font-bold text-blue-600">{worker.total_assigned}</p>
                        <p className="text-sm text-gray-600">Assigned</p>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-bold text-green-600">{worker.total_completed}</p>
                        <p className="text-sm text-gray-600">Completed</p>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-bold text-purple-600">{worker.efficiency_rating.toFixed(1)}</p>
                        <p className="text-sm text-gray-600">Rating</p>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-bold text-orange-600">{worker.active_assignments}</p>
                        <p className="text-sm text-gray-600">Active</p>
                      </div>
                    </div>

                    <div className="mt-3">
                      <div className="flex justify-between text-sm text-gray-600 mb-1">
                        <span>Completion Rate</span>
                        <span>
                          {worker.total_assigned > 0 
                            ? ((worker.total_completed / worker.total_assigned) * 100).toFixed(1)
                            : 0}%
                        </span>
                      </div>
                      <Progress 
                        value={worker.total_assigned > 0 ? (worker.total_completed / worker.total_assigned) * 100 : 0} 
                        className="h-2"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EnhancedDepartmentHeadDashboard;
