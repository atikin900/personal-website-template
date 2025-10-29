# 🚀 Personal Website Template

**Современный персональный сайт-визитка с админ панелью**

![Personal Website](https://img.shields.io/badge/Personal-Website-blue?style=for-the-badge)
![React](https://img.shields.io/badge/React-18.x-61DAFB?style=for-the-badge&logo=react)
![FastAPI](https://img.shields.io/badge/FastAPI-0.104-009688?style=for-the-badge&logo=fastapi)
![Python](https://img.shields.io/badge/Python-3.11+-3776AB?style=for-the-badge&logo=python)

---

## ✨ Особенности

- 🎨 **Современный дизайн** с адаптивной версткой
- 🔧 **Админ панель** для управления контентом
- 📝 **Система блога** с редактором
- 🎯 **Трекер целей** с категориями и прогрессом
- 🖼️ **Загрузка изображений** с автоматической оптимизацией
- 🎨 **Настройка темы** и цветовой схемы
- 🔐 **Безопасная аутентификация** с JWT
- 📱 **Полная адаптивность** для всех устройств

## 🚀 Быстрый старт

### 1️⃣ Клонирование
```bash
git clone https://github.com/atikin900/personal-website-template.git
cd personal-website-template
```

### 2️⃣ Проверка готовности
```bash
python test_project.py
```

### 3️⃣ Установка зависимостей
```bash
# Backend
cd new_site/backend && pip install -r requirements.txt

# Frontend  
cd new_site/frontend && npm install

# Admin
cd new_site/admin && npm install
```

### 4️⃣ Запуск серверов
```bash
# Backend (Терминал 1)
cd new_site/backend && python start_server.py

# Frontend (Терминал 2)
cd new_site/frontend && npm run dev

# Admin (Терминал 3)
cd new_site/admin && npm run dev
```

## 🌐 Доступ

| Сервис | URL | Описание |
|--------|-----|----------|
| 🌍 **Сайт** | http://localhost:5173 | Публичная часть |
| 🔧 **Админка** | http://localhost:5174 | Управление контентом |
| 📚 **API** | http://localhost:8000/docs | Swagger документация |

## 🔐 Вход в админку

**По умолчанию:** admin / admin

⚠️ **Сразу смените пароль после первого входа!**

## 🎨 Настройка под себя

1. **Профиль** (👤) → Измените отображаемые имена и пароль
2. **Настройки сайта** → Добавьте свою информацию
3. **Записи блога** → Создайте первые посты
4. **Цели** → Добавьте свои цели

## 🚀 Деплой на Vercel

### Frontend
```bash
cd new_site/frontend
vercel --prod
```

### Backend (Railway)
```bash
cd new_site/backend
railway up
```

### Admin
```bash
cd new_site/admin
vercel --prod
```

## 📁 Структура

```
new_site/
├── backend/     # FastAPI сервер
├── frontend/    # React сайт
└── admin/       # React админка
```

## 🐛 Помощь

- 🐛 **Issues:** [GitHub Issues](https://github.com/atikin900/personal-website-template/issues)
- 📖 **Документация:** Смотрите файлы в проекте

---

⭐ **Поставьте звезду, если проект был полезен!**
