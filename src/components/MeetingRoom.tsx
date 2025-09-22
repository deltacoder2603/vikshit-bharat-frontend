import React from 'react';

export type Meeting = {
  id: string;
  title: string;
  description: string;
  scheduledAt: Date;
  duration: number; // in minutes
  meetingCode: string;
  recordingEnabled: boolean;
  agenda: string[];
  hostId: string;
  participants: string[]; // user IDs
  status: 'scheduled' | 'active' | 'ended';
  createdAt: Date;
  invitedIds: string[]; // newly added for invitations
  minutes?: { // newly added for meeting minutes
    notes: string;
    conclusion: string;
    savedAt: Date;
  };
};

interface MeetingRoomProps {
  meeting: Meeting;
  currentUserId: string;
  onEndMeeting?: (meetingId: string, minutes: { notes: string; conclusion: string }) => void;
  onLeaveMeeting?: (meetingId: string) => void;
}

export default function MeetingRoom({ meeting, currentUserId, onEndMeeting, onLeaveMeeting }: MeetingRoomProps) {
  const [notes, setNotes] = React.useState('');
  const [conclusion, setConclusion] = React.useState('');

  const isHost = meeting.hostId === currentUserId;

  const handleEndMeeting = () => {
    if (onEndMeeting && (notes.trim() || conclusion.trim())) {
      onEndMeeting(meeting.id, {
        notes: notes.trim(),
        conclusion: conclusion.trim()
      });
    }
  };

  const handleLeaveMeeting = () => {
    if (onLeaveMeeting) {
      onLeaveMeeting(meeting.id);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-green-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Meeting Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-semibold text-gray-800">{meeting.title}</h1>
              <p className="text-gray-600">{meeting.description}</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                {meeting.status === 'active' ? 'Live' : meeting.status}
              </div>
              <div className="text-sm text-gray-500">
                Code: <span className="font-mono font-semibold">{meeting.meetingCode}</span>
              </div>
            </div>
          </div>
          
          {/* Participants */}
          <div className="text-sm text-gray-600">
            Participants: {meeting.participants.length} | Duration: {meeting.duration} minutes
          </div>
        </div>

        {/* Meeting Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Video Area */}
          <div className="lg:col-span-2">
            <div className="bg-gray-900 rounded-lg aspect-video flex items-center justify-center">
              <div className="text-white text-center">
                <div className="text-6xl mb-4">🎥</div>
                <p className="text-lg">Video Meeting in Progress</p>
                <p className="text-sm text-gray-400 mt-2">Meeting Code: {meeting.meetingCode}</p>
              </div>
            </div>
          </div>

          {/* Side Panel */}
          <div className="space-y-4">
            {/* Agenda */}
            <div className="bg-white rounded-lg shadow-md p-4">
              <h3 className="font-semibold mb-3">Agenda</h3>
              <div className="space-y-2">
                {meeting.agenda.map((item, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <div className="w-5 h-5 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-xs font-semibold mt-0.5">
                      {index + 1}
                    </div>
                    <p className="text-sm text-gray-700">{item}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Meeting Controls */}
            <div className="bg-white rounded-lg shadow-md p-4">
              <h3 className="font-semibold mb-3">Controls</h3>
              <div className="space-y-2">
                <button className="w-full bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm transition-colors">
                  🔇 Mute
                </button>
                <button className="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm transition-colors">
                  📹 Camera
                </button>
                <button className="w-full bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md text-sm transition-colors">
                  💬 Chat
                </button>
              </div>
            </div>

            {/* Meeting Minutes (Host Only) */}
            {isHost && meeting.status === 'active' && (
              <div className="bg-white rounded-lg shadow-md p-4">
                <h3 className="font-semibold mb-3">Meeting Minutes</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Notes
                    </label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Key discussion points..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm resize-none"
                      rows={3}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Conclusion
                    </label>
                    <textarea
                      value={conclusion}
                      onChange={(e) => setConclusion(e.target.value)}
                      placeholder="Action items and decisions..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm resize-none"
                      rows={2}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Started at {meeting.scheduledAt.toLocaleTimeString()}
          </div>
          <div className="flex gap-3">
            {!isHost && (
              <button
                onClick={handleLeaveMeeting}
                className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-md transition-colors"
              >
                Leave Meeting
              </button>
            )}
            {isHost && meeting.status === 'active' && (
              <button
                onClick={handleEndMeeting}
                className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-md transition-colors"
                disabled={!notes.trim() && !conclusion.trim()}
              >
                End Meeting
              </button>
            )}
          </div>
        </div>

        {/* Show Minutes if Meeting Ended */}
        {meeting.status === 'ended' && meeting.minutes && (
          <div className="mt-6 bg-white rounded-lg shadow-md p-6">
            <h3 className="font-semibold mb-4">Meeting Minutes</h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Notes</h4>
                <p className="text-gray-600 whitespace-pre-wrap">{meeting.minutes.notes}</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Conclusion</h4>
                <p className="text-gray-600 whitespace-pre-wrap">{meeting.minutes.conclusion}</p>
              </div>
              <div className="text-xs text-gray-500">
                Saved on {meeting.minutes.savedAt.toLocaleString()}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}