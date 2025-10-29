import React, { useState, useRef, useEffect } from 'react'
import { Button } from './button'
import { Card, CardContent } from './card'

const ImageUpload = ({ currentImage, onImageUpload, loading = false }) => {
  const [dragActive, setDragActive] = useState(false)
  const [preview, setPreview] = useState(currentImage)
  const fileInputRef = useRef(null)

  useEffect(() => {
    setPreview(currentImage)
  }, [currentImage])

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }

  const handleChange = (e) => {
    e.preventDefault()
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }

  const handleFile = (file) => {
    // Проверяем тип файла
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      alert('Неподдерживаемый тип файла. Разрешены: JPEG, PNG, GIF, WebP')
      return
    }

    // Проверяем размер файла (максимум 5MB)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      alert('Файл слишком большой. Максимальный размер: 5MB')
      return
    }

    // Создаем превью
    const reader = new FileReader()
    reader.onload = (e) => {
      setPreview(e.target.result)
    }
    reader.readAsDataURL(file)

    // Вызываем callback для загрузки
    if (onImageUpload) {
      onImageUpload(file)
    }
  }

  const onButtonClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="space-y-4">
      <Card 
        className={`border-2 border-dashed transition-colors cursor-pointer ${
          dragActive 
            ? 'border-primary bg-primary/5' 
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={onButtonClick}
      >
        <CardContent className="p-6">
          <div className="text-center">
            {preview ? (
              <div className="space-y-4">
                <img 
                  src={preview.startsWith('http') ? preview : `http://localhost:8000${preview}`}
                  alt="Превью изображения профиля" 
                  className="mx-auto w-32 h-32 object-cover rounded-full border-4 border-primary/20"
                />
                <p className="text-sm text-gray-600">
                  Нажмите или перетащите новое изображение для замены
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="mx-auto w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center">
                  <svg 
                    className="w-12 h-12 text-gray-400" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6" 
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-lg font-medium text-gray-900">
                    Загрузить изображение профиля
                  </p>
                  <p className="text-sm text-gray-600">
                    Перетащите изображение сюда или нажмите для выбора
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    Поддерживаемые форматы: JPEG, PNG, GIF, WebP (макс. 5MB)
                  </p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept="image/*"
        onChange={handleChange}
      />

      {preview && (
        <div className="flex gap-2">
          <Button 
            onClick={onButtonClick}
            variant="outline"
            disabled={loading}
            className="flex-1"
          >
            {loading ? 'Загрузка...' : 'Выбрать другое изображение'}
          </Button>
        </div>
      )}
    </div>
  )
}

export { ImageUpload }