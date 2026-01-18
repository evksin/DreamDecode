# Настройка OAuth Google и секретов

Ниже — как получить `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` и `AUTH_SECRET`.

## 1) GOOGLE_CLIENT_ID и GOOGLE_CLIENT_SECRET

1. Откройте Google Cloud Console: https://console.cloud.google.com/
2. Создайте проект (или выберите существующий).
3. Перейдите в **APIs & Services → OAuth consent screen**.
4. Выберите тип **External** и заполните обязательные поля.
5. Перейдите в **APIs & Services → Credentials**.
6. Нажмите **Create Credentials → OAuth client ID**.
7. Application type: **Web application**.
8. Добавьте **Authorized redirect URIs**:
   - Для локальной разработки:
     - `http://localhost:3000/api/auth/callback/google`
   - Для Vercel (замените домен на свой):
     - `https://dream-decode.vercel.app/api/auth/callback/google`
9. Сохраните — получите `Client ID` и `Client Secret`.

Значения:
- `Client ID` → `GOOGLE_CLIENT_ID`
- `Client Secret` → `GOOGLE_CLIENT_SECRET`

## 2) AUTH_SECRET

Это секрет для подписи токенов Auth.js.

Сгенерируйте в PowerShell:

```powershell
$bytes = New-Object byte[] 32
[System.Security.Cryptography.RandomNumberGenerator]::Create().GetBytes($bytes)
[System.Convert]::ToBase64String($bytes)
```

Скопируйте результат и используйте как `AUTH_SECRET`.

## 3) Где задавать переменные

### Локально
Создайте `.env.local` в корне проекта:

```powershell
@"
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
AUTH_SECRET=...
DATABASE_URL=...
"@ | Set-Content -Path .\.env.local -Encoding UTF8
```

### Vercel
Проект → **Settings → Environment Variables** → добавить те же ключи.

