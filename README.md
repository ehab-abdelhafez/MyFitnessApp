# FitPlan 🏋️

Your personal, installable fitness app — built from your **Daily Full-Body Programme + Nutrition Plan (v2)** (DIERS-tailored for thoracic kyphosis, forward head, and a mild lateral curve).

It's a **Progressive Web App (PWA)**: it installs straight onto your Samsung Fold7 home screen (no Play Store, no sideloading), runs **offline**, and keeps all your data **privately on your device**.

---

## ✨ What's inside

- **Today** — the right session for each weekday (your Mon–Sun split), a warm-up, the full workout, and the daily posture anchors. A **date picker** (◀ ▶ or tap the date) lets you log or edit any past day you missed.
- **Workout tracking** — log sets / reps / weight per exercise; everything is saved automatically.
- **Exercise demos** — tap **▶** on any movement for an in-app YouTube demo + form cues. Photos are illustrative emoji glyphs; every video link also opens in YouTube as a fallback.
- **Nutrition** — protein logging against your 150–170 g target with quick-add presets, plus the plate method and sample day for reference.
- **Hydration** — tap-to-fill glasses tracking 2.5–3 L/day.
- **Body weight** — log it and watch the trend chart move toward your goal.
- **Progress** — streaks, level/XP, a 12-week consistency heatmap, 7-day protein/water bars, and a weight trend.
- **Gamification** — XP, levels, day-streaks and 12 unlockable achievement badges.
- **Reminders** — local notifications for your workout, posture anchors, protein check-in, and water nudges.

---

## 📲 Install it on your Samsung Fold7

You need to put these files online once (free). The easiest way is **GitHub Pages**:

1. Push this repo to GitHub (this branch is already set up).
2. On GitHub: **Settings → Pages → Build and deployment → Source: Deploy from a branch**.
3. Pick this branch (`claude/fitness-app-tracking-e6mers`) and folder **`/ (root)`**, then **Save**.
4. After a minute GitHub gives you a URL like `https://<your-username>.github.io/myfitnessapp/`.
5. Open that URL in **Chrome** (or Samsung Internet) on your phone.
6. Tap the browser menu **⋮ → Add to Home screen** (or accept the in-app **Install** banner).
7. Open **FitPlan** from your home screen — it runs full-screen like a native app.

> 💡 Notifications: when you first enable reminders the browser will ask permission — tap **Allow**. Reminders fire while the app is open or recently used, so keeping it on your home screen works best.

### Run it locally (optional)
Any static server works, e.g.:
```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```
(A service worker — needed for offline + install — requires `https://` or `localhost`, not opening the file directly.)

---

## 🔒 Privacy & data

All progress lives in your browser's local storage on **your device only** — nothing is uploaded anywhere. Use **Settings → Export backup** to save a copy before clearing browser data or switching phones, and **Import** to restore it.

## 🛠️ Customising

- **Swap a demo video:** edit the `yt` id (or `q` search query) for an exercise in `js/data.js`.
- **Change the program/targets:** the weekly split lives in `DAYS` in `js/data.js`; default targets in `Settings`.
- **Regenerate the app icons:** `python3 scripts/make_icons.py`.

---

## ⚠️ Safety note (from your plan)

This app is a training aid, **not medical advice**. Per your plan:

- Confirm the **66° kyphosis** read and the **left-side-plank bias** with a physio (ideally Schroth-trained).
- Avoid heavy end-range spinal rounding under load and ballistic twisting.
- **Stop and see a doctor** for any radiating/nerve pain, numbness, tingling, or new/worsening pain.
