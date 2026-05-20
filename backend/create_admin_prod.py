import psycopg2
from passlib.context import CryptContext
import os

# Password hasher
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Production database URL (your Render PostgreSQL)
DATABASE_URL = "postgresql://adaptive_learning_qzf1_user:JoN4jDIKwvSXCdcpNJ9YySM2aVsXQxpO@dpg-cth5r3btq21c73arj8p0-a.oregon-postgres.render.com/adaptive_learning_qzf1"

# Admin details
admin_name = "Admin User"
admin_email = "admin@gmail.com"
admin_password = "admin123"  # Change this!

# Hash password
hashed_password = pwd_context.hash(admin_password)

# Connect and create admin
try:
    conn = psycopg2.connect(DATABASE_URL, sslmode='require')
    cursor = conn.cursor()
    
    # Check if admin table exists, if not use students table
    cursor.execute("""
        INSERT INTO admins (name, email, password, role)
        VALUES (%s, %s, %s, %s)
        ON CONFLICT (email) DO UPDATE 
        SET password = EXCLUDED.password, role = 'admin'
    """, (admin_name, admin_email, hashed_password, 'admin'))
    
    conn.commit()
    print(f'✅ Admin created successfully!')
    print(f'Email: {admin_email}')
    print(f'Password: {admin_password}')
    
except Exception as e:
    print(f'Error: {e}')
    print('Trying students table instead...')
    try:
        cursor.execute("""
            INSERT INTO students (name, email, password, role, current_topic, difficulty_level)
            VALUES (%s, %s, %s, %s, %s, %s)
            ON CONFLICT (email) DO UPDATE 
            SET password = EXCLUDED.password, role = 'admin'
        """, (admin_name, admin_email, hashed_password, 'admin', 'Python Basics', 1))
        
        conn.commit()
        print(f'✅ Admin created in students table!')
        print(f'Email: {admin_email}')
        print(f'Password: {admin_password}')
    except Exception as e2:
        print(f'Failed: {e2}')
finally:
    if conn:
        conn.close()
