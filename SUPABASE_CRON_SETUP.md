# Supabase Edge Function Cron Setup (5 perces futtatás)

## 🎯 Cél / Goal

5 percenkénti automatikus publikálás **INGYEN** Supabase Edge Function + külső cron service segítségével.
Automatic publishing every 5 minutes **FOR FREE** using Supabase Edge Function + external cron service.

---

## 📊 Összehasonlítás / Comparison

| Megoldás / Solution | Gyakoriság / Frequency | Ár / Price | Setup nehézség / Difficulty |
|---------------------|----------------------|------------|---------------------------|
| **Vercel Hobby Cron** | ⏰ Óránként / Hourly | 🆓 Ingyen / FREE | ⭐ Könnyű / Easy |
| **Supabase pg_cron** | ⏰ 5 percenként / Every 5 min | 💰 $25/hó / month | ⭐⭐ Közepes / Medium |
| **Supabase Edge + külső cron** | ⏰ 5 percenként / Every 5 min | 🆓 Ingyen / FREE | ⭐⭐⭐ Bonyolultabb / Complex |

---

## ⚠️ Fontos / Important

A Supabase **pg_cron extension** csak a **Pro plan-ben** ($25/hó) érhető el!

**DE!** Van egy ingyenes megoldás:
- Supabase Edge Function (ingyenes)
- Külső cron service (pl. cron-job.org - ingyenes)

---

## 🚀 Ingyenes Supabase Setup (amikor készen állsz)

### 1. Ellenőrizd a Supabase Edge Function-t

Már van egy `supabase/functions/publish-scheduled-posts/` mappád.

Teszteld:
```bash
# Terminal-ban
cd supabase/functions/publish-scheduled-posts
supabase functions deploy publish-scheduled-posts
```

### 2. Szerezz be egy Supabase Service Role Key-t

1. Menj a Supabase Dashboard-ra: https://supabase.com/dashboard
2. Válaszd ki a projektedet
3. **Settings** → **API**
4. Másold ki a **service_role** key-t (ez a secret one!)

### 3. Regisztrálj egy ingyenes cron service-re

Ajánlott: **cron-job.org** (teljesen ingyenes, 5 perces minimum)

1. Menj ide: https://cron-job.org/en/
2. Regisztrálj (ingyenes fiók)
3. Hozz létre új cron job-ot:
   - **Title:** Publish TikTok Posts
   - **URL:** `https://YOUR_PROJECT.supabase.co/functions/v1/publish-scheduled-posts`
   - **Schedule:** Every 5 minutes (`*/5 * * * *`)
   - **Request method:** POST
   - **Headers:**
     ```
     Authorization: Bearer YOUR_SERVICE_ROLE_KEY
     Content-Type: application/json
     ```

### 4. Alternatívák (más ingyenes cron service-ek)

- **EasyCron.com** - 1 cron job ingyenes
- **cron-job.org** - unlimited ingyenes cron jobs
- **UptimeRobot** - monitor + webhook minden 5 percben

---

## 🔧 Jelenlegi Setup (Vercel - Óránként)

Most a Vercel Cron **óránként** fut (`0 * * * *`).

Ez tökéletes:
- ✅ Teljesen ingyenes
- ✅ Megbízható
- ✅ Nincs extra setup

**Hátrány:** Csak óránként fut, nem 5 percenként.

---

## 🎯 Mikor váltsd Supabase-re?

### Válts Supabase Edge Function + külső cron-ra, ha:

1. ✅ Szükséged van 5 perces pontosságra
2. ✅ Több posztod van naponta
3. ✅ Nem akarsz fizetni ($25/hó Supabase Pro)

### Maradj Vercel Cron-nál, ha:

1. ✅ Óránkénti publikálás elég
2. ✅ Egyszerűbb setup-ot szeretnél
3. ✅ Kevesebb időzített posztod van

---

## 📝 Setup lépések (Supabase-re váltáshoz)

### 1. Deploy Supabase Edge Function

```bash
# Telepítsd a Supabase CLI-t (ha még nincs)
npm install -g supabase

# Login
supabase login

# Link project
supabase link --project-ref YOUR_PROJECT_REF

# Deploy edge function
supabase functions deploy publish-scheduled-posts
```

### 2. Teszteld az edge function-t

```bash
curl -X POST \
  https://YOUR_PROJECT.supabase.co/functions/v1/publish-scheduled-posts \
  -H "Authorization: Bearer YOUR_SERVICE_ROLE_KEY" \
  -H "Content-Type: application/json"
```

### 3. Állítsd be cron-job.org-ot

Lásd fent a 3. pontot!

### 4. Kapcsold ki Vercel Cron-t

Töröld vagy kommenteld ki a `vercel.json`-ban:

```json
{
  "_comment": "Cron disabled - using Supabase Edge Function + cron-job.org",
  "crons": []
}
```

---

## 🔒 Biztonság / Security

**SOHA NE** oszd meg a Service Role Key-t!
**NEVER** share your Service Role Key!

- ❌ NE rakd GitHub-ra
- ❌ NE rakd public kódba
- ✅ Csak cron-job.org dashboard-ba

---

## 💡 Javaslat / Recommendation

**Most:**
- Használd a Vercel Cron-t (óránként) - ez ingyenes és működik!

**Később, ha szükséges:**
- Válts Supabase Edge Function + cron-job.org-ra (5 perces publikálás, még mindig ingyen!)

**Ha sok pénzed van:**
- Upgrade Supabase Pro-ra ($25/hó) és használj pg_cron-t (legegyszerűbb)

---

## ❓ Kérdések? / Questions?

**Q: Működik már a Supabase Edge Function?**
A: Igen, a `supabase/functions/publish-scheduled-posts/` mappa már létezik. Csak deploy-olni kell.

**Q: Muszáj külső cron service?**
A: Csak ha 5 perces gyakoriságot szeretnél INGYEN. Supabase pg_cron $25/hó.

**Q: Melyik a legjobb?**
A:
- Kezdőknek: **Vercel Cron** (óránként, ingyenes)
- 5 perces publikálás ingyen: **Supabase Edge + cron-job.org**
- Legegyszerűbb (fizetős): **Supabase Pro + pg_cron** ($25/hó)

---

## 🎯 Következő lépés / Next Step

**Most nincs teendőd!** A Vercel Cron óránként fut.

**Ha később 5 perces publikálást akarsz:**
1. Deploy Supabase Edge Function
2. Regisztrálj cron-job.org-ra
3. Kapcsold ki Vercel Cron-t

Kész! 🚀
