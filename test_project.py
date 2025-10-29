#!/usr/bin/env python3
"""
Скрипт для проверки работоспособности проекта после очистки
"""

import os
import sys
import subprocess
import time
import requests
from pathlib import Path

def check_file_exists(file_path):
    """Проверяет существование файла"""
    if Path(file_path).exists():
        print(f"✅ {file_path}")
        return True
    else:
        print(f"❌ {file_path} - НЕ НАЙДЕН")
        return False

def check_directory_structure():
    """Проверяет структуру проекта"""
    print("🔍 Проверка структуры проекта...")
    
    required_files = [
        "new_site/backend/app/main.py",
        "new_site/backend/requirements.txt",
        "new_site/backend/start_server.py",
        "new_site/frontend/package.json",
        "new_site/frontend/src/App.jsx",
        "new_site/admin/package.json",
        "new_site/admin/src/App.jsx",
        ".env.example",
        "README.md",
        ".gitignore"
    ]
    
    all_good = True
    for file_path in required_files:
        if not check_file_exists(file_path):
            all_good = False
    
    return all_good

def check_backend_dependencies():
    """Проверяет зависимости backend"""
    print("\n🐍 Проверка зависимостей Python...")
    
    try:
        # Проверяем основные зависимости
        import fastapi
        print(f"✅ FastAPI {fastapi.__version__}")
        
        import sqlalchemy
        print(f"✅ SQLAlchemy {sqlalchemy.__version__}")
        
        import uvicorn
        print(f"✅ Uvicorn {uvicorn.__version__}")
        
        return True
    except ImportError as e:
        print(f"❌ Отсутствует зависимость: {e}")
        print("💡 Установите зависимости: cd new_site/backend && pip install -r requirements.txt")
        return False

def test_backend_startup():
    """Тестирует запуск backend"""
    print("\n⚙️ Тестирование запуска backend...")
    
    try:
        # Меняем директорию на backend
        os.chdir("new_site/backend")
        
        # Импортируем приложение
        sys.path.insert(0, ".")
        from app.main import app
        
        print("✅ Backend приложение успешно импортировано")
        
        # Возвращаемся в корневую директорию
        os.chdir("../..")
        
        return True
    except Exception as e:
        print(f"❌ Ошибка при импорте backend: {e}")
        os.chdir("../..")
        return False

def check_frontend_dependencies():
    """Проверяет зависимости frontend"""
    print("\n📦 Проверка зависимостей Frontend...")
    
    frontend_node_modules = Path("new_site/frontend/node_modules")
    admin_node_modules = Path("new_site/admin/node_modules")
    
    if frontend_node_modules.exists():
        print("✅ Frontend node_modules найдены")
    else:
        print("❌ Frontend node_modules не найдены")
        print("💡 Установите зависимости: cd new_site/frontend && npm install")
        return False
    
    if admin_node_modules.exists():
        print("✅ Admin node_modules найдены")
    else:
        print("❌ Admin node_modules не найдены")
        print("💡 Установите зависимости: cd new_site/admin && npm install")
        return False
    
    return True

def check_env_file():
    """Проверяет файл переменных окружения"""
    print("\n🔐 Проверка переменных окружения...")
    
    env_example = Path(".env.example")
    env_file = Path("new_site/backend/.env")
    
    if env_example.exists():
        print("✅ .env.example найден")
    else:
        print("❌ .env.example не найден")
    
    if env_file.exists():
        print("✅ Backend .env найден")
    else:
        print("⚠️ Backend .env не найден (будут использованы значения по умолчанию)")
    
    return True

def main():
    """Основная функция проверки"""
    print("🧪 Проверка работоспособности проекта")
    print("=" * 50)
    
    all_checks_passed = True
    
    # Проверка структуры
    if not check_directory_structure():
        all_checks_passed = False
    
    # Проверка зависимостей Python
    if not check_backend_dependencies():
        all_checks_passed = False
    
    # Проверка запуска backend
    if not test_backend_startup():
        all_checks_passed = False
    
    # Проверка зависимостей Node.js
    if not check_frontend_dependencies():
        all_checks_passed = False
    
    # Проверка переменных окружения
    check_env_file()
    
    print("\n" + "=" * 50)
    
    if all_checks_passed:
        print("🎉 Все проверки пройдены успешно!")
        print("\n📋 Следующие шаги:")
        print("1. 🚀 Запустите серверы:")
        print("   Backend:  cd new_site/backend && python start_server.py")
        print("   Frontend: cd new_site/frontend && npm run dev")
        print("   Admin:    cd new_site/admin && npm run dev")
        print("\n2. 🌐 Откройте в браузере:")
        print("   Сайт:     http://localhost:5173")
        print("   Админка:  http://localhost:5174")
        print("   API:      http://localhost:8000/docs")
        print("\n3. 🔐 Войдите в админку (admin/admin)")
        print("4. 🎨 Настройте сайт под себя")
        print("5. 🚀 Задеплойте на Vercel/Railway")
    else:
        print("❌ Некоторые проверки не пройдены")
        print("💡 Исправьте ошибки выше и запустите проверку снова")
        return 1
    
    return 0

if __name__ == "__main__":
    sys.exit(main())