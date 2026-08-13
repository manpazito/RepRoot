"use strict";

// -----------------------------------------------------------------------------
// Data model
// Exercise: { id, name, primary, movement, equipment }
// Log:      { id, date, exerciseId, muscle, sets, reps, weight, notes, createdAt }
// All user-generated logs are persisted in localStorage under STORAGE_KEY.
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
const MUSCLE_GROUPS = ["Chest", "Back", "Quads", "Hamstrings", "Glutes", "Shoulders", "Biceps", "Triceps", "Core", "Calves"];
const MUSCLE_ABBR = { Chest: "CH", Back: "BK", Quads: "QD", Hamstrings: "HM", Glutes: "GL", Shoulders: "SH", Biceps: "BI", Triceps: "TR", Core: "CR", Calves: "CV" };

const EXERCISES = [
  { id: "barbell-bench", name: "Barbell Bench Press", primary: "Chest", movement: "Horizontal push", equipment: "Barbell" },
  { id: "incline-db-press", name: "Incline Dumbbell Press", primary: "Chest", movement: "Incline push", equipment: "Dumbbells" },
  { id: "cable-fly", name: "Cable Chest Fly", primary: "Chest", movement: "Adduction", equipment: "Cable" },
  { id: "push-up", name: "Push-Up", primary: "Chest", movement: "Horizontal push", equipment: "Bodyweight" },
  { id: "machine-chest-press", name: "Machine Chest Press", primary: "Chest", movement: "Horizontal push", equipment: "Machine" },
  { id: "pec-deck", name: "Pec Deck Fly", primary: "Chest", movement: "Adduction", equipment: "Machine" },
  { id: "pull-up", name: "Pull-Up", primary: "Back", movement: "Vertical pull", equipment: "Bodyweight" },
  { id: "lat-pulldown", name: "Lat Pulldown", primary: "Back", movement: "Vertical pull", equipment: "Cable" },
  { id: "barbell-row", name: "Barbell Row", primary: "Back", movement: "Horizontal pull", equipment: "Barbell" },
  { id: "seated-row", name: "Seated Cable Row", primary: "Back", movement: "Horizontal pull", equipment: "Cable" },
  { id: "machine-high-row", name: "Machine High Row", primary: "Back", movement: "Horizontal pull", equipment: "Machine" },
  { id: "assisted-pull-up", name: "Assisted Pull-Up", primary: "Back", movement: "Vertical pull", equipment: "Machine" },
  { id: "back-squat", name: "Barbell Back Squat", primary: "Quads", movement: "Squat", equipment: "Barbell" },
  { id: "leg-press", name: "Leg Press", primary: "Quads", movement: "Squat", equipment: "Machine" },
  { id: "bulgarian-split", name: "Bulgarian Split Squat", primary: "Quads", movement: "Unilateral squat", equipment: "Dumbbells" },
  { id: "leg-extension", name: "Leg Extension", primary: "Quads", movement: "Knee extension", equipment: "Machine" },
  { id: "hack-squat", name: "Hack Squat", primary: "Quads", movement: "Squat", equipment: "Machine" },
  { id: "romanian-deadlift", name: "Romanian Deadlift", primary: "Hamstrings", movement: "Hip hinge", equipment: "Barbell" },
  { id: "leg-curl", name: "Lying Leg Curl", primary: "Hamstrings", movement: "Knee flexion", equipment: "Machine" },
  { id: "good-morning", name: "Good Morning", primary: "Hamstrings", movement: "Hip hinge", equipment: "Barbell" },
  { id: "seated-leg-curl", name: "Seated Leg Curl", primary: "Hamstrings", movement: "Knee flexion", equipment: "Machine" },
  { id: "barbell-hip-thrust", name: "Barbell Hip Thrust", primary: "Glutes", movement: "Hip extension", equipment: "Barbell", secondary: ["Hamstrings"] },
  { id: "cable-kickback", name: "Cable Glute Kickback", primary: "Glutes", movement: "Hip extension", equipment: "Cable", secondary: ["Hamstrings"] },
  { id: "overhead-press", name: "Overhead Press", primary: "Shoulders", movement: "Vertical push", equipment: "Barbell" },
  { id: "lateral-raise", name: "Dumbbell Lateral Raise", primary: "Shoulders", movement: "Abduction", equipment: "Dumbbells" },
  { id: "reverse-fly", name: "Reverse Pec Deck", primary: "Shoulders", movement: "Horizontal abduction", equipment: "Machine" },
  { id: "face-pull", name: "Face Pull", primary: "Shoulders", movement: "External rotation", equipment: "Cable" },
  { id: "machine-shoulder-press", name: "Machine Shoulder Press", primary: "Shoulders", movement: "Vertical push", equipment: "Machine" },
  { id: "barbell-curl", name: "Barbell Curl", primary: "Biceps", movement: "Elbow flexion", equipment: "Barbell" },
  { id: "hammer-curl", name: "Hammer Curl", primary: "Biceps", movement: "Elbow flexion", equipment: "Dumbbells" },
  { id: "preacher-curl", name: "Preacher Curl", primary: "Biceps", movement: "Elbow flexion", equipment: "EZ bar" },
  { id: "machine-curl", name: "Machine Biceps Curl", primary: "Biceps", movement: "Elbow flexion", equipment: "Machine" },
  { id: "tricep-pushdown", name: "Triceps Pushdown", primary: "Triceps", movement: "Elbow extension", equipment: "Cable" },
  { id: "skull-crusher", name: "EZ-Bar Skull Crusher", primary: "Triceps", movement: "Elbow extension", equipment: "EZ bar" },
  { id: "close-grip-bench", name: "Close-Grip Bench Press", primary: "Triceps", movement: "Horizontal push", equipment: "Barbell" },
  { id: "assisted-dip", name: "Assisted Dip", primary: "Triceps", movement: "Vertical push", equipment: "Machine" },
  { id: "cable-crunch", name: "Cable Crunch", primary: "Core", movement: "Spinal flexion", equipment: "Cable" },
  { id: "hanging-leg-raise", name: "Hanging Leg Raise", primary: "Core", movement: "Hip flexion", equipment: "Bodyweight" },
  { id: "plank", name: "Weighted Plank", primary: "Core", movement: "Anti-extension", equipment: "Plate" },
  { id: "ab-crunch-machine", name: "Ab Crunch Machine", primary: "Core", movement: "Spinal flexion", equipment: "Machine" },
  { id: "standing-calf", name: "Standing Calf Raise", primary: "Calves", movement: "Plantar flexion", equipment: "Machine" },
  { id: "seated-calf", name: "Seated Calf Raise", primary: "Calves", movement: "Plantar flexion", equipment: "Machine" }
];

