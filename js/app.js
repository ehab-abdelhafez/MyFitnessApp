/* ===========================================================================
   FitPlan — app logic (vanilla JS, no build step)
   =========================================================================== */
"use strict";

// ---- tiny helpers -----------------------------------------------------------
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const clamp = (n, a, b) => Math.max(a, Math.min(b, n));
const pct = (n, d) => d ? clamp(Math.round((n / d) * 100), 0, 100) : 0;
const fmtDate = (k) => new Date(k + "T00:00:00").toLocaleDateString(undefined, { weekday: "short", day: "numeric", month: "short" });

// ---- inline flat SVG line icons (no emoji anywhere) -------------------------
const ICONS = {
  // chrome
  dumbbell: '<path d="M6.5 6.5v11M3.5 9v6M17.5 6.5v11M20.5 9v6M6.5 12h11"/>',
  nutrition: '<path d="M5 2v7a2 2 0 0 0 4 0V2M7 9v13M16.5 2c-2 1.8-2 6 0 8v12"/>',
  chart: '<path d="M5 21V13M12 21V4M19 21v-6"/>',
  settings: '<path d="M4 7h16M4 17h16"/><circle cx="9" cy="7" r="2.4"/><circle cx="15" cy="17" r="2.4"/>',
  flame: '<path d="M12 22a6 6 0 0 0 6-6c0-4-3-5.5-3-9 0 0-2.2 1-2.2 4.2C12.8 9 11.5 7.2 11.5 5 9 6.8 6 8.5 6 16a6 6 0 0 0 6 6z" fill="currentColor" stroke="none"/>',
  // exercise categories
  legs: '<path d="M8 3v5M16 3v5M7 8h10M9 8l-2 13M15 8l2 13"/>',
  hinge: '<path d="M4 5v6M4 11c5 4 11 4 16 0M20 5v6"/>',
  back: '<path d="M12 3v10M7 8l5 5 5-5M6 21l6-5 6 5"/>',
  push: '<path d="M12 21V11M7 16l5-5 5 5M6 5l6 5 6-5"/>',
  core: '<rect x="7" y="3" width="10" height="18" rx="5"/><path d="M7 10h10M7 14h10"/>',
  posture: '<circle cx="12" cy="4" r="1.8"/><path d="M12 6v8M8 9h8M9 21l3-7 3 7"/>',
  neck: '<circle cx="12" cy="7" r="3"/><path d="M12 10v4M8 14h8"/>',
  mobility: '<path d="M20 12a8 8 0 1 1-2.3-5.6M20 4v3h-3"/>',
  stretch: '<path d="M3 12h18M7 8l-4 4 4 4M17 8l4 4-4 4"/>',
  hang: '<path d="M3 5h18M9 5v5a3 3 0 0 0 6 0V5"/>',
  lungs: '<path d="M12 3v9M9 12c0-2-3-2-4 1s-1 6 0 7 3 1 4-2M15 12c0-2 3-2 4 1s1 6 0 7-3 1-4-2"/>',
  walk: '<circle cx="13" cy="4" r="1.7"/><path d="M13 7l-1 5-3 7M12 12l3 2 2 4M9 9l3-1"/>',
  // nutrition
  meat: '<path d="M14.5 4.5a4.5 4.5 0 0 0-7 5.5l-3 3 1.6 1.6 3-3a4.5 4.5 0 0 0 5.4-7.1z"/>',
  leaf: '<path d="M5 19C5 11 11 5 19 5c0 8-6 14-14 14zM5 19c3-3 6-5 9-6"/>',
  grain: '<path d="M12 22V8M12 8c0-3 2-5 2-5s2 2 2 5-2 5-2 5M12 8c0-3-2-5-2-5S8 5 8 8s2 5 2 5"/>',
  droplet: '<path d="M12 3c4 5 6 8 6 11a6 6 0 0 1-12 0c0-3 2-6 6-11z"/>',
  ban: '<circle cx="12" cy="12" r="9"/><path d="M5.6 5.6l12.8 12.8"/>',
  scale: '<path d="M5 8h14l-2 11H7zM9 8a3 3 0 0 1 6 0"/>',
  foot: '<path d="M9 3c2 0 3 3 3 8 0 3-1 5-3 5s-3-2-3-6 1-7 3-7zM6 18h7"/>',
  // badges / toasts
  trophy: '<path d="M7 4h10v4a5 5 0 0 1-10 0zM7 6H5M17 6h2M9 19h6M10 15l-1 4h6l-1-4"/>',
  star: '<path d="M12 3l2.6 5.6 6 .8-4.4 4.2 1.1 6L12 16.9 6.7 19.6l1.1-6L3.4 9.6l6-.8z"/>',
  check: '<path d="M4 12l5 5L20 6"/>',
  bell: '<path d="M6 9a6 6 0 0 1 12 0c0 7 2 8 2 8H4s2-1 2-8M10 21h4"/>',
  download: '<path d="M12 3v12M7 11l5 5 5-5M5 21h14"/>',
  alert: '<path d="M12 3l9 16H3zM12 9v4M12 17h.01"/>',
};
const svg = (name) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[name] || ICONS.dumbbell}</svg>`;

// exercise category -> icon
const CAT_ICON = {
  "Legs": "legs", "Posterior chain": "hinge", "Glutes": "hinge", "Hips": "hinge",
  "Back / posture": "back", "Back": "back", "Posture": "posture", "Core": "core",
  "Decompression": "hang", "Neck / posture": "neck", "Push": "push",
  "Mobility": "mobility", "Stretch": "stretch", "Recovery": "lungs", "Cardio": "walk",
};
const catIcon = (cat) => CAT_ICON[cat] || "dumbbell";

let deferredInstall = null;
let swReg = null;
let viewDate = Store.todayKey(); // the day being viewed/logged (defaults to today)

function dateBar() {
  const today = Store.todayKey();
  const isToday = viewDate === today;
  return `<div class="datebar">
    <button class="icon-btn" data-datenav="-1" aria-label="Previous day">◀</button>
    <label class="datepick">
      <span>${isToday ? "Today" : esc(fmtDate(viewDate))}</span>
      <input type="date" id="date-pick" value="${viewDate}" max="${today}" />
    </label>
    <button class="icon-btn" data-datenav="1" ${isToday ? "disabled" : ""} aria-label="Next day">▶</button>
    ${isToday ? "" : `<button class="btn sm" data-today="1">Today</button>`}
  </div>`;
}

function shiftDate(n) {
  const dt = new Date(viewDate + "T00:00:00");
  dt.setDate(dt.getDate() + n);
  const k = Store.todayKey(dt);
  if (k > Store.todayKey()) return; // no future logging
  viewDate = k;
  rerenderView();
}

function bindDateBar() {
  $$("[data-datenav]").forEach((b) => b.onclick = () => shiftDate(+b.dataset.datenav));
  const dp = $("#date-pick");
  if (dp) dp.onchange = () => { if (dp.value && dp.value <= Store.todayKey()) { viewDate = dp.value; rerenderView(); } };
  const tb = $("[data-today]");
  if (tb) tb.onclick = () => { viewDate = Store.todayKey(); rerenderView(); };
}

// =============================================================================
// Boot
// =============================================================================
window.addEventListener("DOMContentLoaded", () => {
  registerSW();
  window.addEventListener("hashchange", render);
  if (!location.hash) location.hash = "#/today";
  render();
  scheduleReminders();
});

window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  deferredInstall = e;
  render(); // surfaces the install banner
});
window.addEventListener("appinstalled", () => { deferredInstall = null; toastMsg("download", "Installed!", "FitPlan is now on your home screen."); });

let reloadingForUpdate = false;
function registerSW() {
  if (!("serviceWorker" in navigator)) return;
  // If the app was already controlled, a controller change means an UPDATE
  // activated — reload once to pick up the new assets. (Skips the very first
  // install, where there's no prior controller, to avoid a needless reload.)
  const hadController = !!navigator.serviceWorker.controller;
  navigator.serviceWorker.addEventListener("controllerchange", () => {
    if (!hadController || reloadingForUpdate) return;
    reloadingForUpdate = true;
    window.location.reload();
  });
  navigator.serviceWorker.register("sw.js").then((r) => {
    swReg = r;
    r.update().catch(() => {});
    // when a new SW is found and finishes installing, activate it immediately
    r.addEventListener("updatefound", () => {
      const sw = r.installing;
      if (!sw) return;
      sw.addEventListener("statechange", () => {
        if (sw.state === "installed" && navigator.serviceWorker.controller) {
          sw.postMessage({ type: "skip-waiting" });
        }
      });
    });
  }).catch(() => {});
}

// =============================================================================
// Router / chrome
// =============================================================================
const ROUTES = { "#/today": viewToday, "#/nutrition": viewNutrition, "#/progress": viewProgress, "#/settings": viewSettings };

function render() {
  const route = location.hash.split("?")[0];
  const view = ROUTES[route] || viewToday;
  const s = Store.stats();
  const app = $("#app");
  app.innerHTML = topbar() + levelbar(s) + `<div id="view">${view()}</div>` + tabbar(route);
  bindView(route);
  window.scrollTo(0, 0);
}

function rerenderView() {
  const route = location.hash.split("?")[0];
  const view = ROUTES[route] || viewToday;
  $("#view").innerHTML = view();
  // refresh chrome (level/streak may have changed)
  $("#levelbar-host").outerHTML = levelbar(Store.stats());
  bindView(route);
}

function topbar() {
  const greet = greeting();
  return `<div class="topbar">
    <div class="logo">${svg("dumbbell")}</div>
    <div><h1>FitPlan</h1><div class="sub">${esc(greet)}</div></div>
    <div class="spacer"></div>
    <button class="icon-btn" data-go="#/settings" aria-label="Settings">${svg("settings")}</button>
  </div>`;
}

function greeting() {
  const h = new Date().getHours();
  const name = Store.profile.name ? `, ${Store.profile.name}` : "";
  const t = h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening";
  return `${t}${name}`;
}

function levelbar(s) {
  const fill = pct(s.into, s.need);
  return `<div id="levelbar-host"><div class="levelbar">
    <span class="lv">LV ${s.level}</span>
    <div class="track"><div class="fill" style="width:${fill}%"></div></div>
    <span class="streak">${svg("flame")} ${s.streak}</span>
  </div></div>`;
}

function tabbar(route) {
  const items = [
    ["#/today", "dumbbell", "Train"], ["#/nutrition", "nutrition", "Fuel"],
    ["#/progress", "chart", "Progress"], ["#/settings", "settings", "Settings"],
  ];
  return `<nav class="tabbar">${items.map(([h, i, l]) =>
    `<a href="${h}" class="${route === h ? "active" : ""}"><span class="ic">${svg(i)}</span>${l}</a>`).join("")}</nav>`;
}

// =============================================================================
// XP / award sync + badge toasts
// =============================================================================
function syncAwards() {
  const d = Store.day(viewDate);
  d.awarded = d.awarded || {};
  const p = Store.profile;
  const checks = {
    session: d.sessionDone,
    water: d.water * p.glassMl >= p.waterMl,
    protein: d.protein >= p.protein,
    steps: d.steps >= p.steps,
    weight: d.weight != null,
    anchors: Object.keys(d.anchors).length >= DAILY_ANCHORS.length,
  };
  const xpMap = { session: XP.session, water: XP.waterTarget, protein: XP.proteinTarget, steps: XP.stepsTarget, weight: XP.weightLog, anchors: XP.anchorDay };
  for (const k in checks) if (checks[k] && !d.awarded[k]) { d.awarded[k] = true; Store.addXp(xpMap[k]); }
}

// call after any data mutation
function commit({ full = false } = {}) {
  syncAwards();
  const newBadges = Store.commit();
  newBadges.forEach((b, i) => setTimeout(() => toastMsg(b.ic, b.name, b.desc), i * 700));
  if (full) render(); else rerenderView();
}

function toastMsg(icon, title, body) {
  const host = $("#toast-host");
  const t = document.createElement("div");
  t.className = "toast";
  const mark = ICONS[icon] ? svg(icon) : esc(icon);
  t.innerHTML = `<span class="be">${mark}</span><div><strong>${esc(title)}</strong><div class="small muted">${esc(body || "")}</div></div>`;
  host.appendChild(t);
  setTimeout(() => { t.style.opacity = "0"; t.style.transition = "opacity .4s"; setTimeout(() => t.remove(), 400); }, 3200);
}

// =============================================================================
// TODAY view
// =============================================================================
function viewToday() {
  const dow = new Date(viewDate + "T00:00:00").getDay();
  const plan = DAYS[dow];
  const d = Store.day(viewDate);
  const blocks = plan.blocks;
  const doneCount = blocks.filter((b, i) => blockDone(d, b, i)).length;

  let html = dateBar();

  // install banner
  if (deferredInstall) {
    html += `<div class="card install-banner">
      <h2>Install FitPlan</h2>
      <p class="small">Add it to your home screen — full-screen, offline, just like a native app.</p>
      <button class="btn block" id="install-btn">Install now</button>
    </div>`;
  } else if (!isStandalone()) {
    html += `<div class="note-box" style="margin-bottom:14px">To install: tap your browser menu → <b>Add to Home screen</b>.</div>`;
  }

  // hero / today's session
  html += `<div class="card hero">
    <div class="day-tag">${esc(WEEKDAY_NAMES[dow])} · Session ${esc(plan.id)}</div>
    <h2>${esc(plan.title)}</h2>
    <div class="muted small">${esc(plan.subtitle)}</div>
    <div class="row between" style="margin-top:12px">
      <span class="pill brand">${esc(typeLabel(plan.type))}</span>
      <span class="small muted">${doneCount}/${blocks.length} done</span>
    </div>
    <div class="bar" style="margin-top:10px"><i style="width:${pct(doneCount, blocks.length)}%"></i></div>
    ${d.sessionDone
      ? `<div class="row" style="margin-top:12px;gap:8px"><span class="pill good">✓ Session complete</span></div>`
      : `<button class="btn good block" id="complete-session" style="margin-top:12px">✓ Mark session complete</button>`}
  </div>`;

  // warm-up (collapsible-ish, simple)
  if (plan.warmup) {
    html += `<div class="section-title">Warm-up · 6–8 min</div>`;
    html += `<div class="card">${WARMUP.map((b) => warmupRow(b)).join("")}</div>`;
  }

  // main blocks
  html += `<div class="section-title">${plan.type === "strength" ? "Workout" : "Session"}</div>`;
  html += blocks.map((b, i) => exerciseBlock(d, b, i)).join("");

  // daily anchors
  html += `<div class="section-title">Daily anchors · every day</div>`;
  html += `<div class="card">
    <p class="small muted" style="margin-top:0">Targets your DIERS findings — under 10 min, spread through the day.</p>
    ${DAILY_ANCHORS.map((a) => anchorRow(d, a)).join("")}
    ${stepsAnchorRow(d)}
  </div>`;

  return html;
}

function typeLabel(t) { return { strength: "Strength", mobility: "Mobility", conditioning: "Conditioning" }[t] || t; }

function blockDone(d, b, i) {
  if (b.log) {
    const sets = d.exercises[keyFor(b, i)] || [];
    return sets.some((s) => Number(s.reps) > 0 || Number(s.w) > 0);
  }
  return !!d.checks[keyFor(b, i)];
}
function keyFor(b, i) { return `${b.ex}#${i}`; }

