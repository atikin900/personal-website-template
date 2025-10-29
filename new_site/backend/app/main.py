from fastapi import FastAPI, Depends, HTTPException, status, Form, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session
from datetime import timedelta
from typing import List

from .database import SessionLocal, engine, get_db
from .models import Base, SiteSettings, BlogPost, GoalCategory, Goal, User, SocialNetwork
from .schemas import (
    SiteSettings as SiteSettingsSchema,
    SiteSettingsCreate, SiteSettingsUpdate,
    BlogPost as BlogPostSchema, BlogPostCreate, BlogPostUpdate,
    GoalCategory as GoalCategorySchema, GoalCategoryCreate, GoalCategoryUpdate,
    Goal as GoalSchema, GoalCreate, GoalUpdate,
    User as UserSchema, UserCreate, Token,
    SocialNetwork as SocialNetworkSchema, SocialNetworkCreate, SocialNetworkUpdate
)
from .auth import (
    authenticate_user, create_access_token, get_current_user,
    get_password_hash, ACCESS_TOKEN_EXPIRE_MINUTES
)

# Создание таблиц
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Personal Site API", version="1.0.0")

# Статическая раздача файлов
app.mount("/static", StaticFiles(directory="static"), name="static")

# CORS настройки
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5174", "http://localhost:5175"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Инициализация данных
def init_data():
    import os
    db = SessionLocal()
    try:
        # Получаем настройки из переменных окружения
        admin_username = os.getenv("ADMIN_USERNAME", os.getenv("DEFAULT_ADMIN_USERNAME", "admin"))
        admin_password = os.getenv("ADMIN_PASSWORD", os.getenv("DEFAULT_ADMIN_PASSWORD", "admin"))
        admin_email = os.getenv("DEFAULT_ADMIN_EMAIL", "admin@example.com")
        
        site_title = os.getenv("DEFAULT_SITE_TITLE", "Персональный сайт")
        user_name = os.getenv("DEFAULT_USER_NAME", "Ваше Имя")
        user_nickname = os.getenv("DEFAULT_USER_NICKNAME", "Ваш Никнейм")
        
        # Создание админ пользователя
        admin_user = db.query(User).filter(User.username == admin_username).first()
        if not admin_user:
            admin_user = User(
                username=admin_username,
                hashed_password=get_password_hash(admin_password)
            )
            db.add(admin_user)
            print(f"✅ Создан пользователь: {admin_username}")
        
        # Создание настроек сайта
        site_settings = db.query(SiteSettings).first()
        if not site_settings:
            site_settings = SiteSettings(
                site_title=f"{user_name} | {site_title}",
                meta_description=f"Персональный сайт-визитка {user_name}",
                hero_title=user_name,
                hero_subtitle=f"{user_nickname} | Разработчик",
                display_name=user_name,  # Полное имя для админ панели
                short_name=user_nickname,  # Короткое имя для админ панели
                about_text=f"""<p><strong>Привет! Меня зовут {user_name}.</strong></p>

<p>Добро пожаловать на мой персональный сайт! Здесь вы можете узнать обо мне больше, ознакомиться с моими проектами и достижениями.</p>

<p>Этот сайт создан с использованием современных технологий: React.js для фронтенда и FastAPI для backend. Вы можете легко настроить его под себя через админ панель.</p>

<p><em>Чтобы изменить этот текст, войдите в админ панель и отредактируйте настройки сайта.</em></p>""",
                github_url="https://github.com/yourusername",
                telegram_url="https://t.me/yourusername",
                email=admin_email,
                profile_image="/static/assets/images/profile.svg",
                primary_color="#3b82f6",
                secondary_color="#1e40af", 
                accent_color="#06b6d4",
                text_color="#ffffff",
                background_color="#0f172a"
            )
            db.add(site_settings)
            print(f"✅ Созданы настройки сайта для: {user_name}")
        
        # Создание категорий целей
        categories = [
            {"name": "Технологии", "order": 1},
            {"name": "Здоровье/Спорт", "order": 2},
            {"name": "Образование", "order": 3},
            {"name": "Путешествия", "order": 4},
            {"name": "Другое", "order": 5}
        ]
        
        for cat_data in categories:
            existing_cat = db.query(GoalCategory).filter(GoalCategory.name == cat_data["name"]).first()
            if not existing_cat:
                category = GoalCategory(**cat_data)
                db.add(category)
        
        # Создание базовых социальных сетей
        social_networks = [
            {
                "name": "GitHub",
                "url": "https://github.com/yourusername",
                "icon_name": "github",
                "show_in_footer": True,
                "show_in_header": False,
                "order": 1
            },
            {
                "name": "Telegram", 
                "url": "https://t.me/yourusername",
                "icon_name": "telegram",
                "show_in_footer": True,
                "show_in_header": False,
                "order": 2
            }
        ]
        
        for social_data in social_networks:
            existing = db.query(SocialNetwork).filter(SocialNetwork.name == social_data["name"]).first()
            if not existing:
                social = SocialNetwork(**social_data)
                db.add(social)
        
        db.commit()
        print("🎉 Инициализация данных завершена!")
    except Exception as e:
        print(f"❌ Ошибка при инициализации данных: {e}")
        db.rollback()
    finally:
        db.close()

