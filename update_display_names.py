#!/usr/bin/env python3
"""
Скрипт для обновления отображаемых имен в настройках сайта
"""

import os
import sys
from pathlib import Path

def update_display_names():
    """Обновляет отображаемые имена в настройках сайта"""
    
    print("🔄 Обновление отображаемых имен...")
    
    # Меняем директорию на backend
    os.chdir("new_site/backend")
    
    try:
        # Добавляем путь к приложению
        sys.path.insert(0, ".")
        
        from app.database import SessionLocal
        from app.models import SiteSettings
        from sqlalchemy import text
        
        db = SessionLocal()
        
        try:
            # Проверяем, существуют ли поля в таблице
            result = db.execute(text("PRAGMA table_info(site_settings)"))
            columns = [row[1] for row in result.fetchall()]
            
            # Добавляем поля если их нет
            if 'display_name' not in columns:
                db.execute(text("ALTER TABLE site_settings ADD COLUMN display_name VARCHAR DEFAULT 'Ваше Имя'"))
                print("✅ Добавлено поле display_name")
                
            if 'short_name' not in columns:
                db.execute(text("ALTER TABLE site_settings ADD COLUMN short_name VARCHAR DEFAULT 'Имя'"))
                print("✅ Добавлено поле short_name")
            
            # Обновляем существующие записи
            settings = db.query(SiteSettings).first()
            if settings:
                if not hasattr(settings, 'display_name') or not settings.display_name:
                    db.execute(text("UPDATE site_settings SET display_name = 'Ваше Имя' WHERE id = :id"), {"id": settings.id})
                    print("✅ Обновлено поле display_name")
                    
                if not hasattr(settings, 'short_name') or not settings.short_name:
                    db.execute(text("UPDATE site_settings SET short_name = 'Имя' WHERE id = :id"), {"id": settings.id})
                    print("✅ Обновлено поле short_name")
            
            db.commit()
            print("\n🎉 Обновление завершено успешно!")
            print("📍 Теперь можете изменить отображаемые имена в админ панели:")
            print("   Настройки сайта → Полное имя / Короткое имя")
            
            return True
            
        finally:
            db.close()
            
    except Exception as e:
        print(f"❌ Ошибка при обновлении: {e}")
        return False
    
    finally:
        os.chdir("../..")

if __name__ == "__main__":
    if update_display_names():
        print("\n✨ Готово! Перезапустите backend сервер для применения изменений.")
    else:
        print("\n❌ Обновление не удалось. Проверьте ошибки выше.")