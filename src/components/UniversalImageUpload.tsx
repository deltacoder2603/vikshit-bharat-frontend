import React from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Upload, X, CheckCircle } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { Language } from '../utils/translations';

interface UniversalImageUploadProps {
  imagePreview: string | null;
  imageFile: File | null;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: () => void;
  language: Language;
  inputId?: string;
}

export default function UniversalImageUpload({
  imagePreview,
  imageFile,
  onImageUpload,
  onRemoveImage,
  language,
  inputId = 'image-upload'
}: UniversalImageUploadProps) {
  const handleUploadAreaClick = () => {
    const fileInput = document.getElementById(inputId) as HTMLInputElement;
    fileInput?.click();
  };

  return (
    <div className="space-y-3 sm:space-y-4">
      <Label className="text-base sm:text-lg font-semibold flex items-center space-x-2">
        <Upload className="h-4 w-4 sm:h-5 sm:w-5" />
        <span>
          {language === 'hindi' ? 'तस्वीर अपलोड करें' : 'Upload Image'}
        </span>
        <span className="text-red-500">*</span>
      </Label>
      
      <div className={`
        border-2 border-dashed rounded-lg sm:rounded-xl p-4 sm:p-6 lg:p-8 text-center 
        transition-all duration-300 cursor-pointer touch-target relative
        ${imagePreview 
          ? 'border-green-400 bg-green-50/50' 
          : 'border-blue-300 hover:border-blue-400 bg-gradient-to-br from-blue-25 to-green-25 hover:from-blue-50 hover:to-green-50'
        }
      `}
        onClick={handleUploadAreaClick}
      >
        {imagePreview ? (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            {/* Success Badge */}
            <div className="absolute -top-2 sm:-top-3 -right-2 sm:-right-3 bg-green-500 text-white rounded-full w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center z-10 shadow-lg">
              <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4" />
            </div>
            
            {/* Enhanced Universal Image Preview Container */}
            <div className="relative overflow-hidden rounded-lg sm:rounded-xl border-2 sm:border-4 border-white shadow-lg sm:shadow-2xl bg-white">
              <img
                src={imagePreview}
                alt="Selected Image Preview"
                className="w-full h-auto max-h-48 sm:max-h-64 md:max-h-80 lg:max-h-96 object-contain mx-auto transition-all duration-300"
                style={{
                  maxWidth: '100%',
                  height: 'auto',
                  display: 'block'
                }}
                onLoad={() => {
                  console.log('✅ Universal - Image preview displayed successfully');
                  console.log('📱 Image is now visible on all devices');
                  toast.success(language === 'hindi' 
                    ? '🎉 तस्वीर सभी डिवाइस पर दिखाई गई!' 
                    : '🎉 Image preview ready on all devices!');
                }}
                onError={(e) => {
                  console.error('❌ Universal - Image preview failed to display:', e);
                  toast.error(language === 'hindi' 
                    ? 'तस्वीर दिखाने में समस्या' 
                    : 'Error displaying image');
                }}
              />
            </div>
            
            {/* Enhanced Image Info Card */}
            {imageFile && (
              <motion.div 
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="mt-2 sm:mt-4 text-xs sm:text-sm text-gray-600 bg-white rounded-md sm:rounded-lg p-2 sm:p-3 shadow-sm border border-green-200"
              >
                <div className="flex items-center justify-center space-x-2 sm:space-x-3">
                  <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="font-medium truncate max-w-32 sm:max-w-48">{imageFile.name}</p>
                    <p className="text-xs text-gray-500">{(imageFile.size / 1024).toFixed(1)} KB</p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Enhanced Action Buttons */}
            <div className="flex justify-center gap-2 sm:gap-3 mt-3 sm:mt-6">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="text-xs px-2 py-1 h-7 sm:h-8 shadow-lg bg-white hover:bg-red-50 border-red-200 text-red-600"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemoveImage();
                }}
              >
                <X className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                {language === 'hindi' ? 'हटाएं' : 'Remove'}
              </Button>
              
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="text-xs px-2 py-1 h-7 sm:h-8 shadow-lg bg-white hover:bg-blue-50 border-blue-200 text-blue-600"
                onClick={(e) => {
                  e.stopPropagation();
                  const fileInput = document.getElementById(inputId) as HTMLInputElement;
                  fileInput?.click();
                }}
              >
                <Upload className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                {language === 'hindi' ? 'बदलें' : 'Change'}
              </Button>
            </div>
          </motion.div>
        ) : (
          <div className="space-y-3 sm:space-y-6">
            <motion.div 
              className="mx-auto w-12 h-12 sm:w-16 sm:h-16 lg:w-24 lg:h-24 bg-gradient-to-br from-blue-400 to-green-500 rounded-full flex items-center justify-center shadow-lg sm:shadow-xl"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300, damping: 10 }}
            >
              <Upload className="h-6 w-6 sm:h-8 sm:w-8 lg:h-12 lg:w-12 text-white" />
            </motion.div>
            <div>
              <h3 className="text-sm sm:text-xl font-semibold text-blue-600 mb-1 sm:mb-2">
                {language === 'hindi' 
                  ? 'तस्वीर चुनने के लिए कहीं भी क्लिक करें' 
                  : 'Click anywhere to choose image'}
              </h3>
              <p className="text-gray-500 text-xs sm:text-base">
                {language === 'hindi' 
                  ? 'JPG, PNG या GIF (अधिकतम 10MB)' 
                  : 'JPG, PNG or GIF (Max 10MB)'}
              </p>
            </div>
          </div>
        )}
        
        {/* Hidden File Input */}
        <Input
          id={inputId}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/gif"
          onChange={onImageUpload}
          className="hidden"
        />
      </div>
    </div>
  );
}