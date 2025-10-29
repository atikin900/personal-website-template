// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export const API_ENDPOINTS = {
  // Public endpoints
  SITE: `${API_BASE_URL}/api/site`,
  POSTS: `${API_BASE_URL}/api/posts`,
  GOALS: `${API_BASE_URL}/api/goals`,
  SOCIAL: `${API_BASE_URL}/api/social-networks`,
}

export default API_BASE_URL