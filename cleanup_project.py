#!/usr/bin/env python3
"""
Скрипт для очистки проекта от ненужных файлов перед загрузкой на GitHub
Подготавливает проект для публикации и деплоя
"""

import os
import shutil
from pathlib import Path

def cleanup_project():
    """Удаляет ненужные файлы и папки, подготавливает проект к публикации"""
    
    # Папки для удаления
    folders_to_remove = [
        '_old_site_files',
        'admin_frontend', 
        'blog',
        'core',
        'custom_admin',
        'django_project',
        'goals',
        'static',
        'staticfiles',
        'templates',
        'website',
        'venv',
        '.venv',
        '__pycache__',
        'node_modules',
        '.trae',
        '.kilocode',
        '.gh',
        '.kiro'
    ]
    
    # Файлы для удаления
    files_to_remove = [
        'manage.py',
        'db.sqlite3',
        'requirements-dev.txt',
        'tailwind.config.js',
        'validate_svg.py',
        'ИНСТРУКЦИЯ_ПО_ИСПОЛЬЗОВАНИЮ.md',
        'manage_server.bat',
        'admin_panel_screenshot.png',
        'admin_panel_view.png', 
        'screenshot.png',
        'devtools_network_analysis.png',
        'package-lock.json',
        'package.json',
        'start_all.py',
        '.pre-commit-config.yaml',
        '.prettierrc'
    ]
    
    # Файлы начинающиеся с определенных строк
    files_startswith = [
        'console.log'
    ]
    
    print("🧹 Начинаю очистку проекта...")
    print("📋 Подготавливаю проект для публикации на GitHub и деплоя\n")
    
    removed_folders = 0
    removed_files = 0
    
    # Удаляем папки
    for folder in folders_to_remove:
        if os.path.exists(folder):
            print(f"📁 Удаляю папку: {folder}")
            shutil.rmtree(folder, ignore_errors=True)
            removed_folders += 1
    
    # Удаляем файлы
    for file in files_to_remove:
        if os.path.exists(file):
            print(f"📄 Удаляю файл: {file}")
            os.remove(file)
            removed_files += 1
    
    # Удаляем файлы по началу имени
    for file in os.listdir('.'):
        for prefix in files_startswith:
            if file.startswith(prefix):
                print(f"📄 Удаляю файл: {file}")
                os.remove(file)
                removed_files += 1
    
    # Создаем необходимые папки
    backend_static = Path('new_site/backend/static')
    if not backend_static.exists():
        backend_static.mkdir(parents=True, exist_ok=True)
        print(f"📁 Создал папку: {backend_static}")
    
    images_dir = Path('new_site/backend/static/assets/images')
    if not images_dir.exists():
        images_dir.mkdir(parents=True, exist_ok=True)
        print(f"📁 Создал папку: {images_dir}")
    
    # Создаем .env.example если не существует
    env_example = Path('.env.example')
    if not env_example.exists():
        env_content = """# Пример переменных окружения
# Скопируйте этот файл в .env и заполните своими значениями

# Настройки базы данных
DATABASE_URL=sqlite:///./site.db

# Настройки безопасности
SECRET_KEY=your-secret-key-here
JWT_SECRET_KEY=your-jwt-secret-key-here

# Настройки CORS (для продакшена укажите ваш домен)
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173,http://localhost:5174

# Настройки администратора по умолчанию
DEFAULT_ADMIN_USERNAME=admin
DEFAULT_ADMIN_PASSWORD=admin
DEFAULT_ADMIN_EMAIL=admin@example.com

# Настройки сайта по умолчанию (можно изменить через админ панель)
DEFAULT_SITE_TITLE=Персональный сайт
DEFAULT_USER_NAME=Ваше Имя
DEFAULT_USER_NICKNAME=Ваш Никнейм
"""
        env_example.write_text(env_content, encoding='utf-8')
        print(f"📄 Создал файл: {env_example}")
    
    print(f"\n✅ Очистка завершена!")
    print(f"📊 Статистика: удалено {removed_folders} папок и {removed_files} файлов")
    
    print("\n📁 Финальная структура проекта:")
    print("├── .docs/              # 📚 Документация проекта")
    print("├── new_site/           # 🚀 Основной проект")
    print("│   ├── backend/        # ⚙️  FastAPI сервер")
    print("│   ├── frontend/       # 🎨 React фронтенд")
    print("│   └── admin/          # 🔧 React админ панель")
    print("├── .env.example        # 🔐 Пример переменных окружения")
    print("├── .gitignore          # 🚫 Git исключения")
    print("├── README.md           # 📖 Документация")
    print("└── cleanup_project.py  # 🧹 Скрипт очистки")
    
    print("\n🎯 Следующие шаги:")
    print("1. 📝 Обновите README.md с вашей информацией")
    print("2. 🔧 Настройте переменные окружения (.env)")
    print("3. 🚀 Инициализируйте Git репозиторий")
    print("4. 📤 Загрузите на GitHub")
    print("5. 🌐 Задеплойте на Vercel/Railway")
    
    print("\n✨ Проект готов к публикации!")

if __name__ == "__main__":
    cleanup_project()