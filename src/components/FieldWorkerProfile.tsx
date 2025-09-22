import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { 
  User, 
  Edit,
  Save,
  Camera,
  Activity,
  ArrowLeft
} from 'lucide-react';
import { User as UserType } from '../App';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { getTranslations, Language } from '../utils/translations';
import { toast } from 'sonner@2.0.3';
import AdminLayout from './AdminLayout';

interface FieldWorkerProfileProps {
  user: UserType;
  onNavigate: (page: string) => void;
  onLogout: () => void;
  onUpdateProfile: (updates: Partial<UserType>) => void;
  language?: Language;
  onLanguageChange?: (language: Language) => void;
}

export default function FieldWorkerProfile({
  user,
  onNavigate,
  onLogout,
  onUpdateProfile,
  language = 'hindi',
  onLanguageChange
}: FieldWorkerProfileProps) {
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

  // Mock worker statistics
  const workerStats = {
    totalCompleted: 156,
    completedThisMonth: 38,
    averageResolutionTime: language === 'hindi' ? '2.8 दिन' : '2.8 days'
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
      currentPage="field-worker-profile"
      onNavigate={onNavigate}
      onLogout={onLogout}
      pendingCount={5}
      urgentCount={2}
      language={language}
      onLanguageChange={onLanguageChange || (() => {})}
    >
      <div className="p-6 space-y-6 max-w-4xl mx-auto">
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
                onClick={() => onNavigate('field-worker-dashboard')}
                className="text-gray-600 hover:text-orange-600"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                {language === 'hindi' ? 'वापस' : 'Back'}
              </Button>
              <div className="p-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg">
                <User className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  {language === 'hindi' ? 'मेरी प्रोफाइल' : 'My Profile'}
                </h1>
                <p className="text-sm text-gray-600">
                  {language === 'hindi' 
                    ? 'अपनी व्यक्तिगत जानकारी देखें और संपादित करें' 
                    : 'View and edit your personal information'}
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
                  <User className="h-6 w-6 text-blue-600" />
                  <span>{language === 'hindi' ? 'व्यक्तिगत जानकारी' : 'Personal Information'}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Profile Picture */}
                <div className="flex items-center space-x-6">
                  <div className="relative">
                    <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                      {profileData.profilePicture ? (
                        <ImageWithFallback
                          src={profileData.profilePicture}
                          alt="Profile"
                          className="w-24 h-24 rounded-full object-cover"
                        />
                      ) : (
                        profileData.name.charAt(0).toUpperCase()
                      )}
                    </div>
                    {isEditing && (
                      <label className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-lg cursor-pointer border-2 border-blue-500">
                        <Camera className="h-4 w-4 text-blue-600" />
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
                    <Label>{language === 'hindi' ? 'विभाग' : 'Department'}</Label>
                    <p className="mt-1 p-2 bg-gray-50 rounded">{user.department}</p>
                  </div>
                </div>

                <div>
                  <Label>{language === 'hindi' ? 'पता' : 'Address'}</Label>
                  {isEditing ? (
                    <Textarea
                      value={profileData.address}
                      onChange={(e) => setProfileData(prev => ({ ...prev, address: e.target.value }))}
                      placeholder={language === 'hindi' ? 'पूरा पता दर्ज करें...' : 'Enter complete address...'}
                      className="mt-1"
                      rows={3}
                    />
                  ) : (
                    <p className="mt-1 p-2 bg-gray-50 rounded min-h-[80px]">
                      {profileData.address || (language === 'hindi' ? 'पता उपलब्ध नहीं' : 'Address not available')}
                    </p>
                  )}
                </div>

                <div>
                  <Label>{language === 'hindi' ? 'आधार नंबर' : 'Aadhaar Number'}</Label>
                  <p className="mt-1 p-2 bg-gray-50 rounded">
                    ****-****-{profileData.authNumber.slice(-4)}
                  </p>
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

          {/* Work History */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-white/95 backdrop-blur-sm shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Activity className="h-6 w-6 text-green-600" />
                  <span>{language === 'hindi' ? 'कार्य विवरण' : 'Work Details'}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{workerStats.totalCompleted}</div>
                    <p className="text-sm text-gray-600">
                      {language === 'hindi' ? 'कुल पूर्ण कार्य' : 'Total Completed'}
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{workerStats.completedThisMonth}</div>
                    <p className="text-sm text-gray-600">
                      {language === 'hindi' ? 'इस महीने' : 'This Month'}
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">{workerStats.averageResolutionTime}</div>
                    <p className="text-sm text-gray-600">
                      {language === 'hindi' ? 'औसत समय' : 'Avg Time'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </AdminLayout>
  );
}