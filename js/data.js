/*
 * FitPlan — program data
 * Built from your "Daily Full-Body Programme + Nutrition Plan (v2)".
 * Every YouTube id below was verified live & embeddable. To swap a video,
 * just change the `yt` id; the in-app "Search YouTube" link always works too.
 */

// ---- Exercise library -------------------------------------------------------
const EXERCISES = {
  // Strength
  goblet_squat: { name: "Goblet Squat", cat: "Legs", emoji: "🏋️", yt: "BR4tlEE_A98", q: "goblet squat dumbbell proper form",
    cues: ["Hold a dumbbell at chest height", "Chest up, neutral spine", "Push hips back, control the descent", "Knees track over toes"] },
  db_rdl: { name: "Dumbbell Romanian Deadlift", cat: "Posterior chain", emoji: "🍑", yt: "aa57T45iFSE", q: "dumbbell romanian deadlift form NASM",
    cues: ["Hinge at the hips, soft knees", "Flat back throughout", "Dumbbells skim the thighs", "Feel hamstrings & glutes stretch"] },
  chest_row: { name: "Chest-Supported Row (incline)", cat: "Back / posture", emoji: "🚣", yt: "kX4gtPQeyb8", q: "incline chest supported dumbbell row",
    cues: ["Lie chest-down on the incline bench", "Drive elbows behind the body", "Squeeze shoulder blades", "No spinal load — best posture builder"] },
  hip_thrust: { name: "Hip Thrust off the bench", cat: "Glutes", emoji: "🌉", yt: "29OfN4ztW_g", q: "dumbbell hip thrust how to",
    cues: ["Shoulders on the bench pad", "Dumbbell across hips (pad it)", "Drive through heels", "Squeeze glutes at the top — don't arch the back"] },
  clamshell: { name: "Clamshell (band)", cat: "Hips", emoji: "🐚", yt: "EG5_gXcfozw", q: "clamshell exercise band hips",
    cues: ["Side-lying, knees bent 45°, band above knees", "Keep feet together", "Open the top knee, hips stacked", "For the pelvic obliquity"] },
  pallof: { name: "Pallof Press (band)", cat: "Core", emoji: "🧱", yt: "dBAmQ9bx3JA", q: "pallof press band anti rotation",
    cues: ["Anchor band at chest height, stand side-on", "Brace, press straight out", "Resist the twist — don't rotate", "Ideal anti-rotation core for scoliosis"] },
  dead_bug: { name: "Dead Bug", cat: "Core", emoji: "🐞", yt: "zechBkcIMf0", q: "dead bug exercise core how to",
    cues: ["On your back, arms up, knees at 90°", "Lower opposite arm & leg slowly", "Keep lower back gently neutral", "Don't flatten hard"] },
  dead_hang: { name: "Dead Hang", cat: "Decompression", emoji: "🧗", yt: "3CEmHJXbNpc", q: "dead hang from bar how to",
    cues: ["Overhand grip, shoulder-width", "Let the spine decompress", "Relax & breathe", "Opens the upper back"] },
  assisted_pullup: { name: "Assisted Pull-up (band)", cat: "Back", emoji: "🆙", yt: "4yE-XGDWJPg", q: "band assisted pull up how to",
    cues: ["Loop a band over the bar, foot or knee in it", "Pull chest to bar, lead with elbows", "Control the lower", "Or do slow negatives"] },
  single_arm_row: { name: "Single-arm DB Row", cat: "Back", emoji: "💪", yt: "fURsHPHgssI", q: "single arm dumbbell row form",
    cues: ["Knee & hand on bench, flat back", "Drive elbow behind you", "Squeeze the shoulder blade", "Do your weaker side first"] },
  ytw: { name: "Prone Y-T-W Raise", cat: "Posture", emoji: "🔠", yt: "OFQduBFpDrY", q: "prone YTW raises incline bench",
    cues: ["Chest-down on the incline bench", "Raise into a Y, then T, then W", "Light or no weight", "The kyphosis fighter"] },
  face_pull: { name: "Face Pull (band)", cat: "Posture", emoji: "🎯", yt: "AlTGQrDOd98", q: "band face pull how to",
    cues: ["Anchor band at face height", "Pull to the eyes, elbows high", "Squeeze rear delts", "Direct antidote to desk slump"] },
  reverse_fly: { name: "Reverse Fly (chest-supported)", cat: "Posture", emoji: "🦋", yt: null, q: "chest supported reverse fly dumbbell incline",
    cues: ["Chest-down on the incline bench", "Light weight", "Arc the arms out wide", "Squeeze the shoulder blades together"] },
  db_bench: { name: "DB Bench Press", cat: "Push", emoji: "🛏️", yt: "pKZMNVbfUzQ", q: "dumbbell bench press proper form",
    cues: ["Shoulder blades pinched, feet planted", "Elbows ~45° from torso", "Lower under control, full range", "Press up & slightly together"] },
  db_floor_press: { name: "DB Floor Press", cat: "Push", emoji: "🧎", yt: null, q: "dumbbell floor press form",
    cues: ["Lie on the floor, knees bent", "Upper arms rest lightly on the floor each rep", "Press up", "Shoulder-friendly pressing"] },
  reverse_lunge: { name: "Reverse Lunge (DB)", cat: "Legs", emoji: "🦵", yt: "MpfeGnBFEo8", q: "dumbbell reverse lunge form",
    cues: ["Step back, lower under control", "Front knee over ankle", "Drive through the front heel", "Progress to rear-foot-elevated when ready"] },
  shoulder_press: { name: "Seated DB Shoulder Press", cat: "Push", emoji: "🙆", yt: "fuQpuu--bMI", q: "seated dumbbell shoulder press form",
    cues: ["Bench upright, ribs down", "Don't over-arch the lower back", "Press overhead, control down", "If it pinches, switch to high-incline press"] },
  back_extension: { name: "Back Extension (bench)", cat: "Posterior chain", emoji: "🔙", yt: "wxS0a9Bmh8A", q: "back extension adjustable bench how to",
    cues: ["Hips on the pad, use the leg rollers", "Raise only to a flat, neutral spine", "Do not hyperextend", "Squeeze glutes at the top"] },
  lateral_walk: { name: "Banded Lateral Walk", cat: "Hips", emoji: "🦀", yt: "x8DFUsLq8t8", q: "banded lateral walk glute",
    cues: ["Band above knees or ankles", "Soft squat, chest up", "Small steps, feet stay wide", "Hips level — pelvic levelling"] },
  glute_bridge: { name: "Glute Bridge", cat: "Glutes", emoji: "🌉", yt: "wPM8icPu6H8", q: "glute bridge how to form",
    cues: ["On your back, feet hip-width", "Drive through heels", "Squeeze glutes, ribs down", "Straight line chin-to-knee"] },
  bodyweight_squat: { name: "Bodyweight Squat", cat: "Legs", emoji: "⬇️", yt: null, q: "bodyweight squat proper form",
    cues: ["Feet shoulder-width", "Sit back & down", "Chest up, knees track toes", "Stand tall, squeeze glutes"] },
  pushup: { name: "Push-up", cat: "Push", emoji: "🤸", yt: "WDIpL0pjun0", q: "push up proper form NASM",
    cues: ["Hands under shoulders, body one line", "Brace abs & glutes", "Lower to ~90° elbows", "Elbows tuck like an arrow, not a T"] },
  woodchop: { name: "Band Woodchop", cat: "Core", emoji: "🪓", yt: null, q: "band woodchop core controlled",
    cues: ["Anchor band, rotate from the hips", "Controlled, limited range", "Brace the core", "No ballistic twisting"] },

  // Anchors / mobility / stretches
  thoracic_ext: { name: "Thoracic Extension over bench", cat: "Mobility", emoji: "🧘", yt: "9Y11Kc0E0og", q: "thoracic extension over bench foam roller",
    cues: ["Upper back on the bench edge at blade height", "Hands behind head", "Gently arch the upper back over the edge", "Directly counters the 66° kyphosis"] },
  chin_tuck: { name: "Chin Tucks", cat: "Neck / posture", emoji: "🙂", yt: "qtcBiYF7yuQ", q: "chin tuck forward head posture exercise",
    cues: ["Draw the head straight back into a double chin", "Eyes stay level", "Hold ~3 seconds", "Rebuilds deep neck muscles for forward head"] },
  band_pull_apart: { name: "Band Pull-aparts", cat: "Posture", emoji: "🎗️", yt: "smSSXITNpCI", q: "band pull apart exercise how to",
    cues: ["Arms straight out front, hold the band", "Pull apart to shoulder line", "Squeeze between the blades", "Do 20 anytime you pass the bands"] },
  cat_cow: { name: "Cat-Cow", cat: "Mobility", emoji: "🐈", yt: "xyNwxiuERXc", q: "cat cow stretch spinal mobility",
    cues: ["On all fours, hands under shoulders", "Round up, then arch & lift the chest", "Slow & controlled", "Move with the breath"] },
  doorway_pec: { name: "Doorway Pec Stretch", cat: "Stretch", emoji: "🚪", yt: "CEQMx4zFwYs", q: "doorway pec chest stretch how to",
    cues: ["Forearms on the door frame, elbows ~90°", "Step one foot through", "Feel the stretch across the chest", "Hold 30s, breathe"] },
  lat_stretch: { name: "Lat Stretch", cat: "Stretch", emoji: "🙆", yt: null, q: "lat stretch overhead how to",
    cues: ["Hold a rack or door frame", "Sit the hips back & away", "Feel the side of the back open", "Hold 30s each side"] },
  hip_flexor: { name: "Hip Flexor Stretch", cat: "Stretch", emoji: "🧎", yt: "Q4Ko275cluo", q: "kneeling hip flexor stretch how to",
    cues: ["Half-kneel, back knee down", "Tuck the pelvis under", "Push hips gently forward", "Squeeze the back glute, hold 30s"] },
  hip_9090: { name: "90/90 Hip Rotations", cat: "Mobility", emoji: "🔄", yt: "my9k2fPvVrI", q: "90 90 hip rotation mobility",
    cues: ["Sit with both knees at 90°", "Rotate knees side to side", "Stay tall through the spine", "Move slowly with control"] },
  side_plank: { name: "Side Plank", cat: "Core", emoji: "📐", yt: "iNbH7_edNI8", q: "side plank proper form",
    cues: ["Elbow under shoulder", "Body in one straight line", "Lift the hips, brace the core", "LEFT side first, hold a touch longer"] },
  bird_dog: { name: "Bird Dog", cat: "Core", emoji: "🐦", yt: "ZdAHe9_HeEw", q: "bird dog exercise NASM form",
    cues: ["All fours, neutral spine", "Extend opposite arm & leg", "No rotation through the spine", "Pause, then switch"] },
  plank: { name: "Plank", cat: "Core", emoji: "🟰", yt: "mH5Sfb_KTGg", q: "forearm plank proper form",
    cues: ["Elbows under shoulders", "Body one long line", "Brace abs & glutes", "Hips don't sag or pike"] },
  breathing: { name: "Diaphragmatic Breathing", cat: "Recovery", emoji: "🌬️", yt: "vUXOfpJVJJM", q: "diaphragmatic belly breathing how to",
    cues: ["Hand on belly, breathe into it", "Chest stays quiet", "Slow exhale through pursed lips", "5 minutes — great for stress & the ribcage"] },

  // Cardio / non-exercise blocks (no demo needed)
  zone2: { name: "Zone 2 Cardio", cat: "Cardio", emoji: "🚶", yt: null, q: "zone 2 cardio walking fat loss",
    cues: ["Brisk or incline walk", "A pace where you can still hold a conversation", "30–40 minutes", "Fat loss & heart health, low joint stress"] },
  walk: { name: "Walk", cat: "Cardio", emoji: "🚶‍♂️", yt: null, q: "",
    cues: ["Easy outdoor walk", "Relaxed pace", "Bonus daily steps"] },
};