function warmupRow(b) {
  const ex = EXERCISES[b.ex];
  return `<div class="ex" style="margin-bottom:8px"><div class="ex-head">
    <div class="emoji">${svg(catIcon(ex.cat))}</div>
    <div style="flex:1"><div class="ex-name">${esc(ex.name)}</div><div class="ex-sets">${esc(b.sets)}</div></div>
    <button class="btn sm ghost" data-demo="${b.ex}">▶</button>
  </div></div>`;
}

function exerciseBlock(d, b, i) {
  const ex = EXERCISES[b.ex];
  const k = keyFor(b, i);
  const done = blockDone(d, b, i);
  let inner = `<div class="ex-head">
    <div class="emoji">${svg(catIcon(ex.cat))}</div>
    <div style="flex:1">
      <div class="ex-name">${esc(ex.name)}</div>
      <div class="ex-sets">${esc(b.sets)}</div>
      ${b.note ? `<div class="ex-note">${esc(b.note)}</div>` : ""}
    </div>
    ${b.log ? "" : `<button class="chk ${done ? "on" : ""}" data-check="${k}">${done ? "✓" : ""}</button>`}
  </div>`;

  if (b.log) {
    const sets = d.exercises[k] || [];
    inner += `<div class="sets" data-sets="${k}">`;
    if (sets.length) {
      inner += `<div class="set-head"><span>#</span><span>kg</span><span>reps</span><span></span></div>`;
      inner += sets.map((s, si) => `<div class="set-row">
        <span class="idx">${si + 1}</span>
        <input type="number" inputmode="decimal" placeholder="–" value="${s.w ?? ""}" data-setw="${k}:${si}" />
        <input type="number" inputmode="numeric" placeholder="–" value="${s.reps ?? ""}" data-setr="${k}:${si}" />
        <button class="del" data-delset="${k}:${si}">✕</button>
      </div>`).join("");
    }
    inner += `</div>`;
    inner += `<div class="ex-actions">
      <button class="btn sm" data-addset="${k}">＋ Add set</button>
      <button class="btn sm ghost" data-demo="${b.ex}">▶ Demo</button>
    </div>`;
  } else {
    inner += `<div class="ex-actions"><button class="btn sm ghost block" data-demo="${b.ex}">▶ Watch demo</button></div>`;
  }

  return `<div class="ex ${done ? "done" : ""}">${inner}</div>`;
}

