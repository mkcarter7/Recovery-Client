// API client for Django backend
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

/**
 * Makes an API request to the Django backend
 * @param {string} endpoint - API endpoint (e.g., '/api/programs/')
 * @param {object} options - Fetch options (method, headers, body, etc.)
 * @returns {Promise} - Response from the API
 */
async function apiRequest(endpoint, options = {}) {
  const url = `${API_URL}${endpoint}`;

  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  };

  // Add auth token if available
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  if (token) {
    defaultOptions.headers.Authorization = `Bearer ${token}`;
  }

  const config = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'An error occurred' }));
      throw new Error(error.message || `HTTP error! status: ${response.status}`);
    }

    if (response.status === 204) {
      return null;
    }

    return response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}

const normalizeListResponse = (data) => {
  if (Array.isArray(data)) {
    return data;
  }
  if (data && Array.isArray(data.results)) {
    return data.results;
  }
  return [];
};

// API methods
export const apiClient = {
  // Programs (public)
  getPrograms: () => apiRequest('/api/programs/'),
  getProgram: (id) => apiRequest(`/api/programs/${id}/`),

  // Site content
  getSiteContent: () => apiRequest('/api/site-content/all/'),
  updateSiteContent: (key, value) =>
    apiRequest(`/api/admin/site-content/${key}/`, {
      method: 'PUT',
      body: JSON.stringify({ content: value ?? '' }),
    }),

  // Programs (admin)
  getAdminPrograms: () => apiRequest('/api/admin/programs/').then((data) => normalizeListResponse(data)),
  createProgram: (payload) =>
    apiRequest('/api/admin/programs/', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  updateProgram: (id, payload) =>
    apiRequest(`/api/admin/programs/${id}/`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),
  deleteProgram: (id) => apiRequest(`/api/admin/programs/${id}/`, { method: 'DELETE' }),

  // About/Content legacy (TODO: remove if unused)
  getAbout: () => apiRequest('/api/about/'),
  getTeam: () => apiRequest('/api/team/'),
  getPartners: () => apiRequest('/api/partners/'),

  // Testimonials
  getTestimonials: () => apiRequest('/api/testimonials/'),

  // Contact
  submitContact: (data) =>
    apiRequest('/api/contact/', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // Newsletter
  subscribeNewsletter: (data) =>
    apiRequest('/api/newsletter/', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // Admin - Form Submissions
  getContactSubmissions: () => apiRequest('/api/admin/contact-submissions/'),
  getNewsletterSubscriptions: () => apiRequest('/api/admin/newsletter-subscriptions/'),
  deleteContactSubmission: (id) => apiRequest(`/api/admin/contact-submissions/${id}/`, { method: 'DELETE' }),
  deleteNewsletterSubscription: (id) => apiRequest(`/api/admin/newsletter-subscriptions/${id}/`, { method: 'DELETE' }),

  // Generic helpers
  get: (endpoint) => apiRequest(endpoint, { method: 'GET' }),
  post: (endpoint, data) =>
    apiRequest(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  put: (endpoint, data) =>
    apiRequest(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  delete: (endpoint) => apiRequest(endpoint, { method: 'DELETE' }),
};

export default apiClient;
