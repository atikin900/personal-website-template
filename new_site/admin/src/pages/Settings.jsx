import { useState, useEffect } from 'react'
import axios from 'axios'
import { getToken } from '../utils/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ImageUpload } from '@/components/ui/image-upload'
import { Tooltip } from '@/components/ui/tooltip'
import { ColorPicker } from '@/components/ui/color-picker'
import { IconSelector } from '@/components/ui/icon-selector'
import { SeedDataModal } from '@/components/ui/seed-data-modal'
import { ConfirmModal } from '@/components/ui/confirm-modal'
import { migratePostsHTML } from '@/utils/htmlCleaner'

const Settings = () => {
  const [settings, setSettings] = useState({
    site_title: '',
    meta_description: '',
    hero_title: '',
    hero_subtitle: '',
    about_text: '',
    github_url: '',
    telegram_url: '',
    email: '',
    profile_image: '',

    primary_color: '#3b82f6',
    secondary_color: '#1e40af',
    accent_color: '#06b6d4',
    text_color: '#ffffff',
    background_color: '#0f172a'
  })
  const [socialNetworks, setSocialNetworks] = useState([])
  const [showSocialForm, setShowSocialForm] = useState(false)
  const [editingSocial, setEditingSocial] = useState(null)
  const [socialFormData, setSocialFormData] = useState({
    name: '',
    url: '',
    icon_name: '',
    show_in_footer: true,
    show_in_header: false,
    order: 0
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [showSeedModal, setShowSeedModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deletingSocial, setDeletingSocial] = useState(null)
  const [migrating, setMigrating] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [settingsResponse, socialResponse] = await Promise.all([
        axios.get('http://localhost:8000/api/site'),
        axios.get('http://localhost:8000/api/public/social-networks')
      ])
      setSettings(settingsResponse.data)
      setSocialNetworks(socialResponse.data)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    
    try {
      await axios.put('http://localhost:8000/api/admin/site', settings)
      alert('Настройки сохранены!')
    } catch (error) {
      console.error('Error saving settings:', error)
      alert('Ошибка при сохранении настроек')
    } finally {
      setSaving(false)
    }
  }

  const handleChange = (field, value) => {
    setSettings(prev => ({ ...prev, [field]: value }))
  }

  const handleImageUpload = async (file) => {
    const token = getToken()
    console.log('Token for image upload:', token ? 'Token exists' : 'No token')
    
    if (!token) {
      alert('Для загрузки изображения необходимо войти в систему (admin/admin)')
      return
    }

    setUploadingImage(true)
    
    try {
      const formData = new FormData()
      formData.append('file', file)
      
      const response = await axios.post(
        'http://localhost:8000/api/admin/upload-profile-image',
        formData
      )
      
      // Обновляем настройки с новым путем к изображению
      setSettings(prev => ({ 
        ...prev, 
        profile_image: response.data.profile_image 
      }))
      
      alert('Изображение профиля успешно загружено!')
    } catch (error) {
      console.error('Error uploading image:', error)
      alert('Ошибка при загрузке изображения: ' + (error.response?.data?.detail || error.message))
    } finally {
      setUploadingImage(false)
    }
  }

  const handleSocialSubmit = async (e) => {
    e.preventDefault()
    try {

      if (editingSocial) {
        await axios.put(`http://localhost:8000/api/admin/social-networks/${editingSocial.id}`, socialFormData)
      } else {
        await axios.post('http://localhost:8000/api/admin/social-networks', socialFormData)
      }

      fetchData()
      setShowSocialForm(false)
      setEditingSocial(null)
      setSocialFormData({ name: '', url: '', icon_name: '', show_in_footer: true, show_in_header: false, order: 0 })
      alert('Соцсеть сохранена!')
    } catch (error) {
      console.error('Error saving social network:', error)
      alert('Ошибка при сохранении соцсети')
    }
  }

  const handleEditSocial = (social) => {
    setEditingSocial(social)
    setSocialFormData(social)
    setShowSocialForm(true)
  }

  const handleDeleteClick = (social) => {
    setDeletingSocial(social)
    setShowDeleteModal(true)
  }

  const handleDeleteConfirm = async () => {
    try {
      await axios.delete(`http://localhost:8000/api/admin/social-networks/${deletingSocial.id}`)
      fetchData()
      alert('Соцсеть удалена!')
    } catch (error) {
      console.error('Error deleting social network:', error)
      alert('Ошибка при удалении соцсети')
    }
  }

  const handleMigrateHTML = async () => {
    if (!confirm('Это действие обновит все записи блога, заменив устаревшие HTML теги на современные. Продолжить?')) {
      return
    }
    
    setMigrating(true)
    try {
      await migratePostsHTML()
      alert('Миграция HTML успешно завершена!')
    } catch (error) {
      console.error('Ошибка миграции:', error)
      alert('Ошибка при миграции HTML')
    } finally {
      setMigrating(false)
    }
  }

  if (loading) {
    return <div className="text-white">Загрузка...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Настройки сайта</h1>
          <p className="text-gray-400">Управление основными настройками сайта</p>
        </div>
        <div className="flex space-x-2">
          <Button 
            onClick={handleMigrateHTML}
            disabled={migrating}
            className="bg-orange-600 hover:bg-orange-700"
          >
            {migrating ? 'Миграция...' : 'Исправить HTML теги'}
          </Button>
          <Button 
            onClick={() => setShowSeedModal(true)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Заполнить демо данными
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Основные настройки</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Label htmlFor="site_title" className="text-white">Заголовок сайта</Label>
                <Tooltip 
                  content="Основной заголовок сайта, который отображается в браузере и поисковых системах. Рекомендуется до 60 символов."
                  position="right"
                >
                  <div className="w-4 h-4 bg-gray-600 hover:bg-gray-500 rounded-full flex items-center justify-center cursor-help transition-colors">
                    <span className="text-white text-xs font-bold">?</span>
                  </div>
                </Tooltip>
              </div>
              <Input
                id="site_title"
                value={settings.site_title}
                onChange={(e) => handleChange('site_title', e.target.value)}
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Label htmlFor="meta_description" className="text-white">Мета-описание</Label>
                <Tooltip 
                  content="Краткое описание сайта для поисковых систем. Отображается в результатах поиска. Рекомендуется 150-160 символов."
                  position="right"
                >
                  <div className="w-4 h-4 bg-gray-600 hover:bg-gray-500 rounded-full flex items-center justify-center cursor-help transition-colors">
                    <span className="text-white text-xs font-bold">?</span>
                  </div>
                </Tooltip>
              </div>
              <Input
                id="meta_description"
                value={settings.meta_description}
                onChange={(e) => handleChange('meta_description', e.target.value)}
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Главная страница</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Label htmlFor="hero_title" className="text-white">Заголовок героя</Label>
                <Tooltip 
                  content="Главный заголовок на первом экране сайта. Должен быть ярким и привлекающим внимание."
                  position="right"
                >
                  <div className="w-4 h-4 bg-gray-600 hover:bg-gray-500 rounded-full flex items-center justify-center cursor-help transition-colors">
                    <span className="text-white text-xs font-bold">?</span>
                  </div>
                </Tooltip>
              </div>
              <Input
                id="hero_title"
                value={settings.hero_title}
                onChange={(e) => handleChange('hero_title', e.target.value)}
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Label htmlFor="hero_subtitle" className="text-white">Подзаголовок героя</Label>
                <Tooltip 
                  content="Дополнительный текст под главным заголовком. Поясняет кто вы и чем занимаетесь."
                  position="right"
                >
                  <div className="w-4 h-4 bg-gray-600 hover:bg-gray-500 rounded-full flex items-center justify-center cursor-help transition-colors">
                    <span className="text-white text-xs font-bold">?</span>
                  </div>
                </Tooltip>
              </div>
              <Input
                id="hero_subtitle"
                value={settings.hero_subtitle}
                onChange={(e) => handleChange('hero_subtitle', e.target.value)}
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Label htmlFor="about_text" className="text-white">Текст "О себе"</Label>
                <Tooltip 
                  content="Подробная информация о вас. Поддерживает HTML разметку. Используйте переносы строк для создания абзацев."
                  position="right"
                >
                  <div className="w-4 h-4 bg-gray-600 hover:bg-gray-500 rounded-full flex items-center justify-center cursor-help transition-colors">
                    <span className="text-white text-xs font-bold">?</span>
                  </div>
                </Tooltip>
              </div>
              <textarea
                id="about_text"
                value={settings.about_text}
                onChange={(e) => handleChange('about_text', e.target.value)}
                className="w-full h-32 px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-md"
                placeholder="HTML разметка поддерживается"
              />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Label className="text-white">Изображение профиля</Label>
                <Tooltip 
                  content="Ваше фото или аватар. Рекомендуется квадратное изображение размером не менее 300x300 пикселей."
                  position="right"
                >
                  <div className="w-4 h-4 bg-gray-600 hover:bg-gray-500 rounded-full flex items-center justify-center cursor-help transition-colors">
                    <span className="text-white text-xs font-bold">?</span>
                  </div>
                </Tooltip>
              </div>
              <ImageUpload
                currentImage={settings.profile_image}
                onImageUpload={handleImageUpload}
                loading={uploadingImage}
              />
            </div>
          </CardContent>
        </Card>



        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Цветовая схема</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ColorPicker
              label="Основной цвет"
              value={settings.primary_color}
              onChange={(value) => handleChange('primary_color', value)}
              tooltip="Основной цвет сайта, используется для кнопок и акцентов"
            />
            <ColorPicker
              label="Вторичный цвет"
              value={settings.secondary_color}
              onChange={(value) => handleChange('secondary_color', value)}
              tooltip="Вторичный цвет для дополнительных элементов"
            />
            <ColorPicker
              label="Акцентный цвет"
              value={settings.accent_color}
              onChange={(value) => handleChange('accent_color', value)}
              tooltip="Цвет для выделения важных элементов"
            />
            <ColorPicker
              label="Цвет текста"
              value={settings.text_color}
              onChange={(value) => handleChange('text_color', value)}
              tooltip="Основной цвет текста на сайте"
            />
            <ColorPicker
              label="Цвет фона"
              value={settings.background_color}
              onChange={(value) => handleChange('background_color', value)}
              tooltip="Основной цвет фона сайта"
            />
          </CardContent>
        </Card>

      </form>

      {/* Управление соцсетями */}
      <div className="space-y-6 mt-8">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white">Социальные сети</h2>
          <Button onClick={() => setShowSocialForm(true)} className="bg-red-600 hover:bg-red-700">
            Добавить соцсеть
          </Button>
        </div>

        {showSocialForm && (
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">
                {editingSocial ? 'Редактировать соцсеть' : 'Новая соцсеть'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSocialSubmit} className="space-y-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Label htmlFor="social_name" className="text-white">Название</Label>
                    <Tooltip 
                      content="Название социальной сети (например, GitHub, Telegram)"
                      position="right"
                    >
                      <div className="w-4 h-4 bg-gray-600 hover:bg-gray-500 rounded-full flex items-center justify-center cursor-help transition-colors">
                        <span className="text-white text-xs font-bold">?</span>
                      </div>
                    </Tooltip>
                  </div>
                  <Input
                    id="social_name"
                    value={socialFormData.name}
                    onChange={(e) => setSocialFormData({ ...socialFormData, name: e.target.value })}
                    className="bg-gray-700 border-gray-600 text-white"
                    required
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Label htmlFor="social_url" className="text-white">Ссылка</Label>
                    <Tooltip 
                      content="Полная ссылка на ваш профиль в социальной сети"
                      position="right"
                    >
                      <div className="w-4 h-4 bg-gray-600 hover:bg-gray-500 rounded-full flex items-center justify-center cursor-help transition-colors">
                        <span className="text-white text-xs font-bold">?</span>
                      </div>
                    </Tooltip>
                  </div>
                  <Input
                    id="social_url"
                    type="url"
                    value={socialFormData.url}
                    onChange={(e) => setSocialFormData({ ...socialFormData, url: e.target.value })}
                    className="bg-gray-700 border-gray-600 text-white"
                    required
                  />
                </div>
                <IconSelector
                  label="Иконка"
                  value={socialFormData.icon_name}
                  onChange={(value) => setSocialFormData({ ...socialFormData, icon_name: value })}
                />
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Label htmlFor="social_order" className="text-white">Порядок</Label>
                    <Tooltip 
                      content="Порядок отображения в списке (меньше = выше)"
                      position="right"
                    >
                      <div className="w-4 h-4 bg-gray-600 hover:bg-gray-500 rounded-full flex items-center justify-center cursor-help transition-colors">
                        <span className="text-white text-xs font-bold">?</span>
                      </div>
                    </Tooltip>
                  </div>
                  <Input
                    id="social_order"
                    type="number"
                    value={socialFormData.order}
                    onChange={(e) => setSocialFormData({ ...socialFormData, order: parseInt(e.target.value) })}
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="show_in_footer"
                      checked={socialFormData.show_in_footer}
                      onChange={(e) => setSocialFormData({ ...socialFormData, show_in_footer: e.target.checked })}
                    />
                    <Label htmlFor="show_in_footer" className="text-white">Показывать в футере (с названием)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="show_in_header"
                      checked={socialFormData.show_in_header}
                      onChange={(e) => setSocialFormData({ ...socialFormData, show_in_header: e.target.checked })}
                    />
                    <Label htmlFor="show_in_header" className="text-white">Показывать в хедере (только иконка)</Label>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button type="submit" className="bg-green-600 hover:bg-green-700">
                    {editingSocial ? 'Обновить' : 'Создать'}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => {
                      setShowSocialForm(false)
                      setEditingSocial(null)
                      setSocialFormData({ name: '', url: '', icon_name: '', show_in_footer: true, show_in_header: false, order: 0 })
                    }}
                    className="border-gray-600 text-gray-300"
                  >
                    Отмена
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        <div className="grid gap-4">
          {socialNetworks.map((social) => (
            <Card key={social.id} className="bg-gray-800 border-gray-700">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-white mb-2">{social.name}</h3>
                    <p className="text-gray-400 mb-2">{social.url}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>Иконка: {social.icon_name}</span>
                      <span>Порядок: {social.order}</span>
                      {social.show_in_footer && <span className="text-green-400">Футер</span>}
                      {social.show_in_header && <span className="text-blue-400">Хедер</span>}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button 
                      onClick={() => handleEditSocial(social)}
                      variant="outline"
                      size="sm"
                      className="border-gray-600 text-gray-300"
                    >
                      Редактировать
                    </Button>
                    <Button 
                      onClick={() => handleDeleteClick(social)}
                      variant="destructive"
                      size="sm"
                    >
                      Удалить
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {socialNetworks.length === 0 && (
          <div className="text-center text-gray-400 py-8">
            <p>Пока нет добавленных социальных сетей</p>
          </div>
        )}
      </div>

      <SeedDataModal
        isOpen={showSeedModal}
        onClose={() => setShowSeedModal(false)}
        onSuccess={() => {
          fetchData()
          setShowSeedModal(false)
        }}
      />

      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false)
          setDeletingSocial(null)
        }}
        onConfirm={handleDeleteConfirm}
        title="Удаление социальной сети"
        message={`Вы уверены, что хотите удалить социальную сеть "${deletingSocial?.name}"? Это действие нельзя отменить.`}
        confirmText="Удалить"
        cancelText="Отмена"
      />

      {/* Фиксированные кнопки в правом нижнем углу */}
      <div className="fixed bottom-4 right-4 flex space-x-3 z-40">
        <Button 
          type="button"
          variant="outline"
          onClick={() => {
            // Сброс к исходным значениям
            fetchData()
            alert('Изменения отменены')
          }}
          className="border-gray-600 text-gray-300 hover:bg-gray-700 bg-gray-800 shadow-lg"
        >
          Отменить
        </Button>
        <Button 
          type="button"
          onClick={handleSubmit}
          disabled={saving}
          className="bg-green-600 hover:bg-green-700 shadow-lg"
        >
          {saving ? 'Сохранение...' : 'Сохранить все изменения'}
        </Button>
      </div>
    </div>
  )
}

export default Settings