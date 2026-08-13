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
const ACCOUNTS_KEY = "reproot-accounts-v1";
const AUTH_SESSION_KEY = "reproot-auth-session-v1";
const MUSCLE_GROUPS = ["Chest", "Back", "Quads", "Hamstrings", "Shoulders", "Biceps", "Triceps", "Core", "Calves"];
const MUSCLE_ABBR = { Chest: "CH", Back: "BK", Quads: "QD", Hamstrings: "HM", Shoulders: "SH", Biceps: "BI", Triceps: "TR", Core: "CR", Calves: "CV" };

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

const state = {
  logs: [], cardioLogs: [], sessions: [], activeWorkout: null,
  account: null, authMode: "create", tutorialStep: 0,
  selectedWeekStart: startOfWeek(new Date()), route: "overview", timerInterval: null
};

const TUTORIAL_STEPS = [
  { icon: "✦", label: "Getting started", title: "Welcome to RepRoot.", copy: "Your account begins completely empty. Add only the training you actually complete, and the dashboard will grow with you.", tip: "Your profile and records are stored in this browser. Export regular backups from the sidebar." },
  { icon: "▶", label: "Workout mode", title: "Track sets while you train.", copy: "Press Start workout to begin the timer. Choose an exercise, enter the completed weight and reps, then tap Complete set after every working set.", tip: "The global play button becomes pause while a session is running. Press it again to pause or resume." },
  { icon: "◐", label: "Muscle targeting", title: "Watch your workout build.", copy: "Every completed set adds intensity to its primary muscle group. The live body map becomes bolder as your direct working sets accumulate.", tip: "Finish & save turns the live sets into permanent strength history. You can undo the latest set before saving." },
  { icon: "♥", label: "Cardio & strength", title: "Log every kind of effort.", copy: "Use Strength for individual machine or free-weight entries. Use Cardio for running, cycling, swimming, walking, rowing, hiking, elliptical, and stairs.", tip: "Cardio automatically calculates pace using the correct activity unit." },
  { icon: "↗", label: "Review progress", title: "Let your history guide you.", copy: "Home shows weekly muscle balance and recovery. Progress shows working-weight trends, estimated 1RM records, and complete workout history.", tip: "You can replay this guide anytime from How to use in the sidebar." }
];

function cryptoId() { return (globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(16).slice(2)}`); }
function toISODate(date) { const d = new Date(date); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`; }
function parseLocalDate(value) { const [y, m, d] = value.split("-").map(Number); return new Date(y, m - 1, d, 12); }
function startOfWeek(date) { const result = new Date(date); result.setHours(0, 0, 0, 0); const day = result.getDay(); result.setDate(result.getDate() - ((day + 6) % 7)); return result; }
function endOfWeek(start) { const result = new Date(start); result.setDate(result.getDate() + 6); result.setHours(23, 59, 59, 999); return result; }
function formatNumber(value) { return Math.round(value).toLocaleString("en-US"); }
function exerciseById(id) { return EXERCISES.find(exercise => exercise.id === id); }
function cardioById(id) { return CARDIO_ACTIVITIES.find(activity => activity.id === id); }
function entryVolume(log) { return Number(log.sets) * Number(log.reps) * Number(log.weight); }
function e1rm(log) { return Number(log.weight) * (1 + Number(log.reps) / 30); }
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
}
function saveLogs() { localStorage.setItem(accountStorageKey(STORAGE_KEY), JSON.stringify(state.logs)); }
function saveCardioLogs() { localStorage.setItem(accountStorageKey(CARDIO_STORAGE_KEY), JSON.stringify(state.cardioLogs)); }
function saveSessions() { localStorage.setItem(accountStorageKey(SESSION_STORAGE_KEY), JSON.stringify(state.sessions)); }
function saveActiveWorkout() {
  const key = accountStorageKey(ACTIVE_WORKOUT_KEY);
  if (state.activeWorkout) localStorage.setItem(key, JSON.stringify(state.activeWorkout));
  else localStorage.removeItem(key);
}

