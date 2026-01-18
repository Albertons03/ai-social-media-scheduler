# Supabase Free Tier vs Pro - Mire van szükséged?

## 📊 Supabase Free Tier Limitek

| Feature | Free Tier | Pro Tier ($25/hó) | Te mennyi kell? |
|---------|-----------|-------------------|-----------------|
| **Database méret** | 500 MB | 8 GB | ✅ ~50-100 MB elég (posztok, fiókok) |
| **File Storage** | 1 GB | 100 GB | ✅ 1 GB elég videókra (később több kell) |
| **Edge Function hívások** | 500k/hó | 2M/hó | ✅ ~8,640/hó (óránként 1 cron = 24*30*12) |
| **Bandwidth** | 2 GB/hó | 50 GB/hó | ✅ Elég, ha kis videókat töltesz fel |
| **pg_cron extension** | ❌ Nincs | ✅ Van | 🔄 Nem kell! Lásd lent |
| **Projektek száma** | ♾️ Unlimited | ♾️ Unlimited | ✅ 5 projektod rendben |

---

## 🎯 Mikor KELL fizetni Supabase Pro-ra?

### ❌ NEM kell fizetni, ha:
- ✅ Kevesebb mint 500 MB adatbázisod van
- ✅ Kevesebb mint 1 GB videó/képed van
- ✅ Kevesebb mint 500k Edge Function hívásod van havonta
- ✅ **5 perces cron-t akarsz** → Használd az **INGYENES** megoldást!

### ✅ Fizetned KELL, ha:
- 💾 Több mint 500 MB adatod van (sok-sok post)
- 📹 Több mint 1 GB videód van (sok TikTok videó)
- 🚀 Több mint 500k Edge Function hívásod van
- ⚡ Point-in-time recovery kell (backup)
- 📧 Prioritized email support kell

---

## 🆓 INGYENES 5 perces cron megoldás

**NEM KELL** Supabase Pro a 5 perces publikáláshoz!

### Megoldás:
1. **Supabase Edge Function** (Free tier-ben benne van!)
2. **cron-job.org** (teljesen ingyenes külső service)

### Setup:
Lásd `SUPABASE_CRON_SETUP.md` minden részlettel!

**Költség:** $0/hó 🎉

---

## 📈 Mikor fog kelleni majd Pro?

### Storage limit (1 GB Free)

Ha sok TikTok videót töltesz fel:
- 1 videó ≈ 10-50 MB
- 1 GB = ~20-100 videó

**Megoldás INGYEN:**
- Töröld a régi videókat
- Kompresszáld a videókat feltöltés előtt
- Vagy később: $25/hó → 100 GB

### Database limit (500 MB Free)

1 post rekord ≈ 1-2 KB
500 MB = **~250,000-500,000 post** 🤯

**Konklúzió:** Sokáig nem fog kelleni! 😄

---

## 💰 Költség kalkuláció

### Ha MOST maradnál Free tier-en:
- Vercel Hobby: **$0/hó**
- Supabase Free: **$0/hó**
- cron-job.org: **$0/hó**
- **TOTAL: $0/hó** 🎉

### Ha 5 perces publikálást akarsz (INGYEN):
- Vercel Hobby: **$0/hó**
- Supabase Free: **$0/hó**
- cron-job.org: **$0/hó**
- Edge Function calls: ~8,640/hó (Free tier: 500k/hó)
- **TOTAL: $0/hó** 🎉

### Ha Supabase Pro-ra frissítenél:
- Vercel Hobby: **$0/hó**
- Supabase Pro: **$25/hó** 💰
- **TOTAL: $25/hó**

---

## 🎯 Ajánlás

### Most (Free tier):
1. ✅ Használd a Vercel óránkénti cron-t (INGYEN)
2. ✅ Figyelj a storage használatra
3. ✅ Töröld a régi, unused posztokat/médiát

### Később (ha sok videód lesz):
1. 💡 Állítsd be a Supabase Edge Function + cron-job.org-ot (5 perc, INGYEN)
2. 💡 Kompresszáld a videókat (csökkentsd a storage használatot)
3. 💡 Csak akkor fizess, ha elmegy az 1 GB storage

### Ha sok pénzed lesz:
1. 💰 Upgrade Supabase Pro-ra ($25/hó)
2. 💰 100 GB storage + pg_cron + priority support

---

## 🔍 Ellenőrizd a használatot

### Supabase Dashboard:
1. Menj ide: https://supabase.com/dashboard
2. Válaszd ki a projektet
3. **Settings** → **Usage**
4. Nézd meg:
   - Database size (500 MB limit)
   - Storage size (1 GB limit)
   - Edge Function invocations (500k/hó limit)

Ha közel jársz a limithez, akkor frissíts Pro-ra.

**De most valószínűleg 1-5% körül vagy mindenhol!** 😄

---

## 🎉 Összefoglalás

- ✅ **Most:** Free tier teljesen elég
- ✅ **5 perces cron:** Edge Function + cron-job.org (INGYEN!)
- ✅ **5 projekttel nincs gond:** Unlimited projektek Free-ben is
- ⏰ **Később:** Ha eléred az 1 GB storage-t, frissíts Pro-ra
- 💰 **Supabase Pro:** Csak akkor kell, ha kinövi a Free tier limiteket

**Most még sokáig nem kell fizetned!** 🚀
