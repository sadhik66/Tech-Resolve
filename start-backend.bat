@echo off
cd /d "%~dp0backend"
if not exist .env (
  echo Missing backend\.env. Copy backend\.env.example to backend\.env and configure MongoDB first.
  pause
  exit /b 1
)
call npm run dev
pause
