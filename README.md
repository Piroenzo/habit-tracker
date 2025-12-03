# Habit Tracker

Guía rápida para levantar y probar el backend y el frontend del proyecto.

## Backend (Flask)

1. **Instala dependencias**
   ```bash
   cd backend
   python -m venv .venv
   source .venv/bin/activate
   pip install -r requirements.txt
   ```

2. **Configura variables de entorno** (ejemplo `.env` en `backend/`):
   ```env
   SECRET_KEY=dev-secret
   JWT_SECRET_KEY=dev-jwt-secret
   # Para Postgres opcional
   # DB_USER=usuario
   # DB_PASSWORD=clave
   # DB_HOST=localhost
   # DB_PORT=5432
   # DB_NAME=habits
   ```
   Si no se definen variables de base de datos se usa SQLite (`sqlite:///habits.db`).

3. **Inicializa la base de datos**
   ```bash
   # Desde backend/
   export FLASK_APP=app.py
   flask db upgrade
   ```

4. **Arranca el servidor**
   ```bash
   flask --app app.py run --debug
   ```
   La API queda disponible en `http://127.0.0.1:5000` con CORS habilitado.

5. **Smoke test de sintaxis**
   ```bash
   python -m compileall backend
   ```

6. **Pruebas manuales rápidas**
   ```bash
   # Registro
   curl -X POST http://127.0.0.1:5000/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{"email":"demo@example.com","password":"demo123"}'

   # Login (guarda el token)
   TOKEN=$(curl -s -X POST http://127.0.0.1:5000/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"demo@example.com","password":"demo123"}' | jq -r .access_token)

   # Crear hábito
   curl -X POST http://127.0.0.1:5000/api/habits/ \
     -H "Content-Type: application/json" -H "Authorization: Bearer $TOKEN" \
     -d '{"name":"Leer","frequency":"daily"}'

   # Registrar progreso
   curl -X POST http://127.0.0.1:5000/api/habits/1/log \
     -H "Content-Type: application/json" -H "Authorization: Bearer $TOKEN" \
     -d '{"completed":true,"date":"2025-01-01"}'

   # Consultar logros
   curl -H "Authorization: Bearer $TOKEN" http://127.0.0.1:5000/api/habits/achievements
   ```

## Frontend (Vite + React)

1. **Instala dependencias**
   ```bash
   cd frontend
   npm install
   ```

2. **Arranca el cliente**
   ```bash
   npm run dev -- --host --port 5173
   ```

3. Abre `http://127.0.0.1:5173` y apunta las peticiones al backend (`http://127.0.0.1:5000`).
