"use strict";

// -----------------------------------------------------------------------------
// Data model
// Exercise: { id, name, primary, movement, equipment }
// Log:      { id, date, exerciseId, muscle, sets, reps, weight, notes, createdAt }
// User-generated logs are synced to Supabase and cached locally for offline use.
// -----------------------------------------------------------------------------

const STORAGE_KEY = "reproot-workout-logs-v1";
const CARDIO_STORAGE_KEY = "reproot-cardio-logs-v1";
const SESSION_STORAGE_KEY = "reproot-sessions-v1";
const ACTIVE_WORKOUT_KEY = "reproot-active-workout-v1";
const ROUTINES_STORAGE_KEY = "reproot-routines-v1";
const CUSTOM_EXERCISES_KEY = "reproot-custom-exercises-v1";
const SETTINGS_STORAGE_KEY = "reproot-settings-v1";
const ACCOUNTS_KEY = "reproot-accounts-v1";
const AUTH_SESSION_KEY = "reproot-auth-session-v1";
const CLOUD_SESSION_KEY = "reproot-cloud-session-v1";
const CLOUD_PROFILE_KEY = "reproot-cloud-profile-v1";
const CLOUD_DIRTY_KEY = "reproot-cloud-dirty-v1";
const LEGACY_MIGRATION_KEY = "reproot-legacy-migrated-v1";
const SUPABASE_URL = "https://syfiwpmsoruirefeksbk.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_wbKOPuzgRR-dRTBzto4akA_2om3H9fh";
const MUSCLE_GROUPS = ["Chest", "Back", "Quads", "Hamstrings", "Glutes", "Adductors", "Shoulders", "Biceps", "Triceps", "Core", "Calves"];
const LOWER_BODY_MUSCLES = ["Quads", "Hamstrings", "Glutes", "Adductors", "Calves"];
const MUSCLE_ABBR = { Chest: "CH", Back: "BK", Quads: "QD", Hamstrings: "HM", Glutes: "GL", Adductors: "AD", Shoulders: "SH", Biceps: "BI", Triceps: "TR", Core: "CR", Calves: "CV" };

const EXERCISES = [
  { id: "barbell-bench", name: "Barbell Bench Press", primary: "Chest", movement: "Horizontal push", equipment: "Barbell" },
  { id: "incline-db-press", name: "Incline Dumbbell Press", primary: "Chest", movement: "Incline push", equipment: "Dumbbells" },
  { id: "cable-fly", name: "Cable Chest Fly", primary: "Chest", movement: "Adduction", equipment: "Cable" },
  { id: "push-up", name: "Push-Up", primary: "Chest", movement: "Horizontal push", equipment: "Bodyweight" },
  { id: "machine-chest-press", name: "Machine Chest Press", primary: "Chest", movement: "Horizontal push", equipment: "Machine" },
  { id: "pec-deck", name: "Pec Deck Fly", primary: "Chest", movement: "Adduction", equipment: "Machine" },
  { id: "smith-bench-press", name: "Smith Machine Bench Press", primary: "Chest", movement: "Horizontal push", equipment: "Smith machine" },
  { id: "smith-incline-press", name: "Smith Machine Incline Press", primary: "Chest", movement: "Incline push", equipment: "Smith machine" },
  { id: "dumbbell-bench-press", name: "Dumbbell Bench Press", primary: "Chest", movement: "Horizontal push", equipment: "Dumbbells" },
  { id: "pull-up", name: "Pull-Up", primary: "Back", movement: "Vertical pull", equipment: "Bodyweight" },
  { id: "lat-pulldown", name: "Lat Pulldown", primary: "Back", movement: "Vertical pull", equipment: "Cable" },
  { id: "barbell-row", name: "Barbell Row", primary: "Back", movement: "Horizontal pull", equipment: "Barbell" },
  { id: "seated-row", name: "Seated Cable Row", primary: "Back", movement: "Horizontal pull", equipment: "Cable" },
  { id: "machine-high-row", name: "Machine High Row", primary: "Back", movement: "Horizontal pull", equipment: "Machine" },
  { id: "assisted-pull-up", name: "Assisted Pull-Up", primary: "Back", movement: "Vertical pull", equipment: "Machine" },
  { id: "machine-row", name: "Seated Machine Row", primary: "Back", movement: "Horizontal pull", equipment: "Machine" },
  { id: "chest-supported-row", name: "Chest-Supported Machine Row", primary: "Back", movement: "Horizontal pull", equipment: "Machine" },
  { id: "straight-arm-pulldown", name: "Straight-Arm Cable Pulldown", primary: "Back", movement: "Shoulder extension", equipment: "Cable" },
  { id: "one-arm-db-row", name: "One-Arm Dumbbell Row", primary: "Back", movement: "Horizontal pull", equipment: "Dumbbells" },
  { id: "back-squat", name: "Barbell Back Squat", primary: "Quads", movement: "Squat", equipment: "Barbell" },
  { id: "leg-press", name: "Leg Press", primary: "Quads", movement: "Squat", equipment: "Machine" },
  { id: "bulgarian-split", name: "Bulgarian Split Squat", primary: "Quads", movement: "Unilateral squat", equipment: "Dumbbells" },
  { id: "leg-extension", name: "Leg Extension", primary: "Quads", movement: "Knee extension", equipment: "Machine" },
  { id: "hack-squat", name: "Hack Squat", primary: "Quads", movement: "Squat", equipment: "Machine" },
  { id: "smith-squat", name: "Smith Machine Squat", primary: "Quads", movement: "Squat", equipment: "Smith machine" },
  { id: "smith-split-squat", name: "Smith Machine Split Squat", primary: "Quads", movement: "Unilateral squat", equipment: "Smith machine" },
  { id: "goblet-squat", name: "Goblet Squat", primary: "Quads", movement: "Squat", equipment: "Dumbbell" },
  { id: "walking-lunge", name: "Dumbbell Walking Lunge", primary: "Quads", movement: "Unilateral squat", equipment: "Dumbbells" },
  { id: "romanian-deadlift", name: "Romanian Deadlift", primary: "Hamstrings", movement: "Hip hinge", equipment: "Barbell" },
  { id: "leg-curl", name: "Lying Leg Curl", primary: "Hamstrings", movement: "Knee flexion", equipment: "Machine" },
  { id: "good-morning", name: "Good Morning", primary: "Hamstrings", movement: "Hip hinge", equipment: "Barbell" },
  { id: "seated-leg-curl", name: "Seated Leg Curl", primary: "Hamstrings", movement: "Knee flexion", equipment: "Machine" },
  { id: "dumbbell-rdl", name: "Dumbbell Romanian Deadlift", primary: "Hamstrings", movement: "Hip hinge", equipment: "Dumbbells" },
  { id: "smith-rdl", name: "Smith Machine Romanian Deadlift", primary: "Hamstrings", movement: "Hip hinge", equipment: "Smith machine" },
  { id: "barbell-hip-thrust", name: "Barbell Hip Thrust", primary: "Glutes", movement: "Hip extension", equipment: "Barbell", secondary: ["Hamstrings"] },
  { id: "cable-kickback", name: "Cable Glute Kickback", primary: "Glutes", movement: "Hip extension", equipment: "Cable", secondary: ["Hamstrings"] },
  { id: "hip-abduction-machine", name: "Hip Abductor Machine", primary: "Glutes", movement: "Hip abduction", equipment: "Machine", aliases: ["Hip Abduction", "Abductors"] },
  { id: "glute-drive-machine", name: "Glute Drive / Hip Thrust Machine", primary: "Glutes", movement: "Hip extension", equipment: "Machine", secondary: ["Hamstrings"] },
  { id: "smith-hip-thrust", name: "Smith Machine Hip Thrust", primary: "Glutes", movement: "Hip extension", equipment: "Smith machine", secondary: ["Hamstrings"] },
  { id: "hip-adduction-machine", name: "Hip Adductor Machine", primary: "Adductors", movement: "Hip adduction", equipment: "Machine", aliases: ["Hip Adduction", "Adductors"] },
  { id: "overhead-press", name: "Overhead Press", primary: "Shoulders", movement: "Vertical push", equipment: "Barbell" },
  { id: "lateral-raise", name: "Dumbbell Lateral Raise", primary: "Shoulders", movement: "Abduction", equipment: "Dumbbells" },
  { id: "reverse-fly", name: "Reverse Pec Deck", primary: "Shoulders", movement: "Horizontal abduction", equipment: "Machine" },
  { id: "face-pull", name: "Face Pull", primary: "Shoulders", movement: "External rotation", equipment: "Cable" },
  { id: "machine-shoulder-press", name: "Machine Shoulder Press", primary: "Shoulders", movement: "Vertical push", equipment: "Machine" },
  { id: "cable-lateral-raise", name: "Cable Lateral Raise", primary: "Shoulders", movement: "Abduction", equipment: "Cable" },
  { id: "dumbbell-rear-delt-fly", name: "Dumbbell Rear Delt Fly", primary: "Shoulders", movement: "Horizontal abduction", equipment: "Dumbbells" },
  { id: "barbell-curl", name: "Barbell Curl", primary: "Biceps", movement: "Elbow flexion", equipment: "Barbell" },
  { id: "hammer-curl", name: "Hammer Curl", primary: "Biceps", movement: "Elbow flexion", equipment: "Dumbbells" },
  { id: "preacher-curl", name: "Preacher Curl", primary: "Biceps", movement: "Elbow flexion", equipment: "EZ bar" },
  { id: "machine-curl", name: "Machine Biceps Curl", primary: "Biceps", movement: "Elbow flexion", equipment: "Machine" },
  { id: "cable-curl", name: "Cable Biceps Curl", primary: "Biceps", movement: "Elbow flexion", equipment: "Cable" },
  { id: "incline-db-curl", name: "Incline Dumbbell Curl", primary: "Biceps", movement: "Elbow flexion", equipment: "Dumbbells" },
  { id: "tricep-pushdown", name: "Triceps Pushdown", primary: "Triceps", movement: "Elbow extension", equipment: "Cable" },
  { id: "skull-crusher", name: "EZ-Bar Skull Crusher", primary: "Triceps", movement: "Elbow extension", equipment: "EZ bar" },
  { id: "close-grip-bench", name: "Close-Grip Bench Press", primary: "Triceps", movement: "Horizontal push", equipment: "Barbell" },
  { id: "assisted-dip", name: "Assisted Dip", primary: "Triceps", movement: "Vertical push", equipment: "Machine" },
  { id: "rope-pushdown", name: "Rope Triceps Pushdown", primary: "Triceps", movement: "Elbow extension", equipment: "Cable" },
  { id: "overhead-cable-extension", name: "Overhead Cable Triceps Extension", primary: "Triceps", movement: "Elbow extension", equipment: "Cable" },
  { id: "cable-crunch", name: "Cable Crunch", primary: "Core", movement: "Spinal flexion", equipment: "Cable" },
  { id: "hanging-leg-raise", name: "Hanging Leg Raise", primary: "Core", movement: "Hip flexion", equipment: "Bodyweight" },
  { id: "plank", name: "Weighted Plank", primary: "Core", movement: "Anti-extension", equipment: "Plate" },
  { id: "ab-crunch-machine", name: "Ab Crunch Machine", primary: "Core", movement: "Spinal flexion", equipment: "Machine" },
  { id: "torso-rotation-machine", name: "Torso Rotation Machine", primary: "Core", movement: "Rotation", equipment: "Machine" },
  { id: "pallof-press", name: "Cable Pallof Press", primary: "Core", movement: "Anti-rotation", equipment: "Cable" },
  { id: "standing-calf", name: "Standing Calf Raise", primary: "Calves", movement: "Plantar flexion", equipment: "Machine" },
  { id: "seated-calf", name: "Seated Calf Raise", primary: "Calves", movement: "Plantar flexion", equipment: "Machine" },
  { id: "calf-extension-machine", name: "Calf Extension Machine", primary: "Calves", movement: "Plantar flexion", equipment: "Machine" },
  { id: "leg-press-calf-raise", name: "Leg Press Calf Raise", primary: "Calves", movement: "Plantar flexion", equipment: "Leg press" }
];

const CARDIO_ACTIVITIES = [
  { id: "running", name: "Treadmill / Running", icon: "⌁", unit: "miles" },
  { id: "cycling", name: "Upright / Indoor Bike", icon: "◉", unit: "miles" },
  { id: "swimming", name: "Swimming", icon: "≈", unit: "yards" },
  { id: "walking", name: "Treadmill / Walking", icon: "♟", unit: "miles" },
  { id: "rowing", name: "Rowing", icon: "≋", unit: "meters" },
  { id: "hiking", name: "Hiking", icon: "⌃", unit: "miles" },
  { id: "elliptical", name: "Elliptical", icon: "∞", unit: "miles" },
  { id: "arc-trainer", name: "Arc Trainer", icon: "⌒", unit: "miles" },
  { id: "recumbent-bike", name: "Recumbent Bike", icon: "◒", unit: "miles" },
  { id: "stairs", name: "Stair Climber / Stepmill", icon: "▟", unit: "floors" }
];

const SECONDARY_BY_MOVEMENT = {
  "Horizontal push": ["Triceps", "Shoulders"], "Incline push": ["Shoulders", "Triceps"],
  "Vertical push": ["Triceps"], "Vertical pull": ["Biceps"], "Horizontal pull": ["Biceps", "Shoulders"],
  "Horizontal abduction": ["Back"], "External rotation": ["Back"], "Squat": ["Glutes", "Hamstrings"],
  "Unilateral squat": ["Glutes", "Hamstrings"], "Hip hinge": ["Glutes", "Back"], "Hip flexion": ["Quads"]
};

const DEFAULT_ROUTINES = [
  { id: "routine-pf-machine-legs", name: "PF Machine Legs", exerciseIds: ["leg-press", "leg-extension", "seated-leg-curl", "hip-adduction-machine", "hip-abduction-machine", "calf-extension-machine"], builtIn: true },
  { id: "routine-pf-push", name: "PF Machine Push", exerciseIds: ["machine-chest-press", "pec-deck", "machine-shoulder-press", "cable-lateral-raise", "rope-pushdown"], builtIn: true },
  { id: "routine-pf-pull", name: "PF Machine Pull", exerciseIds: ["lat-pulldown", "machine-row", "machine-high-row", "reverse-fly", "machine-curl"], builtIn: true },
  { id: "routine-pf-full-body", name: "PF Machine Full Body", exerciseIds: ["leg-press", "machine-chest-press", "lat-pulldown", "seated-leg-curl", "machine-shoulder-press", "ab-crunch-machine"], builtIn: true },
  { id: "routine-pf-glutes", name: "PF Glutes & Hamstrings", exerciseIds: ["smith-rdl", "glute-drive-machine", "seated-leg-curl", "hip-abduction-machine", "cable-kickback", "calf-extension-machine"], builtIn: true },
  { id: "routine-pf-smith-upper", name: "PF Smith & Dumbbell Upper", exerciseIds: ["smith-incline-press", "one-arm-db-row", "dumbbell-bench-press", "lat-pulldown", "lateral-raise", "overhead-cable-extension"], builtIn: true }
];

