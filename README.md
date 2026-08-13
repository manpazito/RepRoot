# RepRoot — Gym Muscle Group Tracker

RepRoot is a self-contained, phone-first training tracker. It provides separate Strength and Cardio areas, a live Workout Mode, a machine/free-weight exercise database, muscle-group volume and recovery estimates, personal-record tracking, stamina trends, and CSV/JSON exports.

## Run it

No install or build step is required. Open `index.html` directly in a modern browser, or serve the folder locally:

```bash
python3 -m http.server 8080
```

Then visit `http://localhost:8080`.

For phone use, deploy this folder to any static HTTPS host. In Safari use **Share → Add to Home Screen**; in Chrome use **Install app**. RepRoot includes a web-app manifest and offline app shell, so it launches full-screen and remains available after its first successful load. Training data stays on that browser/device unless exported.

## How to use it

1. Create an on-device account with your name, email, and a password of at least eight characters. Every new account begins with zero training data. The first-run tutorial explains the main workflow and can be replayed from **How to use**.
2. Use the phone's bottom tabs to move between **Home**, **Cardio**, **Workout**, **Strength**, and **Progress**.
3. Press **Start workout** to begin the live timer. The global play symbol becomes a pause symbol while the workout is active, then becomes play again when paused. Select a movement and tap **Complete set** after each set. The muscle map gets brighter as direct sets accumulate. Finish & save converts completed sets into permanent strength logs.
4. In **Strength**, enter a completed machine, cable, barbell, dumbbell, or bodyweight exercise directly. The primary muscle and movement pattern are filled automatically but can be adjusted.
5. In **Cardio**, choose running, cycling, swimming, walking, rowing, hiking, elliptical, or stair climbing. Log duration, activity-specific distance, effort, heart rate, and notes. Pace and stamina trends are calculated automatically.
6. Open **Exercises** to filter the movement catalog by equipment, primary muscle, or movement pattern. Click the `+` on any row to log it.
7. Open **Home** for weekly load, working sets, muscle coverage, and recovery estimates. Open **Progress** for working-weight charts, estimated 1RM records, and complete strength history.
8. Export Strength or Cardio CSV files from their history panels, or use the sidebar download icon to create a full JSON backup.

## Data architecture

The app uses these core records in `app.js`:

- `Account`: `id`, `name`, `email`, `passwordSalt`, `passwordHash`, `tutorialComplete`, `createdAt`
- `Exercise`: `id`, `name`, `primary`, `movement`, `equipment`
- `StrengthLog`: `id`, `date`, `exerciseId`, `muscle`, `sets`, `reps`, `weight`, `notes`, `createdAt`
- `CardioLog`: `id`, `date`, `activityId`, `duration`, `distance`, `effort`, `heartRate`, `notes`, `createdAt`
- `WorkoutSession`: `id`, `date`, `startedAt`, `durationSeconds`, `setCount`, `volume`, `muscles`

Accounts, training records, and an in-progress Workout Mode session are stored locally in the browser. Passwords are derived with PBKDF2 and are never stored in plaintext. Each account receives isolated storage. This lets a live workout survive navigation, sign-out, or an accidental refresh on the same device. Strength volume is calculated as `sets × reps × weight`. Estimated 1RM uses the Epley formula: `weight × (1 + reps / 30)`.

This on-device account layer is appropriate for a private static deployment but is not a replacement for server-side authentication or cloud sync. A multi-device public deployment should use an authenticated backend and a managed database. Clearing browser storage removes local accounts and logs, so export backups regularly.

Recovery is a simple planning estimate—not medical advice. It combines elapsed time since the latest direct session with current weekly set load:

- **Ready:** at least 60 hours since the latest session
- **Recovering:** 30–60 hours
- **Rest advised:** less than 30 hours, or 20+ weekly direct sets

No workout or cardio records are seeded. Use **Clear training data** on the Progress page to return the active account to zero without deleting the account itself.
