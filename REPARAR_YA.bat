@echo off  
echo [MODO EMERGENCIA: ACTIVADO]  
start /b cmd /c "cd backend && npm run dev"  
start /b cmd /c "cd frontend && npm run dev"  
timeout /t 10  
start http://localhost:5173/admin/login 
