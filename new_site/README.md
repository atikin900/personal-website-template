# Персональный сайт Иванцова Никиты

## Архитектура проекта

- **backend/** - Python FastAPI сервер
- **frontend/** - React приложение (основной сайт)
- **admin/** - React админ-панель

## Запуск проекта

### Backend (Python FastAPI)
```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

### Frontend (React)
```bash
cd frontend
npm install
npm run dev
```

### Admin Panel (React)
```bash
cd admin
npm install
npm run dev
```

## Порты
- Backend API: http://localhost:8000
- Frontend: http://localhost:5173
- Admin Panel: http://localhost:5174