function anchorRow(d, a) {
  const ex = EXERCISES[a.ex];
  const on = !!d.anchors[a.ex];
  return `<div class="ex" style="margin-bottom:8px"><div class="ex-head">
    <div class="emoji">${svg(catIcon(ex.cat))}</div>
    <div style="flex:1">
      <div class="ex-name">${esc(ex.name)}</div>
      <div class="ex-sets">${esc(a.sets)}${a.note ? " · " + esc(a.note) : ""}</div>
    </div>
    <button class="btn sm ghost" data-demo="${a.ex}">▶</button>
    <button class="chk ${on ? "on" : ""}" data-anchor="${a.ex}">${on ? "✓" : ""}</button>
  </div></div>`;
}

function stepsAnchorRow(d) {
  const p = Store.profile;
  const steps = d.steps || 0;
  return `<div class="ex" style="margin-bottom:0"><div class="ex-head">
    <div class="emoji">${svg("walk")}</div>
    <div style="flex:1">
      <div class="ex-name">Steps</div>
      <div class="ex-sets">Target ${p.steps.toLocaleString()}/day · move 2–3 min every 30–45 min</div>
      <div class="bar" style="margin-top:8px"><i style="width:${pct(steps, p.steps)}%"></i></div>
    </div>
  </div>
  <div class="ex-actions">
    <input class="field" style="flex:1;margin:0" type="number" inputmode="numeric" placeholder="Today's steps" value="${steps || ""}" data-steps="1" />
    <button class="btn sm" data-stepsquick="2000">＋2k</button>
  </div></div>`;
}

