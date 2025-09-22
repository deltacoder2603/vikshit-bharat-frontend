import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Flag, MapPin, IdCard, Phone, User as UserIcon } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { User } from '../App';
import LanguageToggle from './LanguageToggle';
import { getTranslations, Language } from '../utils/translations';

interface RegistrationPageProps {
  onRegister: (userData: Omit<User, 'id'> & { password: string }) => void;
  onSwitchToLogin: () => void;
  language: Language;
  onLanguageChange: (language: Language) => void;
}

export default function RegistrationPage({ onRegister, onSwitchToLogin, language, onLanguageChange }: RegistrationPageProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    authType: 'aadhaar' as 'aadhaar',
    authNumber: '',
    address: '',
    password: '',
    confirmPassword: ''
  });
  
  const t = getTranslations(language);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast.error(language === 'hindi' ? 'पासवर्ड मैच नहीं हो रहा' : 'Passwords do not match');
      return;
    }

    if (formData.authNumber.length !== 12) {
      toast.error(language === 'hindi' ? 'आधार संख्या 12 अंकों की होनी चाहिए' : 'Aadhaar number should be 12 digits');
      return;
    }

    // Show success notification
    toast.success(
      language === 'hindi' ? 'रजिस्ट्रेशन सफल!' : 'Registration Successful!',
      {
        description: language === 'hindi' ? 'VIKSIT KANPUR में आपका स्वागत है' : 'Welcome to VIKSIT KANPUR'
      }
    );

    // Delay to show the notification
    setTimeout(() => {
      onRegister({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        authType: formData.authType,
        authNumber: formData.authNumber,
        address: formData.address,
        role: 'citizen',
        password: formData.password
      });
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Language Toggle */}
      <div className="fixed top-4 right-4 z-20">
        <LanguageToggle 
          language={language} 
          onToggle={onLanguageChange}
        />
      </div>
      {/* Enhanced Animated background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Sliding saffron stripe */}
        <motion.div
          className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-br from-orange-500 via-orange-400 to-orange-500"
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 0.12 }}
          transition={{ duration: 2, delay: 0.1 }}
        />
        <motion.div
          className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-r from-transparent via-orange-300 to-transparent"
          animate={{ x: [100, -100] }}
          transition={{ duration: 9, repeat: Infinity, repeatType: "reverse" }}
        />
        
        {/* Sliding white stripe */}
        <motion.div
          className="absolute top-1/3 left-0 w-full h-1/3 bg-gradient-to-br from-white via-gray-50 to-white"
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 0.15 }}
          transition={{ duration: 2, delay: 0.3 }}
        />
        <motion.div
          className="absolute top-1/3 left-0 w-full h-1/3 bg-gradient-to-r from-transparent via-gray-200 to-transparent"
          animate={{ x: [-100, 100] }}
          transition={{ duration: 11, repeat: Infinity, repeatType: "reverse" }}
        />
        
        {/* Sliding green stripe */}
        <motion.div
          className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-br from-green-600 via-green-500 to-green-600"
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 0.12 }}
          transition={{ duration: 2, delay: 0.5 }}
        />
        <motion.div
          className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-r from-transparent via-green-400 to-transparent"
          animate={{ x: [100, -100] }}
          transition={{ duration: 13, repeat: Infinity, repeatType: "reverse" }}
        />
        
        {/* Floating geometric shapes */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute w-3 h-3 rounded-full ${
              i % 3 === 0 ? 'bg-orange-300/40' : 
              i % 3 === 1 ? 'bg-white/50' : 'bg-green-300/40'
            }`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -25, 0],
              x: [0, 15, 0],
              scale: [1, 1.3, 1],
              opacity: [0.4, 0.8, 0.4],
            }}
            transition={{
              duration: 5 + i,
              repeat: Infinity,
              delay: i * 1.2,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-lg z-10"
      >
        <Card className="bg-white/90 backdrop-blur-sm border-2 border-green-200 shadow-2xl">
          <CardHeader className="text-center space-y-4">
            <motion.div
              initial={{ y: -20 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex items-center justify-center"
            >
              <div className="flex space-x-1">
                <motion.div 
                  className="w-3 h-8 bg-orange-500 rounded-sm shadow-lg"
                  animate={{ scaleY: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0 }}
                />
                <motion.div 
                  className="w-3 h-8 bg-white border border-gray-300 rounded-sm shadow-lg"
                  animate={{ scaleY: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.2 }}
                />
                <motion.div 
                  className="w-3 h-8 bg-green-600 rounded-sm shadow-lg"
                  animate={{ scaleY: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.4 }}
                />
              </div>
            </motion.div>
            
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <CardTitle className="text-2xl font-bold" style={{ color: '#FF9933' }}>
                {t.createAccount}
              </CardTitle>
              <p className="text-gray-600 mt-2 flex items-center justify-center space-x-1">
                <MapPin className="h-4 w-4" />
                <span>Join VIKSIT KANPUR</span>
              </p>
            </motion.div>
          </CardHeader>

          <CardContent>
            <motion.form
              onSubmit={handleSubmit}
              className="space-y-4"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">{t.fullName}</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder={t.fullName}
                    className="border-green-200 focus:border-green-500"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">{t.email}</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder={t.email}
                    className="border-green-200 focus:border-green-500"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="flex items-center space-x-1">
                  <Phone className="h-4 w-4" />
                  <span>{t.phoneNumber}</span>
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="+91 9876543210"
                  className="border-green-200 focus:border-green-500"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="authNumber" className="flex items-center space-x-2">
                  <IdCard className="h-4 w-4 text-blue-600" />
                  <span>{t.aadharNumber}</span>
                </Label>
                <Input
                  id="authNumber"
                  value={formData.authNumber}
                  onChange={(e) => handleInputChange('authNumber', e.target.value)}
                  placeholder="1234 5678 9012"
                  className="border-green-200 focus:border-green-500"
                  maxLength={12}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address" className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-green-600" />
                  <span>{t.address}</span>
                </Label>
                <Textarea
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  placeholder={t.address}
                  className="border-green-200 focus:border-green-500 min-h-[80px]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="password">{t.password}</Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    placeholder={t.password}
                    className="border-green-200 focus:border-green-500"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">{t.confirmPassword}</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    placeholder={t.confirmPassword}
                    className="border-green-200 focus:border-green-500"
                    required
                  />
                </div>
              </div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white py-6"
                >
                  {t.registerButton}
                </Button>
              </motion.div>

              <div className="text-center">
                <button
                  type="button"
                  onClick={onSwitchToLogin}
                  className="text-blue-600 hover:text-blue-800 underline"
                >
                  {t.alreadyHaveAccount}
                </button>
              </div>
            </motion.form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}