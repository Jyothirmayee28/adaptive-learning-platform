import psycopg2

conn = psycopg2.connect(
    "postgresql://adaptive_learning_qzf1_user:JoN4jDIKwvSXCdcpNJ9YySM2aVsXQxpO@dpg-cth5r3btq21c73arj8p0-a.oregon-postgres.render.com/adaptive_learning_qzf1",
    sslmode='require'
)
cursor = conn.cursor()

cursor.execute("UPDATE students SET role = 'admin' WHERE email = 'jyothi@gmail.com'")
conn.commit()

cursor.execute("SELECT id, email, role FROM students WHERE email = 'jyothi@gmail.com'")
result = cursor.fetchone()
print(f'Updated! ID: {result[0]}, Email: {result[1]}, Role: {result[2]}')

conn.close()
