import React, { useState } from 'react'
import { Button } from './button'
import { Card, CardContent, CardHeader, CardTitle } from './card'
import { Label } from './label'
import axios from 'axios'

const SeedDataModal = ({ isOpen, onClose, onSuccess }) => {
  const [options, setOptions] = useState({
    siteSettings: true,
    socialNetworks: true,
    goalCategories: true,
    goals: true,
    blogPosts: true
  })
  const [loading, setLoading] = useState(false)

  const handleOptionChange = (option) => {
    setOptions(prev => ({
      ...prev,
      [option]: !prev[option]
    }))
  }

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const response = await axios.post('http://localhost:8000/api/admin/seed-data', options)
      alert('Выбранные демо данные успешно созданы!')
      onSuccess()
      onClose()
    } catch (error) {
      console.error('Error seeding data:', error)
      alert('Ошибка при создании демо данных: ' + (error.response?.data?.detail || error.message))
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <Card className="w-full max-w-md bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Заполнить демо данными</CardTitle>
          <p className="text-gray-400 text-sm">Выберите, какие данные создать:</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="siteSettings"
                checked={options.siteSettings}
                onChange={() => handleOptionChange('siteSettings')}
                className="rounded"
              />
              <Label htmlFor="siteSettings" className="text-white text-sm">
                Настройки сайта (заголовки, описания, цвета)
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="socialNetworks"
                checked={options.socialNetworks}
                onChange={() => handleOptionChange('socialNetworks')}
                className="rounded"
              />
              <Label htmlFor="socialNetworks" className="text-white text-sm">
                Социальные сети (GitHub, Telegram)
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="goalCategories"
                checked={options.goalCategories}
                onChange={() => handleOptionChange('goalCategories')}
                className="rounded"
              />
              <Label htmlFor="goalCategories" className="text-white text-sm">
                Категории целей (Образование, Карьера, Личное развитие)
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="goals"
                checked={options.goals}
                onChange={() => handleOptionChange('goals')}
                className="rounded"
              />
              <Label htmlFor="goals" className="text-white text-sm">
                Демо цели (6 целей с разным статусом)
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="blogPosts"
                checked={options.blogPosts}
                onChange={() => handleOptionChange('blogPosts')}
                className="rounded"
              />
              <Label htmlFor="blogPosts" className="text-white text-sm">
                Записи блога (2 демо статьи)
              </Label>
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              onClick={onClose}
              variant="outline"
              className="flex-1 border-gray-600 text-gray-300"
              disabled={loading}
            >
              Отмена
            </Button>
            <Button
              onClick={handleSubmit}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
              disabled={loading || !Object.values(options).some(Boolean)}
            >
              {loading ? 'Создание...' : 'Создать'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export { SeedDataModal }