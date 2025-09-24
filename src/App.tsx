import React, { useState, useEffect, Suspense } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import SafeComponent from './components/SafeComponent';
import LoadingSpinner from './components/LoadingSpinner';
import LoginPage from './components/LoginPage';
import RegistrationPage from './components/RegistrationPage';
import Dashboard from './components/Dashboard_Fixed';
import MobileDashboard from './components/MobileDashboard';
import HistoryPage from './components/HistoryPage';
import MapPage from './components/MapPage';
import ProfilePage from './components/EnhancedProfilePageWithLanguageToggle';
import AdminLoginPage from './components/AdminLoginPage';
import AdminDashboard from './components/AdminDashboard';
import AdminComplaints from './components/AdminComplaints';
import AdminDepartments from './components/AdminDepartments';
import AdminWorkers from './components/AdminWorkers';
import AdminMapView from './components/AdminMapView';
// Removed AdminReports import
import AdminAnalytics from './components/AdminAnalyticsRobust';
import AdminNotifications from './components/EnhancedAdminNotifications';
import { api, getAuthToken, removeAuthToken } from './utils/api';
import AdminSettings from './components/EnhancedAdminSettings';
import FieldWorkerDashboard from './components/FieldWorkerDashboard';
import FieldWorkerNotifications from './components/FieldWorkerNotifications';
import FieldWorkerProfile from './components/FieldWorkerProfile';
import DepartmentHeadDashboard from './components/DepartmentHeadDashboard';
import DepartmentHeadNotifications from './components/DepartmentHeadNotifications';
import DepartmentHeadProfile from './components/DepartmentHeadProfile';
import DistrictMagistrateDashboard from './components/DistrictMagistrateDashboard';
import DistrictMagistrateNotifications from './components/DistrictMagistrateNotifications';
import DistrictMagistrateProfile from './components/DistrictMagistrateProfile';

import MobileNavigation from './components/MobileNavigation';
import FloatingActionButton from './components/FloatingActionButton';
import { PWAInstaller } from './components/PWAInstaller';
import ErrorBoundary from './components/ErrorBoundary';
import MobileViewport from './components/MobileViewport';
import { Toaster } from './components/ui/sonner';
import { toast } from 'sonner';

export type User = {
  id: string;
  name: string;
  email: string;
  phone: string;
  authType: 'aadhaar' | 'pan';
  authNumber: string;
  role?: 'citizen' | 'field-worker' | 'department-head' | 'district-magistrate';
  department?: string;
  address?: string;
  avatar_url?: string;
};

export type Report = {
  id: string;
  image: string;
  description: string;
  category: string;
  location: string;
  submittedAt: Date;
  status: 'pending' | 'in-progress' | 'resolved';
  assignedWorker?: string;
  assignedDepartment?: string;
  citizenName?: string;
  citizenPhone?: string;
  proofImage?: string;
  priority?: 'low' | 'medium' | 'high';
  estimatedResolution?: Date;
  geotag?: {
    latitude: number;
    longitude: number;
    accuracy?: number;
    address?: string;
    capturedBy: string;
    capturedByPhone: string;
    capturedAt: Date;
    deviceInfo?: string;
  };
  statusHistory?: Array<{
    status: string;
    timestamp: Date;
    updatedBy: string;
    notes?: string;
  }>;
};

// Enhanced category to department mapping
const categoryToDepartmentMapping: Record<string, string> = {
  'कचरा और गंदगी': 'Public Works',
  'Garbage & Waste': 'Public Works',
  'ट्रैफिक और सड़क': 'Public Works', 
  'Traffic & Roads': 'Public Works',
  'प्रदूषण': 'Environment',
  'Pollution': 'Environment',
  'नालियां और सीवर': 'Public Works',
  'Drainage & Sewage': 'Public Works',
  'सार्वजनिक स्थान': 'Public Works',
  'Public Spaces': 'Public Works',
  'आवास और झुग्गियां': 'Urban Development',
  'Housing & Slums': 'Urban Development',
  'पानी की समस्या': 'Water Works',
  'Water Issues': 'Water Works',
  'बिजली की समस्या': 'Electricity',
  'Electricity Issues': 'Electricity',
  'शिक्षा': 'Education',
  'Education': 'Education',
  'स्वास्थ्य': 'Health',
  'Health': 'Health',
  'अन्य समस्याएं': 'General Administration',
  'Other Issues': 'General Administration'
};

