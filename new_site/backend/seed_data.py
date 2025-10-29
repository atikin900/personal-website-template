#!/usr/bin/env python3

import sys
import os
import requests
import json

# Добавляем текущую директорию в путь
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.database import SessionLocal
from app.models import SiteSettings, BlogPost, GoalCategory, Goal, User, SocialNetwork
from app.auth import get_password_hash

def seed_database():
    """Заполняет базу данных начальными данными"""
    db = SessionLocal()
    
    try:
        print("🌱 Заполнение базы данных...")
        
        # 1. Создание админ пользователя
        admin_user = db.query(User).filter(User.username == "admin").first()
        if not admin_user:
            admin_user = User(
                username="admin",
                hashed_password=get_password_hash("admin")
            )
            db.add(admin_user)
            print("✅ Создан админ пользователь (admin/admin)")
        
        # 2. Создание настроек сайта
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
            print("✅ Созданы настройки сайта")
        
        # 3. Создание социальных сетей
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
                print(f"✅ Создана соцсеть: {social_data['name']}")
        
        # 4. Создание категорий целей
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
                print(f"✅ Создана категория целей: {cat_data['name']}")
        
        db.commit()
        
        # 5. Создание целей
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
                print(f"✅ Создана цель: {goal_data['text'][:50]}...")
        
        # 6. Создание демо постов блога
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
                print(f"✅ Создан пост: {post_data['title']}")
        
        db.commit()
        print("\n🎉 База данных успешно заполнена!")
        
    except Exception as e:
        print(f"❌ Ошибка при заполнении базы данных: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()