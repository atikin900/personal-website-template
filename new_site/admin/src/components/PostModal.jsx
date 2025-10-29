import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Modal } from '@/components/ui/modal'
import { Tooltip } from '@/components/ui/tooltip'
import RichTextEditor from '@/components/ui/rich-text-editor'

const PostModal = ({ isOpen, onClose, onSave, editingPost = null }) => {
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    published: false,
    published_at: ''
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (editingPost) {
      // Преобразуем дату в формат date если она есть
      const publishedAt = editingPost.published_at 
        ? new Date(editingPost.published_at).toISOString().slice(0, 10)
        : ''
      
      setFormData({
        ...editingPost,
        published_at: publishedAt
      })
    } else {
      setFormData({
        title: '',
        slug: '',
        excerpt: '',
        content: '',
        published: false,
        published_at: ''
      })
    }
  }, [editingPost, isOpen])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      // Преобразуем дату в ISO формат для отправки на сервер (устанавливаем время на полдень)
      const dataToSave = {
        ...formData,
        published_at: formData.published_at ? new Date(formData.published_at + 'T12:00:00').toISOString() : null
      }
      
      await onSave(dataToSave)
      onClose()
    } catch (error) {
      console.error('Error saving post:', error)
    } finally {
      setLoading(false)
    }
  }

  const generateSlug = (title) => {
    // Удаляем HTML теги из заголовка для создания slug
    const cleanTitle = title.replace(/<[^>]*>/g, '')
    return cleanTitle
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim('-')
  }



  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingPost ? 'Редактировать запись' : 'Новая запись'}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Label htmlFor="title" className="text-white">Заголовок</Label>
            <Tooltip 
              content="Название статьи блога. Можно использовать форматирование для создания привлекательного заголовка."
              position="right"
            >
              <div className="w-4 h-4 bg-gray-600 hover:bg-gray-500 rounded-full flex items-center justify-center cursor-help transition-colors">
                <span className="text-white text-xs font-bold">?</span>
              </div>
            </Tooltip>
          </div>
          <RichTextEditor
            key={`title-${editingPost?.id || 'new'}`}
            value={formData.title}
            onChange={(value) => {
              setFormData({ 
                ...formData, 
                title: value,
                slug: formData.slug || generateSlug(value)
              })
            }}
            placeholder="Введите заголовок статьи"
            minHeight="80px"
            maxHeight="120px"
            className="mb-2"
          />
        </div>

        <div>
          <div className="flex items-center gap-2 mb-2">
            <Label htmlFor="slug" className="text-white">Slug (URL)</Label>
            <Tooltip 
              content="Уникальный идентификатор статьи для URL. Используйте только латинские буквы, цифры и дефисы. Например: my-first-post"
              position="right"
            >
              <div className="w-4 h-4 bg-gray-600 hover:bg-gray-500 rounded-full flex items-center justify-center cursor-help transition-colors">
                <span className="text-white text-xs font-bold">?</span>
              </div>
            </Tooltip>
          </div>
          <Input
            id="slug"
            value={formData.slug}
            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
            className="bg-gray-700 border-gray-600 text-white"
            placeholder="url-friendly-name"
            required
          />
        </div>

        <div>
          <div className="flex items-center gap-2 mb-2">
            <Label htmlFor="excerpt" className="text-white">Краткое описание</Label>
            <Tooltip 
              content="Краткое описание статьи с возможностью форматирования. Будет отображаться в списке статей блога."
              position="right"
            >
              <div className="w-4 h-4 bg-gray-600 hover:bg-gray-500 rounded-full flex items-center justify-center cursor-help transition-colors">
                <span className="text-white text-xs font-bold">?</span>
              </div>
            </Tooltip>
          </div>
          <RichTextEditor
            key={`excerpt-${editingPost?.id || 'new'}`}
            value={formData.excerpt}
            onChange={(value) => setFormData({ ...formData, excerpt: value })}
            placeholder="Краткое описание статьи"
            minHeight="120px"
            maxHeight="180px"
            className="mb-2"
          />
        </div>

        <div>
          <div className="flex items-center gap-2 mb-2">
            <Label htmlFor="content" className="text-white">Содержание</Label>
            <Tooltip 
              content="Полный текст статьи с богатыми возможностями форматирования: цвета, шрифты, списки, таблицы, изображения и многое другое."
              position="right"
            >
              <div className="w-4 h-4 bg-gray-600 hover:bg-gray-500 rounded-full flex items-center justify-center cursor-help transition-colors">
                <span className="text-white text-xs font-bold">?</span>
              </div>
            </Tooltip>
          </div>
          <RichTextEditor
            key={`content-${editingPost?.id || 'new'}`}
            value={formData.content}
            onChange={(value) => setFormData({ ...formData, content: value })}
            placeholder="Введите содержание статьи"
            minHeight="300px"
            maxHeight="500px"
            className="mb-2"
          />
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="published"
            checked={formData.published}
            onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
            className="rounded"
          />
          <Label htmlFor="published" className="text-white">
            Опубликовать статью
          </Label>
        </div>

        {formData.published && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Label htmlFor="published_at" className="text-white">Дата публикации</Label>
              <Tooltip 
                content="Установите дату публикации статьи. Если не указано, будет использована текущая дата при сохранении."
                position="right"
              >
                <div className="w-4 h-4 bg-gray-600 hover:bg-gray-500 rounded-full flex items-center justify-center cursor-help transition-colors">
                  <span className="text-white text-xs font-bold">?</span>
                </div>
              </Tooltip>
            </div>
            <Input
              id="published_at"
              type="date"
              value={formData.published_at}
              onChange={(e) => setFormData({ ...formData, published_at: e.target.value })}
              className="bg-gray-700 border-gray-600 text-white"
            />
            <p className="text-xs text-gray-400 mt-1">
              Если не указано, будет использована текущая дата
            </p>
          </div>
        )}

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
            {loading ? 'Сохранение...' : (editingPost ? 'Обновить' : 'Создать')}
          </Button>
        </div>
      </form>
    </Modal>
  )
}

export default PostModal