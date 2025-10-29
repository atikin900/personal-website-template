import { useState, useEffect } from 'react'
import axios from 'axios'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import PostModal from '@/components/PostModal'
import { ConfirmModal } from '@/components/ui/confirm-modal'

const Posts = () => {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingPost, setEditingPost] = useState(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deletingPost, setDeletingPost] = useState(null)

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      // Сначала пробуем загрузить через публичный API для отображения
      try {
        const publicResponse = await axios.get('http://localhost:8000/api/public/posts')
        setPosts(publicResponse.data)
      } catch (publicError) {
        console.log('Public API failed, trying admin API')
      }

      // Если есть токен, загружаем через админский API
      const token = localStorage.getItem('admin_token')
      if (token) {
        const response = await axios.get('http://localhost:8000/api/admin/posts', {
          headers: { Authorization: `Bearer ${token}` }
        })
        setPosts(response.data)
      }
    } catch (error) {
      console.error('Error fetching posts:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async (formData) => {
    const token = localStorage.getItem('admin_token')
    const headers = { Authorization: `Bearer ${token}` }

    if (editingPost) {
      await axios.put(`http://localhost:8000/api/admin/posts/${editingPost.id}`, formData, { headers })
    } else {
      await axios.post('http://localhost:8000/api/admin/posts', formData, { headers })
    }

    fetchPosts()
    setShowModal(false)
    setEditingPost(null)
  }

  const handleEdit = (post) => {
    setEditingPost(post)
    setShowModal(true)
  }

  const handleCreate = () => {
    setEditingPost(null)
    setShowModal(true)
  }

  const handleDeleteClick = (post) => {
    setDeletingPost(post)
    setShowDeleteModal(true)
  }

  const handleDeleteConfirm = async () => {
    try {
      const token = localStorage.getItem('admin_token')
      await axios.delete(`http://localhost:8000/api/admin/posts/${deletingPost.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      fetchPosts()
    } catch (error) {
      console.error('Error deleting post:', error)
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
        <h1 className="text-3xl font-bold text-white">Записи блога</h1>
        {canEdit ? (
          <Button onClick={handleCreate} className="bg-red-600 hover:bg-red-700">
            Создать запись
          </Button>
        ) : (
          <div className="text-sm text-gray-400">
            Войдите для редактирования (admin/admin)
          </div>
        )}
      </div>

      <PostModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false)
          setEditingPost(null)
        }}
        onSave={handleSave}
        editingPost={editingPost}
      />

      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false)
          setDeletingPost(null)
        }}
        onConfirm={handleDeleteConfirm}
        title="Удаление записи"
        message={`Вы уверены, что хотите удалить запись "${deletingPost?.title}"? Это действие нельзя отменить.`}
        confirmText="Удалить"
        cancelText="Отмена"
      />

      <div className="grid gap-4">
        {posts.map((post) => (
          <Card key={post.id} className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-white mb-2">
                    <div dangerouslySetInnerHTML={{ __html: post.title }} />
                  </h3>
                  <p className="text-gray-400 mb-2">
                    <div dangerouslySetInnerHTML={{ __html: post.excerpt }} />
                  </p>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span>Slug: {post.slug}</span>
                    <span className={post.published ? 'text-green-400' : 'text-red-400'}>
                      {post.published ? 'Опубликовано' : 'Черновик'}
                    </span>
                  </div>
                </div>
                {canEdit && (
                  <div className="flex space-x-2">
                    <Button 
                      onClick={() => handleEdit(post)}
                      variant="outline"
                      size="sm"
                      className="border-gray-600 text-gray-300"
                    >
                      Редактировать
                    </Button>
                    <Button 
                      onClick={() => handleDeleteClick(post)}
                      variant="destructive"
                      size="sm"
                    >
                      Удалить
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {posts.length === 0 && (
        <div className="text-center text-gray-400 py-8">
          <p>Пока нет записей в блоге</p>
        </div>
      )}
    </div>
  )
}

export default Posts