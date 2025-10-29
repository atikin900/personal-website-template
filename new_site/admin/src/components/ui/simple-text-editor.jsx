import { useState, useEffect } from 'react'

const SimpleTextEditor = ({ 
  value = '', 
  onChange, 
  placeholder = 'Введите текст...', 
  className = '',
  minHeight = '200px',
  maxHeight = '400px'
}) => {
  const [content, setContent] = useState('')
  const [isFocused, setIsFocused] = useState(false)

  // Минимальная функция очистки только от опасных символов
  const cleanText = (text) => {
    if (!text || typeof text !== 'string') return ''
    
    // Только базовая очистка от опасных символов управления направлением текста
    return text
      .replace(/[\u202E\u202D\u202C\u200F\u200E]/g, '')
      .replace(/[\u061C\u2066\u2067\u2068\u2069]/g, '')
  }

  useEffect(() => {
    const cleanedValue = cleanText(value)
    setContent(cleanedValue)
  }, [value])

  const handleChange = (e) => {
    const rawValue = e.target.value
    const cleanedValue = cleanText(rawValue)
    setContent(cleanedValue)
    
    if (onChange) {
      onChange(cleanedValue)
    }
  }

  const handleFocus = () => setIsFocused(true)
  
  const handleBlur = () => {
    setIsFocused(false)
  }

  return (
    <div className={`simple-text-editor-wrapper ${className}`}>
      <textarea
        value={content}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder={placeholder}
        className={`
          w-full p-4 bg-gray-700 text-white border border-gray-600 rounded-md 
          focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none
          ${isFocused ? 'ring-2 ring-blue-500' : ''}
        `}
        style={{ 
          minHeight: minHeight, 
          maxHeight: maxHeight,
          direction: 'ltr',
          unicodeBidi: 'normal',
          textAlign: 'left'
        }}
      />
      
      {/* Счетчик символов */}
      <div className="text-xs text-gray-400 mt-1 text-right">
        {content.length} символов
      </div>
    </div>
  )
}

export default SimpleTextEditor