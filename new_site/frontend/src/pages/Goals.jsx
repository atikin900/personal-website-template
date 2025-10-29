import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { getSocialIcon } from '../utils/icons.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'


const Goals = () => {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [siteData, setSiteData] = useState(null)
  const [socialNetworks, setSocialNetworks] = useState([])





  useEffect(() => {
    const fetchData = async () => {
      try {
        const [goalsResponse, siteResponse, socialResponse] = await Promise.all([
          axios.get('http://localhost:8000/api/goals'),
          axios.get('http://localhost:8000/api/site'),
          axios.get('http://localhost:8000/api/social-networks')
        ])
        setCategories(goalsResponse.data)
        setSiteData(siteResponse.data)
        setSocialNetworks(socialResponse.data)
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return <div>Загрузка...</div>
  }

  const calculateOverallProgress = () => {
    let totalGoals = 0
    let completedGoals = 0
    
    categories.forEach(category => {
      totalGoals += category.stats.total
      completedGoals += category.stats.completed
    })
    
    return {
      total: totalGoals,
      completed: completedGoals,
      percentage: totalGoals > 0 ? Math.round((completedGoals / totalGoals) * 100) : 0
    }
  }

  const overallProgress = calculateOverallProgress()

  return (
    <React.Fragment>
      <main id="top">
        <div className="splash">
          <h1>Мои цели</h1>
          <h2>Список целей и достижений</h2>
        </div>

        <div className="container mx-auto px-4">
          <Card className="max-w-4xl mx-auto mb-12 bg-gradient-to-br from-slate-900/90 to-slate-800/90 border-slate-700 backdrop-blur-sm">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold text-white mb-4">
                Что такое список целей?
              </CardTitle>
              <Badge variant="outline" className="mx-auto mb-4 border-primary text-primary">
                Impossible List
              </Badge>
            </CardHeader>
            <CardContent className="space-y-4 text-slate-200">
              <p className="leading-relaxed">
                Возможно, вы задаетесь вопросом, что такое список целей и почему он здесь находится. В отличие от обычного списка желаний, список целей — это постоянно развивающийся документ, который со временем растёт и эволюционирует. Вы можете вычеркивать из него выполненные пункты, но при этом постоянно добавлять новые. Именно поэтому невозможно завершить такой список полностью — отсюда и пошло его название.
              </p>
              
              <p className="leading-relaxed">
                Я решил вести свой список целей публично по двум причинам: во-первых, это мотивирует меня регулярно его обновлять, а во-вторых, это может вдохновить других людей на создание собственных списков целей и достижений.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="section">
          <div className="container">
            <div id="goals-container">
              {categories.length === 0 ? (
                <div className="no-goals">
                  <p>Целей пока нет. Используйте панель администратора для добавления.</p>
                </div>
              ) : (
                <React.Fragment>
                  <div className="mb-8">
                    <Card className="max-w-md mx-auto bg-gradient-to-br from-primary/20 to-primary-dark/20 border-primary/30 backdrop-blur-sm">
                      <CardHeader className="text-center">
                        <CardTitle className="text-white">Общий прогресс</CardTitle>
                      </CardHeader>
                      <CardContent className="flex items-center justify-center gap-6">
                        <div className="relative w-24 h-24">
                          <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 36 36">
                            <path
                              className="text-slate-700"
                              stroke="currentColor"
                              strokeWidth="3"
                              fill="none"
                              d="M18 2.0845
                                a 15.9155 15.9155 0 0 1 0 31.831
                                a 15.9155 15.9155 0 0 1 0 -31.831"
                            />
                            <path
                              className="text-primary"
                              stroke="currentColor"
                              strokeWidth="3"
                              strokeLinecap="round"
                              fill="none"
                              strokeDasharray={`${overallProgress.percentage}, 100`}
                              d="M18 2.0845
                                a 15.9155 15.9155 0 0 1 0 31.831
                                a 15.9155 15.9155 0 0 1 0 -31.831"
                            />
                          </svg>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-xl font-bold text-white">{overallProgress.percentage}%</span>
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline" className="border-primary text-primary">
                              {overallProgress.completed}
                            </Badge>
                            <span className="text-slate-400">из</span>
                            <Badge variant="secondary">
                              {overallProgress.total}
                            </Badge>
                          </div>
                          <p className="text-sm text-slate-400">целей выполнено</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {categories.map((category) => (
                    <Card key={category.id} className="mb-8 bg-gradient-to-br from-slate-900/50 to-slate-800/50 border-slate-700 backdrop-blur-sm">
                      <CardHeader>
                        <div className="flex justify-between items-center flex-wrap gap-4">
                          <div>
                            <CardTitle className="text-xl text-white flex items-center gap-3">
                              {category.name}
                              <Badge variant="secondary" className="bg-primary/20 text-primary border-primary/30">
                                {category.stats.completed}/{category.stats.total}
                              </Badge>
                            </CardTitle>
                            <CardDescription className="text-slate-400 mt-2">
                              Прогресс: {category.stats.percentage}%
                            </CardDescription>
                          </div>
                          <div className="w-32">
                            <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-gradient-to-r from-primary to-primary-light transition-all duration-1000 ease-out"
                                style={{width: `${category.stats.percentage}%`}}
                              ></div>
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                          {category.goals.map(goal => (
                            <Card key={goal.id} className={`transition-all duration-300 hover:scale-105 ${
                              goal.is_completed 
                                ? 'bg-gradient-to-br from-green-900/30 to-green-800/30 border-green-600/50' 
                                : 'bg-gradient-to-br from-slate-800/50 to-slate-700/50 border-slate-600 hover:border-primary/50'
                            }`}>
                              <CardContent className="p-4">
                                <div className="flex items-start gap-3">
                                  <div className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                                    goal.is_completed 
                                      ? 'bg-green-500 border-green-500' 
                                      : 'border-slate-400 hover:border-primary'
                                  }`}>
                                    {goal.is_completed && (
                                      <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                                      </svg>
                                    )}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className={`text-sm font-medium leading-relaxed ${
                                      goal.is_completed ? 'text-green-200 line-through' : 'text-slate-200'
                                    }`}>
                                      {goal.text}
                                    </p>
                                    <p className="text-xs text-slate-400 mt-2">
                                      {goal.completed_date || new Date(goal.created_at).toLocaleDateString('ru-RU')}
                                    </p>
                                    {goal.is_completed && (
                                      <Badge variant="outline" className="mt-2 text-xs border-green-500/50 text-green-400">
                                        Выполнено
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </React.Fragment>
              )}
            </div>
          </div>
        </div>
      </main>

      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <h4>Контакты</h4>
              <div className="contact-info">
                {siteData?.email && siteData.email.trim() !== '' && (
                  <a href={`mailto:${siteData.email}`} className="contact-item">
                    {getSocialIcon('email')}
                    {siteData.email}
                  </a>
                )}
                {socialNetworks
                  .filter(social => social.show_in_footer)
                  .sort((a, b) => a.order - b.order)
                  .map(social => (
                    <a 
                      key={social.id} 
                      href={social.url} 
                      target="_blank" 
                      rel="noopener" 
                      className="contact-item"
                    >
                      {getSocialIcon(social.icon_name)}
                      {social.name}
                    </a>
                  ))
                }
              </div>
            </div>
            <div className="footer-section">
              <h4>Навигация</h4>
              <div className="footer-links">
                <a href="/">Главная</a>
                <a href="/blog">Блог</a>
                <a href="/goals">Цели</a>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2025 Иванцов Никита. Все права защищены.</p>
          </div>
        </div>
      </footer>
    </React.Fragment>
  )
}

export default Goals