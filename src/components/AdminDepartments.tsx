import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { 
  Building, 
  Users, 
  TrendingUp, 
  Plus, 
  Edit, 
  Trash2, 
  Search,
  UserCheck,
  AlertTriangle,
  CheckCircle,
  Clock,
  Phone,
  Mail,
  MapPin,
  Award,
  BarChart3,
  Settings,
  Eye,
  FileText,
  ArrowLeft
} from 'lucide-react';
import { User, Report } from '../App';
import AdminLayout from './AdminLayout';
import { getTranslations, Language } from '../utils/translations';

interface AdminDepartmentsProps {
  user: User;
  reports: Report[];
  allUsers: User[];
  onNavigate: (page: string) => void;
  onLogout: () => void;
  onUpdateReport: (reportId: string, updates: Partial<Report>) => void;
  language?: Language;
  onLanguageChange?: (language: Language) => void;
}

interface Department {
  id: string;
  name: string;
  nameEn: string;
  head: string;
  headId: string;
  workers: string[];
  totalComplaints: number;
  resolvedComplaints: number;
  pendingComplaints: number;
  avgResolutionTime: string;
  budget: string;
  phone: string;
  email: string;
  location: string;
  established: string;
  rating: number;
  status: 'active' | 'inactive' | 'maintenance';
}

