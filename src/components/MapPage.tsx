import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { 
  ArrowLeft, 
  LogOut, 
  MapPin, 
  Navigation,
  Zap,
  AlertCircle,
  Eye,
  Filter,
  Crosshair,
  Layers,
  RotateCcw
} from 'lucide-react';
import { Report } from '../App';
import { getTranslations, Language } from '../utils/translations';

interface MapPageProps {
  reports: Report[];
  allUsers?: Array<{
    id: string;
    name: string;
    email: string;
    phone: string;
    authType: 'aadhaar' | 'pan';
    authNumber: string;
    role?: 'citizen' | 'field-worker' | 'department-head' | 'district-magistrate';
    department?: string;
    address?: string;
  }>;
  onBackToDashboard: () => void;
  onLogout: () => void;
  language?: Language;
}

// Mock location data for Kanpur
const kanpurCenter = { lat: 26.4499, lng: 80.3319 };

// Enhanced mock problem locations around Kanpur with more realistic data
const mockLocations = [
  { id: 1, lat: 26.4499, lng: 80.3319, title: 'Mall Road - Traffic Congestion', category: 'Traffic & Roads', status: 'pending', reportedBy: 'रमेश कुमार', date: '2024-01-15', priority: 'high' },
  { id: 2, lat: 26.4625, lng: 80.3158, title: 'Civil Lines - Garbage Dump', category: 'Garbage & Waste', status: 'in-progress', reportedBy: 'सुनीता देवी', date: '2024-01-14', priority: 'medium', assignedWorker: 'विकास शर्मा' },
  { id: 3, lat: 26.4380, lng: 80.3496, title: 'Kakadeo - Open Drain', category: 'Drainage & Sewage', status: 'resolved', reportedBy: 'अनिल पटेल', date: '2024-01-10', priority: 'high', completedBy: 'अनिल कुमार' },
  { id: 4, lat: 26.4751, lng: 80.3421, title: 'Govind Nagar - Air Pollution', category: 'Pollution', status: 'pending', reportedBy: 'प्रिया गुप्ता', date: '2024-01-13', priority: 'medium' },
  { id: 5, lat: 26.4312, lng: 80.3282, title: 'Kidwai Nagar - Street Lighting', category: 'Other Issues', status: 'in-progress', reportedBy: 'राजेश सिंह', date: '2024-01-12', priority: 'low', assignedWorker: 'संजय वर्मा' },
  { id: 6, lat: 26.4567, lng: 80.3234, title: 'Barra - Slum Area Issues', category: 'Housing & Slums', status: 'pending', reportedBy: 'मीरा शर्मा', date: '2024-01-11', priority: 'high' },
  { id: 7, lat: 26.4445, lng: 80.3145, title: 'Swaroop Nagar - Water Supply', category: 'Water Supply', status: 'in-progress', reportedBy: 'विकास गोयल', date: '2024-01-09', priority: 'high', assignedWorker: 'राम प्रसाद' },
  { id: 8, lat: 26.4678, lng: 80.3387, title: 'Kalyanpur - Road Repair', category: 'Traffic & Roads', status: 'resolved', reportedBy: 'शिवम तिवारी', date: '2024-01-08', priority: 'medium', completedBy: 'मुकेश यादव' }
];

