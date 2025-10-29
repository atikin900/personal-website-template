import { useState, useEffect } from 'react'
import axios from 'axios'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import GoalModal from '@/components/GoalModal'
import { ConfirmModal } from '@/components/ui/confirm-modal'

// Функция для очистки текста от HTML entities
const cleanDisplayText = (text) => {
  if (!text || typeof text !== 'string') return text
  
  return text
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
}

const Goals = () => {
  const [categories, setCategories] = useState([])
  const [categoriesList, setCategoriesList] = useState([]) // Плоский список категорий для модального окна
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingGoal, setEditingGoal] = useState(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deletingGoal, setDeletingGoal] = useState(null)

  useEffect(() => {
    fetchGoals()
    fetchCategories()
  }, [])

  const fetchGoals = async () => {
    try {
      // Сначала пробуем загрузить через публичный API для отображения
      try {
        const publicResponse = await axios.get('http://localhost:8000/api/public/goals')
        setCategories(publicResponse.data)
      } catch (publicError) {
        console.log('Public API failed, trying admin API')
      }

      // Если есть токен, загружаем через админский API
      const token = localStorage.getItem('admin_token')
      if (token) {
        const response = await axios.get('http://localhost:8000/api/admin/goals', {
          headers: { Authorization: `Bearer ${token}` }
        })
        setCategories(response.data)
      }
    } catch (error) {
      console.error('Error fetching goals:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem('admin_token')
      if (token) {
        const response = await axios.get('http://localhost:8000/api/admin/categories', {
          headers: { Authorization: `Bearer ${token}` }
        })
        setCategoriesList(response.data)
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  const handleSave = async (formData) => {
    const token = localStorage.getItem('admin_token')
    const headers = { Authorization: `Bearer ${token}` }

    if (editingGoal) {
      await axios.put(`http://localhost:8000/api/admin/goals/${editingGoal.id}`, formData, { headers })
    } else {
      await axios.post('http://localhost:8000/api/admin/goals', formData, { headers })
    }

    fetchGoals()
    setShowModal(false)
    setEditingGoal(null)
  }

  const handleEditGoal = (goal, categoryId) => {
    // Добавляем category_id к цели если его нет
    const goalWithCategory = {
      ...goal,
      category_id: goal.category_id || categoryId
    }
    setEditingGoal(goalWithCategory)
    setShowModal(true)
  }

  const handleCreate = () => {
    setEditingGoal(null)
    setShowModal(true)
  }

  const handleDeleteClick = (goal) => {
    setDeletingGoal(goal)
    setShowDeleteModal(true)
  }

  const handleDeleteConfirm = async () => {
    try {
      const token = localStorage.getItem('admin_token')
      await axios.delete(`http://localhost:8000/api/admin/goals/${deletingGoal.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      fetchGoals()
    } catch (error) {
      console.error('Error deleting goal:', error)
    }
  }

  const toggleGoalCompletion = async (goal) => {
    try {
      const token = localStorage.getItem('admin_token')
      const updatedGoal = {
        ...goal,
        is_completed: !goal.is_completed,
        completed_date: !goal.is_completed ? new Date().toISOString().split('T')[0] : ''
      }
      
      await axios.put(`http://localhost:8000/api/admin/goals/${goal.id}`, updatedGoal, {
        headers: { Authorization: `Bearer ${token}` }
      })
      fetchGoals()
    } catch (error) {
      console.error('Error updating goal:', error)
    }
  }

  if (loading) {
    return <div className="text-white">Загрузка...</div>
  }

  const token = localStorage.getItem('admin_token')
  const canEdit = !!token

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">Управление целями</h1>
        {canEdit ? (
          <Button onClick={handleCreate} className="bg-red-600 hover:bg-red-700">
            Добавить цель
          </Button>
        ) : (
          <div className="text-sm text-gray-400">
            Войдите для редактирования (admin/admin)
          </div>
        )}
      </div>

      <GoalModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false)
          setEditingGoal(null)
        }}
        onSave={handleSave}
        editingGoal={editingGoal}
        categories={categoriesList}
      />

      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false)
          setDeletingGoal(null)
        }}
        onConfirm={handleDeleteConfirm}
        title="Удаление цели"
        message={`Вы уверены, что хотите удалить цель "${deletingGoal?.text}"? Это действие нельзя отменить.`}
        confirmText="Удалить"
        cancelText="Отмена"
      />

      <div className="space-y-6">
        {categories.map((category) => (
          <Card key={category.id} className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center justify-between">
                <span>{category.name}</span>
                <span className="text-sm text-gray-400">
                  {category.stats.completed}/{category.stats.total} ({category.stats.percentage}%)
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {category.goals.length === 0 ? (
                <p className="text-gray-400 italic">Нет целей в этой категории</p>
              ) : (
                <div className="space-y-3">
                  {category.goals.map((goal) => (
                    <div key={goal.id} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={canEdit ? () => toggleGoalCompletion(goal) : undefined}
                          className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                            goal.is_completed 
                              ? 'bg-green-600 border-green-600 text-white' 
                              : 'border-gray-400'
                          } ${canEdit ? 'cursor-pointer' : 'cursor-default'}`}
                          disabled={!canEdit}
                        >
                          {goal.is_completed && '✓'}
                        </button>
                        <span className={`text-white ${goal.is_completed ? 'line-through opacity-70' : ''}`}>
                          {cleanDisplayText(goal.text)}
                        </span>
                        {goal.completed_date && (
                          <span className="text-sm text-green-400">
                            (выполнено: {goal.completed_date})
                          </span>
                        )}
                      </div>
                      {canEdit && (
                        <div className="flex space-x-2">
                          <Button 
                            onClick={() => handleEditGoal(goal, category.id)}
                            variant="outline"
                            size="sm"
                            className="border-gray-600 text-gray-300"
                          >
                            Редактировать
                          </Button>
                          <Button 
                            onClick={() => handleDeleteClick(goal)}
                            variant="destructive"
                            size="sm"
                          >
                            Удалить
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default Goals