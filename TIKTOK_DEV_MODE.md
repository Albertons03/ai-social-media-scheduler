# TikTok Development Mode vs Live Mode

## 🎯 TikTok API Modes

A TikTok Content Posting API két módban működik:

### 🔧 Development Mode (App Approval ELŐTT)

**Limitációk:**
- ❌ **Csak PRIVATE videók** (privacy_level: "SELF_ONLY")
- ❌ Csak a developer account-ra lehet publikálni
- ❌ PUBLIC, FRIENDS videók nem működnek
- ⚠️ "Error: privacy_level not allowed in development mode"

**Mikor vagy ebben:**
- App létrehozás után alapból
- Amíg nincs végleges TikTok approval

### ✅ Live Mode (App Approval UTÁN)

**Elérhető:**
- ✅ **PUBLIC videók** (privacy_level: "PUBLIC_TO_EVERYONE")
- ✅ **FRIENDS videók** (privacy_level: "MUTUAL_FOLLOW_FRIENDS")
- ✅ **PRIVATE videók** (privacy_level: "SELF_ONLY")
- ✅ Bárki TikTok account-jára publikálhatsz

**Mikor vagy ebben:**
- TikTok jóváhagyta az app-odat
- Status: "Live" vagy "Approved" a TikTok Developer Portal-ban

---

## 🔍 Hogyan ellenőrzöd melyik Mode-ban vagy?

### 1. TikTok Developer Portal

1. Menj ide: https://developers.tiktok.com/apps/
2. Kattints az app-odra
3. Nézd meg a **Status** mezőt:
   - "Development" → Development Mode
   - "In review" → Várni kell
   - "Live" / "Approved" → Live Mode! ✅

### 2. Tesztelés publikálással

Próbálj PUBLIC videót publikálni:

**Development Mode:**
```
Error: privacy_level not allowed in development mode
```

**Live Mode:**
```
Success! Post published!
```

---

## ⚙️ App Settings ellenőrzése

### Development Mode beállítások:

1. TikTok Developer Portal
2. Your App → **Settings**
3. Ellenőrizd:
   - ✅ **Scopes:** `video.upload`, `video.publish`
   - ✅ **Redirect URI:** `https://YOUR_DOMAIN/api/auth/callback/tiktok`
   - ✅ **Login Kit enabled**

### Live Mode-ra váltás:

1. Submit for Review (ha még nem tetted)
2. Várj a TikTok approval email-re
3. Status változik "Live"-ra
4. Most már PUBLIC is működik!

---

## 🛠️ Munkamenet (Workaround) Development Mode-ban

Ha még Development Mode-ban vagy, de tesztelni szeretnéd:

### Option 1: Használj PRIVATE privacy-t

```typescript
// Post form default
const [privacyLevel, setPrivacyLevel] = useState<PrivacyLevel>("PRIVATE");
```

### Option 2: Állítsd be minden TikTok posztot PRIVATE-re

Amikor TikTok posztot készítesz:
1. Platform: TikTok
2. **Privacy Level: PRIVATE** ✅
3. Schedule time
4. Create Post

A videó publikálódik, de csak te látod!

---

## 🎯 Production Setup (Live Mode után)

### 1. Ellenőrizd Live Mode státuszt

```bash
# Manuális cron teszt
curl -X POST https://YOUR_APP.vercel.app/api/cron/publish \
  -H "Authorization: Bearer YOUR_CRON_SECRET"
```

Ha sikeres PUBLIC publikálás → Live Mode! ✅

### 2. Változtasd vissza a default privacy-t PUBLIC-ra

```typescript
// components/post/post-form.tsx
const [privacyLevel, setPrivacyLevel] = useState<PrivacyLevel>("PUBLIC");
```

### 3. Publikálj PUBLIC videókat

Most már bárki láthatja a videóidat! 🎉

---

## 🐛 Gyakori hibák

### "privacy_level not allowed in development mode"

**Ok:** App még Development Mode-ban van, de PUBLIC-ot próbálsz használni.

**Megoldás:**
1. Használj PRIVATE privacy-t
2. Várj a TikTok approval-ra
3. Váltás Live Mode-ra

### "access_token invalid or expired"

**Ok:** OAuth token lejárt vagy rossz scope.

**Megoldás:**
1. Disconnect és reconnect TikTok account
2. Ellenőrizd scope-okat (video.upload, video.publish)
3. Token refresh működik-e

### "video_size too large"

**Ok:** Videó nagyobb mint 50 MB (TikTok limit).

**Megoldás:**
1. Kompresszáld a videót (ffmpeg, HandBrake)
2. Csökkentsd a bitrate-et
3. Max 50 MB TikTok videó!

---

## 📊 Összefoglaló

| Feature | Development Mode | Live Mode |
|---------|-----------------|-----------|
| **PUBLIC videók** | ❌ Nem | ✅ Igen |
| **PRIVATE videók** | ✅ Igen | ✅ Igen |
| **Account limit** | ❌ Csak developer | ✅ Bárki |
| **Approval kell** | ❌ Nem | ✅ Igen (várni kell) |

---

## 🚀 Next Steps

### Most (Development Mode):

1. ✅ Tesztelj PRIVATE videókkal
2. ✅ Várj TikTok approval-ra
3. ✅ Készítsd elő az app Live Mode-ra

### Approval után (Live Mode):

1. ✅ Változtasd default privacy PUBLIC-ra
2. ✅ Publikálj PUBLIC videókat
3. ✅ Élvezd az automatikus publikálást! 🎉

---

## ❓ Kérdések?

**Q: Mennyi ideig tart az approval?**
A: 1-2 hét általában (TikTok review team)

**Q: Tudok tesztelni Live Mode nélkül?**
A: Igen! Használj PRIVATE privacy-t Development Mode-ban

**Q: Mi történik ha PUBLIC-ot próbálok Development Mode-ban?**
A: Error: "privacy_level not allowed" - a post "failed" lesz

**Q: Automatikusan Live Mode-ra vált approval után?**
A: Igen! Ellenőrizd a TikTok Developer Portal-ban
