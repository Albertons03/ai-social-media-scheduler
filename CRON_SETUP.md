# INGYENES Cron Setup / FREE Cron Setup

## 🎉 JÓ HÍR! / GOOD NEWS!

**NEM KELL FIZETNED SUPABASE-nek!** / **You DON'T need to pay for Supabase!**

A Vercel ingyenes (Hobby) terve **2 cron job-ot tartalmaz ingyen**. Használjuk ezt a Supabase helyett!

The Vercel free (Hobby) plan includes **2 cron jobs for FREE**. We'll use this instead of Supabase!

⚠️ **Fontos:** Vercel Hobby plan csak **óránkénti** vagy **napi** cron-okat támogat (nem 5 percenként).
⚠️ **Important:** Vercel Hobby plan only supports **hourly** or **daily** crons (not every 5 minutes).

💡 **5 perces publikáláshoz:** Lásd `SUPABASE_CRON_SETUP.md` (ingyenes megoldás).
💡 **For 5-minute publishing:** See `SUPABASE_CRON_SETUP.md` (free solution).

---

## 🚀 Setup Lépések / Setup Steps

### 1. Generate CRON_SECRET

Futtasd ezt a parancsot egy biztonságos secret generálásához:
Run this command to generate a secure secret:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Vagy használd ezt az online generátort:
Or use this online generator:
https://generate-secret.vercel.app/32

**Példa output / Example output:**
```
a3f8b2c1d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1
```

### 2. Add Environment Variable to Vercel

1. Menj a Vercel Dashboard-ra: https://vercel.com/dashboard
   Go to your Vercel Dashboard: https://vercel.com/dashboard

2. Válaszd ki a projektedet
   Select your project

3. Menj a **Settings** → **Environment Variables**
   Go to **Settings** → **Environment Variables**

4. Adj hozzá egy új változót:
   Add a new variable:

   **Name:** `CRON_SECRET`

   **Value:** (az előbb generált secret / the secret you just generated)

   **Environment:** ✅ Production ✅ Preview ✅ Development

5. Kattints a **Save** gombra
   Click **Save**

### 3. Redeploy to Production

Vercelben nyomd meg a **Redeploy** gombot, vagy push-old a kódot GitHub-ra.
In Vercel, click **Redeploy** button, or push your code to GitHub.

```bash
git add vercel.json CRON_SETUP.md
git commit -m "Configure FREE Vercel Cron for auto-publishing"
git push origin master
```

---

## ✅ Ellenőrzés / Verification

### Teszteld a cron endpoint-ot / Test the cron endpoint:

```bash
curl -X POST https://YOUR-APP.vercel.app/api/cron/publish \
  -H "Authorization: Bearer YOUR_CRON_SECRET"
```

Ha működik, ezt kell látnod / If it works, you should see:
```json
{
  "success": true,
  "totalProcessed": 0,
  "published": 0,
  "failed": 0
}
```

---

## 📊 Hogyan működik? / How does it work?

1. **Vercel Cron** automatikusan meghívja a `/api/cron/publish` endpoint-ot **óránként**
   **Vercel Cron** automatically calls the `/api/cron/publish` endpoint **every hour**

2. Az endpoint:
   The endpoint:
   - Lekérdezi az időzített posztokat a Supabase-ből
     Fetches scheduled posts from Supabase
   - Közzéteszi őket TikTok/Twitter/LinkedIn-en
     Publishes them to TikTok/Twitter/LinkedIn
   - Frissíti a státuszt "published"-re
     Updates status to "published"

3. **INGYENES** - Vercel Hobby terv része!
   **FREE** - Included in Vercel Hobby plan!

---

## 🔒 Biztonság / Security

A `CRON_SECRET` védi az endpoint-ot a jogosulatlan hívásokkal szemben.
The `CRON_SECRET` protects your endpoint from unauthorized calls.

**SOHA NE** commitold a secret-et a kódba!
**NEVER** commit the secret to your code!

Csak a Vercel Environment Variables-ben tárold!
Only store it in Vercel Environment Variables!

---

## 🆚 Vercel Cron vs Supabase Cron

| Feature | Vercel Cron (FREE) | Supabase pg_cron (PAID) |
|---------|-------------------|------------------------|
| **Ár / Price** | 🆓 Ingyen / FREE | 💰 $25/month (Pro) |
| **Limit** | 2 cron jobs | Unlimited |
| **Setup** | Egyszerű / Easy | Bonyolultabb / Complex |
| **Maintenance** | Nincs / None | Kell / Required |

**Választás / Choice:** Használjuk a Vercel Cron-t (ingyenes)! 🎉
**Choice:** Use Vercel Cron (free)! 🎉

---

## ❓ Problémák? / Problems?

### A posztok nem publikálódnak automatikusan
### Posts are not auto-publishing

1. Ellenőrizd, hogy a `CRON_SECRET` be van-e állítva Vercel-ben
   Check if `CRON_SECRET` is set in Vercel

2. Nézd meg a Vercel logs-ot:
   Check Vercel logs:
   - Menj a Vercel Dashboard → Project → Deployments → Latest → Functions
   - Go to Vercel Dashboard → Project → Deployments → Latest → Functions

3. Ellenőrizd, hogy a posztnál be van-e állítva a scheduled time
   Check if your posts have a scheduled time set

### 401 Unauthorized error

A `CRON_SECRET` nem egyezik vagy hiányzik.
The `CRON_SECRET` doesn't match or is missing.

Megoldás:
Solution:
1. Generálj új secret-et
   Generate a new secret
2. Add hozzá a Vercel-ben
   Add it to Vercel
3. Redeploy-old a projektet
   Redeploy your project

---

## 🎯 Következő lépések / Next Steps

1. ✅ `vercel.json` létrehozva / created
2. ⏳ Generate CRON_SECRET
3. ⏳ Add to Vercel Environment Variables
4. ⏳ Redeploy
5. ⏳ Tesztelj egy időzített posztot / Test a scheduled post

**Kész vagy!** A rendszer automatikusan közzéteszi az időzített posztokat 5 percenként! 🚀

**You're done!** The system will automatically publish scheduled posts every 5 minutes! 🚀
