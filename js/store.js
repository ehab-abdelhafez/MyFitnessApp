/*
 * FitPlan — state store (localStorage, on-device only)
 */
const STORE_KEY = "fitplan.v1";

const Store = (() => {
  const todayKey = (d = new Date()) => {
    const z = new Date(d.getTime() - d.getTimezoneOffset() * 60000);
    return z.toISOString().slice(0, 10);
  };

  const blankDay = () => ({
    sessionDone: false,
    exercises: {},     // exId -> [{w, reps}]
    anchors: {},       // exId -> true
    checks: {},        // block index/id -> true (for non-logged blocks)
    water: 0,          // number of glasses
    protein: 0,        // grams
    meals: [],         // {name, g, t}
    steps: null,       // number
    weight: null,      // kg
    notes: "",
  });

  const defaultState = () => ({
    version: 1,
    profile: {
      name: "",
      startWeight: 85.5, height: 174, goalWeight: 78,
      protein: DEFAULT_TARGETS.protein,
      waterMl: DEFAULT_TARGETS.waterMl,
      steps: DEFAULT_TARGETS.steps,
      glassMl: DEFAULT_TARGETS.glassMl,
      created: todayKey(),
    },
    reminders: {
      enabled: false,
      workout: "07:30",
      water: true,           // periodic water nudges while app open
      protein: "20:00",
      anchors: "12:30",
    },
    xp: 0,
    badges: [],            // earned ids
    seenBadges: [],        // for toast de-dup
    logs: {},              // dateKey -> day
  });

  let state = load();

  function load() {
    try {
      const raw = localStorage.getItem(STORE_KEY);
      if (!raw) return defaultState();
      const parsed = JSON.parse(raw);
      // shallow-merge to absorb new defaults
      const base = defaultState();
      return { ...base, ...parsed, profile: { ...base.profile, ...parsed.profile }, reminders: { ...base.reminders, ...parsed.reminders } };
    } catch (e) {
      console.warn("load failed", e);
      return defaultState();
    }
  }

  function save() {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); }
    catch (e) { console.warn("save failed", e); }
  }

  function day(key = todayKey()) {
    if (!state.logs[key]) state.logs[key] = blankDay();
    return state.logs[key];
  }

  // ---- Level math: each level needs more XP -------------------------------
  // level n requires cumulative 100 * n*(n+1)/2 ... use simple curve
  function levelFor(xp) {
    let lvl = 1, need = 200, acc = 0;
    while (xp >= acc + need) { acc += need; lvl++; need = Math.round(need * 1.25); }
    return { level: lvl, into: xp - acc, need, floor: acc };
  }

  function addXp(n) { state.xp += n; }

  // ---- Streak: consecutive days with ANY activity -------------------------
  function isActiveDay(d) {
    if (!d) return false;
    return d.sessionDone || Object.keys(d.exercises).length > 0 ||
      Object.keys(d.anchors).length > 0 || Object.keys(d.checks).length > 0 ||
      d.water > 0 || d.protein > 0 || (d.steps && d.steps > 0) || d.weight != null;
  }

  function currentStreak() {
    let streak = 0;
    let cur = new Date();
    // count back from today (today only counts if active)
    for (let i = 0; i < 400; i++) {
      const k = todayKey(cur);
      if (isActiveDay(state.logs[k])) streak++;
      else if (i === 0) { /* today inactive yet — keep yesterday's streak */ }
      else break;
      cur.setDate(cur.getDate() - 1);
    }
    return streak;
  }

  // ---- Aggregate stats ----------------------------------------------------
  function stats() {
    const logs = Object.entries(state.logs);
    let sessions = 0, waterDays = 0, proteinDays = 0, steps10 = 0, anchorDays = 0, weightLogs = 0;
    for (const [, d] of logs) {
      if (d.sessionDone) sessions++;
      if (d.water * state.profile.glassMl >= state.profile.waterMl) waterDays++;
      if (d.protein >= state.profile.protein) proteinDays++;
      if (d.steps >= 10000) steps10++;
      if (Object.keys(d.anchors).length >= DAILY_ANCHORS.length) anchorDays++;
      if (d.weight != null) weightLogs++;
    }
    return { sessions, waterDays, proteinDays, steps10, anchorDays, weightLogs, streak: currentStreak(), ...levelFor(state.xp), xp: state.xp };
  }

  // ---- Badge evaluation: returns array of NEW badges ----------------------
  function evaluateBadges() {
    const s = stats();
    const have = new Set(state.badges);
    const cond = {
      first_session: s.sessions >= 1,
      streak3: s.streak >= 3, streak7: s.streak >= 7, streak30: s.streak >= 30,
      sessions10: s.sessions >= 10, sessions25: s.sessions >= 25,
      hydration7: s.waterDays >= 7, protein7: s.proteinDays >= 7,
      steps10: s.steps10 >= 1, posture50: s.anchorDays >= 50,
      level5: s.level >= 5, weightlog: s.weightLogs >= 5,
    };
    const newly = [];
    for (const b of BADGES) {
      if (cond[b.id] && !have.has(b.id)) { state.badges.push(b.id); newly.push(b); }
    }
    return newly;
  }

  // ---- Public mutators (each saves + returns new badges) ------------------
  function commit() { const nb = evaluateBadges(); save(); return nb; }

  return {
    todayKey, WEEKDAY_NAMES,
    get state() { return state; },
    get profile() { return state.profile; },
    get reminders() { return state.reminders; },
    day, save, commit, addXp, stats, levelFor, isActiveDay, currentStreak,
    badge: (id) => BADGES.find(b => b.id === id),
    earnedBadges: () => state.badges.map(id => BADGES.find(b => b.id === id)).filter(Boolean),
    setProfile(p) { Object.assign(state.profile, p); save(); },
    setReminders(r) { Object.assign(state.reminders, r); save(); },
    reset() { state = defaultState(); save(); },
    export() { return JSON.stringify(state, null, 2); },
    import(json) { state = { ...defaultState(), ...JSON.parse(json) }; save(); },
  };
})();
