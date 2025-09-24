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
  MapPin, 
  Camera,
  Upload, 
  RefreshCw,
  Activity,
  TrendingUp
} from 'lucide-react';
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
  estimated_completion?: string;
  completion_notes?: string;
}

interface WorkerStats {
  total_assigned: number;
  total_completed: number;
  efficiency_rating: number;
  current_status: string;
  active_assignments: number;
}

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

const EnhancedFieldWorkerDashboard: React.FC = () => {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [workerStats, setWorkerStats] = useState<WorkerStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('assigned');
  const [selectedProblem, setSelectedProblem] = useState<Problem | null>(null);
  const [completionNotes, setCompletionNotes] = useState('');
  const [completionImage, setCompletionImage] = useState<File | null>(null);

  useEffect(() => {
    loadWorkerData();
  }, []);

  const loadWorkerData = async () => {
    try {
      setLoading(true);
      
      const [problemsData, workersData] = await Promise.all([
        api.getAllProblems(),
        api.getWorkerAnalytics()
      ]);

      setProblems(problemsData.problems || []);
      
      // Find current worker's stats
      const currentWorker = workersData.workers?.find((w: any) => w.id === 1); // This should come from user context
      if (currentWorker) {
        setWorkerStats({
          total_assigned: currentWorker.total_assigned || 0,
          total_completed: currentWorker.total_completed || 0,
          efficiency_rating: currentWorker.efficiency_rating || 0,
          current_status: currentWorker.current_status || 'available',
          active_assignments: currentWorker.active_assignments || 0
        });
      }

    } catch (error) {
      console.error('Error loading worker data:', error);
      toast.error('Failed to load worker data');
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

  const handleStartWork = async (problemId: number) => {
    try {
      await api.updateProblem(problemId.toString(), {
        status: 'in-progress',
        notes: 'Work started by field worker'
      });
      
      toast.success('Work started successfully');
      loadWorkerData();
    } catch (error) {
      console.error('Error starting work:', error);
      toast.error('Failed to start work');
    }
  };

  const handleCompleteWork = async () => {
    if (!selectedProblem) return;

    if (!completionImage) {
      toast.error('Please upload a completion photo');
      return;
    }

    try {
      await api.completeProblem(selectedProblem.id.toString(), {
        completion_notes: completionNotes
      }, completionImage);
      
      toast.success('Work completed successfully');
      setSelectedProblem(null);
      setCompletionNotes('');
      setCompletionImage(null);
      loadWorkerData();
    } catch (error) {
      console.error('Error completing work:', error);
      toast.error('Failed to complete work');
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setCompletionImage(file);
    }
  };

  const updateWorkerStatus = async (status: string) => {
    try {
      await api.updateWorkerStatus('1', { // This should come from user context
        current_status: status
      });
      
      toast.success('Status updated successfully');
      loadWorkerData();
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
    }
  };

  const assignedProblems = problems.filter(p => p.status === 'in-progress' || p.assigned_worker_name);
  const completedProblems = problems.filter(p => p.status === 'completed');

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
          <h1 className="text-3xl font-bold text-gray-900">Field Worker Dashboard</h1>
          <p className="text-gray-600">Manage your assigned tasks and track progress</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button onClick={loadWorkerData} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <select
            className="px-3 py-2 border rounded-md"
            value={workerStats?.current_status || 'available'}
            onChange={(e) => updateWorkerStatus(e.target.value)}
          >
            <option value="available">Available</option>
            <option value="busy">Busy</option>
            <option value="offline">Offline</option>
          </select>
                  </div>
                  </div>

      {/* Worker Stats */}
      {workerStats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Assigned</p>
                  <p className="text-2xl font-bold text-blue-600">{workerStats.total_assigned}</p>
                  </div>
                <Activity className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Completed</p>
                  <p className="text-2xl font-bold text-green-600">{workerStats.total_completed}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Efficiency Rating</p>
                  <p className="text-2xl font-bold text-purple-600">{workerStats.efficiency_rating.toFixed(1)}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Tasks</p>
                  <p className="text-2xl font-bold text-orange-600">{workerStats.active_assignments}</p>
                </div>
                <Clock className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
          </div>
      )}

      {/* Progress Bar */}
      {workerStats && workerStats.total_assigned > 0 && (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Completion Rate</span>
              <span className="text-sm font-medium text-gray-900">
                {((workerStats.total_completed / workerStats.total_assigned) * 100).toFixed(1)}%
              </span>
                          </div>
            <Progress 
              value={(workerStats.total_completed / workerStats.total_assigned) * 100} 
              className="h-2"
            />
          </CardContent>
        </Card>
      )}

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="assigned">Assigned Tasks</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="map">Map View</TabsTrigger>
        </TabsList>

        {/* Assigned Tasks Tab */}
        <TabsContent value="assigned" className="space-y-6">
          <div className="space-y-4">
            {assignedProblems.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No Assigned Tasks</h3>
                  <p className="text-gray-600">You don't have any assigned tasks at the moment.</p>
                </CardContent>
              </Card>
            ) : (
              assignedProblems.map((problem) => (
                <Card key={problem.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="font-semibold">Task #{problem.id}</h3>
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
                        <p className="text-sm text-gray-500 mb-2">
                          <strong>Reporter:</strong> {problem.user_name}
                        </p>
                        <p className="text-sm text-gray-500 mb-2">
                          <strong>Location:</strong> {formatCoordinate(problem.latitude)}, {formatCoordinate(problem.longitude)}
                        </p>
                        {problem.estimated_completion && (
                          <p className="text-sm text-gray-500">
                            <strong>Due Date:</strong> {new Date(problem.estimated_completion).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                              </div>
                              
                    <div className="flex items-center space-x-2">
                      {problem.status === 'not completed' && (
                                  <Button
                          onClick={() => handleStartWork(problem.id)}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          Start Work
                                  </Button>
                      )}
                      
                      {problem.status === 'in-progress' && (
                                <Button
                          onClick={() => setSelectedProblem(problem)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          Complete Work
                        </Button>
                      )}

                      <Button variant="outline" size="sm">
                        <MapPin className="h-4 w-4 mr-2" />
                        View Location
                                </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        {/* Completed Tasks Tab */}
        <TabsContent value="completed" className="space-y-6">
          <div className="space-y-4">
            {completedProblems.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <CheckCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No Completed Tasks</h3>
                  <p className="text-gray-600">You haven't completed any tasks yet.</p>
                </CardContent>
              </Card>
            ) : (
              completedProblems.map((problem) => (
                <Card key={problem.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="font-semibold">Task #{problem.id}</h3>
                          <Badge className={getStatusColor(problem.status)}>
                            {problem.status}
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
                        {problem.completion_notes && (
                          <p className="text-gray-600 mb-2">
                            <strong>Completion Notes:</strong> {problem.completion_notes}
                          </p>
                        )}
                        <p className="text-sm text-gray-500">
                          <strong>Completed:</strong> {new Date(problem.updated_at).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        {/* Map View Tab */}
        <TabsContent value="map" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapPin className="h-5 w-5 mr-2" />
                Task Locations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-96 bg-gray-100 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Map view would be implemented here</p>
                  <p className="text-sm text-gray-500">
                    {assignedProblems.length} active tasks, {completedProblems.length} completed
                  </p>
                          </div>
                        </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Completion Modal */}
      {selectedProblem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4">
            <CardHeader>
              <CardTitle>Complete Task #{selectedProblem.id}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Completion Notes
                </label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  value={completionNotes}
                  onChange={(e) => setCompletionNotes(e.target.value)}
                  placeholder="Describe what was done to resolve the issue..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Completion Photo
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                  <Camera className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="completion-image"
                  />
                  <label
                    htmlFor="completion-image"
                    className="cursor-pointer text-blue-600 hover:text-blue-800"
                  >
                    {completionImage ? completionImage.name : 'Click to upload photo'}
                  </label>
                      </div>
                    </div>
                    
              <div className="flex space-x-2">
                <Button
                  onClick={handleCompleteWork}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                  disabled={!completionImage}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Complete Task
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedProblem(null);
                    setCompletionNotes('');
                    setCompletionImage(null);
                  }}
                >
                  Cancel
                </Button>
                      </div>
                  </CardContent>
                </Card>
        </div>
      )}
    </div>
  );
};

export default EnhancedFieldWorkerDashboard;