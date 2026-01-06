@echo off
echo ========================================
echo   Kalepalle Sankranthi 2026 Setup
echo ========================================
echo.

echo Installing Node.js dependencies...
npm install

if %errorlevel% neq 0 (
    echo.
    echo ERROR: Failed to install dependencies
    echo Please make sure Node.js is installed on your system
    echo Download from: https://nodejs.org/
    pause
    exit /b 1
)

echo.
echo ========================================
echo   Setup Complete!
echo ========================================
echo.
echo To start the server:
echo   npm start
echo.
echo To access the website:
echo   http://localhost:3000
echo.
echo To access admin panel:
echo   http://localhost:3000/admin.html
echo.
echo Database: SQLite (festival.db) - No cloud setup needed!
echo.
pause