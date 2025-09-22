import React from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { 
  ArrowLeft, 
  Flag, 
  LogOut, 
  MapPin, 
  Calendar, 
  Clock,
  CheckCircle,
  AlertCircle,
  HelpCircle
} from 'lucide-react';
import { Report } from '../App';
import { getTranslations, Language } from '../utils/translations';
import GeotaggedImage from './GeotaggedImage';

interface HistoryPageProps {
  reports: Report[];
  onBackToDashboard: () => void;
  onLogout: () => void;
  language?: Language;
}

export default function HistoryPage({ reports, onBackToDashboard, onLogout, language = 'hindi' }: HistoryPageProps) {
  const t = getTranslations(language);
  const getStatusIcon = (status: Report['status']) => {
    switch (status) {
      case 'resolved':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'in-progress':
        return <Clock className="h-5 w-5 text-yellow-600" />;
      default:
        return <HelpCircle className="h-5 w-5 text-blue-600" />;
    }
  };

  const getStatusBadge = (status: Report['status']) => {
    switch (status) {
      case 'resolved':
        return <Badge className="bg-green-100 text-green-800">{t.status.resolved}</Badge>;
      case 'in-progress':
        return <Badge className="bg-yellow-100 text-yellow-800">{t.status.inProgress}</Badge>;
      default:
        return <Badge className="bg-blue-100 text-blue-800">{t.status.pending}</Badge>;
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString(language === 'hindi' ? 'hi-IN' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-green-50">
      {/* Header */}
      <motion.header
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white/80 backdrop-blur-sm border-b border-orange-200 shadow-sm"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="flex space-x-1">
                <div className="w-3 h-6 bg-orange-500 rounded-sm shadow-sm" />
                <div className="w-3 h-6 bg-white border border-gray-300 rounded-sm shadow-sm" />
                <div className="w-3 h-6 bg-green-600 rounded-sm shadow-sm" />
              </div>
              <h1 className="text-2xl font-bold" style={{ color: '#FF9933' }}>
                VIKSIT KANPUR
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                onClick={onBackToDashboard}
                className="border-blue-200 text-blue-700 hover:bg-blue-50"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                {language === 'hindi' ? 'वापस' : 'Back'}
              </Button>
              <Button
                variant="outline"
                onClick={onLogout}
                className="border-red-200 text-red-700 hover:bg-red-50"
              >
                <LogOut className="h-4 w-4 mr-2" />
                {t.logout}
              </Button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 pb-24 md:pb-8">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-8"
        >
          <h2 className="text-3xl mb-2">{language === 'hindi' ? 'रिपोर्ट का इतिहास' : 'Report History'}</h2>
          <p className="text-gray-600">{language === 'hindi' ? 'आपकी पिछली सभी रिपोर्ट्स' : 'Your Previous Report History'}</p>
        </motion.div>

        {reports.length === 0 ? (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-center py-16"
          >
            <AlertCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl text-gray-600 mb-2">{language === 'hindi' ? 'कोई रिपोर्ट नहीं मिली' : 'No Reports Found'}</h3>
            <p className="text-gray-500 mb-6">{language === 'hindi' ? 'अभी तक आपने कोई समस्या रिपोर्ट नहीं की है' : 'You have not submitted any problem reports yet'}</p>
            <Button onClick={onBackToDashboard} className="bg-blue-600 hover:bg-blue-700">
              {language === 'hindi' ? 'पहली रिपोर्ट करें' : 'Submit First Report'}
            </Button>
          </motion.div>
        ) : (
          <div className="grid gap-6">
            {reports.map((report, index) => (
              <motion.div
                key={report.id}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 + index * 0.1 }}
              >
                <Card className="bg-white/90 backdrop-blur-sm border border-gray-200 shadow-lg hover:shadow-xl transition-shadow">
                  <CardContent className="p-0">
                    <div className="md:flex">
                      {/* Image */}
                      <div className="md:w-1/3">
                        <GeotaggedImage
                          src={report.image}
                          alt="Report"
                          geotag={report.geotag}
                          className="w-full h-48 md:h-full object-cover rounded-l-lg"
                          language={language}
                          showGeotagInfo={true}
                        />
                      </div>
                      
                      {/* Content */}
                      <div className="md:w-2/3 p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex items-center space-x-2">
                            {getStatusIcon(report.status)}
                            {getStatusBadge(report.status)}
                          </div>
                          <div className="text-sm text-gray-500 flex items-center space-x-1">
                            <Calendar className="h-4 w-4" />
                            <span>{formatDate(report.submittedAt)}</span>
                          </div>
                        </div>

                        <h3 className="text-lg mb-2 text-gray-800">{report.category}</h3>
                        
                        <p className="text-gray-600 mb-4 line-clamp-3">{report.description}</p>
                        
                        <div className="flex items-center text-sm text-gray-500">
                          <MapPin className="h-4 w-4 mr-1" />
                          <span>{report.location}</span>
                        </div>

                        {/* Progress indicator based on status */}
                        <div className="mt-4 pt-4 border-t">
                          <div className="flex items-center justify-between text-xs">
                            <span className={`${report.status === 'pending' ? 'text-blue-600' : 'text-gray-400'}`}>
                              {language === 'hindi' ? 'रिपोर्ट दर्ज' : 'Report Submitted'}
                            </span>
                            <span className={`${report.status === 'in-progress' ? 'text-yellow-600' : report.status === 'resolved' ? 'text-gray-400' : 'text-gray-300'}`}>
                              {language === 'hindi' ? 'समीक्षा में' : 'Under Review'}
                            </span>
                            <span className={`${report.status === 'resolved' ? 'text-green-600' : 'text-gray-300'}`}>
                              {language === 'hindi' ? 'हल हो गया' : 'Resolved'}
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                            <div 
                              className={`h-2 rounded-full transition-all duration-500 ${
                                report.status === 'pending' ? 'bg-blue-600 w-1/3' :
                                report.status === 'in-progress' ? 'bg-yellow-600 w-2/3' :
                                'bg-green-600 w-full'
                              }`}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {/* Summary Stats */}
        {reports.length > 0 && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="grid md:grid-cols-3 gap-6 mt-8"
          >
            <Card className="bg-blue-50/50 border-blue-200">
              <CardContent className="p-6 text-center">
                <div className="text-2xl text-blue-600 mb-2">
                  {reports.filter(r => r.status === 'pending').length}
                </div>
                <div className="text-blue-800">{language === 'hindi' ? 'लंबित रिपोर्ट्स' : 'Pending Reports'}</div>
              </CardContent>
            </Card>

            <Card className="bg-yellow-50/50 border-yellow-200">
              <CardContent className="p-6 text-center">
                <div className="text-2xl text-yellow-600 mb-2">
                  {reports.filter(r => r.status === 'in-progress').length}
                </div>
                <div className="text-yellow-800">{language === 'hindi' ? 'प्रगति में' : 'In Progress'}</div>
              </CardContent>
            </Card>

            <Card className="bg-green-50/50 border-green-200">
              <CardContent className="p-6 text-center">
                <div className="text-2xl text-green-600 mb-2">
                  {reports.filter(r => r.status === 'resolved').length}
                </div>
                <div className="text-green-800">{language === 'hindi' ? 'हल हो गया' : 'Resolved'}</div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}