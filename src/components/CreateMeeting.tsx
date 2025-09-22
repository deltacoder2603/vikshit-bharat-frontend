import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Calendar, Clock, Users, FileText, Video } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Checkbox } from './ui/checkbox';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { User } from '../App';

interface CreateMeetingProps {
  user: User;
  allUsers: User[];
  onCreateMeeting: (meetingData: {
    title: string;
    description: string;
    scheduledAt: Date;
    duration: number;
    meetingCode: string;
    recordingEnabled: boolean;
    agenda: string[];
    invitedIds: string[];
  }) => void;
  onCancel: () => void;
  language: 'hindi' | 'english';
}

const translations = {
  hindi: {
    createMeeting: 'नई मीटिंग बनाएं',
    meetingTitle: 'मीटिंग का शीर्षक',
    titlePlaceholder: 'मीटिंग का नाम दर्ज करें',
    description: 'विवरण',
    descriptionPlaceholder: 'मीटिंग का विवरण लिखें',
    scheduledDate: 'निर्धारित दिनांक',
    scheduledTime: 'निर्धारित समय',
    duration: 'अवधि (मिनट में)',
    meetingCode: 'मीटिंग कोड',
    recordingEnabled: 'रिकॉर्डिंग सक्षम करें',
    agenda: 'एजेंडा',
    agendaPlaceholder: 'एजेंडा आइटम जोड़ें',
    addAgendaItem: 'आइटम जोड़ें',
    inviteDepartmentHeads: 'विभाग प्रमुखों को आमंत्रित करें',
    searchPlaceholder: 'नाम/विभाग से खोजें',
    selectedParticipants: 'चयनित प्रतिभागी',
    createButton: 'मीटिंग बनाएं',
    cancel: 'रद्द करें',
    noDepartmentHeads: 'कोई विभाग प्रमुख उपलब्ध नहीं',
    minutes: 'मिनट'
  },
  english: {
    createMeeting: 'Create New Meeting',
    meetingTitle: 'Meeting Title',
    titlePlaceholder: 'Enter meeting title',
    description: 'Description',
    descriptionPlaceholder: 'Enter meeting description',
    scheduledDate: 'Scheduled Date',
    scheduledTime: 'Scheduled Time',
    duration: 'Duration (minutes)',
    meetingCode: 'Meeting Code',
    recordingEnabled: 'Enable Recording',
    agenda: 'Agenda',
    agendaPlaceholder: 'Add agenda item',
    addAgendaItem: 'Add Item',
    inviteDepartmentHeads: 'Invite Department Heads',
    searchPlaceholder: 'Search by name/department',
    selectedParticipants: 'Selected Participants',
    createButton: 'Create Meeting',
    cancel: 'Cancel',
    noDepartmentHeads: 'No department heads available',
    minutes: 'minutes'
  }
};

