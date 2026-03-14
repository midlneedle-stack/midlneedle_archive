const SCREEN_WIDTH = 144
const SCREEN_HEIGHT = 168
const CELL_SIZE = 6

const DIGIT_WIDTH = 4
const DIGIT_HEIGHT = 9
const DIGIT_COLON_WIDTH = 2
const DIGIT_COUNT = 4
const DIGIT_GAP = 1
const TOTAL_GLYPHS = DIGIT_COUNT + 1
const DIGIT_SPAN_COLS =
  DIGIT_WIDTH * DIGIT_COUNT +
  DIGIT_COLON_WIDTH +
  DIGIT_GAP * (TOTAL_GLYPHS - 1)

const BG_FRAME_MS = 16
const BG_BASE_CELL_ANIM_MS = 1300
const BG_BASE_CELL_STAGGER_MIN_MS = 0
const BG_BASE_CELL_STAGGER_MAX_MS = 420
const BG_BASE_ACTIVATION_DURATION_MS = 520
const BG_ACTIVE_PERCENT = 18
const BG_BASE_INTRO_DELAY_MS = 120

const REFERENCE_COLS = 25
const REFERENCE_ROWS = 28

const DIGIT_COMPACT_THRESHOLD = 0.15
const DIGIT_FULL_THRESHOLD = 0.45
const TRAIL_FADE_MS = 640
const GRID_COLS = Math.max(DIGIT_SPAN_COLS, Math.floor(SCREEN_WIDTH / CELL_SIZE))
const GRID_ROWS = Math.max(DIGIT_HEIGHT, Math.floor(SCREEN_HEIGHT / CELL_SIZE))

const COLORS = {
  backgroundFill: "#000000",
  gridStroke: "#555555",
  digitStroke: "#ffffff",
  stage0: "#555555",
  stage1: "#aaaaaa",
  stage2: "#ffffff",
} as const

type Layout = {
  gridCols: number
  gridRows: number
  digitStartCol: number
  digitStartRow: number
}

type Glyph = {
  width: number
  rows: number[]
  pins: number[]
}

type BackgroundCellState = {
  elapsedMs: number
  startDelayMs: number
  complete: boolean
  active: boolean
  isDigit: boolean
}

type BackgroundTiming = {
  cellAnimMs: number
  cellStaggerMinMs: number
  cellStaggerMaxMs: number
  activationDurationMs: number
  introDelayMs: number
}

type BackgroundState = {
  cells: BackgroundCellState[]
  animationComplete: boolean
  introComplete: boolean
  introElapsedMs: number
  activationWindowMs: number
  activationRatio: number
  animationEnabled: boolean
  timing: BackgroundTiming
}

type DigitState = {
  digits: number[]
  revealComplete: boolean
  cellLevel: number[][][]
}

type EngineState = {
  started: boolean
  destroyed: boolean
  background: BackgroundState | null
  digits: DigitState
  trailStartedAt: number[]
  lastTrailCell: { col: number; row: number } | null
  pendingTime: Date | null
  rafId: number | null
  minuteTimeoutId: number | null
  lastFrameTime: number | null
  accumulator: number
  visibleCtx: CanvasRenderingContext2D
}