function init() {
  // Remove the original unscoped demo store. All current data is account-scoped.
  [STORAGE_KEY, CARDIO_STORAGE_KEY, SESSION_STORAGE_KEY, ACTIVE_WORKOUT_KEY].forEach(key => localStorage.removeItem(key));
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
  clearInterval(state.timerInterval);
  state.account = null; state.logs = []; state.cardioLogs = []; state.sessions = []; state.activeWorkout = null;
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
  const exerciseOptions = EXERCISES.map(ex => `<option value="${ex.id}">${ex.name}</option>`).join("");
  document.querySelector("#logExercise").innerHTML = exerciseOptions;
  document.querySelector("#progressExercise").innerHTML = exerciseOptions;
  document.querySelector("#logMuscle").innerHTML = MUSCLE_GROUPS.map(group => `<option>${group}</option>`).join("");
  document.querySelector("#muscleFilter").insertAdjacentHTML("beforeend", MUSCLE_GROUPS.map(group => `<option>${group}</option>`).join(""));
  const movements = [...new Set(EXERCISES.map(ex => ex.movement))].sort();
  document.querySelector("#movementFilter").insertAdjacentHTML("beforeend", movements.map(type => `<option>${type}</option>`).join(""));
  document.querySelector("#cardioActivity").innerHTML = CARDIO_ACTIVITIES.map(activity => `<option value="${activity.id}">${activity.name}</option>`).join("");
  document.querySelector("#liveExercise").innerHTML = exerciseOptions;
  const firstLoggedExercise = [...state.logs].sort((a, b) => b.date.localeCompare(a.date))[0]?.exerciseId;
  if (firstLoggedExercise) document.querySelector("#progressExercise").value = firstLoggedExercise;
}

function bindEvents() {
  document.querySelectorAll("[data-route]").forEach(item => item.addEventListener("click", event => { event.preventDefault(); routeTo(item.dataset.route); }));
  document.querySelectorAll("[data-route-button]").forEach(item => item.addEventListener("click", () => item.dataset.routeButton === "workout" ? handleGlobalWorkoutAction() : routeTo(item.dataset.routeButton)));
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
  document.querySelector("#pageCrumb").textContent = ({ overview: "Overview", log: "Strength training", cardio: "Cardio", workout: "Workout mode", exercises: "Exercise database", progress: "Progress" })[route];
  document.querySelectorAll(".mobile-tabbar button").forEach(item => item.classList.toggle("active", item.dataset.routeButton === route));
  document.querySelector(".sidebar").classList.remove("open");
  if (updateHash) history.pushState(null, "", `#${route}`);
  window.scrollTo({ top: 0, behavior: "smooth" });
  if (route === "progress") renderProgress();
  if (route === "cardio") renderCardio();
  if (route === "workout") renderWorkoutMode();
}

function renderAll() {
  renderOverview();
  renderExercises();
  renderProgress();
  renderLastEntry();
  renderCardio();
  renderWorkoutMode();
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
  const totalSets = logs.reduce((sum, log) => sum + Number(log.sets), 0);
  const previousSets = previousLogs.reduce((sum, log) => sum + Number(log.sets), 0);
  const muscles = new Set(logs.map(log => log.muscle));

  document.querySelector("#weekLabel").textContent = `${start.toLocaleDateString("en-US", { month: "short", day: "numeric" })} — ${end.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`;
  document.querySelector("#weeklyVolume").textContent = formatNumber(totalVolume);
  document.querySelector("#weeklySets").textContent = totalSets;
  document.querySelector("#setProgress").style.width = `${Math.min(100, totalSets / 90 * 100)}%`;
  const diff = totalSets - previousSets;
  document.querySelector("#setComparison").textContent = previousSets ? `${diff >= 0 ? "+" : ""}${diff} vs. prior week` : "No prior week data";
  document.querySelector("#musclesTrained").textContent = muscles.size;
  document.querySelector("#muscleCoverageCopy").textContent = muscles.size >= 7 ? "Well-rounded weekly coverage" : `${9 - muscles.size} groups still untrained`;
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
  const latest = state.logs.filter(log => log.muscle === group).sort((a, b) => b.date.localeCompare(a.date))[0];
  if (!latest) return { type: "ready", label: "Ready", detail: "No recent work" };
  const hours = (new Date() - parseLocalDate(latest.date)) / 36e5;
  if (weeklySets >= 20 || hours < 30) return { type: "rest", label: "Rest advised", detail: hours < 24 ? "Trained today" : `${Math.max(1, Math.round(hours))}h ago` };
  if (hours < 60) return { type: "soon", label: "Recovering", detail: `${Math.max(1, Math.round(hours))}h ago` };
  return { type: "ready", label: "Ready", detail: `${Math.round(hours / 24)}d ago` };
}

