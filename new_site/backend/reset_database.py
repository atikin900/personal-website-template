#!/usr/bin/env python3
"""
Скрипт для сброса базы данных и создания нового админ пользователя
"""

import os
import sys
from pathlib import Path

# Добавляем путь к приложению
sys.path.insert(0, ".")

def reset_database():
    """Сбрасывает базу данных и создает нового админа"""
    
    # Удаляем старую базу данных
    db_path = Path("site.db")
    if db_path.exists():
        try:
            db_path.unlink()
            print("✅ Старая база данных удалена")
        except Exception as e:
            print(f"⚠️ Не удалось удалить базу данных: {e}")
            print("💡 Остановите backend сервер и запустите скрипт снова")
            return False
    
    # Импортируем и создаем новую базу данных
    try:
        from app.database import engine
        from app.models import Base
        
        # Создаем таблицы
        Base.metadata.create_all(bind=engine)
        print("✅ Новая база данных создана")
        
        # Инициализируем данные
        from app.main import init_data
        init_data()
        print("✅ Данные инициализированы")
        
        print("\n🎉 База данных успешно сброшена!")
        print("🔐 Данные для входа: admin / admin")
        print("👤 Отображаемые имена можно изменить в 'Настройки сайта'")
        
        return True
        
    except Exception as e:
        print(f"❌ Ошибка при создании базы данных: {e}")
        return False

if __name__ == "__main__":
    print("🔄 Сброс базы данных...")
    print("⚠️ Убедитесь, что backend сервер остановлен!")
    
    input("Нажмите Enter для продолжения или Ctrl+C для отмены...")
    
    if reset_database():
        print("\n✨ Готово! Теперь можете запустить backend сервер.")
    else:
        print("\n❌ Сброс не удался. Проверьте ошибки выше.")