const GLYPHS: Glyph[] = [
  {
    width: DIGIT_WIDTH,
    rows: [0x0f, 0x09, 0x09, 0x09, 0x09, 0x09, 0x09, 0x09, 0x0f],
    pins: [0x09, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x09],
  },
  {
    width: DIGIT_WIDTH,
    rows: [0x02, 0x02, 0x0e, 0x02, 0x02, 0x02, 0x02, 0x02, 0x0f],
    pins: [0x00, 0x00, 0x02, 0x00, 0x00, 0x00, 0x00, 0x00, 0x02],
  },
  {
    width: DIGIT_WIDTH,
    rows: [0x0f, 0x01, 0x01, 0x01, 0x0f, 0x08, 0x08, 0x08, 0x0f],
    pins: [0x01, 0x00, 0x00, 0x00, 0x09, 0x00, 0x00, 0x00, 0x08],
  },
  {
    width: DIGIT_WIDTH,
    rows: [0x0f, 0x01, 0x01, 0x01, 0x0f, 0x01, 0x01, 0x01, 0x0f],
    pins: [0x01, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01],
  },
  {
    width: DIGIT_WIDTH,
    rows: [0x09, 0x09, 0x09, 0x09, 0x0f, 0x01, 0x01, 0x01, 0x01],
    pins: [0x00, 0x00, 0x00, 0x00, 0x09, 0x00, 0x00, 0x00, 0x00],
  },
  {
    width: DIGIT_WIDTH,
    rows: [0x0f, 0x08, 0x08, 0x08, 0x0f, 0x01, 0x01, 0x01, 0x0f],
    pins: [0x08, 0x00, 0x00, 0x00, 0x09, 0x00, 0x00, 0x00, 0x01],
  },
  {
    width: DIGIT_WIDTH,
    rows: [0x0f, 0x08, 0x08, 0x08, 0x0f, 0x09, 0x09, 0x09, 0x0f],
    pins: [0x08, 0x00, 0x00, 0x00, 0x09, 0x00, 0x00, 0x00, 0x09],
  },
  {
    width: DIGIT_WIDTH,
    rows: [0x0f, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01],
    pins: [0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00],
  },
  {
    width: DIGIT_WIDTH,
    rows: [0x0f, 0x09, 0x09, 0x09, 0x0f, 0x09, 0x09, 0x09, 0x0f],
    pins: [0x09, 0x00, 0x00, 0x00, 0x09, 0x00, 0x00, 0x00, 0x09],
  },
  {
    width: DIGIT_WIDTH,
    rows: [0x0f, 0x09, 0x09, 0x09, 0x0f, 0x01, 0x01, 0x01, 0x0f],
    pins: [0x09, 0x00, 0x00, 0x00, 0x09, 0x00, 0x00, 0x00, 0x01],
  },
  {
    width: DIGIT_COLON_WIDTH,
    rows: [0x00, 0x00, 0x03, 0x03, 0x00, 0x03, 0x03, 0x00, 0x00],
    pins: [0x00, 0x00, 0x02, 0x01, 0x00, 0x01, 0x02, 0x00, 0x00],
  },
] as const

const LAYOUT = {
  gridCols: GRID_COLS,
  gridRows: GRID_ROWS,
  digitStartCol: Math.floor((GRID_COLS - DIGIT_SPAN_COLS) / 2),
  digitStartRow: Math.round((GRID_ROWS - DIGIT_HEIGHT) / 2),
} satisfies Layout

export interface PebbleWatchfaceEngine {
  resize: () => void
  start: () => void
  restart: () => void
  setPointer: (x: number, y: number) => void
  clearPointer: () => void
  destroy: () => void
}

function createDigitState(): DigitState {
  return {
    digits: [-1, -1, -1, -1],
    revealComplete: false,
    cellLevel: createCellLevels(),
  }
}

function createCellLevels() {
  return Array.from({ length: TOTAL_GLYPHS }, () =>
    Array.from({ length: DIGIT_HEIGHT }, () =>
      Array.from({ length: DIGIT_WIDTH }, () => -1)
    )
  )
}

function createBackgroundState(): BackgroundState {
  const timing = configureTiming(LAYOUT)
  const cells: BackgroundCellState[] = []

  for (let row = 0; row < LAYOUT.gridRows; row += 1) {
    for (let col = 0; col < LAYOUT.gridCols; col += 1) {
      const isDigit = cellIsDigit(col, row, LAYOUT)
      const active = isDigit || Math.random() * 100 < activePercent(col, row)
      cells.push(
        active
          ? {
              elapsedMs: 0,
              startDelayMs: randomRange(
                timing.cellStaggerMinMs,
                timing.cellStaggerMaxMs
              ),
              complete: false,
              active: true,
              isDigit,
            }
          : {
              elapsedMs: 0,
              startDelayMs: 0,
              complete: true,
              active: false,
              isDigit,
            }
      )
    }
  }

  return {
    cells,
    animationComplete: false,
    introComplete: false,
    introElapsedMs: 0,
    activationWindowMs: timing.cellStaggerMinMs,
    activationRatio: 0,
    animationEnabled: true,
    timing,
  }
}

