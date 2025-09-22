import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Textarea } from './ui/textarea';
import { Progress } from './ui/progress';
import { 
  User, 
  Edit,
  Save,
  Camera,
  Crown,
  ArrowLeft,
  Target,
  Landmark
} from 'lucide-react';
import { User as UserType } from '../App';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { getTranslations, Language } from '../utils/translations';
import { toast } from 'sonner@2.0.3';
import AdminLayout from './AdminLayout';

interface DistrictMagistrateProfileProps {
  user: UserType;
  onNavigate: (page: string) => void;
  onLogout: () => void;
  onUpdateProfile: (updates: Partial<UserType>) => void;
  language?: Language;
  onLanguageChange?: (language: Language) => void;
}

export default function DistrictMagistrateProfile({
  user,
  onNavigate,
  onLogout,
  onUpdateProfile,
  language = 'hindi',
  onLanguageChange
}: DistrictMagistrateProfileProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user.name,
    email: user.email,
    phone: user.phone,
    address: user.address || '',
    authNumber: user.authNumber,
    profilePicture: ''
  });

  const t = getTranslations(language);

  // Mock district magistrate statistics
  const dmStats = {
    totalDepartments: 8,
    totalWorkers: 125,
    totalComplaints: 1847,
    resolvedComplaints: 1654,
    pendingComplaints: 193,
    avgResolutionTime: language === 'hindi' ? '2.9 दिन' : '2.9 days',
    overallEfficiency: 91,
    joinDate: '2021-04-12',
    budgetManaged: '₹45 करोड़',
    populationServed: '28.5 लाख',
    initiatives: [
      {
        name: language === 'hindi' ? 'डिजिटल कानपुर' : 'Digital Kanpur',
        progress: 78,
        status: 'active'
      },
      {
        name: language === 'hindi' ? 'स्मार्ट रोड प्रोजेक्ट' : 'Smart Road Project',
        progress: 65,
        status: 'active'
      },
      {
        name: language === 'hindi' ? 'जल संरक्षण अभियान' : 'Water Conservation Drive',
        progress: 92,
        status: 'completed'
      }
    ]
  };

  const handleSave = () => {
    // Validate required fields
    if (!profileData.name.trim() || !profileData.email.trim() || !profileData.phone.trim()) {
      toast.error(language === 'hindi' ? 'कृपया सभी आवश्यक फ़ील्ड भरें' : 'Please fill all required fields');
      return;
    }

    onUpdateProfile({
      name: profileData.name,
      email: profileData.email,
      phone: profileData.phone,
      address: profileData.address
    });

    setIsEditing(false);
    toast.success(language === 'hindi' ? 'प्रोफाइल सफलतापूर्वक अपडेट की गई!' : 'Profile updated successfully!');
  };

  const handleCancel = () => {
    setProfileData({
      name: user.name,
      email: user.email,
      phone: user.phone,
      address: user.address || '',
      authNumber: user.authNumber,
      profilePicture: ''
    });
    setIsEditing(false);
  };

  const handleProfilePictureUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileData(prev => ({
          ...prev,
          profilePicture: e.target?.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <AdminLayout
      user={user}
      currentPage="district-magistrate-profile"
      onNavigate={onNavigate}
      onLogout={onLogout}
      pendingCount={dmStats.pendingComplaints}
      urgentCount={15}
      language={language}
      onLanguageChange={onLanguageChange || (() => {})}
    >
      <div className="p-6 space-y-6 max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-6"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onNavigate('admin-dashboard')}
                className="text-gray-600 hover:text-orange-600"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                {language === 'hindi' ? 'वापस' : 'Back'}
              </Button>
              <div className="p-2 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg">
                <Crown className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  {language === 'hindi' ? 'मेरी प्रोफाइल' : 'My Profile'}
                </h1>
                <p className="text-sm text-gray-600">
                  {language === 'hindi' 
                    ? 'जिला मजिस्ट्रेट प्रोफाइल देखें और संपादित करें' 
                    : 'View and edit District Magistrate profile'}
                </p>
              </div>
            </div>
            <Button
              onClick={() => isEditing ? handleSave() : setIsEditing(true)}
              className={`${
                isEditing 
                  ? 'bg-green-600 hover:bg-green-700' 
                  : 'bg-blue-600 hover:bg-blue-700'
              } text-white`}
            >
              {isEditing ? (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  {language === 'hindi' ? 'सहेजें' : 'Save'}
                </>
              ) : (
                <>
                  <Edit className="h-4 w-4 mr-2" />
                  {language === 'hindi' ? 'संपादित करें' : 'Edit'}
                </>
              )}
            </Button>
          </div>
        </motion.div>

        <div className="space-y-6">
          {/* Basic Information */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="bg-white/95 backdrop-blur-sm shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="h-6 w-6 text-purple-600" />
                  <span>{language === 'hindi' ? 'व्यक्तिगत जानकारी' : 'Personal Information'}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Profile Picture */}
                <div className="flex items-center space-x-6">
                  <div className="relative">
                    <div className="w-28 h-28 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg border-4 border-yellow-400">
                      {profileData.profilePicture ? (
                        <ImageWithFallback
                          src={profileData.profilePicture}
                          alt="Profile"
                          className="w-28 h-28 rounded-full object-cover"
                        />
                      ) : (
                        profileData.name.charAt(0).toUpperCase()
                      )}
                    </div>
                    {isEditing && (
                      <label className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-lg cursor-pointer border-2 border-purple-500">
                        <Camera className="h-4 w-4 text-purple-600" />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleProfilePictureUpload}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>{language === 'hindi' ? 'पूरा नाम' : 'Full Name'} *</Label>
                        {isEditing ? (
                          <Input
                            value={profileData.name}
                            onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                            className="mt-1"
                          />
                        ) : (
                          <p className="mt-1 p-2 bg-gray-50 rounded">{profileData.name}</p>
                        )}
                      </div>
                      <div>
                        <Label>{language === 'hindi' ? 'फोन नंबर' : 'Phone Number'} *</Label>
                        {isEditing ? (
                          <Input
                            value={profileData.phone}
                            onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                            className="mt-1"
                          />
                        ) : (
                          <p className="mt-1 p-2 bg-gray-50 rounded">{profileData.phone}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label>{language === 'hindi' ? 'ईमेल' : 'Email'} *</Label>
                    {isEditing ? (
                      <Input
                        type="email"
                        value={profileData.email}
                        onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                        className="mt-1"
                      />
                    ) : (
                      <p className="mt-1 p-2 bg-gray-50 rounded">{profileData.email}</p>
                    )}
                  </div>
                  <div>
                    <Label>{language === 'hindi' ? 'जिला' : 'District'}</Label>
                    <p className="mt-1 p-2 bg-purple-50 rounded font-medium text-purple-800">
                      {language === 'hindi' ? 'कानपुर नगर' : 'Kanpur Nagar'}
                    </p>
                  </div>
                </div>

                <div>
                  <Label>{language === 'hindi' ? 'कार्यालय पता' : 'Office Address'}</Label>
                  {isEditing ? (
                    <Textarea
                      value={profileData.address}
                      onChange={(e) => setProfileData(prev => ({ ...prev, address: e.target.value }))}
                      placeholder={language === 'hindi' ? 'कार्यालय का पूरा पता दर्ज करें...' : 'Enter complete office address...'}
                      className="mt-1"
                      rows={3}
                    />
                  ) : (
                    <p className="mt-1 p-2 bg-gray-50 rounded min-h-[80px]">
                      {profileData.address || (language === 'hindi' 
                        ? 'जिला मजिस्ट्रेट कार्यालय, कलेक्ट्रेट, कानपुर नगर, उत्तर प्रदेश' 
                        : 'District Magistrate Office, Collectorate, Kanpur Nagar, UP')}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label>{language === 'hindi' ? 'आधार नंबर' : 'Aadhaar Number'}</Label>
                    <p className="mt-1 p-2 bg-gray-50 rounded">
                      ****-****-{profileData.authNumber.slice(-4)}
                    </p>
                  </div>
                  <div>
                    <Label>{language === 'hindi' ? 'कार्यभार संभाला' : 'Took Charge'}</Label>
                    <p className="mt-1 p-2 bg-gray-50 rounded">
                      {new Date(dmStats.joinDate).toLocaleDateString(language === 'hindi' ? 'hi-IN' : 'en-US')}
                    </p>
                  </div>
                </div>

                {isEditing && (
                  <div className="flex space-x-3 pt-4">
                    <Button
                      onClick={handleSave}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      {language === 'hindi' ? 'सहेजें' : 'Save Changes'}
                    </Button>
                    <Button
                      onClick={handleCancel}
                      variant="outline"
                    >
                      {language === 'hindi' ? 'रद्द करें' : 'Cancel'}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* District Overview */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-white/95 backdrop-blur-sm shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Landmark className="h-6 w-6 text-blue-600" />
                  <span>{language === 'hindi' ? 'जिला अवलोकन' : 'District Overview'}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-xl font-bold text-blue-600">{dmStats.totalDepartments}</div>
                    <p className="text-xs text-gray-600">
                      {language === 'hindi' ? 'विभाग' : 'Departments'}
                    </p>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-xl font-bold text-green-600">{dmStats.totalWorkers}</div>
                    <p className="text-xs text-gray-600">
                      {language === 'hindi' ? 'कर्मचारी' : 'Employees'}
                    </p>
                  </div>
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <div className="text-lg font-bold text-purple-600">{dmStats.budgetManaged}</div>
                    <p className="text-xs text-gray-600">
                      {language === 'hindi' ? 'बजट' : 'Budget'}
                    </p>
                  </div>
                  <div className="text-center p-3 bg-orange-50 rounded-lg">
                    <div className="text-lg font-bold text-orange-600">{dmStats.populationServed}</div>
                    <p className="text-xs text-gray-600">
                      {language === 'hindi' ? 'जनसंख्या' : 'Population'}
                    </p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">
                        {language === 'hindi' ? 'जिला दक्षता' : 'District Efficiency'}
                      </span>
                      <span className="text-sm font-medium">{dmStats.overallEfficiency}%</span>
                    </div>
                    <Progress value={dmStats.overallEfficiency} className="h-3" />
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">
                        {language === 'hindi' ? 'शिकायत समाधान दर' : 'Complaint Resolution Rate'}
                      </span>
                      <span className="text-sm font-medium">
                        {Math.round((dmStats.resolvedComplaints / dmStats.totalComplaints) * 100)}%
                      </span>
                    </div>
                    <Progress 
                      value={(dmStats.resolvedComplaints / dmStats.totalComplaints) * 100} 
                      className="h-3" 
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Current Initiatives */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="bg-white/95 backdrop-blur-sm shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="h-6 w-6 text-green-600" />
                  <span>{language === 'hindi' ? 'वर्तमान योजनाएं' : 'Current Initiatives'}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {dmStats.initiatives.map((initiative, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{initiative.name}</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm">{initiative.progress}%</span>
                        <Badge className={`${
                          initiative.status === 'completed' ? 'bg-green-100 text-green-800' : 
                          initiative.status === 'active' ? 'bg-blue-100 text-blue-800' : 
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {initiative.status === 'completed' 
                            ? (language === 'hindi' ? 'पूर्ण' : 'Completed')
                            : (language === 'hindi' ? 'सक्रिय' : 'Active')
                          }
                        </Badge>
                      </div>
                    </div>
                    <Progress value={initiative.progress} className="h-2" />
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </AdminLayout>
  );
}