export default function MapPage({ reports, allUsers = [], onBackToDashboard, onLogout, language = 'hindi' }: MapPageProps) {
  const t = getTranslations(language);
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<any>(null);
  const [mapCenter, setMapCenter] = useState(kanpurCenter);
  const [mapZoom, setMapZoom] = useState(13);
  const [isLocationLoading, setIsLocationLoading] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Get user's current location
    if (navigator.geolocation) {
      const options = {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      };

      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.warn('Location access issue:', {
            code: error.code,
            message: error.message,
            timestamp: new Date().toISOString()
          });
          // Use default Kanpur location as fallback
          setUserLocation(kanpurCenter);
        },
        options
      );
    } else {
      console.info('Geolocation not supported, using default Kanpur location');
      setUserLocation(kanpurCenter);
    }
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved': return 'bg-green-500';
      case 'in-progress': return 'bg-yellow-500';
      default: return 'bg-red-500';
    }
  };

  const getCategoryIcon = (category: string) => {
    if (category.includes('Traffic')) return '🚗';
    if (category.includes('Garbage')) return '🗑️';
    if (category.includes('Drainage')) return '🌊';
    if (category.includes('Pollution')) return '🏭';
    if (category.includes('Housing')) return '🏠';
    if (category.includes('Water')) return '💧';
    return '⚠️';
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-red-500 shadow-red-200';
      case 'medium': return 'border-yellow-500 shadow-yellow-200';
      case 'low': return 'border-blue-500 shadow-blue-200';
      default: return 'border-gray-500 shadow-gray-200';
    }
  };

  const centerToUserLocation = async () => {
    setIsLocationLoading(true);
    
    if (!navigator.geolocation) {
      console.info('Geolocation not supported, using default Kanpur location');
      setUserLocation(kanpurCenter);
      setMapCenter(kanpurCenter);
      setIsLocationLoading(false);
      return;
    }

    const options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 60000
    };

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const newLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        setUserLocation(newLocation);
        setMapCenter(newLocation);
        setMapZoom(15);
        setIsLocationLoading(false);
      },
      (error) => {
        console.warn('Location access issue in centerToUserLocation:', {
          code: error.code,
          message: error.message,
          timestamp: new Date().toISOString()
        });
        
        // Use default Kanpur location as fallback
        setUserLocation(kanpurCenter);
        setMapCenter(kanpurCenter);
        setIsLocationLoading(false);
      },
      options
    );
  };

  // Combine real reports with mock locations for more comprehensive map data
  const allLocations = [
    ...mockLocations,
    ...reports.map(report => ({
      id: parseInt(report.id.split('-')[1]) + 100,
      lat: kanpurCenter.lat + (Math.random() - 0.5) * 0.1,
      lng: kanpurCenter.lng + (Math.random() - 0.5) * 0.1,
      title: report.description.substring(0, 50) + '...',
      category: report.category,
      status: report.status,
      reportedBy: report.citizenName || 'अज्ञात',
      date: new Date(report.submittedAt).toLocaleDateString('hi-IN'),
      priority: report.priority || 'medium',
      assignedWorker: report.assignedWorker ? 
        allUsers.find(u => u.id === report.assignedWorker)?.name : undefined,
      completedBy: report.status === 'resolved' && report.assignedWorker ?
        allUsers.find(u => u.id === report.assignedWorker)?.name : undefined
    }))
  ];

  const filteredLocations = selectedFilter === 'all' 
    ? allLocations 
    : allLocations.filter(loc => loc.status === selectedFilter);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-green-50">
      {/* Header */}
      <motion.header
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white/80 backdrop-blur-sm border-b border-orange-200 shadow-sm"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="flex space-x-1">
                <div className="w-3 h-6 bg-orange-500 rounded-sm shadow-sm" />
                <div className="w-3 h-6 bg-white border border-gray-300 rounded-sm shadow-sm" />
                <div className="w-3 h-6 bg-green-600 rounded-sm shadow-sm" />
              </div>
              <h1 className="text-2xl font-bold" style={{ color: '#FF9933' }}>
                VIKSIT KANPUR
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                onClick={onBackToDashboard}
                className="border-blue-200 text-blue-700 hover:bg-blue-50"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                {language === 'hindi' ? 'वापस' : 'Back'}
              </Button>
              <Button
                variant="outline"
                onClick={onLogout}
                className="border-red-200 text-red-700 hover:bg-red-50"
              >
                <LogOut className="h-4 w-4 mr-2" />
                {t.logout}
              </Button>
            </div>
          </div>
        </div>
      </motion.header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 pb-24 md:pb-8">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-8"
        >
          <h2 className="text-3xl mb-2">{language === 'hindi' ? 'समस्याओं का मैप' : 'Problem Map'}</h2>
          <p className="text-gray-600">{language === 'hindi' ? 'कानपुर में रिपोर्ट की गई समस्याओं का स्थान' : 'Location of Reported Problems in Kanpur'}</p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Map Section */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="bg-white/90 backdrop-blur-sm border border-gray-200 shadow-xl">
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-center">
                    <CardTitle className="flex items-center space-x-2 text-green-700">
                      <MapPin className="h-6 w-6" />
                      <span>{language === 'hindi' ? 'कानपुर समस्या मैप' : 'Kanpur Problem Map'}</span>
                    </CardTitle>
                    
                    {/* Filter Buttons */}
                    <div className="flex space-x-2">
                      {['all', 'pending', 'in-progress', 'resolved'].map((filter) => (
                        <Button
                          key={filter}
                          size="sm"
                          variant={selectedFilter === filter ? "default" : "outline"}
                          onClick={() => setSelectedFilter(filter)}
                          className="text-xs"
                        >
                          {filter === 'all' ? (language === 'hindi' ? 'सभी' : 'All') : 
                           filter === 'pending' ? t.status.pending :
                           filter === 'in-progress' ? t.status.inProgress : t.status.resolved}
                        </Button>
                      ))}
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  {/* Enhanced Interactive Map Interface */}
                  <div ref={mapRef} className="relative bg-gradient-to-br from-green-100 via-blue-50 to-green-100 rounded-lg h-[500px] overflow-hidden border-2 border-green-200 shadow-2xl">
                    {/* Enhanced Map Background with Roads Pattern */}
                    <div className="absolute inset-0 opacity-30" style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23059669' fill-opacity='0.1'%3E%3Cpath d='M0 0h40v40H0V0zm40 40h40v40H40V40z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                      backgroundSize: '80px 80px',
                    }} />

                    {/* Road Network Overlay */}
                    <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 500 500">
                      <motion.path
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 3, delay: 1 }}
                        d="M50 100 L450 100 M100 50 L100 450 M150 200 L350 200 M200 150 L200 350"
                        stroke="#059669"
                        strokeWidth="3"
                        fill="none"
                        strokeLinecap="round"
                      />
                      <motion.path
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 3, delay: 1.5 }}
                        d="M50 300 L450 300 M300 50 L300 450"
                        stroke="#059669"
                        strokeWidth="2"
                        fill="none"
                        strokeLinecap="round"
                      />
                    </svg>
                    
                    {/* Current Location with Enhanced Animation */}
                    {userLocation && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute"
                        style={{
                          top: '50%',
                          left: '50%',
                          transform: 'translate(-50%, -50%)'
                        }}
                      >
                        {/* Pulsing Circle Effect */}
                        <motion.div
                          animate={{ scale: [1, 1.5, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="absolute w-16 h-16 bg-blue-400 rounded-full opacity-30 -top-4 -left-4"
                        />
                        <motion.div
                          animate={{ scale: [1, 1.3, 1] }}
                          transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                          className="absolute w-12 h-12 bg-blue-500 rounded-full opacity-40 -top-2 -left-2"
                        />
                        <div className="flex items-center justify-center w-8 h-8 bg-blue-600 rounded-full border-4 border-white shadow-xl z-10 relative">
                          <Navigation className="h-4 w-4 text-white" />
                        </div>
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white text-xs px-3 py-1 rounded-full whitespace-nowrap shadow-lg"
                        >
                          {language === 'hindi' ? 'आपका स्थान' : 'Your Location'}
                        </motion.div>
                      </motion.div>
                    )}

                    {/* Enhanced Problem Locations */}
                    {filteredLocations.map((location, index) => {
                      const x = 20 + (index % 4) * 22;
                      const y = 15 + Math.floor(index / 4) * 25 + (index % 2) * 10;
                      
                      return (
                        <motion.div
                          key={location.id}
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ delay: 0.8 + index * 0.15 }}
                          className="absolute cursor-pointer group"
                          style={{
                            top: `${Math.min(y, 80)}%`,
                            left: `${Math.min(x, 85)}%`,
                          }}
                          onClick={() => setSelectedLocation(location)}
                        >
                          {/* Priority Border */}
                          <motion.div
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{ duration: 3, repeat: Infinity, delay: index * 0.3 }}
                            className={`w-8 h-8 rounded-full border-2 ${getPriorityColor(location.priority)} absolute -top-2 -left-2 opacity-50`}
                          />
                          
                          {/* Status Indicator */}
                          <div className={`w-4 h-4 ${getStatusColor(location.status)} rounded-full border-2 border-white shadow-lg relative z-10`}>
                            {location.status === 'in-progress' && (
                              <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                                className="w-2 h-2 bg-white rounded-full absolute top-1 left-1"
                              />
                            )}
                          </div>
                          
                          {/* Category Icon */}
                          <motion.div
                            whileHover={{ scale: 1.2 }}
                            className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-lg filter drop-shadow-lg"
                          >
                            {getCategoryIcon(location.category)}
                          </motion.div>
                          
                          {/* Hover Tooltip */}
                          <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-20 pointer-events-none">
                            {location.title}
                          </div>
                        </motion.div>
                      );
                    })}

                    {/* Enhanced Map Controls */}
                    <div className="absolute bottom-4 right-4 flex flex-col space-y-2">
                      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                        <Button 
                          size="sm" 
                          variant="secondary" 
                          className="w-12 h-12 p-0 bg-white/90 backdrop-blur-sm shadow-xl border border-gray-200 hover:bg-white"
                          onClick={() => setMapZoom(prev => Math.min(prev + 1, 18))}
                        >
                          <span className="text-lg">+</span>
                        </Button>
                      </motion.div>
                      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                        <Button 
                          size="sm" 
                          variant="secondary" 
                          className="w-12 h-12 p-0 bg-white/90 backdrop-blur-sm shadow-xl border border-gray-200 hover:bg-white"
                          onClick={() => setMapZoom(prev => Math.max(prev - 1, 10))}
                        >
                          <span className="text-lg">-</span>
                        </Button>
                      </motion.div>
                      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                        <Button 
                          size="sm" 
                          variant="secondary" 
                          className="w-12 h-12 p-0 bg-white/90 backdrop-blur-sm shadow-xl border border-gray-200 hover:bg-white"
                          onClick={() => {
                            setMapCenter(kanpurCenter);
                            setMapZoom(13);
                          }}
                        >
                          <RotateCcw className="h-4 w-4" />
                        </Button>
                      </motion.div>
                    </div>

                    {/* Layer Toggle */}
                    <div className="absolute top-4 right-4">
                      <motion.div whileHover={{ scale: 1.05 }}>
                        <Button 
                          size="sm" 
                          variant="secondary" 
                          className="bg-white/90 backdrop-blur-sm shadow-xl border border-gray-200"
                        >
                          <Layers className="h-4 w-4 mr-2" />
                          Layers
                        </Button>
                      </motion.div>
                    </div>

                    {/* Map Attribution */}
                    <div className="absolute bottom-2 left-2 text-xs text-gray-500 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-lg">
                      © VIKSIT KANPUR • Real-time Data
                    </div>

                    {/* Loading Overlay */}
                    {isLocationLoading && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="absolute inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-30"
                      >
                        <div className="bg-white rounded-lg p-4 shadow-xl flex items-center space-x-3">
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                            className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full"
                          />
                          <span className="text-gray-700">लोकेशन खोजी जा रही है...</span>
                        </div>
                      </motion.div>
                    )}
                  </div>

                  {/* Enhanced Control Buttons */}
                  <div className="flex justify-center gap-4 mt-6">
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        variant="outline"
                        onClick={centerToUserLocation}
                        disabled={isLocationLoading}
                        className="border-blue-200 text-blue-700 hover:bg-blue-50 shadow-lg"
                      >
                        {isLocationLoading ? (
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                            className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full mr-2"
                          />
                        ) : (
                          <Crosshair className="h-4 w-4 mr-2" />
                        )}
                        मेरा स्थान / My Location
                      </Button>
                    </motion.div>
                    
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setSelectedFilter('all');
                          setMapCenter(kanpurCenter);
                          setMapZoom(13);
                        }}
                        className="border-green-200 text-green-700 hover:bg-green-50 shadow-lg"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        सभी समस्याएं / All Issues
                      </Button>
                    </motion.div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Problem Details Sidebar */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="space-y-6"
            >
              {/* Legend */}
              <Card className="bg-white/90 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-lg">लेजेंड / Legend</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                    <span className="text-sm">लंबित / Pending</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
                    <span className="text-sm">प्रगति में / In Progress</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                    <span className="text-sm">हल हो गया / Resolved</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Navigation className="h-4 w-4 text-blue-600" />
                    <span className="text-sm">आपका स्थान / Your Location</span>
                  </div>
                </CardContent>
              </Card>

              {/* Enhanced Selected Location Details */}
              {selectedLocation && (
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="space-y-4"
                >
                  <Card className="bg-white/95 backdrop-blur-sm border-2 border-orange-200 shadow-xl">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg flex items-center space-x-2">
                        <Eye className="h-5 w-5 text-orange-600" />
                        <span>समस्या विवरण / Issue Details</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h4 className="font-medium mb-2 text-gray-900">{selectedLocation.title}</h4>
                        <div className="flex gap-2 mb-3">
                          <Badge className={`${
                            selectedLocation.status === 'resolved' ? 'bg-green-100 text-green-800 border-green-300' :
                            selectedLocation.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800 border-yellow-300' :
                            'bg-red-100 text-red-800 border-red-300'
                          } border`}>
                            {selectedLocation.status === 'resolved' ? 'हल हो गया' :
                             selectedLocation.status === 'in-progress' ? 'प्रगति में' : 'लंबित'}
                          </Badge>
                          <Badge className={`${
                            selectedLocation.priority === 'high' ? 'bg-red-50 text-red-700 border-red-200' :
                            selectedLocation.priority === 'medium' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                            'bg-blue-50 text-blue-700 border-blue-200'
                          } border`}>
                            {selectedLocation.priority === 'high' ? 'उच्च प्राथमिकता' :
                             selectedLocation.priority === 'medium' ? 'मध्यम प्राथमिकता' : 'कम प्राथमिकता'}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">श्रेणी / Category:</span>
                          <span className="font-medium">{selectedLocation.category}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">रिपोर्ट किया गया / Reported by:</span>
                          <span className="font-medium">{selectedLocation.reportedBy}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">दिनांक / Date:</span>
                          <span className="font-medium">{selectedLocation.date}</span>
                        </div>
                        {selectedLocation.assignedWorker && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">कार्यकर्ता / Worker:</span>
                            <span className="font-medium text-blue-700">{selectedLocation.assignedWorker}</span>
                          </div>
                        )}
                        {selectedLocation.completedBy && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">पूर्ण किया गया / Completed by:</span>
                            <span className="font-medium text-green-700">{selectedLocation.completedBy}</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex gap-2 pt-3">
                        <Button 
                          size="sm" 
                          className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                          onClick={() => {
                            // Center map on selected location
                            setMapCenter({ lat: selectedLocation.lat, lng: selectedLocation.lng });
                            setMapZoom(16);
                          }}
                        >
                          <MapPin className="h-4 w-4 mr-1" />
                          मैप पर केंद्रित करें
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => setSelectedLocation(null)}
                          className="border-gray-300 hover:bg-gray-50"
                        >
                          बंद करें
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* Enhanced Problem Statistics */}
              <Card className="bg-white/95 backdrop-blur-sm shadow-xl">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center space-x-2">
                    <AlertCircle className="h-5 w-5 text-blue-600" />
                    <span>आंकड़े / Live Statistics</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-3 text-center">
                    <motion.div 
                      whileHover={{ scale: 1.05 }}
                      className="bg-gradient-to-br from-red-50 to-red-100 p-4 rounded-lg border border-red-200 shadow-sm"
                    >
                      <motion.div 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-2xl text-red-600 mb-1 font-bold"
                      >
                        {allLocations.filter(l => l.status === 'pending').length}
                      </motion.div>
                      <div className="text-xs text-red-800 font-medium">लंबित / Pending</div>
                    </motion.div>
                    
                    <motion.div 
                      whileHover={{ scale: 1.05 }}
                      className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-4 rounded-lg border border-yellow-200 shadow-sm"
                    >
                      <motion.div 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.4 }}
                        className="text-2xl text-yellow-600 mb-1 font-bold"
                      >
                        {allLocations.filter(l => l.status === 'in-progress').length}
                      </motion.div>
                      <div className="text-xs text-yellow-800 font-medium">प्रगति में / In Progress</div>
                    </motion.div>
                    
                    <motion.div 
                      whileHover={{ scale: 1.05 }}
                      className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg border border-green-200 shadow-sm"
                    >
                      <motion.div 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.6 }}
                        className="text-2xl text-green-600 mb-1 font-bold"
                      >
                        {allLocations.filter(l => l.status === 'resolved').length}
                      </motion.div>
                      <div className="text-xs text-green-800 font-medium">हल हो गया / Resolved</div>
                    </motion.div>
                    
                    <motion.div 
                      whileHover={{ scale: 1.05 }}
                      className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200 shadow-sm"
                    >
                      <motion.div 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.8 }}
                        className="text-2xl text-blue-600 mb-1 font-bold"
                      >
                        {allLocations.length}
                      </motion.div>
                      <div className="text-xs text-blue-800 font-medium">कुल / Total</div>
                    </motion.div>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="mt-6">
                    <div className="flex justify-between text-xs text-gray-600 mb-2">
                      <span>समाधान दर / Resolution Rate</span>
                      <span>{Math.round((allLocations.filter(l => l.status === 'resolved').length / allLocations.length) * 100)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${(allLocations.filter(l => l.status === 'resolved').length / allLocations.length) * 100}%` }}
                        transition={{ delay: 1, duration: 1.5 }}
                        className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Real-time Updates */}
              <Card className="bg-white/95 backdrop-blur-sm shadow-xl border border-green-200">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center space-x-2">
                    <Zap className="h-5 w-5 text-green-600" />
                    <span>लाइव अपडेट / Live Updates</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    <motion.div 
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 1.2 }}
                      className="flex items-center space-x-3 p-2 bg-green-50 rounded-lg border border-green-200"
                    >
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                      <div>
                        <div className="font-medium text-green-800">Kakadeo - Open Drain</div>
                        <div className="text-green-600">हल हो गया • 2 min ago</div>
                      </div>
                    </motion.div>
                    
                    <motion.div 
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 1.4 }}
                      className="flex items-center space-x-3 p-2 bg-yellow-50 rounded-lg border border-yellow-200"
                    >
                      <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
                      <div>
                        <div className="font-medium text-yellow-800">Civil Lines - Garbage</div>
                        <div className="text-yellow-600">कार्य प्रगति में • 5 min ago</div>
                      </div>
                    </motion.div>
                    
                    <motion.div 
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 1.6 }}
                      className="flex items-center space-x-3 p-2 bg-blue-50 rounded-lg border border-blue-200"
                    >
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                      <div>
                        <div className="font-medium text-blue-800">New Report Received</div>
                        <div className="text-blue-600">नई शिकायत • 8 min ago</div>
                      </div>
                    </motion.div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}