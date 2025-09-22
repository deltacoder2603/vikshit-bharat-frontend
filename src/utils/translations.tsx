export type Language = 'hindi' | 'english';

export interface Translations {
  // Common
  login: string;
  register: string;
  email: string;
  username: string;
  password: string;
  forgotPassword: string;
  welcomeMessage: string;
  logout: string;
  profile: string;
  dashboard: string;
  history: string;
  map: string;
  submit: string;
  cancel: string;
  save: string;
  edit: string;
  delete: string;
  loading: string;
  success: string;
  error: string;
  
  // Login specific
  emailOrUsername: string;
  enterEmailOrUsername: string;
  enterPassword: string;
  loginButton: string;
  createAccount: string;
  governmentLogin: string;
  // Removed Google login
  
  // Registration specific
  fullName: string;
  phoneNumber: string;
  aadharNumber: string;
  address: string;
  registerButton: string;
  alreadyHaveAccount: string;
  
  // Forgot Password
  resetPassword: string;
  enterPhoneNumber: string;
  sendOTP: string;
  enterOTP: string;
  verifyOTP: string;
  newPassword: string;
  confirmPassword: string;
  
  // Categories
  categories: {
    garbageWaste: string;
    trafficRoads: string;
    pollution: string;
    drainageSewage: string;
    publicSpaces: string;
    housingSlums: string;
    waterIssues: string;
    electricityIssues: string;
    education: string;
    health: string;
    otherIssues: string;
    otherProblem: string;
  };
  
  // Departments
  departments: {
    sanitation: string;
    roads: string;
    electricity: string;
    water: string;
    health: string;
    education: string;
    administration: string;
    otherDepartment: string;
  };
  
  // Status
  status: {
    pending: string;
    inProgress: string;
    resolved: string;
  };
  
  // Admin/Government Interface
  admin: {
    // Roles
    districtMagistrate: string;
    departmentHead: string;
    fieldWorker: string;
    
    // Navigation
    complaints: string;
    departments: string;
    workers: string;
    analytics: string;
    reports: string;
    notifications: string;
    settings: string;
    meetings: string;
    
    // Dashboard
    totalComplaints: string;
    pendingComplaints: string;
    resolvedComplaints: string;
    activeWorkers: string;
    totalDepartments: string;
    
    // Complaints Management
    complaintsManagement: string;
    assignWorker: string;
    updateStatus: string;
    complaintDetails: string;
    statusUpdate: string;
    assignedTo: string;
    priority: string;
    location: string;
    submittedBy: string;
    submittedOn: string;
    
    // Workers Management
    workersManagement: string;
    addWorker: string;
    workerName: string;
    workerDepartment: string;
    workerPhone: string;
    workerEmail: string;
    assignedComplaints: string;
    
    // Departments
    departmentsManagement: string;
    publicWorks: string;
    waterWorks: string;
    sanitation: string;
    electricity: string;
    
    // Analytics
    performanceAnalytics: string;
    resolutionRate: string;
    avgResolutionTime: string;
    complaintsByCategory: string;
    complaintsByStatus: string;
    monthlyTrends: string;
    
    // Meeting System
    meetingManagement: string;
    createMeeting: string;
    scheduledMeetings: string;
    meetingInvitations: string;
    joinMeeting: string;
    startMeeting: string;
    endMeeting: string;
    meetingTitle: string;
    meetingDescription: string;
    scheduledAt: string;
    duration: string;
    meetingCode: string;
    participants: string;
    agenda: string;
    addAgendaItem: string;
    inviteParticipants: string;
    recordingEnabled: string;
    meetingMinutes: string;
    saveMinutes: string;
    
    // Notifications
    newComplaint: string;
    complaintAssigned: string;
    complaintResolved: string;
    workerUpdate: string;
    systemAlert: string;
    
    // Settings
    systemSettings: string;
    userManagement: string;
    departmentSettings: string;
    notificationSettings: string;
    
    // Common Actions
    view: string;
    assign: string;
    update: string;
    approve: string;
    reject: string;
    filter: string;
    search: string;
    export: string;
    download: string;
  };

