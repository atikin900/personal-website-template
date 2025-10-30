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
    """Заполняет базу данных начальными демо-данными"""
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
                site_title="Ваше Имя | Персональный сайт",
                meta_description="Персональный сайт-визитка. Портфолио, блог и достижения.",
                hero_title="Ваше Имя",
                hero_subtitle="Ваша Профессия, Ваши Навыки",
                about_text="""<p><strong>Привет! Это демо-текст.</strong></p>
<p>Здесь вы можете рассказать о себе, своих навыках и опыте. Это текст можно легко изменить через админ панель.</p>
<p>Расскажите о своём образовании, проектах и интересах. Сделайте текст уникальным и интересным!</p>""",
                github_url="https://github.com/yourusername",
                telegram_url="https://t.me/yourusername",
                email="your.email@example.com",
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
        
        # 5. Создание демо целей
        education_cat = db.query(GoalCategory).filter(GoalCategory.name == "Образование").first()
        career_cat = db.query(GoalCategory).filter(GoalCategory.name == "Карьера").first()
        personal_cat = db.query(GoalCategory).filter(GoalCategory.name == "Личное развитие").first()
        
        goals_data = [
            {
                "text": "Изучить современный фреймворк для веб-разработки",
                "category_id": education_cat.id if education_cat else 1,
                "is_completed": True,
                "completed_date": "2024-10-15",
                "order": 1
            },
            {
                "text": "Создать персональный сайт-портфолио",
                "category_id": education_cat.id if education_cat else 1,
                "is_completed": True,
                "completed_date": "2024-10-20",
                "order": 2
            },
            {
                "text": "Завершить обучение по специальности",
                "category_id": education_cat.id if education_cat else 1,
                "is_completed": False,
                "order": 3
            },
            {
                "text": "Найти работу по специальности",
                "category_id": career_cat.id if career_cat else 2,
                "is_completed": False,
                "order": 1
            },
            {
                "text": "Создать портфолио из 5+ проектов",
                "category_id": career_cat.id if career_cat else 2,
                "is_completed": False,
                "order": 2
            },
            {
                "text": "Улучшить навыки английского языка",
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
                "title": "Добро пожаловать на мой сайт!",
                "slug": "welcome-to-my-website",
                "excerpt": "Первый пост в блоге. Рассказываю о том, зачем создал этот сайт и что планирую публиковать.",
                "content": """<h2>Добро пожаловать!</h2>
<p>Это первый пост в моём блоге. Здесь я буду делиться своими мыслями, проектами и достижениями.</p>

<h2>О чём будет блог</h2>
<p>В блоге я планирую публиковать статьи о программировании, своих проектах и интересных находках.</p>

<h2>Следите за обновлениями</h2>
<p>Подписывайтесь на мои социальные сети, чтобы не пропустить новые посты!</p>""",
                "published": True
            },
            {
                "title": "Как создать персональный сайт",
                "slug": "how-to-create-personal-website", 
                "excerpt": "Пошаговое руководство по созданию собственного сайта-портфолио",
                "content": """<h2>Выбор технологий</h2>
<p>Первый шаг - выбрать подходящий стек технологий. Для современного сайта подойдут React, Vue или другие фреймворки.</p>

<h2>Проектирование</h2>
<p>Важно продумать структуру сайта, какие разделы будут, какой функционал необходим.</p>

<h2>Разработка и деплой</h2>
<p>После разработки нужно выбрать хостинг и задеплоить сайт. Есть множество бесплатных вариантов!</p>""",
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
        print("\n🎉 База данных успешно заполнена демо-данными!")
        print("⚠️  Не забудьте изменить данные через админ панель!")
        
    except Exception as e:
        print(f"❌ Ошибка при заполнении базы данных: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()