const DEFAULT_SETTINGS = { weightUnit: "lb", weeklySetTarget: 10, restSeconds: 90 };
const DEFAULT_PROFILE = { displayName: "", bio: "", favoriteExerciseId: "", photoDataUrl: "" };

const state = {
  logs: [], cardioLogs: [], sessions: [], activeWorkout: null, routines: [], customExercises: [], settings: { ...DEFAULT_SETTINGS },
  profile: { ...DEFAULT_PROFILE },
  account: null, authMode: "create", tutorialStep: 0,
  selectedWeekStart: startOfWeek(new Date()), route: "overview", timerInterval: null, restTimerInterval: null, restTimerEnd: null,
  cloudSession: null, cloudSyncTimer: null, isHydrating: false, migrationPassword: null,
  exercisePickerTarget: "liveExercise", exercisePickerFilter: "lower"
};

const TUTORIAL_STEPS = [
  { icon: "✦", label: "Getting started", title: "Welcome to RepRoot.", copy: "Your account begins completely empty. Add only the training you actually complete, and the dashboard will grow with you.", tip: "Your training syncs securely to your account and remains cached on this device for offline use." },
  { icon: "▶", label: "Workout mode", title: "Track sets while you train.", copy: "Choose a routine or begin with any exercise. Record weight, reps, set type, and reps in reserve after each completed set.", tip: "Workout navigation never pauses your session. Pause, resume, and finish controls stay inside Workout Mode." },
  { icon: "◐", label: "Muscle targeting", title: "Watch your workout build.", copy: "Working sets add full credit to the primary muscle and partial credit to secondary muscles. Warm-up sets stay in your history without inflating weekly volume.", tip: "Finish & save preserves every individual set for accurate progression." },
  { icon: "♥", label: "Cardio & strength", title: "Log every kind of effort.", copy: "Use Strength for individual machine or free-weight entries. Use Cardio for running, cycling, swimming, walking, rowing, hiking, elliptical, and stairs.", tip: "Cardio automatically calculates pace using the correct activity unit." },
  { icon: "↗", label: "Review progress", title: "Let your history guide you.", copy: "Home shows weekly muscle balance and recovery. Progress shows working-weight trends, estimated 1RM records, and complete workout history.", tip: "You can replay this guide anytime from How to use in the sidebar." }
];

function cryptoId() { return (globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(16).slice(2)}`); }
function toISODate(date) { const d = new Date(date); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`; }
function parseLocalDate(value) { const [y, m, d] = value.split("-").map(Number); return new Date(y, m - 1, d, 12); }
function startOfWeek(date) { const result = new Date(date); result.setHours(0, 0, 0, 0); const day = result.getDay(); result.setDate(result.getDate() - ((day + 6) % 7)); return result; }
function endOfWeek(start) { const result = new Date(start); result.setDate(result.getDate() + 6); result.setHours(23, 59, 59, 999); return result; }
function formatNumber(value) { return Math.round(value).toLocaleString("en-US"); }
function allExercises() { return [...EXERCISES, ...state.customExercises]; }
function exerciseById(id) { return allExercises().find(exercise => exercise.id === id); }
function withCurrentBuiltInRoutines(routines = []) {
  const builtInIds = new Set(DEFAULT_ROUTINES.map(routine => routine.id));
  const custom = (Array.isArray(routines) ? routines : []).filter(routine => !routine.builtIn && !builtInIds.has(routine.id));
  return [...DEFAULT_ROUTINES.map(routine => ({ ...routine, exerciseIds: [...routine.exerciseIds] })), ...custom];
}
function cardioById(id) { return CARDIO_ACTIVITIES.find(activity => activity.id === id); }
function exerciseSecondary(exercise) { return [...new Set(exercise?.secondary || SECONDARY_BY_MOVEMENT[exercise?.movement] || [])].filter(group => group !== exercise?.primary); }
function logSetDetails(log) {
  if (Array.isArray(log.setDetails) && log.setDetails.length) return log.setDetails;
  return Array.from({ length: Math.max(0, Number(log.sets) || 0) }, () => ({ weight: Number(log.weight) || 0, reps: Number(log.reps) || 0, rir: log.rir ?? null, type: "working", completedAt: log.createdAt }));
}
function workingSetDetails(log) { return logSetDetails(log).filter(set => set.type !== "warmup"); }
function workingSetCount(log) { return workingSetDetails(log).length; }
function setE1rm(set) { return Number(set.weight) * (1 + Number(set.reps) / 30); }
function representativeSet(log) { return [...workingSetDetails(log)].sort((a, b) => setE1rm(b) - setE1rm(a))[0] || logSetDetails(log)[0] || { weight: 0, reps: 0 }; }
function entryVolume(log) { return workingSetDetails(log).reduce((sum, set) => sum + Number(set.weight) * Number(set.reps), 0); }
function e1rm(log) { return setE1rm(representativeSet(log)); }
function unitLabel() { return state.settings.weightUnit; }
function fromPounds(value) { return state.settings.weightUnit === "kg" ? Number(value) / 2.2046226218 : Number(value); }
function toPounds(value) { return state.settings.weightUnit === "kg" ? Number(value) * 2.2046226218 : Number(value); }
function formatWeight(value, decimals = 1) { const converted = fromPounds(value); return `${Number(converted.toFixed(decimals)).toLocaleString()} ${unitLabel()}`; }
function formatSetSummary(log) { const sets = workingSetDetails(log); if (!sets.length) return "Warm-up only"; const unique = new Set(sets.map(set => `${set.weight}|${set.reps}`)); return unique.size === 1 ? `${sets.length} × ${sets[0].reps}` : `${sets.length} working sets`; }
function muscleCredit(log, group) { const exercise = exerciseById(log.exerciseId); if (!exercise) return 0; const sets = workingSetCount(log); if ((log.muscle || exercise.primary) === group) return sets; return exerciseSecondary(exercise).includes(group) ? sets * 0.5 : 0; }
function inDateRange(log, start, end) { const date = parseLocalDate(log.date); return date >= start && date <= end; }
function escapeHTML(value = "") { const element = document.createElement("div"); element.textContent = String(value); return element.innerHTML; }
function formatShortDate(value) { return parseLocalDate(value).toLocaleDateString("en-US", { month: "short", day: "numeric" }); }
function formatFullDate(value) { return parseLocalDate(value).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }); }

function safeProfilePhoto(value) {
  return typeof value === "string" && value.length < 500000 && /^data:image\/(?:jpeg|png|webp);base64,/i.test(value) ? value : "";
}
function normalizeProfile(profile = {}) {
  const displayName = String(profile.displayName || profile.name || state.account?.name || "RepRoot athlete").trim().slice(0, 50) || "RepRoot athlete";
  const favoriteExerciseId = exerciseById(profile.favoriteExerciseId) ? profile.favoriteExerciseId : "";
  return { displayName, bio: String(profile.bio || "").trim().slice(0, 160), favoriteExerciseId, photoDataUrl: safeProfilePhoto(profile.photoDataUrl) };
}

function accountStorageKey(baseKey) {
  if (!state.account) throw new Error("An authenticated account is required.");
  return `${baseKey}:${state.account.id}`;
}

function loadLogs() {
  try {
    const stored = JSON.parse(localStorage.getItem(accountStorageKey(STORAGE_KEY)));
    state.logs = Array.isArray(stored) ? stored : [];
  } catch { state.logs = []; }
  try {
    const cardio = JSON.parse(localStorage.getItem(accountStorageKey(CARDIO_STORAGE_KEY)));
    state.cardioLogs = Array.isArray(cardio) ? cardio : [];
  } catch { state.cardioLogs = []; }
  try {
    const sessions = JSON.parse(localStorage.getItem(accountStorageKey(SESSION_STORAGE_KEY)));
    state.sessions = Array.isArray(sessions) ? sessions : [];
  } catch { state.sessions = []; }
  try { state.activeWorkout = JSON.parse(localStorage.getItem(accountStorageKey(ACTIVE_WORKOUT_KEY))) || null; } catch { state.activeWorkout = null; }
  try { const routines = JSON.parse(localStorage.getItem(accountStorageKey(ROUTINES_STORAGE_KEY))); state.routines = withCurrentBuiltInRoutines(routines); } catch { state.routines = withCurrentBuiltInRoutines(); }
  try { const custom = JSON.parse(localStorage.getItem(accountStorageKey(CUSTOM_EXERCISES_KEY))); state.customExercises = Array.isArray(custom) ? custom : []; } catch { state.customExercises = []; }
  try { state.settings = { ...DEFAULT_SETTINGS, ...(JSON.parse(localStorage.getItem(accountStorageKey(SETTINGS_STORAGE_KEY))) || {}) }; } catch { state.settings = { ...DEFAULT_SETTINGS }; }
  try { state.profile = normalizeProfile(JSON.parse(localStorage.getItem(cloudProfileKey(state.account.id))) || {}); } catch { state.profile = normalizeProfile(); }
  state.account.name = state.profile.displayName;
  saveRoutines();
}
function markCloudDirty() {
  if (!state.account || state.isHydrating) return;
  localStorage.setItem(`${CLOUD_DIRTY_KEY}:${state.account.id}`, "true");
  scheduleCloudSync();
}
function saveLogs() { localStorage.setItem(accountStorageKey(STORAGE_KEY), JSON.stringify(state.logs)); markCloudDirty(); }
function saveCardioLogs() { localStorage.setItem(accountStorageKey(CARDIO_STORAGE_KEY), JSON.stringify(state.cardioLogs)); markCloudDirty(); }
function saveSessions() { localStorage.setItem(accountStorageKey(SESSION_STORAGE_KEY), JSON.stringify(state.sessions)); markCloudDirty(); }
function saveRoutines() { localStorage.setItem(accountStorageKey(ROUTINES_STORAGE_KEY), JSON.stringify(state.routines)); markCloudDirty(); }
function saveCustomExercises() { localStorage.setItem(accountStorageKey(CUSTOM_EXERCISES_KEY), JSON.stringify(state.customExercises)); markCloudDirty(); }
function saveSettings() { localStorage.setItem(accountStorageKey(SETTINGS_STORAGE_KEY), JSON.stringify(state.settings)); markCloudDirty(); }
function saveProfile() {
  if (!state.account) return;
  localStorage.setItem(cloudProfileKey(state.account.id), JSON.stringify({ ...state.profile, name: state.profile.displayName, tutorialComplete: state.account.tutorialComplete }));
  markCloudDirty();
}
function saveActiveWorkout() {
  const key = accountStorageKey(ACTIVE_WORKOUT_KEY);
  if (state.activeWorkout) localStorage.setItem(key, JSON.stringify(state.activeWorkout));
  else localStorage.removeItem(key);
  markCloudDirty();
}

async function init() {
  // Remove the original unscoped demo store. All current data is account-scoped.
  [STORAGE_KEY, CARDIO_STORAGE_KEY, SESSION_STORAGE_KEY, ACTIVE_WORKOUT_KEY, ROUTINES_STORAGE_KEY, CUSTOM_EXERCISES_KEY, SETTINGS_STORAGE_KEY].forEach(key => localStorage.removeItem(key));
  populateSelects();
  bindEvents();
  document.querySelector("#logDate").value = toISODate(new Date());
  document.querySelector("#cardioDate").value = toISODate(new Date());
  syncExerciseFields();
  syncCardioFields();
  syncLiveExercise();
  window.addEventListener("online", () => { setCloudStatus("syncing"); syncFromCloud().catch(() => setCloudStatus("offline")); });
  window.addEventListener("offline", () => setCloudStatus("offline"));
  await restoreAuthSession();
}

// -----------------------------------------------------------------------------
// Supabase cloud accounts with an on-device offline cache. The previous PBKDF2
// account records are read only once as a migration source and are never sent
// anywhere except the authenticated user's own training snapshot.
// -----------------------------------------------------------------------------

