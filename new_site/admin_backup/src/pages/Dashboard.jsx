import { useState, useEffect } from 'react'
import axios from 'axios'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const Dashboard = () => {
  const [stats, setStats] = useState({
    posts: 0,
    goals: 0,
    completedGoals: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Получаем статистику из API
        const [postsRes, goalsRes] = await Promise.all([
          axios.get('http://localhost:8000/api/posts'),
          axios.get('http://localhost:8000/api/goals')
        ])

        const totalGoals = goalsRes.data.reduce((acc, category) => acc + category.goals.length, 0)
        const completedGoals = goalsRes.data.reduce((acc, category) => 
          acc + category.goals.filter(goal => goal.is_completed).length, 0
        )

        setStats({
          posts: postsRes.data.length,
          goals: totalGoals,
          completedGoals
        })
      } catch (error) {
        console.error('Error fetching stats:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (loading) {
    return <div className="text-white">Загрузка статистики...</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Панель управления (Backup)</h1>
        <p className="text-gray-400">Резервная копия админ-панели</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">
              Записи в блоге
            </CardTitle>
            <span className="text-2xl">📝</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.posts}</div>
            <p className="text-xs text-gray-400">
              Всего опубликованных записей
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">
              Цели
            </CardTitle>
            <span className="text-2xl">🎯</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.goals}</div>
            <p className="text-xs text-gray-400">
              Всего целей в списке
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">
              Выполнено целей
            </CardTitle>
            <span className="text-2xl">✅</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.completedGoals}</div>
            <p className="text-xs text-gray-400">
              {stats.goals > 0 ? Math.round((stats.completedGoals / stats.goals) * 100) : 0}% от общего количества
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="bg-yellow-900/20 border border-yellow-600/30 rounded-lg p-4">
        <h3 className="text-yellow-400 font-semibold mb-2">⚠️ Резервная копия</h3>
        <p className="text-yellow-200 text-sm">
          Это резервная копия оригинальной админ панели. Для возврата к этой версии следуйте инструкциям в README.md
        </p>
      </div>
    </div>
  )
}

export default Dashboard