// Mock data with better connectivity - Enhanced for comprehensive testing
const mockReports: Report[] = [
  {
    id: 'report-001',
    image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2RkZGRkZCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LXNpemU9IjE4IiBmaWxsPSIjOTk5OTk5IiBkeT0iLjNlbSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+R2FyYmFnZSBJc3N1ZTwvdGV4dD48L3N2Zz4=',
    description: 'सड़क पर कूड़ा फैला हुआ है और बदबू आ रही है',
    category: 'कचरा और गंदगी / Garbage & Waste',
    location: 'Mall Road, Kanpur (GPS: 26.4499, 80.3319)',
    submittedAt: new Date('2024-01-15T10:30:00'),
    status: 'pending',
    citizenName: 'राम कुमार',
    citizenPhone: '9876543210',
    assignedDepartment: 'Public Works',
    priority: 'high',
    geotag: {
      latitude: 26.4499,
      longitude: 80.3319,
      accuracy: 8,
      address: 'Mall Road, Kanpur',
      capturedBy: 'राम कुमार',
      capturedByPhone: '9876543210',
      capturedAt: new Date('2024-01-15T10:30:00'),
      deviceInfo: 'VIKSIT KANPUR Mobile App'
    },
    statusHistory: [{
      status: 'pending',
      timestamp: new Date('2024-01-15T10:30:00'),
      updatedBy: 'System',
      notes: 'शिकायत प्राप्त हुई और Public Works विभाग को भेजी गई'
    }]
  },
  {
    id: 'report-002',
    image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2RkZGRkZCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LXNpemU9IjE4IiBmaWxsPSIjOTk5OTk5IiBkeT0iLjNlbSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+Um9hZCBEYW1hZ2U8L3RleHQ+PC9zdmc+',
    description: 'सड़क में बड़े गड्ढे हैं जो दुर्घटना का कारण बन सकते हैं',
    category: 'ट्रैफिक और सड़क / Traffic & Roads',
    location: 'Civil Lines, Kanpur (GPS: 26.4648, 80.3318)', 
    submittedAt: new Date('2024-01-14T14:20:00'),
    status: 'in-progress',
    citizenName: 'सुनीता शर्मा',
    citizenPhone: '9876543211',
    assignedWorker: 'worker1',
    assignedDepartment: 'Public Works',
    priority: 'medium',
    geotag: {
      latitude: 26.4648,
      longitude: 80.3318,
      accuracy: 12,
      address: 'Civil Lines, Kanpur',
      capturedBy: 'सुनीता शर्मा',
      capturedByPhone: '9876543211',
      capturedAt: new Date('2024-01-14T14:20:00'),
      deviceInfo: 'VIKSIT KANPUR Mobile App'
    },
    statusHistory: [
      {
        status: 'pending',
        timestamp: new Date('2024-01-14T14:20:00'),
        updatedBy: 'System',
        notes: 'शिकायत प्राप्त हुई'
      },
      {
        status: 'in-progress',
        timestamp: new Date('2024-01-15T09:15:00'),
        updatedBy: 'राजेश कुमार (Dept Head)',
        notes: 'विकास यादव को कार्य सौंपा गया'
      }
    ]
  },
  {
    id: 'report-003',
    image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2RkZGRkZCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LXNpemU9IjE4IiBmaWxsPSIjOTk5OTk5IiBkeT0iLjNlbSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+RHJhaW5hZ2U8L3RleHQ+PC9zdmc+',
    description: 'नालियां बंद हैं और बारिश का पानी जमा हो रहा है',
    category: 'नालियां और सीवर / Drainage & Sewage',
    location: 'Swaroop Nagar, Kanpur (GPS: 26.4721, 80.3431)',
    submittedAt: new Date('2024-01-12T16:45:00'),
    status: 'resolved',
    citizenName: 'अजय गुप्ता',
    citizenPhone: '9876543212',
    assignedWorker: 'worker1',
    assignedDepartment: 'Public Works',
    priority: 'high',
    geotag: {
      latitude: 26.4721,
      longitude: 80.3431,
      accuracy: 15,
      address: 'Swaroop Nagar, Kanpur',
      capturedBy: 'अजय गुप्ता',
      capturedByPhone: '9876543212',
      capturedAt: new Date('2024-01-12T16:45:00'),
      deviceInfo: 'VIKSIT KANPUR Mobile App'
    },
    proofImage: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iIzRmYzNmNyIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LXNpemU9IjE4IiBmaWxsPSIjZmZmZmZmIiBkeT0iLjNlbSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+Q29tcGxldGVkPC90ZXh0Pjwvc3ZnPg==',
    statusHistory: [
      {
        status: 'pending',
        timestamp: new Date('2024-01-12T16:45:00'),
        updatedBy: 'System',
        notes: 'शिकायत प्राप्त हुई'
      },
      {
        status: 'in-progress',
        timestamp: new Date('2024-01-13T10:30:00'),
        updatedBy: 'राजेश कुमार (Dept Head)',
        notes: 'विकास यादव को भेजा गया'
      },
      {
        status: 'resolved',
        timestamp: new Date('2024-01-14T15:20:00'),
        updatedBy: 'विकास यादव (Field Worker)',
        notes: 'नाली की सफाई पूरी, प्रमाण फोटो अपलोड की गई'
      }
    ]
  },
  {
    id: 'report-004',
    image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2RkZGRkZCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LXNpemU9IjE4IiBmaWxsPSIjOTk5OTk5IiBkeT0iLjNlbSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+V2F0ZXIgSXNzdWU8L3RleHQ+PC9zdmc+',
    description: 'पानी की आपूर्ति पिछले 3 दिनों से बंद है',
    category: 'पानी की समस्या / Water Issues',
    location: 'Govind Nagar, Kanpur (GPS: 26.4889, 80.3167)',
    submittedAt: new Date('2024-01-13T08:15:00'),
    status: 'pending',
    citizenName: 'मोहन शर्मा',
    citizenPhone: '9876543214',
    assignedDepartment: 'Water Works',
    priority: 'high',
    geotag: {
      latitude: 26.4889,
      longitude: 80.3167,
      accuracy: 10,
      address: 'Govind Nagar, Kanpur',
      capturedBy: 'मोहन शर्मा',
      capturedByPhone: '9876543214',
      capturedAt: new Date('2024-01-13T08:15:00'),
      deviceInfo: 'VIKSIT KANPUR Mobile App'
    },
    statusHistory: [{
      status: 'pending',
      timestamp: new Date('2024-01-13T08:15:00'),
      updatedBy: 'System',
      notes: 'शिकायत प्राप्त हुई और Water Works विभाग को भेजी गई'
    }]
  },
  {
    id: 'report-005',
    image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2RkZGRkZCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LXNpemU9IjE4IiBmaWxsPSIjOTk5OTk5IiBkeT0iLjNlbSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+RWxlY3RyaWNpdHk8L3RleHQ+PC9zdmc+',
    description: 'स्ट्रीट लाइट काम नहीं कर रही, रात में अंधेरा रहता है',
    category: 'बिजली की समस्या / Electricity Issues',
    location: 'Kalyanpur, Kanpur (GPS: 26.5125, 80.2392)',
    submittedAt: new Date('2024-01-16T19:30:00'),
    status: 'in-progress',
    citizenName: 'प्रिया वर्मा',
    citizenPhone: '9876543213',
    assignedWorker: 'worker3',
    assignedDepartment: 'Electricity',
    priority: 'medium',
    geotag: {
      latitude: 26.5125,
      longitude: 80.2392,
      accuracy: 18,
      address: 'Kalyanpur, Kanpur',
      capturedBy: 'प्रिया वर्मा',
      capturedByPhone: '9876543213',
      capturedAt: new Date('2024-01-16T19:30:00'),
      deviceInfo: 'VIKSIT KANPUR Mobile App'
    },
    statusHistory: [
      {
        status: 'pending',
        timestamp: new Date('2024-01-16T19:30:00'),
        updatedBy: 'System',
        notes: 'शिकायत प्राप्त हुई'
      },
      {
        status: 'in-progress',
        timestamp: new Date('2024-01-17T10:00:00'),
        updatedBy: 'अमित पटेल (Dept Head)',
        notes: 'इलेक्ट्रिशियन भेजा गया'
      }
    ]
  }
];

