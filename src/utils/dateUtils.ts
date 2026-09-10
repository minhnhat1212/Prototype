export interface GridDate {
  key: string
  date: Date
  label: string
  day: number
  month: number
  weekday: string
  isWeekend: boolean
}

const WEEKDAY_NAMES = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7']

function formatDateKey(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

function formatLabel(date: Date): string {
  const d = String(date.getDate()).padStart(2, '0')
  const m = String(date.getMonth() + 1).padStart(2, '0')
  return `${d}/${m}`
}

/** Tạo danh sách ngày từ ngày 20 tháng hiện tại đến ngày 21 tháng sau (tối đa 62 ngày). */
export function buildGridDates(referenceDate = new Date()): GridDate[] {
  const year = referenceDate.getFullYear()
  const month = referenceDate.getMonth()

  const start = new Date(year, month, 20)
  const end = new Date(year, month + 1, 21)

  const dates: GridDate[] = []
  const cursor = new Date(start)

  while (cursor <= end && dates.length < 62) {
    const dayOfWeek = cursor.getDay()
    dates.push({
      key: formatDateKey(cursor),
      date: new Date(cursor),
      label: formatLabel(cursor),
      day: cursor.getDate(),
      month: cursor.getMonth() + 1,
      weekday: WEEKDAY_NAMES[dayOfWeek],
      isWeekend: dayOfWeek === 0 || dayOfWeek === 6,
    })
    cursor.setDate(cursor.getDate() + 1)
  }

  return dates
}

export function parseDisplayDate(value: string): Date | null {
  const parts = value.split('/')
  if (parts.length !== 3) return null
  const [d, m, y] = parts.map(Number)
  if (!d || !m || !y) return null
  return new Date(y, m - 1, d)
}

function parseDateKey(key: string): Date {
  const [y, m, d] = key.split('-').map(Number)
  return new Date(y, m - 1, d)
}

export function isDateInRange(dateKey: string, startDate: string, endDate: string): boolean {
  const target = parseDateKey(dateKey)
  const start = parseDisplayDate(startDate)
  const end = parseDisplayDate(endDate)
  if (!start || !end) return false
  return target >= start && target <= end
}

export function dateKeyFromDisplay(value: string): string | null {
  const parsed = parseDisplayDate(value)
  if (!parsed) return null
  const y = parsed.getFullYear()
  const m = String(parsed.getMonth() + 1).padStart(2, '0')
  const d = String(parsed.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}
