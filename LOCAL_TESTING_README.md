# 🚀 Lokális Tesztelés - Supabase Edge Functions

## Gyors Indítás

### 1. Előfeltételek ellenőrzése
```powershell
# Supabase CLI
npm install -g supabase

# Docker Desktop futnia kell
docker --version
```

### 2. Lokális környezet indítása
```powershell
# Teljes setup + teszt
.\scripts\test-local-supabase.ps1

# VAGY manuálisan:
supabase start
supabase functions serve publish-scheduled-posts --debug
```

### 3. Gyors tesztelés
```powershell
# Alapvető teszt
.\scripts\test-quick-edge.ps1 simple

# Részletes teszt  
.\scripts\test-quick-edge.ps1 detailed
```

## Lokális URL-ek

| Szolgáltatás | URL | Leírás |
|--------------|-----|--------|
| **Supabase Studio** | http://localhost:54323 | Admin felület |
| **API** | http://localhost:54321 | REST API |
| **Edge Function** | http://localhost:54321/functions/v1/publish-scheduled-posts | Publishing endpoint |
| **Auth** | http://localhost:54324 | Auth szolgáltatás |
| **Storage** | http://localhost:54325 | File storage |

## Tesztelési Lépések

### 1. 🟢 Alapvető Function Teszt
```powershell
# HTTP POST request az Edge Function-re
curl -X POST http://localhost:54321/functions/v1/publish-scheduled-posts \
  -H "Authorization: Bearer sb_publishable_1z3BFJskSeBF8EfbXfHo1Q_8lPu5Qj6" \
  -H "Content-Type: application/json" \
  -d '{}'
```

**Várt válasz:**
```json
{
  "scheduled": true,
  "timestamp": "2026-01-13T...",
  "totalPostsProcessed": 0,
  "publishedCount": 0,
  "failedCount": 0,
  "results": []
}
```

### 2. 📝 Teszt Post Létrehozása

**Supabase Studio** (http://localhost:54323) → **Table Editor** → **posts**:

```sql
INSERT INTO posts (
  user_id,
  content,
  platform,
  media_type,
  status,
  scheduled_for,
  social_account_id
) VALUES (
  'your_user_id_here',
  'Teszt post lokális teszteléshez! 🚀',
  'twitter',
  'text',
  'scheduled',
  NOW() + INTERVAL '2 minutes',
  'your_social_account_id'
);
```

### 3. 🎯 Valódi Publishing Teszt

1. **Post létrehozás** (fenti SQL)
2. **Várakozás** 2 perc
3. **Edge Function trigger**:
   ```powershell
   .\scripts\test-quick-edge.ps1 detailed
   ```
4. **Eredmény ellenőrzés** Studio-ban

## Debug és Monitoring

### Logok megtekintése
- **Edge Function logok**: Terminal ahol `supabase functions serve` fut
- **Database logok**: Supabase Studio → Logs
- **SQL Editor**: Manuális lekérdezésekhez

### Hasznos lekérdezések
```sql
-- Scheduled posts
SELECT * FROM posts WHERE status = 'scheduled';

-- Recent published/failed posts  
SELECT * FROM posts WHERE status IN ('published', 'failed') 
ORDER BY updated_at DESC LIMIT 10;

-- Connected social accounts
SELECT * FROM social_accounts WHERE is_active = true;

-- Recent notifications
SELECT * FROM notifications ORDER BY created_at DESC LIMIT 10;
```

## Hibaelhárítás

### "Docker not running"
```bash
# Windows: Docker Desktop indítása
# Linux/Mac: sudo systemctl start docker
```

### "Supabase start failed"  
```bash
supabase stop
supabase start --debug
```

### "Edge Function error"
```bash
# Újraindítás debug módban
supabase functions serve publish-scheduled-posts --debug --no-verify-jwt
```

### "No posts to publish"
- Ellenőrizd, hogy van-e `scheduled` státuszú post
- `scheduled_for` múltbeli idő legyen
- `social_account_id` létezzen és aktív legyen

## Tesztelési Checklist

- [ ] ✅ Supabase CLI telepítve
- [ ] ✅ Docker fut
- [ ] ✅ `supabase start` sikeres
- [ ] ✅ Edge Function serve fut
- [ ] ✅ Alap HTTP teszt működik (200 OK)
- [ ] ✅ Teszt post létrehozva
- [ ] ✅ Edge Function feldolgozza a postot
- [ ] ✅ Post status `published`-re változik
- [ ] ✅ Notification létrejön
- [ ] ✅ Logok hibamentesek

## Gyors Parancsok

```powershell
# Teljes lokális környezet
.\scripts\test-local-supabase.ps1

# Csak edge function teszt
.\scripts\test-quick-edge.ps1 simple

# Supabase állapot
supabase status

# Leállítás
supabase stop
```

---
**Ready to test!** 🎉 Futtatsd `.\scripts\test-local-supabase.ps1` és kezdheted a tesztelést!