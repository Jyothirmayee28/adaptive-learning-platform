@echo off
cd /d C:\Users\pavil\OneDrive\Desktop\adaptive-learning\backend
call C:\Users\pavil\OneDrive\Desktop\adaptive-learning\.venv\Scripts\activate.bat
python -m uvicorn main:app --host 127.0.0.1 --port 8000
pause