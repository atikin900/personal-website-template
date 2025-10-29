import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

const NotificationPanel = () => {
  const [notifications] = useState([
    {
      id: 1,
      title: 'Новая запись в блоге',
      message: 'Запись "Мой новый проект" была опубликована',
      time: '2 часа назад',
      type: 'success',
      icon: '📝'
    },
    {
      id: 2,
      title: 'Цель выполнена',
      message: 'Цель "Изучить React" отмечена как выполненная',
      time: '5 часов назад',
      type: 'info',
      icon: '🎯'
    },
    {
      id: 3,
      title: 'Обновление системы',
      message: 'Доступно обновление админ панели',
      time: '1 день назад',
      type: 'warning',
      icon: '⚙️'
    }
  ])

  const unreadCount = notifications.length

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="relative gap-2">
          <span className="text-lg">🔔</span>
          <span className="hidden sm:inline">Уведомления</span>
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 notification-badge text-xs">
              {unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium leading-none">Уведомления</h4>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-xs"
              onClick={() => alert('Все уведомления отмечены как прочитанные')}
            >
              Отметить все как прочитанные
            </Button>
          </div>
          
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className="flex items-start space-x-3 p-3 rounded-lg bg-muted/20 hover:bg-muted/40 transition-colors cursor-pointer"
              >
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-sm">{notification.icon}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">
                    {notification.title}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {notification.message}
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    {notification.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="pt-2 border-t">
            <Button 
              variant="ghost" 
              className="w-full text-sm"
              onClick={() => alert('Переход к полному списку уведомлений')}
            >
              Показать все уведомления
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

export default NotificationPanel