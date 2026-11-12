// FSRS-4.5 spaced-repetition scheduler. Pure and deterministic — no I/O.
// Grades: 1 Again (forgot), 2 Hard, 3 Good, 4 Easy.
// Research basis: Free Spaced Repetition Scheduler, the open successor to SM-2 that
// models memory as stability (how long a memory lasts) and difficulty (how hard the item is).

export type Grade = 1 | 2 | 3 | 4
export type CardState = 'new' | 'learning' | 'review' | 'relearning'

export type Memory = {
  stability: number
  difficulty: number
  reps: number
  lapses: number
  state: CardState
  lastReview: Date | null
}

export type Scheduled = {
  stability: number
  difficulty: number
  reps: number
  lapses: number
  state: CardState
  dueAt: Date
  intervalDays: number
  elapsedDays: number
}

// FSRS-4.5 default weights (17). These are community-fitted defaults; per-user fitting
// is a future enhancement, but these generalise well for a fresh learner base.
const W = [
  0.4872, 1.4003, 3.7145, 13.8206, 5.1618, 1.2298, 0.8975, 0.031,
  1.6474, 0.1367, 1.0461, 2.1072, 0.0793, 0.3246, 1.587, 0.2272, 2.8755,
]
const DECAY = -0.5
const FACTOR = 19 / 81 // derived from DECAY so that R(S,S) = 0.9
const MIN_D = 1
const MAX_D = 10
const MIN_S = 0.01
const MAX_INTERVAL = 365 // cap a single interval at one year

const clampD = (d: number) => Math.min(MAX_D, Math.max(MIN_D, d))

/** Probability the item is still recallable after `elapsedDays`, given `stability`. */
export function retrievability(elapsedDays: number, stability: number): number {
  if (stability <= 0) return 0
  return Math.pow(1 + FACTOR * (elapsedDays / stability), DECAY)
}

/** Days until retrievability decays to `desiredRetention`. */
function intervalDays(stability: number, desiredRetention: number): number {
  const raw = (stability / FACTOR) * (Math.pow(desiredRetention, 1 / DECAY) - 1)
  return Math.min(MAX_INTERVAL, Math.max(1, Math.round(raw)))
}

const initDifficulty = (g: Grade) => clampD(W[4] - W[5] * (g - 3))
const initStability = (g: Grade) => Math.max(MIN_S, W[g - 1])

function nextDifficulty(d: number, g: Grade): number {
  const next = d - W[6] * (g - 3)
  // Mean-reversion toward the Easy-grade default keeps difficulty from drifting unbounded.
  const reverted = W[7] * initDifficulty(4) + (1 - W[7]) * next
  return clampD(reverted)
}

function nextStabilityRecall(d: number, s: number, r: number, g: Grade): number {
  const hard = g === 2 ? W[15] : 1
  const easy = g === 4 ? W[16] : 1
  const inc =
    Math.exp(W[8]) *
      (11 - d) *
      Math.pow(s, -W[9]) *
      (Math.exp(W[10] * (1 - r)) - 1) *
      hard *
      easy +
    1
  return s * inc
}

function nextStabilityForget(d: number, s: number, r: number): number {
  return W[11] * Math.pow(d, -W[12]) * (Math.pow(s + 1, W[13]) - 1) * Math.exp(W[14] * (1 - r))
}

/**
 * Advance a card's memory state given a grade. Returns the new state and when it is next due.
 * `now` is injected so callers (and tests) control the clock.
 */
export function schedule(mem: Memory, grade: Grade, now: Date, desiredRetention = 0.9): Scheduled {
  let { stability, difficulty, reps, lapses, state } = mem
  const elapsedDays = mem.lastReview
    ? Math.max(0, (now.getTime() - mem.lastReview.getTime()) / 86400000)
    : 0

  if (state === 'new' || reps === 0) {
    stability = initStability(grade)
    difficulty = initDifficulty(grade)
  } else {
    const r = retrievability(elapsedDays, stability)
    difficulty = nextDifficulty(difficulty, grade)
    if (grade === 1) {
      // A lapse can never raise stability above its pre-lapse value.
      stability = Math.min(nextStabilityForget(difficulty, stability, r), stability)
      lapses += 1
    } else {
      stability = nextStabilityRecall(difficulty, stability, r, grade)
    }
  }

  stability = Math.max(MIN_S, stability)
  reps += 1
  state = grade === 1 ? 'relearning' : 'review'
  const iv = intervalDays(stability, desiredRetention)
  const dueAt = new Date(now.getTime() + iv * 86400000)
  return { stability, difficulty, reps, lapses, state, dueAt, intervalDays: iv, elapsedDays }
}

/** Map an MCQ outcome to an FSRS grade. Wrong = Again; right = Good, or Easy if the learner flags it. */
export function gradeFromOutcome(correct: boolean, easy: boolean): Grade {
  if (!correct) return 1
  return easy ? 4 : 3
}