// =============================================================================
// NUTRITION view
// =============================================================================
function viewNutrition() {
  const d = Store.day(viewDate);
  const p = Store.profile;
  const glasses = Math.round(p.waterMl / p.glassMl);
  const waterMl = d.water * p.glassMl;

  let html = dateBar() + `<div class="cols2">`;

  // Hydration
  html += `<div class="card">
    <h2>Hydration</h2>
    <div class="row between"><div><span class="big" style="font-size:26px;font-weight:800">${(waterMl / 1000).toFixed(2)} L</span>
      <span class="target"> / ${(p.waterMl / 1000).toFixed(2)} L</span></div>
      <span class="pill">${d.water} × ${p.glassMl}ml</span></div>
    <div class="bar water" style="margin:10px 0 12px"><i style="width:${pct(waterMl, p.waterMl)}%"></i></div>
    <div class="glasses">${Array.from({ length: glasses }, (_, i) =>
      `<button class="glass ${i < d.water ? "full" : ""}" data-water="${i + 1}" aria-label="glass ${i + 1}"></button>`).join("")}</div>
    <div class="ex-actions" style="margin-top:12px">
      <button class="btn sm" data-wateradd="1">＋ Glass</button>
      <button class="btn sm ghost" data-wateradd="-1">－</button>
    </div>
    <p class="small muted" style="margin-bottom:0">2.5–3 L/day. Also blunts GLP-drug nausea & constipation.</p>
  </div>`;

  // Protein
  html += `<div class="card">
    <h2>Protein</h2>
    <div class="row between"><div><span class="big" style="font-size:26px;font-weight:800">${d.protein} g</span>
      <span class="target"> / ${p.protein} g</span></div>
      <span class="pill ${d.protein >= p.protein ? "good" : ""}">${pct(d.protein, p.protein)}%</span></div>
    <div class="bar amber" style="margin:10px 0 12px"><i style="width:${pct(d.protein, p.protein)}%"></i></div>
    <div class="chips">${NUTRITION.proteinPresets.map((x) =>
      `<button class="chip" data-protein="${x.g}" data-pname="${esc(x.name)}">${esc(x.name)} +${x.g}g</button>`).join("")}</div>
    <div class="ex-actions" style="margin-top:12px">
      <input class="field" style="flex:1;margin:0" type="number" inputmode="numeric" placeholder="Custom grams" id="protein-custom" />
      <button class="btn sm" id="protein-add">Add</button>
    </div>
    ${d.meals.length ? `<hr class="sep"><div>${d.meals.map((m, i) =>
      `<div class="meal"><span>${esc(m.name)}</span><span class="row" style="gap:10px"><span class="g">+${m.g}g</span><button class="del" data-delmeal="${i}">✕</button></span></div>`).join("")}</div>` : ""}
  </div>`;

  html += `</div>`; // cols2

  // Weight
  const lastW = lastWeight();
  html += `<div class="card">
    <h2>Body weight</h2>
    <div class="row between">
      <div><span class="big" style="font-size:26px;font-weight:800">${d.weight != null ? d.weight + " kg" : "—"}</span>
        ${lastW && d.weight == null ? `<span class="target"> last: ${lastW.w} kg (${fmtDate(lastW.k)})</span>` : ""}</div>
      <span class="pill">goal ${p.goalWeight} kg</span>
    </div>
    <div class="ex-actions" style="margin-top:12px">
      <input class="field" style="flex:1;margin:0" type="number" inputmode="decimal" step="0.1" placeholder="Today's weight (kg)" value="${d.weight ?? ""}" id="weight-in" />
      <button class="btn sm" id="weight-save">Save</button>
    </div>
    ${weightSparkline()}
  </div>`;

  // Plan reference
  html += `<div class="card">
    <h2>Your plan</h2>
    <div class="note-box" style="margin-bottom:12px"><b>Plate method:</b> ${esc(NUTRITION.plate)}</div>
    ${NUTRITION.rules.map((r) => `<div class="rule"><span class="ri">${svg(r.ic)}</span><div class="rt"><strong>${esc(r.title)}</strong><span>${esc(r.text)}</span></div></div>`).join("")}
    <div class="section-title" style="margin-left:0">Sample day</div>
    ${NUTRITION.sampleDay.map((m) => `<div class="rule"><span class="ri">•</span><div class="rt"><strong>${esc(m.meal)}</strong><span>${esc(m.text)}</span></div></div>`).join("")}
  </div>`;

  return html;
}

