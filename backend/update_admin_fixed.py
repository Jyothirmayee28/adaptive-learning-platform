import psycopg2
import ssl

conn = psycopg2.connect(
    host="dpg-cth5r3btq21c73arj8p0-a.oregon-postgres.render.com",
    database="adaptive_learning_qzf1",
    user="adaptive_learning_qzf1_user",
    password="JoN4jDIKwvSXCdcpNJ9YySM2aVsXQxpO",
    port=5432,
    sslmode='require'
)

cursor = conn.cursor()

cursor.execute("UPDATE students SET role = 'admin' WHERE email = 'jyothi@gmail.com'")
conn.commit()

cursor.execute("SELECT id, email, role FROM students WHERE email = 'jyothi@gmail.com'")
result = cursor.fetchone()
print(f'✅ SUCCESS! Email: {result[1]}, Role: {result[2]}')

conn.close()