# Инициализация при запуске
init_data()

# Auth endpoints
@app.post("/api/auth/login", response_model=Token)
async def login(username: str = Form(), password: str = Form(), db: Session = Depends(get_db)):
    user = authenticate_user(db, username, password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

# Public API endpoints
@app.get("/api/site", response_model=SiteSettingsSchema)
def get_site_settings(db: Session = Depends(get_db)):
    settings = db.query(SiteSettings).first()
    if not settings:
        raise HTTPException(status_code=404, detail="Site settings not found")
    return settings

@app.get("/api/posts", response_model=List[BlogPostSchema])
def get_published_posts(db: Session = Depends(get_db)):
    posts = db.query(BlogPost).filter(BlogPost.published == True).order_by(BlogPost.created_at.desc()).all()
    return posts

@app.get("/api/posts/{slug}", response_model=BlogPostSchema)
def get_post_by_slug(slug: str, db: Session = Depends(get_db)):
    post = db.query(BlogPost).filter(BlogPost.slug == slug, BlogPost.published == True).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    return post

@app.get("/api/goals")
def get_goals(db: Session = Depends(get_db)):
    categories = db.query(GoalCategory).order_by(GoalCategory.order).all()
    result = []
    
    for category in categories:
        goals = db.query(Goal).filter(Goal.category_id == category.id).order_by(Goal.order).all()
        completed_count = len([g for g in goals if g.is_completed])
        total_count = len(goals)
        
        result.append({
            "id": category.id,
            "name": category.name,
            "goals": [
                {
                    "id": goal.id,
                    "text": goal.text,
                    "is_completed": goal.is_completed,
                    "completed_date": goal.completed_date,
                    "order": goal.order
                }
                for goal in goals
            ],
            "stats": {
                "total": total_count,
                "completed": completed_count,
                "percentage": round((completed_count / total_count * 100) if total_count > 0 else 0, 1)
            }
        })
    
    return result

@app.get("/api/social-networks", response_model=List[SocialNetworkSchema])
def get_social_networks(db: Session = Depends(get_db)):
    networks = db.query(SocialNetwork).order_by(SocialNetwork.order).all()
    return networks

@app.get("/api/public/social-networks", response_model=List[SocialNetworkSchema])
def get_public_social_networks(db: Session = Depends(get_db)):
    networks = db.query(SocialNetwork).order_by(SocialNetwork.order).all()
    return networks

@app.get("/api/public/posts", response_model=List[BlogPostSchema])
def get_public_posts(db: Session = Depends(get_db)):
    posts = db.query(BlogPost).order_by(BlogPost.created_at.desc()).all()
    return posts

@app.get("/api/public/goals")
def get_public_goals(db: Session = Depends(get_db)):
    categories = db.query(GoalCategory).order_by(GoalCategory.order).all()
    result = []
    
    for category in categories:
        goals = db.query(Goal).filter(Goal.category_id == category.id).order_by(Goal.order).all()
        completed_count = len([g for g in goals if g.is_completed])
        total_count = len(goals)
        
        result.append({
            "id": category.id,
            "name": category.name,
            "goals": [
                {
                    "id": goal.id,
                    "text": goal.text,
                    "is_completed": goal.is_completed,
                    "completed_date": goal.completed_date,
                    "order": goal.order,
                    "created_at": goal.created_at
                }
                for goal in goals
            ],
            "stats": {
                "total": total_count,
                "completed": completed_count,
                "percentage": round((completed_count / total_count) * 100) if total_count > 0 else 0
            }
        })
    
    return result

# Admin API endpoints (protected)
@app.put("/api/admin/site", response_model=SiteSettingsSchema)
def update_site_settings(
    settings_update: SiteSettingsUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    settings = db.query(SiteSettings).first()
    if not settings:
        settings = SiteSettings()
        db.add(settings)
    
    for field, value in settings_update.dict(exclude_unset=True).items():
        setattr(settings, field, value)
    
    db.commit()
    db.refresh(settings)
    return settings

@app.get("/api/admin/posts", response_model=List[BlogPostSchema])
def get_all_posts(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    posts = db.query(BlogPost).order_by(BlogPost.created_at.desc()).all()
    return posts

@app.post("/api/admin/posts", response_model=BlogPostSchema)
def create_post(
    post: BlogPostCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    from datetime import datetime
    
    post_data = post.dict()
    
    # Если пост публикуется и не указана дата публикации, устанавливаем текущую
    if post_data.get('published') and not post_data.get('published_at'):
        post_data['published_at'] = datetime.now()
    
    db_post = BlogPost(**post_data)
    db.add(db_post)
    db.commit()
    db.refresh(db_post)
    return db_post

@app.put("/api/admin/posts/{post_id}", response_model=BlogPostSchema)
def update_post(
    post_id: int,
    post_update: BlogPostUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    from datetime import datetime
    
    post = db.query(BlogPost).filter(BlogPost.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    
    update_data = post_update.dict(exclude_unset=True)
    
    # Если пост становится опубликованным и не указана дата публикации, устанавливаем текущую
    if update_data.get('published') and not post.published and not update_data.get('published_at'):
        update_data['published_at'] = datetime.now()
    
    for field, value in update_data.items():
        setattr(post, field, value)
    
    db.commit()
    db.refresh(post)
    return post

@app.delete("/api/admin/posts/{post_id}")
def delete_post(
    post_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    post = db.query(BlogPost).filter(BlogPost.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    
    db.delete(post)
    db.commit()
    return {"message": "Post deleted successfully"}

@app.get("/api/admin/goals")
def get_all_goals(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return get_goals(db)

@app.post("/api/admin/goals", response_model=GoalSchema)
def create_goal(
    goal: GoalCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_goal = Goal(**goal.dict())
    db.add(db_goal)
    db.commit()
    db.refresh(db_goal)
    return db_goal

@app.put("/api/admin/goals/{goal_id}", response_model=GoalSchema)
def update_goal(
    goal_id: int,
    goal_update: GoalUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    goal = db.query(Goal).filter(Goal.id == goal_id).first()
    if not goal:
        raise HTTPException(status_code=404, detail="Goal not found")
    
    for field, value in goal_update.dict(exclude_unset=True).items():
        setattr(goal, field, value)
    
    db.commit()
    db.refresh(goal)
    return goal

@app.delete("/api/admin/goals/{goal_id}")
def delete_goal(
    goal_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    goal = db.query(Goal).filter(Goal.id == goal_id).first()
    if not goal:
        raise HTTPException(status_code=404, detail="Goal not found")
    
    db.delete(goal)
    db.commit()
    return {"message": "Goal deleted successfully"}

@app.get("/api/admin/categories", response_model=List[GoalCategorySchema])
def get_categories(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    categories = db.query(GoalCategory).order_by(GoalCategory.order).all()
    return categories

@app.post("/api/admin/categories", response_model=GoalCategorySchema)
def create_category(
    category: GoalCategoryCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_category = GoalCategory(**category.dict())
    db.add(db_category)
    db.commit()
    db.refresh(db_category)
    return db_category

# Temporary endpoint for creating users (remove in production)
@app.post("/api/create-user", response_model=UserSchema)
def create_user_temp(user: UserCreate, db: Session = Depends(get_db)):
    hashed_password = get_password_hash(user.password)
    db_user = User(username=user.username, hashed_password=hashed_password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

# Эндпоинт для загрузки изображения профиля
@app.post("/api/admin/upload-profile-image")
async def upload_profile_image(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    import os
    import shutil
    from pathlib import Path
    
    # Проверяем тип файла
    allowed_types = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"]
    if file.content_type not in allowed_types:
        raise HTTPException(
            status_code=400, 
            detail="Неподдерживаемый тип файла. Разрешены: JPEG, PNG, GIF, WebP"
        )
    
    # Проверяем размер файла (максимум 5MB)
    max_size = 5 * 1024 * 1024  # 5MB
    file_content = await file.read()
    if len(file_content) > max_size:
        raise HTTPException(
            status_code=400,
            detail="Файл слишком большой. Максимальный размер: 5MB"
        )
    
    # Создаем папку если не существует
    upload_dir = Path("static/assets/images")
    upload_dir.mkdir(parents=True, exist_ok=True)
    
    # Определяем расширение файла
    file_extension = file.filename.split('.')[-1].lower()
    new_filename = f"profile.{file_extension}"
    file_path = upload_dir / new_filename
    
    # Сохраняем файл
    with open(file_path, "wb") as buffer:
        buffer.write(file_content)
    
    # Обновляем путь в базе данных
    settings = db.query(SiteSettings).first()
    if not settings:
        settings = SiteSettings()
        db.add(settings)
    
    settings.profile_image = f"/static/assets/images/{new_filename}"
    db.commit()
    db.refresh(settings)
    
    return {
        "message": "Изображение профиля успешно загружено",
        "profile_image": settings.profile_image
    }

# Эндпоинт для смены пароля
@app.post("/api/admin/change-password")
async def change_password(
    current_password: str = Form(),
    new_password: str = Form(),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    from .auth import verify_password
    
    # Проверяем текущий пароль
    if not verify_password(current_password, current_user.hashed_password):
        raise HTTPException(
            status_code=400,
            detail="Неверный текущий пароль"
        )
    
    # Проверяем длину нового пароля
    if len(new_password) < 4:
        raise HTTPException(
            status_code=400,
            detail="Новый пароль должен содержать минимум 4 символа"
        )
    
    # Обновляем пароль
    current_user.hashed_password = get_password_hash(new_password)
    db.commit()
    
    return {"message": "Пароль успешно изменен"}

# Эндпоинт для изменения имени пользователя
@app.post("/api/admin/change-username")
async def change_username(
    new_username: str = Form(),
    password: str = Form(),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    from .auth import verify_password
    
    # Проверяем пароль для подтверждения
    if not verify_password(password, current_user.hashed_password):
        raise HTTPException(
            status_code=400,
            detail="Неверный пароль"
        )
    
    # Проверяем длину нового имени пользователя
    if len(new_username) < 3:
        raise HTTPException(
            status_code=400,
            detail="Имя пользователя должно содержать минимум 3 символа"
        )
    
    # Проверяем, не занято ли имя пользователя
    existing_user = db.query(User).filter(User.username == new_username, User.id != current_user.id).first()
    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Это имя пользователя уже занято"
        )
    
    # Обновляем имя пользователя
    current_user.username = new_username
    db.commit()
    
    return {"message": "Имя пользователя успешно изменено"}

# Эндпоинт для получения информации о текущем пользователе
@app.get("/api/admin/user-info")
async def get_user_info(
    current_user: User = Depends(get_current_user)
):
    return {
        "username": current_user.username,
        "id": current_user.id
    }

# Social Networks CRUD
@app.get("/api/admin/social-networks", response_model=List[SocialNetworkSchema])
def get_admin_social_networks(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    networks = db.query(SocialNetwork).order_by(SocialNetwork.order).all()
    return networks

@app.post("/api/admin/social-networks", response_model=SocialNetworkSchema)
def create_social_network(
    network: SocialNetworkCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_network = SocialNetwork(**network.dict())
    db.add(db_network)
    db.commit()
    db.refresh(db_network)
    return db_network

@app.put("/api/admin/social-networks/{network_id}", response_model=SocialNetworkSchema)
def update_social_network(
    network_id: int,
    network: SocialNetworkUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_network = db.query(SocialNetwork).filter(SocialNetwork.id == network_id).first()
    if not db_network:
        raise HTTPException(status_code=404, detail="Social network not found")
    
    for field, value in network.dict(exclude_unset=True).items():
        setattr(db_network, field, value)
    
    db.commit()
    db.refresh(db_network)
    return db_network

@app.delete("/api/admin/social-networks/{network_id}")
def delete_social_network(
    network_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_network = db.query(SocialNetwork).filter(SocialNetwork.id == network_id).first()
    if not db_network:
        raise HTTPException(status_code=404, detail="Social network not found")
    
    db.delete(db_network)
    db.commit()
    return {"message": "Social network deleted successfully"}

# Endpoint для заполнения демо данных
@app.post("/api/admin/seed-data")
def seed_demo_data(
    options: dict = None,
    db: Session = Depends(get_db)
):
    """Заполняет базу данных демо данными"""
    try:
        if options is None:
            options = {
                "siteSettings": True,
                "socialNetworks": True,
                "goalCategories": True,
                "goals": True,
                "blogPosts": True
            }

        created_items = []

        # Создание настроек сайта
        if options.get("siteSettings", True):
            site_settings = db.query(SiteSettings).first()
            if not site_settings:
                site_settings = SiteSettings(
                    site_title="Иванцов Никита | Персональный сайт",
                    meta_description="Персональный сайт-визитка Иванцова Никиты - студента и программиста",
                    hero_title="Иванцов Никита",
                    hero_subtitle="Студент, Программист, Разработчик",
                    about_text="""<p><strong>Привет!</strong></p>
<p>Я обладаю высокой организованностью и ответственностью, что позволяет мне эффективно работать в команде. Мой отличительной чертой является трудолюбие и развитые аналитические способности, особенно в области программирования.</p>
<p>В настоящее время я учусь на третьем курсе по специальности «Информационные системы и программирование». Мой опыт включает в себя навыки работы с Python, 1С, HTML и базовые представления о Машинном обучении.</p>
<p>Кроме того, я с большим удовольствием осваиваю Photoshop и программы для видеомонтажа.</p>""",
                    github_url="https://github.com/atikin900",
                    telegram_url="https://t.me/atikin90",
                    email="example@example.com",
                    profile_image="/static/assets/images/profile.svg",
                    primary_color="#3b82f6",
                    secondary_color="#1e40af", 
                    accent_color="#06b6d4",
                    text_color="#ffffff",
                    background_color="#0f172a"
                )
                db.add(site_settings)
                created_items.append("Настройки сайта")
        
        # Создание социальных сетей
        if options.get("socialNetworks", True):
            social_networks = [
            {
                "name": "GitHub",
                "url": "https://github.com/atikin900",
                "icon_name": "github",
                "show_in_footer": True,
                "show_in_header": False,
                "order": 1
            },
            {
                "name": "Telegram", 
                "url": "https://t.me/atikin90",
                "icon_name": "telegram",
                "show_in_footer": True,
                "show_in_header": False,
                "order": 2
            }
            ]
            
            for social_data in social_networks:
                existing = db.query(SocialNetwork).filter(SocialNetwork.name == social_data["name"]).first()
                if not existing:
                    social = SocialNetwork(**social_data)
                    db.add(social)
                    created_items.append(f"Соцсеть: {social_data['name']}")
        
        # Создание категорий целей
        if options.get("goalCategories", True):
            categories_data = [
            {"name": "Образование", "order": 1},
            {"name": "Карьера", "order": 2},
            {"name": "Личное развитие", "order": 3}
            ]
            
            for cat_data in categories_data:
                existing = db.query(GoalCategory).filter(GoalCategory.name == cat_data["name"]).first()
                if not existing:
                    category = GoalCategory(**cat_data)
                    db.add(category)
                    created_items.append(f"Категория целей: {cat_data['name']}")
        
        db.commit()
        
        # Создание целей
        if options.get("goals", True):
            education_cat = db.query(GoalCategory).filter(GoalCategory.name == "Образование").first()
            career_cat = db.query(GoalCategory).filter(GoalCategory.name == "Карьера").first()
            personal_cat = db.query(GoalCategory).filter(GoalCategory.name == "Личное развитие").first()
            
            goals_data = [
            {
                "text": "Изучить React.js и создать 3 проекта",
                "category_id": education_cat.id if education_cat else 1,
                "is_completed": True,
                "completed_date": "2024-10-15",
                "order": 1
            },
            {
                "text": "Освоить FastAPI для backend разработки",
                "category_id": education_cat.id if education_cat else 1,
                "is_completed": True,
                "completed_date": "2024-10-20",
                "order": 2
            },
            {
                "text": "Получить диплом по специальности",
                "category_id": education_cat.id if education_cat else 1,
                "is_completed": False,
                "order": 3
            },
            {
                "text": "Найти работу Python разработчиком",
                "category_id": career_cat.id if career_cat else 2,
                "is_completed": False,
                "order": 1
            },
            {
                "text": "Создать портфолио из 5 проектов",
                "category_id": career_cat.id if career_cat else 2,
                "is_completed": False,
                "order": 2
            },
            {
                "text": "Изучить английский язык до уровня B2",
                "category_id": personal_cat.id if personal_cat else 3,
                "is_completed": False,
                "order": 1
            }
            ]
            
            for goal_data in goals_data:
                existing = db.query(Goal).filter(Goal.text == goal_data["text"]).first()
                if not existing:
                    goal = Goal(**goal_data)
                    db.add(goal)
                    created_items.append(f"Цель: {goal_data['text'][:30]}...")
        
        # Создание демо постов блога
        if options.get("blogPosts", True):
            posts_data = [
            {
                "title": "Мой путь в программирование",
                "slug": "my-programming-journey",
                "excerpt": "История о том, как я начал изучать программирование и какие технологии освоил",
                "content": """<h2>Начало пути</h2>
<p>Всё началось с простого интереса к тому, как работают компьютеры и сайты. Первым языком программирования, который я изучил, был Python.</p>

<h2>Изучение веб-технологий</h2>
<p>После освоения основ Python я перешел к изучению веб-разработки: HTML, CSS, JavaScript. Это открыло для меня мир фронтенд разработки.</p>

<h2>Современные технологии</h2>
<p>Сейчас я активно изучаю React.js и FastAPI, создаю полноценные веб-приложения с современной архитектурой.</p>""",
                "published": True
            },
            {
                "title": "Создание персонального сайта",
                "slug": "creating-personal-website", 
                "excerpt": "Процесс разработки этого сайта с использованием React и FastAPI",
                "content": """<h2>Выбор технологий</h2>
<p>Для создания этого сайта я выбрал современный стек: React.js для фронтенда и FastAPI для backend API.</p>

<h2>Архитектура проекта</h2>
<p>Проект состоит из трех частей: фронтенд на React, админ панель и API на FastAPI. Это позволяет легко управлять контентом.</p>

<h2>Функциональность</h2>
<p>Сайт включает в себя портфолио, блог, систему целей и полноценную админ панель для управления контентом.</p>""",
                "published": True
            }
            ]
            
            for post_data in posts_data:
                existing = db.query(BlogPost).filter(BlogPost.slug == post_data["slug"]).first()
                if not existing:
                    post = BlogPost(**post_data)
                    db.add(post)
                    created_items.append(f"Пост блога: {post_data['title']}")
        
        db.commit()
        return {
            "message": "Демо данные успешно созданы!",
            "created_items": created_items
        }
        
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Ошибка при создании демо данных: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)