  // Messages
  messages: {
    loginSuccess: string;
    logoutSuccess: string;
    reportSubmitted: string;
    profileUpdated: string;
    complaintReceived: string;
    complaintUpdated: string;
    workerAssigned: string;
    fillAllFields: string;
    otherProblemPlaceholder: string;
    otherDepartmentPlaceholder: string;
    analyzing: string;
    aiAnalysis: string;
    identifiedProblems: string;
    priority: string;
    category: string;
    autoSelectedByAI: string;
    determinedByAI: string;
    aiSuggestedDescription: string;
    currentLocation: string;
    locationObtained: string;
    highPriority: string;
    mediumPriority: string;
    lowPriority: string;
    submitReport: string;
    submitting: string;
    benefitsOfReporting: string;
    importantInformation: string;
    reportBenefitsText: string;
    importantInfoText: string;
    smartCityInitiative: string;
    citizen: string;
    uploadImageTitle: string;
    clickAnywhereToUpload: string;
    chooseNewImage: string;
    problemDescription: string;
    describeProblemDetail: string;
    enterCompleteAddress: string;
    newProblemReport: string;
    aiPowered: string;
    meetingCreated: string;
    meetingEnded: string;
    leftMeeting: string;
    invitationDeclined: string;
    welcomeMessage: string;
  };
}

