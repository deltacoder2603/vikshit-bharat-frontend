import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Eye, EyeOff, Flag, MapPin, Shield } from 'lucide-react';
import LanguageToggle from './LanguageToggle';
import ForgotPasswordModal from './ForgotPasswordModal';
import { getTranslations, Language } from '../utils/translations';

interface LoginPageProps {
  onLogin: (emailOrUsername: string, password: string) => void;
  onSwitchToRegister: () => void;
  onSwitchToAdminLogin: () => void;
  language: Language;
  onLanguageChange: (language: Language) => void;
}

export default function LoginPage({ onLogin, onSwitchToRegister, onSwitchToAdminLogin, language, onLanguageChange }: LoginPageProps) {
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  
  const t = getTranslations(language);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailOrUsername && password) {
      onLogin(emailOrUsername, password);
    }
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
      {/* Enhanced Animated background elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Main Flag Stripes with better gradients */}
        <motion.div
          className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-br from-orange-500 via-orange-400 to-orange-500"
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 0.15 }}
          transition={{ duration: 2, delay: 0.2 }}
        />
        <motion.div
          className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-r from-transparent via-orange-300 to-transparent"
          animate={{ x: [-100, 100] }}
          transition={{ duration: 8, repeat: Infinity, repeatType: "reverse" }}
        />
        
        <motion.div
          className="absolute top-1/3 left-0 w-full h-1/3 bg-gradient-to-br from-white via-gray-50 to-white"
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 0.2 }}
          transition={{ duration: 2, delay: 0.4 }}
        />
        <motion.div
          className="absolute top-1/3 left-0 w-full h-1/3 bg-gradient-to-r from-transparent via-gray-200 to-transparent"
          animate={{ x: [100, -100] }}
          transition={{ duration: 10, repeat: Infinity, repeatType: "reverse" }}
        />
        
        <motion.div
          className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-br from-green-600 via-green-500 to-green-600"
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 0.15 }}
          transition={{ duration: 2, delay: 0.6 }}
        />
        <motion.div
          className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-r from-transparent via-green-400 to-transparent"
          animate={{ x: [-100, 100] }}
          transition={{ duration: 12, repeat: Infinity, repeatType: "reverse" }}
        />

        {/* Indian Architecture inspired patterns */}
        <motion.div
          className="absolute top-10 right-10 w-20 h-20 border-4 border-orange-300/20 rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute top-20 right-20 w-12 h-12 border-2 border-green-400/30 rounded-full"
          animate={{ rotate: -360 }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        />

        {/* Government building silhouettes */}
        <motion.div
          className="absolute bottom-10 left-10 opacity-10"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 0.1 }}
          transition={{ duration: 3, delay: 1 }}
        >
          <svg width="80" height="60" viewBox="0 0 80 60" className="fill-orange-600">
            <rect x="10" y="40" width="60" height="20" />
            <rect x="0" y="35" width="80" height="5" />
            <rect x="15" y="20" width="8" height="20" />
            <rect x="27" y="20" width="8" height="20" />
            <rect x="39" y="20" width="8" height="20" />
            <rect x="51" y="20" width="8" height="20" />
            <polygon points="40,10 60,30 20,30" />
          </svg>
        </motion.div>

        <motion.div
          className="absolute top-20 left-20 opacity-10"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 0.1 }}
          transition={{ duration: 3, delay: 1.5 }}
        >
          <svg width="60" height="50" viewBox="0 0 60 50" className="fill-green-600">
            <rect x="5" y="30" width="50" height="20" />
            <rect x="0" y="25" width="60" height="5" />
            <rect x="10" y="15" width="6" height="15" />
            <rect x="20" y="15" width="6" height="15" />
            <rect x="30" y="15" width="6" height="15" />
            <rect x="40" y="15" width="6" height="15" />
            <polygon points="30,5 45,20 15,20" />
          </svg>
        </motion.div>

        {/* Floating civic symbols */}
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute ${
              i % 4 === 0 ? 'w-6 h-6' : 
              i % 4 === 1 ? 'w-4 h-4' : 
              i % 4 === 2 ? 'w-5 h-5' : 'w-3 h-3'
            } ${
              i % 3 === 0 ? 'bg-orange-300/25' : 
              i % 3 === 1 ? 'bg-white/35' : 'bg-green-300/25'
            } ${
              i % 2 === 0 ? 'rounded-full' : 'rounded-lg rotate-45'
            }`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -40 - i * 2, 0],
              x: [0, 25 - i * 3, 0],
              scale: [1, 1.3 + i * 0.1, 1],
              opacity: [0.2, 0.8, 0.2],
              rotate: [0, 360, 0],
            }}
            transition={{
              duration: 5 + i * 0.5,
              repeat: Infinity,
              delay: i * 0.6,
              ease: "easeInOut",
            }}
          />
        ))}

        {/* Chakra-inspired pattern */}
        <motion.div
          className="absolute top-1/2 left-20 transform -translate-y-1/2 opacity-5"
          animate={{ rotate: 360 }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        >
          <svg width="100" height="100" viewBox="0 0 100 100" className="fill-blue-800">
            <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="2" />
            {[...Array(24)].map((_, i) => (
              <line
                key={i}
                x1="50"
                y1="50"
                x2="50"
                y2="10"
                stroke="currentColor"
                strokeWidth="1"
                transform={`rotate(${i * 15} 50 50)`}
              />
            ))}
          </svg>
        </motion.div>
      </div>

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md z-10"
      >
        <Card className="bg-white/90 backdrop-blur-sm border-2 border-orange-200 shadow-2xl">
          <CardHeader className="text-center space-y-4">
            <motion.div
              initial={{ y: -20 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
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
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <CardTitle className="text-3xl font-bold" style={{ color: '#FF9933' }}>
                VIKSIT KANPUR
              </CardTitle>
              <p className="text-gray-600 mt-2 flex items-center justify-center space-x-1">
                <MapPin className="h-4 w-4" />
                <span>
                  {language === 'hindi' ? 'विकसित कानपुर के लिए लॉगिन करें' : 'Login for a Developed Kanpur'}
                </span>
              </p>
            </motion.div>
          </CardHeader>



          <CardContent>
            <motion.form
              onSubmit={handleSubmit}
              className="space-y-6"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <div className="space-y-2">
                <Label htmlFor="emailOrUsername" className="text-gray-700">
                  {t.emailOrUsername}
                </Label>
                <Input
                  id="emailOrUsername"
                  type="text"
                  value={emailOrUsername}
                  onChange={(e) => setEmailOrUsername(e.target.value)}
                  placeholder={t.enterEmailOrUsername}
                  className="border-orange-200 focus:border-orange-500 focus:ring-orange-200"
                  required
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="password" className="text-gray-700">
                    {t.password}
                  </Label>
                  <button
                    type="button"
                    onClick={() => setShowForgotPassword(true)}
                    className="text-sm text-blue-600 hover:text-blue-800 underline"
                  >
                    {t.forgotPassword}
                  </button>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={t.enterPassword}
                    className="border-orange-200 focus:border-orange-500 focus:ring-orange-200 pr-10"
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
              </div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  type="submit"
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white py-6"
                  style={{ backgroundColor: '#FF9933' }}
                >
                  {t.loginButton}
                </Button>
              </motion.div>

              {/* Removed Google login functionality */}

              <div className="space-y-3">
                <div className="text-center">
                  <button
                    type="button"
                    onClick={onSwitchToRegister}
                    className="text-blue-600 hover:text-blue-800 underline"
                  >
                    {t.createAccount}
                  </button>
                </div>
                
                <div className="text-center space-y-2">
                  <button
                    type="button"
                    onClick={onSwitchToAdminLogin}
                    className="flex items-center justify-center space-x-2 text-purple-600 hover:text-purple-800 underline mx-auto"
                  >
                    <Shield className="h-4 w-4" />
                    <span>{t.governmentLogin}</span>
                  </button>
                </div>
              </div>
            </motion.form>
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