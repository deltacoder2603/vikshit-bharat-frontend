import React, { useState } from 'react';
import { MapPin, User, Phone, Calendar, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Language } from '../utils/translations';

interface GeotagData {
  latitude: number;
  longitude: number;
  accuracy?: number;
  address?: string;
  capturedBy: string;
  capturedByPhone: string;
  capturedAt: Date;
  deviceInfo?: string;
}

interface GeotaggedImageProps {
  src: string;
  alt: string;
  geotag?: GeotagData;
  className?: string;
  language?: Language;
  showGeotagInfo?: boolean;
}

export default function GeotaggedImage({
  src,
  alt,
  geotag,
  className = '',
  language = 'hindi',
  showGeotagInfo = true
}: GeotaggedImageProps) {
  const [showFullGeotag, setShowFullGeotag] = useState(false);

  if (!geotag || !showGeotagInfo) {
    return (
      <ImageWithFallback
        src={src}
        alt={alt}
        className={className}
      />
    );
  }

  const formatCoordinates = (lat: number, lng: number) => {
    return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
  };

  const formatDate = (date: Date) => {
    if (language === 'hindi') {
      return new Intl.DateTimeFormat('hi-IN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(date);
    } else {
      return new Intl.DateTimeFormat('en-US', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(date);
    }
  };

  return (
    <div className="relative group">
      <ImageWithFallback
        src={src}
        alt={alt}
        className={className}
      />
      
      {/* Compact Geotag Overlay - Always visible in corner */}
      <div className="absolute top-2 right-2">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-black/80 backdrop-blur-sm text-white text-xs rounded-lg p-2 min-w-[120px]"
        >
          <div className="flex items-center space-x-1 mb-1">
            <MapPin className="h-3 w-3 text-green-400" />
            <span className="font-medium truncate">
              {geotag.address ? geotag.address.substring(0, 15) + '...' : 
               formatCoordinates(geotag.latitude, geotag.longitude)}
            </span>
          </div>
          
          <div className="flex items-center space-x-1 mb-1">
            <User className="h-3 w-3 text-blue-400" />
            <span className="truncate">{geotag.capturedBy}</span>
          </div>
          
          <div className="flex items-center space-x-1">
            <Phone className="h-3 w-3 text-orange-400" />
            <span className="truncate">{geotag.capturedByPhone}</span>
          </div>
          
          {/* Expand Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowFullGeotag(true)}
            className="p-0 h-4 w-full mt-1 text-white hover:text-orange-300 hover:bg-transparent"
          >
            <Info className="h-3 w-3 mr-1" />
            <span className="text-xs">
              {language === 'hindi' ? 'विस्तार' : 'More'}
            </span>
          </Button>
        </motion.div>
      </div>

      {/* Location Accuracy Indicator */}
      {geotag.accuracy && (
        <div className="absolute bottom-2 right-2">
          <Badge className={`text-xs ${
            geotag.accuracy <= 10 ? 'bg-green-600' :
            geotag.accuracy <= 50 ? 'bg-yellow-600' : 'bg-red-600'
          } text-white`}>
            ±{geotag.accuracy}m
          </Badge>
        </div>
      )}

      {/* Detailed Geotag Modal */}
      <AnimatePresence>
        {showFullGeotag && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowFullGeotag(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md"
            >
              <Card className="bg-white/95 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">
                      {language === 'hindi' ? 'फोटो की जानकारी' : 'Photo Information'}
                    </h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowFullGeotag(false)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      ×
                    </Button>
                  </div>

                  <div className="space-y-4">
                    {/* Location Details */}
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-green-600" />
                        <span className="font-medium">
                          {language === 'hindi' ? 'स्थान' : 'Location'}
                        </span>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg space-y-1">
                        {geotag.address && (
                          <p className="text-sm font-medium">{geotag.address}</p>
                        )}
                        <p className="text-xs text-gray-600">
                          {language === 'hindi' ? 'निर्देशांक:' : 'Coordinates:'} {formatCoordinates(geotag.latitude, geotag.longitude)}
                        </p>
                        {geotag.accuracy && (
                          <p className="text-xs text-gray-600">
                            {language === 'hindi' ? 'सटीकता:' : 'Accuracy:'} ±{geotag.accuracy} {language === 'hindi' ? 'मीटर' : 'meters'}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Captured By */}
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4 text-blue-600" />
                        <span className="font-medium">
                          {language === 'hindi' ? 'रिपोर्ट किया गया' : 'Reported By'}
                        </span>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-sm font-medium">{geotag.capturedBy}</p>
                        <div className="flex items-center space-x-1 mt-1">
                          <Phone className="h-3 w-3 text-gray-500" />
                          <p className="text-xs text-gray-600">{geotag.capturedByPhone}</p>
                        </div>
                      </div>
                    </div>

                    {/* Timestamp */}
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-purple-600" />
                        <span className="font-medium">
                          {language === 'hindi' ? 'समय' : 'Timestamp'}
                        </span>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-sm">{formatDate(geotag.capturedAt)}</p>
                      </div>
                    </div>

                    {/* Device Info */}
                    {geotag.deviceInfo && (
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Info className="h-4 w-4 text-gray-600" />
                          <span className="font-medium">
                            {language === 'hindi' ? 'डिवाइस जानकारी' : 'Device Info'}
                          </span>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <p className="text-xs text-gray-600">{geotag.deviceInfo}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="mt-6 flex justify-end">
                    <Button
                      onClick={() => setShowFullGeotag(false)}
                      className="bg-orange-600 hover:bg-orange-700 text-white"
                    >
                      {language === 'hindi' ? 'बंद करें' : 'Close'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}