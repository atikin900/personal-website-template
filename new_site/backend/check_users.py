import sys
import os
sys.path.append(os.path.dirname(__file__))

from app.database import SessionLocal
from app.models import User
from app.auth import get_password_hash, verify_password

db = SessionLocal()
try:
    users = db.query(User).all()
    print(f"Found {len(users)} users:")
    for user in users:
        print(f"- {user.username} (ID: {user.id})")
    
    # Test password verification
    if users:
        user = users[0]
        print(f"\nTesting password for user '{user.username}':")
        print(f"Stored hash: {user.hashed_password[:50]}...")
        
        test_passwords = ['admin', 'admin123']
        for pwd in test_passwords:
            result = verify_password(pwd, user.hashed_password)
            print(f"Password '{pwd}': {'✓' if result else '✗'}")
            
finally:
    db.close()