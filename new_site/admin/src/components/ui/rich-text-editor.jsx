import { useState, useEffect, useRef } from 'react'

const RichTextEditorComponent = ({ 
  value = '', 
  onChange, 
  placeholder = 'Введите текст...', 
  className = '',
  minHeight = '200px',
  maxHeight = '400px'
}) => {
  const [isFocused, setIsFocused] = useState(false)
  const editorRef = useRef(null)
  const timeoutRef = useRef(null)

  useEffect(() => {
    if (editorRef.current && value !== editorRef.current.innerHTML) {
      // Очищаем от опасных символов
      let cleanedValue = value || ''
      cleanedValue = cleanedValue
        .replace(/[\u202E\u202D\u202C\u200F\u200E]/g, '')
        .replace(/[\u061C\u2066\u2067\u2068\u2069]/g, '')
      
      editorRef.current.innerHTML = cleanedValue
    }
  }, [value])

  const handleContentChange = (e) => {
    let rawContent = e.target.innerHTML
    
    // Только минимальная очистка от опасных символов управления направлением
    rawContent = rawContent
      .replace(/[\u202E\u202D\u202C\u200F\u200E]/g, '')
      .replace(/[\u061C\u2066\u2067\u2068\u2069]/g, '')
    
    // Debounce для onChange чтобы не вызывать слишком часто
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    
    timeoutRef.current = setTimeout(() => {
      if (onChange) {
        onChange(rawContent)
      }
    }, 100)
  }

  const handleFocus = () => setIsFocused(true)
  const handleBlur = () => setIsFocused(false)

  const applyFormat = (command, value = null) => {
    // Используем современные CSS стили вместо устаревших HTML тегов
    if (command === 'foreColor') {
      document.execCommand('styleWithCSS', false, true)
      document.execCommand(command, false, value)
      document.execCommand('styleWithCSS', false, false)
    } else if (command === 'backColor') {
      document.execCommand('styleWithCSS', false, true)
      document.execCommand('hiliteColor', false, value)
      document.execCommand('styleWithCSS', false, false)
    } else {
      document.execCommand(command, false, value)
    }
  }

  const insertList = (type) => {
    if (type === 'ul') {
      document.execCommand('insertUnorderedList', false, null)
    } else {
      document.execCommand('insertOrderedList', false, null)
    }
  }



  return (
    <div className={`rich-text-editor-wrapper ${className}`}>
      {/* Панель инструментов */}
      <div className="toolbar bg-gray-800 border border-gray-600 rounded-t-md p-2 flex flex-wrap gap-1">
        <button
          type="button"
          onClick={() => applyFormat('bold')}
          className="bg-gray-700 hover:bg-gray-600 text-white px-2 py-1 rounded text-sm border border-gray-600 transition-colors"
          title="Жирный"
        >
          <strong>B</strong>
        </button>
        <button
          type="button"
          onClick={() => applyFormat('italic')}
          className="bg-gray-700 hover:bg-gray-600 text-white px-2 py-1 rounded text-sm border border-gray-600 transition-colors"
          title="Курсив"
        >
          <em>I</em>
        </button>
        <button
          type="button"
          onClick={() => applyFormat('underline')}
          className="bg-gray-700 hover:bg-gray-600 text-white px-2 py-1 rounded text-sm border border-gray-600 transition-colors"
          title="Подчеркивание"
        >
          <u>U</u>
        </button>
        <button
          type="button"
          onClick={() => applyFormat('strikeThrough')}
          className="bg-gray-700 hover:bg-gray-600 text-white px-2 py-1 rounded text-sm border border-gray-600 transition-colors"
          title="Зачеркивание"
        >
          <s>S</s>
        </button>
        <div className="w-px bg-gray-600 mx-1"></div>
        <button
          type="button"
          onClick={() => insertList('ul')}
          className="bg-gray-700 hover:bg-gray-600 text-white px-2 py-1 rounded text-sm border border-gray-600 transition-colors"
          title="Маркированный список"
        >
          •
        </button>
        <button
          type="button"
          onClick={() => insertList('ol')}
          className="bg-gray-700 hover:bg-gray-600 text-white px-2 py-1 rounded text-sm border border-gray-600 transition-colors"
          title="Нумерованный список"
        >
          1.
        </button>
        <div className="w-px bg-gray-600 mx-1"></div>
        <select
          onChange={(e) => applyFormat('formatBlock', e.target.value)}
          className="bg-gray-700 text-white border border-gray-600 rounded px-2 py-1 text-sm"
          defaultValue=""
        >
          <option value="">Обычный</option>
          <option value="h1">Заголовок 1</option>
          <option value="h2">Заголовок 2</option>
          <option value="h3">Заголовок 3</option>
          <option value="h4">Заголовок 4</option>
          <option value="h5">Заголовок 5</option>
          <option value="h6">Заголовок 6</option>
        </select>
        <div className="w-px bg-gray-600 mx-1"></div>
        <input
          type="color"
          onChange={(e) => applyFormat('foreColor', e.target.value)}
          className="w-8 h-8 bg-gray-700 border border-gray-600 rounded cursor-pointer"
          title="Цвет текста"
        />
        <input
          type="color"
          onChange={(e) => applyFormat('backColor', e.target.value)}
          className="w-8 h-8 bg-gray-700 border border-gray-600 rounded cursor-pointer"
          title="Цвет фона"
        />
      </div>

      {/* Редактор */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleContentChange}
        onPaste={handleContentChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className={`
          w-full p-4 bg-gray-700 text-white border border-gray-600 rounded-b-md 
          focus:outline-none focus:ring-2 focus:ring-blue-500 overflow-y-auto
          ${isFocused ? 'ring-2 ring-blue-500' : ''}
        `}
        dir="ltr"
        style={{ 
          minHeight: minHeight, 
          maxHeight: maxHeight,
          direction: 'ltr',
          unicodeBidi: 'normal',
          textAlign: 'left',
          writingMode: 'horizontal-tb'
        }}
        data-placeholder={!editorRef.current?.innerHTML ? placeholder : ''}
        suppressContentEditableWarning={true}
      />

      {/* Счетчик символов */}
      <div className="text-xs text-gray-400 mt-1 text-right">
        {editorRef.current ? editorRef.current.textContent?.length || 0 : 0} символов
      </div>
    </div>
  )
}

export default RichTextEditorComponent