function configureTiming(layout: Layout): BackgroundTiming {
  const referenceCells = REFERENCE_COLS * REFERENCE_ROWS
  const currentCells = layout.gridCols * layout.gridRows
  const scale =
    referenceCells > 0 && currentCells > 0 ? referenceCells / currentCells : 1

  return {
    cellAnimMs: scaledDuration(scale, BG_BASE_CELL_ANIM_MS),
    cellStaggerMinMs: scaledDuration(scale, BG_BASE_CELL_STAGGER_MIN_MS),
    cellStaggerMaxMs: scaledDuration(scale, BG_BASE_CELL_STAGGER_MAX_MS),
    activationDurationMs: scaledDuration(scale, BG_BASE_ACTIVATION_DURATION_MS),
    introDelayMs: scaledDuration(scale, BG_BASE_INTRO_DELAY_MS),
  }
}

function scaledDuration(scale: number, base: number) {
  if (base === 0) {
    return 0
  }
  return Math.max(1, Math.round(base * scale))
}

function activePercent(cellCol: number, cellRow: number) {
  return Math.min(
    100,
    BG_ACTIVE_PERCENT + Math.floor(cellBias(cellCol, cellRow, LAYOUT) * 32)
  )
}

function cellBias(cellCol: number, cellRow: number, layout: Layout) {
  const colCenter = layout.digitStartCol + (DIGIT_SPAN_COLS - 1) / 2
  const rowCenter = layout.digitStartRow + (DIGIT_HEIGHT - 1) / 2
  const colHalfSpan = DIGIT_SPAN_COLS / 2
  const rowHalfSpan = DIGIT_HEIGHT / 2

  const colDist = Math.abs(cellCol - colCenter) / (colHalfSpan + 1)
  const rowDist = Math.abs(cellRow - rowCenter) / (rowHalfSpan + 1)

  let bias = 0
  if (colDist < 1) {
    bias += 1 - colDist
  }
  if (rowDist < 1) {
    bias += (1 - rowDist) * 0.8
  }

  return clamp01(bias / 1.8)
}

function cellIsDigit(cellCol: number, cellRow: number, layout: Layout) {
  const relRow = cellRow - layout.digitStartRow
  if (relRow < 0 || relRow >= DIGIT_HEIGHT) {
    return false
  }

  let slotCol = layout.digitStartCol
  for (let slot = 0; slot < TOTAL_GLYPHS; slot += 1) {
    const isColon = slot === 2
    const width = isColon ? DIGIT_COLON_WIDTH : DIGIT_WIDTH
    if (cellCol >= slotCol && cellCol < slotCol + width) {
      const relCol = cellCol - slotCol
      if (isColon) {
        const glyph = GLYPHS[10]
        return (glyph.rows[relRow] & (1 << (glyph.width - 1 - relCol))) !== 0
      }

      const bit = 1 << (DIGIT_WIDTH - 1 - relCol)
      for (let glyphIndex = 0; glyphIndex <= 9; glyphIndex += 1) {
        if ((GLYPHS[glyphIndex].rows[relRow] & bit) !== 0) {
          return true
        }
      }
      return false
    }

    slotCol += width
    if (slot < TOTAL_GLYPHS - 1) {
      slotCol += DIGIT_GAP
    }
  }

  return false
}

function randomRange(minInclusive: number, maxInclusive: number) {
  if (maxInclusive <= minInclusive) {
    return minInclusive
  }
  return minInclusive + Math.floor(Math.random() * (maxInclusive - minInclusive + 1))
}

