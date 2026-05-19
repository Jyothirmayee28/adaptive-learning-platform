import sqlite3

conn = sqlite3.connect('adaptive_learning.db')  # Changed from students.db
cursor = conn.cursor()

print("All students in database:")
cursor.execute('SELECT id, email, role FROM students')
for row in cursor.fetchall():
    print(f"ID: {row[0]}, Email: {row[1]}, Role: {row[2]}")

conn.close()