function lastWeight() {
  const entries = Object.entries(Store.state.logs).filter(([, d]) => d.weight != null).sort((a, b) => a[0] < b[0] ? 1 : -1);
  return entries.length ? { k: entries[0][0], w: entries[0][1].weight } : null;
}

function weightSeries() {
  return Object.entries(Store.state.logs).filter(([, d]) => d.weight != null)
    .map(([k, d]) => ({ k, w: d.weight })).sort((a, b) => a.k < b.k ? -1 : 1);
}

function weightSparkline() {
  const s = weightSeries();
  if (s.length < 2) return `<p class="small muted">Log your weight a few times to see the trend.</p>`;
  return `<div style="margin-top:12px">${lineChart(s.map(x => x.w), s.map(x => x.k))}</div>`;
}

// =============================================================================
// PROGRESS view
// =============================================================================
function viewProgress() {
  const s = Store.stats();
  let html = "";

  html += `<div class="card">
    <h2>Your progress</h2>
    <div class="stat-grid">
      <div class="stat"><div class="n">${s.sessions}</div><div class="l">Workouts</div></div>
      <div class="stat"><div class="n">${s.streak}</div><div class="l">Day streak</div></div>
      <div class="stat"><div class="n">${s.level}</div><div class="l">Level</div></div>
      <div class="stat"><div class="n">${s.anchorDays}</div><div class="l">Posture days</div></div>
      <div class="stat"><div class="n">${s.waterDays}</div><div class="l">Hydration days</div></div>
      <div class="stat"><div class="n">${s.proteinDays}</div><div class="l">Protein days</div></div>
    </div>
  </div>`;

  // weight trend
  const ws = weightSeries();
  html += `<div class="card"><h2>Weight trend</h2>${
    ws.length >= 2
      ? lineChart(ws.map(x => x.w), ws.map(x => x.k)) + `<p class="small muted">${ws.length} entries · ${ws[0].w} → ${ws[ws.length - 1].w} kg · goal ${Store.profile.goalWeight} kg</p>`
      : `<p class="small muted">Log weight in the Nutrition tab to chart your trend.</p>`}</div>`;

  // 7-day protein & water bars
  html += `<div class="card"><h2>Last 7 days</h2>${weekBars()}</div>`;

  // activity heatmap
  html += `<div class="card"><h2>Consistency</h2>${heatmap()}<p class="small muted">Last 12 weeks — brighter = more done that day.</p></div>`;

  // badges
  const earned = new Set(Store.state.badges);
  html += `<div class="card"><h2>Achievements <span class="muted small">(${earned.size}/${BADGES.length})</span></h2>
    <div class="badge-grid">${BADGES.map((b) =>
      `<div class="badge-cell ${earned.has(b.id) ? "earned" : ""}"><div class="be">${svg(b.ic)}</div><div class="bn">${esc(b.name)}</div><div class="bd">${esc(b.desc)}</div></div>`).join("")}</div>
  </div>`;

  return html;
}

function dayScore(d) {
  if (!d) return 0;
  let n = 0;
  if (d.sessionDone) n += 2;
  if (Object.keys(d.exercises).length || Object.keys(d.checks).length) n += 1;
  if (Object.keys(d.anchors).length >= DAILY_ANCHORS.length) n += 1;
  if (d.water * Store.profile.glassMl >= Store.profile.waterMl) n += 1;
  if (d.protein >= Store.profile.protein) n += 1;
  return n;
}

function heatmap() {
  const days = 84;
  const cells = [];
  const today = new Date();
  // align so columns are weeks; start from (84 days ago)
  for (let i = days - 1; i >= 0; i--) {
    const dt = new Date(today); dt.setDate(today.getDate() - i);
    const k = Store.todayKey(dt);
    const score = dayScore(Store.state.logs[k]);
    const lvl = score >= 5 ? 4 : score >= 3 ? 3 : score >= 2 ? 2 : score >= 1 ? 1 : 0;
    cells.push(`<div class="cell ${lvl ? "l" + lvl : ""}" title="${k}"></div>`);
  }
  return `<div class="heat">${cells.join("")}</div>`;
}