function ease(value: number) {
  const clamped = clamp01(value)
  const inverse = 1 - clamped
  return 1 - inverse * inverse * inverse
}

function clamp01(value: number) {
  if (value < 0) {
    return 0
  }
  if (value > 1) {
    return 1
  }
  return value
}

function cellIndex(col: number, row: number) {
  return row * LAYOUT.gridCols + col
}

function cellCoordinates(index: number) {
  return {
    col: index % LAYOUT.gridCols,
    row: Math.floor(index / LAYOUT.gridCols),
  }
}

function backgroundProgressForCell(state: BackgroundState, col: number, row: number) {
  if (col < 0 || col >= LAYOUT.gridCols || row < 0 || row >= LAYOUT.gridRows) {
    return null
  }

  return backgroundProgressValue(state, state.cells[cellIndex(col, row)])
}

function backgroundProgressValue(
  state: BackgroundState,
  cell: BackgroundCellState
) {
  if (!state.introComplete || cell.startDelayMs > state.activationWindowMs) {
    return null
  }
  if (!cell.active) {
    return null
  }

  let local = cell.elapsedMs - cell.startDelayMs
  if (local <= 0 && !cell.complete) {
    return null
  }
  if (local < 0) {
    local = 0
  }

  local = Math.min(local, state.timing.cellAnimMs)
  return ease(local / state.timing.cellAnimMs)
}

function isDormantTrailCell(background: BackgroundState, col: number, row: number) {
  const cell = background.cells[cellIndex(col, row)]
  if (cell.isDigit) {
    return false
  }

  const progress = backgroundProgressValue(background, cell)
  if (progress === null) {
    return true
  }

  return shapeLevelForProgress(progress) <= 0 && colorForProgress(progress, false) === COLORS.stage0
}

function shapeLevelForProgress(progress: number) {
  if (progress <= 0) {
    return -1
  }
  if (progress < 0.28) {
    return 2
  }
  if (progress < 0.6) {
    return 1
  }
  if (progress < 0.92) {
    return 0
  }
  return -1
}

function colorForProgress(progress: number, isDigit: boolean) {
  const clamped = clamp01(progress)

  if (isDigit) {
    if (clamped < 1 / 3) {
      return COLORS.stage0
    }
    if (clamped < 2 / 3) {
      return COLORS.stage1
    }
    return COLORS.stage2
  }

  if (clamped < 0.5) {
    const phase = clamped / 0.5
    if (phase < 1 / 3) {
      return COLORS.stage0
    }
    if (phase < 2 / 3) {
      return COLORS.stage1
    }
    return COLORS.stage2
  }

  const phase = (clamped - 0.5) / 0.5
  if (phase < 1 / 3) {
    return COLORS.stage2
  }
  if (phase < 2 / 3) {
    return COLORS.stage1
  }
  return COLORS.stage0
}

function stepBackground(state: BackgroundState) {
  if (!state.animationEnabled || state.animationComplete) {
    return state.animationComplete
  }

  if (!state.introComplete) {
    state.introElapsedMs += BG_FRAME_MS
    if (state.introElapsedMs >= state.timing.introDelayMs) {
      state.introComplete = true
      state.activationWindowMs = state.timing.cellStaggerMinMs
    }
    return false
  }

  if (state.activationRatio < 1 && state.timing.activationDurationMs > 0) {
    state.activationRatio = Math.min(
      1,
      state.activationRatio + BG_FRAME_MS / state.timing.activationDurationMs
    )
    const span = state.timing.cellStaggerMaxMs - state.timing.cellStaggerMinMs
    state.activationWindowMs =
      state.timing.cellStaggerMinMs + Math.floor(span * ease(state.activationRatio))
  }

  let allComplete = true

  for (const cell of state.cells) {
    if (!cell.active) {
      continue
    }
    if (cell.startDelayMs > state.activationWindowMs) {
      allComplete = false
      continue
    }

    const maxElapsed = cell.startDelayMs + state.timing.cellAnimMs
    if (cell.complete && cell.elapsedMs >= maxElapsed) {
      continue
    }

    allComplete = false
    cell.elapsedMs += BG_FRAME_MS
    if (cell.elapsedMs >= maxElapsed) {
      cell.elapsedMs = maxElapsed
      cell.complete = true
    }
  }

  state.animationComplete = allComplete
  return state.animationComplete
}

