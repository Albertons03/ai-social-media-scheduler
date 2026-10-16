# Lokális tesztelés — Supabase Edge Functions

## Offline cron-auth tesztek

A pure authentication helper tesztjeihez Deno szükséges. Ellenőrizd a
telepítést a `deno --version` paranccsal. A teszt offline fut: nem igényel
Supabase-t, Dockert, hitelesítő adatokat, hálózati hozzáférést, adatbázist vagy
publishing kérést.

```powershell
deno test ./supabase/functions/publish-scheduled-posts/cron-auth.test.ts
```

Ugyanez a parancs a `npm run test:cron-auth` paranccsal és a VS Code
**Test cron authentication (offline)** feladatával is futtatható.

## Lokális Edge Function fejlesztés

A helyi Supabase stack futtatásához Supabase CLI és Docker szükséges:

```powershell
supabase start
supabase functions serve publish-scheduled-posts --debug
```

| Szolgáltatás | URL |
|--------------|-----|
| Supabase Studio | http://localhost:54323 |
| API | http://localhost:54321 |
| Edge Function | http://localhost:54321/functions/v1/publish-scheduled-posts |
| Auth | http://localhost:54324 |
| Storage | http://localhost:54325 |

## Publishing smoke tesztek nem érhetők el

A korábbi lokális setup- és Edge smoke-test szkriptek törölve lettek. Publishing
smoke teszt nem érhető el, amíg nem készül biztonságos helyettesítés. Ne küldj
kézi kérést a publishing endpointnak, és ne hozz létre scheduled postot
helyettesítő tesztként.

## Debug és monitoring

- Edge Function logok: a `supabase functions serve` terminálja
- Database logok: Supabase Studio → Logs
- Helyi stack állapota: `supabase status`
- Helyi stack leállítása: `supabase stop` (csak indítás után)

## Hibaelhárítás

### A Docker nem fut

Indítsd el a Docker Desktop alkalmazást, majd ellenőrizd:

```powershell
docker --version
```

### A helyi Supabase indítása sikertelen

```powershell
supabase start
```

### Edge Function hiba

Indítsd újra a lokális function serve folyamatot debug módban:

```powershell
supabase functions serve publish-scheduled-posts --debug
```

Ne használd a publishing endpoint manuális meghívását smoke tesztként.
