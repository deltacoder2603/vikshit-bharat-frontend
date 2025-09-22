import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Switch } from './ui/switch';
import { 
  Settings,
  Shield,
  Bell,
  Users,
  Database,
  Mail,
  Globe,
  Lock,
  Key,
  Smartphone,
  Monitor,
  Palette,
  Language,
  Clock,
  MapPin,
  Building,
  FileText,
  Download,
  Upload,
  RefreshCw,
  Save,
  ArrowLeft,
  AlertTriangle,
  CheckCircle,
  Info,
  Zap,
  Server,
  Wifi,
  HardDrive,
  BarChart3,
  Camera,
  Printer,
  Calendar,
  Target
} from 'lucide-react';
import { User, Report } from '../App';
import AdminLayout from './AdminLayout';
import { getTranslations, Language } from '../utils/translations';
import { toast } from 'sonner';

interface AdminSettingsProps {
  user: User;
  reports: Report[];
  allUsers: User[];
  onNavigate: (page: string) => void;
  onLogout: () => void;
  onUpdateReport: (reportId: string, updates: Partial<Report>) => void;
  language?: Language;
  onLanguageChange?: (language: Language) => void;
}

interface SystemSettings {
  general: {
    siteName: string;
    siteDescription: string;
    contactEmail: string;
    contactPhone: string;
    address: string;
    timezone: string;
    language: string;
    dateFormat: string;
  };
  notifications: {
    emailEnabled: boolean;
    smsEnabled: boolean;
    pushEnabled: boolean;
    citizenUpdates: boolean;
    adminAlerts: boolean;
    emergencyAlerts: boolean;
    autoAssignment: boolean;
    weeklyReports: boolean;
  };
  security: {
    twoFactorAuth: boolean;
    sessionTimeout: number;
    passwordExpiry: number;
    loginAttempts: number;
    ipWhitelist: boolean;
    encryption: boolean;
    backupFrequency: string;
    auditLogs: boolean;
  };
  performance: {
    cacheEnabled: boolean;
    compressionEnabled: boolean;
    cdnEnabled: boolean;
    databaseOptimization: boolean;
    imageOptimization: boolean;
    autoBackup: boolean;
    loadBalancing: boolean;
    monitoring: boolean;
  };
  departments: {
    autoAssignment: boolean;
    workloadBalancing: boolean;
    priorityEscalation: boolean;
    performanceTracking: boolean;
    citizenRating: boolean;
    workflowAutomation: boolean;
    reportGeneration: boolean;
    interdepartmentalCoordination: boolean;
  };
}

