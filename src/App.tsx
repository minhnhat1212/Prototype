import { useMemo, useState } from 'react'
import { ApprovalScreen } from './components/ApprovalScreen'
import { ColorLegend } from './components/ColorLegend'
import { DEFAULT_GRID_FILTER, GridFilterHeader, type GridFilterState } from './components/GridFilterHeader'
import { LeaveGrid } from './components/LeaveGrid'
import { buildSampleRequests, EMPLOYEES, resolveLeaveType, STATUS_CONFIG } from './constants'
import type { CurrentUser, LeaveRequest, RequestStatus, UserRole } from './types'
import { buildGridDates, isDateInRange } from './utils/dateUtils'
import './App.css'

const ROLE_PRESETS: Record<UserRole, CurrentUser> = {
  employee: {
    role: 'employee',
    canApprove: false,
    name: 'Nguyễn Văn A',
  },
  messer: {
    role: 'messer',
    canApprove: true,
    name: 'Quản lý Messer',
  },
}

type View = 'grid' | 'approval'

function App() {
  const now = new Date()
  const initialRequests = useMemo(
    () => buildSampleRequests(now.getFullYear(), now.getMonth() + 1),
    [now.getFullYear(), now.getMonth()]
  )

  const [requests, setRequests] = useState<LeaveRequest[]>(initialRequests)
  const [userRole] = useState<UserRole>('messer')
  const [view, setView] = useState<View>('grid')
  const [focusRequestId, setFocusRequestId] = useState<string | null>(null)
  const user = ROLE_PRESETS[userRole]

  const [filters, setFilters] = useState<GridFilterState>(DEFAULT_GRID_FILTER)
  const [appliedFilters, setAppliedFilters] = useState<GridFilterState>(DEFAULT_GRID_FILTER)

  function handleSearch() {
    setAppliedFilters({ ...filters })
  }

  function handleReset() {
    setFilters({ ...DEFAULT_GRID_FILTER })
    setAppliedFilters({ ...DEFAULT_GRID_FILTER })
  }

  function handleUpdateRequest(
    requestId: string,
    updater: (req: LeaveRequest) => LeaveRequest
  ) {
    setRequests((prev) => prev.map((r) => (r.id === requestId ? updater(r) : r)))
  }

  function handleDecision(requestId: string, newStatus: RequestStatus, reason: string) {
    handleUpdateRequest(requestId, (req) => ({
      ...req,
      status: newStatus,
      note: reason || req.note,
      history: [
        ...req.history,
        {
          stt: req.history.length + 1,
          employeeId: user.name,
          employeeName: user.name,
          position: user.role === 'messer' ? 'Quản lý (Messer)' : 'Nhân viên',
          status: STATUS_CONFIG[newStatus].label,
          actionDate: new Date().toLocaleString('vi-VN'),
          reason,
          note: '',
        },
      ],
    }))
  }

  function handleNavigateToApproval(requestId: string) {
    setFocusRequestId(requestId)
    setView('approval')
  }

  function handleBackToGrid() {
    setView('grid')
    setFocusRequestId(null)
  }

  const filteredEmployees = useMemo(() => {
    return EMPLOYEES.filter((emp) => {
      if (
        appliedFilters.employeeId &&
        !emp.id.toLowerCase().includes(appliedFilters.employeeId.toLowerCase().trim())
      ) {
        return false
      }
      if (
        appliedFilters.employeeName &&
        !emp.name.toLowerCase().includes(appliedFilters.employeeName.toLowerCase().trim())
      ) {
        return false
      }
      if (
        appliedFilters.company &&
        !emp.company.toLowerCase().includes(appliedFilters.company.toLowerCase().trim())
      ) {
        return false
      }
      if (appliedFilters.division && emp.division !== appliedFilters.division) {
        return false
      }
      if (appliedFilters.department && emp.department !== appliedFilters.department) {
        return false
      }
      if (appliedFilters.section && emp.section !== appliedFilters.section) {
        return false
      }
      if (appliedFilters.position && emp.position !== appliedFilters.position) {
        return false
      }
      return true
    })
  }, [appliedFilters])

  const filteredRequests = useMemo(() => {
    if (appliedFilters.requestStatus === 'all') return requests
    return requests.filter((r) => r.status === appliedFilters.requestStatus)
  }, [requests, appliedFilters.requestStatus])

  const gridDates = useMemo(() => buildGridDates(), [])

  function handleExport() {
    const titleRow = ['DANH SÁCH TỔNG HỢP ĐĂNG KÝ LÀM NGOÀI GIỜ / NGHỈ PHÉP']
    const dateRangeRow = [`Thời gian: ${appliedFilters.fromDate} - ${appliedFilters.toDate}`]
    const emptyRow: string[] = []

    // Dòng tiêu đề 1: Cột trống + Thứ (CN, T2, T3...)
    const headerRow1 = [
      '',
      '',
      '',
      '',
      '',
      ...gridDates.map((d) => d.weekday),
    ]

    // Dòng tiêu đề 2: Tên cột nhân viên + Ngày/Tháng (20/9, 21/9...)
    const headerRow2 = [
      'Mã NV',
      'Họ và tên',
      'Khối',
      'Phòng ban',
      'Vị trí công việc',
      ...gridDates.map((d) => `${d.day}/${d.month}`),
    ]

    // Dữ liệu từng nhân viên theo ma trận ngày giống hệt lưới
    const dataRows: string[][] = []
    filteredEmployees.forEach((emp) => {
      const row: string[] = [
        emp.id,
        emp.name,
        emp.division,
        emp.department,
        emp.position,
      ]

      gridDates.forEach((date) => {
        const matchingRequests = filteredRequests.filter(
          (r) => r.employeeId === emp.id && isDateInRange(date.key, r.startDate, r.endDate)
        )

        if (matchingRequests.length === 0) {
          row.push('')
        } else {
          // Format ô giống y hệt lưới: Dòng 1 giờ (08:00-17:00), Dòng 2 mã loại nghỉ (AL, BT, SL...)
          const cellContent = matchingRequests
            .map((r) => {
              const code = resolveLeaveType(r.type).code
              const time = `${r.startTime || '08:00'}-${r.endTime || '17:00'}`
              return `${time}\n${code}`
            })
            .join('\n---\n')
          row.push(cellContent)
        }
      })

      dataRows.push(row)
    })

    const allRows = [titleRow, dateRangeRow, emptyRow, headerRow1, headerRow2, ...dataRows]

    const csvContent =
      '\uFEFF' +
      allRows
        .map((r) =>
          r.map((cell) => `"${(cell || '').replace(/"/g, '""')}"`).join(',')
        )
        .join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.setAttribute('href', url)
    link.setAttribute(
      'download',
      `Bao_cao_tong_hop_dang_ky_luoi_${new Date().toISOString().slice(0, 10)}.csv`
    )
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  if (view === 'approval') {
    return (
      <ApprovalScreen
        requests={requests}
        user={user}
        focusRequestId={focusRequestId}
        onBack={handleBackToGrid}
        onDecision={handleDecision}
      />
    )
  }

  return (
    <div className="app-container">
      {/* Khối Header & Bộ lọc kết nối trực tiếp với lưới dữ liệu */}
      <GridFilterHeader
        filters={filters}
        onFilterChange={setFilters}
        onSearch={handleSearch}
        onReset={handleReset}
        onExport={handleExport}
        allEmployees={EMPLOYEES}
      />

      {/* Vùng Lưới Dữ Liệu Nối Liền */}
      <main className="grid-section">
        <LeaveGrid
          requests={filteredRequests}
          employees={filteredEmployees}
          user={user}
          onNavigateToApproval={handleNavigateToApproval}
        />

        <ColorLegend />
      </main>
    </div>
  )
}

export default App