export default function CreateMeeting({ user, allUsers, onCreateMeeting, onCancel, language }: CreateMeetingProps) {
  const t = translations[language];
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [duration, setDuration] = useState(60);
  const [meetingCode, setMeetingCode] = useState(generateMeetingCode());
  const [recordingEnabled, setRecordingEnabled] = useState(false);
  const [agenda, setAgenda] = useState<string[]>([]);
  const [currentAgendaItem, setCurrentAgendaItem] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [participantsToInvite, setParticipantsToInvite] = useState<string[]>([]);

  function generateMeetingCode(): string {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  }

  // Get department heads only
  const departmentHeads = allUsers.filter(u => u.role === 'department-head');
  
  // Filter department heads based on search term
  const filteredDepartmentHeads = departmentHeads.filter(dh =>
    dh.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (dh.department && dh.department.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleAddAgendaItem = () => {
    if (currentAgendaItem.trim()) {
      setAgenda([...agenda, currentAgendaItem.trim()]);
      setCurrentAgendaItem('');
    }
  };

  const handleRemoveAgendaItem = (index: number) => {
    setAgenda(agenda.filter((_, i) => i !== index));
  };

  const handleToggleParticipant = (userId: string) => {
    setParticipantsToInvite(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !scheduledDate || !scheduledTime) {
      return;
    }

    const scheduledDateTime = new Date(`${scheduledDate}T${scheduledTime}`);
    
    onCreateMeeting({
      title: title.trim(),
      description: description.trim(),
      scheduledAt: scheduledDateTime,
      duration,
      meetingCode,
      recordingEnabled,
      agenda,
      invitedIds: participantsToInvite
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-green-50 p-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Header */}
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-gray-800">{t.createMeeting}</h1>
            <Button variant="outline" onClick={onCancel}>
              {t.cancel}
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-6">
                {/* Basic Info */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="w-5 h-5" />
                      Meeting Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="title">{t.meetingTitle}</Label>
                      <Input
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder={t.titlePlaceholder}
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="description">{t.description}</Label>
                      <Textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder={t.descriptionPlaceholder}
                        rows={3}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Schedule */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="w-5 h-5" />
                      Schedule
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="date">{t.scheduledDate}</Label>
                        <Input
                          id="date"
                          type="date"
                          value={scheduledDate}
                          onChange={(e) => setScheduledDate(e.target.value)}
                          min={new Date().toISOString().split('T')[0]}
                          required
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="time">{t.scheduledTime}</Label>
                        <Input
                          id="time"
                          type="time"
                          value={scheduledTime}
                          onChange={(e) => setScheduledTime(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="duration">{t.duration}</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          id="duration"
                          type="number"
                          value={duration}
                          onChange={(e) => setDuration(parseInt(e.target.value) || 60)}
                          min={15}
                          max={480}
                          className="w-24"
                        />
                        <span className="text-sm text-gray-600">{t.minutes}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Settings */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Video className="w-5 h-5" />
                      Meeting Settings
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="code">{t.meetingCode}</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          id="code"
                          value={meetingCode}
                          onChange={(e) => setMeetingCode(e.target.value)}
                          className="w-32 font-mono"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => setMeetingCode(generateMeetingCode())}
                        >
                          Regenerate
                        </Button>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="recording"
                        checked={recordingEnabled}
                        onCheckedChange={(checked) => setRecordingEnabled(!!checked)}
                      />
                      <Label htmlFor="recording">{t.recordingEnabled}</Label>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* Agenda */}
                <Card>
                  <CardHeader>
                    <CardTitle>{t.agenda}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex gap-2">
                      <Input
                        value={currentAgendaItem}
                        onChange={(e) => setCurrentAgendaItem(e.target.value)}
                        placeholder={t.agendaPlaceholder}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddAgendaItem())}
                      />
                      <Button type="button" onClick={handleAddAgendaItem} size="sm">
                        {t.addAgendaItem}
                      </Button>
                    </div>
                    
                    <div className="space-y-2">
                      {agenda.map((item, index) => (
                        <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                          <span className="text-sm">{index + 1}. {item}</span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveAgendaItem(index)}
                          >
                            ×
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Invite Department Heads */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="w-5 h-5" />
                      {t.inviteDepartmentHeads}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Input
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder={t.searchPlaceholder}
                    />
                    
                    <div className="max-h-48 overflow-y-auto space-y-2">
                      {filteredDepartmentHeads.length === 0 ? (
                        <p className="text-sm text-gray-500 text-center py-4">
                          {t.noDepartmentHeads}
                        </p>
                      ) : (
                        filteredDepartmentHeads.map((dh) => (
                          <div key={dh.id} className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded">
                            <Checkbox
                              id={`participant-${dh.id}`}
                              checked={participantsToInvite.includes(dh.id)}
                              onCheckedChange={() => handleToggleParticipant(dh.id)}
                            />
                            <Label htmlFor={`participant-${dh.id}`} className="flex-1 cursor-pointer">
                              <div>
                                <p className="font-medium">{dh.name}</p>
                                <p className="text-xs text-gray-500">{dh.department}</p>
                              </div>
                            </Label>
                          </div>
                        ))
                      )}
                    </div>
                    
                    {participantsToInvite.length > 0 && (
                      <div>
                        <Label className="text-sm font-medium">{t.selectedParticipants} ({participantsToInvite.length})</Label>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {participantsToInvite.map((id) => {
                            const participant = allUsers.find(u => u.id === id);
                            return participant ? (
                              <Badge key={id} variant="secondary" className="text-xs">
                                {participant.name}
                              </Badge>
                            ) : null;
                          })}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <Button
                type="submit"
                className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-2"
                disabled={!title.trim() || !scheduledDate || !scheduledTime}
              >
                {t.createButton}
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}