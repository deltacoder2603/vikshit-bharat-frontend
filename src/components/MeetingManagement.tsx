import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Calendar, Clock, Users, Video, Bell, CheckCircle, X, Eye } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { User } from '../App';
import { Meeting } from './MeetingRoom';

interface MeetingManagementProps {
  user: User;
  allUsers: User[];
  meetings: Meeting[];
  invitedMeetingIdsByUser: Record<string, string[]>;
  onJoinMeeting: (meeting: Meeting) => void;
  onDeclineInvitation: (userId: string, meetingId: string) => void;
  onViewMeeting: (meeting: Meeting) => void;
  onCreateMeeting: () => void;
  language: 'hindi' | 'english';
}

const translations = {
  hindi: {
    meetingManagement: 'मीटिंग प्रबंधन',
    invitations: 'आमंत्रण',
    myMeetings: 'मेरी मीटिंगें',
    upcomingMeetings: 'आगामी मीटिंगें',
    noInvitations: 'कोई नए आमंत्रण नहीं',
    noMeetings: 'कोई मीटिंग नहीं मिली',
    join: 'शामिल हों',
    dismiss: 'खारिज करें',
    view: 'देखें',
    createMeeting: 'नई मीटिंग बनाएं',
    host: 'होस्ट',
    duration: 'अवधि',
    minutes: 'मिनट',
    hours: 'घंटे',
    participants: 'प्रतिभागी',
    agenda: 'एजेंडा',
    meetingCode: 'मीटिंग कोड',
    scheduled: 'निर्धारित',
    active: 'सक्रिय',
    ended: 'समाप्त',
    invited: 'आमंत्रित',
    invitedCount: 'आमंत्रित',
    status: 'स्थिति',
    scheduledFor: 'के लिए निर्धारित',
    startedAt: 'पर शुरू हुई',
    endedAt: 'पर समाप्त हुई'
  },
  english: {
    meetingManagement: 'Meeting Management',
    invitations: 'Invitations',
    myMeetings: 'My Meetings',
    upcomingMeetings: 'Upcoming Meetings',
    noInvitations: 'No new invitations',
    noMeetings: 'No meetings found',
    join: 'Join',
    dismiss: 'Dismiss',
    view: 'View',
    createMeeting: 'Create New Meeting',
    host: 'Host',
    duration: 'Duration',
    minutes: 'minutes',
    hours: 'hours',
    participants: 'Participants',
    agenda: 'Agenda',
    meetingCode: 'Meeting Code',
    scheduled: 'Scheduled',
    active: 'Active',
    ended: 'Ended',
    invited: 'Invited',
    invitedCount: 'Invited',
    status: 'Status',
    scheduledFor: 'Scheduled for',
    startedAt: 'Started at',
    endedAt: 'Ended at'
  }
};

