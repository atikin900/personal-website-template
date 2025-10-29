import axios from 'axios'

// Функция для получения токена
export const getToken = () => {
  return localStorage.getItem('admin_token')
}

// Функция для сохранения токена
export const setToken = (token) => {
  localStorage.setItem('admin_token', token)
}

// Функция для удаления токена
export const removeToken = () => {
  localStorage.removeItem('admin_token')
}

// Функция для проверки авторизации
export const isAuthenticated = () => {
  const token = getToken()
  return !!token
}

// Функция для логина
export const login = async (username, password) => {
  try {
    const params = new URLSearchParams()
    params.append('username', username)
    params.append('password', password)

    const response = await axios.post('http://localhost:8000/api/auth/login', params, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })

    const { access_token } = response.data
    setToken(access_token)
    return { success: true, token: access_token }
  } catch (error) {
    console.error('Login error:', error)
    return { success: false, error: error.response?.data?.detail || 'Login failed' }
  }
}

// Функция для логаута
export const logout = () => {
  removeToken()
  window.location.href = '/login'
}

// Interceptor для автоматического обновления токена
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      console.log('Token expired or invalid, redirecting to login...')
      removeToken()
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Interceptor для добавления токена к запросам
axios.interceptors.request.use(
  (config) => {
    const token = getToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)