// ---- Daily anchors (every day, < 10 min total) ------------------------------
const DAILY_ANCHORS = [
  { ex: "thoracic_ext", sets: "2 × 8", note: "Counters the 66° kyphosis" },
  { ex: "chin_tuck", sets: "2 × 10, hold 3s", note: "Fixes forward head" },
  { ex: "dead_hang", sets: "3 × 15–30s", note: "Decompress the spine" },
  { ex: "band_pull_apart", sets: "20 reps", note: "Any time you pass the bands" },
];

// ---- Warm-up (before every strength day) ------------------------------------
const WARMUP = [
  { ex: "dead_hang", sets: "2 × 15–20s" },
  { ex: "band_pull_apart", sets: "2 × 15" },
  { ex: "lateral_walk", sets: "2 × 10 each way" },
  { ex: "glute_bridge", sets: "1 × 15" },
  { ex: "bodyweight_squat", sets: "1 × 10" },
  { ex: "face_pull", sets: "1 × 15" },
  { ex: "cat_cow", sets: "8 reps" },
];

// ---- Weekly schedule. JS getDay(): 0=Sun .. 6=Sat ---------------------------
// Each block: ex id, sets string, optional note, log:true => track sets/reps/weight
const DAYS = {
  1: { // Monday
    id: "A", title: "Full Body A", subtitle: "Lower + posterior chain", type: "strength", warmup: true,
    blocks: [
      { ex: "goblet_squat", sets: "3 × 10–12", log: true },
      { ex: "db_rdl", sets: "3 × 10", log: true },
      { ex: "chest_row", sets: "3 × 12", log: true, note: "Best posture builder, no spinal load" },
      { ex: "hip_thrust", sets: "3 × 12", log: true },
      { ex: "clamshell", sets: "2 × 15 each side", log: true, note: "For the pelvic obliquity" },
      { ex: "pallof", sets: "3 × 10 each side", log: true },
      { ex: "dead_bug", sets: "2 × 10 each side" },
      { ex: "dead_hang", sets: "2 × 20s", note: "Finisher" },
    ],
  },
  2: { // Tuesday
    id: "B", title: "Full Body B", subtitle: "Pull + posture", type: "strength", warmup: true,
    blocks: [
      { ex: "assisted_pullup", sets: "3 × 6–8", log: true },
      { ex: "single_arm_row", sets: "3 × 10 each", log: true, note: "Weaker side first" },
      { ex: "ytw", sets: "3 × 8 each letter", log: true, note: "The kyphosis fighter" },
      { ex: "face_pull", sets: "3 × 15", log: true },
      { ex: "reverse_fly", sets: "3 × 12", log: true },
      { ex: "side_plank", sets: "Left first, +10s vs right", log: true, note: "Trunk sits right (17mm) — favour LEFT" },
      { ex: "bird_dog", sets: "2 × 8 each side" },
      { ex: "doorway_pec", sets: "2 × 20s", note: "With a finishing dead hang" },
    ],
  },
  3: { // Wednesday
    id: "Mob", title: "Mobility + Zone 2 + Core", subtitle: "Active recovery", type: "mobility", warmup: false,
    blocks: [
      { ex: "zone2", sets: "30–40 min", log: true, note: "Conversational pace" },
      { ex: "thoracic_ext", sets: "2 × 10" },
      { ex: "doorway_pec", sets: "2 × 30s" },
      { ex: "lat_stretch", sets: "2 × 30s each" },
      { ex: "hip_flexor", sets: "2 × 30s each" },
      { ex: "hip_9090", sets: "Easy reps" },
      { ex: "cat_cow", sets: "10 reps" },
      { ex: "dead_bug", sets: "3 × 10 each" },
      { ex: "pallof", sets: "3 × 10 each" },
      { ex: "side_plank", sets: "2 × 30s each (left first)" },
      { ex: "chin_tuck", sets: "2 × 10" },
      { ex: "dead_hang", sets: "3 × 20–30s" },
    ],
  },
  4: { // Thursday
    id: "C", title: "Full Body C", subtitle: "Push + legs", type: "strength", warmup: true,
    blocks: [
      { ex: "db_bench", sets: "3 × 10", log: true, note: "Or floor press" },
      { ex: "reverse_lunge", sets: "3 × 10 each", log: true },
      { ex: "shoulder_press", sets: "3 × 8–10", log: true, note: "If it pinches, high-incline press" },
      { ex: "back_extension", sets: "3 × 12", log: true, note: "Only to flat neutral — don't hyperextend" },
      { ex: "lateral_walk", sets: "2 × 12 each way", log: true },
      { ex: "pallof", sets: "3 × 10 each side", log: true },
      { ex: "plank", sets: "2 × 20–40s" },
      { ex: "hip_flexor", sets: "2 × 20s", note: "With a finishing dead hang" },
    ],
  },
  5: { // Friday
    id: "D", title: "Full Body D", subtitle: "Balanced", type: "strength", warmup: true,
    blocks: [
      { ex: "goblet_squat", sets: "3 × 12", log: true },
      { ex: "chest_row", sets: "3 × 12", log: true },
      { ex: "db_floor_press", sets: "3 × 10", log: true },
      { ex: "db_rdl", sets: "3 × 10", log: true },
      { ex: "ytw", sets: "2 × 8 each letter", log: true, note: "Kyphosis work" },
      { ex: "face_pull", sets: "3 × 15", log: true },
      { ex: "side_plank", sets: "2 × 25s each (left first)", log: true },
      { ex: "dead_hang", sets: "2 × 20s" },
    ],
  },
  6: { // Saturday
    id: "Cond", title: "Conditioning Circuit + Core", subtitle: "3–4 rounds · 40s work / 20s rest", type: "conditioning", warmup: true,
    blocks: [
      { ex: "goblet_squat", sets: "40s" },
      { ex: "single_arm_row", sets: "40s", note: "DB or band row" },
      { ex: "reverse_lunge", sets: "40s alternating" },
      { ex: "pushup", sets: "40s", note: "Or DB floor press" },
      { ex: "woodchop", sets: "40s", note: "Or Pallof" },
      { ex: "dead_bug", sets: "40s" },
      { ex: "walk", sets: "10 min easy", note: "Finish — elevated HR, low joint load" },
    ],
  },
  0: { // Sunday
    id: "Rec", title: "Posture, Mobility + Long Walk", subtitle: "Recovery", type: "mobility", warmup: false,
    blocks: [
      { ex: "walk", sets: "45–60 min", log: true, note: "Outdoors if possible" },
      { ex: "thoracic_ext", sets: "2 × 10", note: "Extra time here" },
      { ex: "doorway_pec", sets: "2 × 30s", note: "Extra time here" },
      { ex: "lat_stretch", sets: "2 × 30s each" },
      { ex: "hip_flexor", sets: "2 × 30s each" },
      { ex: "hip_9090", sets: "Easy reps" },
      { ex: "cat_cow", sets: "10 reps" },
      { ex: "breathing", sets: "5 min", note: "Schroth rotational breathing if taught" },
      { ex: "chin_tuck", sets: "2 × 10" },
      { ex: "dead_hang", sets: "3 × 20–30s" },
    ],
  },
};

const WEEKDAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

// ---- Nutrition ---------------------------------------------------------------
const NUTRITION = {
  rules: [
    { icon: "🥩", title: "Protein 150–170 g/day", text: "Protects muscle while you lose fat. Spread across meals (~35–45 g each). 140 g is fine on low-appetite days. A shake is the easy way to top up." },
    { icon: "🥗", title: "Half your plate vegetables", text: "At lunch and dinner." },
    { icon: "🍚", title: "Smart carbs, sized to training", text: "Oats, rice, potatoes, legumes, fruit. More on strength days, less on rest days." },
    { icon: "🥑", title: "Healthy fats in moderation", text: "Olive oil, nuts, avocado, oily fish twice a week." },
    { icon: "💧", title: "Hydrate 2.5–3 L/day", text: "Also blunts nausea & constipation common on GLP-class drugs." },
    { icon: "🚫", title: "Minimise the junk", text: "Ultra-processed food, added sugar, and liquid calories." },
    { icon: "📉", title: "Lose 0.5–0.75 kg/week", text: "Slow loss with high protein + training keeps it as fat, not muscle. The plate method, protein target and steps do the work." },
  ],
  plate: "Half the plate vegetables · a quarter protein · a quarter smart carbs · plus a thumb of healthy fat.",
  sampleDay: [
    { meal: "Breakfast", text: "Greek yoghurt with berries, oats & a few nuts. Or eggs with veg & wholegrain toast." },
    { meal: "Lunch", text: "Large salad/veg with grilled chicken, fish or tofu, plus quinoa or potatoes & olive oil." },
    { meal: "Snack", text: "Protein shake or cottage cheese with fruit. Easy protein when appetite is low." },
    { meal: "Dinner", text: "Lean protein with plenty of veg and a small portion of rice or legumes." },
    { meal: "Around training", text: "Get protein within a couple of hours. A shake is fine." },
  ],
  // quick-add protein presets (grams)
  proteinPresets: [
    { name: "Whey / plant shake", g: 25 }, { name: "Greek yoghurt (170g)", g: 17 },
    { name: "Chicken breast (150g)", g: 45 }, { name: "Eggs (×3)", g: 18 },
    { name: "Tin of tuna", g: 25 }, { name: "Cottage cheese (200g)", g: 22 },
    { name: "Tofu (150g)", g: 18 }, { name: "Lentils (1 cup)", g: 18 },
  ],
};