// Enhanced users with proper department assignments
const mockUsers: User[] = [
  {
    id: 'user1',
    name: 'राम कुमार',
    email: 'ram.kumar@example.com',
    phone: '9876543210',
    authType: 'aadhaar',
    authNumber: '123456789012',
    role: 'citizen',
    address: 'Mall Road, Kanpur'
  },
  
  // District Magistrate
  {
    id: 'admin1',
    name: 'डॉ. प्रिया शर्मा',
    email: 'priya.sharma@kanpur.gov.in',
    phone: '9876543213',
    authType: 'aadhaar',
    authNumber: '123456789013',
    role: 'district-magistrate',
    department: 'District Administration'
  },
  
  // Department Heads
  {
    id: 'depthead1',
    name: 'राजेश कुमार',
    email: 'rajesh.kumar@kanpur.gov.in',
    phone: '9876543215',
    authType: 'aadhaar',
    authNumber: '123456789015',
    role: 'department-head',
    department: 'Public Works'
  },
  {
    id: 'depthead2',
    name: 'सुनीता गुप्ता',
    email: 'sunita.gupta@kanpur.gov.in',
    phone: '9876543217',
    authType: 'aadhaar',
    authNumber: '123456789017',
    role: 'department-head',
    department: 'Water Works'
  },
  {
    id: 'depthead3',
    name: 'अमित पटेल',
    email: 'amit.patel@kanpur.gov.in',
    phone: '9876543219',
    authType: 'aadhaar',
    authNumber: '123456789019',
    role: 'department-head',
    department: 'Electricity'
  },
  
  // Field Workers
  {
    id: 'worker1',
    name: 'विकास यादव',
    email: 'vikas.yadav@kanpur.gov.in',
    phone: '9876543214',
    authType: 'aadhaar',
    authNumber: '123456789014',
    role: 'field-worker',
    department: 'Public Works'
  },
  {
    id: 'worker2',
    name: 'रामेश सिंह',
    email: 'ramesh.singh@kanpur.gov.in',
    phone: '9876543216',
    authType: 'aadhaar',
    authNumber: '123456789016',
    role: 'field-worker',
    department: 'Water Works'
  },
  {
    id: 'worker3',
    name: 'संजय कुमार',
    email: 'sanjay.kumar@kanpur.gov.in',
    phone: '9876543218',
    authType: 'aadhaar',
    authNumber: '123456789018',
    role: 'field-worker',
    department: 'Electricity'
  }
];

