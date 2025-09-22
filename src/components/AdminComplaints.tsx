import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from './ui/dialog';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import { 
  ArrowLeft,
  Search,
  Filter,
  Eye,
  Edit,
  MapPin,
  Calendar,
  User,
  Phone,
  Camera,
  Upload,
  Check,
  Clock,
  AlertTriangle,
  UserCheck,
  Building,
  LogOut,
  FileText
} from 'lucide-react';
import { User as UserType, Report } from '../App';
import { ImageWithFallback } from './figma/ImageWithFallback';
import AdminLayout from './AdminLayout';
import { getTranslations, Language } from '../utils/translations';

interface AdminComplaintsProps {
  user: UserType;
  reports: Report[];
  allUsers: UserType[];
  onNavigate: (page: string) => void;
  onLogout: () => void;
  onUpdateReport: (reportId: string, updates: Partial<Report>) => void;
  onAssignWorker: (reportId: string, workerId: string) => void;
  language?: Language;
  onLanguageChange?: (language: Language) => void;
}

export default function AdminComplaints({ 
  user, 
  reports, 
  allUsers, 
  onNavigate, 
  onLogout,
  onUpdateReport,
  onAssignWorker,
  language = 'hindi',
  onLanguageChange
}: AdminComplaintsProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [proofImage, setProofImage] = useState<string>('');
  const [statusNotes, setStatusNotes] = useState('');

  const t = getTranslations(language);

  // Debug logging
  React.useEffect(() => {
    console.log('🔍 AdminComplaints rendered with:');
    console.log('📊 Reports count:', reports?.length || 0);
    console.log('👥 Users count:', allUsers?.length || 0);
    console.log('👤 Current user:', user?.role, user?.id);
    if (reports && reports.length > 0) {
      console.log('📋 First few reports:', reports.slice(0, 3));
    } else {
      console.log('❌ No reports data available');
    }
  }, [reports, allUsers, user]);

  // Filter reports based on user role
  const getFilteredReports = () => {
    let filtered = reports;
    
    if (user.role === 'field-worker') {
      filtered = reports.filter(r => r.assignedWorker === user.id || r.assignedDepartment === user.department);
    } else if (user.role === 'department-head') {
      filtered = reports.filter(r => r.assignedDepartment === user.department);
    }
    
    if (statusFilter !== 'all') {
      filtered = filtered.filter(r => r.status === statusFilter);
    }
    
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(r => r.category.includes(categoryFilter));
    }
    
    if (searchTerm) {
      filtered = filtered.filter(r => 
        r.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return filtered;
  };

  const filteredReports = getFilteredReports();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'resolved':
        return <Badge className="bg-green-100 text-green-800 border-0"><Check className="h-3 w-3 mr-1" />{language === 'hindi' ? 'हल हो गया' : 'Resolved'}</Badge>;
      case 'in-progress':
        return <Badge className="bg-yellow-100 text-yellow-800 border-0"><Clock className="h-3 w-3 mr-1" />{language === 'hindi' ? 'प्रगति में' : 'In Progress'}</Badge>;
      default:
        return <Badge className="bg-red-100 text-red-800 border-0"><AlertTriangle className="h-3 w-3 mr-1" />{language === 'hindi' ? 'लंबित' : 'Pending'}</Badge>;
    }
  };

  const handleStatusUpdate = (reportId: string, newStatus: string) => {
    const statusHistory = selectedReport?.statusHistory || [];
    const newHistoryEntry = {
      status: newStatus,
      timestamp: new Date(),
      updatedBy: user.name,
      notes: statusNotes
    };

    onUpdateReport(reportId, {
      status: newStatus as 'pending' | 'in-progress' | 'resolved',
      statusHistory: [...statusHistory, newHistoryEntry],
      ...(proofImage && { proofImage })
    });

    setStatusNotes('');
    setProofImage('');
    setSelectedReport(null);
  };

  const getAvailableWorkers = () => {
    return allUsers.filter(u => 
      u.role === 'field-worker' && 
      (user.role === 'district-magistrate' || u.department === user.department)
    );
  };

  const categories = [
    'कचरा और गंदगी / Garbage & Waste',
    'ट्रैफिक और सड़क / Traffic & Roads',
    'प्रदूषण / Pollution',
    'नालियां और सीवर / Drainage & Sewage',
    'सार्वजनिक स्थान / Public Spaces',
    'आवास और झुग्गियां / Housing & Slums',
    'अन्य समस्याएं / Other Issues'
  ];

  const pendingCount = reports.filter(r => r.status === 'pending').length + 23;
  const urgentCount = 7;

  return (
    <AdminLayout
      user={user}
      currentPage="admin-complaints"
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
              <div className="p-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  {language === 'hindi' ? 'शिकायत प्रबंधन' : 'Complaint Management'}
                </h1>
                <p className="text-sm text-gray-600">
                  {user.role === 'district-magistrate' 
                    ? (language === 'hindi' ? 'सभी जिला शिकायतों का प्रबंधन और समाधान' : 'Manage and resolve all district complaints')
                    : user.role === 'department-head' 
                    ? `${user.department} ${language === 'hindi' ? 'विभाग की शिकायतों का प्रबंधन' : 'department complaint management'}`
                    : (language === 'hindi' ? 'आपकी सौंपी गई शिकायतों का प्रबंधन' : 'Manage your assigned complaints')}
                </p>
              </div>
            </div>
          </div>
          {/* Statistics Cards */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8"
          >
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:shadow-xl transition-shadow">
              <CardContent className="p-3 sm:p-6">
                <div className="flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm text-blue-600 mb-1 truncate">
                      {language === 'hindi' ? 'कुल शिकायतें' : 'Total Complaints'}
                    </p>
                    <p className="text-2xl sm:text-3xl font-bold text-blue-700">{filteredReports.length}</p>
                    <p className="text-xs text-blue-500 mt-1 hidden sm:block">
                      {language === 'hindi' ? 'सभी स्थितियां' : 'All statuses'}
                    </p>
                  </div>
                  <FileText className="h-8 w-8 sm:h-12 sm:w-12 text-blue-500 flex-shrink-0" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200 hover:shadow-xl transition-shadow">
              <CardContent className="p-3 sm:p-6">
                <div className="flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm text-red-600 mb-1 truncate">
                      {language === 'hindi' ? 'लंबित' : 'Pending'}
                    </p>
                    <p className="text-2xl sm:text-3xl font-bold text-red-700">{pendingCount}</p>
                    <p className="text-xs text-red-500 mt-1 hidden sm:block">
                      {language === 'hindi' ? 'कार्य आवश्यक' : 'Action needed'}
                    </p>
                  </div>
                  <AlertTriangle className="h-8 w-8 sm:h-12 sm:w-12 text-red-500 flex-shrink-0" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200 hover:shadow-xl transition-shadow">
              <CardContent className="p-3 sm:p-6">
                <div className="flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm text-yellow-600 mb-1 truncate">
                      {language === 'hindi' ? 'प्रगति में' : 'In Progress'}
                    </p>
                    <p className="text-2xl sm:text-3xl font-bold text-yellow-700">{reports.filter(r => r.status === 'in-progress').length}</p>
                    <p className="text-xs text-yellow-500 mt-1 hidden sm:block">
                      {language === 'hindi' ? 'कार्य चालू' : 'Work ongoing'}
                    </p>
                  </div>
                  <Clock className="h-8 w-8 sm:h-12 sm:w-12 text-yellow-500 flex-shrink-0" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 hover:shadow-xl transition-shadow">
              <CardContent className="p-3 sm:p-6">
                <div className="flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm text-green-600 mb-1 truncate">
                      {language === 'hindi' ? 'हल हो गईं' : 'Resolved'}
                    </p>
                    <p className="text-2xl sm:text-3xl font-bold text-green-700">{reports.filter(r => r.status === 'resolved').length}</p>
                    <p className="text-xs text-green-500 mt-1 hidden sm:block">
                      {language === 'hindi' ? 'पूर्ण' : 'Completed'}
                    </p>
                  </div>
                  <Check className="h-8 w-8 sm:h-12 sm:w-12 text-green-500 flex-shrink-0" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Filters */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mb-8"
          >
            <Card className="bg-white/95 backdrop-blur-sm shadow-xl">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder={language === 'hindi' ? 'खोजें...' : 'Search...'}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder={language === 'hindi' ? 'स्थिति' : 'Status'} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{language === 'hindi' ? 'सभी स्थितियां' : 'All Statuses'}</SelectItem>
                      <SelectItem value="pending">{language === 'hindi' ? 'लंबित' : 'Pending'}</SelectItem>
                      <SelectItem value="in-progress">{language === 'hindi' ? 'प्रगति में' : 'In Progress'}</SelectItem>
                      <SelectItem value="resolved">{language === 'hindi' ? 'हल हो गया' : 'Resolved'}</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder={language === 'hindi' ? 'श्रेणी' : 'Category'} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{language === 'hindi' ? 'सभी श्रेणियां' : 'All Categories'}</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category.split('/')[0].trim()}>
                          {category.split('/')[0].trim()}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white">
                    <Filter className="h-4 w-4 mr-2" />
                    {language === 'hindi' ? 'फिल्टर लगाएं' : 'Apply Filter'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Complaints Table */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <Card className="bg-white/95 backdrop-blur-sm shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="h-6 w-6 text-blue-600" />
                  <span>{language === 'hindi' ? 'शिकायत सूची' : 'Complaints List'}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{language === 'hindi' ? 'शिकायत ID' : 'Complaint ID'}</TableHead>
                        <TableHead>{language === 'hindi' ? 'नागरिक' : 'Citizen'}</TableHead>
                        <TableHead>{language === 'hindi' ? 'श्रेणी' : 'Category'}</TableHead>
                        <TableHead>{language === 'hindi' ? 'स्थान' : 'Location'}</TableHead>
                        <TableHead>{language === 'hindi' ? 'स्थिति' : 'Status'}</TableHead>
                        <TableHead>{language === 'hindi' ? 'दिनांक' : 'Date'}</TableHead>
                        {(user.role === 'department-head' || user.role === 'district-magistrate') && (
                          <TableHead>{language === 'hindi' ? 'कार्यकर्ता' : 'Worker'}</TableHead>
                        )}
                        <TableHead>{language === 'hindi' ? 'कार्य' : 'Actions'}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredReports.map((report, index) => (
                        <motion.tr
                          key={report.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.8 + index * 0.05 }}
                          className="hover:bg-gray-50"
                        >
                          <TableCell className="font-mono">#{String(report.id).slice(-6)}</TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">{report.citizenName || (language === 'hindi' ? 'नागरिक' : 'Citizen')}</div>
                              <div className="text-sm text-gray-500">{report.citizenPhone}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">{language === 'hindi' ? report.category.split('/')[0] : report.category.split('/')[1]?.trim() || report.category}</div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center text-sm">
                              <MapPin className="h-3 w-3 mr-1 text-gray-400" />
                              {report.location}
                            </div>
                          </TableCell>
                          <TableCell>{getStatusBadge(report.status)}</TableCell>
                          <TableCell>
                            <div className="text-sm">
                              {report.submittedAt.toLocaleDateString(language === 'hindi' ? 'hi-IN' : 'en-US')}
                            </div>
                          </TableCell>
                          {(user.role === 'department-head' || user.role === 'district-magistrate') && (
                            <TableCell>
                              {report.assignedWorker ? (
                                <div className="flex items-center text-sm">
                                  <UserCheck className="h-3 w-3 mr-1 text-green-500" />
                                  {language === 'hindi' ? 'कार्यकर्ता सौंपा गया' : 'Worker Assigned'}
                                </div>
                              ) : (
                                <Badge variant="outline" className="text-orange-600">
                                  {language === 'hindi' ? 'असाइन करें' : 'Assign'}
                                </Badge>
                              )}
                            </TableCell>
                          )}
                          <TableCell>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => setSelectedReport(report)}
                                >
                                  <Eye className="h-3 w-3 mr-1" />
                                  {language === 'hindi' ? 'देखें' : 'View'}
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                                <DialogHeader>
                                  <DialogTitle>
                                    {language === 'hindi' ? 'शिकायत विवरण' : 'Complaint Details'} #{String(report.id).slice(-6)}
                                  </DialogTitle>
                                  <DialogDescription>
                                    {language === 'hindi' 
                                      ? 'नागरिक शिकायत का पूरा विवरण और स्थिति अपडेट करने के विकल्प'
                                      : 'Complete details of citizen complaint and options to update status'}
                                  </DialogDescription>
                                </DialogHeader>
                                
                                {selectedReport && (
                                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    {/* Complaint Details */}
                                    <div className="space-y-4">
                                      <div>
                                        <h4 className="font-medium mb-2">
                                          {language === 'hindi' ? 'शिकायत की जानकारी' : 'Complaint Information'}
                                        </h4>
                                        <div className="space-y-2 text-sm">
                                          <div>
                                            <strong>{language === 'hindi' ? 'श्रेणी:' : 'Category:'}</strong> {selectedReport.category}
                                          </div>
                                          <div>
                                            <strong>{language === 'hindi' ? 'स्थान:' : 'Location:'}</strong> {selectedReport.location}
                                          </div>
                                          <div>
                                            <strong>{language === 'hindi' ? 'दिनांक:' : 'Date:'}</strong> {selectedReport.submittedAt.toLocaleString(language === 'hindi' ? 'hi-IN' : 'en-US')}
                                          </div>
                                          <div>
                                            <strong>{language === 'hindi' ? 'वर्तमान स्थिति:' : 'Current Status:'}</strong> {getStatusBadge(selectedReport.status)}
                                          </div>
                                        </div>
                                      </div>
                                      
                                      <div>
                                        <h4 className="font-medium mb-2">
                                          {language === 'hindi' ? 'विवरण' : 'Description'}
                                        </h4>
                                        <p className="text-sm bg-gray-50 p-3 rounded">{selectedReport.description}</p>
                                      </div>

                                      <div>
                                        <h4 className="font-medium mb-2">
                                          {language === 'hindi' ? 'नागरिक का फोटो' : 'Citizen Photo'}
                                        </h4>
                                        <div className="w-full h-48 bg-gray-100 rounded-lg overflow-hidden">
                                          <ImageWithFallback
                                            src={selectedReport.image}
                                            alt={language === 'hindi' ? 'शिकायत का प्रमाण' : 'Complaint evidence'}
                                            className="w-full h-full object-cover"
                                          />
                                        </div>
                                      </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="space-y-4">
                                      {/* Status Update */}
                                      <div>
                                        <h4 className="font-medium mb-2">
                                          {language === 'hindi' ? 'स्थिति अपडेट करें' : 'Update Status'}
                                        </h4>
                                        <div className="space-y-3">
                                          <Select 
                                            value={selectedReport.status} 
                                            onValueChange={(value) => setSelectedReport({...selectedReport, status: value as any})}
                                          >
                                            <SelectTrigger>
                                              <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                              <SelectItem value="pending">
                                                {language === 'hindi' ? 'लंबित' : 'Pending'}
                                              </SelectItem>
                                              <SelectItem value="in-progress">
                                                {language === 'hindi' ? 'प्रगति में' : 'In Progress'}
                                              </SelectItem>
                                              <SelectItem value="resolved">
                                                {language === 'hindi' ? 'हल हो गया' : 'Resolved'}
                                              </SelectItem>
                                            </SelectContent>
                                          </Select>

                                          <Textarea
                                            placeholder={language === 'hindi' ? 'टिप्पणी जोड़ें...' : 'Add notes...'}
                                            value={statusNotes}
                                            onChange={(e) => setStatusNotes(e.target.value)}
                                          />

                                          {/* Proof Upload for Workers */}
                                          {user.role === 'field-worker' && selectedReport.status === 'resolved' && (
                                            <div>
                                              <Label>
                                                {language === 'hindi' ? 'कार्य पूर्ण होने का प्रमाण अपलोड करें' : 'Upload Work Completion Proof'}
                                              </Label>
                                              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                                                <Camera className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                                                <p className="text-sm text-gray-600">
                                                  {language === 'hindi' ? 'फोटो अपलोड करें' : 'Upload Photo'}
                                                </p>
                                              </div>
                                            </div>
                                          )}

                                          <Button 
                                            onClick={() => handleStatusUpdate(selectedReport.id, selectedReport.status)}
                                            className="w-full bg-green-600 hover:bg-green-700 text-white"
                                          >
                                            <Check className="h-4 w-4 mr-2" />
                                            {language === 'hindi' ? 'स्थिति अपडेट करें' : 'Update Status'}
                                          </Button>
                                        </div>
                                      </div>

                                      {/* Worker Assignment for Department Heads */}
                                      {(user.role === 'department-head' || user.role === 'district-magistrate') && (
                                        <div>
                                          <h4 className="font-medium mb-2">
                                            {language === 'hindi' ? 'कार्यकर्ता सौंपें' : 'Assign Worker'}
                                          </h4>
                                          <Select onValueChange={(workerId) => onAssignWorker(selectedReport.id, workerId)}>
                                            <SelectTrigger>
                                              <SelectValue placeholder={language === 'hindi' ? 'कार्यकर्ता चुनें' : 'Select Worker'} />
                                            </SelectTrigger>
                                            <SelectContent>
                                              {getAvailableWorkers().map((worker) => (
                                                <SelectItem key={worker.id} value={worker.id}>
                                                  {worker.name} - {worker.department}
                                                </SelectItem>
                                              ))}
                                            </SelectContent>
                                          </Select>
                                        </div>
                                      )}

                                      {/* Status History */}
                                      {selectedReport.statusHistory && selectedReport.statusHistory.length > 0 && (
                                        <div>
                                          <h4 className="font-medium mb-2">
                                            {language === 'hindi' ? 'स्थिति इतिहास' : 'Status History'}
                                          </h4>
                                          <div className="space-y-2">
                                            {selectedReport.statusHistory.map((history, index) => (
                                              <div key={index} className="text-xs p-2 bg-gray-50 rounded">
                                                <div className="font-medium">
                                                  {history.status === 'pending' 
                                                    ? (language === 'hindi' ? 'लंबित' : 'Pending')
                                                    : history.status === 'in-progress' 
                                                    ? (language === 'hindi' ? 'प्रगति में' : 'In Progress')
                                                    : (language === 'hindi' ? 'हल हो गया' : 'Resolved')
                                                  }
                                                </div>
                                                <div className="text-gray-600">{history.updatedBy}</div>
                                                <div className="text-gray-500">
                                                  {history.timestamp.toLocaleString(language === 'hindi' ? 'hi-IN' : 'en-US')}
                                                </div>
                                                {history.notes && <div className="mt-1">{history.notes}</div>}
                                              </div>
                                            ))}
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                )}
                              </DialogContent>
                            </Dialog>
                          </TableCell>
                        </motion.tr>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </motion.div>
      </div>
    </AdminLayout>
  );
  }