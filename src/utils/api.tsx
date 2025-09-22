// API utilities for VIKSIT KANPUR - Backend Integration
// This file provides functions to interact with the backend API

// Types for API responses
export interface User {
  id: string;
  name: string;
  email: string;
  phone_number: string;
  aadhar: string;
  role: 'citizen' | 'admin' | 'field-worker' | 'department-head' | 'district-magistrate';
  address?: string;
  department?: string;
  avatar_url?: string;
  is_active?: boolean;
  last_login?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Problem {
  id: string;
  user_id: string;
  problem_categories: string[];
  others_text?: string;
  user_image_base64: string;
  user_image_mimetype: string;
  admin_image_base64?: string;
  admin_image_mimetype?: string;
  latitude: number;
  longitude: number;
  status: 'not completed' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  assigned_worker_id?: string;
  assigned_department?: string;
  estimated_completion?: string;
  completion_notes?: string;
  citizen_rating?: number;
  citizen_feedback?: string;
  created_at: string;
  updated_at: string;
  user_name?: string;
  user_email?: string;
  assigned_worker_name?: string;
  department_name?: string;
  user_image_status?: 'image_available';
  admin_image_status?: 'image_available';
}

export interface Analytics {
  totalComplaints: number;
  pendingComplaints: number;
  inProgressComplaints: number;
  completedComplaints: number;
  avgResolutionDays: number;
  categoryBreakdown: Record<string, number>;
  recentComplaints: Problem[];
}

export interface Department {
  id: string;
  name: string;
  name_en: string;
  head_id?: string;
  description?: string;
  phone?: string;
  email?: string;
  location?: string;
  budget?: number;
  established_year?: number;
  status: string;
  total_workers: number;
  total_complaints: number;
  resolved_complaints: number;
  avg_resolution_time?: number;
  rating: number;
  head_name?: string;
  head_email?: string;
}

export interface Worker {
  id: string;
  name: string;
  email: string;
  phone_number: string;
  department?: string;
  specializations?: string[];
  efficiency_rating: number;
  total_assigned: number;
  total_completed: number;
  avg_completion_time?: number;
  current_status: string;
  last_active: string;
  location_lat?: number;
  location_lng?: number;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  priority: string;
  sender_id?: string;
  sender_name?: string;
  category: string;
  related_problem_id?: string;
  action_required: boolean;
  expires_at?: string;
  is_read: boolean;
  created_at: string;
}

// API Configuration
const API_BASE_URL = 'https://vikshit-bharat-backend.vercel.app';

// Helper function to get auth token from localStorage
const getAuthToken = (): string | null => {
  return localStorage.getItem('auth_token');
};

// Helper function to set auth token
const setAuthToken = (token: string) => {
  localStorage.setItem('auth_token', token);
};

// Helper function to remove auth token
const removeAuthToken = () => {
  localStorage.removeItem('auth_token');
};

// Helper function to make authenticated requests
const makeAuthenticatedRequest = async (url: string, options: RequestInit = {}) => {
  const token = getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    removeAuthToken();
    throw new Error('Authentication required');
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
  }

  return response.json();
};

