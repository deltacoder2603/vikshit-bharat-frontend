import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { 
  Upload, 
  Camera, 
  MapPin, 
  User, 
  LogOut, 
  History, 
  Send,
  X,
  CheckCircle,
  Navigation
} from 'lucide-react';
import { toast } from 'sonner';
import { User as UserType, Report } from '../App';
import LanguageToggle from './LanguageToggle';
import UniversalImageUpload from './UniversalImageUpload';
import { getTranslations, Language } from '../utils/translations';
import { api } from '../utils/api';


interface DashboardProps {
  user: UserType;
  onSubmitReport: (report: Omit<Report, 'id' | 'submittedAt' | 'status'>, imageFile?: File) => void;
  onViewHistory: () => void;
  onViewProfile: () => void;
  onLogout: () => void;
  language: Language;
  onLanguageChange: (language: Language) => void;
}

export default function Dashboard({ user, onSubmitReport, onViewHistory, onViewProfile, onLogout, language, onLanguageChange }: DashboardProps) {
  const [reportData, setReportData] = useState({
    image: '',
    description: '',
    category: '',
    location: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
    customProblem: ''
  });
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [backendCategories, setBackendCategories] = useState<string[]>([]);
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [isAnalyzingImage, setIsAnalyzingImage] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [isLocationAvailable, setIsLocationAvailable] = useState(() => {
    // Check if we're in an environment where geolocation is likely blocked
    const isBlockedEnvironment = 
      window.location.hostname.includes('figma') ||
      window.location.hostname.includes('preview') ||
      window.location.hostname.includes('sandbox') ||
      !navigator.geolocation;
    
    return !isBlockedEnvironment;
  });
  
  const t = getTranslations(language);

  // Categories are only available through image analysis, no need to load them separately
  useEffect(() => {
    setIsLoadingCategories(false);
  }, []);

  const categories = [
    t.categories.garbageWaste,
    t.categories.trafficRoads,
    t.categories.pollution,
    t.categories.drainageSewage,
    t.categories.publicSpaces,
    t.categories.housingSlums,
    t.categories.waterIssues,
    t.categories.electricityIssues,
    t.categories.education,
    t.categories.health,
    t.categories.otherIssues
  ];

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories(prev => {
      if (prev.includes(category)) {
        return prev.filter(c => c !== category);
      } else {
        return [...prev, category];
      }
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    console.log('📸 Desktop - File selected:', file);
    
    if (file) {
      // Validate file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        toast.error(language === 'hindi' ? 'फाइल का साइज़ 10MB से कम होना चाहिए' : 'File size should be less than 10MB');
        return;
      }
      
      // Validate file type - Only JPG, PNG, GIF allowed
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
      if (!allowedTypes.includes(file.type.toLowerCase())) {
        toast.error(language === 'hindi' ? 'कृपया केवल JPG, PNG या GIF फाइल अपलोड करें' : 'Please upload only JPG, PNG or GIF files');
        return;
      }
      
      console.log('✅ Desktop - File validation passed, processing...');
      
      // Store the file object for API submission
      setImageFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = async (event) => {
        console.log('🔄 Desktop - FileReader onload triggered');
        const result = event.target?.result as string;
        console.log('🎯 Desktop - Image data URL created, length:', result?.length);
        
        if (result) {
          setImagePreview(result);
          setReportData(prev => ({ ...prev, image: result }));
          console.log('✨ Desktop - Image preview set successfully');
          
          // Show success message
          toast.success(language === 'hindi' ? '🎉 तस्वीर सफलतापूर्वक अपलोड की गई!' : '🎉 Image uploaded successfully!');
          
          // Analyze image to get categories from backend
          setIsAnalyzingImage(true);
          try {
            console.log('🔍 Desktop - Starting image analysis...');
            toast.loading(language === 'hindi' ? 'तस्वीर का विश्लेषण हो रहा है...' : 'Analyzing image...', { id: 'image-analysis' });
            
            const analysisResult = await api.analyzeImage(file);
            console.log('✅ Desktop - Analysis result:', analysisResult.categories);
            
            setBackendCategories(analysisResult.categories);
            setSelectedCategories([]); // Reset selected categories
            
            toast.dismiss('image-analysis');
            if (analysisResult.categories.length > 0) {
              toast.success(
                language === 'hindi' 
                  ? `✨ ${analysisResult.categories.length} समस्या श्रेणियां पहचानी गईं!` 
                  : `✨ Found ${analysisResult.categories.length} problem categories!`
              );
            } else {
              // Provide fallback categories when AI doesn't detect any
              const defaultCategories = [
                'Garbage & Waste',
                'Water Issues', 
                'Traffic & Roads',
                'Electricity Issues',
                'Public Spaces',
                'Other Issues'
              ];
              setBackendCategories(defaultCategories);
              
              toast.info(
                language === 'hindi' 
                  ? 'कोई विशिष्ट समस्या श्रेणी नहीं मिली। कुछ सामान्य श्रेणियां दिखाई जा रही हैं, कृपया अपनी समस्या के अनुसार चुनें।' 
                  : 'No specific problem categories found. Showing some common categories, please select according to your issue.'
              );
            }
          } catch (analysisError) {
            console.error('❌ Desktop - Image analysis failed:', analysisError);
            toast.dismiss('image-analysis');
            
            // Check if it's a quota exceeded error
            if (analysisError.message.includes('quota exceeded') || analysisError.message.includes('Too many requests')) {
              toast.warning(
                language === 'hindi' 
                  ? 'तस्वीर विश्लेषण सेवा अस्थायी रूप से अनुपलब्ध है। कृपया समस्या का विवरण मैन्युअल रूप से चुनें।' 
                  : 'Image analysis service is temporarily unavailable. Please select problem categories manually.'
              );
            } else {
              toast.error(
                language === 'hindi' 
                  ? 'तस्वीर विश्लेषण में त्रुटि, कृपया मैन्युअल रूप से श्रेणी चुनें' 
                  : 'Image analysis failed, please select categories manually'
              );
            }
            
            // Fallback to default categories when image analysis fails
            const defaultCategories = [
              'Garbage & Waste',
              'Water Issues', 
              'Traffic & Roads',
              'Electricity Issues',
              'Public Spaces',
              'Other Issues'
            ];
            setBackendCategories(defaultCategories);
            
            // Show info message about fallback
            toast.info(
              language === 'hindi' 
                ? 'कुछ सामान्य समस्या श्रेणियां दिखाई जा रही हैं। कृपया अपनी समस्या के अनुसार चुनें।' 
                : 'Showing some common problem categories. Please select according to your issue.'
            );
          } finally {
            setIsAnalyzingImage(false);
          }
        }
      };
      
      reader.onerror = (error) => {
        console.error('❌ Desktop - FileReader error:', error);
        toast.error(language === 'hindi' ? 'तस्वीर लोड करने में त्रुटि' : 'Error loading image');
      };
      
      reader.readAsDataURL(file);
    } else {
      console.log('❌ Desktop - No file selected');
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    setReportData(prev => ({ ...prev, image: '' }));
    setImageFile(null);
    setBackendCategories([]);
    setSelectedCategories([]);
    // Reset the file input
    const fileInput = document.getElementById('image-upload') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
    toast.info(language === 'hindi' ? 'तस्वीर हटा दी गई' : 'Image removed');
  };

  const getCurrentLocation = () => {
    // Check environment and availability first
    if (!isLocationAvailable) {
      // Provide mock location directly for blocked environments
      const mockLocations = [
        'Mall Road, Kanpur',
        'Civil Lines, Kanpur',
        'Swaroop Nagar, Kanpur',
        'Govind Nagar, Kanpur',
        'Kalyanpur, Kanpur'
      ];
      const randomLocation = mockLocations[Math.floor(Math.random() * mockLocations.length)];
      
      setReportData(prev => ({ ...prev, location: randomLocation }));
      toast.info(language === 'hindi' 
        ? `सुझाया गया स्थान: ${randomLocation}. आप इसे बदल सकते हैं।`
        : `Suggested location: ${randomLocation}. You can modify this.`);
      return;
    }

    // Enhanced geolocation feature detection
    if (!navigator.geolocation) {
      setIsLocationAvailable(false);
      toast.error(language === 'hindi' ? 'आपका डिवाइस जीपीएस सपोर्ट नहीं करता' : 'Your device does not support GPS');
      return;
    }

    // Check if already getting location
    if (isGettingLocation) {
      return;
    }

    setIsGettingLocation(true);
    toast.info(language === 'hindi' ? 'स्थान की जानकारी प्राप्त की जा रही है...' : 'Getting your location...');

    // Add timeout wrapper for additional safety
    const timeoutId = setTimeout(() => {
      setIsGettingLocation(false);
      toast.error(language === 'hindi' ? 'स्थान प्राप्त करने में समय अधिक लगा' : 'Location request timed out');
    }, 10000); // 10 second backup timeout

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        clearTimeout(timeoutId); // Clear the backup timeout
        const { latitude, longitude, accuracy } = position.coords;
        
        try {
          // Validate coordinates
          if (isNaN(latitude) || isNaN(longitude) || latitude === 0 || longitude === 0) {
            throw new Error('Invalid coordinates received');
          }
          
          // Simulate reverse geocoding for demo (in real app, use Google Maps API)
          const mockAddresses = [
            'Mall Road, Kanpur',
            'Civil Lines, Kanpur', 
            'Swaroop Nagar, Kanpur',
            'Govind Nagar, Kanpur',
            'Kalyanpur, Kanpur',
            'Kidwai Nagar, Kanpur',
            'Barra, Kanpur',
            'Shyam Nagar, Kanpur'
          ];
          
          const randomAddress = mockAddresses[Math.floor(Math.random() * mockAddresses.length)];
          const accuracyText = accuracy ? ` (±${Math.round(accuracy)}m)` : '';
          const locationString = `${randomAddress} (GPS: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}${accuracyText})`;
          
          setReportData(prev => ({ ...prev, location: locationString }));
          toast.success(language === 'hindi' ? '📍 स्थान सफलतापूर्वक प्राप्त किया गया!' : '📍 Location obtained successfully!');
        } catch (error) {
          console.error('Geocoding error:', error);
          const locationString = `GPS: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
          setReportData(prev => ({ ...prev, location: locationString }));
          toast.success(language === 'hindi' ? '📍 जीपीएस स्थान प्राप्त किया गया!' : '📍 GPS location obtained!');
        } finally {
          setIsGettingLocation(false);
        }
      },
      (error) => {
        clearTimeout(timeoutId); // Clear the backup timeout
        setIsGettingLocation(false);
        
        // Silent error logging to avoid console spam in blocked environments
        if (!error.message?.includes('permissions policy')) {
          console.error('Geolocation error details:', {
            code: error.code || 'Unknown',
            message: error.message
          });
        }
        
        let errorMessage = '';
        let helpText = '';
        
        // Check for permissions policy error specifically
        if (error.message && error.message.includes('permissions policy')) {
          setIsLocationAvailable(false);
          // Don't show error toast for permissions policy - just provide fallback
          const mockLocations = [
            'Mall Road, Kanpur',
            'Civil Lines, Kanpur',
            'Swaroop Nagar, Kanpur'
          ];
          const randomLocation = mockLocations[Math.floor(Math.random() * mockLocations.length)];
          
          setReportData(prev => ({ ...prev, location: randomLocation }));
          toast.info(language === 'hindi' 
            ? `सुझाया गया स्थान: ${randomLocation}. आप इसे बदल सकते हैं।`
            : `Suggested location: ${randomLocation}. You can modify this.`);
          return;
        } else {
          switch (error.code) {
            case 1: // PERMISSION_DENIED
              errorMessage = language === 'hindi' ? 'स्थान की अनुमति अस्वीकृत' : 'Location access denied';
              helpText = language === 'hindi' ? 'कृपया ब्राउज़र सेटिंग्स में अनुमति दें' : 'Please allow location access in browser settings';
              break;
            case 2: // POSITION_UNAVAILABLE
              errorMessage = language === 'hindi' ? 'स्थान की जानकारी उपलब्ध नहीं है' : 'Location information unavailable';
              helpText = language === 'hindi' ? 'कृपया अपना जीपीएस चालू करें' : 'Please turn on your GPS';
              break;
            case 3: // TIMEOUT
              errorMessage = language === 'hindi' ? 'स्थान प्राप्त करने में समय अधिक लगा' : 'Location request timed out';
              helpText = language === 'hindi' ? 'कृपया दोबारा कोशिश करें' : 'Please try again';
              break;
            default:
              errorMessage = language === 'hindi' ? 'स्थान प्राप्त करने में त्रुटि' : 'Error getting location';
              helpText = language === 'hindi' ? 'कृपया मैन्युअल रूप से पता दर्ज करें' : 'Please enter address manually';
          }
          
          toast.error(`${errorMessage}. ${helpText}`);
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 8000,
        maximumAge: 60000
      }
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // More specific validation with detailed error messages
    if (!imageFile) {
      toast.error(language === 'hindi' ? 'कृपया तस्वीर अपलोड करें' : 'Please upload an image');
      return;
    }
    
    if (!reportData.description.trim()) {
      toast.error(language === 'hindi' ? 'कृपया समस्या का विवरण दर्ज करें' : 'Please enter problem description');
      return;
    }
    
    // Check if categories are selected (description is already validated above)
    if (selectedCategories.length === 0 && backendCategories.length > 0) {
      toast.error(language === 'hindi' ? 'कृपया कम से कम एक समस्या श्रेणी चुनें' : 'Please select at least one problem category');
      return;
    }
    
    if (!reportData.location.trim()) {
      toast.error(language === 'hindi' ? 'कृपया स्थान दर्ज करें' : 'Please enter location');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Prepare categories for submission
      const finalCategories = selectedCategories.length > 0 ? selectedCategories : [];
      
      await onSubmitReport({
        ...reportData,
        category: finalCategories.length > 0 ? finalCategories[0] : 'Others', // For compatibility with existing interface
        categories: finalCategories, // New field for multiple categories
        othersText: reportData.description // Always use the main description
      }, imageFile);
      
      // Reset form only on successful submission
      setReportData({
        image: '',
        description: '',
        category: '',
        location: '',
        priority: 'medium',
        customProblem: ''
      });
      setSelectedCategories([]);
      setBackendCategories([]);
      setImagePreview(null);
      setImageFile(null);
      
      // Reset the file input
      const fileInput = document.getElementById('image-upload') as HTMLInputElement;
      if (fileInput) {
        fileInput.value = '';
      }
      
    } catch (error) {
      console.error('Submission error:', error);
      // Error handling is done in the parent component
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-green-50">
      {/* Enhanced Mobile-Optimized Header */}
      <motion.header
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white/95 backdrop-blur-md border-b border-orange-200/50 shadow-lg sticky top-0 z-40 safe-area-top"
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16 lg:h-20">
            {/* Left side - Logo and Title */}
            <div className="flex items-center space-x-2 sm:space-x-3 flex-1 min-w-0">
              <div className="flex space-x-0.5 sm:space-x-1 flex-shrink-0">
                <div className="w-2.5 h-5 sm:w-3 sm:h-6 lg:w-4 lg:h-8 bg-orange-500 rounded-sm shadow-lg" />
                <div className="w-2.5 h-5 sm:w-3 sm:h-6 lg:w-4 lg:h-8 bg-white border-2 border-gray-300 rounded-sm shadow-lg" />
                <div className="w-2.5 h-5 sm:w-3 sm:h-6 lg:w-4 lg:h-8 bg-green-600 rounded-sm shadow-lg" />
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="text-base sm:text-lg lg:text-2xl xl:text-3xl font-bold truncate" style={{ color: '#FF9933' }}>
                  VIKSIT KANPUR
                </h1>
                <p className="text-xs text-gray-600 hidden sm:block lg:text-sm">
                  {language === 'hindi' ? 'स्मार्ट शहर पहल' : 'Smart City Initiative'}
                </p>
              </div>
            </div>
            
            {/* Right side - Mobile Optimized Controls */}
            <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
              {/* Language Toggle - Mobile optimized */}
              <div className="hidden sm:block">
                <LanguageToggle 
                  language={language} 
                  onToggle={onLanguageChange}
                />
              </div>
              
              {/* Mobile Language Toggle */}
              <Button
                variant="ghost"
                onClick={() => onLanguageChange(language === 'hindi' ? 'english' : 'hindi')}
                className="sm:hidden text-xs p-2 h-8 w-8"
                size="sm"
              >
                {language === 'hindi' ? 'EN' : 'हिं'}
              </Button>
              
              {/* User Info - Tablet+ only */}
              <div className="hidden md:flex items-center space-x-2 bg-gradient-to-r from-blue-50 to-green-50 px-2 lg:px-3 py-1.5 lg:py-2 rounded-full border border-blue-200">
                <User className="h-3 w-3 lg:h-4 lg:w-4 text-blue-600" />
                <div className="text-xs">
                  <p className="font-medium text-gray-800 max-w-16 lg:max-w-24 xl:max-w-none truncate">
                    {language === 'hindi' ? 'नमस्ते' : 'Hello'}, {user.name.split(' / ')[language === 'hindi' ? 0 : 1] || user.name.split(' ')[0]}
                  </p>
                  <p className="text-xs text-gray-600 hidden lg:block">
                    {language === 'hindi' ? 'नागरिक' : 'Citizen'}
                  </p>
                </div>
              </div>

              {/* Mobile User Avatar */}
              <div className="md:hidden w-7 h-7 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center touch-target">
                <User className="h-3 w-3 text-white" />
              </div>
              
              {/* Desktop Actions */}
              <Button
                variant="outline"
                onClick={onViewProfile}
                className="border-orange-200 text-orange-700 hover:bg-orange-50 hidden xl:flex text-xs px-2 py-1"
                size="sm"
              >
                <User className="h-3 w-3 mr-1" />
                {language === 'hindi' ? 'प्रोफाइल' : 'Profile'}
              </Button>
              
              <Button
                variant="outline"
                onClick={onViewHistory}
                className="border-blue-200 text-blue-700 hover:bg-blue-50 hidden xl:flex text-xs px-2 py-1"
                size="sm"
              >
                <History className="h-3 w-3 mr-1" />
                {language === 'hindi' ? 'इतिहास' : 'History'}
              </Button>
              
              {/* Logout Button - Always visible but mobile optimized */}
              <Button
                variant="outline"
                onClick={onLogout}
                className="border-red-200 text-red-700 hover:bg-red-50 text-xs px-1.5 sm:px-3 py-1 touch-target"
                size="sm"
              >
                <LogOut className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-1" />
                <span className="hidden sm:inline text-xs">
                  {language === 'hindi' ? 'लॉगआउट' : 'Logout'}
                </span>
              </Button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 pb-24 md:pb-8">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-8"
        >
          <h2 className="text-4xl mb-3 bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
            {language === 'hindi' ? 'समस्या रिपोर्ट करें' : 'Report a Problem'}
          </h2>
          <p className="text-gray-600 text-lg mb-6">
            {language === 'hindi' 
              ? 'अपनी समस्या की तस्वीर अपलोड करें और विवरण दर्ज करें' 
              : 'Upload an image of your problem and enter details'}
          </p>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="bg-white/95 backdrop-blur-sm border-2 border-blue-200 shadow-2xl mx-1 sm:mx-0">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-green-50 border-b border-blue-200 p-4 sm:p-6">
              <CardTitle className="flex items-center space-x-2 sm:space-x-3 text-blue-700 text-base sm:text-lg lg:text-xl">
                <Camera className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7" />
                <span>
                  {language === 'hindi' ? 'नई समस्या रिपोर्ट' : 'New Problem Report'}
                </span>
              </CardTitle>
            </CardHeader>
            
            <CardContent className="p-4 sm:p-6 lg:p-8">
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6 lg:space-y-8">
                {/* Universal Image Upload - Works on all devices */}
                <UniversalImageUpload
                  imagePreview={imagePreview}
                  imageFile={imageFile}
                  onImageUpload={handleImageUpload}
                  onRemoveImage={handleRemoveImage}
                  language={language}
                  inputId="image-upload"
                />

                {/* Category Selection */}
                <div className="space-y-4">
                  <Label className="text-base font-medium">
                    {language === 'hindi' ? 'समस्या का प्रकार चुनें' : 'Select Problem Categories'}
                    {isAnalyzingImage && (
                      <span className="ml-2 text-sm text-blue-600">
                        {language === 'hindi' ? '(विश्लेषण हो रहा है...)' : '(Analyzing...)'}
                      </span>
                    )}
                  </Label>
                  
                  {/* Show message if no image uploaded yet */}
                  {!imageFile && (
                    <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                      <p className="text-sm text-gray-600 text-center">
                        {language === 'hindi' 
                          ? '📸 कृपया तस्वीर अपलोड करें - समस्या श्रेणियां AI द्वारा पहचानी जाएंगी' 
                          : '📸 Please upload an image - problem categories will be identified by AI'}
                      </p>
                    </div>
                  )}
                  
                  {/* Show AI-detected categories if available */}
                  {imageFile && backendCategories.length > 0 && (
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <h4 className="text-sm font-medium text-blue-700">
                          {language === 'hindi' ? 'AI द्वारा पहचानी गई श्रेणियां' : 'AI-Detected Categories'}
                        </h4>
                        <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                          ✨ AI
                        </span>
                        {selectedCategories.length > 0 && (
                          <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">
                            {selectedCategories.length} {language === 'hindi' ? 'चयनित' : 'selected'}
                          </span>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {backendCategories.map((category) => (
                          <button
                            key={`ai-${category}`}
                            type="button"
                            onClick={() => handleCategoryToggle(category)}
                            className={`p-3 rounded-lg border-2 text-sm font-medium transition-all duration-200 hover:shadow-md ${
                              selectedCategories.includes(category)
                                ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-md'
                                : 'border-blue-200 bg-blue-25 text-blue-700 hover:border-blue-400 hover:bg-blue-50'
                            }`}
                            disabled={isAnalyzingImage}
                          >
                            <span className="flex items-center space-x-2">
                              <span>✨</span>
                              <span>{category}</span>
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Show message when no categories found */}
                  {imageFile && backendCategories.length === 0 && !isAnalyzingImage && (
                    <div className="p-3 border border-orange-200 rounded-lg bg-orange-50">
                      <p className="text-sm text-orange-700 text-center">
                        {language === 'hindi' 
                          ? '🔍 कोई विशिष्ट समस्या श्रेणी नहीं मिली - कृपया नीचे समस्या का विस्तृत विवरण दें' 
                          : '🔍 No specific problem categories found - please provide detailed description below'}
                      </p>
                    </div>
                  )}
                  
                  {/* Instructions */}
                  <div className="p-3 border border-blue-200 rounded-lg bg-blue-50">
                    <p className="text-sm text-blue-700 text-center">
                      {language === 'hindi' 
                        ? '💡 तस्वीर अपलोड करके AI से समस्या श्रेणियों के सुझाव प्राप्त करें' 
                        : '💡 Upload an image to get AI suggestions for problem categories'}
                    </p>
                  </div>
                </div>

                {/* Priority Selection */}
                <div className="space-y-2">
                  <Label>{language === 'hindi' ? 'समस्या की प्राथमिकता' : 'Problem Priority'}</Label>
                  <Select 
                    value={reportData.priority} 
                    onValueChange={(value) => setReportData(prev => ({ ...prev, priority: value as 'low' | 'medium' | 'high' }))}
                  >
                    <SelectTrigger className="border-orange-200 focus:border-orange-500">
                      <SelectValue placeholder={language === 'hindi' ? 'प्राथमिकता चुनें' : 'Select Priority'} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">
                        <span className="flex items-center space-x-2">
                          <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                          <span>{language === 'hindi' ? 'उच्च प्राथमिकता' : 'High Priority'}</span>
                        </span>
                      </SelectItem>
                      <SelectItem value="medium">
                        <span className="flex items-center space-x-2">
                          <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                          <span>{language === 'hindi' ? 'मध्यम प्राथमिकता' : 'Medium Priority'}</span>
                        </span>
                      </SelectItem>
                      <SelectItem value="low">
                        <span className="flex items-center space-x-2">
                          <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                          <span>{language === 'hindi' ? 'कम प्राथमिकता' : 'Low Priority'}</span>
                        </span>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Custom Problem Input */}
                {reportData.category === t.categories.otherProblem && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-2"
                  >
                    <Label>
                      {language === 'hindi' ? 'अपनी समस्या का विवरण लिखें' : 'Describe Your Problem'}
                    </Label>
                    <Textarea
                      value={reportData.customProblem}
                      onChange={(e) => setReportData(prev => ({ ...prev, customProblem: e.target.value }))}
                      placeholder={language === 'hindi' ? 'अन्य समस्या का विवरण दर्ज करें...' : 'Enter details of other problem...'}
                      className="border-blue-200 focus:border-blue-500 resize-none min-h-20"
                      rows={3}
                    />
                  </motion.div>
                )}

                {/* Description */}
                <div className="space-y-2">
                  <Label>{language === 'hindi' ? 'समस्या का विवरण' : 'Problem Description'}</Label>
                  <Textarea
                    value={reportData.description}
                    onChange={(e) => setReportData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder={language === 'hindi' ? 'समस्या का विस्तृत विवरण लिखें...' : 'Describe the problem in detail...'}
                    className="border-blue-200 focus:border-blue-500 resize-none min-h-20"
                    rows={4}
                  />
                </div>

                {/* Location */}
                <div className="space-y-2">
                  <Label>{language === 'hindi' ? 'स्थान' : 'Location'}</Label>
                  <div className="relative">
                    <Input
                      type="text"
                      value={reportData.location}
                      onChange={(e) => setReportData(prev => ({ ...prev, location: e.target.value }))}
                      placeholder={language === 'hindi' ? 'पूरा पता लिखें (जैसे: मॉल रोड, कानपुर)' : 'Enter complete address (e.g., Mall Road, Kanpur)'}
                      className="border-blue-200 focus:border-blue-500 pr-24"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={getCurrentLocation}
                      disabled={isGettingLocation}
                      className="absolute right-1 top-1 h-8 px-2 border-blue-200 text-blue-600 hover:bg-blue-50"
                    >
                      {isGettingLocation ? (
                        <div className="w-3 h-3 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <Navigation className="h-3 w-3" />
                      )}
                      <span className="ml-1 text-xs hidden sm:inline">
                        {isGettingLocation 
                          ? (language === 'hindi' ? 'खोज रहे...' : 'Finding...')
                          : (language === 'hindi' ? 'GPS' : 'GPS')
                        }
                      </span>
                    </Button>
                  </div>
                </div>

                {/* Submit Button */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="pt-4"
                >
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white shadow-xl transform transition-all duration-300 hover:scale-105 disabled:scale-100 disabled:opacity-50"
                    size="lg"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>{language === 'hindi' ? 'भेजा जा रहा है...' : 'Submitting...'}</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <Send className="h-4 w-4" />
                        <span>{language === 'hindi' ? 'समस्या रिपोर्ट करें' : 'Submit Report'}</span>
                      </div>
                    )}
                  </Button>
                </motion.div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}