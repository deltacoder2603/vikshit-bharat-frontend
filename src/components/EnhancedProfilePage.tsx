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

export default function EnhancedProfilePage({ 
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

  // Mock user statistics
  const userStats: UserStats = {
    totalReports: 23,
    resolvedReports: 18,
    pendingReports: 5,
    averageResolutionTime: '3.2 दिन',
    satisfactionRating: 4.3,
    memberSince: 'जनवरी 2023',
    lastActivity: '2 घंटे पहले',
    contributionScore: 485
  };

  const handleSave = async () => {
    setIsSaving(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    onUpdateProfile(editedUser);
    setIsEditing(false);
    setIsSaving(false);
    toast.success('प्रोफाइल सफलतापूर्वक अपडेट की गई!');
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
      title: 'व्यक्तिगत जानकारी',
      icon: User,
      component: (
        <div className="space-y-6">
          {/* Profile Completion */}
          <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-blue-900">प्रोफाइल पूर्णता</h3>
                <Badge className="bg-blue-100 text-blue-800">{completionPercentage}%</Badge>
              </div>
              <Progress value={completionPercentage} className="h-2" />
              <p className="text-sm text-blue-700 mt-2">
                अपनी प्रोफाइल को पूरा करें और बेहतर सेवा प्राप्त करें
              </p>
            </CardContent>
          </Card>

          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>मूलभूत जानकारी</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">पूरा नाम *</Label>
                  {isEditing ? (
                    <Input
                      id="name"
                      value={editedUser.name}
                      onChange={(e) => setEditedUser({ ...editedUser, name: e.target.value })}
                      placeholder="आपका पूरा नाम"
                    />
                  ) : (
                    <p className="p-2 bg-gray-50 rounded border">{user.name}</p>
                  )}
                </div>
                
                <div>
                  <Label htmlFor="email">ईमेल पता *</Label>
                  {isEditing ? (
                    <Input
                      id="email"
                      type="email"
                      value={editedUser.email}
                      onChange={(e) => setEditedUser({ ...editedUser, email: e.target.value })}
                      placeholder="आपका ईमेल पता"
                    />
                  ) : (
                    <p className="p-2 bg-gray-50 rounded border">{user.email}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="phone">फोन नंबर *</Label>
                  {isEditing ? (
                    <Input
                      id="phone"
                      value={editedUser.phone}
                      onChange={(e) => setEditedUser({ ...editedUser, phone: e.target.value })}
                      placeholder="+91 9876543210"
                    />
                  ) : (
                    <p className="p-2 bg-gray-50 rounded border">{user.phone}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="dateOfBirth">जन्म तिथि</Label>
                  {isEditing ? (
                    <Input
                      id="dateOfBirth"
                      type="date"
                      value={editedUser.dateOfBirth}
                      onChange={(e) => setEditedUser({ ...editedUser, dateOfBirth: e.target.value })}
                    />
                  ) : (
                    <p className="p-2 bg-gray-50 rounded border">
                      {editedUser.dateOfBirth || 'जोड़ा नहीं गया'}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="occupation">व्यवसाय</Label>
                  {isEditing ? (
                    <Input
                      id="occupation"
                      value={editedUser.occupation}
                      onChange={(e) => setEditedUser({ ...editedUser, occupation: e.target.value })}
                      placeholder="आपका व्यवसाय"
                    />
                  ) : (
                    <p className="p-2 bg-gray-50 rounded border">
                      {editedUser.occupation || 'जोड़ा नहीं गया'}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="emergencyContact">आपातकालीन संपर्क</Label>
                  {isEditing ? (
                    <Input
                      id="emergencyContact"
                      value={editedUser.emergencyContact}
                      onChange={(e) => setEditedUser({ ...editedUser, emergencyContact: e.target.value })}
                      placeholder="+91 9876543210"
                    />
                  ) : (
                    <p className="p-2 bg-gray-50 rounded border">
                      {editedUser.emergencyContact || 'जोड़ा नहीं गया'}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="address">पता *</Label>
                {isEditing ? (
                  <Textarea
                    id="address"
                    value={editedUser.address || ''}
                    onChange={(e) => setEditedUser({ ...editedUser, address: e.target.value })}
                    placeholder="आपका पूरा पता"
                    rows={3}
                  />
                ) : (
                  <p className="p-2 bg-gray-50 rounded border">{user.address}</p>
                )}
              </div>

              <div>
                <Label htmlFor="bio">परिचय</Label>
                {isEditing ? (
                  <Textarea
                    id="bio"
                    value={editedUser.bio}
                    onChange={(e) => setEditedUser({ ...editedUser, bio: e.target.value })}
                    placeholder="अपने बारे में बताएं"
                    rows={3}
                  />
                ) : (
                  <p className="p-2 bg-gray-50 rounded border">
                    {editedUser.bio || 'कोई परिचय नहीं जोड़ा गया'}
                  </p>
                )}
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Shield className="h-5 w-5 text-blue-600" />
                  <span className="font-medium text-blue-900">प्रमाणीकरण जानकारी</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="flex justify-between">
                    <span>प्रमाणीकरण प्रकार:</span>
                    <Badge className="bg-green-100 text-green-800">
                      {user.authType === 'aadhaar' ? 'आधार' : 'PAN'}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>प्रमाणीकरण संख्या:</span>
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
      title: 'आंकड़े और गतिविधि',
      icon: BarChart3,
      component: (
        <div className="space-y-6">
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100">कुल शिकायतें</p>
                    <p className="text-2xl font-bold">{userStats.totalReports}</p>
                  </div>
                  <FileText className="h-8 w-8 text-blue-200" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100">हल हुईं</p>
                    <p className="text-2xl font-bold">{userStats.resolvedReports}</p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-200" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-100">लंबित</p>
                    <p className="text-2xl font-bold">{userStats.pendingReports}</p>
                  </div>
                  <Clock className="h-8 w-8 text-orange-200" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100">योगदान स्कोर</p>
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
                <CardTitle>सेवा की गुणवत्ता</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>समाधान दर</span>
                  <div className="flex items-center space-x-2">
                    <Progress value={78} className="w-20 h-2" />
                    <span className="font-medium">78%</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span>संतुष्टि रेटिंग</span>
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
                  <span>औसत समाधान समय</span>
                  <span className="font-medium">{userStats.averageResolutionTime}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>खाता जानकार��</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>सदस्य बने</span>
                  <span className="font-medium">{userStats.memberSince}</span>
                </div>
                <div className="flex justify-between">
                  <span>अंतिम गतिविधि</span>
                  <span className="font-medium">{userStats.lastActivity}</span>
                </div>
                <div className="flex justify-between">
                  <span>खाता स्थिति</span>
                  <Badge className="bg-green-100 text-green-800">सक्रिय</Badge>
                </div>
                <div className="flex justify-between">
                  <span>सत्यापन स्थिति</span>
                  <Badge className="bg-blue-100 text-blue-800">सत्यापित</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )
    },
    {
      id: 'settings',
      title: 'सेटिंग्स और प्राथमिकताएं',
      icon: Settings,
      component: (
        <div className="space-y-6">
          {/* Notification Preferences */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="h-5 w-5" />
                <span>सूचना प्राथमिकताएं</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {[
                  { key: 'email', label: 'ईमेल सूचनाएं', description: 'शिकायत अपडेट ईमेल पर प्राप्त करें' },
                  { key: 'sms', label: 'SMS सूचनाएं', description: 'महत्वपूर्ण अपडेट SMS पर प्राप्त करें' },
                  { key: 'push', label: 'पुश नोटिफिकेशन', description: 'तत्काल अपडेट के लिए पुश नोटिफिकेशन' }
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h4 className="font-medium">{item.label}</h4>
                      <p className="text-sm text-gray-600">{item.description}</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={editedUser.notificationPreferences?.[item.key as keyof typeof editedUser.notificationPreferences]}
                      onChange={(e) => setEditedUser({
                        ...editedUser,
                        notificationPreferences: {
                          ...editedUser.notificationPreferences,
                          [item.key]: e.target.checked
                        }
                      })}
                      className="w-4 h-4 text-blue-600"
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Privacy Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Lock className="h-5 w-5" />
                <span>गोपनीयता सेटिंग्स</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {[
                  { key: 'showProfile', label: 'प्रोफाइल दिखाएं', description: 'अन्य उपयोगकर्ताओं को आपकी प्रोफाइल दिखाएं' },
                  { key: 'showReports', label: 'शिकायत इतिहास दिखाएं', description: 'आपकी पिछली शिकायतों को दिखाएं' },
                  { key: 'showActivity', label: 'गतिविधि दिखाएं', description: 'आपकी हाल की गतिविधि दिखाएं' }
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h4 className="font-medium">{item.label}</h4>
                      <p className="text-sm text-gray-600">{item.description}</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={editedUser.privacy?.[item.key as keyof typeof editedUser.privacy]}
                      onChange={(e) => setEditedUser({
                        ...editedUser,
                        privacy: {
                          ...editedUser.privacy,
                          [item.key]: e.target.checked
                        }
                      })}
                      className="w-4 h-4 text-blue-600"
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Language Preference */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Globe className="h-5 w-5" />
                <span>भाषा प्राथमिकता</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <select
                value={editedUser.preferredLanguage}
                onChange={(e) => setEditedUser({ ...editedUser, preferredLanguage: e.target.value })}
                className="w-full p-2 border rounded-md"
              >
                <option value="hi">हिंदी (Hindi)</option>
                <option value="en">English</option>
              </select>
            </CardContent>
          </Card>

          {/* Security */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5" />
                <span>सुरक्षा</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                variant="outline"
                onClick={() => setShowChangePassword(true)}
                className="w-full"
              >
                <Lock className="h-4 w-4 mr-2" />
                पासवर्ड बदलें
              </Button>
              
              <Button
                variant="outline"
                className="w-full"
              >
                <Download className="h-4 w-4 mr-2" />
                डेटा डाउनलोड करें
              </Button>
            </CardContent>
          </Card>
        </div>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-green-50">
      {/* Header */}
      <motion.header
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white/90 backdrop-blur-sm border-b border-orange-200 shadow-sm"
      >
        <div className="px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-6">
              <Button
                variant="ghost"
                size="sm"
                onClick={onBackToDashboard}
                className="text-gray-600 hover:text-gray-800 hover:bg-gray-100"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                डैशबोर्ड पर वापस जाएं
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">प्रोफाइल / Profile</h1>
                <p className="text-gray-600">अपनी व्यक्तिगत जानकारी और सेटिंग्स प्रबंधित करें</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              {!isEditing && (
                <Button
                  onClick={() => setIsEditing(true)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Edit3 className="h-4 w-4 mr-2" />
                  संपादित करें
                </Button>
              )}
              <Button
                variant="outline"
                onClick={onLogout}
                className="text-red-600 border-red-200 hover:bg-red-50"
              >
                <LogOut className="h-4 w-4 mr-2" />
                लॉगआउट
              </Button>
            </div>
          </div>
        </div>
      </motion.header>

      <div className="p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Profile Summary Card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:w-80"
            >
              <Card className="sticky top-6">
                <CardContent className="p-6">
                  <div className="text-center mb-6">
                    <div className="relative inline-block">
                      <Avatar className="w-20 h-20 mx-auto mb-4">
                        <AvatarFallback className="bg-gradient-to-r from-orange-400 to-red-500 text-white text-2xl">
                          {user.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      {isEditing && (
                        <Button
                          size="sm"
                          className="absolute -bottom-2 -right-2 w-8 h-8 p-0 rounded-full"
                        >
                          <Camera className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>
                    <p className="text-gray-600">{user.email}</p>
                    <Badge className="mt-2 bg-green-100 text-green-800">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      सत्यापित नागरिक
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
                            <Icon className="h-5 w-5" />
                            <span className="font-medium">{section.title}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Quick Stats */}
                  <div className="mt-6 pt-6 border-t">
                    <h3 className="font-medium text-gray-900 mb-3">त्वरित आंकड़े</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">कुल शिकायतें:</span>
                        <span className="font-medium">{userStats.totalReports}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">हल हुईं:</span>
                        <span className="font-medium text-green-600">{userStats.resolvedReports}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">योगदान स्कोर:</span>
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
                  className="mt-6 flex justify-end space-x-4"
                >
                  <Button
                    variant="outline"
                    onClick={handleCancel}
                    disabled={isSaving}
                  >
                    <X className="h-4 w-4 mr-2" />
                    रद्द करें
                  </Button>
                  <Button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {isSaving ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"
                      />
                    ) : (
                      <Save className="h-4 w-4 mr-2" />
                    )}
                    {isSaving ? 'सहेजा जा रहा...' : 'सहेजें'}
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