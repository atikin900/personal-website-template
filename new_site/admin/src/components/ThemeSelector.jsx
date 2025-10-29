import { useTheme } from '@/contexts/ThemeContext'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

const ThemeSelector = () => {
  const { 
    baseTheme, 
    accentColor, 
    changeBaseTheme, 
    changeAccentColor, 
    baseThemes, 
    accentColors 
  } = useTheme()

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <span className="text-lg">{baseThemes[baseTheme]?.icon || '🎨'}</span>
          <span className="hidden sm:inline">Тема</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64" align="end">
        <div className="space-y-4">
          <div>
            <h4 className="font-medium leading-none mb-2">Базовая тема</h4>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(baseThemes).map(([key, theme]) => (
                <Button
                  key={key}
                  variant={baseTheme === key ? "default" : "ghost"}
                  className="justify-start gap-2"
                  onClick={() => changeBaseTheme(key)}
                >
                  <span className="text-base">{theme.icon}</span>
                  <span className="text-sm">{theme.name}</span>
                  {baseTheme === key && (
                    <span className="ml-auto text-xs">✓</span>
                  )}
                </Button>
              ))}
            </div>
          </div>
          
          <div className="border-t pt-4">
            <h4 className="font-medium leading-none mb-2">Акцентный цвет</h4>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(accentColors).map(([key, color]) => (
                <Button
                  key={key}
                  variant={accentColor === key ? "default" : "ghost"}
                  className="justify-start gap-2"
                  onClick={() => changeAccentColor(key)}
                >
                  <span className="text-base">{color.icon}</span>
                  <span className="text-sm">{color.name}</span>
                  {accentColor === key && (
                    <span className="ml-auto text-xs">✓</span>
                  )}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

export default ThemeSelector