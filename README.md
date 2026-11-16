# PannonGuard Könyvelés

Meghívásos, kétlépcsős azonosítással védett alrendszer a Könyvelés munkakörhöz, a PannonGuard Komplex része.

## Működés

- **Meghívás:** az Elosztóban (pannonguard-iranyitokozpont) a `Könyvelés` munkakörre küldött meghívó regisztrációs linkje ide mutat (`/regisztracio?token=…`).
- **Regisztráció:** név és jelszó, majd hitelesítő alkalmazás (TOTP) beállítása. A link egyszer használható, 7 napig érvényes.
- **Belépés:** jelszó + hatjegyű kód. Az Elosztóban visszavont hozzáférés azonnal érvényes, a hitelesítő és a jelszó onnan visszaállítható.
- **Oldalak:** egyelőre csak az áttekintés és a Biztonság (munkamenetek, belépési napló). A könyvelési modulok később kerülnek ide.
- **Saját adattér:** elkülönített adattér (`workspaces`); a modulok adatait kizárólag a `src/lib/workspace.ts` `ownedCollection` segédjén keresztül szabad olvasni és írni.
- **Pajzsi:** lebegő asszisztens (Ctrl/⌘+K, Gemini) és hibabejelentés e-mailben.

## Környezeti változók

| Változó | Leírás |
| --- | --- |
| `MONGODB_URI` | MongoDB kapcsolat (közös fürt) |
| `MONGODB_DB` | Saját adatbázis (`pannonguard_konyveles`) |
| `INVITES_DB` | Az Elosztó adatbázisa (`pannonguard_eloszto`) |
| `TOTP_ENCRYPTION_KEY` | 64 hex karakter; `npm run setup:secrets` generálja |
| `GEMINI_API_KEY` | Pajzsi csevegése |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `EMAIL_USER`, `EMAIL_PASS` | A bejelentések e-mail-értesítője |
| `TICKET_TO` | (opcionális) a bejelentéseket fogadó cím |

## Fejlesztés

```bash
npm install
npm run setup:secrets
npm run dev   # http://localhost:3008
```
