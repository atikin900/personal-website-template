import { Link, useLocation } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { useState, useEffect } from 'react'

const Layout = ({ children, onLogout }) => {
  const location = useLocation()
  const [isCollapsed, setIsCollapsed] = useState(() => {
    const saved = localStorage.getItem('sidebar-collapsed')
    return saved ? JSON.parse(saved) : false
  })

  const navigation = [
    { name: 'Панель управления', href: '/', icon: '📊', shortName: 'Панель' },
    { name: 'Записи блога', href: '/posts', icon: '📝', shortName: 'Блог' },
    { name: 'Цели', href: '/goals', icon: '🎯', shortName: 'Цели' },
    { name: 'Настройки сайта', href: '/settings', icon: '⚙️', shortName: 'Сайт' },
    { name: 'Настройки пользователя', href: '/user-settings', icon: '👤', shortName: 'Профиль' },
  ]

  useEffect(() => {
    localStorage.setItem('sidebar-collapsed', JSON.stringify(isCollapsed))
  }, [isCollapsed])

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed)
  }

  const handleLogout = () => {
    localStorage.removeItem('admin_token')
    onLogout()
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 bg-gray-800 border-r border-gray-700 transition-all duration-300 ${
        isCollapsed ? 'w-16' : 'w-64'
      }`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center px-4 py-4 border-b border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">И</span>
              </div>
              {!isCollapsed && (
                <div>
                  <h1 className="text-white font-semibold">Админ-панель (Backup)</h1>
                  <p className="text-gray-400 text-sm">Иванцов Никита</p>
                </div>
              )}
            </div>
            <Button
              onClick={toggleSidebar}
              variant="ghost"
              size="sm"
              className={`text-gray-400 hover:text-white hover:bg-gray-700 ${
                isCollapsed ? 'ml-0' : 'ml-auto'
              }`}
            >
              {isCollapsed ? '→' : '←'}
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-2 py-6 space-y-2">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-colors ${
                    isActive
                      ? 'bg-red-600 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                  title={isCollapsed ? item.name : ''}
                >
                  <span className={isCollapsed ? 'mx-auto' : 'mr-3'}>{item.icon}</span>
                  {!isCollapsed && item.name}
                </Link>
              )
            })}
          </nav>

          {/* Logout */}
          <div className="px-2 py-4 border-t border-gray-700">
            <Button
              onClick={handleLogout}
              variant="outline"
              className={`border-gray-600 text-gray-300 hover:bg-gray-700 ${
                isCollapsed ? 'w-12 h-12 p-0' : 'w-full'
              }`}
              title={isCollapsed ? 'Выйти' : ''}
            >
              {isCollapsed ? '🚪' : 'Выйти'}
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className={`transition-all duration-300 ${isCollapsed ? 'pl-16' : 'pl-64'}`}>
        <main className="p-8">
          {children}
        </main>
      </div>
    </div>
  )
}

export default Layout