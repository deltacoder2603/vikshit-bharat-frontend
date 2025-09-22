import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Progress } from './ui/progress';
import { 
  Camera, 
  CheckCircle, 
  Clock, 
  MapPin, 
  Upload, 
  FileText,
  AlertCircle,
  User,
  Calendar,
  Star,
  Award,
  TrendingUp,
  LogOut,
  Menu,
  Bell,
  Settings,
  MessageSquare,
  ArrowLeft,
  Briefcase,
  Target,
  Activity,
  ThumbsUp,
  BarChart3
} from 'lucide-react';
import { Report, User as UserType } from '../App';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { toast } from 'sonner@2.0.3';
import LanguageToggle from './LanguageToggle';
import ResponsiveNavbar from './EnhancedResponsiveNavbar';
import { getTranslations, Language } from '../utils/translations';

interface FieldWorkerDashboardProps {
  user: UserType;
  reports: Report[];
  onNavigate: (page: string) => void;
  onLogout: () => void;
  onUpdateReport: (reportId: string, updates: Partial<Report>) => void;
  language?: Language;
  onLanguageChange?: (language: Language) => void;
}

export default function EnhancedFieldWorkerDashboard({ 
  user, 
  reports, 
  onNavigate, 
  onLogout,
  onUpdateReport,
  language = 'hindi',
  onLanguageChange
}: FieldWorkerDashboardProps) {
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [workDescription, setWorkDescription] = useState('');
  const [completionPhoto, setCompletionPhoto] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<'assigned' | 'completed' | 'pending'>('assigned');

  const t = getTranslations(language);

  // Filter reports assigned to this worker
  const assignedReports = reports.filter(report => 
    report.assignedWorker === user.id || 
    (report.assignedDepartment === user.department && report.status === 'in-progress')
  );
  
  const completedReports = reports.filter(report => 
    report.status === 'resolved' && 
    (report.assignedWorker === user.id || report.assignedDepartment === user.department)
  );

  const pendingReports = reports.filter(report => 
    report.status === 'pending' && 
    report.assignedDepartment === user.department
  );

  // Enhanced worker statistics
  const workerStats = {
    rating: 4.2,
    totalCompleted: completedReports.length + 28,
    monthlyTarget: 45,
    efficiencyScore: 87,
    citizenFeedbackScore: 4.3,
    averageResolutionTime: language === 'hindi' ? '2.8 दिन' : '2.8 days',
    monthlyCompletionRate: 89
  };

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setCompletionPhoto(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCompleteWork = async () => {
    if (!selectedReport || !workDescription.trim()) {
      toast.error(language === 'hindi' ? 'कृपया कार्य विवरण भरें' : 'Please fill work description');
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const updates = {
      status: 'resolved' as const,
      proofImage: completionPhoto || undefined,
      statusHistory: [
        ...(selectedReport.statusHistory || []),
        {
          status: 'resolved',
          timestamp: new Date(),
          updatedBy: user.name,
          notes: workDescription
        }
      ]
    };
    
    onUpdateReport(selectedReport.id, updates);
    
    setSelectedReport(null);
    setWorkDescription('');
    setCompletionPhoto(null);
    setIsSubmitting(false);
    
    toast.success(language === 'hindi' ? 'कार्य सफलतापूर्वक पूर्ण किया गया!' : 'Work completed successfully!');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved': return 'bg-green-500 text-white';
      case 'in-progress': return 'bg-yellow-500 text-white';
      default: return 'bg-red-500 text-white';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getStatusText = (status: string) => {
    if (language === 'hindi') {
      return status === 'pending' ? 'लंबित' : 
             status === 'in-progress' ? 'प्रगति में' : 'पूर्ण';
    } else {
      return status === 'pending' ? 'Pending' : 
             status === 'in-progress' ? 'In Progress' : 'Completed';
    }
  };

  const getPriorityText = (priority: string) => {
    if (language === 'hindi') {
      return priority === 'high' ? 'उच्च' :
             priority === 'low' ? 'कम' : 'मध्यम';
    } else {
      return priority === 'high' ? 'High' :
             priority === 'low' ? 'Low' : 'Medium';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-green-50">
      <ResponsiveNavbar
        user={user}
        notifications={[
          { id: 1, type: 'new_assignment', isRead: false },
          { id: 2, type: 'priority_update', isRead: false },
          { id: 3, type: 'feedback', isRead: true },
          { id: 4, type: 'deadline_reminder', isRead: false },
          { id: 5, type: 'achievement', isRead: true }
        ]} // Mock notifications for badge count
        language={language}
        onLanguageChange={onLanguageChange}
        onNavigate={onNavigate}
        onLogout={onLogout}
        title={language === 'hindi' ? 'फील्ड वर्कर डैशबोर्ड' : 'Field Worker Dashboard'}
        subtitle={user.department}
        backPage="admin-login"
      />

      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-8">
        {/* Enhanced Welcome Section */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-8"
        >
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-4 sm:p-8 text-white shadow-xl">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="flex-1 mb-4 md:mb-0">
                <motion.h2 
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-xl sm:text-2xl lg:text-3xl mb-2 sm:mb-3"
                >
                  {language === 'hindi' ? 'नमस्ते' : 'Hello'}, {user.name.split(' / ')[language === 'hindi' ? 0 : 1] || user.name}!
                </motion.h2>
                <motion.p 
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="opacity-90 text-sm sm:text-base lg:text-lg mb-2"
                >
                  {language === 'hindi' 
                    ? `आज आपके पास ${assignedReports.length} कार्य हैं`
                    : `You have ${assignedReports.length} tasks today`}
                </motion.p>
                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="flex flex-wrap items-center gap-4 text-xs sm:text-sm opacity-80"
                >
                  <div className="flex items-center">
                    <Star className="h-3 w-3 sm:h-4 sm:w-4 mr-1 text-yellow-300" />
                    <span>{workerStats.rating} {language === 'hindi' ? 'रेटिंग' : 'Rating'}</span>
                  </div>
                  <div className="flex items-center">
                    <Target className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                    <span>{workerStats.efficiencyScore}% {language === 'hindi' ? 'दक्षता' : 'Efficiency'}</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                    <span>{workerStats.totalCompleted} {language === 'hindi' ? 'पूर्ण' : 'Completed'}</span>
                  </div>
                </motion.div>
              </div>
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.8 }}
                className="bg-white/20 rounded-full p-4 sm:p-6 self-center md:self-auto"
              >
                <User className="h-8 w-8 sm:h-12 sm:w-12" />
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Enhanced Statistics Cards with Real Data */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8"
        >
          <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200 hover:shadow-lg transition-shadow">
            <CardContent className="p-4 sm:p-8 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.4 }}
                className="text-3xl sm:text-4xl text-red-600 mb-2 sm:mb-3 flex items-center justify-center"
              >
                <Activity className="h-8 w-8 sm:h-12 sm:w-12 mr-1 sm:mr-2" />
                {assignedReports.length}
              </motion.div>
              <p className="text-red-700 font-semibold text-sm sm:text-lg">
                {language === 'hindi' ? 'सौंपे गए कार्य' : 'Assigned Tasks'}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 hover:shadow-lg transition-shadow">
            <CardContent className="p-4 sm:p-8 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.6 }}
                className="text-3xl sm:text-4xl text-green-600 mb-2 sm:mb-3 flex items-center justify-center"
              >
                <CheckCircle className="h-8 w-8 sm:h-12 sm:w-12 mr-1 sm:mr-2" />
                {completedReports.length}
              </motion.div>
              <p className="text-green-700 font-semibold text-sm sm:text-lg">
                {language === 'hindi' ? 'पूर्ण किए गए' : 'Completed'}
              </p>
              <p className="text-xs text-green-600 mt-1">
                {language === 'hindi' ? 'लक्ष्य:' : 'Target:'} {workerStats.monthlyTarget}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200 hover:shadow-lg transition-shadow">
            <CardContent className="p-4 sm:p-8 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.8 }}
                className="text-3xl sm:text-4xl text-yellow-600 mb-2 sm:mb-3 flex items-center justify-center"
              >
                <Clock className="h-8 w-8 sm:h-12 sm:w-12 mr-1 sm:mr-2" />
                {pendingReports.length}
              </motion.div>
              <p className="text-yellow-700 font-semibold text-sm sm:text-lg">
                {language === 'hindi' ? 'प्रतीक्षारत' : 'Pending'}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:shadow-lg transition-shadow">
            <CardContent className="p-4 sm:p-8 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1.0 }}
                className="text-3xl sm:text-4xl text-blue-600 mb-2 sm:mb-3 flex items-center justify-center"
              >
                <Star className="h-8 w-8 sm:h-12 sm:w-12 mr-1 sm:mr-2 text-yellow-500" />
                {workerStats.rating}
              </motion.div>
              <p className="text-blue-700 font-semibold text-sm sm:text-lg">
                {language === 'hindi' ? 'रेटिंग' : 'Rating'}
              </p>
              <p className="text-xs text-blue-600 mt-1">
                {language === 'hindi' ? '5 में से' : 'out of 5'}
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Performance Metrics */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8"
        >
          <Card className="bg-white/95 backdrop-blur-sm shadow-lg">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5 text-purple-600" />
                  <span className="font-medium text-gray-900">
                    {language === 'hindi' ? 'दक्षता स्कोर' : 'Efficiency Score'}
                  </span>
                </div>
                <Badge className="bg-purple-100 text-purple-800">
                  {workerStats.efficiencyScore}%
                </Badge>
              </div>
              <Progress value={workerStats.efficiencyScore} className="h-2" />
            </CardContent>
          </Card>

          <Card className="bg-white/95 backdrop-blur-sm shadow-lg">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <ThumbsUp className="h-5 w-5 text-green-600" />
                  <span className="font-medium text-gray-900">
                    {language === 'hindi' ? 'नागरिक संतुष्टि' : 'Citizen Satisfaction'}
                  </span>
                </div>
                <div className="flex items-center">
                  <Star className="h-4 w-4 text-yellow-500 mr-1" />
                  <span className="font-medium">{workerStats.citizenFeedbackScore}</span>
                </div>
              </div>
              <div className="flex items-center space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-4 w-4 ${
                      star <= workerStats.citizenFeedbackScore
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/95 backdrop-blur-sm shadow-lg">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-orange-600" />
                  <span className="font-medium text-gray-900">
                    {language === 'hindi' ? 'औसत समाधान समय' : 'Avg Resolution Time'}
                  </span>
                </div>
                <Badge className="bg-orange-100 text-orange-800">
                  {workerStats.averageResolutionTime}
                </Badge>
              </div>
              <p className="text-sm text-gray-600">
                {language === 'hindi' 
                  ? 'पिछले महीने की तुलना में 15% बेहतर'
                  : '15% better than last month'}
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Enhanced Tabs */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 bg-gray-100 rounded-xl p-2">
            {[
              { 
                key: 'assigned', 
                label: language === 'hindi' ? 'सौंपे गए कार्य' : 'Assigned Tasks', 
                shortLabel: language === 'hindi' ? 'सौंपे गए' : 'Assigned',
                count: assignedReports.length,
                icon: Target
              },
              { 
                key: 'pending', 
                label: language === 'hindi' ? 'नए कार्य' : 'New Tasks', 
                shortLabel: language === 'hindi' ? 'नए' : 'New',
                count: pendingReports.length,
                icon: Clock
              },
              { 
                key: 'completed', 
                label: language === 'hindi' ? 'पूर्ण किए गए' : 'Completed', 
                shortLabel: language === 'hindi' ? 'पूर्ण' : 'Done',
                count: completedReports.length,
                icon: CheckCircle
              }
            ].map((tab) => (
              <Button
                key={tab.key}
                variant={activeTab === tab.key ? 'default' : 'ghost'}
                onClick={() => setActiveTab(tab.key as any)}
                className={`flex-1 h-12 sm:h-14 text-sm sm:text-lg ${
                  activeTab === tab.key 
                    ? 'bg-white shadow-lg border border-blue-200' 
                    : 'hover:bg-gray-200'
                }`}
              >
                <tab.icon className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">{tab.label} ({tab.count})</span>
                <span className="sm:hidden">{tab.shortLabel} ({tab.count})</span>
              </Button>
            ))}
          </div>
        </motion.div>

        {/* Enhanced Reports List */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="space-y-6"
        >
          <AnimatePresence mode="wait">
            {activeTab === 'assigned' && assignedReports.map((report, index) => (
              <motion.div
                key={report.id}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 20, opacity: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="bg-white/95 backdrop-blur-sm hover:shadow-xl transition-all duration-300 border-2 border-orange-200">
                  <CardContent className="p-4 sm:p-8">
                    <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start mb-4 sm:mb-6">
                      <div className="flex-1 mb-4 lg:mb-0">
                        <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3">{report.description}</h3>
                        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-6 space-y-2 sm:space-y-0 text-sm text-gray-600 mb-3 sm:mb-4">
                          <div className="flex items-center space-x-2">
                            <MapPin className="h-5 w-5" />
                            <span>{report.location}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-5 w-5" />
                            <span>{new Date(report.submittedAt).toLocaleDateString(language === 'hindi' ? 'hi-IN' : 'en-US')}</span>
                          </div>
                        </div>
                        <div className="flex space-x-3">
                          <Badge className={getStatusColor(report.status)}>
                            {getStatusText(report.status)}
                          </Badge>
                          <Badge className={`border ${getPriorityColor(report.priority || 'medium')}`}>
                            {getPriorityText(report.priority || 'medium')} {language === 'hindi' ? 'प्राथमिकता' : 'Priority'}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex space-x-3">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              variant="default" 
                              size="lg"
                              onClick={() => setSelectedReport(report)}
                              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg"
                            >
                              <CheckCircle className="h-5 w-5 mr-2" />
                              {language === 'hindi' ? 'कार्य पूर्ण करें' : 'Complete Work'}
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-lg">
                            <DialogHeader>
                              <DialogTitle className="text-xl">
                                {language === 'hindi' ? 'कार्य पूर्ण करें' : 'Complete Work'}
                              </DialogTitle>
                            </DialogHeader>
                            <div className="space-y-6">
                              <div>
                                <Label htmlFor="description" className="text-base font-semibold">
                                  {language === 'hindi' ? 'कार्य विवरण' : 'Work Description'} *
                                </Label>
                                <Textarea
                                  id="description"
                                  value={workDescription}
                                  onChange={(e) => setWorkDescription(e.target.value)}
                                  placeholder={language === 'hindi' 
                                    ? 'किए गए कार्य का विस्तृत विवरण दें...'
                                    : 'Provide detailed description of work done...'}
                                  className="mt-2 min-h-[120px]"
                                  rows={4}
                                />
                              </div>
                              
                              <div>
                                <Label htmlFor="photo" className="text-base font-semibold">
                                  {language === 'hindi' ? 'कार्य की फोटो' : 'Work Photo'}
                                </Label>
                                <div className="mt-2">
                                  <input
                                    id="photo"
                                    type="file"
                                    accept="image/*"
                                    onChange={handlePhotoUpload}
                                    className="hidden"
                                  />
                                  <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => document.getElementById('photo')?.click()}
                                    className="w-full h-16 border-dashed border-2 hover:border-solid"
                                  >
                                    <Camera className="h-5 w-5 mr-2" />
                                    {language === 'hindi' ? 'फोटो अपलोड करें' : 'Upload Photo'}
                                  </Button>
                                </div>
                                
                                {completionPhoto && (
                                  <motion.div
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="mt-4"
                                  >
                                    <ImageWithFallback
                                      src={completionPhoto}
                                      alt="Work completion proof"
                                      className="w-full h-48 object-cover rounded-lg border-2 shadow-lg"
                                    />
                                  </motion.div>
                                )}
                              </div>
                              
                              <div className="flex space-x-3 pt-4">
                                <Button
                                  onClick={handleCompleteWork}
                                  disabled={isSubmitting || !workDescription.trim()}
                                  className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 h-12 text-lg"
                                >
                                  {isSubmitting ? (
                                    <motion.div
                                      animate={{ rotate: 360 }}
                                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"
                                    />
                                  ) : (
                                    <CheckCircle className="h-5 w-5 mr-2" />
                                  )}
                                  {isSubmitting 
                                    ? (language === 'hindi' ? 'सबमिट हो रहा है...' : 'Submitting...')
                                    : (language === 'hindi' ? 'कार्य पूर्ण करें' : 'Complete Work')}
                                </Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                    
                    {report.image && (
                      <div className="mt-6">
                        <ImageWithFallback
                          src={report.image}
                          alt="Problem image"
                          className="w-full h-64 object-cover rounded-xl border-2 shadow-lg"
                        />
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
            
            {activeTab === 'pending' && pendingReports.map((report, index) => (
              <motion.div
                key={report.id}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 20, opacity: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="bg-white/95 backdrop-blur-sm hover:shadow-xl transition-all duration-300 border-2 border-yellow-200">
                  <CardContent className="p-4 sm:p-8">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
                      <div className="flex-1 mb-4 sm:mb-0">
                        <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3">{report.description}</h3>
                        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-6 space-y-2 sm:space-y-0 text-sm text-gray-600 mb-3 sm:mb-4">
                          <div className="flex items-center space-x-2">
                            <MapPin className="h-5 w-5" />
                            <span>{report.location}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-5 w-5" />
                            <span>{new Date(report.submittedAt).toLocaleDateString(language === 'hindi' ? 'hi-IN' : 'en-US')}</span>
                          </div>
                        </div>
                        <div className="flex space-x-3">
                          <Badge className="bg-yellow-500 text-white text-base px-3 py-1">
                            {language === 'hindi' ? 'नया कार्य' : 'New Task'}
                          </Badge>
                        </div>
                      </div>
                      <Button 
                        variant="default" 
                        size="lg"
                        onClick={() => {
                          onUpdateReport(report.id, { 
                            status: 'in-progress',
                            assignedWorker: user.id 
                          });
                          toast.success(language === 'hindi' ? 'कार्य स्वीकार किया गया!' : 'Task accepted!');
                        }}
                        className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 w-full sm:w-auto"
                      >
                        <Target className="h-5 w-5 mr-2" />
                        {language === 'hindi' ? 'कार्य स्वीकार करें' : 'Accept Task'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
            
            {activeTab === 'completed' && completedReports.map((report, index) => (
              <motion.div
                key={report.id}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 20, opacity: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="bg-white/95 backdrop-blur-sm border-2 border-green-200">
                  <CardContent className="p-4 sm:p-8">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
                      <div className="flex-1 mb-4 sm:mb-0">
                        <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3">{report.description}</h3>
                        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-6 space-y-2 sm:space-y-0 text-sm text-gray-600 mb-3 sm:mb-4">
                          <div className="flex items-center space-x-2">
                            <MapPin className="h-5 w-5" />
                            <span>{report.location}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-5 w-5" />
                            <span>{new Date(report.submittedAt).toLocaleDateString(language === 'hindi' ? 'hi-IN' : 'en-US')}</span>
                          </div>
                        </div>
                        <Badge className="bg-green-500 text-white text-base px-3 py-1">
                          {language === 'hindi' ? 'पूर्ण किया गया' : 'Completed'}
                        </Badge>
                      </div>
                    </div>
                    
                    {report.proofImage && (
                      <div className="mt-6">
                        <h4 className="text-base font-semibold mb-3">
                          {language === 'hindi' ? 'कार्य पूर्ण होने का प्रमाण:' : 'Work Completion Proof:'}
                        </h4>
                        <ImageWithFallback
                          src={report.proofImage}
                          alt="Work completion proof"
                          className="w-full h-64 object-cover rounded-xl border-2 shadow-lg"
                        />
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {/* Enhanced Empty State */}
          {((activeTab === 'assigned' && assignedReports.length === 0) ||
            (activeTab === 'pending' && pendingReports.length === 0) ||
            (activeTab === 'completed' && completedReports.length === 0)) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <AlertCircle className="h-20 w-20 text-gray-400 mx-auto mb-6" />
              <h3 className="text-2xl font-semibold text-gray-900 mb-3">
                {activeTab === 'assigned' 
                  ? (language === 'hindi' ? 'कोई सौंपा गया कार्य नहीं' : 'No Assigned Tasks')
                  : activeTab === 'pending' 
                  ? (language === 'hindi' ? 'कोई नया कार्य नहीं' : 'No New Tasks')
                  : (language === 'hindi' ? 'कोई पूर्ण किया गया कार्य नहीं' : 'No Completed Tasks')}
              </h3>
              <p className="text-gray-500 text-lg">
                {activeTab === 'assigned' 
                  ? (language === 'hindi' ? 'अभी तक कोई कार्य नहीं सौंपा गया है' : 'No tasks have been assigned yet')
                  : activeTab === 'pending' 
                  ? (language === 'hindi' ? 'कोई नया कार्य उपलब्ध नहीं है' : 'No new tasks available')
                  : (language === 'hindi' ? 'अभी तक कोई कार्य पूर्ण नहीं किया गया है' : 'No tasks have been completed yet')}
              </p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}