Write-Host "--- Iniciando Setup de FamilyGasto ---" -ForegroundColor Cyan

# Backend
Write-Host "Instalando dependencias del Backend..."
cd backend
npm install
if ($LASTEXITCODE -ne 0) { Write-Host "Error instalando backend" -ForegroundColor Red; exit }

# Frontend
Write-Host "Instalando dependencias del Frontend..."
cd ../frontend
npm install
if ($LASTEXITCODE -ne 0) { Write-Host "Error instalando frontend" -ForegroundColor Red; exit }

Write-Host "--- Setup Completado Exitosamente ---" -ForegroundColor Green
Write-Host "1. Asegúrate de tener PostgreSQL corriendo."
Write-Host "2. Configura el .env en la carpeta /backend."
Write-Host "3. Ejecuta 'npm run dev' en ambas carpetas."