function digitPresent(state: DigitState, slot: number) {
  if (slot === 2) {
    return true
  }
  const digitIndex = slot < 2 ? slot : slot - 1
  return state.digits[digitIndex] >= 0
}

function glyphForSlot(state: DigitState, slot: number) {
  if (slot === 2) {
    return 10
  }
  const digitIndex = slot < 2 ? slot : slot - 1
  return state.digits[digitIndex]
}

function zeroCellLevels(state: DigitState, slot: number) {
  for (let row = 0; row < DIGIT_HEIGHT; row += 1) {
    for (let col = 0; col < DIGIT_WIDTH; col += 1) {
      state.cellLevel[slot][row][col] = -1
    }
  }
}

function zeroAllLevels(state: DigitState) {
  for (let slot = 0; slot < TOTAL_GLYPHS; slot += 1) {
    zeroCellLevels(state, slot)
  }
  state.revealComplete = false
}

function fillFinalLevels(state: DigitState) {
  for (let slot = 0; slot < TOTAL_GLYPHS; slot += 1) {
    zeroCellLevels(state, slot)
    if (!digitPresent(state, slot)) {
      continue
    }

    const glyphIndex = glyphForSlot(state, slot)
    if (glyphIndex < 0) {
      continue
    }

    const glyph = GLYPHS[glyphIndex]
    for (let row = 0; row < DIGIT_HEIGHT; row += 1) {
      const mask = glyph.rows[row]
      const pinMask = glyph.pins[row]
      if (!mask) {
        continue
      }
      for (let col = 0; col < glyph.width; col += 1) {
        const bit = 1 << (glyph.width - 1 - col)
        if ((mask & bit) === 0) {
          continue
        }
        state.cellLevel[slot][row][col] = (pinMask & bit) !== 0 ? 0 : 2
      }
    }
  }
  state.revealComplete = true
}

function digitLevelFromProgress(progress: number) {
  if (progress < DIGIT_COMPACT_THRESHOLD) {
    return 0
  }
  if (progress < DIGIT_FULL_THRESHOLD) {
    return 1
  }
  return 2
}

function updateSlotLevels(state: DigitState, background: BackgroundState, slot: number, baseCol: number) {
  const glyphIndex = glyphForSlot(state, slot)
  if (glyphIndex < 0) {
    zeroCellLevels(state, slot)
    return true
  }

  const glyph = GLYPHS[glyphIndex]
  let slotComplete = true

  for (let row = 0; row < DIGIT_HEIGHT; row += 1) {
    const mask = glyph.rows[row]
    const pinMask = glyph.pins[row]
    if (!mask) {
      continue
    }

    for (let col = 0; col < glyph.width; col += 1) {
      const bit = 1 << (glyph.width - 1 - col)
      if ((mask & bit) === 0) {
        continue
      }

      const pinned = (pinMask & bit) !== 0
      const progress = backgroundProgressForCell(
        background,
        baseCol + col,
        LAYOUT.digitStartRow + row
      )

      if (progress !== null) {
        const target = digitLevelFromProgress(progress)
        if (pinned) {
          state.cellLevel[slot][row][col] = target >= 0 ? 0 : -1
        } else if (target > state.cellLevel[slot][row][col]) {
          state.cellLevel[slot][row][col] = target
        }
      }

      const currentLevel = state.cellLevel[slot][row][col]
      if ((pinned && currentLevel < 0) || (!pinned && currentLevel < 2)) {
        slotComplete = false
      }
    }
  }

  return slotComplete
}