export default function MeetingManagement({
  user,
  allUsers,
  meetings,
  invitedMeetingIdsByUser,
  onJoinMeeting,
  onDeclineInvitation,
  onViewMeeting,
  onCreateMeeting,
  language
}: MeetingManagementProps) {
  const t = translations[language];

  // Get user's invited meetings
  const userInvitations = (invitedMeetingIdsByUser[user.id] || [])
    .map(meetingId => meetings.find(m => m.id === meetingId))
    .filter((meeting): meeting is Meeting => 
      meeting !== undefined && 
      (meeting.status === 'scheduled' || meeting.status === 'active')
    );

  // Get user's own meetings (hosted or participating)
  const userMeetings = meetings.filter(meeting => 
    meeting.hostId === user.id || meeting.participants.includes(user.id)
  );

  const formatDuration = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes} ${t.minutes}`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    if (remainingMinutes === 0) {
      return `${hours} ${t.hours}`;
    }
    return `${hours}h ${remainingMinutes}m`;
  };

  const getStatusBadge = (status: Meeting['status']) => {
    const statusConfig = {
      scheduled: { color: 'bg-blue-100 text-blue-800', label: t.scheduled },
      active: { color: 'bg-green-100 text-green-800', label: t.active },
      ended: { color: 'bg-gray-100 text-gray-800', label: t.ended }
    };
    
    const config = statusConfig[status];
    return (
      <Badge className={`${config.color} border-0`}>
        {config.label}
      </Badge>
    );
  };

  const getHostName = (hostId: string) => {
    const host = allUsers.find(u => u.id === hostId);
    return host?.name || 'Unknown Host';
  };

  const getMeetingTime = (meeting: Meeting) => {
    const now = new Date();
    const scheduledTime = meeting.scheduledAt;
    
    if (meeting.status === 'active') {
      return `${t.startedAt} ${scheduledTime.toLocaleTimeString()}`;
    } else if (meeting.status === 'ended') {
      return `${t.endedAt} ${scheduledTime.toLocaleTimeString()}`;
    } else {
      return `${t.scheduledFor} ${scheduledTime.toLocaleString()}`;
    }
  };

  const InvitationCard = ({ meeting }: { meeting: Meeting }) => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="border border-orange-200 rounded-lg p-4 bg-orange-50"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-800 mb-1">{meeting.title}</h3>
          <p className="text-sm text-gray-600 mb-2">{meeting.description}</p>
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {getMeetingTime(meeting)}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {formatDuration(meeting.duration)}
            </span>
            <span className="flex items-center gap-1">
              <Users className="w-3 h-3" />
              {getHostName(meeting.hostId)}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {getStatusBadge(meeting.status)}
          <Badge variant="outline" className="text-xs">
            <Bell className="w-3 h-3 mr-1" />
            {t.invited}
          </Badge>
        </div>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="text-xs text-gray-500">
          {t.meetingCode}: <span className="font-mono font-semibold">{meeting.meetingCode}</span>
        </div>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => onDeclineInvitation(user.id, meeting.id)}
          >
            <X className="w-3 h-3 mr-1" />
            {t.dismiss}
          </Button>
          <Button
            size="sm"
            className="bg-green-500 hover:bg-green-600 text-white"
            onClick={() => onJoinMeeting(meeting)}
          >
            <Video className="w-3 h-3 mr-1" />
            {t.join}
          </Button>
        </div>
      </div>
    </motion.div>
  );

  const MeetingCard = ({ meeting }: { meeting: Meeting }) => {
    const isHost = meeting.hostId === user.id;
    const invitedCount = meeting.invitedIds.length;
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="border rounded-lg p-4 bg-white hover:shadow-md transition-shadow"
      >
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="font-semibold text-gray-800 mb-1">{meeting.title}</h3>
            <p className="text-sm text-gray-600 mb-2">{meeting.description}</p>
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {getMeetingTime(meeting)}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {formatDuration(meeting.duration)}
              </span>
              <span className="flex items-center gap-1">
                <Users className="w-3 h-3" />
                {meeting.participants.length} {t.participants}
              </span>
              {user.role === 'district-magistrate' && invitedCount > 0 && (
                <Badge variant="outline" className="text-xs">
                  {t.invitedCount}: {invitedCount}
                </Badge>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {getStatusBadge(meeting.status)}
            {isHost && (
              <Badge variant="secondary" className="text-xs">
                Host
              </Badge>
            )}
          </div>
        </div>
        
        {meeting.agenda.length > 0 && (
          <div className="mb-3">
            <h4 className="text-xs font-medium text-gray-700 mb-1">{t.agenda}:</h4>
            <div className="text-xs text-gray-600">
              {meeting.agenda.slice(0, 2).map((item, index) => (
                <div key={index}>• {item}</div>
              ))}
              {meeting.agenda.length > 2 && (
                <div className="text-gray-500">+ {meeting.agenda.length - 2} more items</div>
              )}
            </div>
          </div>
        )}
        
        <div className="flex items-center justify-between">
          <div className="text-xs text-gray-500">
            {t.meetingCode}: <span className="font-mono font-semibold">{meeting.meetingCode}</span>
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => onViewMeeting(meeting)}
            >
              <Eye className="w-3 h-3 mr-1" />
              {t.view}
            </Button>
            {meeting.status === 'active' && (
              <Button
                size="sm"
                className="bg-green-500 hover:bg-green-600 text-white"
                onClick={() => onJoinMeeting(meeting)}
              >
                <Video className="w-3 h-3 mr-1" />
                {t.join}
              </Button>
            )}
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-green-50 p-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Header */}
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-gray-800">{t.meetingManagement}</h1>
            {user.role === 'district-magistrate' && (
              <Button
                onClick={onCreateMeeting}
                className="bg-orange-500 hover:bg-orange-600 text-white"
              >
                <Video className="w-4 h-4 mr-2" />
                {t.createMeeting}
              </Button>
            )}
          </div>

          {/* Department Head Invitations Section */}
          {user.role === 'department-head' && userInvitations.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5 text-orange-500" />
                  {t.invitations} ({userInvitations.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {userInvitations.map((meeting) => (
                    <InvitationCard key={meeting.id} meeting={meeting} />
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Meetings Tabs */}
          <Tabs defaultValue="upcoming" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="upcoming">{t.upcomingMeetings}</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="ended">Past</TabsTrigger>
            </TabsList>

            <TabsContent value="upcoming" className="space-y-4">
              <div className="grid gap-4">
                {userMeetings.filter(m => m.status === 'scheduled').length === 0 ? (
                  <Card>
                    <CardContent className="text-center py-8">
                      <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">{t.noMeetings}</p>
                    </CardContent>
                  </Card>
                ) : (
                  userMeetings
                    .filter(m => m.status === 'scheduled')
                    .map((meeting) => (
                      <MeetingCard key={meeting.id} meeting={meeting} />
                    ))
                )}
              </div>
            </TabsContent>

            <TabsContent value="active" className="space-y-4">
              <div className="grid gap-4">
                {userMeetings.filter(m => m.status === 'active').length === 0 ? (
                  <Card>
                    <CardContent className="text-center py-8">
                      <Video className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">{t.noMeetings}</p>
                    </CardContent>
                  </Card>
                ) : (
                  userMeetings
                    .filter(m => m.status === 'active')
                    .map((meeting) => (
                      <MeetingCard key={meeting.id} meeting={meeting} />
                    ))
                )}
              </div>
            </TabsContent>

            <TabsContent value="ended" className="space-y-4">
              <div className="grid gap-4">
                {userMeetings.filter(m => m.status === 'ended').length === 0 ? (
                  <Card>
                    <CardContent className="text-center py-8">
                      <CheckCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">{t.noMeetings}</p>
                    </CardContent>
                  </Card>
                ) : (
                  userMeetings
                    .filter(m => m.status === 'ended')
                    .map((meeting) => (
                      <MeetingCard key={meeting.id} meeting={meeting} />
                    ))
                )}
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}