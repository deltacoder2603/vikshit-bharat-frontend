import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { 
  MapPin, 
  Navigation, 
  Users, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Filter,
  Search,
  Layers,
  Zap,
  Target,
  Activity,
  Eye,
  Route,
  Truck,
  UserCheck,
  Phone,
  Timer,
  Calendar,
  Building,
  ArrowLeft
} from 'lucide-react';
import { User, Report } from '../App';
import AdminLayout from './AdminLayout';
import { getTranslations, Language } from '../utils/translations';

interface AdminMapViewProps {
  user: User;
  reports: Report[];
  allUsers: User[];
  onNavigate: (page: string) => void;
  onLogout: () => void;
  onUpdateReport: (reportId: string, updates: Partial<Report>) => void;
  language?: Language;
  onLanguageChange?: (language: Language) => void;
}

interface MapLocation {
  id: string;
  lat: number;
  lng: number;
  type: 'complaint' | 'worker' | 'department' | 'resolved';
  title: string;
  description: string;
  status?: string;
  priority?: string;
  assignedWorker?: string;
  department?: string;
  timestamp?: Date;
  address: string;
}

export default function AdminMapView({ 
  user, 
  reports, 
  allUsers, 
  onNavigate, 
  onLogout,
  onUpdateReport,
  language = 'hindi',
  onLanguageChange
}: AdminMapViewProps) {
  const t = getTranslations(language);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState<MapLocation | null>(null);
  const [currentLocation, setCurrentLocation] = useState<{lat: number, lng: number} | null>(null);
  const [showWorkers, setShowWorkers] = useState(true);
  const [showComplaints, setShowComplaints] = useState(true);
  const [showDepartments, setShowDepartments] = useState(true);

  // Mock map locations based on Kanpur areas
  const [mapLocations] = useState<MapLocation[]>([
    // Complaints
    {
      id: 'complaint-1',
      lat: 26.4499,
      lng: 80.3319,
      type: 'complaint',
      title: 'कचरा जमा - मॉल रोड',
      description: 'Mall Road पर कचरा जमा हो गया है और बदबू आ रही है',
      status: 'pending',
      priority: 'high',
      assignedWorker: 'विकास शर्मा',
      department: 'सफाई विभाग',
      timestamp: new Date('2024-01-15'),
      address: 'Mall Road, Civil Lines, Kanpur'
    },
    {
      id: 'complaint-2',
      lat: 26.4670,
      lng: 80.3498,
      type: 'complaint',
      title: 'सड़क में गड्ढे - सिविल लाइन्स',
      description: 'Civil Lines में सड़क में गड्ढे हैं',
      status: 'in-progress',
      priority: 'medium',
      assignedWorker: 'अनिल कुमार',
      department: 'सड़क विभाग',
      timestamp: new Date('2024-01-14'),
      address: 'Civil Lines, Kanpur'
    },
    {
      id: 'complaint-3',
      lat: 26.4525,
      lng: 80.3311,
      type: 'resolved',
      title: 'स्ट्रीट लाइट रिपेयर - किदवई नगर',
      description: 'स्ट्रीट लाइट की समस्या हल हो गई',
      status: 'resolved',
      priority: 'low',
      assignedWorker: 'संजय वर्मा',
      department: 'विद्युत विभाग',
      timestamp: new Date('2024-01-13'),
      address: 'Kidwai Nagar, Kanpur'
    },
    {
      id: 'complaint-4',
      lat: 26.4557,
      lng: 80.3240,
      type: 'complaint',
      title: 'पानी की समस्या - गोविंद नगर',
      description: 'पानी की सप्लाई रुक गई है',
      status: 'in-progress',
      priority: 'high',
      assignedWorker: 'राम प्रसाद',
      department: 'जल विभाग',
      timestamp: new Date('2024-01-16'),
      address: 'Govind Nagar, Kanpur'
    },
    
    // Workers
    {
      id: 'worker-1',
      lat: 26.4501,
      lng: 80.3321,
      type: 'worker',
      title: 'विकास शर्मा - सफाई कर्मी',
      description: 'वर्तमान में Mall Road एरिया में कार्यरत',
      status: 'active',
      department: 'सफाई विभाग',
      address: 'Mall Road Area, Kanpur'
    },
    {
      id: 'worker-2',
      lat: 26.4672,
      lng: 80.3500,
      type: 'worker',
      title: 'अनिल कुमार - रोड मेंटेनेंस',
      description: 'सिविल लाइन्स में पोथोल रिपेयर कार्य',
      status: 'busy',
      department: 'सड़क विभाग',
      address: 'Civil Lines, Kanpur'
    },
    {
      id: 'worker-3',
      lat: 26.4527,
      lng: 80.3313,
      type: 'worker',
      title: 'संजय वर्मा - इलेक्ट्रिशियन',
      description: 'किदवई नगर में उपलब्ध',
      status: 'available',
      department: 'विद्युत विभाग',
      address: 'Kidwai Nagar, Kanpur'
    },
    {
      id: 'worker-4',
      lat: 26.4559,
      lng: 80.3242,
      type: 'worker',
      title: 'राम प्रसाद - प्लंबर',
      description: 'गोविंद नगर में पाइप लाइन चेक कर रहे हैं',
      status: 'busy',
      department: 'जल विभाग',
      address: 'Govind Nagar, Kanpur'
    },
    
    // Departments
    {
      id: 'dept-1',
      lat: 26.4619,
      lng: 80.3371,
      type: 'department',
      title: 'सिटी हॉल - मुख्य कार्यालय',
      description: 'Kanpur Municipal Corporation',
      address: 'City Hall, The Mall, Kanpur'
    },
    {
      id: 'dept-2',
      lat: 26.4600,
      lng: 80.3400,
      type: 'department',
      title: 'सफाई विभाग कार्यालय',
      description: 'Sanitation Department Office',
      address: 'Sanitation Office, Block A, Kanpur'
    },
    {
      id: 'dept-3',
      lat: 26.4550,
      lng: 80.3280,
      type: 'department',
      title: 'वाटर वर्क्स बिल्डिंग',
      description: 'Water Supply Department',
      address: 'Water Works Building, Kanpur'
    }
  ]);

  // Get current location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.log('Error getting location:', error);
          // Set default to Kanpur city center
          setCurrentLocation({ lat: 26.4499, lng: 80.3319 });
        }
      );
    } else {
      setCurrentLocation({ lat: 26.4499, lng: 80.3319 });
    }
  }, []);

  const filteredLocations = mapLocations.filter(location => {
    if (!showWorkers && location.type === 'worker') return false;
    if (!showComplaints && (location.type === 'complaint' || location.type === 'resolved')) return false;
    if (!showDepartments && location.type === 'department') return false;
    
    if (selectedFilter !== 'all') {
      if (selectedFilter === 'pending' && location.status !== 'pending') return false;
      if (selectedFilter === 'in-progress' && location.status !== 'in-progress') return false;
      if (selectedFilter === 'resolved' && location.status !== 'resolved') return false;
      if (selectedFilter === 'high' && location.priority !== 'high') return false;
    }
    
    if (searchTerm) {
      return location.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
             location.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
             location.address.toLowerCase().includes(searchTerm.toLowerCase());
    }
    
    return true;
  });

  const getLocationIcon = (type: string, status?: string) => {
    switch (type) {
      case 'complaint':
        return status === 'pending' ? '🔴' : status === 'in-progress' ? '🟡' : '🟢';
      case 'resolved':
        return '✅';
      case 'worker':
        return status === 'busy' ? '👷‍♂️' : '👨‍💼';
      case 'department':
        return '🏢';
      default:
        return '📍';
    }
  };

  const getLocationColor = (type: string, status?: string) => {
    switch (type) {
      case 'complaint':
        return status === 'pending' ? 'border-red-500 bg-red-100' : 
               status === 'in-progress' ? 'border-yellow-500 bg-yellow-100' : 
               'border-green-500 bg-green-100';
      case 'resolved':
        return 'border-green-500 bg-green-100';
      case 'worker':
        return status === 'busy' ? 'border-orange-500 bg-orange-100' : 'border-blue-500 bg-blue-100';
      case 'department':
        return 'border-purple-500 bg-purple-100';
      default:
        return 'border-gray-500 bg-gray-100';
    }
  };

  const complaintStats = {
    total: mapLocations.filter(l => l.type === 'complaint' || l.type === 'resolved').length,
    pending: mapLocations.filter(l => l.status === 'pending').length,
    inProgress: mapLocations.filter(l => l.status === 'in-progress').length,
    resolved: mapLocations.filter(l => l.status === 'resolved').length,
    highPriority: mapLocations.filter(l => l.priority === 'high').length
  };

  const workerStats = {
    total: mapLocations.filter(l => l.type === 'worker').length,
    active: mapLocations.filter(l => l.type === 'worker' && l.status === 'active').length,
    busy: mapLocations.filter(l => l.type === 'worker' && l.status === 'busy').length,
    available: mapLocations.filter(l => l.type === 'worker' && l.status === 'available').length
  };

  const pendingCount = reports.filter(r => r.status === 'pending').length + 23;
  const urgentCount = 7;

  return (
    <AdminLayout
      user={user}
      currentPage="admin-map"
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
            <div className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-lg p-6 border border-teal-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-gradient-to-r from-teal-500 to-teal-600 rounded-full">
                    <MapPin className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                      {language === 'hindi' ? 'मैप व्यू' : 'Map View'}
                    </h1>
                    <p className="text-gray-600">
                      {language === 'hindi' ? 'शहर भर की शिकायतों और कर्मचारियों का लाइव ट्रैकिंग' : 'Live tracking of complaints and workers across the city'}
                    </p>
                  </div>
                </div>
                
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder={language === 'hindi' ? 'स्थान खोजें...' : 'Search locations...'}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-64 bg-white/80"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8"
          >
            <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0 shadow-xl hover:shadow-2xl transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm font-medium">
                      {language === 'hindi' ? 'कुल स्थान' : 'Total Locations'}
                    </p>
                    <p className="text-3xl font-bold">{mapLocations.length}</p>
                    <p className="text-xs text-blue-100">
                      {language === 'hindi' ? 'मैप पर दिखाए गए' : 'Shown on map'}
                    </p>
                  </div>
                  <MapPin className="h-8 w-8 text-white/80" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white border-0 shadow-xl hover:shadow-2xl transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-red-100 text-sm font-medium">
                      {language === 'hindi' ? 'लंबित शिकायतें' : 'Pending Complaints'}
                    </p>
                    <p className="text-3xl font-bold">{complaintStats.pending}</p>
                    <p className="text-xs text-red-100">
                      {complaintStats.highPriority} {language === 'hindi' ? 'उच्च प्राथमिकता' : 'high priority'}
                    </p>
                  </div>
                  <AlertTriangle className="h-8 w-8 text-white/80" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0 shadow-xl hover:shadow-2xl transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-yellow-100 text-sm font-medium">
                      {language === 'hindi' ? 'प्रगति में' : 'In Progress'}
                    </p>
                    <p className="text-3xl font-bold">{complaintStats.inProgress}</p>
                    <p className="text-xs text-yellow-100">
                      {language === 'hindi' ? 'कार्य जारी' : 'Work ongoing'}
                    </p>
                  </div>
                  <Clock className="h-8 w-8 text-white/80" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white border-0 shadow-xl hover:shadow-2xl transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100 text-sm font-medium">
                      {language === 'hindi' ? 'सक्रिय कर्मचारी' : 'Active Workers'}
                    </p>
                    <p className="text-3xl font-bold">{workerStats.active + workerStats.busy}</p>
                    <p className="text-xs text-green-100">
                      {workerStats.available} {language === 'hindi' ? 'उपलब्ध' : 'available'}
                    </p>
                  </div>
                  <Users className="h-8 w-8 text-white/80" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0 shadow-xl hover:shadow-2xl transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-sm font-medium">
                      {language === 'hindi' ? 'हल किए गए' : 'Resolved'}
                    </p>
                    <p className="text-3xl font-bold">{complaintStats.resolved}</p>
                    <p className="text-xs text-purple-100">
                      {language === 'hindi' ? 'आज तक' : 'To date'}
                    </p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-white/80" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <div className="grid lg:grid-cols-4 gap-6">
            {/* Map Controls and Filters */}
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="space-y-6"
            >
              {/* Layer Controls */}
              <Card className="bg-white/90 backdrop-blur-sm border border-orange-200 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Layers className="h-5 w-5 text-blue-600" />
                    <span>मैप लेयर्स</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={showComplaints}
                        onChange={(e) => setShowComplaints(e.target.checked)}
                        className="rounded border-gray-300"
                      />
                      <span className="text-sm">शिकायतें</span>
                    </label>
                    <Badge className="bg-red-100 text-red-800">
                      {mapLocations.filter(l => l.type === 'complaint' || l.type === 'resolved').length}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={showWorkers}
                        onChange={(e) => setShowWorkers(e.target.checked)}
                        className="rounded border-gray-300"
                      />
                      <span className="text-sm">कर्मचारी</span>
                    </label>
                    <Badge className="bg-blue-100 text-blue-800">
                      {mapLocations.filter(l => l.type === 'worker').length}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={showDepartments}
                        onChange={(e) => setShowDepartments(e.target.checked)}
                        className="rounded border-gray-300"
                      />
                      <span className="text-sm">विभाग</span>
                    </label>
                    <Badge className="bg-purple-100 text-purple-800">
                      {mapLocations.filter(l => l.type === 'department').length}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Filters */}
              <Card className="bg-white/90 backdrop-blur-sm border border-orange-200 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Filter className="h-5 w-5 text-green-600" />
                    <span>फिल्टर्स</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">स्थिति</label>
                    <select 
                      value={selectedFilter}
                      onChange={(e) => setSelectedFilter(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white"
                    >
                      <option value="all">सभी</option>
                      <option value="pending">लंबित</option>
                      <option value="in-progress">प्रगति में</option>
                      <option value="resolved">हल किए गए</option>
                      <option value="high">उच्च प्राथमिकता</option>
                    </select>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="bg-white/90 backdrop-blur-sm border border-orange-200 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Zap className="h-5 w-5 text-yellow-600" />
                    <span>त्वरित कार्य</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full justify-start text-blue-600 border-blue-200 hover:bg-blue-50"
                  >
                    <Navigation className="h-4 w-4 mr-2" />
                    निकटतम कर्मी खोजें
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full justify-start text-green-600 border-green-200 hover:bg-green-50"
                  >
                    <Route className="h-4 w-4 mr-2" />
                    रूट ऑप्टिमाइज़ करें
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full justify-start text-purple-600 border-purple-200 hover:bg-purple-50"
                  >
                    <Activity className="h-4 w-4 mr-2" />
                    लाइव ट्रैकिंग
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* Main Map Area */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="lg:col-span-3"
            >
              <Card className="bg-white/90 backdrop-blur-sm border border-orange-200 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-5 w-5 text-blue-600" />
                      <span>कानपुर शहर मैप / Kanpur City Map</span>
                    </div>
                    <Badge className="bg-green-100 text-green-800">लाइव</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-96 bg-gradient-to-br from-blue-100 to-green-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center relative overflow-hidden">
                    {/* Map Background */}
                    <div className="absolute inset-0 opacity-20">
                      <div className="grid grid-cols-8 grid-rows-6 h-full w-full">
                        {Array.from({ length: 48 }).map((_, i) => (
                          <div key={i} className="border border-gray-300"></div>
                        ))}
                      </div>
                    </div>

                    {/* Map Locations */}
                    <div className="absolute inset-0 p-4">
                      {filteredLocations.map((location, index) => (
                        <motion.div
                          key={location.id}
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ delay: 0.1 * index }}
                          className={`absolute w-8 h-8 rounded-full border-2 flex items-center justify-center cursor-pointer hover:scale-110 transition-transform ${getLocationColor(location.type, location.status)}`}
                          style={{
                            left: `${((location.lng - 80.3000) * 1000) % 80 + 10}%`,
                            top: `${((26.5000 - location.lat) * 1000) % 70 + 10}%`,
                          }}
                          onClick={() => setSelectedLocation(location)}
                          title={location.title}
                        >
                          <span className="text-lg">
                            {getLocationIcon(location.type, location.status)}
                          </span>
                        </motion.div>
                      ))}

                      {/* Current Location */}
                      {currentLocation && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute w-6 h-6 bg-blue-500 rounded-full border-2 border-white shadow-lg"
                          style={{
                            left: `${((currentLocation.lng - 80.3000) * 1000) % 80 + 10}%`,
                            top: `${((26.5000 - currentLocation.lat) * 1000) % 70 + 10}%`,
                          }}
                        >
                          <div className="w-full h-full bg-blue-500 rounded-full animate-ping opacity-75"></div>
                        </motion.div>
                      )}
                    </div>

                    {/* Legend */}
                    <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
                      <h4 className="text-sm font-medium mb-2">मैप लीजेंड</h4>
                      <div className="space-y-1 text-xs">
                        <div className="flex items-center space-x-2">
                          <span>🔴</span>
                          <span>लंबित शिकायत</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span>🟡</span>
                          <span>प्रगति में</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span>✅</span>
                          <span>हल हो गया</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span>👷‍♂️</span>
                          <span>कर्मचारी</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span>🏢</span>
                          <span>विभाग</span>
                        </div>
                      </div>
                    </div>

                    {/* Map Scale */}
                    <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-2 shadow-lg">
                      <div className="text-xs text-gray-600">
                        <div className="w-16 h-1 bg-gray-800 mb-1"></div>
                        <span>1 km</span>
                      </div>
                    </div>
                  </div>

                  {/* Location Details */}
                  {selectedLocation && (
                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg text-gray-800">{selectedLocation.title}</h3>
                          <p className="text-gray-600 mt-1">{selectedLocation.description}</p>
                          <p className="text-sm text-gray-500 mt-2 flex items-center">
                            <MapPin className="h-4 w-4 mr-1" />
                            {selectedLocation.address}
                          </p>
                          
                          {selectedLocation.type === 'complaint' || selectedLocation.type === 'resolved' ? (
                            <div className="mt-3 space-y-2">
                              <div className="flex items-center space-x-4">
                                <Badge className={
                                  selectedLocation.status === 'resolved' ? 'bg-green-100 text-green-800' :
                                  selectedLocation.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-red-100 text-red-800'
                                }>
                                  {selectedLocation.status === 'resolved' ? 'हल हो गया' :
                                   selectedLocation.status === 'in-progress' ? 'प्रगति में' : 'लंबित'}
                                </Badge>
                                {selectedLocation.priority && (
                                  <Badge className={
                                    selectedLocation.priority === 'high' ? 'bg-red-100 text-red-800' :
                                    selectedLocation.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                    'bg-green-100 text-green-800'
                                  }>
                                    {selectedLocation.priority === 'high' ? 'उच्च प्राथमिकता' :
                                     selectedLocation.priority === 'medium' ? 'मध्यम प्राथमिकता' : 'कम प्राथमिकता'}
                                  </Badge>
                                )}
                              </div>
                              {selectedLocation.assignedWorker && (
                                <p className="text-sm">
                                  <UserCheck className="h-4 w-4 inline mr-1" />
                                  असाइन किया गया: {selectedLocation.assignedWorker} ({selectedLocation.department})
                                </p>
                              )}
                              {selectedLocation.timestamp && (
                                <p className="text-sm text-gray-500">
                                  <Calendar className="h-4 w-4 inline mr-1" />
                                  {selectedLocation.timestamp.toLocaleDateString('hi-IN')}
                                </p>
                              )}
                            </div>
                          ) : selectedLocation.type === 'worker' ? (
                            <div className="mt-3">
                              <Badge className={
                                selectedLocation.status === 'busy' ? 'bg-orange-100 text-orange-800' :
                                selectedLocation.status === 'active' ? 'bg-green-100 text-green-800' :
                                'bg-blue-100 text-blue-800'
                              }>
                                {selectedLocation.status === 'busy' ? 'व्यस्त' :
                                 selectedLocation.status === 'active' ? 'सक्रिय' : 'उपलब्ध'}
                              </Badge>
                              <p className="text-sm mt-2">
                                <Building className="h-4 w-4 inline mr-1" />
                                {selectedLocation.department}
                              </p>
                            </div>
                          ) : (
                            <div className="mt-3">
                              <Badge className="bg-purple-100 text-purple-800">
                                सरकारी कार्यालय
                              </Badge>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-blue-600 border-blue-200 hover:bg-blue-50"
                          >
                            <Navigation className="h-4 w-4 mr-1" />
                            नेविगेट करें
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setSelectedLocation(null)}
                            className="text-gray-500 hover:text-gray-700"
                          >
                            ✕
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>
      </div>
    </AdminLayout>
  );
}