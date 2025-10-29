#!/usr/bin/env python3
"""
Скрипт для обновления пути к изображению профиля в базе данных
"""

import sqlite3
import os

def update_profile_image_path():
    # Путь к базе данных
    db_path = os.path.join(os.path.dirname(__file__), 'site.db')
    
    if not os.path.exists(db_path):
        print(f"База данных не найдена: {db_path}")
        return False
    
    try:
        # Подключение к базе данных
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        # Обновление пути к изображению профиля
        cursor.execute("""
            UPDATE site_settings 
            SET profile_image = '/profile.jpg' 
            WHERE profile_image = '/static/assets/images/profile.jpg'
        """)
        
        # Проверяем, были ли обновлены записи
        rows_affected = cursor.rowcount
        
        # Сохраняем изменения
        conn.commit()
        
        print(f"Обновлено записей: {rows_affected}")
        
        # Проверяем текущее значение
        cursor.execute("SELECT profile_image FROM site_settings LIMIT 1")
        result = cursor.fetchone()
        if result:
            print(f"Текущий путь к изображению: {result[0]}")
        
        conn.close()
        return True
        
    except Exception as e:
        print(f"Ошибка при обновлении базы данных: {e}")
        return False

if __name__ == "__main__":
    print("Обновление пути к изображению профиля...")
    if update_profile_image_path():
        print("Обновление завершено успешно!")
    else:
        print("Ошибка при обновлении!")