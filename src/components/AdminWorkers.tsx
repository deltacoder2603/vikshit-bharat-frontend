import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { 
  Users, 
  UserCheck, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar,
  Award,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertTriangle,
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Building,
  Star,
  Target,
  Timer,
  FileText,
  Camera,
  ArrowLeft
} from 'lucide-react';
import { User, Report } from '../App';
import AdminLayout from './AdminLayout';
import { getTranslations, Language } from '../utils/translations';
import { api } from '../utils/api';

interface AdminWorkersProps {
  user: User;
  reports: Report[];
  allUsers: User[];
  onNavigate: (page: string) => void;
  onLogout: () => void;
  onUpdateReport: (reportId: string, updates: Partial<Report>) => void;
  language?: Language;
  onLanguageChange?: (language: Language) => void;
}

interface Worker {
  id: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  role: string;
  avatar: string;
  joinDate: string;
  assignedComplaints: number;
  completedComplaints: number;
  pendingComplaints: number;
  avgResolutionTime: string;
  rating: number;
  location: string;
  status: 'active' | 'busy' | 'offline' | 'leave';
  lastActive: string;
  efficiency: number;
  todayTasks: number;
  specializations: string[];
  workHistory: Array<{
    complaintId: string;
    title: string;
    completedAt: Date;
    rating: number;
  }>;
}

