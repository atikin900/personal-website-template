from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

# Site Settings Schemas
class SiteSettingsBase(BaseModel):
    site_title: Optional[str] = None
    meta_description: Optional[str] = None
    hero_title: Optional[str] = None
    hero_subtitle: Optional[str] = None
    about_text: Optional[str] = None
    github_url: Optional[str] = None
    telegram_url: Optional[str] = None
    email: Optional[str] = None
    profile_image: Optional[str] = None
    # Отображаемые имена для админ панели
    display_name: Optional[str] = None  # Полное имя (например, "Иванцов Никита")
    short_name: Optional[str] = None    # Короткое имя (например, "Никита")
    # Цветовые настройки
    primary_color: Optional[str] = None
    secondary_color: Optional[str] = None
    accent_color: Optional[str] = None
    text_color: Optional[str] = None
    background_color: Optional[str] = None

class SiteSettingsCreate(SiteSettingsBase):
    pass

class SiteSettingsUpdate(SiteSettingsBase):
    pass

class SiteSettings(SiteSettingsBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

# Blog Post Schemas
class BlogPostBase(BaseModel):
    title: str
    slug: str
    excerpt: Optional[str] = None
    content: str
    cover_image: Optional[str] = None
    published: bool = False
    published_at: Optional[datetime] = None

class BlogPostCreate(BlogPostBase):
    pass

class BlogPostUpdate(BaseModel):
    title: Optional[str] = None
    slug: Optional[str] = None
    excerpt: Optional[str] = None
    content: Optional[str] = None
    cover_image: Optional[str] = None
    published: Optional[bool] = None
    published_at: Optional[datetime] = None

class BlogPost(BlogPostBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

# Goal Category Schemas
class GoalCategoryBase(BaseModel):
    name: str
    order: int = 0

class GoalCategoryCreate(GoalCategoryBase):
    pass

class GoalCategoryUpdate(BaseModel):
    name: Optional[str] = None
    order: Optional[int] = None

class GoalCategory(GoalCategoryBase):
    id: int
    
    class Config:
        from_attributes = True

# Goal Schemas
class GoalBase(BaseModel):
    text: str
    category_id: int
    is_completed: bool = False
    completed_date: Optional[str] = None
    order: int = 0

class GoalCreate(GoalBase):
    pass

class GoalUpdate(BaseModel):
    text: Optional[str] = None
    category_id: Optional[int] = None
    is_completed: Optional[bool] = None
    completed_date: Optional[str] = None
    order: Optional[int] = None

class Goal(GoalBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    category: Optional[GoalCategory] = None
    
    class Config:
        from_attributes = True

# User Schemas
class UserBase(BaseModel):
    username: str

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    is_active: bool
    created_at: datetime
    
    class Config:
        from_attributes = True

# Social Network Schemas
class SocialNetworkBase(BaseModel):
    name: str
    url: str
    icon_name: str
    show_in_footer: bool = True
    show_in_header: bool = False
    order: int = 0

class SocialNetworkCreate(SocialNetworkBase):
    pass

class SocialNetworkUpdate(BaseModel):
    name: Optional[str] = None
    url: Optional[str] = None
    icon_name: Optional[str] = None
    show_in_footer: Optional[bool] = None
    show_in_header: Optional[bool] = None
    order: Optional[int] = None

class SocialNetwork(SocialNetworkBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

# Auth Schemas
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None