@echo off
echo Starting Cognitive DSA Project...

:: Start Backend
start "Backend API" cmd /k "cd backend && call venv\Scripts\activate && python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000"

:: Start Frontend
start "Frontend UI" cmd /k "npm run dev"

echo.
echo Project is launching!
echo Frontend: http://localhost:5173
echo Backend: http://localhost:8000
echo.
pause