// API functions
export const api = {
  // Authentication
  login: async (email: string, password: string): Promise<{ user: User; token: string }> => {
    const response = await fetch(`${API_BASE_URL}/api/users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Login failed');
    }

    const data = await response.json();
    setAuthToken(data.token);
    return data;
  },

  adminLogin: async (email: string, password: string): Promise<{ user: User; token: string }> => {
    return api.login(email, password);
  },

  register: async (userData: {
    name: string;
    email: string;
    phone_number: string;
    aadhar: string;
    password: string;
    address?: string;
    role?: string;
    department?: string;
  }): Promise<{ user: User; token: string }> => {
    const response = await fetch(`${API_BASE_URL}/api/users/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Registration failed');
    }

    const data = await response.json();
    setAuthToken(data.token);
    return data;
  },

  logout: () => {
    removeAuthToken();
  },

  // User Management
  getUser: async (userId: string): Promise<{ user: User }> => {
    return makeAuthenticatedRequest(`/api/users/${userId}`);
  },

  updateUser: async (userId: string, userData: Partial<User>): Promise<{ user: User }> => {
    return makeAuthenticatedRequest(`/api/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  },

  getAllUsers: async (): Promise<{ users: User[] }> => {
    return makeAuthenticatedRequest('/api/users');
  },

  // Problem/Complaint Management
  analyzeImage: async (imageFile: File): Promise<{ categories: string[] }> => {
    console.log('🌐 API: Starting image analysis request');
    console.log('🌐 API: File details:', { name: imageFile.name, size: imageFile.size, type: imageFile.type });
    console.log('🌐 API: Backend URL:', `${API_BASE_URL}/api/analyze-image`);
    
    const formData = new FormData();
    formData.append('image', imageFile);

    const token = getAuthToken();
    console.log('🌐 API: Auth token present:', !!token);
    
    const response = await fetch(`${API_BASE_URL}/api/analyze-image`, {
      method: 'POST',
      headers: token ? { 'Authorization': `Bearer ${token}` } : {},
      body: formData,
    });

    console.log('🌐 API: Response status:', response.status);
    console.log('🌐 API: Response ok:', response.ok);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('🌐 API: Error response:', errorData);
      throw new Error(errorData.error || 'Image analysis failed');
    }

    const result = await response.json();
    console.log('🌐 API: Success response:', result);
    return result;
  },

  submitProblem: async (problemData: {
    problem_categories: string[];
    others_text?: string;
    latitude: number;
    longitude: number;
    priority?: string;
  }, imageFile: File): Promise<{ problem: Problem }> => {
    const formData = new FormData();
    formData.append('image', imageFile);
    formData.append('problem_categories', JSON.stringify(problemData.problem_categories));
    formData.append('latitude', problemData.latitude.toString());
    formData.append('longitude', problemData.longitude.toString());
    
    if (problemData.others_text) {
      formData.append('others_text', problemData.others_text);
    }
    if (problemData.priority) {
      formData.append('priority', problemData.priority);
    }

    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}/api/problems`, {
      method: 'POST',
      headers: token ? { 'Authorization': `Bearer ${token}` } : {},
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Problem submission failed');
    }

    return response.json();
  },

  getUserProblems: async (userId: string): Promise<{ problems: Problem[] }> => {
    return makeAuthenticatedRequest(`/api/problems/user/${userId}`);
  },

  getAllProblems: async (): Promise<{ problems: Problem[] }> => {
    return makeAuthenticatedRequest('/api/admin/problems');
  },

  completeProblem: async (problemId: string, completionData: {
    completion_notes?: string;
  }, completedImage: File): Promise<{ problem: Problem }> => {
    const formData = new FormData();
    formData.append('completed_image', completedImage);
    
    if (completionData.completion_notes) {
      formData.append('completion_notes', completionData.completion_notes);
    }

    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}/api/admin/problems/${problemId}/complete`, {
      method: 'POST',
      headers: token ? { 'Authorization': `Bearer ${token}` } : {},
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Failed to complete problem');
    }

    return response.json();
  },

  assignWorker: async (problemId: string, assignmentData: {
    worker_id: string;
    department: string;
    estimated_completion?: string;
  }): Promise<{ problem: Problem }> => {
    return makeAuthenticatedRequest(`/api/admin/problems/${problemId}/assign`, {
      method: 'POST',
      body: JSON.stringify(assignmentData),
    });
  },

  updateProblem: async (problemId: string, updates: {
    status?: string;
    priority?: string;
    notes?: string;
  }): Promise<{ problem: Problem }> => {
    return makeAuthenticatedRequest(`/api/admin/problems/${problemId}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  },

  getProblemHistory: async (problemId: string): Promise<{ history: any[] }> => {
    return makeAuthenticatedRequest(`/api/problems/${problemId}/history`);
  },

  // Worker Management
  getAllWorkers: async (): Promise<{ workers: Worker[] }> => {
    return makeAuthenticatedRequest('/api/admin/workers');
  },

  createWorker: async (workerData: {
    user_id: string;
    specializations: string[];
    current_status?: string;
  }): Promise<{ worker: Worker }> => {
    return makeAuthenticatedRequest('/api/admin/workers', {
      method: 'POST',
      body: JSON.stringify(workerData),
    });
  },

  updateWorkerStatus: async (workerId: string, statusData: {
    current_status?: string;
    location_lat?: number;
    location_lng?: number;
  }): Promise<{ worker: Worker }> => {
    return makeAuthenticatedRequest(`/api/workers/${workerId}/status`, {
      method: 'PATCH',
      body: JSON.stringify(statusData),
    });
  },

  // Department Management
  getAllDepartments: async (): Promise<{ departments: Department[] }> => {
    return makeAuthenticatedRequest('/api/admin/departments');
  },

  createDepartment: async (departmentData: {
    name: string;
    name_en: string;
    head_id?: string;
    description?: string;
    phone?: string;
    email?: string;
    location?: string;
    budget?: number;
    established_year?: number;
  }): Promise<{ department: Department }> => {
    return makeAuthenticatedRequest('/api/admin/departments', {
      method: 'POST',
      body: JSON.stringify(departmentData),
    });
  },

  updateDepartment: async (departmentId: string, updates: Partial<Department>): Promise<{ department: Department }> => {
    return makeAuthenticatedRequest(`/api/admin/departments/${departmentId}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  // Notifications
  getNotifications: async (params?: {
    limit?: number;
    offset?: number;
    category?: string;
    type?: string;
  }): Promise<{ notifications: Notification[] }> => {
    const queryParams = new URLSearchParams();
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.offset) queryParams.append('offset', params.offset.toString());
    if (params?.category) queryParams.append('category', params.category);
    if (params?.type) queryParams.append('type', params.type);

    const queryString = queryParams.toString();
    return makeAuthenticatedRequest(`/api/notifications${queryString ? '?' + queryString : ''}`);
  },

  createNotification: async (notificationData: {
    title: string;
    message: string;
    type: string;
    priority?: string;
    recipient_ids?: number[];
    department?: string;
    category: string;
    related_problem_id?: string;
    action_required?: boolean;
    expires_at?: string;
  }): Promise<{ notification: Notification }> => {
    return makeAuthenticatedRequest('/api/notifications', {
      method: 'POST',
      body: JSON.stringify(notificationData),
    });
  },

  markNotificationRead: async (notificationId: string): Promise<{ notification: Notification }> => {
    return makeAuthenticatedRequest(`/api/notifications/${notificationId}/read`, {
      method: 'PATCH',
    });
  },

  // Analytics
  getDashboardAnalytics: async (): Promise<Analytics> => {
    return makeAuthenticatedRequest('/api/analytics/dashboard');
  },

  getDepartmentAnalytics: async (): Promise<{ departments: Department[] }> => {
    return makeAuthenticatedRequest('/api/analytics/departments');
  },

  getWorkerAnalytics: async (): Promise<{ workers: Worker[] }> => {
    return makeAuthenticatedRequest('/api/analytics/workers');
  },

  getWardAnalytics: async (): Promise<{ wards: any[] }> => {
    return makeAuthenticatedRequest('/api/analytics/wards');
  },

  getActivityAnalytics: async (): Promise<{ activity: any[] }> => {
    return makeAuthenticatedRequest('/api/analytics/activity');
  },

  getRecentActivity: async (limit?: number): Promise<{ activities: any[] }> => {
    const queryString = limit ? `?limit=${limit}` : '';
    return makeAuthenticatedRequest(`/api/analytics/recent-activity${queryString}`);
  },

  // Health check
  healthCheck: async (): Promise<{ status: string; timestamp: string }> => {
    const response = await fetch(`${API_BASE_URL}/health`);
    return response.json();
  },
};

// Legacy mock API for backward compatibility
export const mockApi = {
  login: api.login,
  register: api.register,
  submitProblem: api.submitProblem,
};

// Export additional utilities
export { getAuthToken, setAuthToken, removeAuthToken };
