import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { X, Phone, KeyRound, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { getTranslations, Language } from '../utils/translations';

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

export default function ForgotPasswordModal({ isOpen, onClose, language }: ForgotPasswordModalProps) {
  const [step, setStep] = useState<'phone' | 'otp' | 'password'>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const t = getTranslations(language);

  const handleSendOTP = async () => {
    if (!phoneNumber) {
      toast.error(t.messages.fillAllFields);
      return;
    }
    
    setIsLoading(true);
    // Simulate API call to send OTP
    setTimeout(() => {
      setIsLoading(false);
      setStep('otp');
      toast.success('OTP sent to your phone number');
    }, 2000);
  };

  const handleVerifyOTP = async () => {
    if (!otp) {
      toast.error(t.messages.fillAllFields);
      return;
    }
    
    setIsLoading(true);
    // Simulate API call to verify OTP
    setTimeout(() => {
      setIsLoading(false);
      setStep('password');
      toast.success('OTP verified successfully');
    }, 1500);
  };

  const handleResetPassword = async () => {
    if (!newPassword || !confirmPassword) {
      toast.error(t.messages.fillAllFields);
      return;
    }
    
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    
    setIsLoading(true);
    // Simulate API call to reset password
    setTimeout(() => {
      setIsLoading(false);
      toast.success('Password reset successfully!');
      onClose();
      resetForm();
    }, 2000);
  };

  const resetForm = () => {
    setStep('phone');
    setPhoneNumber('');
    setOtp('');
    setNewPassword('');
    setConfirmPassword('');
    setShowNewPassword(false);
    setShowConfirmPassword(false);
  };

  const handleClose = () => {
    onClose();
    resetForm();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="w-full max-w-md"
        >
          <Card className="bg-white/95 backdrop-blur-sm border-2 border-orange-200 shadow-2xl">
            <CardHeader className="relative">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClose}
                className="absolute right-2 top-2 h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
              <CardTitle className="text-center" style={{ color: '#FF9933' }}>
                {t.resetPassword}
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-6">
              {step === 'phone' && (
                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="flex items-center space-x-2">
                      <Phone className="h-4 w-4" />
                      <span>{t.phoneNumber}</span>
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder={t.enterPhoneNumber}
                      className="border-orange-200 focus:border-orange-500"
                    />
                  </div>
                  
                  <Button
                    onClick={handleSendOTP}
                    disabled={isLoading}
                    className="w-full bg-orange-500 hover:bg-orange-600"
                    style={{ backgroundColor: '#FF9933' }}
                  >
                    {isLoading ? t.loading : t.sendOTP}
                  </Button>
                </motion.div>
              )}

              {step === 'otp' && (
                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <Label htmlFor="otp" className="flex items-center space-x-2">
                      <KeyRound className="h-4 w-4" />
                      <span>{t.enterOTP}</span>
                    </Label>
                    <Input
                      id="otp"
                      type="text"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      placeholder="Enter 6-digit OTP"
                      maxLength={6}
                      className="border-orange-200 focus:border-orange-500 text-center text-lg tracking-widest"
                    />
                  </div>
                  
                  <Button
                    onClick={handleVerifyOTP}
                    disabled={isLoading}
                    className="w-full bg-orange-500 hover:bg-orange-600"
                    style={{ backgroundColor: '#FF9933' }}
                  >
                    {isLoading ? t.loading : t.verifyOTP}
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() => setStep('phone')}
                    className="w-full"
                  >
                    Back to Phone Number
                  </Button>
                </motion.div>
              )}

              {step === 'password' && (
                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">{t.newPassword}</Label>
                    <div className="relative">
                      <Input
                        id="newPassword"
                        type={showNewPassword ? 'text' : 'password'}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Enter new password"
                        className="border-orange-200 focus:border-orange-500 pr-10"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                      >
                        {showNewPassword ? (
                          <EyeOff className="h-4 w-4 text-gray-400" />
                        ) : (
                          <Eye className="h-4 w-4 text-gray-400" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">{t.confirmPassword}</Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm new password"
                        className="border-orange-200 focus:border-orange-500 pr-10"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4 text-gray-400" />
                        ) : (
                          <Eye className="h-4 w-4 text-gray-400" />
                        )}
                      </Button>
                    </div>
                  </div>
                  
                  <Button
                    onClick={handleResetPassword}
                    disabled={isLoading}
                    className="w-full bg-orange-500 hover:bg-orange-600"
                    style={{ backgroundColor: '#FF9933' }}
                  >
                    {isLoading ? t.loading : t.resetPassword}
                  </Button>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}