// ---- Achievements / badges ---------------------------------------------------
// type-driven; evaluated in store.js
const BADGES = [
  { id: "first_session", emoji: "🎉", name: "First Rep", desc: "Complete your first session" },
  { id: "streak3", emoji: "🔥", name: "On a Roll", desc: "3-day activity streak" },
  { id: "streak7", emoji: "⚡", name: "Full Week", desc: "7-day activity streak" },
  { id: "streak30", emoji: "🏆", name: "Unstoppable", desc: "30-day activity streak" },
  { id: "sessions10", emoji: "💪", name: "Committed", desc: "10 workouts logged" },
  { id: "sessions25", emoji: "🦾", name: "Iron Habit", desc: "25 workouts logged" },
  { id: "hydration7", emoji: "🌊", name: "Well Watered", desc: "Hit your water target 7 days" },
  { id: "protein7", emoji: "🥩", name: "Protein Pro", desc: "Hit your protein target 7 days" },
  { id: "steps10", emoji: "👟", name: "Step Master", desc: "10k+ steps in a day" },
  { id: "posture50", emoji: "🧍", name: "Tall & Proud", desc: "50 posture-anchor days" },
  { id: "level5", emoji: "⭐", name: "Rising Star", desc: "Reach level 5" },
  { id: "weightlog", emoji: "⚖️", name: "Tracking Trends", desc: "Log your weight 5 times" },
];

// XP awards
const XP = { session: 100, anchorDay: 30, exerciseSet: 5, waterTarget: 25, proteinTarget: 25, stepsTarget: 25, weightLog: 10, cardio: 60, mobility: 60 };

const DEFAULT_TARGETS = { protein: 160, waterMl: 2750, steps: 9000, glassMl: 250 };