function stepDigitLevels(state: DigitState, background: BackgroundState) {
  let allComplete = true
  let baseCol = LAYOUT.digitStartCol

  for (let slot = 0; slot < TOTAL_GLYPHS; slot += 1) {
    if (digitPresent(state, slot)) {
      const slotDone = updateSlotLevels(state, background, slot, baseCol)
      if (!slotDone) {
        allComplete = false
      }
    } else {
      zeroCellLevels(state, slot)
    }

    baseCol += slot === 2 ? DIGIT_COLON_WIDTH : DIGIT_WIDTH
    if (slot < TOTAL_GLYPHS - 1) {
      baseCol += DIGIT_GAP
    }
  }

  return allComplete
}

function setDigitsFromDate(state: DigitState, date: Date) {
  const nextDigits = [
    Math.floor(date.getHours() / 10),
    date.getHours() % 10,
    Math.floor(date.getMinutes() / 10),
    date.getMinutes() % 10,
  ]

  let changed = false
  for (let index = 0; index < DIGIT_COUNT; index += 1) {
    if (state.digits[index] !== nextDigits[index]) {
      state.digits[index] = nextDigits[index]
      changed = true
    }
  }

  return changed
}

function drawCellShape(
  ctx: CanvasRenderingContext2D,
  cellCol: number,
  cellRow: number,
  sizeLevel: number
) {
  if (sizeLevel < 0) {
    return
  }

  const x = cellCol * CELL_SIZE
  const y = cellRow * CELL_SIZE

  if (sizeLevel === 2) {
    ctx.fillRect(x + 1, y + 1, 4, 4)
    return
  }

  if (sizeLevel === 1) {
    ctx.fillRect(x + 2, y + 2, 3, 3)
    return
  }

  ctx.fillRect(x + 2, y + 2, 2, 2)
}

function drawBackground(
  ctx: CanvasRenderingContext2D,
  background: BackgroundState
) {
  ctx.fillStyle = COLORS.backgroundFill
  ctx.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT)

  ctx.fillStyle = COLORS.gridStroke
  for (let row = 0; row < LAYOUT.gridRows; row += 1) {
    for (let col = 0; col < LAYOUT.gridCols; col += 1) {
      drawCellShape(ctx, col, row, 0)
    }
  }

  for (let row = 0; row < LAYOUT.gridRows; row += 1) {
    for (let col = 0; col < LAYOUT.gridCols; col += 1) {
      const cell = background.cells[cellIndex(col, row)]
      const progress = backgroundProgressValue(background, cell)
      if (progress === null) {
        continue
      }

      let sizeLevel = shapeLevelForProgress(progress)
      if (sizeLevel < 0) {
        if (!cell.isDigit) {
          sizeLevel = 0
        } else {
          continue
        }
      }

      ctx.fillStyle = colorForProgress(progress, cell.isDigit)
      drawCellShape(ctx, col, row, sizeLevel)
    }
  }
}

function drawTrail(
  ctx: CanvasRenderingContext2D,
  state: EngineState,
  now: number
) {
  if (!state.background) {
    return
  }

  ctx.fillStyle = COLORS.digitStroke
  for (let index = 0; index < state.trailStartedAt.length; index += 1) {
    const startedAt = state.trailStartedAt[index]
    if (startedAt <= 0) {
      continue
    }

    const age = now - startedAt
    if (age >= TRAIL_FADE_MS) {
      state.trailStartedAt[index] = 0
      continue
    }

    const { col, row } = cellCoordinates(index)
    if (!isDormantTrailCell(state.background, col, row)) {
      continue
    }

    const progress = ease(age / TRAIL_FADE_MS)
    const sizeLevel = shapeLevelForProgress(progress)

    ctx.fillStyle = colorForProgress(progress, false)
    drawCellShape(ctx, col, row, sizeLevel < 0 ? 0 : sizeLevel)
  }
}