export default function AdminWorkers({ 
  user, 
  reports, 
  allUsers, 
  onNavigate, 
  onLogout,
  onUpdateReport,
  language = 'hindi',
  onLanguageChange
}: AdminWorkersProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedWorker, setSelectedWorker] = useState<Worker | null>(null);
  const [showAddWorker, setShowAddWorker] = useState(false);
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const t = getTranslations(language);

  // Load real workers data from backend
  React.useEffect(() => {
    const loadWorkersData = async () => {
      try {
        console.log('🔄 Loading workers data...');
        const [workersResponse, analyticsResponse] = await Promise.all([
          api.getAllWorkers(),
          api.getWorkerAnalytics()
        ]);
        
        console.log('📊 Workers API response:', workersResponse);
        console.log('📈 Worker analytics response:', analyticsResponse);
        
        const backendWorkers = workersResponse.workers || [];
        const analyticsWorkers = analyticsResponse.workers || [];
        
        // Convert backend workers to frontend format
        const formattedWorkers: Worker[] = backendWorkers.map((worker, index) => {
          console.log(`🔄 Converting worker ${index + 1}:`, worker.name);
          
          // Find analytics data for this worker
          const analytics = analyticsWorkers.find(w => w.id === worker.id) || {};
          
          return {
            id: String(worker.id),
            name: worker.name,
            email: worker.email,
            phone: worker.phone_number,
            department: worker.department || 'General',
            role: worker.role === 'field-worker' ? 'Field Worker' : worker.role,
            avatar: worker.avatar_url || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
            joinDate: new Date(worker.created_at).toLocaleDateString('hi-IN'),
            assignedComplaints: worker.total_assigned || 0,
            completedComplaints: worker.total_completed || 0,
            pendingComplaints: (worker.total_assigned || 0) - (worker.total_completed || 0),
            avgResolutionTime: worker.avg_completion_time ? `${worker.avg_completion_time} hours` : 'N/A',
            rating: parseFloat(worker.efficiency_rating) || 0,
            location: worker.location_lat && worker.location_lng ? 
              `${worker.location_lat}, ${worker.location_lng}` : 'Location not set',
            status: worker.current_status === 'available' ? 'active' : 
                   worker.current_status === 'busy' ? 'busy' : 'offline',
            lastActive: new Date(worker.last_active || worker.updated_at).toLocaleDateString('hi-IN'),
            efficiency: Math.round(worker.total_assigned > 0 ? 
              (worker.total_completed / worker.total_assigned) * 100 : 0),
            todayTasks: parseInt(analytics.active_assignments) || 0,
            specializations: worker.specializations || ['General Work'],
            workHistory: [] // This would need to be fetched separately if needed
          };
        });
        
        console.log('✅ Converted workers:', formattedWorkers);
        setWorkers(formattedWorkers);
        setIsLoading(false);
        
        if (formattedWorkers.length === 0) {
          console.warn('⚠️ No workers found, using fallback mock data');
          // Fallback to mock data if no real workers
          setWorkers([
            {
              id: 'worker-1',
              name: 'विकास शर्मा',
              email: 'vikas@kanpur.gov.in',
              phone: '+91 9876543211',
              department: 'सफाई विभाग / Sanitation Dept',
              role: 'सीनियर सफाई कर्मी',
              avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
              joinDate: '15 जनवरी 2020',
              assignedComplaints: 45,
              completedComplaints: 38,
              pendingComplaints: 7,
              avgResolutionTime: '2.3 दिन',
              rating: 4.5,
              location: 'मॉल रोड एरिया',
              status: 'active' as const,
              lastActive: '5 मिनट पहले',
              efficiency: 85,
              todayTasks: 3,
              specializations: ['गार्बेज कलेक्शन', 'सीवर क्लीनिंग', 'पब्लिक टॉयलेट'],
              workHistory: [
                { complaintId: 'C001', title: 'मॉल रोड कचरा साफाई', completedAt: new Date('2024-01-15'), rating: 5 },
                { complaintId: 'C002', title: 'सीवर ब्लॉकेज हटाना', completedAt: new Date('2024-01-14'), rating: 4 }
              ]
            }
          ]);
        }
      } catch (error) {
        console.error('❌ Failed to load workers data:', error);
        setIsLoading(false);
        // Use mock data as fallback
        setWorkers([
          {
            id: 'worker-1',
            name: 'विकास शर्मा',
            email: 'vikas@kanpur.gov.in',
            phone: '+91 9876543211',
            department: 'सफाई विभाग / Sanitation Dept',
            role: 'सीनियर सफाई कर्मी',
            avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
            joinDate: '15 जनवरी 2020',
            assignedComplaints: 45,
            completedComplaints: 38,
            pendingComplaints: 7,
            avgResolutionTime: '2.3 दिन',
            rating: 4.5,
            location: 'मॉल रोड एरिया',
            status: 'active' as const,
            lastActive: '5 मिनट पहले',
            efficiency: 85,
            todayTasks: 3,
            specializations: ['गार्बेज कलेक्शन', 'सीवर क्लीनिंग', 'पब्लिक टॉयलेट'],
            workHistory: [
              { complaintId: 'C001', title: 'मॉल रोड कचरा साफाई', completedAt: new Date('2024-01-15'), rating: 5 },
              { complaintId: 'C002', title: 'सीवर ब्लॉकेज हटाना', completedAt: new Date('2024-01-14'), rating: 4 }
            ]
          }
        ]);
      }
    };

    loadWorkersData();
  }, []);

  const filteredWorkers = workers.filter(worker => {
    const matchesSearch = worker.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         worker.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         worker.phone.includes(searchTerm);
    
    const matchesDepartment = selectedDepartment === 'all' || worker.department.includes(selectedDepartment);
    const matchesStatus = selectedStatus === 'all' || worker.status === selectedStatus;
    
    return matchesSearch && matchesDepartment && matchesStatus;
  });

  const totalWorkers = workers.length;
  const activeWorkers = workers.filter(w => w.status === 'active').length;
  const busyWorkers = workers.filter(w => w.status === 'busy').length;
  const avgRating = workers.reduce((sum, w) => sum + w.rating, 0) / workers.length;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'busy': return 'bg-yellow-100 text-yellow-800';
      case 'offline': return 'bg-gray-100 text-gray-800';
      case 'leave': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    if (language === 'hindi') {
      switch (status) {
        case 'active': return 'उपलब्ध';
        case 'busy': return 'व्यस्त';
        case 'offline': return 'ऑफलाइन';
        case 'leave': return 'छुट्टी पर';
        default: return 'अज्ञात';
      }
    } else {
      switch (status) {
        case 'active': return 'Available';
        case 'busy': return 'Busy';
        case 'offline': return 'Offline';
        case 'leave': return 'On Leave';
        default: return 'Unknown';
      }
    }
  };

  const getEfficiencyColor = (efficiency: number) => {
    if (efficiency >= 90) return 'text-green-600';
    if (efficiency >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const pendingCount = reports.filter(r => r.status === 'pending').length + 45;
  const urgentCount = 12;

  // Show loading state while data is being fetched
  if (isLoading) {
    return (
      <AdminLayout
        user={user}
        currentPage="admin-workers"
        onNavigate={onNavigate}
        onLogout={onLogout}
        pendingCount={pendingCount}
        urgentCount={urgentCount}
        language={language}
        onLanguageChange={onLanguageChange || (() => {})}
      >
        <div className="p-6 space-y-6 max-w-none overflow-hidden">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">
                {language === 'hindi' ? 'कर्मचारी डेटा लोड हो रहा है...' : 'Loading workers data...'}
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
      currentPage="admin-workers"
      onNavigate={onNavigate}
      onLogout={onLogout}
      pendingCount={pendingCount}
      urgentCount={urgentCount}
      language={language}
      onLanguageChange={onLanguageChange || (() => {})}
    >
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="mb-6">
          <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg p-6 border border-purple-200">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full">
                <Users className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {language === 'hindi' ? 'कर्मचारी प्रबंधन' : 'Worker Management'}
                </h1>
                <p className="text-gray-600">
                  {user.role === 'district-magistrate' 
                    ? (language === 'hindi' ? 'फील्ड वर्कर्स का प्रदर्शन ट्रैकिंग और प्रबंधन' : 'Field worker performance tracking and management')
                    : `${user.department} ${language === 'hindi' ? 'कर्मचारी प्रबंधन' : 'worker management'}`}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-blue-600 mb-1 truncate">
                    {language === 'hindi' ? 'कुल कर्मचारी' : 'Total Workers'}
                  </p>
                  <p className="text-3xl font-bold text-blue-700">{totalWorkers}</p>
                  <p className="text-xs text-blue-500 mt-1">
                    {language === 'hindi' ? 'सभी विभागों में' : 'Across departments'}
                  </p>
                </div>
                <Users className="h-12 w-12 text-blue-500 flex-shrink-0" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-green-600 mb-1 truncate">
                    {language === 'hindi' ? 'उपलब्ध' : 'Available'}
                  </p>
                  <p className="text-3xl font-bold text-green-700">{activeWorkers}</p>
                  <p className="text-xs text-green-500 mt-1">
                    {Math.round((activeWorkers / totalWorkers) * 100)}% {language === 'hindi' ? 'सक्रिय' : 'active'}
                  </p>
                </div>
                <CheckCircle className="h-12 w-12 text-green-500 flex-shrink-0" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200 hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-yellow-600 mb-1 truncate">
                    {language === 'hindi' ? 'व्यस्त' : 'Busy'}
                  </p>
                  <p className="text-3xl font-bold text-yellow-700">{busyWorkers}</p>
                  <p className="text-xs text-yellow-500 mt-1">
                    {language === 'hindi' ? 'कार्य में लगे' : 'At work'}
                  </p>
                </div>
                <Clock className="h-12 w-12 text-yellow-500 flex-shrink-0" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-purple-600 mb-1 truncate">
                    {language === 'hindi' ? 'औसत रेटिंग' : 'Avg Rating'}
                  </p>
                  <p className="text-3xl font-bold text-purple-700">{avgRating.toFixed(1)}</p>
                  <p className="text-xs text-purple-500 mt-1">
                    {language === 'hindi' ? '5 में से' : 'out of 5'}
                  </p>
                </div>
                <Star className="h-12 w-12 text-purple-500 flex-shrink-0" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <Card className="bg-white/90 backdrop-blur-sm border border-orange-200 shadow-xl">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder={language === 'hindi' ? 'कर्मचारी खोजें...' : 'Search workers...'}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <select 
                  value={selectedDepartment}
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg bg-white/80"
                >
                  <option value="all">{language === 'hindi' ? 'सभी विभाग' : 'All Departments'}</option>
                  <option value="सफाई">{language === 'hindi' ? 'सफाई विभाग' : 'Sanitation Dept'}</option>
                  <option value="सड़क">{language === 'hindi' ? 'सड़क विभाग' : 'Roads Dept'}</option>
                  <option value="विद्युत">{language === 'hindi' ? 'विद्युत विभाग' : 'Electricity Dept'}</option>
                  <option value="जल">{language === 'hindi' ? 'जल विभाग' : 'Water Dept'}</option>
                  <option value="स्वास्थ्य">{language === 'hindi' ? 'स्वास्थ्य विभाग' : 'Health Dept'}</option>
                </select>

                <select 
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg bg-white/80"
                >
                  <option value="all">{language === 'hindi' ? 'सभी स्थिति' : 'All Status'}</option>
                  <option value="active">{language === 'hindi' ? 'उपलब्ध' : 'Available'}</option>
                  <option value="busy">{language === 'hindi' ? 'व्यस्त' : 'Busy'}</option>
                  <option value="offline">{language === 'hindi' ? 'ऑफलाइन' : 'Offline'}</option>
                  <option value="leave">{language === 'hindi' ? 'छुट्टी पर' : 'On Leave'}</option>
                </select>

                <Button className="bg-orange-500 hover:bg-orange-600 text-white">
                  <Filter className="h-4 w-4 mr-2" />
                  {language === 'hindi' ? 'फिल्टर लगाएं' : 'Apply Filter'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Workers Grid */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6"
        >
          {filteredWorkers.map((worker, index) => (
            <motion.div
              key={worker.id}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1 * index }}
              whileHover={{ scale: 1.02 }}
              className="group"
            >
              <Card className="bg-white/90 backdrop-blur-sm border border-orange-200 shadow-xl hover:shadow-2xl transition-all duration-300">
                <CardHeader className="pb-3">
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <img
                        src={worker.avatar}
                        alt={worker.name}
                        className="w-16 h-16 rounded-full object-cover border-4 border-white shadow-lg"
                      />
                      <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white ${
                        worker.status === 'active' ? 'bg-green-500' :
                        worker.status === 'busy' ? 'bg-yellow-500' :
                        worker.status === 'offline' ? 'bg-gray-500' : 'bg-red-500'
                      }`}></div>
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg">{worker.name}</CardTitle>
                      <p className="text-sm text-gray-600">{worker.role}</p>
                      <Badge className={getStatusColor(worker.status)}>
                        {getStatusText(worker.status)}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* Contact & Department */}
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Building className="h-4 w-4 text-blue-600" />
                      <span className="text-sm">{worker.department.split('/')[0]}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4 text-green-600" />
                      <span className="text-sm">{worker.phone}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-red-600" />
                      <span className="text-sm">{worker.location}</span>
                    </div>
                  </div>

                  {/* Performance Metrics */}
                  <div className="bg-gray-50 p-3 rounded-lg space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">{language === 'hindi' ? 'दक्षता:' : 'Efficiency:'}</span>
                      <span className={`font-medium ${getEfficiencyColor(worker.efficiency)}`}>
                        {worker.efficiency}%
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">{language === 'hindi' ? 'रेटिंग:' : 'Rating:'}</span>
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        <span className="font-medium">{worker.rating}</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">{language === 'hindi' ? 'पूर्ण:' : 'Completed:'}</span>
                      <span className="font-medium text-green-600">{worker.completedComplaints}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">{language === 'hindi' ? 'लंबित:' : 'Pending:'}</span>
                      <span className="font-medium text-red-600">{worker.pendingComplaints}</span>
                    </div>
                  </div>

                  {/* Today's Work */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Timer className="h-4 w-4 text-blue-600" />
                      <span className="text-sm text-gray-600">
                        {language === 'hindi' ? `आज: ${worker.todayTasks} कार्य` : `Today: ${worker.todayTasks} tasks`}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500">{worker.lastActive}</span>
                  </div>

                  {/* Specializations */}
                  <div>
                    <p className="text-sm text-gray-600 mb-2">{language === 'hindi' ? 'विशेषज्ञता:' : 'Specializations:'}</p>
                    <div className="flex flex-wrap gap-1">
                      {worker.specializations.slice(0, 2).map((spec, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {spec}
                        </Badge>
                      ))}
                      {worker.specializations.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{worker.specializations.length - 2}
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-2 pt-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSelectedWorker(worker)}
                      className="flex-1 text-blue-600 border-blue-200 hover:bg-blue-50"
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      {language === 'hindi' ? 'विवरण' : 'Details'}
                    </Button>
                    {user.role !== 'field-worker' && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 text-green-600 border-green-200 hover:bg-green-50"
                      >
                        <FileText className="h-4 w-4 mr-1" />
                        {language === 'hindi' ? 'असाइन' : 'Assign'}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Worker Details Modal */}
        {selectedWorker && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedWorker(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-xl p-6 max-w-4xl w-full max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center space-x-4">
                  <img
                    src={selectedWorker.avatar}
                    alt={selectedWorker.name}
                    className="w-20 h-20 rounded-full object-cover border-4 border-orange-200"
                  />
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">{selectedWorker.name}</h2>
                    <p className="text-gray-600">{selectedWorker.role}</p>
                    <p className="text-sm text-gray-500">{selectedWorker.department}</p>
                    <Badge className={getStatusColor(selectedWorker.status)}>
                      {getStatusText(selectedWorker.status)}
                    </Badge>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  onClick={() => setSelectedWorker(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </Button>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">{language === 'hindi' ? 'संपर्क जानकारी' : 'Contact Information'}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Mail className="h-4 w-4 text-blue-600" />
                        <span className="text-sm">{selectedWorker.email}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Phone className="h-4 w-4 text-green-600" />
                        <span className="text-sm">{selectedWorker.phone}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-red-600" />
                        <span className="text-sm">{selectedWorker.location}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-purple-600" />
                        <span className="text-sm">{language === 'hindi' ? 'शामिल:' : 'Joined:'} {selectedWorker.joinDate}</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">{language === 'hindi' ? 'विशेषज्ञताएं' : 'Specializations'}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {selectedWorker.specializations.map((spec, idx) => (
                          <Badge key={idx} variant="outline">
                            {spec}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">{language === 'hindi' ? 'प्रदर्शन मेट्रिक्स' : 'Performance Metrics'}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm">{language === 'hindi' ? 'दक्षता:' : 'Efficiency:'}</span>
                        <span className={`font-medium ${getEfficiencyColor(selectedWorker.efficiency)}`}>
                          {selectedWorker.efficiency}%
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">{language === 'hindi' ? 'रेटिंग:' : 'Rating:'}</span>
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 text-yellow-500 fill-current" />
                          <span className="font-medium">{selectedWorker.rating}</span>
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">{language === 'hindi' ? 'पूर्ण शिकायतें:' : 'Completed:'}</span>
                        <span className="font-medium text-green-600">{selectedWorker.completedComplaints}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">{language === 'hindi' ? 'लंबित शिकायतें:' : 'Pending:'}</span>
                        <span className="font-medium text-red-600">{selectedWorker.pendingComplaints}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">{language === 'hindi' ? 'औसत समाधान समय:' : 'Avg Resolution Time:'}</span>
                        <span className="font-medium">{selectedWorker.avgResolutionTime}</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">{language === 'hindi' ? 'हाल की गतिविधि' : 'Recent Activity'}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {selectedWorker.workHistory.slice(0, 3).map((work, idx) => (
                          <div key={idx} className="flex justify-between items-start">
                            <div className="flex-1">
                              <p className="text-sm font-medium">{work.title}</p>
                              <p className="text-xs text-gray-500">
                                {work.completedAt.toLocaleDateString('hi-IN')}
                              </p>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Star className="h-3 w-3 text-yellow-500 fill-current" />
                              <span className="text-xs">{work.rating}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </AdminLayout>
  );
}