const translations: Record<Language, Translations> = {
  hindi: {
    // Common
    login: 'लॉगिन',
    register: 'पंजीकरण',
    email: 'ईमेल',
    username: 'उपयोगकर्ता नाम',
    password: 'पासवर्ड',
    forgotPassword: 'पासवर्ड भूल गए?',
    welcomeMessage: 'स्वागत है',
    logout: 'लॉगआउट',
    profile: 'प्रोफाइल',
    dashboard: 'डैशबोर्ड',
    history: 'इतिहास',
    map: 'मैप',
    submit: 'जमा करें',
    cancel: 'रद्द करें',
    save: 'सहेजें',
    edit: 'संपादित करें',
    delete: 'हटाएं',
    loading: 'लोड हो रहा है...',
    success: 'सफल',
    error: 'त्रुटि',
    
    // Login specific
    emailOrUsername: 'ईमेल या उपयोगकर्ता नाम',
    enterEmailOrUsername: 'अपना ईमेल या उपयोगकर्ता नाम दर्ज करें',
    enterPassword: 'अपना पासवर्ड दर्ज करें',
    loginButton: 'लॉगिन करें',
    createAccount: 'नया खाता बनाएं',
    governmentLogin: 'सरकारी लॉगिन',
    // Removed Google login
    
    // Registration specific
    fullName: 'पूरा नाम',
    phoneNumber: 'फोन नंबर',
    aadharNumber: 'आधार नंबर',
    address: 'पता',
    registerButton: 'पंजीकरण करें',
    alreadyHaveAccount: 'पहले से खाता है? लॉगिन करें',
    
    // Forgot Password
    resetPassword: 'पासवर्ड रीसेट करें',
    enterPhoneNumber: 'अपना फोन नंबर दर्ज करें',
    sendOTP: 'OTP भेजें',
    enterOTP: 'OTP दर्ज करें',
    verifyOTP: 'OTP सत्यापित करें',
    newPassword: 'नया पासवर्ड',
    confirmPassword: 'पासवर्ड की पुष्टि करें',
    
    // Categories
    categories: {
      garbageWaste: 'कचरा और गंदगी',
      trafficRoads: 'ट्रैफिक और सड़क',
      pollution: 'प्रदूषण',
      drainageSewage: 'नालियां और सीवर',
      publicSpaces: 'सार्वजनिक स्थान',
      housingSlums: 'आवास और झुग्गियां',
      waterIssues: 'पानी की समस्या',
      electricityIssues: 'बिजली की समस्या',
      education: 'शिक्षा',
      health: 'स्वास्थ्य',
      otherIssues: 'अन्य समस्याएं',
      otherProblem: 'अन्य समस्या'
    },
    
    // Departments
    departments: {
      sanitation: 'सफाई विभाग',
      roads: 'सड़क विभाग',
      electricity: 'विद्युत विभाग',
      water: 'जल विभाग',
      health: 'स्वास्थ्य विभाग',
      education: 'शिक्षा विभाग',
      administration: 'सामान्य प्रशासन',
      otherDepartment: 'अन्य विभाग'
    },
    
    // Status
    status: {
      pending: 'लंबित',
      inProgress: 'प्रगति में',
      resolved: 'हल हो गया'
    },

    // Admin/Government Interface
    admin: {
      // Roles
      districtMagistrate: 'जिला मजिस्ट्रेट',
      departmentHead: 'विभाग प्रमुख',
      fieldWorker: 'क्षेत्रीय कार्यकर्ता',
      
      // Navigation
      complaints: 'शिकायतें',
      departments: 'विभाग',
      workers: 'कार्यकर्ता',
      analytics: 'विश्लेषण',
      reports: 'रिपोर्ट',
      notifications: 'सूचनाएं',
      settings: 'सेटिंग',
      meetings: 'बैठकें',
      
      // Dashboard
      totalComplaints: 'कुल शिकायतें',
      pendingComplaints: 'लंबित शिकायतें',
      resolvedComplaints: 'हल की गई शिकायतें',
      activeWorkers: 'सक्रिय कार्यकर्ता',
      totalDepartments: 'कुल विभाग',
      
      // Complaints Management
      complaintsManagement: 'शिकायत प्रबंधन',
      assignWorker: 'कार्यकर्ता सौंपें',
      updateStatus: 'स्थिति अपडेट करें',
      complaintDetails: 'शिकायत विवरण',
      statusUpdate: 'स्थिति अपडेट',
      assignedTo: 'सौंपा गया',
      priority: 'प्राथमिकता',
      location: 'स्थान',
      submittedBy: 'प्रस्तुत किया गया',
      submittedOn: 'प्रस्तुत दिनांक',
      
      // Workers Management
      workersManagement: 'कार्यकर्ता प्रबंधन',
      addWorker: 'कार्यकर्ता जोड़ें',
      workerName: 'कार्यकर्ता का नाम',
      workerDepartment: 'कार्यकर्ता विभाग',
      workerPhone: 'कार्यकर्ता फोन',
      workerEmail: 'कार्यकर्ता ईमेल',
      assignedComplaints: 'सौंपी गई शिकायतें',
      
      // Departments
      departmentsManagement: 'विभाग प्रबंधन',
      publicWorks: 'लोक निर्माण',
      waterWorks: 'जल कार्य',
      sanitation: 'सफाई',
      electricity: 'विद्युत',
      
      // Analytics
      performanceAnalytics: 'प्रदर्शन विश्लेषण',
      resolutionRate: 'समाधान दर',
      avgResolutionTime: 'औसत समाधान समय',
      complaintsByCategory: 'श्रेणी के अनुसार शिकायतें',
      complaintsByStatus: 'स्थिति के अनुसार शिकायतें',
      monthlyTrends: 'मासिक रुझान',
      
      // Meeting System
      meetingManagement: 'बैठक प्रबंधन',
      createMeeting: 'बैठक बनाएं',
      scheduledMeetings: 'निर्धारित बैठकें',
      meetingInvitations: 'बैठक के निमंत्रण',
      joinMeeting: 'बैठक में शामिल हों',
      startMeeting: 'बैठक शुरू करें',
      endMeeting: 'बैठक समाप्त करें',
      meetingTitle: 'बैठक का शीर्षक',
      meetingDescription: 'बैठक का विवरण',
      scheduledAt: 'निर्धारित समय',
      duration: 'अवधि',
      meetingCode: 'बैठक कोड',
      participants: 'प्रतिभागी',
      agenda: 'कार्यसूची',
      addAgendaItem: 'कार्यसूची आइटम जोड़ें',
      inviteParticipants: 'प्रतिभागियों को आमंत्रित करें',
      recordingEnabled: 'रिकॉर्डिंग सक्षम',
      meetingMinutes: 'बैठक का कार्यवृत्त',
      saveMinutes: 'कार्यवृत्त सहेजें',
      
      // Notifications
      newComplaint: 'नई शिकायत',
      complaintAssigned: 'शिकायत सौंपी गई',
      complaintResolved: 'शिकायत हल हुई',
      workerUpdate: 'कार्यकर्ता अपडेट',
      systemAlert: 'सिस्टम अलर्ट',
      
      // Settings
      systemSettings: 'सिस्टम सेटिंग',
      userManagement: 'उपयोगकर्ता प्रबंधन',
      departmentSettings: 'विभाग सेटिंग',
      notificationSettings: 'सूचना सेटिंग',
      
      // Common Actions
      view: 'देखें',
      assign: 'सौंपें',
      update: 'अपडेट',
      approve: 'अनुमोदित करें',
      reject: 'अस्वीकार करें',
      filter: 'फिल्टर',
      search: 'खोजें',
      export: 'निर्यात',
      download: 'डाउनलोड',
    },
    
    // Messages
    messages: {
      loginSuccess: 'सफलतापूर्वक लॉगिन हो गए!',
      logoutSuccess: 'सफलतापूर्वक लॉगआउट हो गए!',
      reportSubmitted: 'शिकायत सफलतापूर्वक दर्ज की गई!',
      profileUpdated: 'प्रोफाइल अपडेट की गई!',
      complaintReceived: 'शिकायत प्राप्त हुई',
      complaintUpdated: 'शिकायत अपडेट की गई!',
      workerAssigned: 'कार्यकर्ता सौंपा गया!',
      fillAllFields: 'कृपया सभी फील्ड भरें',
      otherProblemPlaceholder: 'अपनी समस्या का विवरण यहां लिखें...',
      otherDepartmentPlaceholder: 'विभाग का नाम यहां लिखें...',
      analyzing: 'तस्वीर का विश्लेषण हो रहा है...',
      aiAnalysis: 'AI विश्लेषण',
      identifiedProblems: 'पहचानी गई समस्याएं:',
      priority: 'प्राथमिकता',
      category: 'श्रेणी',
      autoSelectedByAI: 'AI द्वारा स्वचालित रूप से चयनित',
      determinedByAI: 'AI द्वारा निर्धारित',
      aiSuggestedDescription: 'AI द्वारा सुझाया गया विवरण',
      currentLocation: 'वर्तमान स्थान',
      locationObtained: 'स्थान प्राप्त:',
      highPriority: 'उच्च प्राथमिकता',
      mediumPriority: 'मध्यम प्राथमिकता',
      lowPriority: 'कम प्राथमिकता',
      submitReport: 'रिपोर्ट जमा करें',
      submitting: 'जमा हो रहा है...',
      benefitsOfReporting: 'रिपोर्ट करने के फायदे',
      importantInformation: 'महत्वपूर्ण सूचना',
      reportBenefitsText: 'आपकी रिपोर्ट से कानपुर शहर की समस्याओं का तुरंत समाधान होगा और शहर का विकास तेज़ होगा। AI की मदद से अधिक सटीक और तेज़ समाधान मिलेगा।',
      importantInfoText: 'कृपया सही और स्पष्ट जानकारी दें। झूठी या गलत रिपोर्ट न करें। हमारा AI सिस्टम आपकी रिपोर्ट को सत्यापित करता है।',
      smartCityInitiative: 'स्मार्ट शहर पहल',
      citizen: 'नागरिक',
      uploadImageTitle: 'तस्वीर अपलोड करें',
      clickAnywhereToUpload: 'तस्वीर चुनने के लिए कहीं भी क्लिक करें',
      chooseNewImage: 'नई तस्वीर चुनें',
      problemDescription: 'समस्या का विवरण',
      describeProblemDetail: 'समस्या के बारे में विस्तार से बताएं...',
      enterCompleteAddress: 'पूरा पता लिखें या GPS निर्देशांक',
      newProblemReport: 'नई समस्या रिपोर्ट',
      aiPowered: 'AI सहायता',
      meetingCreated: 'मीटिंग सफलतापूर्वक बनाई गई!',
      meetingEnded: 'मीटिंग समाप्त हो गई',
      leftMeeting: 'मीटिंग छोड़ दी गई',
      invitationDeclined: 'आमंत्रण अस्वीकार कर दिया गया',
      welcomeMessage: 'स्वागत है'
    }
  },
  
  english: {
    // Common
    login: 'Login',
    register: 'Register',
    email: 'Email',
    username: 'Username',
    password: 'Password',
    forgotPassword: 'Forgot Password?',
    welcomeMessage: 'Welcome',
    logout: 'Logout',
    profile: 'Profile',
    dashboard: 'Dashboard',
    history: 'History',
    map: 'Map',
    submit: 'Submit',
    cancel: 'Cancel',
    save: 'Save',
    edit: 'Edit',
    delete: 'Delete',
    loading: 'Loading...',
    success: 'Success',
    error: 'Error',
    
    // Login specific
    emailOrUsername: 'Email or Username',
    enterEmailOrUsername: 'Enter your email or username',
    enterPassword: 'Enter your password',
    loginButton: 'LOGIN',
    createAccount: 'Create New Account',
    governmentLogin: 'Government Login',
    // Removed Google login
    
    // Registration specific
    fullName: 'Full Name',
    phoneNumber: 'Phone Number',
    aadharNumber: 'Aadhar Number',
    address: 'Address',
    registerButton: 'REGISTER',
    alreadyHaveAccount: 'Already have an account? Login',
    
    // Forgot Password
    resetPassword: 'Reset Password',
    enterPhoneNumber: 'Enter your phone number',
    sendOTP: 'Send OTP',
    enterOTP: 'Enter OTP',
    verifyOTP: 'Verify OTP',
    newPassword: 'New Password',
    confirmPassword: 'Confirm Password',
    
    // Categories
    categories: {
      garbageWaste: 'Garbage & Waste',
      trafficRoads: 'Traffic & Roads',
      pollution: 'Pollution',
      drainageSewage: 'Drainage & Sewage',
      publicSpaces: 'Public Spaces',
      housingSlums: 'Housing & Slums',
      waterIssues: 'Water Issues',
      electricityIssues: 'Electricity Issues',
      education: 'Education',
      health: 'Health',
      otherIssues: 'Other Issues',
      otherProblem: 'Other Problem'
    },
    
    // Departments
    departments: {
      sanitation: 'Sanitation Department',
      roads: 'Roads & Infrastructure',
      electricity: 'Electricity Department',
      water: 'Water Supply Department',
      health: 'Health Department',
      education: 'Education Department',
      administration: 'General Administration',
      otherDepartment: 'Other Department'
    },
    
    // Status
    status: {
      pending: 'Pending',
      inProgress: 'In Progress',
      resolved: 'Resolved'
    },

    // Admin/Government Interface
    admin: {
      // Roles
      districtMagistrate: 'District Magistrate',
      departmentHead: 'Department Head',
      fieldWorker: 'Field Worker',
      
      // Navigation
      complaints: 'Complaints',
      departments: 'Departments',
      workers: 'Workers',
      analytics: 'Analytics',
      reports: 'Reports',
      notifications: 'Notifications',
      settings: 'Settings',
      meetings: 'Meetings',
      
      // Dashboard
      totalComplaints: 'Total Complaints',
      pendingComplaints: 'Pending Complaints',
      resolvedComplaints: 'Resolved Complaints',
      activeWorkers: 'Active Workers',
      totalDepartments: 'Total Departments',
      
      // Complaints Management
      complaintsManagement: 'Complaints Management',
      assignWorker: 'Assign Worker',
      updateStatus: 'Update Status',
      complaintDetails: 'Complaint Details',
      statusUpdate: 'Status Update',
      assignedTo: 'Assigned To',
      priority: 'Priority',
      location: 'Location',
      submittedBy: 'Submitted By',
      submittedOn: 'Submitted On',
      
      // Workers Management
      workersManagement: 'Workers Management',
      addWorker: 'Add Worker',
      workerName: 'Worker Name',
      workerDepartment: 'Worker Department',
      workerPhone: 'Worker Phone',
      workerEmail: 'Worker Email',
      assignedComplaints: 'Assigned Complaints',
      
      // Departments
      departmentsManagement: 'Departments Management',
      publicWorks: 'Public Works',
      waterWorks: 'Water Works',
      sanitation: 'Sanitation',
      electricity: 'Electricity',
      
      // Analytics
      performanceAnalytics: 'Performance Analytics',
      resolutionRate: 'Resolution Rate',
      avgResolutionTime: 'Avg Resolution Time',
      complaintsByCategory: 'Complaints by Category',
      complaintsByStatus: 'Complaints by Status',
      monthlyTrends: 'Monthly Trends',
      
      // Meeting System
      meetingManagement: 'Meeting Management',
      createMeeting: 'Create Meeting',
      scheduledMeetings: 'Scheduled Meetings',
      meetingInvitations: 'Meeting Invitations',
      joinMeeting: 'Join Meeting',
      startMeeting: 'Start Meeting',
      endMeeting: 'End Meeting',
      meetingTitle: 'Meeting Title',
      meetingDescription: 'Meeting Description',
      scheduledAt: 'Scheduled At',
      duration: 'Duration',
      meetingCode: 'Meeting Code',
      participants: 'Participants',
      agenda: 'Agenda',
      addAgendaItem: 'Add Agenda Item',
      inviteParticipants: 'Invite Participants',
      recordingEnabled: 'Recording Enabled',
      meetingMinutes: 'Meeting Minutes',
      saveMinutes: 'Save Minutes',
      
      // Notifications
      newComplaint: 'New Complaint',
      complaintAssigned: 'Complaint Assigned',
      complaintResolved: 'Complaint Resolved',
      workerUpdate: 'Worker Update',
      systemAlert: 'System Alert',
      
      // Settings
      systemSettings: 'System Settings',
      userManagement: 'User Management',
      departmentSettings: 'Department Settings',
      notificationSettings: 'Notification Settings',
      
      // Common Actions
      view: 'View',
      assign: 'Assign',
      update: 'Update',
      approve: 'Approve',
      reject: 'Reject',
      filter: 'Filter',
      search: 'Search',
      export: 'Export',
      download: 'Download',
    },
    
    // Messages
    messages: {
      loginSuccess: 'Successfully logged in!',
      logoutSuccess: 'Successfully logged out!',
      reportSubmitted: 'Complaint submitted successfully!',
      profileUpdated: 'Profile updated!',
      complaintReceived: 'Complaint received',
      complaintUpdated: 'Complaint updated!',
      workerAssigned: 'Worker assigned!',
      fillAllFields: 'Please fill all fields',
      otherProblemPlaceholder: 'Describe your problem here...',
      otherDepartmentPlaceholder: 'Enter department name here...',
      analyzing: 'Analyzing image...',
      aiAnalysis: 'AI Analysis',
      identifiedProblems: 'Identified Problems:',
      priority: 'Priority',
      category: 'Category',
      autoSelectedByAI: 'Automatically selected by AI',
      determinedByAI: 'Determined by AI',
      aiSuggestedDescription: 'AI suggested description',
      currentLocation: 'Current Location',
      locationObtained: 'Location obtained:',
      highPriority: 'High Priority',
      mediumPriority: 'Medium Priority',
      lowPriority: 'Low Priority',
      submitReport: 'SUBMIT REPORT',
      submitting: 'Submitting...',
      benefitsOfReporting: 'Benefits of Reporting',
      importantInformation: 'Important Information',
      reportBenefitsText: 'Your reports help solve Kanpur city problems quickly and accelerate urban development. With AI assistance, you get more accurate and faster solutions.',
      importantInfoText: 'Please provide accurate and clear information. Do not submit false or incorrect reports. Our AI system verifies your reports for authenticity.',
      smartCityInitiative: 'Smart City Initiative',
      citizen: 'Citizen',
      uploadImageTitle: 'Upload Image',
      clickAnywhereToUpload: 'Click anywhere to choose image',
      chooseNewImage: 'Choose New Image',
      problemDescription: 'Problem Description',
      describeProblemDetail: 'Describe the problem in detail...',
      enterCompleteAddress: 'Enter complete address or GPS coordinates',
      newProblemReport: 'New Problem Report',
      aiPowered: 'AI Powered',
      meetingCreated: 'Meeting created successfully!',
      meetingEnded: 'Meeting ended',
      leftMeeting: 'Left meeting',
      invitationDeclined: 'Invitation declined',
      welcomeMessage: 'Welcome'
    }
  }
};

export function getTranslations(language: Language): Translations {
  return translations[language];
}

export function t(language: Language, key: string): string {
  const trans = getTranslations(language);
  const keys = key.split('.');
  let value: any = trans;
  
  for (const k of keys) {
    value = value?.[k];
  }
  
  return value || key;
}