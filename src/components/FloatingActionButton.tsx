import React from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Plus, Camera } from 'lucide-react';

interface FloatingActionButtonProps {
  currentPage: string;
  onNewReport: () => void;
}

export default function FloatingActionButton({ currentPage, onNewReport }: FloatingActionButtonProps) {
  // Only show on history and map pages
  if (currentPage === 'dashboard') return null;

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      className="fixed bottom-20 right-4 sm:bottom-24 md:bottom-8 z-40"
    >
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button
          onClick={onNewReport}
          className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-xl border-0 flex items-center justify-center touch-target"
          style={{ backgroundColor: '#FF9933' }}
        >
          <Camera className="h-5 w-5 sm:h-6 sm:w-6" />
        </Button>
      </motion.div>
      
      {/* Tooltip */}
      <div className="absolute -top-12 right-0 bg-black/80 text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 hover:opacity-100 transition-opacity">
        नई रिपोर्ट / New Report
      </div>
    </motion.div>
  );
}