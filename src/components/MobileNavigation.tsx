import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/button';
import { 
  Home, 
  History, 
  Map, 
  User,
  Plus,
  Search,
  Bell,
  Menu,
  X
} from 'lucide-react';

interface MobileNavigationProps {
  currentPage: string;
  onNavigate: (page: 'dashboard' | 'history') => void;
  language?: 'hindi' | 'english';
  user?: any;
  onViewProfile?: () => void;
  onLogout?: () => void;
}

export default function MobileNavigation({ 
  currentPage, 
  onNavigate, 
  language = 'hindi',
  user,
  onViewProfile,
  onLogout
}: MobileNavigationProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Hide/show navbar on scroll for better mobile UX
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const isScrollingDown = currentScrollY > lastScrollY;
      const scrollThreshold = 10;

      if (Math.abs(currentScrollY - lastScrollY) > scrollThreshold) {
        setIsVisible(!isScrollingDown || currentScrollY < 100);
        setLastScrollY(currentScrollY);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const navItems = [
    { 
      id: 'dashboard', 
      icon: Home, 
      label: language === 'hindi' ? 'होम' : 'Home',
      color: 'text-blue-600',
      activeColor: 'bg-blue-50 text-blue-700'
    },
    { 
      id: 'history', 
      icon: History, 
      label: language === 'hindi' ? 'इतिहास' : 'History',
      color: 'text-purple-600',
      activeColor: 'bg-purple-50 text-purple-700'
    },
  ];

  return (
    <>
      {/* Enhanced Mobile Navigation Bar */}
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ 
          y: isVisible ? 0 : 100, 
          opacity: isVisible ? 1 : 0 
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-200 shadow-2xl sm:hidden z-50"
        style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(249,250,251,0.95) 100%)',
          borderTop: '1px solid rgba(209,213,219,0.3)'
        }}
      >
        {/* Navigation Content */}
        <div className="relative">
          {/* Main Navigation */}
          <div className="flex justify-around items-center py-2 px-2 relative">
            {navItems.map((item, index) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              
              return (
                <motion.div
                  key={item.id}
                  whileTap={{ scale: 0.9 }}
                  whileHover={{ scale: 1.05 }}
                  className="relative"
                >
                  {/* Active indicator */}
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full"
                      initial={false}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                  
                  <Button
                    variant="ghost"
                    onClick={() => onNavigate(item.id as 'dashboard' | 'history')}
                    className={`flex flex-col items-center space-y-1 p-2.5 h-auto min-h-[60px] rounded-2xl transition-all duration-200 ${
                      isActive 
                        ? `${item.activeColor} shadow-lg border border-gray-200/50`
                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <motion.div
                      animate={isActive ? { scale: 1.1 } : { scale: 1 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Icon className={`h-5 w-5 ${isActive ? item.color : 'text-gray-500'}`} />
                    </motion.div>
                    <span className={`text-[10px] font-medium leading-tight ${
                      isActive ? 'font-semibold' : ''
                    }`}>
                      {item.label}
                    </span>
                  </Button>
                </motion.div>
              );
            })}

            {/* Menu Button */}
            <motion.div
              whileTap={{ scale: 0.9 }}
              whileHover={{ scale: 1.05 }}
            >
              <Button
                variant="ghost"
                onClick={() => setShowMenu(!showMenu)}
                className={`flex flex-col items-center space-y-1 p-2.5 h-auto min-h-[60px] rounded-2xl transition-all duration-200 ${
                  showMenu 
                    ? 'bg-orange-50 text-orange-700 shadow-lg border border-orange-200/50'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                <motion.div
                  animate={{ rotate: showMenu ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {showMenu ? (
                    <X className="h-5 w-5 text-orange-600" />
                  ) : (
                    <Menu className="h-5 w-5" />
                  )}
                </motion.div>
                <span className={`text-[10px] font-medium leading-tight ${
                  showMenu ? 'font-semibold' : ''
                }`}>
                  {language === 'hindi' ? 'मेन्यू' : 'Menu'}
                </span>
              </Button>
            </motion.div>
          </div>

          {/* Safe area for notched phones */}
          <div className="h-safe-area-inset-bottom bg-transparent" />
        </div>
      </motion.div>

      {/* Expanded Menu Overlay */}
      <AnimatePresence>
        {showMenu && (
          <>
            {/* Background Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/30 backdrop-blur-sm sm:hidden z-40"
              onClick={() => setShowMenu(false)}
            />

            {/* Menu Panel */}
            <motion.div
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "100%", opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl sm:hidden z-50 max-h-[70vh] overflow-hidden"
            >
              <div className="p-6 pb-8">
                {/* Handle */}
                <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-6" />

                {/* User Info */}
                {user && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="flex items-center space-x-4 p-4 bg-gradient-to-r from-blue-50 to-green-50 rounded-2xl border border-blue-100 mb-6"
                  >
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center">
                      <User className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 truncate">
                        {language === 'hindi' ? 'नमस्ते' : 'Hello'}, {user.name?.split(' / ')[language === 'hindi' ? 0 : 1] || user.name}
                      </p>
                      <p className="text-sm text-gray-600">
                        {language === 'hindi' ? 'नागरिक' : 'Citizen'}
                      </p>
                    </div>
                  </motion.div>
                )}

                {/* Menu Items */}
                <div className="space-y-3">
                  {onViewProfile && (
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <Button
                        variant="ghost"
                        onClick={() => {
                          onViewProfile();
                          setShowMenu(false);
                        }}
                        className="w-full justify-start h-14 text-left rounded-2xl hover:bg-blue-50 hover:text-blue-700 transition-all duration-200"
                      >
                        <User className="h-5 w-5 mr-4 text-blue-600" />
                        <span className="font-medium">
                          {language === 'hindi' ? 'प्रोफाइल देखें' : 'View Profile'}
                        </span>
                      </Button>
                    </motion.div>
                  )}

                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <Button
                      variant="ghost"
                      className="w-full justify-start h-14 text-left rounded-2xl hover:bg-green-50 hover:text-green-700 transition-all duration-200"
                    >
                      <Bell className="h-5 w-5 mr-4 text-green-600" />
                      <span className="font-medium">
                        {language === 'hindi' ? 'सूचनाएं' : 'Notifications'}
                      </span>
                      <span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                        3
                      </span>
                    </Button>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <Button
                      variant="ghost"
                      className="w-full justify-start h-14 text-left rounded-2xl hover:bg-purple-50 hover:text-purple-700 transition-all duration-200"
                    >
                      <Search className="h-5 w-5 mr-4 text-purple-600" />
                      <span className="font-medium">
                        {language === 'hindi' ? 'शिकायत खोजें' : 'Search Reports'}
                      </span>
                    </Button>
                  </motion.div>

                  {onLogout && (
                    <>
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="border-t border-gray-200 my-4"
                      />
                      
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 }}
                      >
                        <Button
                          variant="ghost"
                          onClick={() => {
                            onLogout();
                            setShowMenu(false);
                          }}
                          className="w-full justify-start h-14 text-left rounded-2xl hover:bg-red-50 hover:text-red-700 transition-all duration-200"
                        >
                          <span className="h-5 w-5 mr-4 text-red-600 font-bold">↗</span>
                          <span className="font-medium">
                            {language === 'hindi' ? 'लॉगआउट' : 'Logout'}
                          </span>
                        </Button>
                      </motion.div>
                    </>
                  )}
                </div>

                {/* Safe area for bottom */}
                <div className="h-8" />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}