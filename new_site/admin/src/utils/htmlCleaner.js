// Функция для определения и исправления обратного текста
export const fixReversedText = (text) => {
  if (!text || typeof text !== 'string') return text
  
  // Список известных обратных слов для точного исправления
  const knownReversedWords = {
    'ьтарбос': 'собрать',
    'ьтарбоС': 'Собрать',
    'ретюьпмок': 'компьютер',
    'ретюьпмоК': 'Компьютер',
    'ьтичузи': 'изучить',
    'ьтичузИ': 'Изучить',
    'ьтавзар': 'развать',
    'ьтавзаР': 'Развать',
    'ьтадос': 'создать',
    'ьтадоС': 'Создать'
  }
  
  let fixedText = text
  
  // Заменяем известные обратные слова с границами слов
  for (const [reversed, correct] of Object.entries(knownReversedWords)) {
    const regex = new RegExp(`\\b${reversed}\\b`, 'gi')
    fixedText = fixedText.replace(regex, correct)
  }
  
  // Дополнительная проверка: исправляем слова, которые начинаются с ь, ъ, ы
  // Используем регулярное выражение для сохранения пробелов
  fixedText = fixedText.replace(/\b[а-яё]*[ьъы][а-яё]{2,}\b/gi, (match) => {
    // Если слово начинается с ь, ъ, ы и длиннее 3 символов
    if (/^[ьъы]/i.test(match) && match.length > 3) {
      return match.split('').reverse().join('')
    }
    return match
  })
  
  return fixedText
}

// Утилита для очистки HTML от устаревших тегов
export const cleanHTML = (html) => {
  if (!html || typeof html !== 'string') return html
  
  let cleaned = html
    // Заменяем устаревшие теги font на span с CSS стилями
    .replace(/<font color="([^"]*)">/g, '<span style="color: $1;">')
    .replace(/<font color='([^']*)'>/g, '<span style="color: $1;">')
    .replace(/<\/font>/g, '</span>')
    .replace(/<font([^>]*)>/g, '<span$1>')
    // Заменяем другие устаревшие теги
    .replace(/<b>/g, '<strong>')
    .replace(/<\/b>/g, '</strong>')
    .replace(/<i>/g, '<em>')
    .replace(/<\/i>/g, '</em>')
    // Удаляем пустые span теги
    .replace(/<span><\/span>/g, '')
    .replace(/<span\s*><\/span>/g, '')
    // Удаляем Unicode символы управления направлением текста
    .replace(/[\u202E\u202D\u202C\u200F\u200E]/g, '')
    .replace(/[\u061C\u2066\u2067\u2068\u2069]/g, '')
    // Удаляем потенциально опасные CSS стили
    .replace(/direction\s*:\s*rtl/gi, '')
    .replace(/unicode-bidi\s*:\s*bidi-override/gi, '')
    .replace(/transform\s*:\s*[^;]*scale\(-1[^;]*\)/gi, '')
  
  // Исправляем обратный текст в содержимом
  const textContent = cleaned.replace(/<[^>]*>/g, '')
  const fixedText = fixReversedText(textContent)
  
  if (fixedText !== textContent) {
    // Если текст был исправлен, заменяем его в HTML
    cleaned = cleaned.replace(textContent, fixedText)
  }
  
  return cleaned
}

// Функция для миграции всех записей блога
export const migratePostsHTML = async () => {
  try {
    const token = localStorage.getItem('admin_token')
    if (!token) return
    
    const response = await fetch('http://localhost:8000/api/admin/posts', {
      headers: { Authorization: `Bearer ${token}` }
    })
    
    if (!response.ok) return
    
    const posts = await response.json()
    
    for (const post of posts) {
      let needsUpdate = false
      const updatedPost = { ...post }
      
      // Очищаем заголовок
      const cleanTitle = cleanHTML(post.title)
      if (cleanTitle !== post.title) {
        updatedPost.title = cleanTitle
        needsUpdate = true
      }
      
      // Очищаем описание
      const cleanExcerpt = cleanHTML(post.excerpt)
      if (cleanExcerpt !== post.excerpt) {
        updatedPost.excerpt = cleanExcerpt
        needsUpdate = true
      }
      
      // Очищаем содержание
      const cleanContent = cleanHTML(post.content)
      if (cleanContent !== post.content) {
        updatedPost.content = cleanContent
        needsUpdate = true
      }
      
      // Обновляем запись если нужно
      if (needsUpdate) {
        await fetch(`http://localhost:8000/api/admin/posts/${post.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(updatedPost)
        })
        console.log(`Обновлена запись: ${post.title}`)
      }
    }
    
    console.log('Миграция HTML завершена')
  } catch (error) {
    console.error('Ошибка миграции HTML:', error)
  }
}

// Функция для исправления всех целей с обратным текстом
export const fixReversedGoals = async () => {
  try {
    const token = localStorage.getItem('admin_token')
    if (!token) {
      console.log('Токен не найден')
      return
    }
    
    const response = await fetch('http://localhost:8000/api/admin/goals', {
      headers: { Authorization: `Bearer ${token}` }
    })
    
    if (!response.ok) {
      console.log('Ошибка загрузки целей')
      return
    }
    
    const categories = await response.json()
    let fixedCount = 0
    
    for (const category of categories) {
      for (const goal of category.goals) {
        const originalText = goal.text
        const fixedText = fixReversedText(originalText)
        
        if (fixedText !== originalText) {
          console.log(`Исправляем цель: "${originalText}" -> "${fixedText}"`)
          
          const updatedGoal = { ...goal, text: fixedText }
          
          await fetch(`http://localhost:8000/api/admin/goals/${goal.id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(updatedGoal)
          })
          
          fixedCount++
        }
      }
    }
    
    console.log(`Исправлено целей: ${fixedCount}`)
    return fixedCount
  } catch (error) {
    console.error('Ошибка исправления целей:', error)
    return 0
  }
}