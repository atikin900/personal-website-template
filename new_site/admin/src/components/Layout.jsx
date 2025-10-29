import { Link, useLocation } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { useState, useEffect } from 'react'
import axios from 'axios'
import ThemeSelector from './ThemeSelector'
import NotificationPanel from './NotificationPanel'

const Layout = ({ children, onLogout }) => {
  const location = useLocation()
  const [isCollapsed, setIsCollapsed] = useState(() => {
    const saved = localStorage.getItem('sidebar-collapsed')
    return saved ? JSON.parse(saved) : false
  })
  const [siteSettings, setSiteSettings] = useState({
    display_name: 'Ваше Имя',
    short_name: 'Имя'
  })

  const navigation = [
    { name: 'Обзор', href: '/', icon: '📊', shortName: 'Обзор' },
    { name: 'Записи блога', href: '/posts', icon: '📝', shortName: 'Блог' },
    { name: 'Цели', href: '/goals', icon: '🎯', shortName: 'Цели' },
    { name: 'Настройки сайта', href: '/settings', icon: '⚙️', shortName: 'Сайт' },
    { name: 'Профиль', href: '/user-settings', icon: '👤', shortName: 'Профиль' },
  ]

  useEffect(() => {
    localStorage.setItem('sidebar-collapsed', JSON.stringify(isCollapsed))
  }, [isCollapsed])

  // Загружаем настройки сайта для получения отображаемых имен
  useEffect(() => {
    const fetchSiteSettings = async () => {
      try {
        const token = localStorage.getItem('admin_token')
        const response = await axios.get('http://localhost:8000/api/site', {
          headers: { Authorization: `Bearer ${token}` }
        })
        setSiteSettings({
          display_name: response.data.display_name || 'Ваше Имя',
          short_name: response.data.short_name || 'Имя'
        })
      } catch (error) {
        console.error('Ошибка при загрузке настроек сайта:', error)
      }
    }

    fetchSiteSettings()
  }, [])

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed)
  }

  const handleLogout = () => {
    localStorage.removeItem('admin_token')
    onLogout()
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 sidebar-nav transition-all duration-300 ${
        isCollapsed ? 'w-16' : 'w-64'
      }`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center px-4 py-6 border-b border-border">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 gradient-bg rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">И</span>
              </div>
              {!isCollapsed && (
                <div>
                  <h1 className="text-foreground font-bold text-lg">Админ-панель</h1>
                  <p className="text-muted-foreground text-sm">{siteSettings.display_name}</p>
                </div>
              )}
            </div>
            <Button
              onClick={toggleSidebar}
              variant="ghost"
              size="sm"
              className={`text-muted-foreground hover:text-foreground hover:bg-accent ml-auto ${
                isCollapsed ? 'ml-0' : ''
              }`}
            >
              {isCollapsed ? '→' : '←'}
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-6 space-y-1">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`nav-item ${isActive ? 'active' : ''}`}
                  title={isCollapsed ? item.name : ''}
                >
                  <span className={isCollapsed ? 'mx-auto text-base' : 'mr-3 text-lg'}>{item.icon}</span>
                  {!isCollapsed && (
                    <span className="font-medium">{item.name}</span>
                  )}
                  {isActive && !isCollapsed && (
                    <div className="ml-auto w-2 h-2 bg-primary rounded-full"></div>
                  )}
                </Link>
              )
            })}
          </nav>

          {/* User section */}
          <div className="px-3 py-4 border-t border-border">
            <div className="flex items-center space-x-3 mb-3">
              {!isCollapsed && (
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                    <span className="text-primary-foreground font-semibold text-sm">И</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{siteSettings.short_name}</p>
                    <p className="text-xs text-muted-foreground truncate">Администратор</p>
                  </div>
                </div>
              )}
            </div>
            <Button
              onClick={handleLogout}
              variant="outline"
              size="sm"
              className={`border-border text-muted-foreground hover:bg-accent hover:text-foreground ${
                isCollapsed ? 'w-10 h-10 p-0' : 'w-full'
              }`}
              title={isCollapsed ? 'Выйти' : ''}
            >
              {isCollapsed ? '🚪' : (
                <>
                  <span className="mr-2">🚪</span>
                  Выйти
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className={`transition-all duration-300 ${isCollapsed ? 'pl-16' : 'pl-64'}`}>
        {/* Header */}
        <header className="bg-card border-b border-border px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-foreground">
                {navigation.find(item => item.href === location.pathname)?.name || 'Админ-панель'}
              </h2>
              <p className="text-sm text-muted-foreground">
                Управление вашим сайтом
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <ThemeSelector />
              <NotificationPanel />
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  )
}

export default Layout