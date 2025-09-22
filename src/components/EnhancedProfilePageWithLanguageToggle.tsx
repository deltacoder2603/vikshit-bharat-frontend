import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Textarea } from './ui/textarea';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { 
  ArrowLeft,
  Edit3,
  Save,
  X,
  User,
  Phone,
  Mail,
  MapPin,
  Shield,
  Calendar,
  LogOut,
  Camera,
  CheckCircle,
  Star,
  Award,
  FileText,
  Clock,
  TrendingUp,
  Settings,
  Bell,
  Lock,
  Download,
  Upload,
  Share2,
  Eye,
  EyeOff,
  Smartphone,
  Globe,
  Home,
  Building,
  CreditCard,
  Zap,
  Target,
  Activity,
  BarChart3
} from 'lucide-react';
import { User as UserType } from '../App';
import { toast } from 'sonner';
import LanguageToggle from './LanguageToggle';
import { getTranslations, Language } from '../utils/translations';

interface ProfilePageProps {
  user: UserType;
  onBackToDashboard: () => void;
  onLogout: () => void;
  onUpdateProfile: (updates: Partial<UserType>) => void;
  language?: Language;
  onLanguageChange?: (language: Language) => void;
}

interface UserStats {
  totalReports: number;
  resolvedReports: number;
  pendingReports: number;
  averageResolutionTime: string;
  satisfactionRating: number;
  memberSince: string;
  lastActivity: string;
  contributionScore: number;
}

interface ProfileSection {
  id: string;
  title: string;
  icon: any;
  component: React.ReactNode;
}