function weekBars() {
  const p = Store.profile;
  const rows = [];
  const today = new Date();
  for (let i = 6; i >= 0; i--) {
    const dt = new Date(today); dt.setDate(today.getDate() - i);
    const k = Store.todayKey(dt);
    const d = Store.state.logs[k] || {};
    const prot = pct(d.protein || 0, p.protein);
    const water = pct((d.water || 0) * p.glassMl, p.waterMl);
    const lbl = dt.toLocaleDateString(undefined, { weekday: "short" });
    rows.push(`<div style="margin-bottom:10px">
      <div class="row between small muted"><span>${lbl}</span><span>${d.protein || 0}g · ${(((d.water || 0) * p.glassMl) / 1000).toFixed(1)}L</span></div>
      <div class="bar amber" style="margin-top:4px"><i style="width:${prot}%"></i></div>
      <div class="bar water" style="margin-top:3px"><i style="width:${water}%"></i></div>
    </div>`);
  }
  return rows.join("") + `<p class="small muted"><span style="color:var(--protein)">▬</span> protein vs target · <span style="color:var(--water)">▬</span> water vs target</p>`;
}

// simple responsive SVG line chart
function lineChart(vals, labels) {
  const W = 320, H = 120, pad = 24;
  const min = Math.min(...vals), max = Math.max(...vals);
  const range = (max - min) || 1;
  const x = (i) => pad + (i * (W - pad * 2)) / Math.max(1, vals.length - 1);
  const y = (v) => H - pad - ((v - min) / range) * (H - pad * 2);
  const pts = vals.map((v, i) => `${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(" ");
  const area = `${pad},${H - pad} ${pts} ${(W - pad)},${H - pad}`;
  const dots = vals.map((v, i) => `<circle cx="${x(i).toFixed(1)}" cy="${y(v).toFixed(1)}" r="2.5" fill="#22d3ee"/>`).join("");
  return `<svg class="chart" viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" role="img">
    <defs><linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#22d3ee" stop-opacity=".35"/><stop offset="1" stop-color="#22d3ee" stop-opacity="0"/>
    </linearGradient></defs>
    <polygon points="${area}" fill="url(#g1)"/>
    <polyline points="${pts}" fill="none" stroke="#22d3ee" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>
    ${dots}
    <text x="${pad}" y="14" fill="#9aa3d4" font-size="10">${max}</text>
    <text x="${pad}" y="${H - 6}" fill="#9aa3d4" font-size="10">${min}</text>
  </svg>`;
}

// =============================================================================
// SETTINGS view
// =============================================================================
function viewSettings() {
  const p = Store.profile;
  const r = Store.reminders;
  const notifState = ("Notification" in window) ? Notification.permission : "unsupported";

  return `
  <div class="card">
    <h2>Profile &amp; targets</h2>
    <div class="field"><label>Name</label><input id="p-name" value="${esc(p.name)}" placeholder="Your name" /></div>
    <div class="grid2">
      <div class="field"><label>Height (cm)</label><input id="p-height" type="number" value="${p.height}" /></div>
      <div class="field"><label>Goal weight (kg)</label><input id="p-goal" type="number" step="0.1" value="${p.goalWeight}" /></div>
      <div class="field"><label>Protein target (g)</label><input id="p-protein" type="number" value="${p.protein}" /></div>
      <div class="field"><label>Water target (ml)</label><input id="p-water" type="number" value="${p.waterMl}" /></div>
      <div class="field"><label>Glass size (ml)</label><input id="p-glass" type="number" value="${p.glassMl}" /></div>
      <div class="field"><label>Step target</label><input id="p-steps" type="number" value="${p.steps}" /></div>
    </div>
    <button class="btn primary block" id="save-profile">Save targets</button>
  </div>

  <div class="card">
    <h2>Reminders</h2>
    <p class="small muted" style="margin-top:0">Local notifications. They fire while FitPlan is open or recently used — keep it added to your home screen for best results.</p>
    ${notifState === "granted"
      ? `<span class="pill good">✓ Notifications enabled</span>`
      : notifState === "unsupported"
        ? `<span class="pill">Notifications not supported on this browser</span>`
        : `<button class="btn primary block" id="enable-notif">Enable notifications</button>`}
    <div style="margin-top:14px">
      <label class="row between" style="padding:8px 0"><span>Workout reminder</span>
        <input type="time" id="r-workout" value="${r.workout}" style="width:auto;background:#000;border:1px solid var(--line);color:var(--text);border-radius:6px;padding:6px;font-family:var(--mono)"/></label>
      <label class="row between" style="padding:8px 0"><span>Posture anchors reminder</span>
        <input type="time" id="r-anchors" value="${r.anchors}" style="width:auto;background:#000;border:1px solid var(--line);color:var(--text);border-radius:6px;padding:6px;font-family:var(--mono)"/></label>
      <label class="row between" style="padding:8px 0"><span>Protein check-in</span>
        <input type="time" id="r-protein" value="${r.protein}" style="width:auto;background:#000;border:1px solid var(--line);color:var(--text);border-radius:6px;padding:6px;font-family:var(--mono)"/></label>
      <label class="row between" style="padding:8px 0"><span>Water nudges (while open)</span>
        <input type="checkbox" id="r-water" ${r.water ? "checked" : ""} style="width:22px;height:22px"/></label>
    </div>
    <button class="btn block" id="save-reminders" style="margin-top:8px">Save reminders</button>
    <button class="btn ghost block" id="test-notif" style="margin-top:8px">Send a test notification</button>
  </div>

  <div class="card">
    <h2>Your data</h2>
    <p class="small muted" style="margin-top:0">Everything is stored privately on this device. Back it up before clearing browser data.</p>
    <div class="ex-actions"><button class="btn sm" id="export-data">Export backup</button>
      <button class="btn sm ghost" id="import-data">Import</button></div>
    <button class="btn ghost block" id="reset-data" style="margin-top:10px;color:var(--bad)">Reset all data</button>
  </div>

  <div class="card">
    <h2>About</h2>
    <p class="small muted">FitPlan v1 — built from your Daily Full-Body Programme + Nutrition Plan (v2, DIERS-tailored). Posture-aware loading for kyphosis, forward head and a mild lateral curve. Not medical advice — see the safety notes below.</p>
    <hr class="sep">
    <p class="small muted"><strong style="color:var(--warn)">Caution —</strong> stop and see a doctor for radiating/nerve pain, numbness, tingling, or new/worsening pain. Confirm the side-plank bias and the 66° kyphosis read with a physio.</p>
  </div>`;
}

// =============================================================================
// Event binding (delegation)
// =============================================================================
function bindView(route) {
  const view = $("#view");

  // global nav buttons
  $$("[data-go]").forEach((b) => b.onclick = () => location.hash = b.dataset.go);
  const installBtn = $("#install-btn");
  if (installBtn) installBtn.onclick = doInstall;

  // demo modal (works on any view)
  view.addEventListener("click", (e) => {
    const demo = e.target.closest("[data-demo]");
    if (demo) { openExercise(demo.dataset.demo); return; }
  });

  if (route === "#/today") bindToday();
  else if (route === "#/nutrition") bindNutrition();
  else if (route === "#/settings") bindSettings();
}

function bindToday() {
  const view = $("#view");
  const d = Store.day(viewDate);
  bindDateBar();

  const cs = $("#complete-session");
  if (cs) cs.onclick = () => { Store.day(viewDate).sessionDone = true; commit({ full: true }); };

  // delegated clicks
  view.addEventListener("click", (e) => {
    const t = e.target;
    const anchor = t.closest("[data-anchor]");
    if (anchor) { const id = anchor.dataset.anchor; if (d.anchors[id]) delete d.anchors[id]; else d.anchors[id] = true; commit(); return; }
    const chk = t.closest("[data-check]");
    if (chk) { const k = chk.dataset.check; if (d.checks[k]) delete d.checks[k]; else d.checks[k] = true; commit(); return; }
    const addset = t.closest("[data-addset]");
    if (addset) { const k = addset.dataset.addset; (d.exercises[k] = d.exercises[k] || []).push({ w: "", reps: "" }); Store.save(); rerenderView(); return; }
    const delset = t.closest("[data-delset]");
    if (delset) { const [k, si] = delset.dataset.delset.split(":"); d.exercises[k].splice(+si, 1); if (!d.exercises[k].length) delete d.exercises[k]; commit(); return; }
    const sq = t.closest("[data-stepsquick]");
    if (sq) { d.steps = (d.steps || 0) + (+sq.dataset.stepsquick); commit(); return; }
  });

  // set inputs (change)
  view.addEventListener("change", (e) => {
    const w = e.target.closest("[data-setw]"); const r = e.target.closest("[data-setr]");
    if (w) { const [k, si] = w.dataset.setw.split(":"); d.exercises[k][+si].w = e.target.value; commit(); }
    if (r) { const [k, si] = r.dataset.setr.split(":"); d.exercises[k][+si].reps = e.target.value; commit(); }
    const st = e.target.closest("[data-steps]");
    if (st) { d.steps = e.target.value ? +e.target.value : null; commit(); }
  });
}

function bindNutrition() {
  const view = $("#view");
  const d = Store.day(viewDate);
  const p = Store.profile;
  bindDateBar();

  view.addEventListener("click", (e) => {
    const g = e.target.closest("[data-water]");
    if (g) { const n = +g.dataset.water; d.water = (d.water === n) ? n - 1 : n; commit(); return; }
    const wa = e.target.closest("[data-wateradd]");
    if (wa) { d.water = clamp(d.water + (+wa.dataset.wateradd), 0, 40); commit(); return; }
    const pr = e.target.closest("[data-protein]");
    if (pr) { const g = +pr.dataset.protein; d.protein += g; d.meals.push({ name: pr.dataset.pname, g, t: Date.now() }); commit(); return; }
    const dm = e.target.closest("[data-delmeal]");
    if (dm) { const i = +dm.dataset.delmeal; d.protein = Math.max(0, d.protein - (d.meals[i].g || 0)); d.meals.splice(i, 1); commit(); return; }
  });

  const padd = $("#protein-add");
  if (padd) padd.onclick = () => {
    const v = +$("#protein-custom").value; if (!v) return;
    d.protein += v; d.meals.push({ name: "Custom", g: v, t: Date.now() }); commit();
  };
  const ws = $("#weight-save");
  if (ws) ws.onclick = () => { const v = parseFloat($("#weight-in").value); if (!isNaN(v)) { d.weight = Math.round(v * 10) / 10; commit(); } };
}

function bindSettings() {
  $("#save-profile").onclick = () => {
    Store.setProfile({
      name: $("#p-name").value.trim(),
      height: +$("#p-height").value || Store.profile.height,
      goalWeight: parseFloat($("#p-goal").value) || Store.profile.goalWeight,
      protein: +$("#p-protein").value || Store.profile.protein,
      waterMl: +$("#p-water").value || Store.profile.waterMl,
      glassMl: +$("#p-glass").value || Store.profile.glassMl,
      steps: +$("#p-steps").value || Store.profile.steps,
    });
    toastMsg("check", "Saved", "Targets updated.");
    render();
  };

  const en = $("#enable-notif");
  if (en) en.onclick = async () => {
    if (!("Notification" in window)) return;
    const perm = await Notification.requestPermission();
    if (perm === "granted") { Store.setReminders({ enabled: true }); scheduleReminders(); toastMsg("bell", "Notifications on", "You'll get your reminders."); }
    render();
  };

  const sr = $("#save-reminders");
  if (sr) sr.onclick = () => {
    Store.setReminders({
      enabled: true,
      workout: $("#r-workout").value, anchors: $("#r-anchors").value,
      protein: $("#r-protein").value, water: $("#r-water").checked,
    });
    scheduleReminders();
    toastMsg("bell", "Reminders saved", "Scheduled for today.");
  };

  const tn = $("#test-notif");
  if (tn) tn.onclick = () => notify("FitPlan", "This is a test reminder 💪", "test");

  $("#export-data").onclick = () => {
    const blob = new Blob([Store.export()], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = `fitplan-backup-${Store.todayKey()}.json`; a.click();
    URL.revokeObjectURL(url);
  };
  $("#import-data").onclick = () => {
    const inp = document.createElement("input"); inp.type = "file"; inp.accept = "application/json";
    inp.onchange = () => { const f = inp.files[0]; if (!f) return; const fr = new FileReader();
      fr.onload = () => { try { Store.import(fr.result); toastMsg("check", "Imported", "Backup restored."); render(); } catch { toastMsg("alert", "Failed", "Invalid backup file."); } };
      fr.readAsText(f); };
    inp.click();
  };
  $("#reset-data").onclick = () => { if (confirm("Erase all FitPlan data on this device? This can't be undone.")) { Store.reset(); render(); } };
}

// =============================================================================
// Exercise demo modal
// =============================================================================
function openExercise(exId) {
  const ex = EXERCISES[exId];
  if (!ex) return;
  const host = $("#modal-host");
  const searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(ex.q || ex.name + " how to")}`;
  const video = ex.yt
    ? `<div class="video-frame"><iframe loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen" allowfullscreen
        src="https://www.youtube-nocookie.com/embed/${ex.yt}?rel=0&modestbranding=1&playsinline=1"></iframe></div>`
    : `<div class="video-frame"><div class="video-ph"><div>No embedded clip for this one.<br><a href="${searchUrl}" target="_blank" rel="noopener">▶ Search YouTube for a demo</a></div></div></div>`;

  host.innerHTML = `<div class="modal-bg" id="modal-bg"><div class="modal" role="dialog" aria-modal="true">
    <div class="grab"></div>
    <div class="row between"><div><h2>${ex.emoji} ${esc(ex.name)}</h2><span class="pill">${esc(ex.cat)}</span></div>
      <button class="icon-btn" id="modal-close">✕</button></div>
    ${video}
    <a class="btn ghost block sm" href="${searchUrl}" target="_blank" rel="noopener">🔎 More demos on YouTube</a>
    <div class="section-title" style="margin-left:0">Form cues</div>
    <ul class="cues">${ex.cues.map((c) => `<li>${esc(c)}</li>`).join("")}</ul>
  </div></div>`;

  const close = () => { host.innerHTML = ""; };
  $("#modal-close").onclick = close;
  $("#modal-bg").onclick = (e) => { if (e.target.id === "modal-bg") close(); };
}

// =============================================================================
// Notifications / reminders
// =============================================================================
const reminderTimers = [];
function clearTimers() { reminderTimers.forEach(clearTimeout); reminderTimers.length = 0; }

function notify(title, body, tag) {
  if (!("Notification" in window) || Notification.permission !== "granted") { toastMsg("bell", title, body); return; }
  if (swReg && swReg.active) swReg.active.postMessage({ type: "notify", title, body, tag, url: "index.html#/today" });
  else new Notification(title, { body, icon: "icons/icon-192.png", tag });
}

function scheduleReminders() {
  clearTimers();
  const r = Store.reminders;
  if (!r.enabled || !("Notification" in window) || Notification.permission !== "granted") return;

  const at = (hhmm, fn) => {
    if (!hhmm) return;
    const [h, m] = hhmm.split(":").map(Number);
    const now = new Date();
    const t = new Date(); t.setHours(h, m, 0, 0);
    const ms = t - now;
    if (ms > 0 && ms < 24 * 3600 * 1000) reminderTimers.push(setTimeout(fn, ms));
  };

  const dow = new Date().getDay();
  at(r.workout, () => notify("Time to train 💪", `Today: ${DAYS[dow].title} — ${DAYS[dow].subtitle}`, "workout"));
  at(r.anchors, () => notify("Posture anchors 🧍", "Thoracic extension, chin tucks & a dead hang. Under 10 min.", "anchors"));
  at(r.protein, () => {
    const d = Store.day(); const left = Math.max(0, Store.profile.protein - d.protein);
    notify("Protein check-in 🥩", left > 0 ? `${left} g to go to hit ${Store.profile.protein} g.` : "Protein target hit — nice. 🎯", "protein");
  });

  if (r.water) {
    // nudge every 2h while the app stays open
    const loop = () => {
      const d = Store.day();
      if (d.water * Store.profile.glassMl < Store.profile.waterMl) notify("Hydrate 💧", "Time for a glass of water.", "water");
      reminderTimers.push(setTimeout(loop, 2 * 3600 * 1000));
    };
    reminderTimers.push(setTimeout(loop, 2 * 3600 * 1000));
  }
}

// =============================================================================
// Install / PWA helpers
// =============================================================================
function isStandalone() {
  return window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true;
}
async function doInstall() {
  if (!deferredInstall) return;
  deferredInstall.prompt();
  await deferredInstall.userChoice;
  deferredInstall = null;
  render();
}

// re-arm reminders when the app regains focus (covers next-day use)
document.addEventListener("visibilitychange", () => {
  if (document.hidden) return;
  scheduleReminders();
  if (swReg) swReg.update().catch(() => {}); // check for a new version on reopen
});
