import { useState, useEffect } from 'react'
import axios from 'axios'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const UserSettings = () => {
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [usernameData, setUsernameData] = useState({
    newUsername: '',
    password: ''
  })
  const [displayNameData, setDisplayNameData] = useState({
    display_name: '',
    short_name: ''
  })
  const [userInfo, setUserInfo] = useState({
    username: '',
    id: null
  })
  const [siteSettings, setSiteSettings] = useState({
    display_name: '',
    short_name: ''
  })
  const [loading, setLoading] = useState(false)
  const [usernameLoading, setUsernameLoading] = useState(false)
  const [displayNameLoading, setDisplayNameLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [usernameMessage, setUsernameMessage] = useState('')
  const [displayNameMessage, setDisplayNameMessage] = useState('')
  const [error, setError] = useState('')
  const [usernameError, setUsernameError] = useState('')
  const [displayNameError, setDisplayNameError] = useState('')

  // Загрузка информации о пользователе и настроек сайта
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('admin_token')
        
        // Загружаем информацию о пользователе
        const userResponse = await axios.get('http://localhost:8000/api/admin/user-info', {
          headers: { Authorization: `Bearer ${token}` }
        })
        setUserInfo(userResponse.data)
        setUsernameData({ ...usernameData, newUsername: userResponse.data.username })
        
        // Загружаем настройки сайта для отображаемых имен
        const siteResponse = await axios.get('http://localhost:8000/api/site', {
          headers: { Authorization: `Bearer ${token}` }
        })
        setSiteSettings({
          display_name: siteResponse.data.display_name || '',
          short_name: siteResponse.data.short_name || ''
        })
        setDisplayNameData({
          display_name: siteResponse.data.display_name || '',
          short_name: siteResponse.data.short_name || ''
        })
      } catch (error) {
        console.error('Ошибка при загрузке данных:', error)
      }
    }

    fetchData()
  }, [])

  const handlePasswordChange = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    setError('')

    // Проверяем совпадение паролей
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('Новые пароли не совпадают')
      setLoading(false)
      return
    }

    // Проверяем длину пароля
    if (passwordData.newPassword.length < 4) {
      setError('Пароль должен содержать минимум 4 символа')
      setLoading(false)
      return
    }

    try {
      const token = localStorage.getItem('admin_token')
      const formData = new FormData()
      formData.append('current_password', passwordData.currentPassword)
      formData.append('new_password', passwordData.newPassword)

      await axios.post('http://localhost:8000/api/admin/change-password', formData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      })

      setMessage('Пароль успешно изменен')
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      })
    } catch (error) {
      setError(error.response?.data?.detail || 'Ошибка при смене пароля')
    } finally {
      setLoading(false)
    }
  }

  const handleUsernameChange = async (e) => {
    e.preventDefault()
    setUsernameLoading(true)
    setUsernameMessage('')
    setUsernameError('')

    // Проверяем длину имени пользователя
    if (usernameData.newUsername.length < 3) {
      setUsernameError('Имя пользователя должно содержать минимум 3 символа')
      setUsernameLoading(false)
      return
    }

    // Проверяем, что имя пользователя изменилось
    if (usernameData.newUsername === userInfo.username) {
      setUsernameError('Новое имя пользователя должно отличаться от текущего')
      setUsernameLoading(false)
      return
    }

    try {
      const token = localStorage.getItem('admin_token')
      const formData = new FormData()
      formData.append('new_username', usernameData.newUsername)
      formData.append('password', usernameData.password)

      await axios.post('http://localhost:8000/api/admin/change-username', formData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      })

      setUsernameMessage('Имя пользователя успешно изменено')
      setUserInfo({ ...userInfo, username: usernameData.newUsername })
      setUsernameData({ ...usernameData, password: '' })
    } catch (error) {
      setUsernameError(error.response?.data?.detail || 'Ошибка при смене имени пользователя')
    } finally {
      setUsernameLoading(false)
    }
  }

  const handleDisplayNameChange = async (e) => {
    e.preventDefault()
    setDisplayNameLoading(true)
    setDisplayNameMessage('')
    setDisplayNameError('')

    try {
      const token = localStorage.getItem('admin_token')
      
      // Обновляем настройки сайта с новыми отображаемыми именами
      await axios.put('http://localhost:8000/api/admin/site', {
        display_name: displayNameData.display_name,
        short_name: displayNameData.short_name
      }, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      setDisplayNameMessage('Отображаемые имена успешно изменены')
      setSiteSettings({
        display_name: displayNameData.display_name,
        short_name: displayNameData.short_name
      })
      
      // Обновляем Layout компонент
      window.location.reload()
      
    } catch (error) {
      setDisplayNameError(error.response?.data?.detail || 'Ошибка при изменении отображаемых имен')
    } finally {
      setDisplayNameLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Настройки пользователя</h1>
        <p className="text-gray-400">Управление настройками вашего аккаунта</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Изменение отображаемых имен */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Отображаемые имена</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleDisplayNameChange} className="space-y-4">
              <div>
                <Label htmlFor="display_name" className="text-white">
                  Полное имя (для админ панели)
                </Label>
                <Input
                  id="display_name"
                  type="text"
                  value={displayNameData.display_name}
                  onChange={(e) => setDisplayNameData({ 
                    ...displayNameData, 
                    display_name: e.target.value 
                  })}
                  className="bg-gray-700 border-gray-600 text-white"
                  placeholder="Например: Иванцов Никита"
                />
                <p className="text-xs text-gray-400 mt-1">
                  Отображается под "Админ-панель" в сайдбаре
                </p>
              </div>

              <div>
                <Label htmlFor="short_name" className="text-white">
                  Короткое имя (для админ панели)
                </Label>
                <Input
                  id="short_name"
                  type="text"
                  value={displayNameData.short_name}
                  onChange={(e) => setDisplayNameData({ 
                    ...displayNameData, 
                    short_name: e.target.value 
                  })}
                  className="bg-gray-700 border-gray-600 text-white"
                  placeholder="Например: Никита"
                />
                <p className="text-xs text-gray-400 mt-1">
                  Отображается в профиле внизу сайдбара
                </p>
              </div>

              {displayNameMessage && (
                <div className="p-3 bg-green-600/20 border border-green-600/50 rounded-md">
                  <p className="text-green-400 text-sm">{displayNameMessage}</p>
                </div>
              )}

              {displayNameError && (
                <div className="p-3 bg-red-600/20 border border-red-600/50 rounded-md">
                  <p className="text-red-400 text-sm">{displayNameError}</p>
                </div>
              )}

              <Button 
                type="submit" 
                className="bg-purple-600 hover:bg-purple-700"
                disabled={displayNameLoading}
              >
                {displayNameLoading ? 'Сохранение...' : 'Сохранить имена'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Смена имени пользователя */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Смена имени пользователя</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUsernameChange} className="space-y-4">
              <div>
                <Label htmlFor="currentUsername" className="text-white">
                  Текущее имя пользователя
                </Label>
                <div className="mt-1 p-3 bg-gray-700 rounded-md">
                  <span className="text-gray-300">{userInfo.username}</span>
                </div>
              </div>

              <div>
                <Label htmlFor="newUsername" className="text-white">
                  Новое имя пользователя
                </Label>
                <Input
                  id="newUsername"
                  type="text"
                  value={usernameData.newUsername}
                  onChange={(e) => setUsernameData({ 
                    ...usernameData, 
                    newUsername: e.target.value 
                  })}
                  className="bg-gray-700 border-gray-600 text-white"
                  required
                  minLength={3}
                  placeholder="Введите новое имя пользователя"
                />
              </div>

              <div>
                <Label htmlFor="usernamePassword" className="text-white">
                  Подтвердите паролем
                </Label>
                <Input
                  id="usernamePassword"
                  type="password"
                  value={usernameData.password}
                  onChange={(e) => setUsernameData({ 
                    ...usernameData, 
                    password: e.target.value 
                  })}
                  className="bg-gray-700 border-gray-600 text-white"
                  required
                  placeholder="Введите текущий пароль"
                />
              </div>

              {usernameMessage && (
                <div className="p-3 bg-green-600/20 border border-green-600/50 rounded-md">
                  <p className="text-green-400 text-sm">{usernameMessage}</p>
                </div>
              )}

              {usernameError && (
                <div className="p-3 bg-red-600/20 border border-red-600/50 rounded-md">
                  <p className="text-red-400 text-sm">{usernameError}</p>
                </div>
              )}

              <Button 
                type="submit" 
                className="bg-blue-600 hover:bg-blue-700"
                disabled={usernameLoading}
              >
                {usernameLoading ? 'Изменение...' : 'Изменить имя пользователя'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Смена пароля */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Смена пароля</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div>
                <Label htmlFor="currentPassword" className="text-white">
                  Текущий пароль
                </Label>
                <Input
                  id="currentPassword"
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({ 
                    ...passwordData, 
                    currentPassword: e.target.value 
                  })}
                  className="bg-gray-700 border-gray-600 text-white"
                  required
                />
              </div>

              <div>
                <Label htmlFor="newPassword" className="text-white">
                  Новый пароль
                </Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ 
                    ...passwordData, 
                    newPassword: e.target.value 
                  })}
                  className="bg-gray-700 border-gray-600 text-white"
                  required
                  minLength={4}
                />
              </div>

              <div>
                <Label htmlFor="confirmPassword" className="text-white">
                  Подтвердите новый пароль
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ 
                    ...passwordData, 
                    confirmPassword: e.target.value 
                  })}
                  className="bg-gray-700 border-gray-600 text-white"
                  required
                  minLength={4}
                />
              </div>

              {message && (
                <div className="p-3 bg-green-600/20 border border-green-600/50 rounded-md">
                  <p className="text-green-400 text-sm">{message}</p>
                </div>
              )}

              {error && (
                <div className="p-3 bg-red-600/20 border border-red-600/50 rounded-md">
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}

              <Button 
                type="submit" 
                className="bg-red-600 hover:bg-red-700"
                disabled={loading}
              >
                {loading ? 'Изменение...' : 'Изменить пароль'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Информация об аккаунте */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Информация об аккаунте</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-white">Имя пользователя (для входа)</Label>
              <div className="mt-1 p-3 bg-gray-700 rounded-md">
                <span className="text-gray-300">{userInfo.username}</span>
              </div>
            </div>

            <div>
              <Label className="text-white">Отображаемое полное имя</Label>
              <div className="mt-1 p-3 bg-gray-700 rounded-md">
                <span className="text-gray-300">
                  {siteSettings.display_name || 'Не указано'}
                </span>
              </div>
            </div>

            <div>
              <Label className="text-white">Отображаемое короткое имя</Label>
              <div className="mt-1 p-3 bg-gray-700 rounded-md">
                <span className="text-gray-300">
                  {siteSettings.short_name || 'Не указано'}
                </span>
              </div>
            </div>

            <div>
              <Label className="text-white">Роль</Label>
              <div className="mt-1 p-3 bg-gray-700 rounded-md">
                <span className="text-gray-300">Администратор</span>
              </div>
            </div>

            <div>
              <Label className="text-white">Последний вход</Label>
              <div className="mt-1 p-3 bg-gray-700 rounded-md">
                <span className="text-gray-300">
                  {new Date().toLocaleString('ru-RU')}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Дополнительные настройки */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Дополнительные настройки</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-white">Тема интерфейса</Label>
              <div className="mt-1 p-3 bg-gray-700 rounded-md">
                <span className="text-gray-300">Темная (по умолчанию)</span>
              </div>
            </div>

            <div>
              <Label className="text-white">Язык интерфейса</Label>
              <div className="mt-1 p-3 bg-gray-700 rounded-md">
                <span className="text-gray-300">Русский</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-700">
            <h4 className="text-white font-medium mb-2">Безопасность</h4>
            <div className="space-y-2 text-sm text-gray-400">
              <p>• Регулярно меняйте пароль для обеспечения безопасности</p>
              <p>• Используйте сложные пароли с буквами, цифрами и символами</p>
              <p>• Не используйте один и тот же пароль для разных сервисов</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default UserSettings