const CARDIO_ACTIVITIES = [
  { id: "running", name: "Running", icon: "⌁", unit: "miles" },
  { id: "cycling", name: "Cycling", icon: "◉", unit: "miles" },
  { id: "swimming", name: "Swimming", icon: "≈", unit: "yards" },
  { id: "walking", name: "Walking", icon: "♟", unit: "miles" },
  { id: "rowing", name: "Rowing", icon: "≋", unit: "meters" },
  { id: "hiking", name: "Hiking", icon: "⌃", unit: "miles" },
  { id: "elliptical", name: "Elliptical", icon: "∞", unit: "miles" },
  { id: "stairs", name: "Stair Climber", icon: "▟", unit: "floors" }
];

const SECONDARY_BY_MOVEMENT = {
  "Horizontal push": ["Triceps", "Shoulders"], "Incline push": ["Shoulders", "Triceps"],
  "Vertical push": ["Triceps"], "Vertical pull": ["Biceps"], "Horizontal pull": ["Biceps", "Shoulders"],
  "Horizontal abduction": ["Back"], "External rotation": ["Back"], "Squat": ["Glutes", "Hamstrings"],
  "Unilateral squat": ["Glutes", "Hamstrings"], "Hip hinge": ["Glutes", "Back"], "Hip flexion": ["Quads"]
};

