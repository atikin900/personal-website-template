// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export const API_ENDPOINTS = {
  // Auth
  LOGIN: `${API_BASE_URL}/api/auth/login`,
  
  // Public endpoints
  SITE: `${API_BASE_URL}/api/site`,
  PUBLIC_POSTS: `${API_BASE_URL}/api/public/posts`,
  PUBLIC_GOALS: `${API_BASE_URL}/api/public/goals`,
  PUBLIC_SOCIAL: `${API_BASE_URL}/api/public/social-networks`,
  
  // Admin endpoints
  ADMIN_SITE: `${API_BASE_URL}/api/admin/site`,
  ADMIN_POSTS: `${API_BASE_URL}/api/admin/posts`,
  ADMIN_GOALS: `${API_BASE_URL}/api/admin/goals`,
  ADMIN_SOCIAL: `${API_BASE_URL}/api/admin/social-networks`,
  ADMIN_UPLOAD_IMAGE: `${API_BASE_URL}/api/admin/upload-profile-image`,
  ADMIN_CHANGE_PASSWORD: `${API_BASE_URL}/api/admin/change-password`,
  ADMIN_SEED_DATA: `${API_BASE_URL}/api/admin/seed-data`,
}

export default API_BASE_URL