function drawDigits(ctx: CanvasRenderingContext2D, state: DigitState) {
  ctx.fillStyle = COLORS.digitStroke
  let baseCol = LAYOUT.digitStartCol

  for (let slot = 0; slot < TOTAL_GLYPHS; slot += 1) {
    if (digitPresent(state, slot)) {
      const glyph = GLYPHS[glyphForSlot(state, slot)]
      for (let row = 0; row < DIGIT_HEIGHT; row += 1) {
        const mask = glyph.rows[row]
        if (!mask) {
          continue
        }
        for (let col = 0; col < glyph.width; col += 1) {
          const bit = 1 << (glyph.width - 1 - col)
          if ((mask & bit) === 0) {
            continue
          }
          drawCellShape(ctx, baseCol + col, LAYOUT.digitStartRow + row, state.cellLevel[slot][row][col])
        }
      }
    }

    baseCol += slot === 2 ? DIGIT_COLON_WIDTH : DIGIT_WIDTH
    if (slot < TOTAL_GLYPHS - 1) {
      baseCol += DIGIT_GAP
    }
  }
}

function drawFrame(state: EngineState, now: number) {
  const ctx = state.visibleCtx
  ctx.setTransform(1, 0, 0, 1, 0, 0)
  ctx.clearRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT)
  ctx.imageSmoothingEnabled = false

  if (!state.started || !state.background) {
    ctx.fillStyle = COLORS.backgroundFill
    ctx.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT)
  } else {
    drawBackground(ctx, state.background)
    drawTrail(ctx, state, now)
    drawDigits(ctx, state.digits)
  }
}

