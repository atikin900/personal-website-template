#!/usr/bin/env python3
"""
Скрипт для добавления поля published_at в таблицу blog_posts
"""
import sqlite3
import os
from datetime import datetime

def add_published_at_field():
    db_path = "site.db"
    
    if not os.path.exists(db_path):
        print(f"База данных {db_path} не найдена!")
        return
    
    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        # Проверяем, существует ли уже поле published_at
        cursor.execute("PRAGMA table_info(blog_posts)")
        columns = [column[1] for column in cursor.fetchall()]
        
        if 'published_at' in columns:
            print("Поле published_at уже существует в таблице blog_posts")
            return
        
        # Добавляем новое поле
        cursor.execute("ALTER TABLE blog_posts ADD COLUMN published_at DATETIME")
        
        # Устанавливаем published_at равным created_at для существующих опубликованных постов
        cursor.execute("""
            UPDATE blog_posts 
            SET published_at = created_at 
            WHERE published = 1
        """)
        
        conn.commit()
        print("Поле published_at успешно добавлено в таблицу blog_posts")
        
        # Показываем обновленную структуру таблицы
        cursor.execute("PRAGMA table_info(blog_posts)")
        columns = cursor.fetchall()
        print("\nОбновленная структура таблицы blog_posts:")
        for column in columns:
            print(f"  {column[1]} ({column[2]})")
            
    except sqlite3.Error as e:
        print(f"Ошибка при работе с базой данных: {e}")
    finally:
        if conn:
            conn.close()

if __name__ == "__main__":
    add_published_at_field()