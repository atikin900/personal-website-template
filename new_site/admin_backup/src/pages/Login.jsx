import { useState } from 'react'
import { login } from '../utils/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    console.log('Submitting with:', { username, password })

    try {
      const result = await login(username, password)
      
      if (result.success) {
        console.log('Login successful, token:', result.token)
        onLogin()
      } else {
        console.error('Login failed:', result.error)
        setError(result.error || 'Неверные учетные данные')
      }
    } catch (error) {
      console.error('Login error:', error)
      setError('Ошибка подключения к серверу')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
      <Card className="w-[400px] bg-gray-800 border-gray-700">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-white">
            Админ-панель (Backup)
          </CardTitle>
          <p className="text-gray-400">Резервная копия системы управления</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-white">Имя пользователя</Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => {
                  console.log('Username changed to:', e.target.value)
                  setUsername(e.target.value)
                }}
                required
                className="bg-gray-700 border-gray-600 text-white"
                placeholder="admin"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-white">Пароль</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => {
                  console.log('Password changed to:', e.target.value)
                  setPassword(e.target.value)
                }}
                required
                className="bg-gray-700 border-gray-600 text-white"
                placeholder="••••••••"
              />
            </div>
            {error && (
              <div className="text-red-400 text-sm text-center">{error}</div>
            )}
            <div className="flex gap-2">
              <Button 
                type="button" 
                variant="outline"
                onClick={() => {
                  setUsername('admin')
                  setPassword('admin')
                }}
                className="flex-1 border-gray-600 text-gray-300"
              >
                Заполнить
              </Button>
              <Button 
                type="submit" 
                className="flex-1 bg-red-600 hover:bg-red-700"
                disabled={loading}
              >
                {loading ? 'Вход...' : 'Войти'}
              </Button>
            </div>
          </form>
          <div className="mt-4 text-center text-sm text-gray-400">
            По умолчанию: admin / admin
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Login