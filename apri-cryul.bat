@echo off
cd /d "%~dp0"

curl.exe -s -o NUL -f --max-time 3 http://localhost:3000/
if errorlevel 1 (
  start "CRYUL server" cmd /k "npm run dev"
  echo Attendo che il sito parta...
  timeout /t 8 /nobreak >nul
)

start "" "http://localhost:3000/"