export default function EnhancedAdminSettings({ 
  user, 
  reports, 
  allUsers,
  onNavigate, 
  onLogout,
  onUpdateReport,
  language = 'hindi',
  onLanguageChange
}: AdminSettingsProps) {
  const [activeTab, setActiveTab] = useState('general');
  
  // Bilingual settings with proper defaults
  const [settings, setSettings] = useState<SystemSettings>({
    general: {
      siteName: 'VIKSIT KANPUR',
      siteDescription: language === 'hindi' 
        ? 'कानपुर नगर निगम शिकायत प्रबंधन प्रणाली'
        : 'Kanpur Municipal Corporation Complaint Management System',
      contactEmail: 'admin@kanpur.gov.in',
      contactPhone: '+91 512-2234567',
      address: language === 'hindi'
        ? 'कानपुर नगर निगम, सिटी हॉल, कानपुर'
        : 'Kanpur Municipal Corporation, City Hall, Kanpur',
      timezone: 'Asia/Kolkata',
      language: language === 'hindi' ? 'hi-IN' : 'en-IN',
      dateFormat: 'DD/MM/YYYY'
    },
    notifications: {
      emailEnabled: true,
      smsEnabled: true,
      pushEnabled: true,
      citizenUpdates: true,
      adminAlerts: true,
      emergencyAlerts: true,
      autoAssignment: true,
      weeklyReports: true
    },
    security: {
      twoFactorAuth: true,
      sessionTimeout: 30,
      passwordExpiry: 90,
      loginAttempts: 3,
      ipWhitelist: false,
      encryption: true,
      backupFrequency: 'daily',
      auditLogs: true
    },
    performance: {
      cacheEnabled: true,
      compressionEnabled: true,
      cdnEnabled: false,
      databaseOptimization: true,
      imageOptimization: true,
      autoBackup: true,
      loadBalancing: false,
      monitoring: true
    },
    departments: {
      autoAssignment: true,
      workloadBalancing: true,
      priorityEscalation: true,
      performanceTracking: true,
      citizenRating: true,
      workflowAutomation: false,
      reportGeneration: true,
      interdepartmentalCoordination: true
    }
  });

  // Bilingual system status
  const [systemStatus] = useState({
    database: { 
      status: language === 'hindi' ? 'ऑनलाइन' : 'online', 
      uptime: '99.9%', 
      lastBackup: language === 'hindi' ? '2 घंटे पहले' : '2 hours ago'
    },
    server: { 
      status: language === 'hindi' ? 'स्वस्थ' : 'healthy', 
      cpu: '25%', 
      memory: '60%', 
      disk: '45%' 
    },
    services: { 
      status: language === 'hindi' ? 'चालू' : 'running', 
      api: language === 'hindi' ? 'सक्रिय' : 'active', 
      notifications: language === 'hindi' ? 'सक्रिय' : 'active', 
      analytics: language === 'hindi' ? 'सक्रिय' : 'active' 
    },
    security: { 
      status: language === 'hindi' ? 'सुरक्षित' : 'secure', 
      lastScan: language === 'hindi' ? '1 दिन पहले' : '1 day ago', 
      threats: 0, 
      updates: language === 'hindi' ? 'वर्तमान' : 'current' 
    }
  });

  // Bilingual tabs
  const tabs = [
    { 
      id: 'general', 
      label: language === 'hindi' ? 'सामान्य' : 'General', 
      icon: Settings 
    },
    { 
      id: 'notifications', 
      label: language === 'hindi' ? 'सूचनाएं' : 'Notifications', 
      icon: Bell 
    },
    { 
      id: 'security', 
      label: language === 'hindi' ? 'सुरक्षा' : 'Security', 
      icon: Shield 
    },
    { 
      id: 'performance', 
      label: language === 'hindi' ? 'प्रदर्शन' : 'Performance', 
      icon: BarChart3 
    },
    { 
      id: 'departments', 
      label: language === 'hindi' ? 'विभाग' : 'Departments', 
      icon: Building 
    },
    { 
      id: 'system', 
      label: language === 'hindi' ? 'सिस्टम' : 'System', 
      icon: Server 
    }
  ];

  const handleSettingChange = (category: keyof SystemSettings, setting: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: value
      }
    }));
  };

  const saveSettings = () => {
    const message = language === 'hindi' 
      ? 'सेटिंग्स सफलतापूर्वक सहेजी गईं!' 
      : 'Settings saved successfully!';
    toast.success(message);
  };

  const exportSettings = () => {
    const message = language === 'hindi' 
      ? 'सेटिंग्स एक्सपोर्ट फ़ीचर अभी उपलब्ध नहीं है' 
      : 'Settings export feature is not available yet';
    toast.info(message);
  };

  const resetToDefaults = () => {
    const confirmMessage = language === 'hindi' 
      ? 'क्या आप वास्तव में सभी सेटिंग्स को डिफ़ॉल्ट पर रीसेट करना चाहते हैं?'
      : 'Are you sure you want to reset all settings to default?';
      
    if (confirm(confirmMessage)) {
      const message = language === 'hindi' 
        ? 'सेटिंग्स डिफ़ॉल्ट पर रीसेट की गईं!' 
        : 'Settings reset to default!';
      toast.success(message);
    }
  };

  // Translation helpers for different sections
  const getGeneralLabels = () => ({
    siteName: language === 'hindi' ? 'साइट नाम' : 'Site Name',
    siteDescription: language === 'hindi' ? 'साइट विवरण' : 'Site Description',
    contactEmail: language === 'hindi' ? 'संपर्क ईमेल' : 'Contact Email',
    contactPhone: language === 'hindi' ? 'संपर्क फोन' : 'Contact Phone',
    address: language === 'hindi' ? 'पता' : 'Address',
    timezone: language === 'hindi' ? 'टाइमज़ोन' : 'Timezone'
  });

  const getNotificationLabels = () => ({
    channels: language === 'hindi' ? 'सूचना चैनल' : 'Notification Channels',
    types: language === 'hindi' ? 'सूचना प्रकार' : 'Notification Types',
    emailEnabled: language === 'hindi' ? 'ईमेल सूचनाएं' : 'Email Notifications',
    smsEnabled: language === 'hindi' ? 'SMS सूचनाएं' : 'SMS Notifications',
    pushEnabled: language === 'hindi' ? 'पुश नोटिफिकेशन' : 'Push Notifications',
    citizenUpdates: language === 'hindi' ? 'नागरिक अपडेट' : 'Citizen Updates',
    adminAlerts: language === 'hindi' ? 'प्रशासनिक अलर्ट' : 'Admin Alerts',
    emergencyAlerts: language === 'hindi' ? 'आपातकालीन अलर्ट' : 'Emergency Alerts',
    autoAssignment: language === 'hindi' ? 'ऑटो असाइनमेंट' : 'Auto Assignment',
    weeklyReports: language === 'hindi' ? 'साप्ताहिक रिपोर्ट' : 'Weekly Reports'
  });

  const getSecurityLabels = () => ({
    authentication: language === 'hindi' ? 'प्रमाणीकरण' : 'Authentication',
    policies: language === 'hindi' ? 'सुरक्षा नीतियां' : 'Security Policies',
    twoFactorAuth: language === 'hindi' ? 'दो-कारक प्रमाणीकरण' : 'Two-Factor Authentication',
    sessionTimeout: language === 'hindi' ? 'सेशन टाइमआउट (मिनट)' : 'Session Timeout (minutes)',
    passwordExpiry: language === 'hindi' ? 'पासवर्ड समाप्ति (दिन)' : 'Password Expiry (days)',
    loginAttempts: language === 'hindi' ? 'लॉगिन प्रयास सीमा' : 'Login Attempt Limit',
    encryption: language === 'hindi' ? 'एन्क्रिप्शन' : 'Encryption',
    auditLogs: language === 'hindi' ? 'ऑडिट लॉग्स' : 'Audit Logs',
    ipWhitelist: language === 'hindi' ? 'IP व्हाइटलिस्ट' : 'IP Whitelist'
  });

  const getPerformanceLabels = () => ({
    caching: language === 'hindi' ? 'कैशिंग और अनुकूलन' : 'Caching & Optimization',
    monitoring: language === 'hindi' ? 'बैकअप और मॉनिटरिंग' : 'Backup & Monitoring',
    cacheEnabled: language === 'hindi' ? 'कैश सक्षम' : 'Cache Enabled',
    compressionEnabled: language === 'hindi' ? 'कंप्रेशन सक्षम' : 'Compression Enabled',
    imageOptimization: language === 'hindi' ? 'इमेज अनुकूलन' : 'Image Optimization',
    databaseOptimization: language === 'hindi' ? 'डेटाबेस अनुकूलन' : 'Database Optimization',
    autoBackup: language === 'hindi' ? 'ऑटो बैकअप' : 'Auto Backup',
    systemMonitoring: language === 'hindi' ? 'सिस्टम मॉनिटरिंग' : 'System Monitoring',
    loadBalancing: language === 'hindi' ? 'लोड बैलेंसिंग' : 'Load Balancing',
    cdnEnabled: language === 'hindi' ? 'CDN सक्षम' : 'CDN Enabled'
  });

  const getDepartmentLabels = () => ({
    workflow: language === 'hindi' ? 'वर्कफ़्लो स्वचालन' : 'Workflow Automation',
    tracking: language === 'hindi' ? 'प्रदर्शन ट्रैकिंग' : 'Performance Tracking',
    autoAssignment: language === 'hindi' ? 'ऑटो असाइनमेंट' : 'Auto Assignment',
    workloadBalancing: language === 'hindi' ? 'वर्कलोड बैलेंसिंग' : 'Workload Balancing',
    priorityEscalation: language === 'hindi' ? 'प्राथमिकता एस्केलेशन' : 'Priority Escalation',
    workflowAutomation: language === 'hindi' ? 'वर्कफ़्लो ऑटोमेशन' : 'Workflow Automation',
    performanceTracking: language === 'hindi' ? 'प्रदर्शन ट्रैकिंग' : 'Performance Tracking',
    citizenRating: language === 'hindi' ? 'नागरिक रेटिंग' : 'Citizen Rating',
    reportGeneration: language === 'hindi' ? 'रिपोर्ट जेनरेशन' : 'Report Generation',
    interdepartmentalCoordination: language === 'hindi' ? 'अंतर-विभागीय समन्वय' : 'Interdepartmental Coordination'
  });

  const getSystemLabels = () => ({
    serverMetrics: language === 'hindi' ? 'सर्वर मेट्रिक्स' : 'Server Metrics',
    databaseStatus: language === 'hindi' ? 'डेटाबेस स्थिति' : 'Database Status',
    serviceHealth: language === 'hindi' ? 'सेवा स्वास्थ्य' : 'Service Health',
    securityStatus: language === 'hindi' ? 'सुरक्षा स्थिति' : 'Security Status',
    cpuUsage: language === 'hindi' ? 'CPU उपयोग:' : 'CPU Usage:',
    memory: language === 'hindi' ? 'मेमोरी:' : 'Memory:',
    diskSpace: language === 'hindi' ? 'डिस्क स्थान:' : 'Disk Space:',
    uptime: language === 'hindi' ? 'अपटाइम:' : 'Uptime:',
    lastBackup: language === 'hindi' ? 'अंतिम बैकअप:' : 'Last Backup:',
    apiStatus: language === 'hindi' ? 'API स्थिति:' : 'API Status:',
    threatsDetected: language === 'hindi' ? 'खतरे मिले:' : 'Threats Detected:',
    lastSecurityScan: language === 'hindi' ? 'अंतिम सुरक्षा स्कैन:' : 'Last Security Scan:',
    resetToDefaults: language === 'hindi' ? 'डिफ़ॉल्ट पर रीसेट करें' : 'Reset to Defaults',
    systemRestart: language === 'hindi' ? 'सिस्टम रीस्टार्ट' : 'System Restart'
  });

  return (
    <AdminLayout
      user={user}
      currentPage="admin-settings"
      onNavigate={onNavigate}
      onLogout={onLogout}
      pendingCount={reports.filter(r => r.status === 'pending').length}
      urgentCount={7}
      language={language}
      onLanguageChange={onLanguageChange || (() => {})}
    >
      <div className="p-6 space-y-6 max-w-none overflow-hidden">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-gray-500 to-gray-600 rounded-lg">
                <Settings className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  {language === 'hindi' ? 'सिस्टम सेटिंग्स' : 'System Settings'}
                </h1>
                <p className="text-sm text-gray-600">
                  {language === 'hindi' 
                    ? 'प्रणाली कॉन्फ़िगरेशन और प्राथमिकताएं प्रबंधित करें' 
                    : 'Manage system configuration and preferences'}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                onClick={saveSettings}
                className="bg-green-600 hover:bg-green-700"
              >
                <Save className="h-4 w-4 mr-2" />
                {language === 'hindi' ? 'सहेजें' : 'Save'}
              </Button>
            </div>
          </div>
        </div>

        {/* System Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100">
                      {language === 'hindi' ? 'डेटाबेस' : 'Database'}
                    </p>
                    <p className="text-lg font-bold">{systemStatus.database.status}</p>
                    <p className="text-xs text-green-200">
                      {language === 'hindi' ? 'अपटाइम:' : 'Uptime:'} {systemStatus.database.uptime}
                    </p>
                  </div>
                  <Database className="h-8 w-8 text-green-200" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100">
                      {language === 'hindi' ? 'सर्वर' : 'Server'}
                    </p>
                    <p className="text-lg font-bold">{systemStatus.server.status}</p>
                    <p className="text-xs text-blue-200">
                      CPU: {systemStatus.server.cpu}
                    </p>
                  </div>
                  <Server className="h-8 w-8 text-blue-200" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100">
                      {language === 'hindi' ? 'सेवाएं' : 'Services'}
                    </p>
                    <p className="text-lg font-bold">{systemStatus.services.status}</p>
                    <p className="text-xs text-purple-200">
                      API: {systemStatus.services.api}
                    </p>
                  </div>
                  <Wifi className="h-8 w-8 text-purple-200" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-red-100">
                      {language === 'hindi' ? 'सुरक्षा' : 'Security'}
                    </p>
                    <p className="text-lg font-bold">{systemStatus.security.status}</p>
                    <p className="text-xs text-red-200">
                      {language === 'hindi' ? 'खतरे:' : 'Threats:'} {systemStatus.security.threats}
                    </p>
                  </div>
                  <Shield className="h-8 w-8 text-red-200" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Settings Interface */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Tabs Navigation */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="lg:w-64"
          >
            <Card>
              <CardHeader>
                <CardTitle>
                  {language === 'hindi' ? 'सेटिंग्स श्रेणियां' : 'Settings Categories'}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="space-y-1">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full text-left p-3 rounded-lg transition-colors ${
                          activeTab === tab.id
                            ? 'bg-orange-100 text-orange-800 border-l-4 border-orange-500'
                            : 'hover:bg-gray-100 text-gray-700'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <Icon className="h-5 w-5" />
                          <span className="font-medium">{tab.label}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Settings Content */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="flex-1"
          >
            <Card>
              <CardHeader>
                <CardTitle>
                  {tabs.find(t => t.id === activeTab)?.label} {language === 'hindi' ? 'सेटिंग्स' : 'Settings'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* General Settings */}
                {activeTab === 'general' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>{getGeneralLabels().siteName}</Label>
                        <Input
                          value={settings.general.siteName}
                          onChange={(e) => handleSettingChange('general', 'siteName', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label>{getGeneralLabels().contactEmail}</Label>
                        <Input
                          value={settings.general.contactEmail}
                          onChange={(e) => handleSettingChange('general', 'contactEmail', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label>{getGeneralLabels().contactPhone}</Label>
                        <Input
                          value={settings.general.contactPhone}
                          onChange={(e) => handleSettingChange('general', 'contactPhone', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label>{getGeneralLabels().timezone}</Label>
                        <Input
                          value={settings.general.timezone}
                          onChange={(e) => handleSettingChange('general', 'timezone', e.target.value)}
                        />
                      </div>
                    </div>
                    <div>
                      <Label>{getGeneralLabels().siteDescription}</Label>
                      <Textarea
                        value={settings.general.siteDescription}
                        onChange={(e) => handleSettingChange('general', 'siteDescription', e.target.value)}
                        rows={3}
                      />
                    </div>
                    <div>
                      <Label>{getGeneralLabels().address}</Label>
                      <Textarea
                        value={settings.general.address}
                        onChange={(e) => handleSettingChange('general', 'address', e.target.value)}
                        rows={2}
                      />
                    </div>
                  </div>
                )}

                {/* Notification Settings */}
                {activeTab === 'notifications' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h4 className="font-medium">{getNotificationLabels().channels}</h4>
                        {[
                          { key: 'emailEnabled', label: getNotificationLabels().emailEnabled },
                          { key: 'smsEnabled', label: getNotificationLabels().smsEnabled },
                          { key: 'pushEnabled', label: getNotificationLabels().pushEnabled }
                        ].map((item) => (
                          <div key={item.key} className="flex items-center justify-between">
                            <Label>{item.label}</Label>
                            <Switch
                              checked={settings.notifications[item.key as keyof typeof settings.notifications] as boolean}
                              onCheckedChange={(checked) => handleSettingChange('notifications', item.key, checked)}
                            />
                          </div>
                        ))}
                      </div>
                      
                      <div className="space-y-4">
                        <h4 className="font-medium">{getNotificationLabels().types}</h4>
                        {[
                          { key: 'citizenUpdates', label: getNotificationLabels().citizenUpdates },
                          { key: 'adminAlerts', label: getNotificationLabels().adminAlerts },
                          { key: 'emergencyAlerts', label: getNotificationLabels().emergencyAlerts },
                          { key: 'autoAssignment', label: getNotificationLabels().autoAssignment },
                          { key: 'weeklyReports', label: getNotificationLabels().weeklyReports }
                        ].map((item) => (
                          <div key={item.key} className="flex items-center justify-between">
                            <Label>{item.label}</Label>
                            <Switch
                              checked={settings.notifications[item.key as keyof typeof settings.notifications] as boolean}
                              onCheckedChange={(checked) => handleSettingChange('notifications', item.key, checked)}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Security Settings */}
                {activeTab === 'security' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h4 className="font-medium">{getSecurityLabels().authentication}</h4>
                        <div className="flex items-center justify-between">
                          <Label>{getSecurityLabels().twoFactorAuth}</Label>
                          <Switch
                            checked={settings.security.twoFactorAuth}
                            onCheckedChange={(checked) => handleSettingChange('security', 'twoFactorAuth', checked)}
                          />
                        </div>
                        <div>
                          <Label>{getSecurityLabels().sessionTimeout}</Label>
                          <Input
                            type="number"
                            value={settings.security.sessionTimeout}
                            onChange={(e) => handleSettingChange('security', 'sessionTimeout', parseInt(e.target.value))}
                          />
                        </div>
                        <div>
                          <Label>{getSecurityLabels().passwordExpiry}</Label>
                          <Input
                            type="number"
                            value={settings.security.passwordExpiry}
                            onChange={(e) => handleSettingChange('security', 'passwordExpiry', parseInt(e.target.value))}
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <h4 className="font-medium">{getSecurityLabels().policies}</h4>
                        <div className="flex items-center justify-between">
                          <Label>{getSecurityLabels().encryption}</Label>
                          <Switch
                            checked={settings.security.encryption}
                            onCheckedChange={(checked) => handleSettingChange('security', 'encryption', checked)}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label>{getSecurityLabels().auditLogs}</Label>
                          <Switch
                            checked={settings.security.auditLogs}
                            onCheckedChange={(checked) => handleSettingChange('security', 'auditLogs', checked)}
                          />
                        </div>
                        <div>
                          <Label>{getSecurityLabels().loginAttempts}</Label>
                          <Input
                            type="number"
                            value={settings.security.loginAttempts}
                            onChange={(e) => handleSettingChange('security', 'loginAttempts', parseInt(e.target.value))}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Performance Settings */}
                {activeTab === 'performance' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h4 className="font-medium">{getPerformanceLabels().caching}</h4>
                        {[
                          { key: 'cacheEnabled', label: getPerformanceLabels().cacheEnabled },
                          { key: 'compressionEnabled', label: getPerformanceLabels().compressionEnabled },
                          { key: 'imageOptimization', label: getPerformanceLabels().imageOptimization },
                          { key: 'databaseOptimization', label: getPerformanceLabels().databaseOptimization }
                        ].map((item) => (
                          <div key={item.key} className="flex items-center justify-between">
                            <Label>{item.label}</Label>
                            <Switch
                              checked={settings.performance[item.key as keyof typeof settings.performance] as boolean}
                              onCheckedChange={(checked) => handleSettingChange('performance', item.key, checked)}
                            />
                          </div>
                        ))}
                      </div>
                      
                      <div className="space-y-4">
                        <h4 className="font-medium">{getPerformanceLabels().monitoring}</h4>
                        {[
                          { key: 'autoBackup', label: getPerformanceLabels().autoBackup },
                          { key: 'monitoring', label: getPerformanceLabels().systemMonitoring },
                          { key: 'loadBalancing', label: getPerformanceLabels().loadBalancing },
                          { key: 'cdnEnabled', label: getPerformanceLabels().cdnEnabled }
                        ].map((item) => (
                          <div key={item.key} className="flex items-center justify-between">
                            <Label>{item.label}</Label>
                            <Switch
                              checked={settings.performance[item.key as keyof typeof settings.performance] as boolean}
                              onCheckedChange={(checked) => handleSettingChange('performance', item.key, checked)}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Department Settings */}
                {activeTab === 'departments' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h4 className="font-medium">{getDepartmentLabels().workflow}</h4>
                        {[
                          { key: 'autoAssignment', label: getDepartmentLabels().autoAssignment },
                          { key: 'workloadBalancing', label: getDepartmentLabels().workloadBalancing },
                          { key: 'priorityEscalation', label: getDepartmentLabels().priorityEscalation },
                          { key: 'workflowAutomation', label: getDepartmentLabels().workflowAutomation }
                        ].map((item) => (
                          <div key={item.key} className="flex items-center justify-between">
                            <Label>{item.label}</Label>
                            <Switch
                              checked={settings.departments[item.key as keyof typeof settings.departments] as boolean}
                              onCheckedChange={(checked) => handleSettingChange('departments', item.key, checked)}
                            />
                          </div>
                        ))}
                      </div>
                      
                      <div className="space-y-4">
                        <h4 className="font-medium">{getDepartmentLabels().tracking}</h4>
                        {[
                          { key: 'performanceTracking', label: getDepartmentLabels().performanceTracking },
                          { key: 'citizenRating', label: getDepartmentLabels().citizenRating },
                          { key: 'reportGeneration', label: getDepartmentLabels().reportGeneration },
                          { key: 'interdepartmentalCoordination', label: getDepartmentLabels().interdepartmentalCoordination }
                        ].map((item) => (
                          <div key={item.key} className="flex items-center justify-between">
                            <Label>{item.label}</Label>
                            <Switch
                              checked={settings.departments[item.key as keyof typeof settings.departments] as boolean}
                              onCheckedChange={(checked) => handleSettingChange('departments', item.key, checked)}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* System Monitoring */}
                {activeTab === 'system' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-sm">{getSystemLabels().serverMetrics}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="flex justify-between">
                            <span>{getSystemLabels().cpuUsage}</span>
                            <Badge className="bg-green-100 text-green-800">{systemStatus.server.cpu}</Badge>
                          </div>
                          <div className="flex justify-between">
                            <span>{getSystemLabels().memory}</span>
                            <Badge className="bg-yellow-100 text-yellow-800">{systemStatus.server.memory}</Badge>
                          </div>
                          <div className="flex justify-between">
                            <span>{getSystemLabels().diskSpace}</span>
                            <Badge className="bg-blue-100 text-blue-800">{systemStatus.server.disk}</Badge>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="text-sm">{getSystemLabels().databaseStatus}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="flex justify-between">
                            <span>{getSystemLabels().uptime}</span>
                            <Badge className="bg-green-100 text-green-800">{systemStatus.database.uptime}</Badge>
                          </div>
                          <div className="flex justify-between">
                            <span>{getSystemLabels().lastBackup}</span>
                            <Badge className="bg-blue-100 text-blue-800">{systemStatus.database.lastBackup}</Badge>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="text-sm">{getSystemLabels().serviceHealth}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="flex justify-between">
                            <span>{getSystemLabels().apiStatus}</span>
                            <Badge className="bg-green-100 text-green-800">{systemStatus.services.api}</Badge>
                          </div>
                          <div className="flex justify-between">
                            <span>{language === 'hindi' ? 'सूचनाएं:' : 'Notifications:'}</span>
                            <Badge className="bg-green-100 text-green-800">{systemStatus.services.notifications}</Badge>
                          </div>
                          <div className="flex justify-between">
                            <span>{language === 'hindi' ? 'एनालिटिक्स:' : 'Analytics:'}</span>
                            <Badge className="bg-green-100 text-green-800">{systemStatus.services.analytics}</Badge>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="text-sm">{getSystemLabels().securityStatus}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="flex justify-between">
                            <span>{getSystemLabels().threatsDetected}</span>
                            <Badge className="bg-green-100 text-green-800">{systemStatus.security.threats}</Badge>
                          </div>
                          <div className="flex justify-between">
                            <span>{getSystemLabels().lastSecurityScan}</span>
                            <Badge className="bg-blue-100 text-blue-800">{systemStatus.security.lastScan}</Badge>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* System Actions */}
                    <div className="border-t pt-6">
                      <h4 className="font-medium mb-4">
                        {language === 'hindi' ? 'सिस्टम एक्शन' : 'System Actions'}
                      </h4>
                      <div className="flex flex-wrap gap-3">
                        <Button
                          variant="outline"
                          onClick={resetToDefaults}
                          className="border-red-200 text-red-700 hover:bg-red-50"
                        >
                          <RefreshCw className="h-4 w-4 mr-2" />
                          {getSystemLabels().resetToDefaults}
                        </Button>
                        <Button
                          variant="outline"
                          className="border-yellow-200 text-yellow-700 hover:bg-yellow-50"
                        >
                          <RefreshCw className="h-4 w-4 mr-2" />
                          {getSystemLabels().systemRestart}
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </AdminLayout>
  );
}