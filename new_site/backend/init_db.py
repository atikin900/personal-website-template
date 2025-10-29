#!/usr/bin/env python3

import sys
import os

# Добавляем текущую директорию в путь
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.database import engine
from app.models import Base

def init_database():
    """Создает все таблицы в базе данных"""
    try:
        Base.metadata.create_all(bind=engine)
        print("✅ База данных успешно создана!")
        return True
    except Exception as e:
        print(f"❌ Ошибка при создании базы данных: {e}")
        return False

if __name__ == "__main__":
    init_database()