const DEFAULT_ROUTINES = [
  { id: "routine-push", name: "Push", exerciseIds: ["barbell-bench", "incline-db-press", "overhead-press", "lateral-raise", "tricep-pushdown"], builtIn: true },
  { id: "routine-pull", name: "Pull", exerciseIds: ["lat-pulldown", "barbell-row", "seated-row", "face-pull", "hammer-curl"], builtIn: true },
  { id: "routine-legs", name: "Legs", exerciseIds: ["back-squat", "romanian-deadlift", "barbell-hip-thrust", "leg-press", "leg-curl", "standing-calf"], builtIn: true },
  { id: "routine-full-body", name: "Full body", exerciseIds: ["back-squat", "barbell-bench", "lat-pulldown", "romanian-deadlift", "overhead-press", "cable-crunch"], builtIn: true }
];

const DEFAULT_SETTINGS = { weightUnit: "lb", weeklySetTarget: 10, restSeconds: 90 };

const state = {
  logs: [], cardioLogs: [], sessions: [], activeWorkout: null, routines: [], customExercises: [], settings: { ...DEFAULT_SETTINGS },
  account: null, authMode: "create", tutorialStep: 0,
  selectedWeekStart: startOfWeek(new Date()), route: "overview", timerInterval: null, restTimerInterval: null, restTimerEnd: null
};

const TUTORIAL_STEPS = [
  { icon: "✦", label: "Getting started", title: "Welcome to RepRoot.", copy: "Your account begins completely empty. Add only the training you actually complete, and the dashboard will grow with you.", tip: "Your profile and records are stored in this browser. Export regular backups from the sidebar." },
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
  try { const routines = JSON.parse(localStorage.getItem(accountStorageKey(ROUTINES_STORAGE_KEY))); state.routines = Array.isArray(routines) && routines.length ? routines : DEFAULT_ROUTINES.map(routine => ({ ...routine })); } catch { state.routines = DEFAULT_ROUTINES.map(routine => ({ ...routine })); }
  try { const custom = JSON.parse(localStorage.getItem(accountStorageKey(CUSTOM_EXERCISES_KEY))); state.customExercises = Array.isArray(custom) ? custom : []; } catch { state.customExercises = []; }
  try { state.settings = { ...DEFAULT_SETTINGS, ...(JSON.parse(localStorage.getItem(accountStorageKey(SETTINGS_STORAGE_KEY))) || {}) }; } catch { state.settings = { ...DEFAULT_SETTINGS }; }
  saveRoutines();
}
function saveLogs() { localStorage.setItem(accountStorageKey(STORAGE_KEY), JSON.stringify(state.logs)); }
function saveCardioLogs() { localStorage.setItem(accountStorageKey(CARDIO_STORAGE_KEY), JSON.stringify(state.cardioLogs)); }
function saveSessions() { localStorage.setItem(accountStorageKey(SESSION_STORAGE_KEY), JSON.stringify(state.sessions)); }
function saveRoutines() { localStorage.setItem(accountStorageKey(ROUTINES_STORAGE_KEY), JSON.stringify(state.routines)); }
function saveCustomExercises() { localStorage.setItem(accountStorageKey(CUSTOM_EXERCISES_KEY), JSON.stringify(state.customExercises)); }
function saveSettings() { localStorage.setItem(accountStorageKey(SETTINGS_STORAGE_KEY), JSON.stringify(state.settings)); }
function saveActiveWorkout() {
  const key = accountStorageKey(ACTIVE_WORKOUT_KEY);
  if (state.activeWorkout) localStorage.setItem(key, JSON.stringify(state.activeWorkout));
  else localStorage.removeItem(key);
}

function init() {
  // Remove the original unscoped demo store. All current data is account-scoped.
  [STORAGE_KEY, CARDIO_STORAGE_KEY, SESSION_STORAGE_KEY, ACTIVE_WORKOUT_KEY, ROUTINES_STORAGE_KEY, CUSTOM_EXERCISES_KEY, SETTINGS_STORAGE_KEY].forEach(key => localStorage.removeItem(key));
  populateSelects();
  bindEvents();
  document.querySelector("#logDate").value = toISODate(new Date());
  document.querySelector("#cardioDate").value = toISODate(new Date());
  syncExerciseFields();
  syncCardioFields();
  syncLiveExercise();
  restoreAuthSession();
}

