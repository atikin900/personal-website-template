import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Modal } from '@/components/ui/modal'
import { Tooltip } from '@/components/ui/tooltip'
import RichTextEditor from '@/components/ui/rich-text-editor'



const GoalModal = ({ isOpen, onClose, onSave, editingGoal = null, categories = [] }) => {
  const [formData, setFormData] = useState({
    text: '',
    category_id: '',
    is_completed: false,
    completed_date: '',
    order: 0
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (editingGoal) {
      setFormData(editingGoal)
    } else {
      setFormData({
        text: '',
        category_id: '',
        is_completed: false,
        completed_date: '',
        order: 0
      })
    }
  }, [editingGoal, isOpen])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      await onSave(formData)
      onClose()
    } catch (error) {
      console.error('Error saving goal:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingGoal ? 'Редактировать цель' : 'Новая цель'}
      size="md"
    >
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Label htmlFor="category" className="text-white">Категория</Label>
            <Tooltip 
              content="Выберите категорию для группировки цели. Цели одной категории будут отображаться вместе на сайте."
              position="right"
            >
              <div className="w-4 h-4 bg-gray-600 hover:bg-gray-500 rounded-full flex items-center justify-center cursor-help transition-colors">
                <span className="text-white text-xs font-bold">?</span>
              </div>
            </Tooltip>
          </div>
          <select
            id="category"
            value={formData.category_id}
            onChange={(e) => setFormData({ ...formData, category_id: parseInt(e.target.value) })}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-md"
            required
          >
            <option value="">Выберите категорию</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-2">
            <Label htmlFor="text" className="text-white">Текст цели</Label>
            <Tooltip 
              content="Описание вашей цели с возможностью форматирования. Используйте выделение, цвета и списки для лучшего представления."
              position="right"
            >
              <div className="w-4 h-4 bg-gray-600 hover:bg-gray-500 rounded-full flex items-center justify-center cursor-help transition-colors">
                <span className="text-white text-xs font-bold">?</span>
              </div>
            </Tooltip>
          </div>
          <RichTextEditor
            key={`text-${editingGoal?.id || 'new'}`}
            value={formData.text}
            onChange={(value) => setFormData({ ...formData, text: value })}
            placeholder="Введите описание цели"
            minHeight="150px"
            maxHeight="250px"
            className="mb-2"
          />
        </div>

        <div>
          <div className="flex items-center gap-2 mb-2">
            <Label htmlFor="order" className="text-white">Порядок</Label>
            <Tooltip 
              content="Порядок отображения цели в списке. Цели с меньшим номером будут показаны выше. По умолчанию: 0."
              position="right"
            >
              <div className="w-4 h-4 bg-gray-600 hover:bg-gray-500 rounded-full flex items-center justify-center cursor-help transition-colors">
                <span className="text-white text-xs font-bold">?</span>
              </div>
            </Tooltip>
          </div>
          <Input
            id="order"
            type="number"
            value={formData.order}
            onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
            className="bg-gray-700 border-gray-600 text-white"
            placeholder="0"
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="completed"
              checked={formData.is_completed}
              onChange={(e) => setFormData({ 
                ...formData, 
                is_completed: e.target.checked,
                completed_date: e.target.checked && !formData.completed_date 
                  ? new Date().toISOString().split('T')[0] 
                  : formData.completed_date
              })}
              className="rounded"
            />
            <Label htmlFor="completed" className="text-white">
              Цель выполнена
            </Label>
          </div>

          {formData.is_completed && (
            <div>
              <Label htmlFor="completed_date" className="text-white">
                Дата выполнения
              </Label>
              <Input
                id="completed_date"
                type="date"
                value={formData.completed_date}
                onChange={(e) => setFormData({ ...formData, completed_date: e.target.value })}
                className="bg-gray-700 border-gray-600 text-white mt-1"
              />
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-700">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onClose}
            className="border-gray-600 text-gray-300"
            disabled={loading}
          >
            Отмена
          </Button>
          <Button 
            type="submit" 
            className="bg-green-600 hover:bg-green-700"
            disabled={loading}
          >
            {loading ? 'Сохранение...' : (editingGoal ? 'Обновить' : 'Создать')}
          </Button>
        </div>
      </form>
    </Modal>
  )
}

export default GoalModal