// PATCH FILE: Add these routes to App.tsx after the department-head-dashboard route

{/* Meeting Management */}
{currentPage === 'meeting-management' && user && user.role !== 'citizen' && (
  <motion.div
    key="meeting-management"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.5 }}
  >
    <MeetingManagement 
      user={user}
      allUsers={allUsers}
      meetings={meetings}
      invitedMeetingIdsByUser={invitedMeetingIdsByUser}
      onJoinMeeting={handleJoinMeeting}
      onDeclineInvitation={handleDeclineInvitation}
      onViewMeeting={handleViewMeeting}
      onCreateMeeting={() => setCurrentPage('create-meeting')}
      language={language}
    />
  </motion.div>
)}

{/* Create Meeting */}
{currentPage === 'create-meeting' && user && user.role === 'district-magistrate' && (
  <motion.div
    key="create-meeting"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.5 }}
  >
    <CreateMeeting 
      user={user}
      allUsers={allUsers}
      onCreateMeeting={handleCreateMeeting}
      onCancel={() => setCurrentPage('meeting-management')}
      language={language}
    />
  </motion.div>
)}

{/* Meeting Room */}
{currentPage === 'meeting-room' && user && currentMeeting && (
  <motion.div
    key="meeting-room"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.5 }}
  >
    <MeetingRoom 
      meeting={currentMeeting}
      currentUserId={user.id}
      onEndMeeting={handleEndMeeting}
      onLeaveMeeting={handleLeaveMeeting}
    />
  </motion.div>
)}