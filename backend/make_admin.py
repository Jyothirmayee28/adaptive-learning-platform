import sqlite3

email = 'jyothi@gmail.com'  # Change this to whichever email you want to make admin

conn = sqlite3.connect('adaptive_learning.db')
cursor = conn.cursor()

# Update role to admin
cursor.execute('UPDATE students SET role = ? WHERE email = ?', ('admin', email))
conn.commit()

# Verify
cursor.execute('SELECT email, role FROM students WHERE email = ?', (email,))
result = cursor.fetchone()

if result:
    print(f"✅ Success! {result[0]} is now {result[1]}")
else:
    print("❌ User not found")

conn.close()