export default function App() {
  const [currentPage, setCurrentPage] = useState<'login' | 'register' | 'dashboard' | 'history' | 'map' | 'profile' | 'admin-login' | 'admin-dashboard' | 'admin-complaints' | 'admin-departments' | 'admin-workers' | 'admin-map' | 'admin-analytics' | 'admin-notifications' | 'admin-settings' | 'field-worker-dashboard' | 'field-worker-notifications' | 'field-worker-profile' | 'department-head-dashboard' | 'department-head-notifications' | 'department-head-profile' | 'district-magistrate-notifications' | 'district-magistrate-profile'>('login');
  const [user, setUser] = useState<User | null>(null);
  const [language, setLanguage] = useState<'hindi' | 'english'>('hindi');
  const [reports, setReports] = useState<Report[]>(mockReports);
  const [allUsers, setAllUsers] = useState<User[]>(mockUsers);
  const [isLoading, setIsLoading] = useState(false);
  const [appInitialized, setAppInitialized] = useState(false);

  // App initialization - Simplified and optimized
  // Load admin data when user changes to admin role
  useEffect(() => {
    if (user && user.role !== 'citizen') {
      // Load all problems and users for admin users
      loadAllProblems();
    }
  }, [user?.id, user?.role]);

  useEffect(() => {
    // Initialize app immediately to prevent timeouts
    setAppInitialized(true);
    
    // Optional service worker registration (non-blocking)
    const registerServiceWorker = () => {
      const isDev = window.location.hostname === 'localhost' || 
                    window.location.hostname.includes('figma') ||
                    window.location.hostname.includes('preview');
      
      if (!isDev && 'serviceWorker' in navigator) {
        // Register in background without blocking app initialization
        navigator.serviceWorker.register('/sw.js')
          .then(registration => {
            console.log('SW registered:', registration.scope);
          })
          .catch(error => {
            console.warn('SW registration failed:', error);
          });
      }
    };
    
    // Register SW after a short delay to not block initial render
    const timeoutId = setTimeout(registerServiceWorker, 100);
    return () => clearTimeout(timeoutId);
  }, []);

  // Enhanced login function
  const handleLogin = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      
      // Use real backend API for login
      const { user, token } = await api.login(email, password);
      
      // Set auth token for API calls
      if (token) {
        localStorage.setItem('auth_token', token);
      }
      
      // Convert backend user to frontend user format
      const loggedInUser: User = {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone_number,
        authType: 'aadhaar',
        authNumber: user.aadhar,
        role: user.role as 'citizen' | 'district-magistrate' | 'department-head' | 'field-worker',
        address: user.address,
        department: user.department
      };
      
      setUser(loggedInUser);
      setCurrentPage('dashboard');
      toast.success(language === 'hindi' ? 'सफलतापूर्वक लॉगिन हो गए!' : 'Successfully logged in!');
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Login error';
      toast.error(language === 'hindi' ? 'लॉगिन में त्रुटि: ' + errorMessage : 'Login error: ' + errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Enhanced admin login function
  const handleAdminLogin = async (email: string, password: string, role: string, department?: string) => {
    try {
      setIsLoading(true);
      
      // Use real backend API for login
      const { user, token } = await api.adminLogin(email, password);
      
      // Set auth token for API calls
      if (token) {
        localStorage.setItem('auth_token', token);
      }
      
      // Check if user has the required admin role
      if (!['district-magistrate', 'department-head', 'field-worker'].includes(user.role)) {
        toast.error(language === 'hindi' ? 'आपके पास एडमिन अधिकार नहीं हैं' : 'You do not have admin privileges');
        return;
      }
      
      // Convert backend user to frontend user format
      const adminUser: User = {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone_number,
        authType: 'aadhaar',
        authNumber: user.aadhar,
        role: user.role as 'district-magistrate' | 'department-head' | 'field-worker',
        department: user.department,
        address: user.address
      };
      
      setUser(adminUser);
      
      // Enhanced routing based on role
      if (user.role === 'field-worker') {
        setCurrentPage('field-worker-dashboard');
      } else if (user.role === 'department-head') {
        setCurrentPage('department-head-dashboard');
      } else if (user.role === 'district-magistrate') {
        setCurrentPage('admin-dashboard');
      } else {
        setCurrentPage('admin-dashboard');
      }
      
      // Load all problems for admin users
      setTimeout(async () => {
        console.log('🔄 Starting to load admin data...');
        const tempUser = adminUser;
        if (tempUser.role !== 'citizen') {
          try {
            console.log('📞 Calling api.getAllProblems()...');
            const { problems } = await api.getAllProblems();
            console.log('✅ Received problems from API:', problems?.length || 0, 'problems');
            
            if (!problems || problems.length === 0) {
              console.warn('⚠️ No problems received from API, keeping mock data');
              toast.info(language === 'hindi' ? 'कोई शिकायत नहीं मिली, डेमो डेटा दिखाया जा रहा है' : 'No complaints found, showing demo data');
              return;
            }
            
            // Convert backend problems to frontend report format
            const allReports: Report[] = problems.map((problem, index) => {
              console.log(`Converting problem ${index + 1}:`, problem.id);
              
              // Safely handle potential data issues
              const safeLatitude = typeof problem.latitude === 'string' ? parseFloat(problem.latitude) : problem.latitude;
              const safeLongitude = typeof problem.longitude === 'string' ? parseFloat(problem.longitude) : problem.longitude;
              const safeProblemCategories = Array.isArray(problem.problem_categories) ? problem.problem_categories : [];
              
              return {
                id: String(problem.id),
                category: safeProblemCategories[0] || 'Other Issues',
                description: problem.others_text || 'No description',
                location: `${safeLatitude}, ${safeLongitude}`,
                image: problem.user_image_base64 ? 
                  `data:${problem.user_image_mimetype};base64,${problem.user_image_base64}` : 
                  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2RkZGRkZCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LXNpemU9IjE4IiBmaWxsPSIjOTk5OTk5IiBkeT0iLjNlbSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+Tm8gSW1hZ2U8L3RleHQ+PC9zdmc+',
                submittedAt: new Date(problem.created_at),
                status: problem.status === 'not completed' ? 'pending' : 
                        problem.status === 'in-progress' ? 'in-progress' : 
                        problem.status === 'completed' ? 'resolved' : 'pending',
                citizenName: problem.user_name || 'Unknown',
                citizenPhone: problem.user_email || 'N/A',
                assignedDepartment: problem.assigned_department || categoryToDepartmentMapping[safeProblemCategories[0]] || 'General Administration',
                assignedWorker: problem.assigned_worker_id ? String(problem.assigned_worker_id) : undefined,
                priority: (problem.priority as 'low' | 'medium' | 'high') || 'medium',
                geotag: {
                  latitude: safeLatitude,
                  longitude: safeLongitude,
                  accuracy: 10,
                  address: `${safeLatitude}, ${safeLongitude}`,
                  capturedBy: problem.user_name || 'Unknown',
                  capturedByPhone: problem.user_email || 'N/A',
                  capturedAt: new Date(problem.created_at),
                  deviceInfo: 'VIKSIT KANPUR Mobile App'
                },
                statusHistory: [{
                  status: problem.status === 'not completed' ? 'pending' : 
                          problem.status === 'in-progress' ? 'in-progress' : 
                          problem.status === 'completed' ? 'resolved' : 'pending',
                  timestamp: new Date(problem.created_at),
                  updatedBy: 'System',
                  notes: language === 'hindi' ? 'शिकायत प्राप्त हुई' : 'Complaint received'
                }]
              };
            });
            
            setReports(allReports);
            console.log(`✅ Successfully loaded ${allReports.length} real complaints for admin dashboard`);
            toast.success(language === 'hindi' ? `${allReports.length} शिकायतें लोड की गईं` : `Loaded ${allReports.length} complaints`);
            
            // Also load all users for admin dashboard
            try {
              console.log('📞 Calling api.getAllUsers()...');
              const { users } = await api.getAllUsers();
              console.log('✅ Received users from API:', users?.length || 0, 'users');
              
              const formattedUsers: User[] = users.map(user => ({
                id: user.id,
                name: user.name,
                email: user.email,
                phone: user.phone_number,
                authType: 'aadhaar',
                authNumber: user.aadhar,
                role: user.role as 'citizen' | 'field-worker' | 'department-head' | 'district-magistrate',
                department: user.department,
                address: user.address,
                avatar_url: user.avatar_url
              }));
              setAllUsers(formattedUsers);
              console.log(`✅ Successfully loaded ${formattedUsers.length} real users for admin dashboard`);
            } catch (userError) {
              console.error('❌ Failed to load users:', userError);
              toast.error(language === 'hindi' ? 'उपयोगकर्ता लोड नहीं हो सके' : 'Failed to load users');
            }
          } catch (error) {
            console.error('❌ Failed to load all problems:', error);
            toast.error(language === 'hindi' ? 'शिकायतें लोड नहीं हो सकीं: ' + (error instanceof Error ? error.message : 'Unknown error') : 'Failed to load complaints: ' + (error instanceof Error ? error.message : 'Unknown error'));
          }
        }
      }, 1000);
      
      toast.success(language === 'hindi' 
        ? `स्वागत ${adminUser.name}!` 
        : `Welcome ${adminUser.name}!`);
    } catch (error) {
      console.error('Admin login error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Admin login error';
      toast.error(language === 'hindi' ? 'एडमिन लॉगिन में त्रुटि: ' + errorMessage : 'Admin login error: ' + errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (userData: Omit<User, 'id'> & { password: string }) => {
    try {
      setIsLoading(true);
      
      // Use real backend API for registration
      const { user, token } = await api.register({
        name: userData.name,
        email: userData.email,
        phone_number: userData.phone,
        aadhar: userData.authNumber,
        password: userData.password,
        address: userData.address,
        role: 'citizen'
      });
      
      // Convert backend user to frontend user format
      const newUser: User = {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone_number,
        authType: 'aadhaar',
        authNumber: user.aadhar,
        role: 'citizen',
        address: user.address
      };
      
      setUser(newUser);
      setCurrentPage('dashboard');
      toast.success(language === 'hindi' ? 'सफलतापूर्वक पंजीकरण हो गया!' : 'Successfully registered!');
    } catch (error) {
      console.error('Registration error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Registration error';
      toast.error(language === 'hindi' ? 'पंजीकरण में त्रुटि: ' + errorMessage : 'Registration error: ' + errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Enhanced report submission with backend integration
  const handleSubmitReport = async (report: Omit<Report, 'id' | 'submittedAt' | 'status'>, imageFile?: File) => {
    try {
      if (!user) {
        throw new Error('User is required');
      }

      if (!imageFile) {
        throw new Error('Image is required');
      }

      setIsLoading(true);

      // Use categories from the form if available, otherwise try AI analysis
      let problemCategories: string[] = [];
      
      // Check if the new categories field is available
      if ((report as any).categories && (report as any).categories.length > 0) {
        problemCategories = (report as any).categories;
      } else {
        // Fallback to AI analysis for older form submissions or if no categories selected
        try {
          const analysisResult = await api.analyzeImage(imageFile);
          problemCategories = analysisResult.categories;
        } catch (analysisError) {
          console.warn('Image analysis failed, using category from form:', analysisError);
          // Final fallback to form category
          if (report.category && report.category !== 'Others') {
            problemCategories = [report.category];
          }
        }
      }

      // If still no categories, create an empty array (will use others_text)
      if (problemCategories.length === 0) {
        problemCategories = [];
      }

      // Determine priority based on keywords and category
      let priority: 'low' | 'medium' | 'high' = 'medium';
      const urgentKeywords = ['आपातकाल', 'emergency', 'तत्काल', 'urgent', 'दुर्घटना', 'accident', 'बंद', 'stopped', 'leak'];
      const highPriorityCategories = ['पानी की समस्या', 'Water Issues', 'बिजली की समस्या', 'Electricity Issues'];
      
      if (urgentKeywords.some(keyword => 
        report.description.toLowerCase().includes(keyword.toLowerCase()) ||
        report.category.toLowerCase().includes(keyword.toLowerCase())
      ) || highPriorityCategories.includes(report.category)) {
        priority = 'high';
      }

      // Create simulated geotag for the report
      const simulatedGeotag = {
        latitude: 26.4499 + (Math.random() - 0.5) * 0.1, // Random location near Kanpur
        longitude: 80.3319 + (Math.random() - 0.5) * 0.1,
        accuracy: Math.floor(Math.random() * 20) + 5, // 5-25 meter accuracy
        address: report.location,
        capturedBy: user?.name || 'Unknown',
        capturedByPhone: user?.phone || 'N/A',
        capturedAt: new Date(),
        deviceInfo: 'VIKSIT KANPUR Mobile App'
      };

      // Submit problem to backend
      const problemData = {
        problem_categories: problemCategories,
        others_text: (report as any).othersText || report.description,
        latitude: simulatedGeotag.latitude,
        longitude: simulatedGeotag.longitude,
        priority: priority
      };

      const { problem } = await api.submitProblem(problemData, imageFile);

      // Convert backend problem to frontend report format for local state
      const newReport: Report = {
        id: problem.id,
        category: problemCategories[0] || report.category,
        description: problem.others_text || report.description,
        location: report.location,
        image: `data:${problem.user_image_mimetype};base64,${problem.user_image_base64}`,
        submittedAt: new Date(problem.created_at),
        status: problem.status === 'not completed' ? 'pending' : problem.status as 'pending' | 'in-progress' | 'resolved',
        citizenName: user?.name,
        citizenPhone: user?.phone,
        assignedDepartment: problem.assigned_department || categoryToDepartmentMapping[report.category] || 'General Administration',
        priority: problem.priority as 'low' | 'medium' | 'high',
        geotag: simulatedGeotag,
        statusHistory: [{
          status: 'pending',
          timestamp: new Date(problem.created_at),
          updatedBy: 'System',
          notes: language === 'hindi' 
            ? `शिकायत प्राप्त हुई`
            : `Complaint received`
        }]
      };
      
      setReports(prev => [newReport, ...prev]);
      
      // Show enhanced success message
      toast.success(
        language === 'hindi' 
          ? `शिकायत सफलतापूर्वक दर्ज की गई! शिकायत ID: ${problem.id}`
          : `Complaint submitted successfully! Complaint ID: ${problem.id}`
      );
      
      // Show notification about AI analysis if categories were detected
      if (problemCategories.length > 0) {
        setTimeout(() => {
          toast.info(
            language === 'hindi'
              ? `AI द्वारा पहचाने गए मुद्दे: ${problemCategories.join(', ')}`
              : `AI detected issues: ${problemCategories.join(', ')}`
          );
        }, 1500);
      }
      
    } catch (error) {
      console.error('Submit error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error submitting complaint';
      toast.error(language === 'hindi' ? 'शिकायत दर्ज करने में त्रुटि: ' + errorMessage : 'Error submitting complaint: ' + errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Enhanced report update function with proper status tracking
  const handleUpdateReport = (reportId: string, updates: Partial<Report>) => {
    setReports(prev => prev.map(report => 
      report.id === reportId ? { 
        ...report, 
        ...updates,
        statusHistory: updates.status ? [
          ...(report.statusHistory || []),
          {
            status: updates.status,
            timestamp: new Date(),
            updatedBy: user?.name || 'System',
            notes: language === 'hindi' 
              ? `स्थिति अपडेट: ${
                  updates.status === 'resolved' ? 'हल हो गया' :
                  updates.status === 'in-progress' ? 'प्रगति में' : 'लंबित'
                }` 
              : `Status updated: ${updates.status}`
          }
        ] : report.statusHistory
      } : report
    ));
    
    // Enhanced success message
    const statusMessage = updates.status === 'resolved' 
      ? (language === 'hindi' ? 'शिकायत हल हो गई!' : 'Complaint resolved!')
      : updates.status === 'in-progress'
      ? (language === 'hindi' ? 'कार्य प्रगति में है!' : 'Work in progress!')
      : (language === 'hindi' ? 'शिकायत अपडेट की गई!' : 'Complaint updated!');
    
    toast.success(statusMessage);
  };

  // Enhanced worker assignment function
  const handleAssignWorker = (reportId: string, workerId: string) => {
    const worker = allUsers.find(u => u.id === workerId);
    const report = reports.find(r => r.id === reportId);
    
    if (worker && report) {
      handleUpdateReport(reportId, { 
        assignedWorker: workerId,
        assignedDepartment: worker.department,
        status: 'in-progress'
      });
      
      toast.success(
        language === 'hindi' 
          ? `${worker.name} को कार्य सौंपा गया!` 
          : `Task assigned to ${worker.name}!`
      );
      
      // Simulate notification to worker
      setTimeout(() => {
        toast.info(
          language === 'hindi'
            ? `कार्यकर्ता को सूचना भेजी गई`
            : `Worker has been notified`
        );
      }, 1000);
    }
  };

  const handleUpdateProfile = async (updates: Partial<User>) => {
    if (!user) return;
    
    try {
      // Convert frontend user format to backend format for API call
      const backendUpdates = {
        name: updates.name,
        phone_number: updates.phone,
        address: updates.address,
        avatar_url: updates.avatar_url
      };
      
      const { user: updatedUser } = await api.updateUser(user.id, backendUpdates);
      
      // Convert backend user back to frontend format and update state
      const updatedFrontendUser: User = {
        ...user,
        name: updatedUser.name,
        phone: updatedUser.phone_number,
        address: updatedUser.address,
        avatar_url: updatedUser.avatar_url
      };
      
      setUser(updatedFrontendUser);
      toast.success(language === 'hindi' ? 'प्रोफाइल अपडेट की गई!' : 'Profile updated!');
    } catch (error) {
      console.error('Profile update error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Profile update failed';
      toast.error(language === 'hindi' ? 'प्रोफाइल अपडेट में त्रुटि: ' + errorMessage : 'Profile update error: ' + errorMessage);
    }
  };

  const handleLogout = () => {
    // Clear auth token from storage
    api.logout();
    setUser(null);
    setCurrentPage('login');
    toast.success(language === 'hindi' ? 'सफलतापूर्वक लॉगआउट हो गए!' : 'Successfully logged out!');
  };

  // Load user problems from backend
  const loadUserProblems = async () => {
    if (!user) return;
    
    try {
      const { problems } = await api.getUserProblems(user.id);
      
      // Convert backend problems to frontend report format
      const userReports: Report[] = problems.map(problem => ({
        id: problem.id,
        category: problem.problem_categories[0] || 'Other Issues',
        description: problem.others_text || 'No description',
        location: `${problem.latitude}, ${problem.longitude}`,
        image: problem.user_image_base64 ? 
          `data:${problem.user_image_mimetype};base64,${problem.user_image_base64}` : '',
        submittedAt: new Date(problem.created_at),
        status: problem.status === 'not completed' ? 'pending' : 
                problem.status === 'in-progress' ? 'in-progress' : 'resolved',
        citizenName: user.name,
        citizenPhone: user.phone,
        assignedDepartment: problem.assigned_department || categoryToDepartmentMapping[problem.problem_categories[0]] || 'General Administration',
        priority: problem.priority as 'low' | 'medium' | 'high',
        geotag: {
          latitude: problem.latitude,
          longitude: problem.longitude,
          accuracy: 10,
          address: `${problem.latitude}, ${problem.longitude}`,
          capturedBy: user.name,
          capturedByPhone: user.phone,
          capturedAt: new Date(problem.created_at),
          deviceInfo: 'VIKSIT KANPUR Mobile App'
        },
        statusHistory: [{
          status: problem.status === 'not completed' ? 'pending' : problem.status,
          timestamp: new Date(problem.created_at),
          updatedBy: 'System',
          notes: language === 'hindi' ? 'शिकायत प्राप्त हुई' : 'Complaint received'
        }]
      }));
      
      setReports(userReports);
    } catch (error) {
      console.error('Failed to load user problems:', error);
      toast.error(language === 'hindi' ? 'शिकायतें लोड करने में त्रुटि' : 'Failed to load complaints');
    }
  };

  // Load all problems for admin users
  const loadAllProblems = async () => {
    if (!user || user.role === 'citizen') {
      console.log('🚫 Not loading problems - user is citizen or not logged in');
      return;
    }
    
    console.log('🔄 loadAllProblems called for user:', user.role, user.id);
    
    try {
      console.log('📞 Making API call to getAllProblems...');
      const response = await api.getAllProblems();
      console.log('📡 API Response:', response);
      
      const problems = response.problems || [];
      console.log('📊 Problems received:', problems.length);
      
      if (problems.length === 0) {
        console.warn('⚠️ No problems found in API response');
        toast.info(language === 'hindi' ? 'कोई शिकायत नहीं मिली' : 'No complaints found');
        return;
      }
      
      // Convert backend problems to frontend report format
      const allReports: Report[] = problems.map((problem, index) => {
        console.log(`🔄 Converting problem ${index + 1}/${problems.length}:`, problem.id);
        
        // Safely handle potential data issues
        const safeLatitude = typeof problem.latitude === 'string' ? parseFloat(problem.latitude) : problem.latitude;
        const safeLongitude = typeof problem.longitude === 'string' ? parseFloat(problem.longitude) : problem.longitude;
        const safeProblemCategories = Array.isArray(problem.problem_categories) ? problem.problem_categories : [];
        
        return {
          id: String(problem.id),
          category: safeProblemCategories[0] || 'Other Issues',
          description: problem.others_text || 'No description',
          location: `${safeLatitude}, ${safeLongitude}`,
          image: problem.user_image_base64 ? 
            `data:${problem.user_image_mimetype};base64,${problem.user_image_base64}` : 
            'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2RkZGRkZCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LXNpemU9IjE4IiBmaWxsPSIjOTk5OTk5IiBkeT0iLjNlbSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+Tm8gSW1hZ2U8L3RleHQ+PC9zdmc+',
          submittedAt: new Date(problem.created_at),
          status: problem.status === 'not completed' ? 'pending' : 
                  problem.status === 'in-progress' ? 'in-progress' : 
                  problem.status === 'completed' ? 'resolved' : 'pending',
          citizenName: problem.user_name || 'Unknown',
          citizenPhone: problem.user_email || 'N/A',
          assignedDepartment: problem.assigned_department || categoryToDepartmentMapping[safeProblemCategories[0]] || 'General Administration',
          assignedWorker: problem.assigned_worker_id ? String(problem.assigned_worker_id) : undefined,
          priority: (problem.priority as 'low' | 'medium' | 'high') || 'medium',
          geotag: {
            latitude: safeLatitude,
            longitude: safeLongitude,
            accuracy: 10,
            address: `${safeLatitude}, ${safeLongitude}`,
            capturedBy: problem.user_name || 'Unknown',
            capturedByPhone: problem.user_email || 'N/A',
            capturedAt: new Date(problem.created_at),
            deviceInfo: 'VIKSIT KANPUR Mobile App'
          },
          statusHistory: [{
            status: problem.status === 'not completed' ? 'pending' : 
                    problem.status === 'in-progress' ? 'in-progress' : 
                    problem.status === 'completed' ? 'resolved' : 'pending',
            timestamp: new Date(problem.created_at),
            updatedBy: 'System',
            notes: language === 'hindi' ? 'शिकायत प्राप्त हुई' : 'Complaint received'
          }]
        };
      });
      
      console.log('✅ Successfully converted', allReports.length, 'problems');
      setReports(allReports);
      console.log('✅ Reports state updated with', allReports.length, 'reports');
      
    } catch (error) {
      console.error('❌ Failed to load all problems:', error);
      console.error('❌ Error details:', error instanceof Error ? error.message : 'Unknown error');
      toast.error(language === 'hindi' ? 'सभी शिकायतें लोड करने में त्रुटि: ' + (error instanceof Error ? error.message : 'अज्ञात त्रुटि') : 'Failed to load all complaints: ' + (error instanceof Error ? error.message : 'Unknown error'));
      // Keep using mock data if API fails
    }
  };

  // Show loading screen while app initializes - simplified
  if (!appInitialized) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-100 via-white to-green-100 flex items-center justify-center">
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-3 h-6 bg-orange-500 rounded-sm"></div>
            <div className="w-3 h-6 bg-white border border-gray-300 rounded-sm"></div>
            <div className="w-3 h-6 bg-green-600 rounded-sm"></div>
          </div>
          <h2 className="text-xl font-bold text-orange-600 mb-2">VIKSIT KANPUR</h2>
          <p className="text-gray-600">{language === 'hindi' ? 'लोड हो रहा है...' : 'Loading...'}</p>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div>
        {/* Mobile Viewport Handler */}
        <MobileViewport />
      
      {/* Mobile Viewport Setup */}
      <div 
        className="min-h-screen bg-gradient-to-br from-orange-100 via-white to-green-100 overflow-x-hidden"
        style={{
          width: '100vw',
          maxWidth: '100%',
          WebkitTextSizeAdjust: '100%',
          textSizeAdjust: '100%',
          WebkitTapHighlightColor: 'transparent'
        }}
      >
        {/* Enhanced Responsive Meta Handler */}
        <style>{`
          /* Prevent zoom on inputs and ensure proper viewport */
          @viewport {
            width: device-width;
            initial-scale: 1;
            maximum-scale: 1;
            user-scalable: no;
          }
          
          /* Font size adjustments */
          @media (max-width: 640px) {
            html {
              font-size: 14px;
            }
            body {
              -webkit-text-size-adjust: 100%;
              text-size-adjust: 100%;
            }
            input, textarea, select {
              font-size: 16px !important; /* Prevent zoom on iOS */
            }
          }
          
          @media (min-width: 641px) and (max-width: 1024px) {
            html {
              font-size: 15px;
            }
          }
          
          @media (min-width: 1025px) {
            html {
              font-size: 16px;
            }
          }
          
          /* Touch improvements */
          * {
            box-sizing: border-box;
            -webkit-tap-highlight-color: transparent;
          }
          
          /* Smooth scrolling for mobile */
          html {
            scroll-behavior: smooth;
            -webkit-overflow-scrolling: touch;
          }
          
          /* Prevent horizontal overflow */
          body, html {
            overflow-x: hidden;
            width: 100%;
          }
        `}</style>
        <AnimatePresence mode="wait">
        {currentPage === 'login' && (
          <motion.div
            key="login"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="w-full min-h-screen"
          >
            <SafeComponent language={language}>
              <div className="w-full min-h-screen px-4 sm:px-6 lg:px-8">
        <LoginPage 
          onLogin={handleLogin}
          onSwitchToRegister={() => setCurrentPage('register')}
          onSwitchToAdminLogin={() => setCurrentPage('admin-login')}
          language={language}
          onLanguageChange={setLanguage}
        />
              </div>
            </SafeComponent>
          </motion.div>
        )}
        
        {currentPage === 'register' && (
          <motion.div
            key="register"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="w-full min-h-screen"
          >
            <div className="w-full min-h-screen px-4 sm:px-6 lg:px-8">
              <RegistrationPage 
                onRegister={handleRegister}
                onSwitchToLogin={() => setCurrentPage('login')}
                language={language}
                onLanguageChange={setLanguage}
              />
            </div>
          </motion.div>
        )}
        
        {currentPage === 'dashboard' && user && (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="w-full min-h-screen"
          >
            <div className="w-full min-h-screen">
              {/* Responsive Dashboard - Mobile vs Desktop */}
              <div className="block sm:hidden">
                <MobileDashboard 
                  user={user}
                  onSubmitReport={handleSubmitReport}
                  onViewHistory={async () => {
                    setCurrentPage('history');
                    await loadUserProblems();
                  }}
                  onViewProfile={() => setCurrentPage('profile')}
                  onLogout={handleLogout}
                  language={language}
                  onLanguageChange={setLanguage}
                />
              </div>
              <div className="hidden sm:block">
                <Dashboard 
                  user={user}
                  onSubmitReport={handleSubmitReport}
                  onViewHistory={async () => {
                    setCurrentPage('history');
                    await loadUserProblems();
                  }}
                  onViewProfile={() => setCurrentPage('profile')}
                  onLogout={handleLogout}
                  language={language}
                  onLanguageChange={setLanguage}
                />
              </div>
            </div>
          </motion.div>
        )}
        
        {currentPage === 'history' && user && (
          <motion.div
            key="history"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="w-full min-h-screen"
          >
            <div className="w-full min-h-screen container-responsive">
              <HistoryPage 
                reports={reports}
                onBackToDashboard={() => setCurrentPage('dashboard')}
                onLogout={handleLogout}
                language={language}
              />
            </div>
          </motion.div>
        )}
        
        {currentPage === 'map' && user && (
          <motion.div
            key="map"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="w-full min-h-screen"
          >
            <div className="w-full min-h-screen">
              <MapPage 
                reports={reports}
                allUsers={allUsers}
                onBackToDashboard={() => setCurrentPage('dashboard')}
                onLogout={handleLogout}
                language={language}
              />
            </div>
          </motion.div>
        )}

        {currentPage === 'profile' && user && (
          <motion.div
            key="profile"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="w-full min-h-screen"
          >
            <div className="w-full min-h-screen px-4 sm:px-6 lg:px-8">
              <ProfilePage 
                user={user}
                onBackToDashboard={() => setCurrentPage('dashboard')}
                onLogout={handleLogout}
                onUpdateProfile={handleUpdateProfile}
                language={language}
                onLanguageChange={setLanguage}
              />
            </div>
          </motion.div>
        )}

        {currentPage === 'admin-login' && (
          <motion.div
            key="admin-login"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="w-full min-h-screen"
          >
            <div className="w-full min-h-screen px-4 sm:px-6 lg:px-8">
              <AdminLoginPage 
                onLogin={handleAdminLogin}
                onSwitchToCitizenLogin={() => setCurrentPage('login')}
                language={language}
                onLanguageChange={setLanguage}
              />
            </div>
          </motion.div>
        )}

        {currentPage === 'admin-dashboard' && user && user.role === 'district-magistrate' && (
          <motion.div
            key="admin-dashboard"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <DistrictMagistrateDashboard 
              user={user}
              reports={reports}
              allUsers={allUsers}
              onNavigate={setCurrentPage}
              onLogout={handleLogout}
              onUpdateReport={handleUpdateReport}
              language={language}
              onLanguageChange={setLanguage}
            />
          </motion.div>
        )}

        {currentPage === 'admin-dashboard' && user && user.role !== 'citizen' && user.role !== 'district-magistrate' && (
          <motion.div
            key="admin-dashboard"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <AdminDashboard 
              user={user}
              reports={reports}
              allUsers={allUsers}
              onNavigate={setCurrentPage}
              onLogout={handleLogout}
              onUpdateReport={handleUpdateReport}
            />
          </motion.div>
        )}

        {currentPage === 'admin-complaints' && user && user.role !== 'citizen' && (
          <motion.div
            key="admin-complaints"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <AdminComplaints 
              user={user}
              reports={reports}
              allUsers={allUsers}
              onNavigate={setCurrentPage}
              onLogout={handleLogout}
              onUpdateReport={handleUpdateReport}
              onAssignWorker={handleAssignWorker}
              language={language}
              onLanguageChange={setLanguage}
            />
          </motion.div>
        )}

        {currentPage === 'admin-departments' && user && user.role !== 'citizen' && (
          <motion.div
            key="admin-departments"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <AdminDepartments 
              user={user}
              reports={reports}
              allUsers={allUsers}
              onNavigate={setCurrentPage}
              onLogout={handleLogout}
              onUpdateReport={handleUpdateReport}
              language={language}
              onLanguageChange={setLanguage}
            />
          </motion.div>
        )}

        {currentPage === 'admin-workers' && user && user.role !== 'citizen' && (
          <motion.div
            key="admin-workers"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Suspense fallback={<LoadingSpinner language={language} />}>
              <AdminWorkers 
                user={user}
                reports={reports}
                allUsers={allUsers}
                onNavigate={setCurrentPage}
                onLogout={handleLogout}
                onUpdateReport={handleUpdateReport}
                language={language}
                onLanguageChange={setLanguage}
              />
            </Suspense>
          </motion.div>
        )}

        {currentPage === 'admin-map' && user && user.role !== 'citizen' && (
          <motion.div
            key="admin-map"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Suspense fallback={<LoadingSpinner language={language} />}>
              <AdminMapView 
                user={user}
                reports={reports}
                allUsers={allUsers}
                onNavigate={setCurrentPage}
                onLogout={handleLogout}
                onUpdateReport={handleUpdateReport}
                language={language}
                onLanguageChange={setLanguage}
              />
            </Suspense>
          </motion.div>
        )}

        {/* Removed admin-reports page */}

        {currentPage === 'admin-analytics' && user && user.role !== 'citizen' && (
          <motion.div
            key="admin-analytics"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Suspense fallback={<LoadingSpinner language={language} />}>
              <AdminAnalytics 
                user={user}
                reports={reports}
                allUsers={allUsers}
                onNavigate={setCurrentPage}
                onLogout={handleLogout}
                onUpdateReport={handleUpdateReport}
                language={language}
                onLanguageChange={setLanguage}
              />
            </Suspense>
          </motion.div>
        )}

        {currentPage === 'admin-notifications' && user && user.role !== 'citizen' && (
          <motion.div
            key="admin-notifications"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <AdminNotifications 
              user={user}
              reports={reports}
              allUsers={allUsers}
              onNavigate={setCurrentPage}
              onLogout={handleLogout}
              onUpdateReport={handleUpdateReport}
              language={language}
              onLanguageChange={setLanguage}
            />
          </motion.div>
        )}

        {currentPage === 'admin-settings' && user && user.role !== 'citizen' && (
          <motion.div
            key="admin-settings"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <AdminSettings 
              user={user}
              reports={reports}
              allUsers={allUsers}
              onNavigate={setCurrentPage}
              onLogout={handleLogout}
              onUpdateReport={handleUpdateReport}
              language={language}
              onLanguageChange={setLanguage}
            />
          </motion.div>
        )}


        {currentPage === 'field-worker-dashboard' && user && user.role === 'field-worker' && (
          <motion.div
            key="field-worker-dashboard"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <FieldWorkerDashboard 
              user={user}
              reports={reports}
              onNavigate={setCurrentPage}
              onLogout={handleLogout}
              onUpdateReport={handleUpdateReport}
              language={language}
              onLanguageChange={setLanguage}
            />
          </motion.div>
        )}

        {currentPage === 'field-worker-notifications' && user && user.role === 'field-worker' && (
          <motion.div
            key="field-worker-notifications"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <FieldWorkerNotifications 
              user={user}
              reports={reports}
              allUsers={allUsers}
              onNavigate={setCurrentPage}
              onLogout={handleLogout}
              onUpdateReport={handleUpdateReport}
              language={language}
              onLanguageChange={setLanguage}
            />
          </motion.div>
        )}

        {currentPage === 'field-worker-profile' && user && user.role === 'field-worker' && (
          <motion.div
            key="field-worker-profile"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <FieldWorkerProfile 
              user={user}
              onNavigate={setCurrentPage}
              onLogout={handleLogout}
              onUpdateProfile={handleUpdateProfile}
              language={language}
              onLanguageChange={setLanguage}
            />
          </motion.div>
        )}

        {currentPage === 'department-head-dashboard' && user && user.role === 'department-head' && (
          <motion.div
            key="department-head-dashboard"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <DepartmentHeadDashboard 
              user={user}
              reports={reports}
              allUsers={allUsers}
              onNavigate={setCurrentPage}
              onLogout={handleLogout}
              onUpdateReport={handleUpdateReport}
              language={language}
              onLanguageChange={setLanguage}
            />
          </motion.div>
        )}

        {currentPage === 'department-head-notifications' && user && user.role === 'department-head' && (
          <motion.div
            key="department-head-notifications"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <DepartmentHeadNotifications 
              user={user}
              reports={reports}
              allUsers={allUsers}
              onNavigate={setCurrentPage}
              onLogout={handleLogout}
              onUpdateReport={handleUpdateReport}
              language={language}
              onLanguageChange={setLanguage}
            />
          </motion.div>
        )}

        {currentPage === 'department-head-profile' && user && user.role === 'department-head' && (
          <motion.div
            key="department-head-profile"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <DepartmentHeadProfile 
              user={user}
              onNavigate={setCurrentPage}
              onLogout={handleLogout}
              onUpdateProfile={handleUpdateProfile}
              language={language}
              onLanguageChange={setLanguage}
            />
          </motion.div>
        )}

        {currentPage === 'district-magistrate-notifications' && user && user.role === 'district-magistrate' && (
          <motion.div
            key="district-magistrate-notifications"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <DistrictMagistrateNotifications 
              user={user}
              reports={reports}
              allUsers={allUsers}
              onNavigate={setCurrentPage}
              onLogout={handleLogout}
              onUpdateReport={handleUpdateReport}
              language={language}
              onLanguageChange={setLanguage}
            />
          </motion.div>
        )}

        {currentPage === 'district-magistrate-profile' && user && user.role === 'district-magistrate' && (
          <motion.div
            key="district-magistrate-profile"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <DistrictMagistrateProfile 
              user={user}
              onNavigate={setCurrentPage}
              onLogout={handleLogout}
              onUpdateProfile={handleUpdateProfile}
              language={language}
              onLanguageChange={setLanguage}
            />
          </motion.div>
        )}

      </AnimatePresence>
      
      {/* Responsive Mobile Navigation for authenticated citizens */}
      {user && user.role === 'citizen' && (currentPage === 'dashboard' || currentPage === 'history') && (
        <div className="sm:hidden">
          <MobileNavigation
            currentPage={currentPage}
            onNavigate={(page) => setCurrentPage(page)}
            language={language}
            user={user}
            onViewProfile={() => setCurrentPage('profile')}
            onLogout={handleLogout}
          />
        </div>
      )}
      
      {/* Responsive Floating Action Button for citizens */}
      {user && user.role === 'citizen' && currentPage === 'history' && (
        <div className="sm:hidden">
          <FloatingActionButton
            currentPage={currentPage}
            onNewReport={() => setCurrentPage('dashboard')}
          />
        </div>
      )}
      
      {/* PWA Installer - Only in production */}
      {window.location.hostname !== 'localhost' && 
       !window.location.hostname.includes('figma') &&
       !window.location.hostname.includes('preview') && appInitialized && <PWAInstaller />}
      
        <Toaster />
      </div>
      </div>
    </ErrorBoundary>
  );
}