export default function EnhancedProfilePageWithLanguageToggle({ 
  user, 
  onBackToDashboard, 
  onLogout, 
  onUpdateProfile,
  language = 'hindi',
  onLanguageChange
}: ProfilePageProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState({
    ...user,
    bio: user.bio || '',
    dateOfBirth: user.dateOfBirth || '',
    occupation: user.occupation || '',
    emergencyContact: user.emergencyContact || '',
    preferredLanguage: user.preferredLanguage || 'hi',
    notificationPreferences: user.notificationPreferences || {
      email: true,
      sms: true,
      push: true
    },
    privacy: user.privacy || {
      showProfile: true,
      showReports: true,
      showActivity: false
    }
  });
  const [isSaving, setIsSaving] = useState(false);
  const [activeSection, setActiveSection] = useState('profile');
  const [showChangePassword, setShowChangePassword] = useState(false);

  const t = getTranslations(language);

  // Mock user statistics with dynamic language support
  const userStats: UserStats = {
    totalReports: 23,
    resolvedReports: 18,
    pendingReports: 5,
    averageResolutionTime: language === 'hindi' ? '3.2 दिन' : '3.2 days',
    satisfactionRating: 4.3,
    memberSince: language === 'hindi' ? 'जनवरी 2023' : 'January 2023',
    lastActivity: language === 'hindi' ? '2 घंटे पहले' : '2 hours ago',
    contributionScore: 485
  };

  const handleSave = async () => {
    setIsSaving(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    onUpdateProfile(editedUser);
    setIsEditing(false);
    setIsSaving(false);
    toast.success(language === 'hindi' ? 'प्रोफाइल सफलतापूर्वक अपडेट की गई!' : 'Profile updated successfully!');
  };

  const handleCancel = () => {
    setEditedUser({ ...user });
    setIsEditing(false);
  };

  const completionPercentage = (() => {
    const fields = ['name', 'email', 'phone', 'address', 'bio', 'occupation'];
    const filledFields = fields.filter(field => editedUser[field as keyof typeof editedUser]);
    return Math.round((filledFields.length / fields.length) * 100);
  })();

  const sections: ProfileSection[] = [
    {
      id: 'profile',
      title: language === 'hindi' ? 'व्यक्तिगत जानकारी' : 'Personal Information',
      icon: User,
      component: (
        <div className="space-y-6">
          {/* Profile Completion */}
          <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-blue-900">
                  {language === 'hindi' ? 'प्रोफाइल पूर्णता' : 'Profile Completion'}
                </h3>
                <Badge className="bg-blue-100 text-blue-800">{completionPercentage}%</Badge>
              </div>
              <Progress value={completionPercentage} className="h-2" />
              <p className="text-sm text-blue-700 mt-2">
                {language === 'hindi' 
                  ? 'अपनी प्रोफाइल को पूरा करें और बेहतर सेवा प्राप्त करें'
                  : 'Complete your profile to get better service'}
              </p>
            </CardContent>
          </Card>

          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>{language === 'hindi' ? 'मूलभूत जानकारी' : 'Basic Information'}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">{language === 'hindi' ? 'पूरा नाम *' : 'Full Name *'}</Label>
                  {isEditing ? (
                    <Input
                      id="name"
                      value={editedUser.name}
                      onChange={(e) => setEditedUser({ ...editedUser, name: e.target.value })}
                      placeholder={language === 'hindi' ? 'आपका पूरा नाम' : 'Your full name'}
                      className="mt-1"
                    />
                  ) : (
                    <p className="p-2 bg-gray-50 rounded border mt-1">{user.name}</p>
                  )}
                </div>
                
                <div>
                  <Label htmlFor="email">{language === 'hindi' ? 'ईमेल पता *' : 'Email Address *'}</Label>
                  {isEditing ? (
                    <Input
                      id="email"
                      type="email"
                      value={editedUser.email}
                      onChange={(e) => setEditedUser({ ...editedUser, email: e.target.value })}
                      placeholder={language === 'hindi' ? 'आपका ईमेल पता' : 'Your email address'}
                      className="mt-1"
                    />
                  ) : (
                    <p className="p-2 bg-gray-50 rounded border mt-1">{user.email}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="phone">{language === 'hindi' ? 'फोन नंबर *' : 'Phone Number *'}</Label>
                  {isEditing ? (
                    <Input
                      id="phone"
                      value={editedUser.phone}
                      onChange={(e) => setEditedUser({ ...editedUser, phone: e.target.value })}
                      placeholder="+91 9876543210"
                      className="mt-1"
                    />
                  ) : (
                    <p className="p-2 bg-gray-50 rounded border mt-1">{user.phone}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="dateOfBirth">{language === 'hindi' ? 'जन्म तिथि' : 'Date of Birth'}</Label>
                  {isEditing ? (
                    <Input
                      id="dateOfBirth"
                      type="date"
                      value={editedUser.dateOfBirth}
                      onChange={(e) => setEditedUser({ ...editedUser, dateOfBirth: e.target.value })}
                      className="mt-1"
                    />
                  ) : (
                    <p className="p-2 bg-gray-50 rounded border mt-1">
                      {editedUser.dateOfBirth || (language === 'hindi' ? 'जोड़ा नहीं गया' : 'Not added')}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="occupation">{language === 'hindi' ? 'व्यवसाय' : 'Occupation'}</Label>
                  {isEditing ? (
                    <Input
                      id="occupation"
                      value={editedUser.occupation}
                      onChange={(e) => setEditedUser({ ...editedUser, occupation: e.target.value })}
                      placeholder={language === 'hindi' ? 'आपका व्यवसाय' : 'Your occupation'}
                      className="mt-1"
                    />
                  ) : (
                    <p className="p-2 bg-gray-50 rounded border mt-1">
                      {editedUser.occupation || (language === 'hindi' ? 'जोड़ा नहीं गया' : 'Not added')}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="emergencyContact">{language === 'hindi' ? 'आपातकालीन संपर्क' : 'Emergency Contact'}</Label>
                  {isEditing ? (
                    <Input
                      id="emergencyContact"
                      value={editedUser.emergencyContact}
                      onChange={(e) => setEditedUser({ ...editedUser, emergencyContact: e.target.value })}
                      placeholder="+91 9876543210"
                      className="mt-1"
                    />
                  ) : (
                    <p className="p-2 bg-gray-50 rounded border mt-1">
                      {editedUser.emergencyContact || (language === 'hindi' ? 'जोड़ा नहीं गया' : 'Not added')}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="address">{language === 'hindi' ? 'पता *' : 'Address *'}</Label>
                {isEditing ? (
                  <Textarea
                    id="address"
                    value={editedUser.address || ''}
                    onChange={(e) => setEditedUser({ ...editedUser, address: e.target.value })}
                    placeholder={language === 'hindi' ? 'आपका पूरा पता' : 'Your complete address'}
                    rows={3}
                    className="mt-1"
                  />
                ) : (
                  <p className="p-2 bg-gray-50 rounded border mt-1">{user.address}</p>
                )}
              </div>

              <div>
                <Label htmlFor="bio">{language === 'hindi' ? 'परिचय' : 'Bio'}</Label>
                {isEditing ? (
                  <Textarea
                    id="bio"
                    value={editedUser.bio}
                    onChange={(e) => setEditedUser({ ...editedUser, bio: e.target.value })}
                    placeholder={language === 'hindi' ? 'अपने बारे में बताएं' : 'Tell us about yourself'}
                    rows={3}
                    className="mt-1"
                  />
                ) : (
                  <p className="p-2 bg-gray-50 rounded border mt-1">
                    {editedUser.bio || (language === 'hindi' ? 'कोई परिचय नहीं जोड़ा गया' : 'No bio added')}
                  </p>
                )}
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Shield className="h-5 w-5 text-blue-600" />
                  <span className="font-medium text-blue-900">
                    {language === 'hindi' ? 'प्रमाणीकरण जानकारी' : 'Authentication Information'}
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="flex justify-between">
                    <span>{language === 'hindi' ? 'प्रमाणीकरण प्रकार:' : 'Authentication Type:'}</span>
                    <Badge className="bg-green-100 text-green-800">
                      {user.authType === 'aadhaar' ? (language === 'hindi' ? 'आधार' : 'Aadhaar') : 'PAN'}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>{language === 'hindi' ? 'प्रमाणीकरण संख्या:' : 'Authentication Number:'}</span>
                    <span className="font-mono">{user.authNumber}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )
    },
    {
      id: 'stats',
      title: language === 'hindi' ? 'आंकड़े और गतिविधि' : 'Statistics & Activity',
      icon: BarChart3,
      component: (
        <div className="space-y-6">
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100">{language === 'hindi' ? 'कुल शिकायतें' : 'Total Reports'}</p>
                    <p className="text-2xl font-bold">{userStats.totalReports}</p>
                  </div>
                  <FileText className="h-8 w-8 text-blue-200" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100">{language === 'hindi' ? 'हल हुईं' : 'Resolved'}</p>
                    <p className="text-2xl font-bold">{userStats.resolvedReports}</p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-200" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-100">{language === 'hindi' ? 'लंबित' : 'Pending'}</p>
                    <p className="text-2xl font-bold">{userStats.pendingReports}</p>
                  </div>
                  <Clock className="h-8 w-8 text-orange-200" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100">{language === 'hindi' ? 'योगदान स्कोर' : 'Contribution Score'}</p>
                    <p className="text-2xl font-bold">{userStats.contributionScore}</p>
                  </div>
                  <Award className="h-8 w-8 text-purple-200" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>{language === 'hindi' ? 'सेवा की गुणवत्ता' : 'Service Quality'}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>{language === 'hindi' ? 'समाधान दर' : 'Resolution Rate'}</span>
                  <div className="flex items-center space-x-2">
                    <Progress value={78} className="w-20 h-2" />
                    <span className="font-medium">78%</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span>{language === 'hindi' ? 'संतुष्टि रेटिंग' : 'Satisfaction Rating'}</span>
                  <div className="flex items-center space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-4 w-4 ${
                          star <= userStats.satisfactionRating
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                    <span className="ml-2 font-medium">{userStats.satisfactionRating}</span>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span>{language === 'hindi' ? 'औसत समाधान समय' : 'Average Resolution Time'}</span>
                  <span className="font-medium">{userStats.averageResolutionTime}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{language === 'hindi' ? 'खाता जानकारी' : 'Account Information'}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>{language === 'hindi' ? 'सदस्य बने' : 'Member Since'}</span>
                  <span className="font-medium">{userStats.memberSince}</span>
                </div>
                <div className="flex justify-between">
                  <span>{language === 'hindi' ? 'अंतिम गतिविधि' : 'Last Activity'}</span>
                  <span className="font-medium">{userStats.lastActivity}</span>
                </div>
                <div className="flex justify-between">
                  <span>{language === 'hindi' ? 'खाता स्थिति' : 'Account Status'}</span>
                  <Badge className="bg-green-100 text-green-800">
                    {language === 'hindi' ? 'सक्रिय' : 'Active'}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span>{language === 'hindi' ? 'सत्यापन स्थिति' : 'Verification Status'}</span>
                  <Badge className="bg-blue-100 text-blue-800">
                    {language === 'hindi' ? 'सत्यापित' : 'Verified'}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-green-50">
      {/* Enhanced Header with Language Toggle */}
      <motion.header
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white/90 backdrop-blur-sm border-b border-orange-200 shadow-sm sticky top-0 z-50"
      >
        <div className="px-4 sm:px-6 py-4">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div className="flex items-center space-x-4 sm:space-x-6">
              <Button
                variant="ghost"
                size="sm"
                onClick={onBackToDashboard}
                className="text-gray-600 hover:text-gray-800 hover:bg-gray-100 p-2 rounded-xl"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">
                  {language === 'hindi' ? 'डैशबोर्ड पर वापस जाएं' : 'Back to Dashboard'}
                </span>
                <span className="sm:hidden">
                  {language === 'hindi' ? 'वापस' : 'Back'}
                </span>
              </Button>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
                  {language === 'hindi' ? 'प्रोफाइल' : 'Profile'}
                </h1>
                <p className="text-sm text-gray-600 hidden sm:block">
                  {language === 'hindi' 
                    ? 'अपनी व्यक्तिगत जानकारी और सेटिंग्स प्रबंधित करें'
                    : 'Manage your personal information and settings'}
                </p>
              </div>
            </div>
            
            <div className="flex flex-wrap items-center gap-3">
              {onLanguageChange && (
                <LanguageToggle 
                  language={language} 
                  onToggle={onLanguageChange}
                />
              )}
              {!isEditing && (
                <Button
                  onClick={() => setIsEditing(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2"
                >
                  <Edit3 className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">
                    {language === 'hindi' ? 'संपादित करें' : 'Edit'}
                  </span>
                  <span className="sm:hidden">
                    {language === 'hindi' ? 'संपादित' : 'Edit'}
                  </span>
                </Button>
              )}
              <Button
                variant="outline"
                onClick={onLogout}
                className="text-red-600 border-red-200 hover:bg-red-50 px-4 py-2"
              >
                <LogOut className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">
                  {language === 'hindi' ? 'लॉगआउट' : 'Logout'}
                </span>
                <span className="sm:hidden">
                  {language === 'hindi' ? 'लॉगआउट' : 'Logout'}
                </span>
              </Button>
            </div>
          </div>
        </div>
      </motion.header>

      <div className="p-4 sm:p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Enhanced Profile Summary Card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:w-80"
            >
              <Card className="sticky top-6">
                <CardContent className="p-4 sm:p-6">
                  <div className="text-center mb-6">
                    <div className="relative inline-block">
                      <Avatar className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4">
                        <AvatarFallback className="bg-gradient-to-r from-orange-400 to-red-500 text-white text-xl sm:text-2xl">
                          {user.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      {isEditing && (
                        <Button
                          size="sm"
                          className="absolute -bottom-2 -right-2 w-6 h-6 sm:w-8 sm:h-8 p-0 rounded-full"
                        >
                          <Camera className="h-3 w-3 sm:h-4 sm:w-4" />
                        </Button>
                      )}
                    </div>
                    <h2 className="text-lg sm:text-xl font-bold text-gray-900 truncate">{user.name}</h2>
                    <p className="text-sm text-gray-600 truncate">{user.email}</p>
                    <Badge className="mt-2 bg-green-100 text-green-800">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      {language === 'hindi' ? 'सत्यापित नागरिक' : 'Verified Citizen'}
                    </Badge>
                  </div>

                  {/* Section Navigation */}
                  <div className="space-y-2">
                    {sections.map((section) => {
                      const Icon = section.icon;
                      return (
                        <button
                          key={section.id}
                          onClick={() => setActiveSection(section.id)}
                          className={`w-full text-left p-3 rounded-lg transition-colors ${
                            activeSection === section.id
                              ? 'bg-orange-100 text-orange-800 border-l-4 border-orange-500'
                              : 'hover:bg-gray-100 text-gray-700'
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            <Icon className="h-5 w-5 flex-shrink-0" />
                            <span className="font-medium text-sm sm:text-base truncate">{section.title}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Quick Stats */}
                  <div className="mt-6 pt-6 border-t">
                    <h3 className="font-medium text-gray-900 mb-3 text-sm sm:text-base">
                      {language === 'hindi' ? 'त्वरित आंकड़े' : 'Quick Stats'}
                    </h3>
                    <div className="space-y-2 text-xs sm:text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">
                          {language === 'hindi' ? 'कुल शिकायतें:' : 'Total Reports:'}
                        </span>
                        <span className="font-medium">{userStats.totalReports}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">
                          {language === 'hindi' ? 'हल हुईं:' : 'Resolved:'}
                        </span>
                        <span className="font-medium text-green-600">{userStats.resolvedReports}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">
                          {language === 'hindi' ? 'योगदान स्कोर:' : 'Contribution:'}
                        </span>
                        <span className="font-medium text-purple-600">{userStats.contributionScore}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Main Content */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex-1"
            >
              <AnimatePresence mode="wait">
                {sections.find(s => s.id === activeSection)?.component}
              </AnimatePresence>

              {/* Save/Cancel Buttons */}
              {isEditing && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-8 flex flex-col sm:flex-row gap-3 sm:justify-end"
                >
                  <Button
                    variant="outline"
                    onClick={handleCancel}
                    disabled={isSaving}
                    className="w-full sm:w-auto px-6 py-2"
                  >
                    <X className="h-4 w-4 mr-2" />
                    {language === 'hindi' ? 'रद्द करें' : 'Cancel'}
                  </Button>
                  <Button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white px-6 py-2"
                  >
                    {isSaving ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                        {language === 'hindi' ? 'सेव हो रहा है...' : 'Saving...'}
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <Save className="h-4 w-4 mr-2" />
                        {language === 'hindi' ? 'सेव करें' : 'Save Changes'}
                      </div>
                    )}
                  </Button>
                </motion.div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}