function getAccounts() {
  try { const accounts = JSON.parse(localStorage.getItem(ACCOUNTS_KEY)); return Array.isArray(accounts) ? accounts : []; }
  catch { return []; }
}
function bytesToBase64(bytes) { return btoa(String.fromCharCode(...bytes)); }
function base64ToBytes(value) { return Uint8Array.from(atob(value), character => character.charCodeAt(0)); }
async function deriveLegacyPassword(password, salt) {
  const material = await crypto.subtle.importKey("raw", new TextEncoder().encode(password), "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits({ name: "PBKDF2", salt, iterations: 150000, hash: "SHA-256" }, material, 256);
  return bytesToBase64(new Uint8Array(bits));
}

function cloudProfileKey(userId) { return `${CLOUD_PROFILE_KEY}:${userId}`; }
function accountFromSession(session) {
  let localProfile = {};
  try { localProfile = JSON.parse(localStorage.getItem(cloudProfileKey(session.user.id))) || {}; } catch { localProfile = {}; }
  const name = session.user.user_metadata?.name || localProfile.name || session.user.email?.split("@")[0] || "RepRoot athlete";
  return { id: session.user.id, email: session.user.email, name, tutorialComplete: Boolean(localProfile.tutorialComplete) };
}

function normalizeCloudSession(session) {
  if (!session?.access_token || !session?.refresh_token || !session?.user) return null;
  return { ...session, expires_at: Number(session.expires_at) || Math.floor(Date.now() / 1000) + Number(session.expires_in || 3600) };
}
function storeCloudSession(session) {
  state.cloudSession = normalizeCloudSession(session);
  if (state.cloudSession) localStorage.setItem(CLOUD_SESSION_KEY, JSON.stringify(state.cloudSession));
  else localStorage.removeItem(CLOUD_SESSION_KEY);
}
function cloudErrorMessage(payload, fallback = "Unable to reach your account.") {
  const message = payload?.msg || payload?.message || payload?.error_description || payload?.error;
  if (message === "Invalid login credentials") return "Incorrect email or password.";
  if (message === "Email not confirmed") return "Confirm your email first, then sign in again.";
  if (message?.toLowerCase().includes("already registered")) return "An account with this email already exists. Choose Sign in.";
  return message || fallback;
}
async function parseCloudResponse(response, fallback) {
  let payload = null;
  try { payload = await response.json(); } catch { payload = null; }
  if (!response.ok) throw new Error(cloudErrorMessage(payload, fallback));
  return payload;
}
async function refreshCloudSession() {
  const refreshToken = state.cloudSession?.refresh_token;
  if (!refreshToken) throw new Error("Your session has expired. Sign in again.");
  const response = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=refresh_token`, {
    method: "POST", headers: { apikey: SUPABASE_PUBLISHABLE_KEY, "Content-Type": "application/json" },
    body: JSON.stringify({ refresh_token: refreshToken })
  });
  const session = await parseCloudResponse(response, "Unable to refresh your session.");
  storeCloudSession(session);
  return state.cloudSession;
}
async function authenticatedCloudFetch(path, options = {}, retry = true) {
  if (!state.cloudSession) throw new Error("Sign in to sync your training.");
  if (state.cloudSession.expires_at * 1000 < Date.now() + 60000) await refreshCloudSession();
  const response = await fetch(`${SUPABASE_URL}${path}`, {
    ...options,
    headers: { apikey: SUPABASE_PUBLISHABLE_KEY, Authorization: `Bearer ${state.cloudSession.access_token}`, ...(options.headers || {}) }
  });
  if (response.status === 401 && retry) { await refreshCloudSession(); return authenticatedCloudFetch(path, options, false); }
  return response;
}

function readAccountValue(baseKey, accountId, fallback) {
  try { const value = JSON.parse(localStorage.getItem(`${baseKey}:${accountId}`)); return value ?? fallback; }
  catch { return fallback; }
}
function trainingPayloadForAccount(accountId) {
  const routines = readAccountValue(ROUTINES_STORAGE_KEY, accountId, []);
  const legacyAccount = getAccounts().find(account => account.id === accountId);
  return {
    version: 4, savedAt: new Date().toISOString(),
    profile: normalizeProfile({ displayName: legacyAccount?.name || "" }),
    settings: { ...DEFAULT_SETTINGS, ...readAccountValue(SETTINGS_STORAGE_KEY, accountId, {}) },
    customExercises: readAccountValue(CUSTOM_EXERCISES_KEY, accountId, []),
    routines: withCurrentBuiltInRoutines(routines),
    strengthLogs: readAccountValue(STORAGE_KEY, accountId, []),
    cardioLogs: readAccountValue(CARDIO_STORAGE_KEY, accountId, []),
    workoutSessions: readAccountValue(SESSION_STORAGE_KEY, accountId, []),
    activeWorkout: readAccountValue(ACTIVE_WORKOUT_KEY, accountId, null)
  };
}
function currentTrainingPayload() {
  return {
    version: 4, savedAt: new Date().toISOString(), profile: state.profile, settings: state.settings,
    customExercises: state.customExercises, routines: state.routines,
    strengthLogs: state.logs, cardioLogs: state.cardioLogs, workoutSessions: state.sessions,
    activeWorkout: state.activeWorkout
  };
}
function payloadHasTraining(payload) {
  return [payload?.strengthLogs, payload?.cardioLogs, payload?.workoutSessions, payload?.customExercises].some(items => Array.isArray(items) && items.length) || Boolean(payload?.activeWorkout);
}
function mergeRecords(...groups) {
  const records = new Map();
  groups.flat().filter(Boolean).forEach(record => records.set(record.id || cryptoId(), record));
  return [...records.values()];
}
function mergeTrainingPayload(primary, addition) {
  if (!primary) return addition;
  if (!addition) return primary;
  return {
    version: 4, savedAt: new Date().toISOString(), profile: primary.profile || addition.profile || { ...DEFAULT_PROFILE }, settings: primary.settings || addition.settings || { ...DEFAULT_SETTINGS },
    customExercises: mergeRecords(addition.customExercises || [], primary.customExercises || []),
    routines: mergeRecords(addition.routines || [], primary.routines || []),
    strengthLogs: mergeRecords(addition.strengthLogs || [], primary.strengthLogs || []),
    cardioLogs: mergeRecords(addition.cardioLogs || [], primary.cardioLogs || []),
    workoutSessions: mergeRecords(addition.workoutSessions || [], primary.workoutSessions || []),
    activeWorkout: primary.activeWorkout || addition.activeWorkout || null
  };
}
function applyTrainingPayload(payload) {
  const custom = Array.isArray(payload?.customExercises) ? payload.customExercises : [];
  const validExerciseIds = new Set([...EXERCISES.map(exercise => exercise.id), ...custom.map(exercise => exercise.id)]);
  state.customExercises = custom;
  state.logs = Array.isArray(payload?.strengthLogs) ? payload.strengthLogs.filter(log => validExerciseIds.has(log.exerciseId)) : [];
  state.cardioLogs = Array.isArray(payload?.cardioLogs) ? payload.cardioLogs.filter(log => cardioById(log.activityId)) : [];
  state.sessions = Array.isArray(payload?.workoutSessions) ? payload.workoutSessions : [];
  state.routines = withCurrentBuiltInRoutines(payload?.routines).map(routine => ({ ...routine, exerciseIds: (routine.exerciseIds || []).filter(id => validExerciseIds.has(id)) }));
  state.profile = normalizeProfile(payload?.profile || state.profile);
  if (state.account) state.account.name = state.profile.displayName;
  const settings = payload?.settings || {};
  state.settings = {
    weightUnit: settings.weightUnit === "kg" ? "kg" : "lb",
    weeklySetTarget: Math.min(30, Math.max(4, Number(settings.weeklySetTarget) || DEFAULT_SETTINGS.weeklySetTarget)),
    restSeconds: [60, 90, 120, 180].includes(Number(settings.restSeconds)) ? Number(settings.restSeconds) : DEFAULT_SETTINGS.restSeconds
  };
  state.activeWorkout = payload?.activeWorkout || null;
}
function persistTrainingCache() {
  const previousHydrating = state.isHydrating; state.isHydrating = true;
  saveLogs(); saveCardioLogs(); saveSessions(); saveRoutines(); saveCustomExercises(); saveSettings(); saveProfile(); saveActiveWorkout();
  state.isHydrating = previousHydrating;
}
async function verifiedLegacyPayload() {
  if (!state.migrationPassword || !crypto.subtle) return null;
  const legacy = getAccounts().find(account => account.email === state.account.email);
  if (!legacy || localStorage.getItem(`${LEGACY_MIGRATION_KEY}:${state.account.id}`) === "true") return null;
  try {
    const hash = await deriveLegacyPassword(state.migrationPassword, base64ToBytes(legacy.passwordSalt));
    return hash === legacy.passwordHash ? trainingPayloadForAccount(legacy.id) : null;
  } catch { return null; }
}
function setCloudStatus(status) {
  const label = document.querySelector("#cloudStatusLabel");
  const pill = document.querySelector("#cloudStatus");
  const badge = document.querySelector("#settingsSyncBadge");
  const message = document.querySelector("#settingsSyncMessage");
  const copy = { synced: "Synced", syncing: "Syncing…", offline: "Offline cache" }[status] || "Cloud account";
  if (label) label.textContent = copy;
  if (pill) pill.dataset.status = status;
  if (badge) badge.textContent = copy;
  if (message) message.textContent = status === "synced" ? "Your training is backed up and available anywhere you sign in." : status === "syncing" ? "Saving your latest changes securely…" : "Changes stay on this device and will sync when the connection returns.";
}
function scheduleCloudSync() {
  if (!state.account || !state.cloudSession || state.isHydrating) return;
  clearTimeout(state.cloudSyncTimer); setCloudStatus(navigator.onLine ? "syncing" : "offline");
  if (!navigator.onLine) return;
  state.cloudSyncTimer = setTimeout(() => syncToCloud().catch(() => setCloudStatus("offline")), 700);
}
async function syncToCloud() {
  if (!state.account || !navigator.onLine) { setCloudStatus("offline"); return; }
  setCloudStatus("syncing");
  const payload = currentTrainingPayload();
  const response = await authenticatedCloudFetch("/rest/v1/training_snapshots?on_conflict=user_id", {
    method: "POST",
    headers: { "Content-Type": "application/json", Prefer: "resolution=merge-duplicates,return=minimal" },
    body: JSON.stringify({ user_id: state.account.id, payload, schema_version: 4, updated_at: new Date().toISOString() })
  });
  if (!response.ok) await parseCloudResponse(response, "Unable to sync your training.");
  localStorage.removeItem(`${CLOUD_DIRTY_KEY}:${state.account.id}`);
  setCloudStatus("synced");
}
async function syncFromCloud() {
  if (!state.account || !state.cloudSession || !navigator.onLine) { setCloudStatus("offline"); return; }
  setCloudStatus("syncing");
  const response = await authenticatedCloudFetch(`/rest/v1/training_snapshots?select=payload,updated_at&user_id=eq.${encodeURIComponent(state.account.id)}&limit=1`);
  const rows = await parseCloudResponse(response, "Unable to load your synced training.");
  const remote = rows?.[0]?.payload || null;
  const local = currentTrainingPayload();
  const dirty = localStorage.getItem(`${CLOUD_DIRTY_KEY}:${state.account.id}`) === "true";
  const legacy = await verifiedLegacyPayload();
  let chosen = remote && !dirty ? remote : local;
  if (legacy && payloadHasTraining(legacy)) chosen = mergeTrainingPayload(chosen, legacy);
  state.isHydrating = true; applyTrainingPayload(chosen); persistTrainingCache(); state.isHydrating = false;
  if (legacy) localStorage.setItem(`${LEGACY_MIGRATION_KEY}:${state.account.id}`, "true");
  state.migrationPassword = null;
  populateSelects(); applySettingsToUI(); renderAll();
  if (!remote || dirty || legacy) await syncToCloud();
  else setCloudStatus("synced");
}

async function syncNow() {
  const button = document.querySelector("#syncNowButton");
  button.disabled = true;
  try {
    await syncFromCloud();
    showToast(navigator.onLine ? "Training synced." : "You're offline. Changes will sync when you reconnect.");
  } catch (error) {
    setCloudStatus("offline");
    showToast(error.message || "Unable to sync right now.");
  } finally { button.disabled = false; }
}

function setAuthMode(mode) {
  state.authMode = mode;
  const creating = mode === "create";
  document.querySelector("#createAccountTab").classList.toggle("active", creating);
  document.querySelector("#signInTab").classList.toggle("active", !creating);
  document.querySelector("#nameField").hidden = !creating;
  document.querySelector("#accountName").required = creating;
  document.querySelector("#accountPassword").autocomplete = creating ? "new-password" : "current-password";
  document.querySelector("#authEyebrow").textContent = creating ? "Start from zero" : "Welcome back";
  document.querySelector("#authTitle").textContent = creating ? "Create your account" : "Sign in to RepRoot";
  document.querySelector("#authSubtitle").textContent = creating ? "Create one account for every device you train with." : "Continue with your synced training history.";
  document.querySelector("#authSubmitLabel").textContent = creating ? "Create account" : "Sign in";
  document.querySelector("#authError").textContent = "";
}

async function handleAuthSubmit(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const submit = form.querySelector("button[type=submit]");
  const name = document.querySelector("#accountName").value.trim();
  const email = document.querySelector("#accountEmail").value.trim().toLowerCase();
  const password = document.querySelector("#accountPassword").value;
  const error = document.querySelector("#authError");
  error.textContent = "";
  if (password.length < 10) { error.textContent = "Use a password with at least 10 characters."; return; }
  submit.disabled = true;
  try {
    let response;
    if (state.authMode === "create") {
      if (name.length < 2) throw new Error("Enter your full name.");
      response = await fetch(`${SUPABASE_URL}/auth/v1/signup`, {
        method: "POST", headers: { apikey: SUPABASE_PUBLISHABLE_KEY, "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, data: { name } })
      });
      const session = await parseCloudResponse(response, "Unable to create your account.");
      if (!session.access_token) {
        setAuthMode("signin");
        error.textContent = "Check your email to confirm the account, then return here and sign in.";
        return;
      }
      storeCloudSession(session); state.account = accountFromSession(state.cloudSession); state.migrationPassword = password;
      await enterAuthenticatedApp(true);
    } else {
      response = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
        method: "POST", headers: { apikey: SUPABASE_PUBLISHABLE_KEY, "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      const session = await parseCloudResponse(response, "Unable to sign in.");
      storeCloudSession(session); state.account = accountFromSession(state.cloudSession); state.migrationPassword = password;
      await enterAuthenticatedApp(false);
    }
    form.reset();
  } catch (authError) { error.textContent = authError.message || "Unable to access this account."; }
  finally { submit.disabled = false; }
}

async function restoreAuthSession() {
  let session = null;
  try { session = normalizeCloudSession(JSON.parse(localStorage.getItem(CLOUD_SESSION_KEY))); } catch { session = null; }
  if (!session) { setAuthMode("create"); return; }
  storeCloudSession(session);
  if (navigator.onLine && session.expires_at * 1000 < Date.now() + 60000) {
    try { await refreshCloudSession(); }
    catch { storeCloudSession(null); setAuthMode("signin"); return; }
  }
  state.account = accountFromSession(state.cloudSession);
  await enterAuthenticatedApp(false);
}

async function enterAuthenticatedApp(isNewAccount) {
  state.isHydrating = true;
  loadLogs();
  state.isHydrating = false;
  populateSelects();
  applySettingsToUI();
  document.body.classList.remove("auth-locked");
  renderProfile();
  const latestExercise = [...state.logs].sort((a, b) => b.date.localeCompare(a.date))[0]?.exerciseId;
  if (latestExercise) document.querySelector("#progressExercise").value = latestExercise;
  state.selectedWeekStart = startOfWeek(new Date());
  routeTo(location.hash.slice(1) || "overview", false);
  renderAll(); startTimerLoop();
  try { await syncFromCloud(); } catch { setCloudStatus("offline"); }
  if (isNewAccount || !state.account.tutorialComplete) setTimeout(() => openTutorial(0), 250);
}

async function signOut() {
  setSidebarOpen(false);
  const accessToken = state.cloudSession?.access_token;
  clearTimeout(state.cloudSyncTimer);
  if (localStorage.getItem(`${CLOUD_DIRTY_KEY}:${state.account?.id}`) === "true") {
    try { await syncToCloud(); } catch { /* The local cache remains available for the next sign-in. */ }
  }
  if (accessToken && navigator.onLine) fetch(`${SUPABASE_URL}/auth/v1/logout`, { method: "POST", headers: { apikey: SUPABASE_PUBLISHABLE_KEY, Authorization: `Bearer ${accessToken}` } }).catch(() => {});
  localStorage.removeItem(AUTH_SESSION_KEY); storeCloudSession(null);
  clearInterval(state.timerInterval); clearInterval(state.restTimerInterval);
  state.account = null; state.logs = []; state.cardioLogs = []; state.sessions = []; state.activeWorkout = null; state.routines = []; state.customExercises = []; state.settings = { ...DEFAULT_SETTINGS }; state.profile = { ...DEFAULT_PROFILE };
  document.querySelector("#tutorialOverlay").hidden = true;
  document.body.classList.add("auth-locked");
  setAuthMode("signin");
  document.querySelector("#accountPassword").value = "";
}

function updateCurrentAccount(updates) {
  if (!state.account) return;
  Object.assign(state.account, updates);
  if (updates.name) state.profile.displayName = String(updates.name).trim().slice(0, 50);
  saveProfile();
}

function openTutorial(step = 0) {
  state.tutorialStep = Math.max(0, Math.min(TUTORIAL_STEPS.length - 1, step));
  document.querySelector("#tutorialOverlay").hidden = false;
  renderTutorial();
}
function renderTutorial() {
  const step = TUTORIAL_STEPS[state.tutorialStep];
  document.querySelector("#tutorialIcon").textContent = step.icon;
  document.querySelector("#tutorialStepLabel").textContent = `${step.label} · ${state.tutorialStep + 1} of ${TUTORIAL_STEPS.length}`;
  document.querySelector("#tutorialTitle").textContent = step.title;
  document.querySelector("#tutorialCopy").textContent = step.copy;
  document.querySelector("#tutorialTip").textContent = step.tip;
  document.querySelector("#tutorialDots").innerHTML = TUTORIAL_STEPS.map((_, index) => `<i class="${index === state.tutorialStep ? "active" : ""}"></i>`).join("");
  document.querySelector("#tutorialPrevious").style.visibility = state.tutorialStep ? "visible" : "hidden";
  document.querySelector("#tutorialNext").textContent = state.tutorialStep === TUTORIAL_STEPS.length - 1 ? "Start training →" : "Next →";
}
function previousTutorialStep() { if (state.tutorialStep > 0) { state.tutorialStep--; renderTutorial(); } }
function nextTutorialStep() {
  if (state.tutorialStep < TUTORIAL_STEPS.length - 1) { state.tutorialStep++; renderTutorial(); }
  else completeTutorial();
}
function completeTutorial() {
  document.querySelector("#tutorialOverlay").hidden = true;
  updateCurrentAccount({ tutorialComplete: true });
}

function populateSelects() {
  const exercises = [...allExercises()].sort((a, b) => a.name.localeCompare(b.name));
  const exerciseOptions = MUSCLE_GROUPS.map(group => {
    const options = exercises.filter(exercise => exercise.primary === group).map(exercise => `<option value="${exercise.id}">${escapeHTML(exercise.name)}</option>`).join("");
    return options ? `<optgroup label="${group}">${options}</optgroup>` : "";
  }).join("");
  const selected = Object.fromEntries(["logExercise", "progressExercise", "liveExercise"].map(id => [id, document.querySelector(`#${id}`)?.value]));
  document.querySelector("#logExercise").innerHTML = exerciseOptions;
  document.querySelector("#progressExercise").innerHTML = exerciseOptions;
  document.querySelector("#logMuscle").innerHTML = MUSCLE_GROUPS.map(group => `<option>${group}</option>`).join("");
  document.querySelector("#muscleFilter").innerHTML = `<option value="all">All muscle groups</option>${MUSCLE_GROUPS.map(group => `<option>${group}</option>`).join("")}`;
  const movements = [...new Set(exercises.map(ex => ex.movement))].sort();
  document.querySelector("#movementFilter").innerHTML = `<option value="all">All movement types</option>${movements.map(type => `<option>${escapeHTML(type)}</option>`).join("")}`;
  document.querySelector("#cardioActivity").innerHTML = CARDIO_ACTIVITIES.map(activity => `<option value="${activity.id}">${activity.name}</option>`).join("");
  const favoriteMachines = exercises.filter(exercise => /machine|leg press/i.test(exercise.equipment)).sort((a, b) => a.name.localeCompare(b.name));
  document.querySelector("#profileFavoriteMachine").innerHTML = `<option value="">Still deciding</option>${favoriteMachines.map(exercise => `<option value="${exercise.id}">${escapeHTML(exercise.name)}</option>`).join("")}`;
  document.querySelector("#liveExercise").innerHTML = exerciseOptions;
  document.querySelector("#customExercisePrimary").innerHTML = MUSCLE_GROUPS.map(group => `<option>${group}</option>`).join("");
  document.querySelector("#routineMuscleFilter").innerHTML = `<option value="all">All muscle groups</option><option value="lower">Lower body</option>${MUSCLE_GROUPS.map(group => `<option value="${group}">${group}</option>`).join("")}`;
  document.querySelector("#routineExerciseChoices").innerHTML = exercises.map(exercise => `<label data-muscle="${exercise.primary}" data-search="${escapeHTML(`${exercise.name} ${(exercise.aliases || []).join(" ")} ${exercise.primary} ${exercise.equipment} ${exercise.movement}`.toLowerCase())}"><input type="checkbox" name="routineExercise" value="${exercise.id}" /><span><strong>${escapeHTML(exercise.name)}</strong><small>${exercise.primary} · ${escapeHTML(exercise.equipment)}</small></span></label>`).join("");
  document.querySelector("#customExerciseSecondary").innerHTML = MUSCLE_GROUPS.map(group => `<label><input type="checkbox" name="secondaryMuscle" value="${group}" />${group}</label>`).join("");
  ["logExercise", "progressExercise", "liveExercise"].forEach(id => { if (selected[id] && exerciseById(selected[id])) document.querySelector(`#${id}`).value = selected[id]; });
  const firstLoggedExercise = [...state.logs].sort((a, b) => b.date.localeCompare(a.date))[0]?.exerciseId;
  if (firstLoggedExercise) document.querySelector("#progressExercise").value = firstLoggedExercise;
  document.querySelector("#muscleGroupTotal").textContent = MUSCLE_GROUPS.length;
  renderRoutineOptions();
}

const EXERCISE_PICKER_FILTERS = [
  ["recent", "Recent"], ["lower", "Lower body"], ["machine", "Machines"], ["cable", "Cables"],
  ["dumbbells", "Dumbbells"], ["smith", "Smith"], ["upper", "Upper body"], ["core", "Core"], ["all", "All"]
];

function recentExerciseIds() {
  const active = [...(state.activeWorkout?.sets || [])].reverse().map(set => set.exerciseId);
  const logged = [...state.logs].sort((a, b) => b.date.localeCompare(a.date) || Number(b.createdAt || 0) - Number(a.createdAt || 0)).map(log => log.exerciseId);
  return [...new Set([...active, ...logged])].slice(0, 10);
}

function exerciseMatchesPickerFilter(exercise, filter, recentIds) {
  const equipment = exercise.equipment.toLowerCase();
  if (filter === "recent") return recentIds.includes(exercise.id);
  if (filter === "lower") return LOWER_BODY_MUSCLES.includes(exercise.primary);
  if (filter === "upper") return !LOWER_BODY_MUSCLES.includes(exercise.primary) && exercise.primary !== "Core";
  if (filter === "core") return exercise.primary === "Core";
  if (filter === "machine") return equipment.includes("machine") || equipment.includes("leg press");
  if (filter === "cable") return equipment.includes("cable");
  if (filter === "dumbbells") return equipment.includes("dumbbell");
  if (filter === "smith") return equipment.includes("smith");
  return true;
}

function openExercisePicker(targetId) {
  state.exercisePickerTarget = targetId;
  document.querySelector("#exercisePickerSearch").value = "";
  if (state.exercisePickerFilter === "recent" && !recentExerciseIds().length) state.exercisePickerFilter = "lower";
  renderExercisePicker();
  document.querySelector("#exercisePickerDialog").showModal();
  setTimeout(() => document.querySelector("#exercisePickerSearch").focus(), 50);
}

function renderExercisePicker() {
  const query = document.querySelector("#exercisePickerSearch").value.toLowerCase().trim();
  const recentIds = recentExerciseIds();
  const recentRank = new Map(recentIds.map((id, index) => [id, index]));
  document.querySelector("#exercisePickerFilters").innerHTML = EXERCISE_PICKER_FILTERS
    .filter(([id]) => id !== "recent" || recentIds.length)
    .map(([id, label]) => `<button type="button" class="${state.exercisePickerFilter === id ? "active" : ""}" data-picker-filter="${id}">${label}</button>`).join("");
  const selectedId = document.querySelector(`#${state.exercisePickerTarget}`)?.value;
  const exercises = allExercises().filter(exercise => {
    const haystack = `${exercise.name} ${(exercise.aliases || []).join(" ")} ${exercise.primary} ${exercise.equipment} ${exercise.movement} ${exerciseSecondary(exercise).join(" ")}`.toLowerCase();
    return exerciseMatchesPickerFilter(exercise, state.exercisePickerFilter, recentIds) && haystack.includes(query);
  }).sort((a, b) => {
    if (state.exercisePickerFilter === "recent") return (recentRank.get(a.id) ?? 99) - (recentRank.get(b.id) ?? 99);
    return a.primary.localeCompare(b.primary) || a.name.localeCompare(b.name);
  });
  document.querySelector("#exercisePickerResults").innerHTML = exercises.length ? exercises.map(exercise => `<button type="button" class="exercise-picker-result ${exercise.id === selectedId ? "selected" : ""}" data-picker-exercise="${exercise.id}"><span class="exercise-initials">${MUSCLE_ABBR[exercise.primary]}</span><span><strong>${escapeHTML(exercise.name)}</strong><small>${exercise.primary} · ${escapeHTML(exercise.equipment)}</small></span><b>${exercise.id === selectedId ? "Selected" : "Choose"}</b></button>`).join("") : `<div class="empty-state">No exercises match. Try All or a different search.</div>`;
}

function handleExercisePickerFilter(event) {
  const button = event.target.closest("[data-picker-filter]"); if (!button) return;
  state.exercisePickerFilter = button.dataset.pickerFilter;
  renderExercisePicker();
}

function handleExercisePickerChoice(event) {
  const button = event.target.closest("[data-picker-exercise]"); if (!button) return;
  const select = document.querySelector(`#${state.exercisePickerTarget}`);
  if (!select || !exerciseById(button.dataset.pickerExercise)) return;
  select.value = button.dataset.pickerExercise;
  select.dispatchEvent(new Event("change", { bubbles: true }));
  document.querySelector("#exercisePickerDialog").close();
  if (state.exercisePickerTarget === "liveExercise") document.querySelector("#liveWeight").focus();
}

function filterRoutineExercises() {
  const query = document.querySelector("#routineExerciseSearch").value.toLowerCase().trim();
  const filter = document.querySelector("#routineMuscleFilter").value;
  document.querySelectorAll("#routineExerciseChoices label").forEach(label => {
    const muscleMatch = filter === "all" || label.dataset.muscle === filter || (filter === "lower" && LOWER_BODY_MUSCLES.includes(label.dataset.muscle));
    label.hidden = !muscleMatch || !label.dataset.search.includes(query);
  });
}

function openRoutineDialog() {
  document.querySelector("#routineExerciseSearch").value = "";
  document.querySelector("#routineMuscleFilter").value = "all";
  filterRoutineExercises();
  document.querySelector("#routineDialog").showModal();
}

function setSidebarOpen(isOpen) {
  document.querySelector(".sidebar").classList.toggle("open", isOpen);
  document.body.classList.toggle("sidebar-open", isOpen);
  document.querySelector("#menuButton").setAttribute("aria-expanded", String(isOpen));
}

function bindEvents() {
  document.querySelectorAll("[data-route]").forEach(item => item.addEventListener("click", event => { event.preventDefault(); routeTo(item.dataset.route); }));
  document.querySelectorAll("[data-route-button]").forEach(item => item.addEventListener("click", () => routeTo(item.dataset.routeButton)));
  document.querySelectorAll("[data-start-workout]").forEach(item => item.addEventListener("click", startBlankWorkout));
  window.addEventListener("hashchange", () => routeTo(location.hash.slice(1) || "overview", false));
  document.querySelector("#menuButton").addEventListener("click", () => setSidebarOpen(!document.querySelector(".sidebar").classList.contains("open")));
  document.querySelector("#previousWeek").addEventListener("click", () => changeWeek(-7));
  document.querySelector("#nextWeek").addEventListener("click", () => changeWeek(7));
  document.querySelector("#logExercise").addEventListener("change", syncExerciseFields);
  document.querySelectorAll("[data-exercise-picker]").forEach(button => button.addEventListener("click", () => openExercisePicker(button.dataset.exercisePicker)));
  document.querySelector("#exercisePickerSearch").addEventListener("input", renderExercisePicker);
  document.querySelector("#exercisePickerFilters").addEventListener("click", handleExercisePickerFilter);
  document.querySelector("#exercisePickerResults").addEventListener("click", handleExercisePickerChoice);
  ["#logSets", "#logReps", "#logWeight"].forEach(id => document.querySelector(id).addEventListener("input", updateVolumePreview));
  document.querySelector("#workoutForm").addEventListener("submit", saveWorkoutEntry);
  document.querySelector("#cardioForm").addEventListener("submit", saveCardioEntry);
  document.querySelector("#cardioActivity").addEventListener("change", syncCardioFields);
  ["#cardioDuration", "#cardioDistance"].forEach(id => document.querySelector(id).addEventListener("input", updatePacePreview));
  ["#exerciseSearch", "#muscleFilter", "#movementFilter"].forEach(id => document.querySelector(id).addEventListener("input", renderExercises));
  document.querySelector("#progressExercise").addEventListener("change", renderProgressChart);
  document.querySelector("#historySearch").addEventListener("input", renderHistory);
  document.querySelector("#exerciseRows").addEventListener("click", handleExerciseTableClick);
  document.querySelector("#historyRows").addEventListener("click", handleHistoryClick);
  document.querySelector("#exportButton").addEventListener("click", exportJSON);
  document.querySelector("#exportHistoryButton").addEventListener("click", exportCSV);
  document.querySelector("#exportCardioButton").addEventListener("click", exportCardioCSV);
  document.querySelector("#clearDataButton").addEventListener("click", clearTrainingData);
  document.querySelector("#activityStrip").addEventListener("click", handleActivityPick);
  document.querySelector("#liveExercise").addEventListener("change", syncLiveExercise);
  document.querySelector("#completeSetButton").addEventListener("click", completeWorkoutSet);
  document.querySelector("#pauseWorkoutButton").addEventListener("click", toggleWorkoutPause);
  document.querySelector("#finishWorkoutButton").addEventListener("click", finishWorkout);
  document.querySelector("#undoSetButton").addEventListener("click", undoWorkoutSet);
  document.querySelector("#discardWorkoutButton").addEventListener("click", discardWorkout);
  document.querySelector("#startRoutineButton").addEventListener("click", startSelectedRoutine);
  document.querySelector("#workoutRoutineSelect").addEventListener("change", renderRoutinePreview);
  document.querySelector("#routinePreview").addEventListener("click", chooseRoutineExercise);
  document.querySelector("#createRoutineButton").addEventListener("click", openRoutineDialog);
  ["#routineExerciseSearch", "#routineMuscleFilter"].forEach(id => document.querySelector(id).addEventListener("input", filterRoutineExercises));
  document.querySelector("#routineForm").addEventListener("submit", saveRoutineFromDialog);
  document.querySelector("#deleteRoutineButton").addEventListener("click", deleteSelectedRoutine);
  document.querySelector("#restTimerSkip").addEventListener("click", stopRestTimer);
  document.querySelector("#newExerciseButton").addEventListener("click", () => document.querySelector("#exerciseDialog").showModal());
  document.querySelector("#customExerciseForm").addEventListener("submit", saveCustomExercise);
  document.querySelector("#settingsForm").addEventListener("submit", savePreferences);
  document.querySelector("#profileForm").addEventListener("submit", saveFitnessProfile);
  document.querySelector("#profileBio").addEventListener("input", updateProfileDraftPreview);
  document.querySelector("#profileDisplayName").addEventListener("input", updateProfileDraftPreview);
  document.querySelector("#profileFavoriteMachine").addEventListener("change", updateProfileDraftPreview);
  document.querySelector("#profilePhotoInput").addEventListener("change", handleProfilePhoto);
  document.querySelector("#removeProfilePhotoButton").addEventListener("click", removeProfilePhoto);
  document.querySelector("#syncNowButton").addEventListener("click", syncNow);
  document.querySelector("#settingsExportButton").addEventListener("click", exportJSON);
  document.querySelector("#importBackupInput").addEventListener("change", importBackup);
  document.querySelectorAll("[data-close-dialog]").forEach(button => button.addEventListener("click", () => document.querySelector(`#${button.dataset.closeDialog}`).close()));
  document.querySelector("#cardioHistoryRows").addEventListener("click", handleCardioHistoryClick);
  document.querySelector("#createAccountTab").addEventListener("click", () => setAuthMode("create"));
  document.querySelector("#signInTab").addEventListener("click", () => setAuthMode("signin"));
  document.querySelector("#authForm").addEventListener("submit", handleAuthSubmit);
  document.querySelector("#signOutButton").addEventListener("click", signOut);
  document.querySelector("#tutorialButton").addEventListener("click", () => openTutorial(0));
  document.querySelector("#tutorialClose").addEventListener("click", completeTutorial);
  document.querySelector("#tutorialPrevious").addEventListener("click", previousTutorialStep);
  document.querySelector("#tutorialNext").addEventListener("click", nextTutorialStep);
}

function routeTo(route, updateHash = true) {
  if (!document.querySelector(`[data-page="${route}"]`)) route = "overview";
  state.route = route;
  document.querySelectorAll(".page").forEach(page => page.classList.toggle("active", page.dataset.page === route));
  document.querySelectorAll(".nav-item").forEach(item => item.classList.toggle("active", item.dataset.route === route));
  document.querySelector("#pageCrumb").textContent = ({ overview: "Overview", log: "Strength training", cardio: "Cardio", workout: "Workout mode", exercises: "Exercise database", progress: "Progress", settings: "Settings & backup" })[route];
  document.querySelectorAll(".mobile-tabbar button").forEach(item => item.classList.toggle("active", item.dataset.routeButton === route));
  document.querySelector("#topWorkoutButton").hidden = route === "workout";
  setSidebarOpen(false);
  if (updateHash) history.pushState(null, "", `#${route}`);
  window.scrollTo({ top: 0, behavior: "smooth" });
  if (route === "progress") renderProgress();
  if (route === "cardio") renderCardio();
  if (route === "workout") renderWorkoutMode();
  if (route === "settings") renderSettings();
}

function renderAll() {
  renderOverview();
  renderExercises();
  renderProgress();
  renderLastEntry();
  renderCardio();
  renderWorkoutMode();
  renderRoutineOptions();
  renderSettings();
  updateVolumePreview();
}

function changeWeek(days) {
  state.selectedWeekStart.setDate(state.selectedWeekStart.getDate() + days);
  renderOverview();
}

function getWeekLogs(start = state.selectedWeekStart) { return state.logs.filter(log => inDateRange(log, start, endOfWeek(start))); }

function renderOverview() {
  const start = state.selectedWeekStart;
  const end = endOfWeek(start);
  const logs = getWeekLogs(start);
  const previousStart = new Date(start); previousStart.setDate(previousStart.getDate() - 7);
  const previousLogs = getWeekLogs(previousStart);
  const totalVolume = logs.reduce((sum, log) => sum + entryVolume(log), 0);
  const totalSets = logs.reduce((sum, log) => sum + workingSetCount(log), 0);
  const previousSets = previousLogs.reduce((sum, log) => sum + workingSetCount(log), 0);
  const muscles = new Set(MUSCLE_GROUPS.filter(group => logs.some(log => muscleCredit(log, group) > 0)));

  document.querySelector("#weekLabel").textContent = `${start.toLocaleDateString("en-US", { month: "short", day: "numeric" })} — ${end.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`;
  document.querySelector("#weeklyVolume").textContent = formatNumber(fromPounds(totalVolume));
  document.querySelector("#weeklyVolumeUnit").textContent = `${unitLabel()} lifted this week`;
  document.querySelector("#weeklySets").textContent = totalSets;
  document.querySelector("#setProgress").style.width = `${Math.min(100, totalSets / (state.settings.weeklySetTarget * MUSCLE_GROUPS.length) * 100)}%`;
  const diff = totalSets - previousSets;
  document.querySelector("#setComparison").textContent = previousSets ? `${diff >= 0 ? "+" : ""}${diff} vs. prior week` : "No prior week data";
  document.querySelector("#musclesTrained").textContent = muscles.size;
  document.querySelector("#muscleCoverageCopy").textContent = muscles.size >= Math.ceil(MUSCLE_GROUPS.length * 0.75) ? "Well-rounded weekly coverage" : `${MUSCLE_GROUPS.length - muscles.size} groups still untrained`;
  document.querySelector("#muscleDots").innerHTML = MUSCLE_GROUPS.map(group => `<i class="${muscles.has(group) ? "active" : ""}" title="${group}"></i>`).join("");

  const dailyVolumes = Array.from({ length: 7 }, (_, day) => logs.filter(log => ((parseLocalDate(log.date).getDay() + 6) % 7) === day).reduce((sum, log) => sum + entryVolume(log), 0));
  const maxDaily = Math.max(...dailyVolumes, 1);
  document.querySelector("#volumeBars").innerHTML = dailyVolumes.map(volume => `<i style="height:${Math.max(3, volume / maxDaily * 31)}px"></i>`).join("");

  renderWeeklyBodyMap(logs);
  renderMuscleGrid(logs);
  renderRecentSessions(logs);
  renderInsight(logs);
  document.querySelector("#recentPrs").textContent = countRecentPRs();
}

function weeklyMuscleSets(logs) {
  return Object.fromEntries(MUSCLE_GROUPS.map(group => [group, logs.reduce((sum, log) => sum + muscleCredit(log, group), 0)]));
}

function weeklyHeatLevel(sets) {
  if (!sets) return 0;
  const ratio = sets / state.settings.weeklySetTarget;
  if (ratio < 0.25) return 1;
  if (ratio < 0.5) return 2;
  if (ratio < 1) return 3;
  if (ratio < 1.5) return 4;
  return 5;
}

function renderWeeklyBodyMap(logs) {
  const counts = weeklyMuscleSets(logs);
  const ranked = Object.entries(counts).filter(([, sets]) => sets > 0).sort((a, b) => b[1] - a[1]);
  document.querySelectorAll("[data-week-muscle]").forEach(zone => {
    const group = zone.dataset.weekMuscle;
    const sets = counts[group] || 0;
    const formattedSets = Number(sets.toFixed(1));
    const label = `${group}: ${formattedSets} credited working set${formattedSets === 1 ? "" : "s"} this week`;
    zone.dataset.level = weeklyHeatLevel(sets);
    zone.setAttribute("aria-label", label);
    zone.querySelector("title").textContent = label;
  });

  const title = document.querySelector("#bodyHeatmapTitle");
  const copy = document.querySelector("#bodyHeatmapCopy");
  if (!ranked.length) {
    title.textContent = "Your week is a clean slate.";
    copy.textContent = "Log working sets and the muscle map will build with every workout.";
  } else {
    const [leadingGroup, leadingSets] = ranked[0];
    title.textContent = `${leadingGroup} leads your week.`;
    copy.textContent = `${Number(leadingSets.toFixed(1))} credited sets landed there. Color intensity is scaled against your ${state.settings.weeklySetTarget}-set weekly target.`;
  }
  document.querySelector("#heatmapSummary").innerHTML = ranked.length
    ? ranked.slice(0, 4).map(([group, sets]) => `<span>${group} <strong>${Number(sets.toFixed(1))}</strong></span>`).join("")
    : `<span>No working sets yet</span>`;
}

function recoveryFor(group, weeklySets) {
  const latest = state.logs.filter(log => muscleCredit(log, group) > 0).sort((a, b) => (b.createdAt || parseLocalDate(b.date)) - (a.createdAt || parseLocalDate(a.date)))[0];
  if (!latest) return { type: "ready", label: "Likely ready", detail: "No recent work" };
  const trainedAt = latest.createdAt ? new Date(latest.createdAt) : parseLocalDate(latest.date);
  const hours = Math.max(0, (new Date() - trainedAt) / 36e5);
  if (hours < 24) return { type: "rest", label: "Recently trained", detail: hours < 2 ? "Just trained" : `${Math.round(hours)}h ago` };
  if (hours < 48) return { type: "soon", label: "May be recovering", detail: `${Math.round(hours)}h ago` };
  return { type: "ready", label: weeklySets >= state.settings.weeklySetTarget ? "Target met" : "Likely ready", detail: `${Math.max(2, Math.round(hours / 24))}d ago` };
}

function renderMuscleGrid(logs) {
  document.querySelector("#muscleGrid").innerHTML = MUSCLE_GROUPS.map(group => {
    const groupLogs = logs.filter(log => muscleCredit(log, group) > 0);
    const sets = groupLogs.reduce((sum, log) => sum + muscleCredit(log, group), 0);
    const volume = groupLogs.filter(log => (log.muscle || exerciseById(log.exerciseId)?.primary) === group).reduce((sum, log) => sum + entryVolume(log), 0);
    const recovery = recoveryFor(group, sets);
    return `<article class="muscle-card">
      <div class="muscle-card-top"><span class="muscle-glyph">${MUSCLE_ABBR[group]}</span><div><h3>${group}</h3><p>${recovery.detail}</p></div><span class="recovery-pill ${recovery.type}">${recovery.label}</span></div>
      <div class="muscle-volume"><strong>${Number(sets.toFixed(1))} sets</strong><span class="bar"><i style="width:${Math.min(100, sets / state.settings.weeklySetTarget * 100)}%"></i></span><span>${formatNumber(fromPounds(volume))} ${unitLabel()}</span></div>
    </article>`;
  }).join("");
}

function renderRecentSessions(logs) {
  const byDate = logs.reduce((map, log) => { (map[log.date] ||= []).push(log); return map; }, {});
  const sessions = Object.entries(byDate).sort(([a], [b]) => b.localeCompare(a)).slice(0, 4);
  document.querySelector("#recentSessions").innerHTML = sessions.length ? sessions.map(([date, entries]) => {
    const d = parseLocalDate(date);
    const names = entries.map(entry => exerciseById(entry.exerciseId)?.name || "Unknown exercise");
    return `<div class="session-row"><div class="date-block"><strong>${d.getDate()}</strong><span>${d.toLocaleDateString("en-US", { month: "short" })}</span></div><div><h3>${names.slice(0,2).join(" + ")}</h3><p>${entries.reduce((sum, entry) => sum + workingSetCount(entry), 0)} working sets · ${new Set(entries.map(e => e.muscle)).size} muscle group${entries.length > 1 ? "s" : ""}</p></div><div class="session-volume"><strong>${formatNumber(fromPounds(entries.reduce((sum, entry) => sum + entryVolume(entry), 0)))} ${unitLabel()}</strong><span>volume</span></div></div>`;
  }).join("") : `<div class="empty-state">No sessions logged in this week.</div>`;
}

function renderInsight(logs) {
  const setsByMuscle = Object.fromEntries(MUSCLE_GROUPS.map(group => [group, logs.reduce((sum, log) => sum + muscleCredit(log, group), 0)]));
  const [highestGroup, highestSets] = Object.entries(setsByMuscle).sort((a, b) => b[1] - a[1])[0];
  const neglected = MUSCLE_GROUPS.filter(group => setsByMuscle[group] === 0);
  let title = "Your balance looks solid.";
  let copy = "Weekly sets are spread across your muscle groups. Keep intensity appropriate while recovery catches up.";
  if (!logs.length) { title = "This week is a clean slate."; copy = "Log your first working sets and RepRoot will turn them into recovery and volume guidance."; }
  else if (highestSets >= state.settings.weeklySetTarget * 1.5) { title = `${highestGroup} is above your weekly target.`; copy = `You have ${Number(highestSets.toFixed(1))} credited working sets for ${highestGroup}. Treat this as context—not a medical recovery verdict—and adjust based on performance and how you feel.`; }
  else if (neglected.length >= 4) { title = "A few groups need attention."; copy = `${neglected.slice(0, 3).join(", ")}${neglected.length > 3 ? " and others" : ""} have no direct sets this week. Add them if they fit your program.`; }
  document.querySelector("#insightTitle").textContent = title;
  document.querySelector("#insightCopy").textContent = copy;
}

function countRecentPRs() {
  const cutoff = new Date(); cutoff.setDate(cutoff.getDate() - 30);
  let count = 0;
  allExercises().forEach(exercise => {
    const ordered = state.logs.filter(log => log.exerciseId === exercise.id).sort((a, b) => a.date.localeCompare(b.date));
    let previousBest = 0;
    ordered.forEach(log => { const value = e1rm(log); if (value > previousBest) { if (parseLocalDate(log.date) >= cutoff && previousBest > 0) count++; previousBest = value; } });
  });
  return count;
}

function syncExerciseFields() {
  const exercise = exerciseById(document.querySelector("#logExercise").value);
  if (!exercise) return;
  document.querySelector("#logMuscle").value = exercise.primary;
  document.querySelector("#logMovement").value = exercise.movement;
  document.querySelector("#logWeightLabel").textContent = `${exercise.equipment === "Bodyweight" ? "Added load" : "Weight"} (${unitLabel()}) *`;
  updateVolumePreview();
}
function updateVolumePreview() {
  const sets = Number(document.querySelector("#logSets").value) || 0;
  const reps = Number(document.querySelector("#logReps").value) || 0;
  const weight = Number(document.querySelector("#logWeight").value) || 0;
  document.querySelector("#volumePreview").textContent = `${formatNumber(sets * reps * weight)} ${unitLabel()}`;
}

// -----------------------------------------------------------------------------
// Cardio logging and stamina trends
// -----------------------------------------------------------------------------

function syncCardioFields() {
  const activity = cardioById(document.querySelector("#cardioActivity").value) || CARDIO_ACTIVITIES[0];
  document.querySelector("#distanceLabel").textContent = `Distance (${activity.unit}) *`;
  document.querySelectorAll(".activity-button").forEach(button => button.classList.toggle("active", button.dataset.activity === activity.id));
  updatePacePreview();
  renderCardioTrend(activity.id);
}

function formatPace(duration, distance, activity) {
  if (!duration || !distance) return "—";
  let minutesPerUnit = duration / distance;
  let suffix = `/${activity.unit.replace(/s$/, "")}`;
  if (activity.id === "swimming") { minutesPerUnit = duration / (distance / 100); suffix = "/100 yd"; }
  if (activity.id === "rowing") { minutesPerUnit = duration / (distance / 500); suffix = "/500 m"; }
  let whole = Math.floor(minutesPerUnit);
  let seconds = Math.round((minutesPerUnit - whole) * 60);
  if (seconds === 60) { whole += 1; seconds = 0; }
  return `${whole}:${String(seconds).padStart(2, "0")} ${suffix}`;
}

function updatePacePreview() {
  const activity = cardioById(document.querySelector("#cardioActivity").value) || CARDIO_ACTIVITIES[0];
  const duration = Number(document.querySelector("#cardioDuration").value);
  const distance = Number(document.querySelector("#cardioDistance").value);
  document.querySelector("#pacePreview").textContent = formatPace(duration, distance, activity);
}

function handleActivityPick(event) {
  const button = event.target.closest("[data-activity]");
  if (!button) return;
  document.querySelector("#cardioActivity").value = button.dataset.activity;
  syncCardioFields();
}

function saveCardioEntry(event) {
  event.preventDefault();
  const entry = {
    id: cryptoId(), date: document.querySelector("#cardioDate").value,
    activityId: document.querySelector("#cardioActivity").value,
    duration: Number(document.querySelector("#cardioDuration").value),
    distance: Number(document.querySelector("#cardioDistance").value),
    effort: document.querySelector("#cardioEffort").value,
    heartRate: Number(document.querySelector("#cardioHeartRate").value) || null,
    notes: document.querySelector("#cardioNotes").value.trim(), createdAt: Date.now()
  };
  state.cardioLogs.push(entry); saveCardioLogs();
  document.querySelector("#cardioNotes").value = "";
  document.querySelector("#cardioHeartRate").value = "";
  renderCardio(); showToast(`${cardioById(entry.activityId).name} added to your cardio history.`);
}

function renderCardio() {
  const selectedId = document.querySelector("#cardioActivity")?.value || "running";
  document.querySelector("#activityStrip").innerHTML = CARDIO_ACTIVITIES.map(activity => `<button type="button" class="activity-button ${activity.id === selectedId ? "active" : ""}" data-activity="${activity.id}"><span>${activity.icon}</span><strong>${activity.name}</strong></button>`).join("");
  const weekLogs = state.cardioLogs.filter(log => inDateRange(log, startOfWeek(new Date()), endOfWeek(startOfWeek(new Date()))));
  const minutes = weekLogs.reduce((sum, log) => sum + Number(log.duration), 0);
  const miles = weekLogs.filter(log => cardioById(log.activityId)?.unit === "miles").reduce((sum, log) => sum + Number(log.distance), 0);
  const nonMileCount = weekLogs.filter(log => cardioById(log.activityId)?.unit !== "miles").length;
  document.querySelector("#cardioWeekMinutes").textContent = `${formatNumber(minutes)} min`;
  document.querySelector("#cardioWeekDistance").textContent = `${miles.toFixed(1)} miles${nonMileCount ? ` + ${nonMileCount} other` : ""}`;
  renderCardioTrend(selectedId);
  renderCardioHistory();
}

function renderCardioTrend(activityId) {
  const activity = cardioById(activityId) || CARDIO_ACTIVITIES[0];
  const logs = state.cardioLogs.filter(log => log.activityId === activity.id).sort((a, b) => a.date.localeCompare(b.date)).slice(-6);
  if (!document.querySelector("#cardioTrendTitle")) return;
  document.querySelector("#cardioTrendTitle").textContent = `${activity.name} performance`;
  const totalDuration = logs.reduce((sum, log) => sum + Number(log.duration), 0);
  const totalDistance = logs.reduce((sum, log) => sum + Number(log.distance), 0);
  const longest = Math.max(0, ...logs.map(log => Number(log.distance)));
  document.querySelector("#cardioStats").innerHTML = `<div><strong>${logs.length}</strong><span>Sessions</span></div><div><strong>${formatNumber(totalDuration)}</strong><span>Minutes</span></div><div><strong>${longest.toLocaleString()} </strong><span>Longest ${activity.unit}</span></div>`;
  const chart = document.querySelector("#cardioChart");
  if (logs.length < 2) {
    chart.innerHTML = `<div class="empty-state">Add two ${activity.name.toLowerCase()} logs to see a trend.</div>`;
  } else {
    const width = 330, height = 100, left = 10, bottom = 17, max = Math.max(...logs.map(log => Number(log.distance)), 1);
    const slot = (width - left * 2) / logs.length;
    chart.innerHTML = `<svg viewBox="0 0 ${width} ${height}" role="img" aria-label="${activity.name} distance trend">${logs.map((log, index) => { const barHeight = Math.max(5, Number(log.distance) / max * 65); const x = left + index * slot + 5; return `<rect x="${x}" y="${height-bottom-barHeight}" width="${Math.max(12, slot-10)}" height="${barHeight}" rx="4" fill="${index === logs.length-1 ? "#659b5e" : "#99ddc8"}"><title>${formatFullDate(log.date)}: ${log.distance} ${activity.unit}</title></rect><text x="${x+(slot-10)/2}" y="${height-4}" text-anchor="middle" class="chart-label">${formatShortDate(log.date)}</text>`; }).join("")}</svg>`;
  }
  const recent = [...logs].reverse().slice(0, 3);
  document.querySelector("#cardioRecent").innerHTML = recent.length ? recent.map(log => `<div class="cardio-recent-row"><span class="cardio-recent-icon">${activity.icon}</span><div><h3>${formatFullDate(log.date)}</h3><p>${log.duration} min · ${log.effort}${log.heartRate ? ` · ${log.heartRate} bpm` : ""}</p></div><strong>${log.distance.toLocaleString()} ${activity.unit}</strong></div>`).join("") : `<div class="empty-state">No ${activity.name.toLowerCase()} activity yet.</div>`;
}

function renderCardioHistory() {
  const logs = [...state.cardioLogs].sort((a, b) => b.date.localeCompare(a.date) || b.createdAt - a.createdAt);
  document.querySelector("#cardioHistoryRows").innerHTML = logs.length ? logs.map(log => {
    const activity = cardioById(log.activityId) || CARDIO_ACTIVITIES[0];
    return `<div class="cardio-history-row"><span>${formatShortDate(log.date)}</span><span><strong>${activity.name}</strong><small>${escapeHTML(log.notes || log.effort)}</small></span><span>${log.duration} min</span><span>${log.distance.toLocaleString()} ${activity.unit}</span><span>${formatPace(log.duration, log.distance, activity)}</span><button class="delete-button" data-delete-cardio="${log.id}" title="Delete activity" aria-label="Delete activity">×</button></div>`;
  }).join("") : `<div class="empty-state">No cardio activity logged yet.</div>`;
}

function handleCardioHistoryClick(event) {
  const button = event.target.closest("[data-delete-cardio]"); if (!button) return;
  if (!confirm("Delete this cardio activity? This cannot be undone.")) return;
  state.cardioLogs = state.cardioLogs.filter(log => log.id !== button.dataset.deleteCardio);
  saveCardioLogs(); renderCardio(); showToast("Cardio activity deleted.");
}

// -----------------------------------------------------------------------------
// Live workout mode
// -----------------------------------------------------------------------------

function syncLiveExercise() {
  const exercise = exerciseById(document.querySelector("#liveExercise").value) || allExercises()[0];
  document.querySelector("#completeSetMuscle").textContent = exercise.primary;
  const prior = [...state.logs].filter(log => log.exerciseId === exercise.id).sort((a, b) => b.date.localeCompare(a.date))[0];
  if (prior) {
    const set = representativeSet(prior);
    document.querySelector("#liveWeight").value = Number(fromPounds(set.weight).toFixed(state.settings.weightUnit === "kg" ? 1 : 1));
    document.querySelector("#liveReps").value = set.reps;
    document.querySelector("#previousPerformance").textContent = `Previous: ${formatSetSummary(prior)} · best ${formatWeight(set.weight)} × ${set.reps}${set.rir !== null && set.rir !== undefined && set.rir !== "" ? ` · ${set.rir} RIR` : ""}`;
  } else document.querySelector("#previousPerformance").textContent = "No previous sets for this exercise.";
  document.querySelector("#liveWeightLabel").textContent = `${exercise.equipment === "Bodyweight" ? "Added load" : "Weight"} (${unitLabel()})`;
}

function createActiveWorkout(routine = null) {
  state.activeWorkout = { id: cryptoId(), startedAt: Date.now(), pausedAt: null, totalPausedMs: 0, routineId: routine?.id || null, plannedExerciseIds: routine?.exerciseIds || [], sets: [] };
  saveActiveWorkout();
}

function startBlankWorkout() {
  if (!state.activeWorkout) { createActiveWorkout(); showToast("Workout started. Your timer is running."); }
  routeTo("workout");
  renderWorkoutMode();
}

function renderRoutineOptions() {
  const select = document.querySelector("#workoutRoutineSelect");
  if (!select) return;
  const current = select.value;
  select.innerHTML = state.routines.length ? state.routines.map(routine => `<option value="${routine.id}">${escapeHTML(routine.name)}</option>`).join("") : `<option value="">No routines yet</option>`;
  if (state.routines.some(routine => routine.id === current)) select.value = current;
  renderRoutinePreview();
}

function selectedRoutine() { return state.routines.find(routine => routine.id === document.querySelector("#workoutRoutineSelect").value); }

function renderRoutinePreview() {
  const routine = selectedRoutine();
  const completedIds = new Set((state.activeWorkout?.sets || []).filter(set => set.type !== "warmup").map(set => set.exerciseId));
  document.querySelector("#routinePreview").innerHTML = routine ? routine.exerciseIds.map(id => {
    const exercise = exerciseById(id); if (!exercise) return "";
    return `<button class="routine-chip ${completedIds.has(id) ? "complete" : ""}" data-routine-exercise="${id}" type="button">${escapeHTML(exercise.name)}</button>`;
  }).join("") : `<span class="muted-copy">Create a routine to save a reusable exercise order.</span>`;
  document.querySelector("#deleteRoutineButton").disabled = !routine || routine.builtIn;
}

function startSelectedRoutine() {
  const routine = selectedRoutine();
  if (!routine) { openRoutineDialog(); return; }
  if (state.activeWorkout?.sets.length && !confirm("Replace the active workout? Completed unsaved sets will be discarded.")) return;
  createActiveWorkout(routine);
  if (routine.exerciseIds[0]) { document.querySelector("#liveExercise").value = routine.exerciseIds[0]; syncLiveExercise(); }
  renderWorkoutMode(); showToast(`${routine.name} started.`);
}

function chooseRoutineExercise(event) {
  const button = event.target.closest("[data-routine-exercise]"); if (!button) return;
  document.querySelector("#liveExercise").value = button.dataset.routineExercise; syncLiveExercise();
  document.querySelector("#liveWeight").focus();
}

function saveRoutineFromDialog(event) {
  event.preventDefault();
  const name = document.querySelector("#routineName").value.trim();
  const exerciseIds = [...document.querySelectorAll('[name="routineExercise"]:checked')].map(input => input.value);
  if (name.length < 2 || !exerciseIds.length) { showToast("Name the routine and choose at least one exercise."); return; }
  const routine = { id: cryptoId(), name, exerciseIds, builtIn: false };
  state.routines.push(routine); saveRoutines(); renderRoutineOptions();
  document.querySelector("#workoutRoutineSelect").value = routine.id; renderRoutinePreview();
  event.currentTarget.reset(); document.querySelector("#routineDialog").close(); showToast(`${name} routine saved.`);
}

function deleteSelectedRoutine() {
  const routine = selectedRoutine(); if (!routine || routine.builtIn) return;
  if (!confirm(`Delete the ${routine.name} routine?`)) return;
  state.routines = state.routines.filter(item => item.id !== routine.id); saveRoutines(); renderRoutineOptions(); showToast("Routine deleted.");
}

function saveCustomExercise(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const name = document.querySelector("#customExerciseName").value.trim();
  const primary = document.querySelector("#customExercisePrimary").value;
  const equipment = document.querySelector("#customExerciseEquipment").value.trim();
  const movement = document.querySelector("#customExerciseMovement").value.trim();
  const secondary = [...document.querySelectorAll('[name="secondaryMuscle"]:checked')].map(input => input.value).filter(group => group !== primary);
  if (name.length < 2 || !MUSCLE_GROUPS.includes(primary) || !equipment || !movement) {
    showToast("Complete the exercise name, muscle, equipment, and movement.");
    return;
  }
  if (allExercises().some(exercise => exercise.name.toLowerCase() === name.toLowerCase())) {
    showToast("An exercise with that name already exists.");
    return;
  }
  const exercise = { id: `custom-${cryptoId()}`, name, primary, equipment, movement, secondary, custom: true };
  state.customExercises.push(exercise);
  saveCustomExercises();
  populateSelects();
  document.querySelector("#logExercise").value = exercise.id;
  document.querySelector("#liveExercise").value = exercise.id;
  syncExerciseFields();
  syncLiveExercise();
  renderExercises();
  form.reset();
  document.querySelector("#exerciseDialog").close();
  showToast(`${name} added to your exercise library.`);
}

function applySettingsToUI() {
  document.querySelector("#weightUnit").value = state.settings.weightUnit;
  document.querySelector("#weeklySetTarget").value = state.settings.weeklySetTarget;
  document.querySelector("#defaultRestSeconds").value = String(state.settings.restSeconds);
  document.querySelector("#liveRestSeconds").value = String(state.settings.restSeconds);
  syncExerciseFields();
  const exercise = exerciseById(document.querySelector("#liveExercise").value);
  if (exercise) document.querySelector("#liveWeightLabel").textContent = `${exercise.equipment === "Bodyweight" ? "Added load" : "Weight"} (${unitLabel()})`;
}

function profileInitials(name = "") {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map(part => part[0]).join("").toUpperCase() || "RR";
}

function paintProfilePhoto(element, photoDataUrl, name) {
  if (!element) return;
  element.replaceChildren();
  if (photoDataUrl) {
    const image = document.createElement("img");
    image.src = photoDataUrl; image.alt = "";
    element.append(image);
  } else element.textContent = profileInitials(name);
}

function renderProfile() {
  if (!state.account) return;
  state.profile = normalizeProfile(state.profile);
  const favorite = exerciseById(state.profile.favoriteExerciseId);
  paintProfilePhoto(document.querySelector("#profileAvatar"), state.profile.photoDataUrl, state.profile.displayName);
  paintProfilePhoto(document.querySelector("#profilePhotoPreview"), state.profile.photoDataUrl, state.profile.displayName);
  document.querySelector("#profileName").textContent = state.profile.displayName;
  document.querySelector("#profileFavorite").textContent = favorite ? `☆ ${favorite.name}` : "Personal training space";
  document.querySelector("#profilePreviewName").textContent = state.profile.displayName;
  document.querySelector("#profilePreviewBio").textContent = state.profile.bio || "Add a quick bio about what keeps you moving.";
  document.querySelector("#profilePreviewFavorite").textContent = favorite ? `★ ${favorite.name}` : "☆ Pick a favorite machine";
  document.querySelector("#profileDisplayName").value = state.profile.displayName;
  document.querySelector("#profileBio").value = state.profile.bio;
  document.querySelector("#profileBioCount").textContent = `${state.profile.bio.length} / 160`;
  document.querySelector("#profileFavoriteMachine").value = favorite?.id || "";
  document.querySelector("#removeProfilePhotoButton").hidden = !state.profile.photoDataUrl;
}

function updateProfileDraftPreview() {
  const name = document.querySelector("#profileDisplayName").value.trim() || "RepRoot athlete";
  const bio = document.querySelector("#profileBio").value.slice(0, 160);
  const favorite = exerciseById(document.querySelector("#profileFavoriteMachine").value);
  paintProfilePhoto(document.querySelector("#profilePhotoPreview"), state.profile.photoDataUrl, name);
  document.querySelector("#profilePreviewName").textContent = name;
  document.querySelector("#profilePreviewBio").textContent = bio || "Add a quick bio about what keeps you moving.";
  document.querySelector("#profilePreviewFavorite").textContent = favorite ? `★ ${favorite.name}` : "☆ Pick a favorite machine";
  document.querySelector("#profileBioCount").textContent = `${bio.length} / 160`;
}

function saveFitnessProfile(event) {
  event.preventDefault();
  const displayName = document.querySelector("#profileDisplayName").value.trim();
  if (displayName.length < 2) { showToast("Use at least two characters for your display name."); return; }
  state.profile = normalizeProfile({
    ...state.profile, displayName,
    bio: document.querySelector("#profileBio").value,
    favoriteExerciseId: document.querySelector("#profileFavoriteMachine").value
  });
  state.account.name = state.profile.displayName;
  saveProfile(); renderProfile();
  showToast("Fitness profile saved and ready to sync.");
}

async function resizedProfilePhoto(file) {
  if (!file?.type?.startsWith("image/")) throw new Error("Choose an image from your photo library.");
  if (file.size > 12 * 1024 * 1024) throw new Error("Choose a photo smaller than 12 MB.");
  const objectUrl = URL.createObjectURL(file);
  try {
    const image = new Image(); image.src = objectUrl;
    await image.decode();
    const sourceSize = Math.min(image.naturalWidth, image.naturalHeight);
    const sourceX = (image.naturalWidth - sourceSize) / 2;
    const sourceY = (image.naturalHeight - sourceSize) / 2;
    const outputSize = Math.min(420, sourceSize);
    const canvas = document.createElement("canvas"); canvas.width = outputSize; canvas.height = outputSize;
    const context = canvas.getContext("2d");
    context.fillStyle = "#f4f8f6"; context.fillRect(0, 0, outputSize, outputSize);
    context.drawImage(image, sourceX, sourceY, sourceSize, sourceSize, 0, 0, outputSize, outputSize);
    return canvas.toDataURL("image/jpeg", .82);
  } finally { URL.revokeObjectURL(objectUrl); }
}

async function handleProfilePhoto(event) {
  const input = event.currentTarget;
  try {
    if (!input.files?.[0]) return;
    state.profile.photoDataUrl = await resizedProfilePhoto(input.files[0]);
    updateProfileDraftPreview();
    document.querySelector("#removeProfilePhotoButton").hidden = false;
    showToast("Photo ready. Tap Save profile to sync it.");
  } catch (error) { showToast(error.message || "Unable to use that photo."); }
  finally { input.value = ""; }
}

function removeProfilePhoto() {
  state.profile.photoDataUrl = "";
  updateProfileDraftPreview();
  document.querySelector("#removeProfilePhotoButton").hidden = true;
}

function renderSettings() {
  if (!state.account) return;
  document.querySelector("#weightUnit").value = state.settings.weightUnit;
  document.querySelector("#weeklySetTarget").value = state.settings.weeklySetTarget;
  document.querySelector("#defaultRestSeconds").value = String(state.settings.restSeconds);
  renderProfile();
}

function savePreferences(event) {
  event.preventDefault();
  const oldUnit = state.settings.weightUnit;
  const newUnit = document.querySelector("#weightUnit").value === "kg" ? "kg" : "lb";
  const currentLogWeight = Number(document.querySelector("#logWeight").value) || 0;
  const currentLiveWeight = Number(document.querySelector("#liveWeight").value) || 0;
  const oldToPounds = value => oldUnit === "kg" ? value * 2.2046226218 : value;
  state.settings = {
    weightUnit: newUnit,
    weeklySetTarget: Math.min(30, Math.max(4, Number(document.querySelector("#weeklySetTarget").value) || DEFAULT_SETTINGS.weeklySetTarget)),
    restSeconds: [60, 90, 120, 180].includes(Number(document.querySelector("#defaultRestSeconds").value)) ? Number(document.querySelector("#defaultRestSeconds").value) : DEFAULT_SETTINGS.restSeconds
  };
  saveSettings();
  document.querySelector("#logWeight").value = Number(fromPounds(oldToPounds(currentLogWeight)).toFixed(1));
  document.querySelector("#liveWeight").value = Number(fromPounds(oldToPounds(currentLiveWeight)).toFixed(1));
  applySettingsToUI();
  renderAll();
  showToast(`Preferences saved. Weights now display in ${unitLabel()}.`);
}

function completeWorkoutSet() {
  if (!state.activeWorkout) createActiveWorkout();
  if (state.activeWorkout.pausedAt) toggleWorkoutPause();
  const exercise = exerciseById(document.querySelector("#liveExercise").value);
  const weight = toPounds(document.querySelector("#liveWeight").value);
  const reps = Number(document.querySelector("#liveReps").value);
  const type = document.querySelector("#liveSetType").value;
  const rirValue = document.querySelector("#liveRir").value;
  if (!exercise || reps < 1 || weight < 0) { showToast("Enter a valid weight and rep count."); return; }
  state.activeWorkout.sets.push({ id: cryptoId(), exerciseId: exercise.id, muscle: exercise.primary, secondary: exerciseSecondary(exercise), weight, reps, rir: rirValue === "" ? null : Number(rirValue), type, completedAt: Date.now() });
  saveActiveWorkout(); renderWorkoutMode();
  startRestTimer(Number(document.querySelector("#liveRestSeconds").value));
  if (navigator.vibrate) navigator.vibrate(35);
  showToast(`${type === "warmup" ? "Warm-up" : "Working set"} saved — ${formatWeight(weight)} × ${reps}.`);
}

function workoutElapsedMs() {
  if (!state.activeWorkout) return 0;
  const end = state.activeWorkout.pausedAt || Date.now();
  return Math.max(0, end - state.activeWorkout.startedAt - (state.activeWorkout.totalPausedMs || 0));
}

function formatTimer(ms) {
  const total = Math.floor(ms / 1000); const hours = Math.floor(total / 3600); const minutes = Math.floor((total % 3600) / 60); const seconds = total % 60;
  return hours ? `${String(hours).padStart(2,"0")}:${String(minutes).padStart(2,"0")}:${String(seconds).padStart(2,"0")}` : `${String(minutes).padStart(2,"0")}:${String(seconds).padStart(2,"0")}`;
}

function startTimerLoop() {
  clearInterval(state.timerInterval);
  state.timerInterval = setInterval(() => {
    const timer = document.querySelector("#workoutTimer");
    if (timer) timer.textContent = formatTimer(workoutElapsedMs());
  }, 1000);
}

function startRestTimer(seconds) {
  stopRestTimer(); state.restTimerEnd = Date.now() + seconds * 1000;
  document.querySelector("#restTimer").hidden = false; updateRestTimer();
  state.restTimerInterval = setInterval(updateRestTimer, 250);
}
function updateRestTimer() {
  const remaining = Math.max(0, state.restTimerEnd - Date.now());
  document.querySelector("#restTimerValue").textContent = formatTimer(remaining);
  if (!remaining) { stopRestTimer(); if (navigator.vibrate) navigator.vibrate([80, 60, 80]); showToast("Rest complete. Ready for the next set."); }
}
function stopRestTimer() { clearInterval(state.restTimerInterval); state.restTimerInterval = null; state.restTimerEnd = null; const timer = document.querySelector("#restTimer"); if (timer) timer.hidden = true; }

function toggleWorkoutPause() {
  if (!state.activeWorkout) return;
  if (state.activeWorkout.pausedAt) {
    state.activeWorkout.totalPausedMs += Date.now() - state.activeWorkout.pausedAt;
    state.activeWorkout.pausedAt = null;
  } else state.activeWorkout.pausedAt = Date.now();
  saveActiveWorkout(); renderWorkoutMode();
}

function undoWorkoutSet() {
  if (!state.activeWorkout?.sets.length) return;
  state.activeWorkout.sets.pop(); saveActiveWorkout(); renderWorkoutMode(); showToast("Last set removed.");
}

function discardWorkout() {
  if (!state.activeWorkout) return;
  if (state.activeWorkout.sets.length && !confirm("Discard this workout and all completed sets?")) return;
  state.activeWorkout = null; stopRestTimer(); saveActiveWorkout(); renderWorkoutMode(); showToast("Workout discarded.");
}

function finishWorkout() {
  const workout = state.activeWorkout;
  if (!workout?.sets.length) return;
  const date = toISODate(new Date());
  const grouped = workout.sets.reduce((map, set) => {
    if (!map[set.exerciseId]) map[set.exerciseId] = [];
    map[set.exerciseId].push(set);
    return map;
  }, {});
  Object.entries(grouped).forEach(([exerciseId, setDetails]) => {
    const exercise = exerciseById(exerciseId); const working = setDetails.filter(set => set.type !== "warmup");
    const best = [...working].sort((a, b) => setE1rm(b) - setE1rm(a))[0] || setDetails[0];
    state.logs.push({ id: cryptoId(), sessionId: workout.id, date, exerciseId, muscle: exercise?.primary || best.muscle, secondary: exerciseSecondary(exercise), sets: working.length, reps: best.reps, weight: best.weight, setDetails, notes: "Saved from Workout Mode", createdAt: setDetails.at(-1).completedAt });
  });
  const workingSets = workout.sets.filter(set => set.type !== "warmup");
  const summary = {
    id: workout.id, date, startedAt: workout.startedAt, durationSeconds: Math.round(workoutElapsedMs() / 1000),
    routineId: workout.routineId || null, setCount: workingSets.length, warmupSetCount: workout.sets.length - workingSets.length,
    volume: workingSets.reduce((sum, set) => sum + set.weight * set.reps, 0),
    muscles: [...new Set(workingSets.flatMap(set => [set.muscle, ...(set.secondary || [])]))]
  };
  state.sessions.push(summary); state.activeWorkout = null; stopRestTimer(); state.selectedWeekStart = startOfWeek(new Date());
  saveLogs(); saveSessions(); saveActiveWorkout(); renderAll();
  showToast(`Workout saved: ${summary.setCount} sets across ${summary.muscles.length} muscle groups.`);
  routeTo("overview");
}

function renderWorkoutMode() {
  const workout = state.activeWorkout;
  const sets = workout?.sets || [];
  const workingSets = sets.filter(set => set.type !== "warmup");
  const counts = Object.fromEntries(MUSCLE_GROUPS.map(group => [group, workingSets.reduce((sum, set) => sum + (set.muscle === group ? 1 : (set.secondary || []).includes(group) ? 0.5 : 0), 0)]));
  const isPaused = Boolean(workout?.pausedAt);
  document.querySelector("#workoutTimer").textContent = formatTimer(workoutElapsedMs());
  document.querySelector("#workoutStatus").textContent = !workout ? "Ready" : isPaused ? "Paused" : "Workout active";
  document.querySelector("#liveIndicatorText").textContent = !workout ? "Session starts with your first set" : isPaused ? "Session paused" : "Session in progress";
  const indicator = document.querySelector(".live-indicator"); indicator.classList.toggle("active", Boolean(workout)); indicator.classList.toggle("paused", isPaused);
  document.querySelector("#pauseWorkoutButton").disabled = !workout;
  document.querySelector("#pauseWorkoutButton").textContent = isPaused ? "Resume" : "Pause";
  document.querySelector("#finishWorkoutButton").disabled = !sets.length;
  document.querySelector("#discardWorkoutButton").disabled = !workout;
  document.querySelector("#undoSetButton").disabled = !sets.length;
  document.querySelector("#workoutSetCount").textContent = `${workingSets.length} working set${workingSets.length === 1 ? "" : "s"}`;
  document.querySelector("#topWorkoutLabel").textContent = workout ? "Resume workout" : "Open workout";
  document.querySelectorAll("[data-map-muscle]").forEach(zone => {
    zone.classList.remove("heat-1", "heat-2", "heat-3", "heat-4");
    const count = counts[zone.dataset.mapMuscle];
    if (count) zone.classList.add(`heat-${count >= 8 ? 4 : count >= 5 ? 3 : count >= 2.5 ? 2 : 1}`);
  });
  document.querySelector("#liveMuscleList").innerHTML = MUSCLE_GROUPS.map(group => `<span class="live-muscle-chip ${counts[group] ? "active" : ""}">${group}${counts[group] ? ` · ${Number(counts[group].toFixed(1))}` : ""}</span>`).join("");
  document.querySelector("#sessionFeed").innerHTML = sets.length ? [...sets].reverse().map((set, reverseIndex) => { const exercise = exerciseById(set.exerciseId); return `<div class="feed-row"><span class="feed-number">${sets.length-reverseIndex}</span><div><h3>${escapeHTML(exercise?.name || "Exercise")}</h3><p>${set.type === "warmup" ? "Warm-up" : `${set.rir ?? "—"} RIR`} · ${new Date(set.completedAt).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}</p></div><strong>${formatWeight(set.weight)} × ${set.reps}</strong></div>`; }).join("") : `<div class="empty-state">Your completed sets will appear here.</div>`;
  renderRoutinePreview();
}

function saveWorkoutEntry(event) {
  event.preventDefault();
  const sets = Number(document.querySelector("#logSets").value), reps = Number(document.querySelector("#logReps").value), weight = toPounds(document.querySelector("#logWeight").value);
  const rirValue = document.querySelector("#logRir").value;
  const setDetails = Array.from({ length: sets }, () => ({ id: cryptoId(), weight, reps, rir: rirValue === "" ? null : Number(rirValue), type: "working", completedAt: Date.now() }));
  const entry = {
    id: cryptoId(), date: document.querySelector("#logDate").value,
    exerciseId: document.querySelector("#logExercise").value, muscle: document.querySelector("#logMuscle").value,
    secondary: exerciseSecondary(exerciseById(document.querySelector("#logExercise").value)), sets, reps,
    weight, setDetails, notes: document.querySelector("#logNotes").value.trim(), createdAt: Date.now()
  };
  state.logs.push(entry); saveLogs(); renderAll();
  document.querySelector("#logNotes").value = "";
  state.selectedWeekStart = startOfWeek(parseLocalDate(entry.date));
  showToast(`${exerciseById(entry.exerciseId).name} saved to your workout log.`);
  routeTo("overview");
}

function renderLastEntry() {
  const latest = [...state.logs].sort((a, b) => b.date.localeCompare(a.date) || b.createdAt - a.createdAt)[0];
  const container = document.querySelector("#lastEntryCard");
  if (!latest) { container.innerHTML = `<p class="eyebrow">Latest entry</p><h3>No workouts yet</h3><p>Your most recent movement will appear here.</p>`; return; }
  const exercise = exerciseById(latest.exerciseId);
  const best = representativeSet(latest);
  container.innerHTML = `<p class="eyebrow">Latest entry · ${formatShortDate(latest.date)}</p><h3>${escapeHTML(exercise?.name || "Unknown exercise")}</h3><p>${escapeHTML(latest.notes || `${latest.muscle} working sets`)}</p><div class="entry-metric"><div><strong>${formatSetSummary(latest)}</strong><span>completed</span></div><div><strong>${formatWeight(best.weight)}</strong><span>best load</span></div><div><strong>${formatNumber(fromPounds(entryVolume(latest)))}</strong><span>${unitLabel()} volume</span></div></div>`;
}

function renderExercises() {
  const query = document.querySelector("#exerciseSearch").value.toLowerCase().trim();
  const muscle = document.querySelector("#muscleFilter").value;
  const movement = document.querySelector("#movementFilter").value;
  const filtered = allExercises().filter(ex => (muscle === "all" || ex.primary === muscle || exerciseSecondary(ex).includes(muscle)) && (movement === "all" || ex.movement === movement) && `${ex.name} ${(ex.aliases || []).join(" ")} ${ex.equipment} ${ex.primary} ${exerciseSecondary(ex).join(" ")}`.toLowerCase().includes(query));
  document.querySelector("#exerciseCount").textContent = filtered.length;
  document.querySelector("#exerciseRows").innerHTML = filtered.length ? filtered.map(ex => `<div class="exercise-row">
    <div class="exercise-name"><span class="exercise-initials">${MUSCLE_ABBR[ex.primary]}</span><div><strong>${escapeHTML(ex.name)}</strong><small>${escapeHTML(ex.equipment)}${ex.custom ? " · Custom" : ""}${exerciseSecondary(ex).length ? ` · also ${exerciseSecondary(ex).join(", ")}` : ""}</small></div></div>
    <span><i class="muscle-tag">${ex.primary}</i></span><span>${escapeHTML(ex.movement)}</span><span>${escapeHTML(ex.equipment)}</span><button class="row-log-button" data-log-exercise="${ex.id}" title="Log ${escapeHTML(ex.name)}" aria-label="Log ${escapeHTML(ex.name)}">＋</button>
  </div>`).join("") : `<div class="empty-state">No exercises match those filters.</div>`;
}
function handleExerciseTableClick(event) {
  const button = event.target.closest("[data-log-exercise]"); if (!button) return;
  document.querySelector("#logExercise").value = button.dataset.logExercise; syncExerciseFields(); routeTo("log");
}

function renderProgress() { renderProgressChart(); renderPersonalRecords(); renderHistory(); }

function renderProgressChart() {
  const exerciseId = document.querySelector("#progressExercise").value;
  const exercise = exerciseById(exerciseId);
  const logs = state.logs.filter(log => log.exerciseId === exerciseId).sort((a, b) => a.date.localeCompare(b.date)).slice(-10);
  document.querySelector("#chartTitle").textContent = exercise?.name || "Exercise trend";
  const current = logs.length ? e1rm(logs.at(-1)) : 0; const first = logs.length ? e1rm(logs[0]) : 0; const bestE1rm = Math.max(0, ...logs.map(e1rm));
  const change = fromPounds(current - first);
  document.querySelector("#chartSummary").innerHTML = `<div><strong>${formatWeight(representativeSet(logs.at(-1) || {}).weight)}</strong><span>Latest best set</span></div><div><strong>${change >= 0 ? "+" : ""}${Number(change.toFixed(1))} ${unitLabel()}</strong><span>Estimated strength change</span></div><div><strong>${formatWeight(bestE1rm)}</strong><span>Best estimated 1RM</span></div>`;
  const container = document.querySelector("#progressChart");
  if (logs.length < 2) { container.innerHTML = `<div class="empty-state">Log this exercise at least twice to see a progression chart.</div>`; return; }
  const width = 700, height = 235, left = 44, right = 16, top = 14, bottom = 32;
  const values = logs.map(log => fromPounds(e1rm(log))); const padding = state.settings.weightUnit === "kg" ? 5 : 10; const minValue = Math.max(0, Math.min(...values) - padding); const maxValue = Math.max(...values) + padding;
  const x = index => left + index * ((width - left - right) / (logs.length - 1));
  const y = value => top + (maxValue - value) / Math.max(1, maxValue - minValue) * (height - top - bottom);
  const points = logs.map((log, index) => `${x(index)},${y(fromPounds(e1rm(log)))}`).join(" ");
  const area = `${left},${height - bottom} ${points} ${x(logs.length - 1)},${height - bottom}`;
  const grid = Array.from({ length: 4 }, (_, index) => { const value = minValue + (maxValue - minValue) / 3 * index; const gy = y(value); return `<line class="chart-grid-line" x1="${left}" x2="${width-right}" y1="${gy}" y2="${gy}"/><text class="chart-label" x="0" y="${gy+3}">${Math.round(value)} ${unitLabel()}</text>`; }).join("");
  const labels = logs.map((log, index) => `<text class="chart-label" text-anchor="middle" x="${x(index)}" y="${height-9}">${formatShortDate(log.date)}</text>`).join("");
  const dots = logs.map((log, index) => { const best = representativeSet(log); return `<circle class="chart-dot" cx="${x(index)}" cy="${y(fromPounds(e1rm(log)))}" r="4"><title>${formatFullDate(log.date)}: ${formatWeight(best.weight)} × ${best.reps}; ${formatWeight(e1rm(log))} estimated 1RM</title></circle>`; }).join("");
  container.innerHTML = `<svg viewBox="0 0 ${width} ${height}" role="img"><defs><linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#99ddc8" stop-opacity=".5"/><stop offset="100%" stop-color="#99ddc8" stop-opacity="0"/></linearGradient></defs>${grid}<polygon class="chart-area" points="${area}"/><polyline class="chart-line" points="${points}"/>${dots}${labels}</svg>`;
}

function renderPersonalRecords() {
  const records = allExercises().map(exercise => {
    const logs = state.logs.filter(log => log.exerciseId === exercise.id); if (!logs.length) return null;
    const ordered = [...logs].sort((a, b) => a.date.localeCompare(b.date)); const best = [...logs].sort((a, b) => e1rm(b) - e1rm(a))[0];
    const first = e1rm(ordered[0]); return { exercise, best, estimate: e1rm(best), improvement: first ? (e1rm(best) - first) / first * 100 : 0, latestDate: ordered.at(-1).date };
  }).filter(Boolean).sort((a, b) => b.latestDate.localeCompare(a.latestDate)).slice(0, 5);
  document.querySelector("#personalRecords").innerHTML = records.length ? records.map(record => { const bestSet = representativeSet(record.best); return `<div class="record-row"><span class="record-rank">★</span><div><h3>${escapeHTML(record.exercise.name)}</h3><p>${formatFullDate(record.best.date)} · ${formatWeight(bestSet.weight)} × ${bestSet.reps}</p></div><div class="record-value"><strong>${formatWeight(record.estimate)}</strong><span>${record.improvement > 0 ? `+${Math.round(record.improvement)}% from first` : "estimated 1RM"}</span></div></div>`; }).join("") : `<div class="empty-state">Your records will appear here.</div>`;
}

function renderHistory() {
  const query = document.querySelector("#historySearch").value.toLowerCase().trim();
  const logs = [...state.logs].sort((a, b) => b.date.localeCompare(a.date) || b.createdAt - a.createdAt).filter(log => { const ex = exerciseById(log.exerciseId); return `${ex?.name || ""} ${log.muscle} ${log.notes}`.toLowerCase().includes(query); });
  document.querySelector("#historyRows").innerHTML = logs.length ? logs.map(log => { const best = representativeSet(log); return `<div class="history-row"><span>${formatShortDate(log.date)}</span><span><strong>${escapeHTML(exerciseById(log.exerciseId)?.name || "Unknown")}</strong>${log.notes ? `<small class="history-note">${escapeHTML(log.notes)}</small>` : ""}</span><span><i class="muscle-tag">${log.muscle}</i></span><span>${formatSetSummary(log)}</span><span>${formatWeight(best.weight)}</span><span>${formatNumber(fromPounds(entryVolume(log)))} ${unitLabel()}</span><button class="delete-button" data-delete-log="${log.id}" title="Delete entry" aria-label="Delete entry">×</button></div>`; }).join("") : `<div class="empty-state">No workout entries found.</div>`;
}
function handleHistoryClick(event) {
  const button = event.target.closest("[data-delete-log]"); if (!button) return;
  if (!confirm("Delete this workout entry? This cannot be undone.")) return;
  state.logs = state.logs.filter(log => log.id !== button.dataset.deleteLog); saveLogs(); renderAll(); showToast("Workout entry deleted.");
}

function downloadFile(filename, content, type) {
  const blob = new Blob([content], { type }); const url = URL.createObjectURL(blob); const anchor = document.createElement("a");
  anchor.href = url; anchor.download = filename; anchor.click(); URL.revokeObjectURL(url);
}
function exportJSON() {
  const backup = {
    ...currentTrainingPayload(), exportedAt: new Date().toISOString(),
    profile: { ...state.profile, email: state.account.email },
  };
  downloadFile(`reproot-backup-${toISODate(new Date())}.json`, JSON.stringify(backup, null, 2), "application/json");
  showToast("Full training backup exported.");
}
function exportCSV() {
  const headers = ["Date", "Exercise", "Muscle Group", "Set Number", "Set Type", "Reps", `Weight (${unitLabel()})`, "RIR", `Volume (${unitLabel()})`, "Notes"];
  const quote = value => `"${String(value ?? "").replaceAll('"', '""')}"`;
  const rows = state.logs.flatMap(log => {
    const exercise = exerciseById(log.exerciseId);
    return logSetDetails(log).map((set, index) => [log.date, exercise?.name, log.muscle, index + 1, set.type || "working", set.reps, Number(fromPounds(set.weight).toFixed(2)), set.rir ?? "", Number((fromPounds(set.weight) * set.reps).toFixed(2)), log.notes].map(quote).join(","));
  });
  downloadFile(`reproot-history-${toISODate(new Date())}.csv`, [headers.map(quote).join(","), ...rows].join("\n"), "text/csv"); showToast("Workout history exported as CSV.");
}

async function importBackup(event) {
  const input = event.currentTarget;
  const file = input.files?.[0];
  if (!file) return;
  try {
    const backup = JSON.parse(await file.text());
    if (!backup || !Array.isArray(backup.strengthLogs) || !Array.isArray(backup.cardioLogs)) throw new Error("This is not a valid RepRoot backup.");
    if (!confirm(`Restore ${backup.strengthLogs.length} strength entries and ${backup.cardioLogs.length} cardio entries? This replaces the current profile's training data.`)) return;
    const customExercises = Array.isArray(backup.customExercises) ? backup.customExercises.filter(exercise => exercise && typeof exercise.id === "string" && typeof exercise.name === "string" && MUSCLE_GROUPS.includes(exercise.primary)) : [];
    const validExerciseIds = new Set([...EXERCISES.map(exercise => exercise.id), ...customExercises.map(exercise => exercise.id)]);
    state.customExercises = customExercises;
    state.logs = backup.strengthLogs.filter(log => log && typeof log.date === "string" && validExerciseIds.has(log.exerciseId) && MUSCLE_GROUPS.includes(log.muscle));
    state.cardioLogs = backup.cardioLogs.filter(log => log && typeof log.date === "string" && cardioById(log.activityId));
    state.sessions = Array.isArray(backup.workoutSessions) ? backup.workoutSessions : [];
    const importedRoutines = Array.isArray(backup.routines) ? backup.routines.filter(routine => routine && typeof routine.name === "string" && Array.isArray(routine.exerciseIds)) : [];
    state.routines = withCurrentBuiltInRoutines(importedRoutines).map(routine => ({ ...routine, exerciseIds: routine.exerciseIds.filter(id => validExerciseIds.has(id)) }));
    const importedSettings = backup.settings || {};
    state.settings = {
      weightUnit: importedSettings.weightUnit === "kg" ? "kg" : "lb",
      weeklySetTarget: Math.min(30, Math.max(4, Number(importedSettings.weeklySetTarget) || DEFAULT_SETTINGS.weeklySetTarget)),
      restSeconds: [60, 90, 120, 180].includes(Number(importedSettings.restSeconds)) ? Number(importedSettings.restSeconds) : DEFAULT_SETTINGS.restSeconds
    };
    state.profile = normalizeProfile(backup.profile || state.profile);
    state.account.name = state.profile.displayName;
    state.activeWorkout = backup.activeWorkout || null;
    saveLogs(); saveCardioLogs(); saveSessions(); saveRoutines(); saveCustomExercises(); saveSettings(); saveProfile(); saveActiveWorkout();
    populateSelects(); applySettingsToUI(); renderAll();
    showToast("Backup restored successfully.");
  } catch (error) {
    showToast(error.message || "Unable to restore this backup.");
  } finally { input.value = ""; }
}
function exportCardioCSV() {
  const headers = ["Date", "Activity", "Duration (min)", "Distance", "Unit", "Average Pace", "Effort", "Average Heart Rate", "Notes"];
  const quote = value => `"${String(value ?? "").replaceAll('"', '""')}"`;
  const rows = state.cardioLogs.map(log => { const activity = cardioById(log.activityId); return [log.date, activity?.name, log.duration, log.distance, activity?.unit, formatPace(log.duration, log.distance, activity), log.effort, log.heartRate, log.notes].map(quote).join(","); });
  downloadFile(`reproot-cardio-${toISODate(new Date())}.csv`, [headers.map(quote).join(","), ...rows].join("\n"), "text/csv"); showToast("Cardio history exported as CSV.");
}
function clearTrainingData() {
  if (!confirm("Permanently delete all strength logs, cardio activity, saved sessions, and the active workout for this account?")) return;
  state.logs = []; state.cardioLogs = []; state.sessions = []; state.activeWorkout = null; state.selectedWeekStart = startOfWeek(new Date());
  saveLogs(); saveCardioLogs(); saveSessions(); saveActiveWorkout(); renderAll(); showToast("All training data cleared. Your account remains active.");
}
let toastTimer;
function showToast(message) { const toast = document.querySelector("#toast"); toast.textContent = message; toast.classList.add("show"); clearTimeout(toastTimer); toastTimer = setTimeout(() => toast.classList.remove("show"), 2800); }

init();

// Offline shell support when the app is served over HTTPS or localhost.
if ("serviceWorker" in navigator && location.protocol !== "file:") {
  navigator.serviceWorker.register("./service-worker.js").catch(() => {});
}