function renderMuscleGrid(logs) {
  document.querySelector("#muscleGrid").innerHTML = MUSCLE_GROUPS.map(group => {
    const groupLogs = logs.filter(log => log.muscle === group);
    const sets = groupLogs.reduce((sum, log) => sum + Number(log.sets), 0);
    const volume = groupLogs.reduce((sum, log) => sum + entryVolume(log), 0);
    const recovery = recoveryFor(group, sets);
    return `<article class="muscle-card">
      <div class="muscle-card-top"><span class="muscle-glyph">${MUSCLE_ABBR[group]}</span><div><h3>${group}</h3><p>${recovery.detail}</p></div><span class="recovery-pill ${recovery.type}">${recovery.label}</span></div>
      <div class="muscle-volume"><strong>${sets} sets</strong><span class="bar"><i style="width:${Math.min(100, sets / 20 * 100)}%"></i></span><span>${formatNumber(volume)} lb</span></div>
    </article>`;
  }).join("");
}

function renderRecentSessions(logs) {
  const byDate = logs.reduce((map, log) => { (map[log.date] ||= []).push(log); return map; }, {});
  const sessions = Object.entries(byDate).sort(([a], [b]) => b.localeCompare(a)).slice(0, 4);
  document.querySelector("#recentSessions").innerHTML = sessions.length ? sessions.map(([date, entries]) => {
    const d = parseLocalDate(date);
    const names = entries.map(entry => exerciseById(entry.exerciseId)?.name || "Unknown exercise");
    return `<div class="session-row"><div class="date-block"><strong>${d.getDate()}</strong><span>${d.toLocaleDateString("en-US", { month: "short" })}</span></div><div><h3>${names.slice(0,2).join(" + ")}</h3><p>${entries.reduce((sum, entry) => sum + Number(entry.sets), 0)} working sets · ${new Set(entries.map(e => e.muscle)).size} muscle group${entries.length > 1 ? "s" : ""}</p></div><div class="session-volume"><strong>${formatNumber(entries.reduce((sum, entry) => sum + entryVolume(entry), 0))} lb</strong><span>volume</span></div></div>`;
  }).join("") : `<div class="empty-state">No sessions logged in this week.</div>`;
}

function renderInsight(logs) {
  const setsByMuscle = Object.fromEntries(MUSCLE_GROUPS.map(group => [group, logs.filter(log => log.muscle === group).reduce((sum, log) => sum + Number(log.sets), 0)]));
  const [highestGroup, highestSets] = Object.entries(setsByMuscle).sort((a, b) => b[1] - a[1])[0];
  const neglected = MUSCLE_GROUPS.filter(group => setsByMuscle[group] === 0);
  let title = "Your balance looks solid.";
  let copy = "Weekly sets are spread across your muscle groups. Keep intensity appropriate while recovery catches up.";
  if (!logs.length) { title = "This week is a clean slate."; copy = "Log your first working sets and RepRoot will turn them into recovery and volume guidance."; }
  else if (highestSets >= 18) { title = `${highestGroup} volume is running high.`; copy = `You have ${highestSets} working sets for ${highestGroup}. Consider reducing the next session or waiting until recovery shows ready.`; }
  else if (neglected.length >= 4) { title = "A few groups need attention."; copy = `${neglected.slice(0, 3).join(", ")}${neglected.length > 3 ? " and others" : ""} have no direct sets this week. Add them if they fit your program.`; }
  document.querySelector("#insightTitle").textContent = title;
  document.querySelector("#insightCopy").textContent = copy;
}