export function createPebbleWatchfaceEngine(
  canvas: HTMLCanvasElement
): PebbleWatchfaceEngine {
  const visibleCtx = canvas.getContext("2d")
  if (!visibleCtx) {
    throw new Error("Pebble watchface requires a 2D canvas context")
  }

  const state: EngineState = {
    started: false,
    destroyed: false,
    background: null,
    digits: createDigitState(),
    trailStartedAt: Array.from(
      { length: LAYOUT.gridCols * LAYOUT.gridRows },
      () => 0
    ),
    lastTrailCell: null,
    pendingTime: null,
    rafId: null,
    minuteTimeoutId: null,
    lastFrameTime: null,
    accumulator: 0,
    visibleCtx,
  }

  const draw = (now = performance.now()) => {
    if (!state.destroyed) {
      drawFrame(state, now)
    }
  }

  const resetAnimation = (scheduleMinuteTick: boolean) => {
    state.started = true
    state.background = createBackgroundState()
    state.digits = createDigitState()
    state.lastTrailCell = null
    state.trailStartedAt.fill(0)
    state.pendingTime = null
    applyTime(new Date(), true)
    if (scheduleMinuteTick) {
      scheduleNextMinuteTick()
    }
    draw()
    startLoop()
  }

  const applyTime = (date: Date, animate: boolean) => {
    const changed = setDigitsFromDate(state.digits, date)
    if (!changed && !animate) {
      return
    }

    if (animate) {
      zeroAllLevels(state.digits)
    } else {
      fillFinalLevels(state.digits)
    }
  }

  const scheduleNextMinuteTick = () => {
    if (state.minuteTimeoutId !== null) {
      window.clearTimeout(state.minuteTimeoutId)
    }

    const now = new Date()
    const delay =
      (60 - now.getSeconds()) * 1000 - now.getMilliseconds() + BG_FRAME_MS

    state.minuteTimeoutId = window.setTimeout(() => {
      if (state.destroyed) {
        return
      }

      const currentTime = new Date()
      if (state.rafId !== null) {
        state.pendingTime = currentTime
      } else if (state.started) {
        applyTime(currentTime, false)
        draw()
      }

      scheduleNextMinuteTick()
    }, delay)
  }

  const stopLoop = () => {
    if (state.rafId !== null) {
      window.cancelAnimationFrame(state.rafId)
      state.rafId = null
    }
    state.lastFrameTime = null
    state.accumulator = 0
  }

  const hasActiveTrail = (now: number) =>
    state.trailStartedAt.some(
      (startedAt) => startedAt > 0 && now - startedAt < TRAIL_FADE_MS
    )

  const seedTrailCell = (col: number, row: number, now: number) => {
    if (!state.background) {
      return
    }
    if (
      col < 0 ||
      col >= LAYOUT.gridCols ||
      row < 0 ||
      row >= LAYOUT.gridRows ||
      !isDormantTrailCell(state.background, col, row)
    ) {
      return
    }

    state.trailStartedAt[cellIndex(col, row)] = now
  }

  const seedTrailWidth = (
    col: number,
    row: number,
    dx: number,
    dy: number,
    now: number
  ) => {
    seedTrailCell(col, row, now)

    const perpendicularCol = Math.abs(dx) >= Math.abs(dy) ? col : col + 1
    const perpendicularRow = Math.abs(dx) >= Math.abs(dy) ? row + 1 : row
    seedTrailCell(perpendicularCol, perpendicularRow, now)
  }

  const seedTrailLine = (
    fromCol: number,
    fromRow: number,
    toCol: number,
    toRow: number,
    now: number
  ) => {
    const steps = Math.max(Math.abs(toCol - fromCol), Math.abs(toRow - fromRow))
    for (let step = 0; step <= steps; step += 1) {
      const ratio = steps === 0 ? 0 : step / steps
      const col = Math.round(fromCol + (toCol - fromCol) * ratio)
      const row = Math.round(fromRow + (toRow - fromRow) * ratio)
      seedTrailWidth(col, row, toCol - fromCol, toRow - fromRow, now)
    }
  }

  const tick = (now: number) => {
    if (state.destroyed || state.background === null) {
      return
    }

    if (state.lastFrameTime === null) {
      state.lastFrameTime = now
    }

    state.accumulator += Math.min(64, now - state.lastFrameTime)
    state.lastFrameTime = now

    while (state.accumulator >= BG_FRAME_MS) {
      stepBackground(state.background)
      if (!state.digits.revealComplete) {
        state.digits.revealComplete = stepDigitLevels(state.digits, state.background)
      }
      state.accumulator -= BG_FRAME_MS
    }

    draw(now)

    if (
      state.background.animationComplete &&
      state.digits.revealComplete &&
      !hasActiveTrail(now)
    ) {
      stopLoop()

      if (state.pendingTime) {
        applyTime(state.pendingTime, false)
        state.pendingTime = null
        draw(now)
      }
      return
    }

    state.rafId = window.requestAnimationFrame(tick)
  }

  const startLoop = () => {
    if (state.rafId !== null) {
      return
    }
    state.lastFrameTime = null
    state.accumulator = 0
    state.rafId = window.requestAnimationFrame(tick)
  }

  return {
    resize() {
      canvas.style.width = "100%"
      canvas.style.height = "100%"

      if (canvas.width !== SCREEN_WIDTH || canvas.height !== SCREEN_HEIGHT) {
        canvas.width = SCREEN_WIDTH
        canvas.height = SCREEN_HEIGHT
      }

      draw()
    },
    start() {
      if (state.started || state.destroyed) {
        return
      }
      resetAnimation(true)
    },
    restart() {
      if (state.destroyed) {
        return
      }
      resetAnimation(!state.started)
    },
    setPointer(x, y) {
      if (state.destroyed || !state.started || !state.background) {
        return
      }

      const col = Math.max(0, Math.min(LAYOUT.gridCols - 1, Math.floor(x / 6)))
      const row = Math.max(0, Math.min(LAYOUT.gridRows - 1, Math.floor(y / 6)))
      const now = performance.now()
      const previous = state.lastTrailCell ?? { col, row }

      seedTrailLine(previous.col, previous.row, col, row, now)
      state.lastTrailCell = { col, row }
      draw(now)
      startLoop()
    },
    clearPointer() {
      state.lastTrailCell = null
    },
    destroy() {
      state.destroyed = true
      stopLoop()
      if (state.minuteTimeoutId !== null) {
        window.clearTimeout(state.minuteTimeoutId)
        state.minuteTimeoutId = null
      }
    },
  }
}
