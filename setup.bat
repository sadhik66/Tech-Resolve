@echo off
setlocal
cd /d "%~dp0"
echo Installing backend dependencies...
cd backend
call npm install
if errorlevel 1 goto failed
echo.
echo Installing frontend dependencies...
cd ..\frontend
call npm install
if errorlevel 1 goto failed
echo.
echo Setup completed. Configure backend\.env before starting the app.
pause
exit /b 0
:failed
echo.
echo Installation failed. Check your internet connection and Node.js/npm installation.
pause
exit /b 1
