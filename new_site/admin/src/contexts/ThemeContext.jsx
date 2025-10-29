import { createContext, useContext, useEffect, useState } from 'react'

const ThemeContext = createContext()

export const baseThemes = {
  light: {
    name: 'Светлая',
    icon: '☀️',
    colors: {
      '--background': '0 0% 100%',
      '--foreground': '222.2 84% 4.9%',
      '--card': '0 0% 100%',
      '--card-foreground': '222.2 84% 4.9%',
      '--secondary': '210 40% 96%',
      '--secondary-foreground': '222.2 84% 4.9%',
      '--muted': '210 40% 96%',
      '--muted-foreground': '215.4 16.3% 46.9%',
      '--border': '214.3 31.8% 91.4%',
      '--input': '214.3 31.8% 91.4%',
    }
  },
  dark: {
    name: 'Темная',
    icon: '🌙',
    colors: {
      '--background': '220 13% 9%',
      '--foreground': '220 9% 95%',
      '--card': '220 13% 11%',
      '--card-foreground': '220 9% 95%',
      '--secondary': '220 13% 15%',
      '--secondary-foreground': '220 9% 95%',
      '--muted': '220 13% 15%',
      '--muted-foreground': '220 9% 65%',
      '--border': '220 13% 15%',
      '--input': '220 13% 15%',
    }
  }
}

export const accentColors = {
  green: {
    name: 'Зеленый',
    icon: '💚',
    colors: {
      '--primary': '142 76% 36%',
      '--accent': '142 76% 36%',
      '--ring': '142 76% 36%',
    }
  },
  blue: {
    name: 'Синий',
    icon: '💙',
    colors: {
      '--primary': '217 91% 60%',
      '--accent': '217 91% 60%',
      '--ring': '217 91% 60%',
    }
  },
  purple: {
    name: 'Фиолетовый',
    icon: '💜',
    colors: {
      '--primary': '268 83% 58%',
      '--accent': '268 83% 58%',
      '--ring': '268 83% 58%',
    }
  },
  red: {
    name: 'Красный',
    icon: '❤️',
    colors: {
      '--primary': '0 84% 60%',
      '--accent': '0 84% 60%',
      '--ring': '0 84% 60%',
    }
  },
  orange: {
    name: 'Оранжевый',
    icon: '🧡',
    colors: {
      '--primary': '25 95% 53%',
      '--accent': '25 95% 53%',
      '--ring': '25 95% 53%',
    }
  }
}

export const ThemeProvider = ({ children }) => {
  const [baseTheme, setBaseTheme] = useState(() => {
    const saved = localStorage.getItem('admin-base-theme')
    return saved || 'light'
  })
  
  const [accentColor, setAccentColor] = useState(() => {
    const saved = localStorage.getItem('admin-accent-color')
    return saved || 'green'
  })

  const changeBaseTheme = (themeKey) => {
    setBaseTheme(themeKey)
    localStorage.setItem('admin-base-theme', themeKey)
  }
  
  const changeAccentColor = (colorKey) => {
    setAccentColor(colorKey)
    localStorage.setItem('admin-accent-color', colorKey)
  }

  useEffect(() => {
    const theme = baseThemes[baseTheme]
    const accent = accentColors[accentColor]
    
    if (theme && accent) {
      const root = document.documentElement
      
      // Применяем базовую тему
      Object.entries(theme.colors).forEach(([property, value]) => {
        root.style.setProperty(property, value)
      })
      
      // Применяем акцентный цвет
      Object.entries(accent.colors).forEach(([property, value]) => {
        root.style.setProperty(property, value)
      })
      
      // Устанавливаем цвета для primary-foreground и accent-foreground в зависимости от темы
      const foregroundColor = baseTheme === 'light' ? '0 0% 100%' : '220 9% 95%'
      root.style.setProperty('--primary-foreground', foregroundColor)
      root.style.setProperty('--accent-foreground', baseTheme === 'light' ? '222.2 84% 4.9%' : '220 9% 95%')
    }
  }, [baseTheme, accentColor])

  return (
    <ThemeContext.Provider value={{ 
      baseTheme, 
      accentColor, 
      changeBaseTheme, 
      changeAccentColor, 
      baseThemes, 
      accentColors 
    }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}