# AI Chat Setup Útmutató 🚀

## ⚠️ FONTOS: Supabase Database Migration

A hiba oka: Az `ai_conversations` tábla még **nem létezik** a Supabase adatbázisban!

## 🔧 Setup Lépések:

### **1. Supabase Migration Futtatása**

1. **Nyisd meg a Supabase Dashboard-ot:**
   - Menj ide: https://supabase.com/dashboard/project/zthibjgjsuyovieipddd

2. **SQL Editor megnyitása:**
   - Bal oldali menü → **SQL Editor**
   - Kattints a **"New Query"** gombra

3. **Migration SQL bemásolása:**
   - Nyisd meg a `supabase-migration-ai-conversations.sql` fájlt
   - Másold ki az **ÖSSZES** tartalmat (Ctrl+A, Ctrl+C)
   - Illeszd be az SQL Editor-ba

4. **SQL futtatása:**
   - Kattints a **"Run"** gombra (vagy nyomj Ctrl+Enter)
   - Várd meg amíg lefut (pár másodperc)
   - Ellenőrizd hogy nincs error message

5. **Sikeres migration ellenőrzése:**
   ```sql
   -- Futtasd ezt a lekérdezést:
   SELECT COUNT(*) FROM public.ai_conversations;
   ```
   - Ha nem ad hibát → Siker! ✅

---

### **2. Tesztelés**

1. **Restart a dev server:**
   ```bash
   # Terminal-ban állítsd le (Ctrl+C) és indítsd újra:
   npm run dev
   ```

2. **Teszt flow:**
   - Nyisd meg: http://localhost:3000/schedule
   - Kattints az **"AI Chat"** gombra
   - Válassz platformot (Twitter/LinkedIn/TikTok)
   - Próbáld ki:
     - "Kérj témát" gomb
     - Írj egy üzenetet (pl. "Írj egy posztot produktivitásról")
     - "Használd a tartalmat" gomb

---

## 📋 Ellenőrző Lista

- [ ] Supabase migration SQL lefutott
- [ ] `ai_conversations` tábla létezik
- [ ] Dev server újraindítva
- [ ] AI Chat modal megnyílik
- [ ] Platform selector működik
- [ ] "Kérj témát" gomb working
- [ ] Chat üzenetek működnek
- [ ] "Használd a tartalmat" átmásolja a post form-ba

---

## 🐛 Ha még mindig hibát kapsz:

### **Error: "relation ai_conversations does not exist"**
→ A migration nem futott le sikeresen. Futtasd újra az SQL-t.

### **Error: "AI service not configured"**
→ Az `ANTHROPIC_API_KEY` hiányzik a `.env.local` fájlból.

### **Error: "Unauthorized"**
→ Nem vagy bejelentkezve. Jelentkezz be a `/login` oldalon.

### **Console Errors:**
1. Nyisd meg a browser DevTools-t (F12)
2. Nézd meg a Console és Network tab-okat
3. Keresd meg a részletes hibaüzenetet

---

## 📞 Support

Ha bármi probléma van:
1. Nézd meg a console error-okat (F12 → Console)
2. Ellenőrizd a server log-okat (terminal ahol fut a `npm run dev`)
3. Kérdezz rá a részletes hibaüzenetre

---

## ✅ Sikeres Setup Után:

Az AI Chat feature készen áll! 🎉

**Features:**
- ✅ Real-time chat Claude AI-val
- ✅ Platform-specifikus válaszok
- ✅ Témajavaslatokk
- ✅ Tartalom optimalizálás
- ✅ Seamless integráció a schedule flow-val
- ✅ Conversation history Supabase-ben

**Következő lépés:**
- Teszteld alaposan lokálisan
- Ha minden működik → Deploy production-be
