#!/usr/bin/env python3
"""
Миграция для добавления полей display_name и short_name в таблицу site_settings
"""

import os
import sys
from pathlib import Path

# Добавляем путь к приложению
sys.path.insert(0, ".")

def add_display_name_fields():
    """Добавляет поля display_name и short_name в таблицу site_settings"""
    
    try:
        from app.database import engine
        from sqlalchemy import text
        
        with engine.connect() as connection:
            # Проверяем, существуют ли уже поля
            result = connection.execute(text("PRAGMA table_info(site_settings)"))
            columns = [row[1] for row in result.fetchall()]
            
            if 'display_name' not in columns:
                connection.execute(text("ALTER TABLE site_settings ADD COLUMN display_name VARCHAR DEFAULT 'Ваше Имя'"))
                print("✅ Добавлено поле display_name")
            else:
                print("ℹ️ Поле display_name уже существует")
                
            if 'short_name' not in columns:
                connection.execute(text("ALTER TABLE site_settings ADD COLUMN short_name VARCHAR DEFAULT 'Имя'"))
                print("✅ Добавлено поле short_name")
            else:
                print("ℹ️ Поле short_name уже существует")
            
            connection.commit()
            
        print("\n🎉 Миграция завершена успешно!")
        return True
        
    except Exception as e:
        print(f"❌ Ошибка при выполнении миграции: {e}")
        return False

if __name__ == "__main__":
    print("🔄 Добавление полей для отображаемых имен...")
    
    if add_display_name_fields():
        print("\n✨ Готово! Теперь можете настроить отображаемые имена в админ панели.")
        print("📍 Настройки сайта → Полное имя / Короткое имя")
    else:
        print("\n❌ Миграция не удалась. Проверьте ошибки выше.")