import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Eye, EyeOff, Shield, Building, User, Crown } from 'lucide-react';
import { User as UserType } from '../App';
import { toast } from 'sonner@2.0.3';
import { api } from '../utils/api';
import LanguageToggle from './LanguageToggle';
import ForgotPasswordModal from './ForgotPasswordModal';
import { getTranslations, Language } from '../utils/translations';

interface AdminLoginPageProps {
  onLogin: (emailOrUsername: string, password: string, role: string, department?: string) => void;
  onSwitchToCitizenLogin: () => void;
  language: Language;
  onLanguageChange: (language: Language) => void;
}

export default function AdminLoginPage({ onLogin, onSwitchToCitizenLogin, language, onLanguageChange }: AdminLoginPageProps) {
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [department, setDepartment] = useState('');
  const [customDepartment, setCustomDepartment] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const t = getTranslations(language);

  const roles = [
    { 
      value: 'field-worker', 
      label: language === 'hindi' ? 'फील्ड वर्कर / Field Worker' : 'Field Worker', 
      icon: User, 
      color: 'text-blue-600' 
    },
    { 
      value: 'department-head', 
      label: language === 'hindi' ? 'विभाग प्रमुख / Department Head' : 'Department Head', 
      icon: Building, 
      color: 'text-green-600' 
    },
    { 
      value: 'district-magistrate', 
      label: language === 'hindi' ? 'जिला मजिस्ट्रेट / District Magistrate' : 'District Magistrate', 
      icon: Crown, 
      color: 'text-purple-600' 
    }
  ];

  const departments = [
    t.departments.sanitation,
    t.departments.water, 
    t.departments.electricity,
    t.departments.roads,
    'आवास विभाग / Housing & Urban Development',
    'पर्यावरण विभाग / Environment & Pollution Control',
    'यातायात विभाग / Traffic & Transportation',
    'नगर निगम / Municipal Corporation',
    t.departments.health,
    t.departments.education,
    'अग्निशमन विभाग / Fire Department',
    'सुरक्षा विभाग / Security Department',
    t.departments.otherDepartment
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailOrUsername || !password || !role) return;
    
    // Check if department is required and validate custom department
    if ((role === 'field-worker' || role === 'department-head')) {
      if (!department) return;
      if (department === t.departments.otherDepartment && !customDepartment.trim()) {
        return;
      }
    }
    
    setIsLoading(true);
    
    try {
      // Call real backend API for login
      const response = await api.login(emailOrUsername, password);
      
      if (response.token && response.user) {
        // Store the token for future API calls
        localStorage.setItem('auth_token', response.token);
        localStorage.setItem('user_data', JSON.stringify(response.user));
        
        // Use custom department if "Other Department" is selected
        const finalDepartment = department === t.departments.otherDepartment 
          ? customDepartment 
          : department;
        
        // Use the role from the backend response instead of the form selection
        const userRole = response.user.role || role;
        
        onLogin(response.user.email, password, userRole, response.user.department || finalDepartment);
        toast.success('Login successful!');
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error(error.message || 'Login failed. Please try again.');
      setError(error.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const selectedRole = roles.find(r => r.value === role);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-green-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Language Toggle */}
      <div className="fixed top-4 right-4 z-20">
        <LanguageToggle 
          language={language} 
          onToggle={onLanguageChange}
        />
      </div>
      {/* Enhanced Indian Flag Animated Background with Cultural Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Saffron Background Waves */}
        <motion.div
          animate={{
            x: ['-100%', '100%'],
            y: ['-10%', '10%']
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            repeatType: 'reverse',
            ease: 'easeInOut'
          }}
          className="absolute -top-20 -left-20 w-[150%] h-40 bg-gradient-to-r from-orange-200/40 to-orange-300/40 transform -rotate-12"
        />
        
        {/* White Middle Section with Ashoka Chakra Pattern */}
        <motion.div
          animate={{
            rotate: [0, 360]
          }}
          transition={{
            duration: 120,
            repeat: Infinity,
            ease: 'linear'
          }}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 opacity-5"
        >
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <circle cx="50" cy="50" r="45" fill="none" stroke="#000080" strokeWidth="0.5"/>
            {Array.from({length: 24}).map((_, i) => (
              <line
                key={i}
                x1="50"
                y1="5"
                x2="50"
                y2="15"
                stroke="#000080"
                strokeWidth="0.3"
                transform={`rotate(${i * 15} 50 50)`}
              />
            ))}
          </svg>
        </motion.div>
        
        {/* Green Background Waves */}
        <motion.div
          animate={{
            x: ['100%', '-100%'],
            y: ['-10%', '10%']
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            repeatType: 'reverse',
            ease: 'easeInOut'
          }}
          className="absolute -bottom-20 -right-20 w-[150%] h-40 bg-gradient-to-l from-green-200/40 to-green-300/40 transform rotate-12"
        />

        {/* Floating People Silhouettes */}
        {Array.from({length: 8}).map((_, i) => (
          <motion.div
            key={`people-${i}`}
            animate={{
              y: [0, -30, 0],
              x: [0, Math.random() * 40 - 20, 0],
              opacity: [0.1, 0.3, 0.1]
            }}
            transition={{
              duration: 8 + Math.random() * 6,
              repeat: Infinity,
              delay: Math.random() * 8
            }}
            className="absolute opacity-20"
            style={{
              left: `${10 + Math.random() * 80}%`,
              top: `${20 + Math.random() * 60}%`,
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="text-blue-600">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
            </svg>
          </motion.div>
        ))}

        {/* Children Playing Silhouettes */}
        {Array.from({length: 6}).map((_, i) => (
          <motion.div
            key={`children-${i}`}
            animate={{
              scale: [0.8, 1.2, 0.8],
              rotate: [0, 10, -10, 0],
              opacity: [0.1, 0.25, 0.1]
            }}
            transition={{
              duration: 5 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 6
            }}
            className="absolute opacity-15"
            style={{
              left: `${5 + Math.random() * 90}%`,
              top: `${10 + Math.random() * 80}%`,
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="text-green-600">
              <circle cx="9" cy="9" r="4"/>
              <path d="M9 15c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
            </svg>
          </motion.div>
        ))}

        {/* Indian Flag Elements */}
        {Array.from({length: 4}).map((_, i) => (
          <motion.div
            key={`flag-${i}`}
            animate={{
              y: [0, -20, 0],
              rotate: [0, 5, -5, 0],
              opacity: [0.1, 0.3, 0.1]
            }}
            transition={{
              duration: 6 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 8
            }}
            className="absolute opacity-20"
            style={{
              left: `${15 + Math.random() * 70}%`,
              top: `${5 + Math.random() * 90}%`,
            }}
          >
            <div className="flex space-x-1">
              <div className="w-2 h-6 bg-orange-400 rounded-sm"></div>
              <div className="w-2 h-6 bg-white border border-gray-300 rounded-sm"></div>
              <div className="w-2 h-6 bg-green-500 rounded-sm"></div>
            </div>
          </motion.div>
        ))}

        {/* Car/Vehicle Silhouettes */}
        {Array.from({length: 4}).map((_, i) => (
          <motion.div
            key={`car-${i}`}
            animate={{
              x: i % 2 === 0 ? ['-20px', '20px', '-20px'] : ['20px', '-20px', '20px'],
              opacity: [0.05, 0.15, 0.05]
            }}
            transition={{
              duration: 12 + Math.random() * 8,
              repeat: Infinity,
              delay: Math.random() * 10
            }}
            className="absolute opacity-10"
            style={{
              left: `${20 + Math.random() * 60}%`,
              top: `${30 + Math.random() * 40}%`,
            }}
          >
            <svg width="32" height="16" viewBox="0 0 24 12" fill="currentColor" className="text-blue-700">
              <path d="M6 10a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM22 10a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM2 6h20l-2-4H4L2 6z"/>
            </svg>
          </motion.div>
        ))}

        {/* Lotus Pattern Background */}
        <motion.div
          animate={{
            rotate: [0, 360],
            scale: [0.9, 1.1, 0.9]
          }}
          transition={{
            duration: 40,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
          className="absolute top-10 right-10 opacity-10"
        >
          <svg width="80" height="80" viewBox="0 0 100 100" fill="currentColor" className="text-orange-400">
            <path d="M50 85c0-15-15-25-15-35s15-20 15-35c0 15 15 25 15 35s-15 20-15 35zm-20-35c10 0 20-10 35-15-15 0-25-15-35-15 0 10 10 20 15 35-10 0-20 10-35 15 15 0 25 15 35 15 0-10-10-20-15-35zm40 0c-10 0-20 10-35 15 15 0 25 15 35 15 0-10-10-20-15-35 10 0 20-10 35-15-15 0-25-15-35-15 0 10 10 20 15 35z"/>
          </svg>
        </motion.div>

        {/* Traditional Mandala Pattern */}
        <motion.div
          animate={{
            rotate: [0, -360]
          }}
          transition={{
            duration: 60,
            repeat: Infinity,
            ease: 'linear'
          }}
          className="absolute bottom-10 left-10 opacity-8"
        >
          <svg width="60" height="60" viewBox="0 0 100 100" fill="none" className="text-green-500">
            <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="1" opacity="0.3"/>
            <circle cx="50" cy="50" r="30" stroke="currentColor" strokeWidth="1" opacity="0.4"/>
            <circle cx="50" cy="50" r="20" stroke="currentColor" strokeWidth="1" opacity="0.5"/>
            {Array.from({length: 12}).map((_, i) => (
              <line
                key={i}
                x1="50"
                y1="10"
                x2="50"
                y2="25"
                stroke="currentColor"
                strokeWidth="1"
                opacity="0.4"
                transform={`rotate(${i * 30} 50 50)`}
              />
            ))}
          </svg>
        </motion.div>
        
        {/* Floating Particles */}
        {Array.from({length: 25}).map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: [0, -20, 0],
              x: [0, Math.random() * 20 - 10, 0],
              opacity: [0.3, 0.8, 0.3]
            }}
            transition={{
              duration: 4 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 4
            }}
            className="absolute w-2 h-2 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              backgroundColor: i % 3 === 0 ? '#FF9933' : i % 3 === 1 ? '#FFFFFF' : '#138808'
            }}
          />
        ))}
        
        {/* Geometric Patterns */}
        <motion.div
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%'],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: 'reverse',
          }}
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23FF9933' fill-opacity='0.3'%3E%3Cpath d='M30 30c0-16.569 13.431-30 30-30v60C43.431 60 30 46.569 30 30z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
        className="w-full max-w-md relative z-10"
      >
        <Card className="bg-white/98 backdrop-blur-md border-2 border-orange-200/50 shadow-2xl shadow-orange-500/20 overflow-hidden">
          {/* Card Header Background */}
          <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-br from-orange-100/50 via-white/30 to-green-100/50" />
          
          <CardHeader className="text-center pb-2 relative z-10">
            {/* Enhanced Flag Animation */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="flex justify-center space-x-1 mb-6"
            >
              <motion.div
                animate={{ 
                  y: [0, -8, 0],
                  rotateZ: [0, 2, 0, -2, 0]
                }}
                transition={{ 
                  duration: 3, 
                  repeat: Infinity, 
                  delay: 0,
                  ease: "easeInOut"
                }}
                className="w-5 h-10 bg-gradient-to-b from-orange-400 to-orange-500 rounded-sm shadow-xl border border-orange-600/30"
              />
              <motion.div
                animate={{ 
                  y: [0, -8, 0],
                  rotateZ: [0, -2, 0, 2, 0]
                }}
                transition={{ 
                  duration: 3, 
                  repeat: Infinity, 
                  delay: 0.4,
                  ease: "easeInOut"
                }}
                className="w-5 h-10 bg-white border-2 border-gray-300 rounded-sm shadow-xl relative overflow-hidden"
              >
                {/* Ashoka Chakra in white stripe */}
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <div className="w-3 h-3 rounded-full border border-blue-800/20">
                    <svg viewBox="0 0 24 24" className="w-full h-full">
                      <circle cx="12" cy="12" r="10" fill="none" stroke="#000080" strokeWidth="0.5" opacity="0.3"/>
                      {Array.from({length: 8}).map((_, i) => (
                        <line
                          key={i}
                          x1="12"
                          y1="4"
                          x2="12"
                          y2="6"
                          stroke="#000080"
                          strokeWidth="0.3"
                          opacity="0.4"
                          transform={`rotate(${i * 45} 12 12)`}
                        />
                      ))}
                    </svg>
                  </div>
                </motion.div>
              </motion.div>
              <motion.div
                animate={{ 
                  y: [0, -8, 0],
                  rotateZ: [0, 2, 0, -2, 0]
                }}
                transition={{ 
                  duration: 3, 
                  repeat: Infinity, 
                  delay: 0.8,
                  ease: "easeInOut"
                }}
                className="w-5 h-10 bg-gradient-to-b from-green-500 to-green-600 rounded-sm shadow-xl border border-green-700/30"
              />
            </motion.div>
            
            {/* National Emblem inspired decoration */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="flex justify-center mb-4"
            >
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-100 to-green-100 border-2 border-orange-300/50 flex items-center justify-center shadow-lg">
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                >
                  <Shield className="h-6 w-6 text-blue-800" />
                </motion.div>
              </div>
            </motion.div>
            
            <CardTitle className="text-2xl mb-2" style={{ color: '#FF9933' }}>
              VIKSIT KANPUR
            </CardTitle>
            <p className="text-gray-600 flex items-center justify-center space-x-2">
              <Shield className="h-4 w-4" />
              <span>{t.governmentLogin}</span>
            </p>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                <Label htmlFor="role">{language === 'hindi' ? 'भूमिका / Role' : 'Role'} *</Label>
                <Select value={role} onValueChange={setRole}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={language === 'hindi' ? 'अपनी भूमिका चुनें' : 'Select your role'} />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map((roleOption) => {
                      const Icon = roleOption.icon;
                      return (
                        <SelectItem key={roleOption.value} value={roleOption.value}>
                          <div className="flex items-center space-x-2">
                            <Icon className={`h-4 w-4 ${roleOption.color}`} />
                            <span>{roleOption.label}</span>
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </motion.div>

              {(role === 'field-worker' || role === 'department-head') && (
                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                  className="space-y-4"
                >
                  <Label htmlFor="department">विभाग / Department *</Label>
                  <Select 
                    value={department} 
                    onValueChange={(value) => {
                      setDepartment(value);
                      setCustomDepartment('');
                    }}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={language === 'hindi' ? 'अपना विभाग चुनें' : 'Select your department'} />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map((dept) => (
                        <SelectItem key={dept} value={dept}>
                          {dept}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {/* Custom Department Input - Only show when "Other Department" is selected */}
                  {department === t.departments.otherDepartment && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-2"
                    >
                      <Label>विभाग का नाम लिखें / Enter Department Name</Label>
                      <Input
                        value={customDepartment}
                        onChange={(e) => setCustomDepartment(e.target.value)}
                        placeholder={t.messages.otherDepartmentPlaceholder}
                        className="bg-white/80"
                        required
                      />
                    </motion.div>
                  )}
                </motion.div>
              )}

              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.5 }}
              >
                <div className="flex justify-between items-center">
                  <Label htmlFor="emailOrUsername">{t.emailOrUsername} *</Label>
                  <button
                    type="button"
                    onClick={() => setShowForgotPassword(true)}
                    className="text-sm text-blue-600 hover:text-blue-800 underline"
                  >
                    {t.forgotPassword}
                  </button>
                </div>
                <Input
                  id="emailOrUsername"
                  type="text"
                  value={emailOrUsername}
                  onChange={(e) => setEmailOrUsername(e.target.value)}
                  placeholder={t.enterEmailOrUsername}
                  className="bg-white/80"
                  required
                />
              </motion.div>

              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.7, duration: 0.5 }}
              >
                <Label htmlFor="password">{t.password} *</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="bg-white/80 pr-10"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </Button>
                </div>
              </motion.div>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.5 }}
                className="space-y-3"
              >
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white py-2.5"
                  style={{ backgroundColor: isLoading ? '#9CA3AF' : '#FF9933' }}
                  disabled={isLoading || !emailOrUsername || !password || !role}
                >
                  {isLoading ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                    />
                  ) : (
                    <>
                      {selectedRole && <selectedRole.icon className="h-4 w-4 mr-2" />}
                      {t.loginButton}
                    </>
                  )}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={onSwitchToCitizenLogin}
                  className="w-full border-blue-200 text-blue-700 hover:bg-blue-50"
                >
                  {language === 'hindi' ? 'नागरिक लॉगिन' : 'Citizen Login'}
                </Button>
              </motion.div>
            </form>


          </CardContent>
        </Card>
      </motion.div>

      {/* Forgot Password Modal */}
      <ForgotPasswordModal
        isOpen={showForgotPassword}
        onClose={() => setShowForgotPassword(false)}
        language={language}
      />
    </div>
  );
}