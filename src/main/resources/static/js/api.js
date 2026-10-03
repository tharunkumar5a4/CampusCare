// CampusCare REST API Service Layer

const API_BASE = '/api';

export const api = {
  getToken() {
    return localStorage.getItem('campuscare_token');
  },

  getUser() {
    const userStr = localStorage.getItem('campuscare_user');
    return userStr ? JSON.parse(userStr) : null;
  },

  setAuth(token, user) {
    localStorage.setItem('campuscare_token', token);
    localStorage.setItem('campuscare_user', JSON.stringify(user));
  },

  clearAuth() {
    localStorage.removeItem('campuscare_token');
    localStorage.removeItem('campuscare_user');
  },

  async request(endpoint, options = {}) {
    const token = this.getToken();
    const headers = options.headers || {};

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    if (!(options.body instanceof FormData) && !headers['Content-Type']) {
      headers['Content-Type'] = 'application/json';
    }

    const config = {
      ...options,
      headers,
    };

    try {
      const response = await fetch(`${API_BASE}${endpoint}`, config);
      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          // If unauthorized and on protected page, redirect to login
          if (!window.location.hash.startsWith('#login') && !window.location.hash.startsWith('#register')) {
            this.clearAuth();
            window.location.hash = '#login';
          }
        }
        throw new Error(data.message || 'API request failed');
      }

      return data;
    } catch (err) {
      throw err;
    }
  },

  // Authentication APIs
  auth: {
    login(credentials) {
      return api.request('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      });
    },
    register(studentData) {
      return api.request('/auth/register', {
        method: 'POST',
        body: JSON.stringify(studentData),
      });
    },
    getProfile() {
      return api.request('/auth/me');
    },
  },

  // Categories
  categories: {
    getActive() {
      return api.request('/categories');
    },
    getAll() {
      return api.request('/admin/categories');
    },
    create(data) {
      return api.request('/admin/categories', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
    update(id, data) {
      return api.request(`/admin/categories/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
    },
    delete(id) {
      return api.request(`/admin/categories/${id}`, {
        method: 'DELETE',
      });
    },
  },

  // Student Complaints
  student: {
    getComplaints() {
      return api.request('/complaints/my');
    },
    getDashboard() {
      return api.request('/complaints/dashboard/student');
    },
    createComplaint(formData) {
      return api.request('/complaints', {
        method: 'POST',
        body: formData,
      });
    },
    getDetails(id) {
      return api.request(`/complaints/${id}`);
    },
    addComment(id, message) {
      return api.request(`/complaints/${id}/comments`, {
        method: 'POST',
        body: JSON.stringify({ message }),
      });
    },
    closeComplaint(id) {
      return api.request(`/complaints/${id}/close`, {
        method: 'POST',
      });
    },
  },

  // Staff Complaints
  staff: {
    getAssignedComplaints() {
      return api.request('/staff/complaints');
    },
    getDashboard() {
      return api.request('/staff/dashboard');
    },
    getDetails(id) {
      return api.request(`/staff/complaints/${id}`);
    },
    updateStatus(id, status, note) {
      return api.request(`/staff/complaints/${id}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status, note }),
      });
    },
    resolveComplaint(id, note) {
      return api.request(`/staff/complaints/${id}/resolve`, {
        method: 'PUT',
        body: JSON.stringify({ note }),
      });
    },
    addComment(id, message) {
      return api.request(`/staff/complaints/${id}/comments`, {
        method: 'POST',
        body: JSON.stringify({ message }),
      });
    },
  },

  // Admin Features
  admin: {
    getDashboard() {
      return api.request('/admin/dashboard');
    },
    getComplaints(filters = {}) {
      const params = new URLSearchParams();
      if (filters.status) params.append('status', filters.status);
      if (filters.categoryId) params.append('categoryId', filters.categoryId);
      if (filters.priority) params.append('priority', filters.priority);
      if (filters.search) params.append('search', filters.search);
      
      const query = params.toString() ? `?${params.toString()}` : '';
      return api.request(`/admin/complaints${query}`);
    },
    assignStaff(id, staffId, note) {
      return api.request(`/admin/complaints/${id}/assign`, {
        method: 'PUT',
        body: JSON.stringify({ staffId, note }),
      });
    },
    updatePriority(id, priority) {
      return api.request(`/admin/complaints/${id}/priority`, {
        method: 'PUT',
        body: JSON.stringify({ priority }),
      });
    },
    updateStatus(id, status, note) {
      return api.request(`/admin/complaints/${id}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status, note }),
      });
    },
    getUsers() {
      return api.request('/admin/users');
    },
    getStaffList() {
      return api.request('/admin/staff');
    },
    updateUserRole(id, role) {
      return api.request(`/admin/users/${id}/role`, {
        method: 'PUT',
        body: JSON.stringify({ role }),
      });
    },
    toggleUserStatus(id) {
      return api.request(`/admin/users/${id}/status`, {
        method: 'PUT',
      });
    },
  },
};