// -----------------------------------------------------------------------------
// On-device accounts
// Passwords are derived with PBKDF2 and never stored in plaintext. Training
// records are namespaced by account ID. A hosted production deployment can
// replace this layer with server authentication without changing log schemas.
// -----------------------------------------------------------------------------

function getAccounts() {
  try { const accounts = JSON.parse(localStorage.getItem(ACCOUNTS_KEY)); return Array.isArray(accounts) ? accounts : []; }
  catch { return []; }
}
function saveAccounts(accounts) { localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts)); }
function bytesToBase64(bytes) { return btoa(String.fromCharCode(...bytes)); }
function base64ToBytes(value) { return Uint8Array.from(atob(value), character => character.charCodeAt(0)); }
async function derivePassword(password, salt) {
  const material = await crypto.subtle.importKey("raw", new TextEncoder().encode(password), "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits({ name: "PBKDF2", salt, iterations: 150000, hash: "SHA-256" }, material, 256);
  return bytesToBase64(new Uint8Array(bits));
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
  document.querySelector("#authSubtitle").textContent = creating ? "Your profile begins with zero training data." : "Continue with your training history on this device.";
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
  if (!crypto.subtle) { error.textContent = "Secure account access requires HTTPS or localhost."; return; }
  if (password.length < 8) { error.textContent = "Use a password with at least 8 characters."; return; }
  submit.disabled = true;
  try {
    const accounts = getAccounts();
    if (state.authMode === "create") {
      if (name.length < 2) throw new Error("Enter your full name.");
      if (accounts.some(account => account.email === email)) throw new Error("An account with this email already exists on this device.");
      const salt = crypto.getRandomValues(new Uint8Array(16));
      const account = { id: cryptoId(), name, email, passwordSalt: bytesToBase64(salt), passwordHash: await derivePassword(password, salt), tutorialComplete: false, createdAt: Date.now() };
      accounts.push(account); saveAccounts(accounts); state.account = account;
      localStorage.setItem(AUTH_SESSION_KEY, account.id);
      enterAuthenticatedApp(true);
    } else {
      const account = accounts.find(item => item.email === email);
      if (!account) throw new Error("No account with that email exists on this device.");
      const passwordHash = await derivePassword(password, base64ToBytes(account.passwordSalt));
      if (passwordHash !== account.passwordHash) throw new Error("Incorrect password. Please try again.");
      state.account = account; localStorage.setItem(AUTH_SESSION_KEY, account.id);
      enterAuthenticatedApp(false);
    }
    form.reset();
  } catch (authError) { error.textContent = authError.message || "Unable to access this account."; }
  finally { submit.disabled = false; }
}

function restoreAuthSession() {
  const accounts = getAccounts();
  const accountId = localStorage.getItem(AUTH_SESSION_KEY);
  const account = accounts.find(item => item.id === accountId);
  if (account) { state.account = account; enterAuthenticatedApp(false); }
  else { localStorage.removeItem(AUTH_SESSION_KEY); setAuthMode(accounts.length ? "signin" : "create"); }
}

function enterAuthenticatedApp(isNewAccount) {
  loadLogs();
  populateSelects();
  applySettingsToUI();
  document.body.classList.remove("auth-locked");
  const initials = state.account.name.split(/\s+/).slice(0, 2).map(part => part[0]).join("").toUpperCase();
  document.querySelector("#profileAvatar").textContent = initials;
  document.querySelector("#profileName").textContent = state.account.name;
  const latestExercise = [...state.logs].sort((a, b) => b.date.localeCompare(a.date))[0]?.exerciseId;
  if (latestExercise) document.querySelector("#progressExercise").value = latestExercise;
  state.selectedWeekStart = startOfWeek(new Date());
  routeTo(location.hash.slice(1) || "overview", false);
  renderAll(); startTimerLoop();
  if (isNewAccount || !state.account.tutorialComplete) setTimeout(() => openTutorial(0), 250);
}

function signOut() {
  localStorage.removeItem(AUTH_SESSION_KEY);
  clearInterval(state.timerInterval); clearInterval(state.restTimerInterval);
  state.account = null; state.logs = []; state.cardioLogs = []; state.sessions = []; state.activeWorkout = null; state.routines = []; state.customExercises = []; state.settings = { ...DEFAULT_SETTINGS };
  document.querySelector("#tutorialOverlay").hidden = true;
  document.body.classList.add("auth-locked");
  setAuthMode(getAccounts().length ? "signin" : "create");
  document.querySelector("#accountPassword").value = "";
}

function updateCurrentAccount(updates) {
  if (!state.account) return;
  Object.assign(state.account, updates);
  saveAccounts(getAccounts().map(account => account.id === state.account.id ? state.account : account));
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
  const exercises = allExercises();
  const exerciseOptions = exercises.map(ex => `<option value="${ex.id}">${escapeHTML(ex.name)}</option>`).join("");
  const selected = Object.fromEntries(["logExercise", "progressExercise", "liveExercise"].map(id => [id, document.querySelector(`#${id}`)?.value]));
  document.querySelector("#logExercise").innerHTML = exerciseOptions;
  document.querySelector("#progressExercise").innerHTML = exerciseOptions;
  document.querySelector("#logMuscle").innerHTML = MUSCLE_GROUPS.map(group => `<option>${group}</option>`).join("");
  document.querySelector("#muscleFilter").innerHTML = `<option value="all">All muscle groups</option>${MUSCLE_GROUPS.map(group => `<option>${group}</option>`).join("")}`;
  const movements = [...new Set(exercises.map(ex => ex.movement))].sort();
  document.querySelector("#movementFilter").innerHTML = `<option value="all">All movement types</option>${movements.map(type => `<option>${escapeHTML(type)}</option>`).join("")}`;
  document.querySelector("#cardioActivity").innerHTML = CARDIO_ACTIVITIES.map(activity => `<option value="${activity.id}">${activity.name}</option>`).join("");
  document.querySelector("#liveExercise").innerHTML = exerciseOptions;
  document.querySelector("#customExercisePrimary").innerHTML = MUSCLE_GROUPS.map(group => `<option>${group}</option>`).join("");
  document.querySelector("#routineExerciseChoices").innerHTML = exercises.map(exercise => `<label><input type="checkbox" name="routineExercise" value="${exercise.id}" />${escapeHTML(exercise.name)}</label>`).join("");
  document.querySelector("#customExerciseSecondary").innerHTML = MUSCLE_GROUPS.map(group => `<label><input type="checkbox" name="secondaryMuscle" value="${group}" />${group}</label>`).join("");
  ["logExercise", "progressExercise", "liveExercise"].forEach(id => { if (selected[id] && exerciseById(selected[id])) document.querySelector(`#${id}`).value = selected[id]; });
  const firstLoggedExercise = [...state.logs].sort((a, b) => b.date.localeCompare(a.date))[0]?.exerciseId;
  if (firstLoggedExercise) document.querySelector("#progressExercise").value = firstLoggedExercise;
  renderRoutineOptions();
}

function bindEvents() {
  document.querySelectorAll("[data-route]").forEach(item => item.addEventListener("click", event => { event.preventDefault(); routeTo(item.dataset.route); }));
  document.querySelectorAll("[data-route-button]").forEach(item => item.addEventListener("click", () => routeTo(item.dataset.routeButton)));
  document.querySelectorAll("[data-start-workout]").forEach(item => item.addEventListener("click", startBlankWorkout));
  window.addEventListener("hashchange", () => routeTo(location.hash.slice(1) || "overview", false));
  document.querySelector("#menuButton").addEventListener("click", () => document.querySelector(".sidebar").classList.toggle("open"));
  document.querySelector("#previousWeek").addEventListener("click", () => changeWeek(-7));
  document.querySelector("#nextWeek").addEventListener("click", () => changeWeek(7));
  document.querySelector("#logExercise").addEventListener("change", syncExerciseFields);
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
  document.querySelector("#createRoutineButton").addEventListener("click", () => document.querySelector("#routineDialog").showModal());
  document.querySelector("#routineForm").addEventListener("submit", saveRoutineFromDialog);
  document.querySelector("#deleteRoutineButton").addEventListener("click", deleteSelectedRoutine);
  document.querySelector("#restTimerSkip").addEventListener("click", stopRestTimer);
  document.querySelector("#newExerciseButton").addEventListener("click", () => document.querySelector("#exerciseDialog").showModal());
  document.querySelector("#customExerciseForm").addEventListener("submit", saveCustomExercise);
  document.querySelector("#settingsForm").addEventListener("submit", savePreferences);
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
  document.querySelector(".sidebar").classList.remove("open");
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
  document.querySelector("#muscleCoverageCopy").textContent = muscles.size >= 8 ? "Well-rounded weekly coverage" : `${MUSCLE_GROUPS.length - muscles.size} groups still untrained`;
  document.querySelector("#muscleDots").innerHTML = MUSCLE_GROUPS.map(group => `<i class="${muscles.has(group) ? "active" : ""}" title="${group}"></i>`).join("");

  const dailyVolumes = Array.from({ length: 7 }, (_, day) => logs.filter(log => ((parseLocalDate(log.date).getDay() + 6) % 7) === day).reduce((sum, log) => sum + entryVolume(log), 0));
  const maxDaily = Math.max(...dailyVolumes, 1);
  document.querySelector("#volumeBars").innerHTML = dailyVolumes.map(volume => `<i style="height:${Math.max(3, volume / maxDaily * 31)}px"></i>`).join("");

  renderMuscleGrid(logs);
  renderRecentSessions(logs);
  renderInsight(logs);
  document.querySelector("#recentPrs").textContent = countRecentPRs();
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
  if (!routine) { document.querySelector("#routineDialog").showModal(); return; }
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

function renderSettings() {
  if (!state.account) return;
  document.querySelector("#weightUnit").value = state.settings.weightUnit;
  document.querySelector("#weeklySetTarget").value = state.settings.weeklySetTarget;
  document.querySelector("#defaultRestSeconds").value = String(state.settings.restSeconds);
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
  const filtered = allExercises().filter(ex => (muscle === "all" || ex.primary === muscle || exerciseSecondary(ex).includes(muscle)) && (movement === "all" || ex.movement === movement) && `${ex.name} ${ex.equipment} ${ex.primary} ${exerciseSecondary(ex).join(" ")}`.toLowerCase().includes(query));
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
    version: 4, exportedAt: new Date().toISOString(),
    profile: { name: state.account.name, email: state.account.email },
    settings: state.settings, customExercises: state.customExercises, routines: state.routines,
    strengthLogs: state.logs, cardioLogs: state.cardioLogs, workoutSessions: state.sessions
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
    state.routines = Array.isArray(backup.routines) && backup.routines.length ? backup.routines.filter(routine => routine && typeof routine.name === "string" && Array.isArray(routine.exerciseIds)).map(routine => ({ ...routine, exerciseIds: routine.exerciseIds.filter(id => validExerciseIds.has(id)) })) : DEFAULT_ROUTINES.map(routine => ({ ...routine }));
    const importedSettings = backup.settings || {};
    state.settings = {
      weightUnit: importedSettings.weightUnit === "kg" ? "kg" : "lb",
      weeklySetTarget: Math.min(30, Math.max(4, Number(importedSettings.weeklySetTarget) || DEFAULT_SETTINGS.weeklySetTarget)),
      restSeconds: [60, 90, 120, 180].includes(Number(importedSettings.restSeconds)) ? Number(importedSettings.restSeconds) : DEFAULT_SETTINGS.restSeconds
    };
    state.activeWorkout = null;
    saveLogs(); saveCardioLogs(); saveSessions(); saveRoutines(); saveCustomExercises(); saveSettings(); saveActiveWorkout();
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