export default function AdminDepartments({ 
  user, 
  reports, 
  allUsers, 
  onNavigate, 
  onLogout,
  onUpdateReport,
  language = 'hindi',
  onLanguageChange
}: AdminDepartmentsProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddDepartment, setShowAddDepartment] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);

  const t = getTranslations(language);

  // Mock departments data
  const [departments] = useState<Department[]>([
    {
      id: 'dept-1',
      name: 'सफाई विभाग',
      nameEn: 'Sanitation Department',
      head: 'श्री प्रदीप सिंह',
      headId: 'head-1',
      workers: ['worker-1', 'worker-2'],
      totalComplaints: 89,
      resolvedComplaints: 67,
      pendingComplaints: 22,
      avgResolutionTime: '2.5 दिन',
      budget: '₹25,00,000',
      phone: '+91 512-2234567',
      email: 'sanitation@kanpur.gov.in',
      location: 'सिटी हॉल, ब्लॉक A',
      established: '1995',
      rating: 4.2,
      status: 'active'
    },
    {
      id: 'dept-2',
      name: 'सड़क विभाग',
      nameEn: 'Roads & Infrastructure',
      head: 'श्री राजेश कुमार',
      headId: 'head-2',
      workers: ['worker-3', 'worker-4'],
      totalComplaints: 156,
      resolvedComplaints: 98,
      pendingComplaints: 58,
      avgResolutionTime: '4.2 दिन',
      budget: '₹45,00,000',
      phone: '+91 512-2234568',
      email: 'roads@kanpur.gov.in',
      location: 'सिटी हॉल, ब्लॉक B',
      established: '1987',
      rating: 3.8,
      status: 'active'
    },
    {
      id: 'dept-3',
      name: 'जल विभाग',
      nameEn: 'Water Supply Department',
      head: 'श्रीमती सुनीता गुप्ता',
      headId: 'head-3',
      workers: ['worker-5', 'worker-6'],
      totalComplaints: 123,
      resolvedComplaints: 95,
      pendingComplaints: 28,
      avgResolutionTime: '3.1 दिन',
      budget: '₹35,00,000',
      phone: '+91 512-2234569',
      email: 'water@kanpur.gov.in',
      location: 'वाटर वर्क्स बिल्डिंग',
      established: '1992',
      rating: 4.0,
      status: 'active'
    },
    {
      id: 'dept-4',
      name: 'विद्युत विभाग',
      nameEn: 'Electricity Department',
      head: 'श्री अमित शर्मा',
      headId: 'head-4',
      workers: ['worker-7'],
      totalComplaints: 78,
      resolvedComplaints: 48,
      pendingComplaints: 30,
      avgResolutionTime: '5.5 दिन',
      budget: '₹20,00,000',
      phone: '+91 512-2234570',
      email: 'electricity@kanpur.gov.in',
      location: 'पावर हाउस कॉम्प्लेक्स',
      established: '1990',
      rating: 3.5,
      status: 'maintenance'
    },
    {
      id: 'dept-5',
      name: 'स्वास्थ्य विभाग',
      nameEn: 'Health Department',
      head: 'डॉ. मीरा वर्मा',
      headId: 'head-5',
      workers: ['worker-8', 'worker-9'],
      totalComplaints: 67,
      resolvedComplaints: 59,
      pendingComplaints: 8,
      avgResolutionTime: '1.8 दिन',
      budget: '₹30,00,000',
      phone: '+91 512-2234571',
      email: 'health@kanpur.gov.in',
      location: 'मुख्य अस्पताल',
      established: '1985',
      rating: 4.5,
      status: 'active'
    }
  ]);

  const filteredDepartments = departments.filter(dept =>
    dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dept.nameEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dept.head.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalDepartments = departments.length;
  const activeDepartments = departments.filter(d => d.status === 'active').length;
  const totalWorkers = departments.reduce((sum, dept) => sum + (dept.workers?.length || 0), 0);
  const totalBudget = departments.reduce((sum, dept) => {
    const budget = parseInt(dept.budget.replace(/[₹,]/g, ''));
    return sum + budget;
  }, 0);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      case 'maintenance': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    if (language === 'hindi') {
      switch (status) {
        case 'active': return 'सक्रिय';
        case 'inactive': return 'निष्क्रिय';
        case 'maintenance': return 'रखरखाव';
        default: return 'अज्ञात';
      }
    } else {
      switch (status) {
        case 'active': return 'Active';
        case 'inactive': return 'Inactive';
        case 'maintenance': return 'Maintenance';
        default: return 'Unknown';
      }
    }
  };

  const getEfficiencyColor = (resolved: number, total: number) => {
    const percentage = (resolved / total) * 100;
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const pendingCount = reports.filter(r => r.status === 'pending').length + 45;
  const urgentCount = 12;

  return (
    <AdminLayout
      user={user}
      currentPage="admin-departments"
      onNavigate={onNavigate}
      onLogout={onLogout}
      pendingCount={pendingCount}
      urgentCount={urgentCount}
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
                {language === 'hindi' ? 'विभाग प्रबंधन' : 'Department Management'}
              </h1>
              <p className="text-sm text-gray-600">
                {user.role === 'district-magistrate' 
                  ? (language === 'hindi' ? 'सभी जिला विभागों का अवलोकन और प्रबंधन' : 'Overview and management of all district departments')
                  : `${user.department} ${language === 'hindi' ? 'विभाग का प्रबंधन' : 'department management'}`}
              </p>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
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
                    {language === 'hindi' ? 'कुल विभाग' : 'Total Departments'}
                  </p>
                  <p className="text-2xl font-bold text-blue-700">{totalDepartments}</p>
                  <p className="text-xs text-blue-500 mt-1">
                    {language === 'hindi' ? 'जिला स्तर पर' : 'District-wide'}
                  </p>
                </div>
                <Building className="h-10 w-10 text-blue-500 flex-shrink-0" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 hover:shadow-lg transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-green-600 mb-1 truncate">
                    {language === 'hindi' ? 'सक्रिय विभाग' : 'Active Departments'}
                  </p>
                  <p className="text-2xl font-bold text-green-700">{activeDepartments}</p>
                  <p className="text-xs text-green-500 mt-1">
                    {Math.round((activeDepartments / totalDepartments) * 100)}% {language === 'hindi' ? 'सक्रियता' : 'active rate'}
                  </p>
                </div>
                <CheckCircle className="h-10 w-10 text-green-500 flex-shrink-0" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 hover:shadow-lg transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-purple-600 mb-1 truncate">
                    {language === 'hindi' ? 'कुल कर्मचारी' : 'Total Workers'}
                  </p>
                  <p className="text-2xl font-bold text-purple-700">{totalWorkers}</p>
                  <p className="text-xs text-purple-500 mt-1">
                    {language === 'hindi' ? 'सभी विभागों में' : 'Across all departments'}
                  </p>
                </div>
                <Users className="h-10 w-10 text-purple-500 flex-shrink-0" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200 hover:shadow-lg transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-yellow-600 mb-1 truncate">
                    {language === 'hindi' ? 'कुल बजट' : 'Total Budget'}
                  </p>
                  <p className="text-2xl font-bold text-yellow-700">₹{(totalBudget / 10000000).toFixed(1)}Cr</p>
                  <p className="text-xs text-yellow-500 mt-1">
                    {language === 'hindi' ? 'वार्षिक' : 'Annual'}
                  </p>
                </div>
                <BarChart3 className="h-10 w-10 text-yellow-500 flex-shrink-0" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Search and Actions */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mb-6"
        >
          <Card className="bg-white/95 backdrop-blur-sm shadow-lg">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder={language === 'hindi' ? 'विभाग खोजें...' : 'Search departments...'}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                {user.role === 'district-magistrate' && (
                  <Button
                    onClick={() => setShowAddDepartment(true)}
                    className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    {language === 'hindi' ? 'नया विभाग' : 'Add Department'}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Departments Grid */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6"
        >
          {filteredDepartments.map((department, index) => (
            <motion.div
              key={department.id}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1 * index }}
              whileHover={{ scale: 1.02 }}
              className="group"
            >
              <Card className="bg-white/95 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-green-500 rounded-lg flex items-center justify-center text-white">
                        <Building className="h-6 w-6" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{language === 'hindi' ? department.name : department.nameEn}</CardTitle>
                        <p className="text-sm text-gray-600">{language === 'hindi' ? department.nameEn : department.name}</p>
                      </div>
                    </div>
                    <Badge className={getStatusColor(department.status)}>
                      {getStatusText(department.status)}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* Department Head */}
                  <div className="flex items-center space-x-2">
                    <UserCheck className="h-4 w-4 text-blue-600" />
                    <span className="text-sm text-gray-600">{language === 'hindi' ? 'प्रमुख:' : 'Head:'}</span>
                    <span className="text-sm font-medium">{department.head}</span>
                  </div>

                  {/* Contact Info */}
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4 text-green-600" />
                      <span className="text-sm">{department.phone}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-blue-600" />
                      <span className="text-sm">{department.email}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-red-600" />
                      <span className="text-sm">{department.location}</span>
                    </div>
                  </div>

                  {/* Performance Metrics */}
                  <div className="bg-gray-50 p-3 rounded-lg space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">{language === 'hindi' ? 'कुल शिकायतें:' : 'Total Complaints:'}</span>
                      <span className="font-medium">{department.totalComplaints}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">{language === 'hindi' ? 'हल हुईं:' : 'Resolved:'}</span>
                      <span className={`font-medium ${getEfficiencyColor(department.resolvedComplaints, department.totalComplaints)}`}>
                        {department.resolvedComplaints} ({Math.round((department.resolvedComplaints / department.totalComplaints) * 100)}%)
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">{language === 'hindi' ? 'लंबित:' : 'Pending:'}</span>
                      <span className="font-medium text-red-600">{department.pendingComplaints}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">{language === 'hindi' ? 'औसत समय:' : 'Avg Time:'}</span>
                      <span className="font-medium">{department.avgResolutionTime}</span>
                    </div>
                  </div>

                  {/* Budget and Rating */}
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-sm text-gray-600">{language === 'hindi' ? 'बजट:' : 'Budget:'}</span>
                      <p className="font-medium text-green-600">{department.budget}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-sm text-gray-600">{language === 'hindi' ? 'रेटिंग:' : 'Rating:'}</span>
                      <p className="font-medium text-yellow-600">★ {department.rating}/5</p>
                    </div>
                  </div>

                  {/* Workers Count */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4 text-purple-600" />
                      <span className="text-sm text-gray-600">
                        {department.workers?.length || 0} {language === 'hindi' ? 'कर्मचारी' : 'workers'}
                      </span>
                    </div>
                    <span className="text-sm text-gray-500">
                      {language === 'hindi' ? 'स्थापित:' : 'Est:'} {department.established}
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-2 pt-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSelectedDepartment(department)}
                      className="flex-1 text-blue-600 border-blue-200 hover:bg-blue-50"
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      {language === 'hindi' ? 'विवरण' : 'Details'}
                    </Button>
                    {user.role === 'district-magistrate' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedDepartment(department);
                          setShowEditModal(true);
                        }}
                        className="flex-1 text-orange-600 border-orange-200 hover:bg-orange-50"
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        {language === 'hindi' ? 'संपादित' : 'Edit'}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </AdminLayout>
  );
}