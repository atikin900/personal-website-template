import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

const Dashboard = () => {
  const [stats, setStats] = useState({
    posts: 0,
    goals: 0,
    completedGoals: 0,
    totalViews: 1247,
    monthlyGrowth: 12.5
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

        setStats(prev => ({
          ...prev,
          posts: postsRes.data.length,
          goals: totalGoals,
          completedGoals
        }))
      } catch (error) {
        console.error('Error fetching stats:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Загрузка статистики...</div>
      </div>
    )
  }

  const completionRate = stats.goals > 0 ? Math.round((stats.completedGoals / stats.goals) * 100) : 0

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Добро пожаловать! 👋</h1>
          <p className="text-muted-foreground mt-2">
            Вот обзор вашего сайта на сегодня
          </p>
        </div>
        <Button 
          className="gradient-bg hover:opacity-90"
          onClick={() => {
            // Показать модальное окно с аналитикой или перейти на отдельную страницу
            alert('Функция аналитики будет добавлена в следующих обновлениях')
          }}
        >
          <span className="mr-2">📊</span>
          Подробная аналитика
        </Button>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Site Status */}
        <div className="metric-card">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-success/10 rounded-xl flex items-center justify-center">
              <span className="text-2xl">🟢</span>
            </div>
            <div className="text-right">
              <div className="metric-change positive">99.9%</div>
            </div>
          </div>
          <div className="metric-value">Онлайн</div>
          <div className="metric-label">Статус сайта</div>
        </div>

        {/* Blog Posts */}
        <div className="metric-card">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-info/10 rounded-xl flex items-center justify-center">
              <span className="text-2xl">📝</span>
            </div>
            <div className="text-right">
              <div className="metric-change positive">+{stats.posts > 5 ? '8' : '2'}</div>
            </div>
          </div>
          <div className="metric-value">{stats.posts}</div>
          <div className="metric-label">Записей в блоге</div>
        </div>

        {/* Goals Completion */}
        <div className="metric-card">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-warning/10 rounded-xl flex items-center justify-center">
              <span className="text-2xl">🎯</span>
            </div>
            <div className="text-right">
              <div className="metric-change positive">{completionRate}%</div>
            </div>
          </div>
          <div className="metric-value">{stats.completedGoals}/{stats.goals}</div>
          <div className="metric-label">Выполнено целей</div>
        </div>

        {/* Last Update */}
        <div className="metric-card">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-chart-4/10 rounded-xl flex items-center justify-center">
              <span className="text-2xl">🔄</span>
            </div>
            <div className="text-right">
              <div className="metric-change positive">Сегодня</div>
            </div>
          </div>
          <div className="metric-value">2 дня</div>
          <div className="metric-label">Последнее обновление</div>
        </div>
      </div>

      {/* Charts and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Performance Overview */}
        <div className="lg:col-span-2">
          <div className="chart-container">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-foreground">Обзор производительности</h3>
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => alert('Показ данных за сегодня')}
                >
                  Сегодня
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => alert('Показ данных за неделю')}
                >
                  Неделя
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="bg-primary text-primary-foreground"
                  onClick={() => alert('Показ данных за месяц (активно)')}
                >
                  Месяц
                </Button>
              </div>
            </div>
            
            {/* Simple Chart Placeholder */}
            <div className="h-64 bg-muted/20 rounded-lg flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-success/20 via-info/20 to-warning/20"></div>
              <div className="relative z-10 text-center">
                <div className="text-4xl font-bold text-foreground mb-2">
                  {stats.posts + stats.goals + stats.completedGoals}
                </div>
                <div className="text-muted-foreground">Общая активность</div>
              </div>
              
              {/* Chart visualization */}
              <div className="absolute bottom-0 left-0 right-0 h-32 flex items-end justify-around px-4">
                {[40, 65, 45, 80, 55, 90, 70].map((height, index) => (
                  <div
                    key={index}
                    className="bg-success/60 rounded-t-sm transition-all duration-500 hover:bg-success"
                    style={{ height: `${height}%`, width: '12%' }}
                  ></div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="chart-container">
          <h3 className="text-lg font-semibold text-foreground mb-6">Последняя активность</h3>
          <div className="space-y-4">
            <div className="activity-item">
              <div className="activity-avatar">📝</div>
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">Новая запись в блоге</p>
                <p className="text-xs text-muted-foreground">2 часа назад</p>
              </div>
            </div>
            
            <div className="activity-item">
              <div className="activity-avatar">🎯</div>
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">Цель выполнена</p>
                <p className="text-xs text-muted-foreground">5 часов назад</p>
              </div>
            </div>
            
            <div className="activity-item">
              <div className="activity-avatar">⚙️</div>
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">Настройки обновлены</p>
                <p className="text-xs text-muted-foreground">1 день назад</p>
              </div>
            </div>
            
            <div className="activity-item">
              <div className="activity-avatar">👤</div>
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">Профиль изменен</p>
                <p className="text-xs text-muted-foreground">2 дня назад</p>
              </div>
            </div>
          </div>
          
          <Button 
            variant="outline" 
            className="w-full mt-4"
            onClick={() => alert('Полный список активности будет добавлен в следующих обновлениях')}
          >
            Показать все
          </Button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="glass-effect hover:shadow-lg transition-all duration-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center">
              <span className="mr-3 text-2xl">📝</span>
              Управление контентом
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button asChild className="w-full justify-start">
              <Link to="/posts">
                <span className="mr-2">➕</span>
                Создать запись
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start">
              <Link to="/goals">
                <span className="mr-2">🎯</span>
                Добавить цель
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="glass-effect hover:shadow-lg transition-all duration-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center">
              <span className="mr-3 text-2xl">🔗</span>
              Быстрые ссылки
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button asChild variant="outline" className="w-full justify-start">
              <a href="http://localhost:5173" target="_blank" rel="noopener noreferrer">
                <span className="mr-2">🏠</span>
                Главная страница
              </a>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start">
              <a href="http://localhost:5173/blog" target="_blank" rel="noopener noreferrer">
                <span className="mr-2">📖</span>
                Блог
              </a>
            </Button>
          </CardContent>
        </Card>

        <Card className="glass-effect hover:shadow-lg transition-all duration-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center">
              <span className="mr-3 text-2xl">⚙️</span>
              Настройки
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button asChild variant="outline" className="w-full justify-start">
              <Link to="/settings">
                <span className="mr-2">🌐</span>
                Настройки сайта
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start">
              <Link to="/user-settings">
                <span className="mr-2">👤</span>
                Профиль
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Dashboard