function countRecentPRs() {
  const cutoff = new Date(); cutoff.setDate(cutoff.getDate() - 30);
  let count = 0;
  EXERCISES.forEach(exercise => {
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
  updateVolumePreview();
}
function updateVolumePreview() {
  const sets = Number(document.querySelector("#logSets").value) || 0;
  const reps = Number(document.querySelector("#logReps").value) || 0;
  const weight = Number(document.querySelector("#logWeight").value) || 0;
  document.querySelector("#volumePreview").textContent = `${formatNumber(sets * reps * weight)} lb`;
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
  const exercise = exerciseById(document.querySelector("#liveExercise").value) || EXERCISES[0];
  document.querySelector("#completeSetMuscle").textContent = exercise.primary;
  const prior = [...state.logs].filter(log => log.exerciseId === exercise.id).sort((a, b) => b.date.localeCompare(a.date))[0];
  if (prior) {
    document.querySelector("#liveWeight").value = prior.weight;
    document.querySelector("#liveReps").value = prior.reps;
  }
}

function createActiveWorkout() {
  state.activeWorkout = { id: cryptoId(), startedAt: Date.now(), pausedAt: null, totalPausedMs: 0, sets: [] };
  saveActiveWorkout();
}

function handleGlobalWorkoutAction() {
  if (!state.activeWorkout) {
    createActiveWorkout();
    showToast("Workout started. Your timer is running.");
  } else {
    const wasPaused = Boolean(state.activeWorkout.pausedAt);
    toggleWorkoutPause();
    showToast(wasPaused ? "Workout resumed." : "Workout paused.");
  }
  routeTo("workout");
  renderWorkoutMode();
}

function completeWorkoutSet() {
  if (!state.activeWorkout) createActiveWorkout();
  if (state.activeWorkout.pausedAt) toggleWorkoutPause();
  const exercise = exerciseById(document.querySelector("#liveExercise").value);
  const weight = Number(document.querySelector("#liveWeight").value);
  const reps = Number(document.querySelector("#liveReps").value);
  if (!exercise || reps < 1 || weight < 0) { showToast("Enter a valid weight and rep count."); return; }
  state.activeWorkout.sets.push({ id: cryptoId(), exerciseId: exercise.id, muscle: exercise.primary, weight, reps, completedAt: Date.now() });
  saveActiveWorkout(); renderWorkoutMode();
  showToast(`Set ${state.activeWorkout.sets.length} complete — ${exercise.primary} volume added.`);
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
  state.activeWorkout = null; saveActiveWorkout(); renderWorkoutMode(); showToast("Workout discarded.");
}

function finishWorkout() {
  const workout = state.activeWorkout;
  if (!workout?.sets.length) return;
  const date = toISODate(new Date());
  const grouped = workout.sets.reduce((map, set) => {
    const key = `${set.exerciseId}|${set.muscle}|${set.weight}|${set.reps}`;
    if (!map[key]) map[key] = { ...set, sets: 0 };
    map[key].sets++;
    return map;
  }, {});
  Object.values(grouped).forEach(group => state.logs.push({
    id: cryptoId(), date, exerciseId: group.exerciseId, muscle: group.muscle,
    sets: group.sets, reps: group.reps, weight: group.weight,
    notes: "Saved from Workout Mode", createdAt: group.completedAt
  }));
  const summary = {
    id: workout.id, date, startedAt: workout.startedAt, durationSeconds: Math.round(workoutElapsedMs() / 1000),
    setCount: workout.sets.length, volume: workout.sets.reduce((sum, set) => sum + set.weight * set.reps, 0),
    muscles: [...new Set(workout.sets.map(set => set.muscle))]
  };
  state.sessions.push(summary); state.activeWorkout = null; state.selectedWeekStart = startOfWeek(new Date());
  saveLogs(); saveSessions(); saveActiveWorkout(); renderAll();
  showToast(`Workout saved: ${summary.setCount} sets across ${summary.muscles.length} muscle groups.`);
  routeTo("overview");
}

function renderWorkoutMode() {
  const workout = state.activeWorkout;
  const sets = workout?.sets || [];
  const counts = Object.fromEntries(MUSCLE_GROUPS.map(group => [group, sets.filter(set => set.muscle === group).length]));
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
  document.querySelector("#workoutSetCount").textContent = `${sets.length} set${sets.length === 1 ? "" : "s"}`;
  document.querySelectorAll("[data-map-muscle]").forEach(zone => {
    zone.classList.remove("heat-1", "heat-2", "heat-3", "heat-4");
    const count = counts[zone.dataset.mapMuscle];
    if (count) zone.classList.add(`heat-${count >= 9 ? 4 : count >= 6 ? 3 : count >= 3 ? 2 : 1}`);
  });
  document.querySelector("#liveMuscleList").innerHTML = MUSCLE_GROUPS.map(group => `<span class="live-muscle-chip ${counts[group] ? "active" : ""}">${group}${counts[group] ? ` · ${counts[group]}` : ""}</span>`).join("");
  document.querySelector("#sessionFeed").innerHTML = sets.length ? [...sets].reverse().map((set, reverseIndex) => { const exercise = exerciseById(set.exerciseId); return `<div class="feed-row"><span class="feed-number">${sets.length-reverseIndex}</span><div><h3>${exercise?.name || "Exercise"}</h3><p>${set.muscle} · ${new Date(set.completedAt).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}</p></div><strong>${set.weight} lb × ${set.reps}</strong></div>`; }).join("") : `<div class="empty-state">Your completed sets will appear here.</div>`;
  renderGlobalWorkoutControls();
}

function renderGlobalWorkoutControls() {
  const workout = state.activeWorkout;
  const paused = Boolean(workout?.pausedAt);
  document.querySelectorAll(".global-workout-icon").forEach(icon => { icon.textContent = !workout || paused ? "▶" : "Ⅱ"; });
  document.querySelectorAll(".global-workout-label").forEach(label => {
    const shortLabel = label.tagName === "SMALL";
    label.textContent = !workout ? (shortLabel ? "Workout" : "Start workout") : paused ? (shortLabel ? "Resume" : "Resume workout") : (shortLabel ? "Pause" : "Pause workout");
  });
}

function saveWorkoutEntry(event) {
  event.preventDefault();
  const entry = {
    id: cryptoId(), date: document.querySelector("#logDate").value,
    exerciseId: document.querySelector("#logExercise").value, muscle: document.querySelector("#logMuscle").value,
    sets: Number(document.querySelector("#logSets").value), reps: Number(document.querySelector("#logReps").value),
    weight: Number(document.querySelector("#logWeight").value), notes: document.querySelector("#logNotes").value.trim(), createdAt: Date.now()
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
  container.innerHTML = `<p class="eyebrow">Latest entry · ${formatShortDate(latest.date)}</p><h3>${escapeHTML(exercise?.name || "Unknown exercise")}</h3><p>${escapeHTML(latest.notes || `${latest.muscle} working sets`)}</p><div class="entry-metric"><div><strong>${latest.sets} × ${latest.reps}</strong><span>sets × reps</span></div><div><strong>${latest.weight} lb</strong><span>load</span></div><div><strong>${formatNumber(entryVolume(latest))}</strong><span>volume</span></div></div>`;
}

function renderExercises() {
  const query = document.querySelector("#exerciseSearch").value.toLowerCase().trim();
  const muscle = document.querySelector("#muscleFilter").value;
  const movement = document.querySelector("#movementFilter").value;
  const filtered = EXERCISES.filter(ex => (muscle === "all" || ex.primary === muscle) && (movement === "all" || ex.movement === movement) && `${ex.name} ${ex.equipment} ${ex.primary}`.toLowerCase().includes(query));
  document.querySelector("#exerciseCount").textContent = filtered.length;
  document.querySelector("#exerciseRows").innerHTML = filtered.length ? filtered.map(ex => `<div class="exercise-row">
    <div class="exercise-name"><span class="exercise-initials">${MUSCLE_ABBR[ex.primary]}</span><div><strong>${ex.name}</strong><small>${ex.equipment} movement</small></div></div>
    <span><i class="muscle-tag">${ex.primary}</i></span><span>${ex.movement}</span><span>${ex.equipment}</span><button class="row-log-button" data-log-exercise="${ex.id}" title="Log ${ex.name}" aria-label="Log ${ex.name}">＋</button>
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
  const current = logs.at(-1)?.weight || 0; const first = logs[0]?.weight || 0; const bestE1rm = Math.max(0, ...logs.map(e1rm));
  document.querySelector("#chartSummary").innerHTML = `<div><strong>${current} lb</strong><span>Latest load</span></div><div><strong>${current - first >= 0 ? "+" : ""}${formatNumber(current - first)} lb</strong><span>Change</span></div><div><strong>${formatNumber(bestE1rm)} lb</strong><span>Best estimated 1RM</span></div>`;
  const container = document.querySelector("#progressChart");
  if (logs.length < 2) { container.innerHTML = `<div class="empty-state">Log this exercise at least twice to see a progression chart.</div>`; return; }
  const width = 700, height = 235, left = 44, right = 16, top = 14, bottom = 32;
  const values = logs.map(log => Number(log.weight)); const minValue = Math.max(0, Math.min(...values) - 10); const maxValue = Math.max(...values) + 10;
  const x = index => left + index * ((width - left - right) / (logs.length - 1));
  const y = value => top + (maxValue - value) / Math.max(1, maxValue - minValue) * (height - top - bottom);
  const points = logs.map((log, index) => `${x(index)},${y(log.weight)}`).join(" ");
  const area = `${left},${height - bottom} ${points} ${x(logs.length - 1)},${height - bottom}`;
  const grid = Array.from({ length: 4 }, (_, index) => { const value = minValue + (maxValue - minValue) / 3 * index; const gy = y(value); return `<line class="chart-grid-line" x1="${left}" x2="${width-right}" y1="${gy}" y2="${gy}"/><text class="chart-label" x="0" y="${gy+3}">${Math.round(value)} lb</text>`; }).join("");
  const labels = logs.map((log, index) => `<text class="chart-label" text-anchor="middle" x="${x(index)}" y="${height-9}">${formatShortDate(log.date)}</text>`).join("");
  const dots = logs.map((log, index) => `<circle class="chart-dot" cx="${x(index)}" cy="${y(log.weight)}" r="4"><title>${formatFullDate(log.date)}: ${log.weight} lb × ${log.reps}</title></circle>`).join("");
  container.innerHTML = `<svg viewBox="0 0 ${width} ${height}" role="img"><defs><linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#99ddc8" stop-opacity=".5"/><stop offset="100%" stop-color="#99ddc8" stop-opacity="0"/></linearGradient></defs>${grid}<polygon class="chart-area" points="${area}"/><polyline class="chart-line" points="${points}"/>${dots}${labels}</svg>`;
}

function renderPersonalRecords() {
  const records = EXERCISES.map(exercise => {
    const logs = state.logs.filter(log => log.exerciseId === exercise.id); if (!logs.length) return null;
    const best = [...logs].sort((a, b) => e1rm(b) - e1rm(a))[0]; return { exercise, best, estimate: e1rm(best) };
  }).filter(Boolean).sort((a, b) => b.estimate - a.estimate).slice(0, 5);
  document.querySelector("#personalRecords").innerHTML = records.length ? records.map((record, index) => `<div class="record-row"><span class="record-rank">${index + 1}</span><div><h3>${record.exercise.name}</h3><p>${formatFullDate(record.best.date)} · ${record.best.reps} reps</p></div><div class="record-value"><strong>${record.best.weight} lb</strong><span>${formatNumber(record.estimate)} e1RM</span></div></div>`).join("") : `<div class="empty-state">Your records will appear here.</div>`;
}

function renderHistory() {
  const query = document.querySelector("#historySearch").value.toLowerCase().trim();
  const logs = [...state.logs].sort((a, b) => b.date.localeCompare(a.date) || b.createdAt - a.createdAt).filter(log => { const ex = exerciseById(log.exerciseId); return `${ex?.name || ""} ${log.muscle} ${log.notes}`.toLowerCase().includes(query); });
  document.querySelector("#historyRows").innerHTML = logs.length ? logs.map(log => `<div class="history-row"><span>${formatShortDate(log.date)}</span><span><strong>${escapeHTML(exerciseById(log.exerciseId)?.name || "Unknown")}</strong>${log.notes ? `<small class="history-note">${escapeHTML(log.notes)}</small>` : ""}</span><span><i class="muscle-tag">${log.muscle}</i></span><span>${log.sets} × ${log.reps}</span><span>${log.weight} lb</span><span>${formatNumber(entryVolume(log))} lb</span><button class="delete-button" data-delete-log="${log.id}" title="Delete entry" aria-label="Delete entry">×</button></div>`).join("") : `<div class="empty-state">No workout entries found.</div>`;
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
function exportJSON() { downloadFile(`reproot-backup-${toISODate(new Date())}.json`, JSON.stringify({ version: 3, exportedAt: new Date().toISOString(), profile: { name: state.account.name, email: state.account.email }, exercises: EXERCISES, cardioActivities: CARDIO_ACTIVITIES, strengthLogs: state.logs, cardioLogs: state.cardioLogs, workoutSessions: state.sessions }, null, 2), "application/json"); showToast("Full training backup exported."); }
function exportCSV() {
  const headers = ["Date", "Exercise", "Muscle Group", "Movement", "Sets", "Reps", "Weight (lb)", "Volume (lb)", "Notes"];
  const quote = value => `"${String(value ?? "").replaceAll('"', '""')}"`;
  const rows = state.logs.map(log => { const ex = exerciseById(log.exerciseId); return [log.date, ex?.name, log.muscle, ex?.movement, log.sets, log.reps, log.weight, entryVolume(log), log.notes].map(quote).join(","); });
  downloadFile(`reproot-history-${toISODate(new Date())}.csv`, [headers.map(quote).join(","), ...rows].join("\n"), "text/csv"); showToast("Workout history exported as CSV.");
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
