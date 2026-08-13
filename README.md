# RepRoot — phone-first training tracker

RepRoot is an installable strength and cardio tracker with live workout logging, reusable routines, per-set history, muscle-group volume, conservative recovery context, progress charts, and portable backups. It has no build step and works offline after its first successful load.

## Run locally

Serve the repository so browser security features and the service worker are available:

```bash
python3 -m http.server 8080
```

Open `http://localhost:8080`. Avoid opening `index.html` as a `file://` URL because secure sign-in APIs may be unavailable there.

## Put it on your phone

The included GitHub Pages workflow deploys every push to `main`.

1. Merge the app branch into `main` on GitHub.
2. In the repository, open **Settings → Pages** and set **Source** to **GitHub Actions**.
3. After the **Deploy RepRoot to GitHub Pages** action finishes, open the Pages URL on your phone.
4. On iPhone, choose **Share → Add to Home Screen**. On Android, use **Install app** or **Add to Home screen**.

The manifest, Apple touch icon, offline shell, safe-area navigation, and phone-sized controls are already included.

## Account behavior

Accounts currently live only in the browser or installed app where they were created. Passwords are derived with PBKDF2 and never stored as plain text, and each local profile has isolated data. Sign-out and sign-in work on the same browser and survive reloads.

This also means an account created on a laptop will not exist automatically on a phone, and you and your partner cannot share routines across devices yet. Use **Settings & backup → Export full backup** regularly. A JSON backup can be restored into another RepRoot installation without importing any password.

The optional, row-level-secured Supabase foundation for real multi-device auth and partner links is documented in [`supabase/README.md`](supabase/README.md). It still needs a Supabase project URL and publishable key before the app can safely switch from local accounts.

## Training workflow

1. Create an on-device account with a password of at least eight characters.
2. Open **Workout**, choose Push, Pull, Legs, Full body, or create your own routine.
3. Log each completed set with its weight, reps, warm-up/working type, and reps in reserve. The rest timer starts automatically and the latest performance is shown before the next set.
4. Use **Finish & save** to preserve every individual set. Warm-ups remain in the session but do not inflate working-set volume.
5. Use **Strength** for a quick multi-set entry, **Cardio** for endurance work, and **Exercises → New exercise** for movements not in the built-in library.
6. Use **Settings & backup** to choose pounds or kilograms, set a weekly per-muscle target, choose a default rest interval, export data, or restore a backup.

Secondary muscles receive half-set credit on the weekly overview; the primary muscle receives full credit. Progress is compared with estimated 1RM using the Epley formula. These estimates are training context, not medical or readiness diagnoses.

## Data model

- `StrengthLog` retains legacy summary fields and adds `setDetails[]` with weight, reps, RIR, set type, and completion time.
- `WorkoutSession` stores timing, routine, working/warm-up counts, volume, and muscle groups.
- `Routine` stores an ordered list of exercise IDs.
- `Exercise` supports built-in and account-scoped custom movements with primary and secondary muscles.
- `Settings` stores display unit, weekly set target, and default rest interval.

Weights are normalized to pounds internally so switching display units does not rewrite history. Version 4 JSON backups include strength, cardio, sessions, routines, custom exercises, and preferences. Older summary-only strength records are expanded in memory for backward compatibility.

## Important files

- `index.html` — app structure and accessible controls
- `styles.css` — responsive UI and mobile workout layout
- `app.js` — local auth, storage, training calculations, and interaction logic
- `service-worker.js` / `manifest.webmanifest` — installable offline PWA shell
- `.github/workflows/pages.yml` — static phone deployment
- `supabase/schema.sql` — optional hosted-data schema with row-level security
