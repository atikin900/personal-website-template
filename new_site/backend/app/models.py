from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from .database import Base

class SiteSettings(Base):
    __tablename__ = "site_settings"
    
    id = Column(Integer, primary_key=True, index=True)
    site_title = Column(String, default="Иванцов Никита | Персональный сайт")
    meta_description = Column(Text, default="Персональный сайт-визитка Иванцова Никиты")
    hero_title = Column(String, default="Иванцов Никита")
    hero_subtitle = Column(String, default="Студент, Программист, Разработчик")
    about_text = Column(Text)
    github_url = Column(String, default="https://github.com/atikin900")
    telegram_url = Column(String, default="https://t.me/atikin90")
    email = Column(String, default="example@example.com")
    profile_image = Column(String, default="/static/assets/images/profile.svg")
    # Отображаемые имена для админ панели
    display_name = Column(String, default="Ваше Имя")  # Полное имя
    short_name = Column(String, default="Имя")  # Короткое имя
    # Цветовые настройки
    primary_color = Column(String, default="#3b82f6")  # Основной цвет
    secondary_color = Column(String, default="#1e40af")  # Вторичный цвет
    accent_color = Column(String, default="#06b6d4")  # Акцентный цвет
    text_color = Column(String, default="#ffffff")  # Цвет текста
    background_color = Column(String, default="#0f172a")  # Цвет фона
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

class BlogPost(Base):
    __tablename__ = "blog_posts"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    slug = Column(String, unique=True, nullable=False, index=True)
    excerpt = Column(Text)
    content = Column(Text, nullable=False)
    cover_image = Column(String)
    published = Column(Boolean, default=False)
    published_at = Column(DateTime(timezone=True))  # Дата и время публикации
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

class GoalCategory(Base):
    __tablename__ = "goal_categories"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    order = Column(Integer, default=0)
    
    goals = relationship("Goal", back_populates="category")

class Goal(Base):
    __tablename__ = "goals"
    
    id = Column(Integer, primary_key=True, index=True)
    text = Column(String, nullable=False)
    category_id = Column(Integer, ForeignKey("goal_categories.id"))
    is_completed = Column(Boolean, default=False)
    completed_date = Column(String)
    order = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    category = relationship("GoalCategory", back_populates="goals")

class SocialNetwork(Base):
    __tablename__ = "social_networks"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)  # Название соцсети (например, "GitHub")
    url = Column(String, nullable=False)   # Ссылка на профиль
    icon_name = Column(String, nullable=False)  # Название иконки (например, "github")
    show_in_footer = Column(Boolean, default=True)  # Показывать в футере (с названием)
    show_in_header = Column(Boolean, default=False)  # Показывать в хедере (только иконка)
    order = Column(Integer, default=0)  # Порядок отображения
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())