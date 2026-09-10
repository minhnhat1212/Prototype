import { useMemo, useState } from 'react'
import { EMPLOYEES, PENDING_APPROVAL_STATUSES, STATUS_CONFIG } from '../constants'
import type { CurrentUser, LeaveRequest, RequestStatus } from '../types'
import './ApprovalScreen.css'

interface ApprovalScreenProps {
  requests: LeaveRequest[]
  user: CurrentUser
  focusRequestId?: string | null
  onBack: () => void
  onDecision: (requestId: string, newStatus: RequestStatus, reason: string) => void
}

interface FilterState {
  employeeId: string
  employeeName: string
  group: string
  company: string
  division: string
  department: string
  section: string
  division2: string
  section2: string
  position: string
  workplace: string
  workStatus: 'active' | 'resigned' | 'all'
  fromDate: string
  toDate: string
}

const EMPTY_FILTER: FilterState = {
  employeeId: '',
  employeeName: '',
  group: 'Messer tại Việt Nam',
  company: '',
  division: '',
  department: '',
  section: '',
  division2: '',
  section2: '',
  position: '',
  workplace: '',
  workStatus: 'all',
  fromDate: '',
  toDate: '',
}

export function ApprovalScreen({
  requests,
  user,
  focusRequestId,
  onBack,
  onDecision,
}: ApprovalScreenProps) {
  const focusRequest = focusRequestId
    ? requests.find((r) => r.id === focusRequestId)
    : null
  const focusEmployee = focusRequest
    ? EMPLOYEES.find((e) => e.id === focusRequest.employeeId)
    : null

  const [filters, setFilters] = useState<FilterState>(() => ({
    ...EMPTY_FILTER,
    employeeId: focusRequest?.employeeId ?? '',
    employeeName: focusEmployee?.name ?? '',
    fromDate: focusRequest?.startDate ?? '',
    toDate: focusRequest?.endDate ?? '',
  }))
  const [appliedFilters, setAppliedFilters] = useState(filters)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(
    () => new Set(focusRequestId ? [focusRequestId] : [])
  )
  const [rejectReason, setRejectReason] = useState('')

  const pendingRequests = useMemo(
    () => requests.filter((r) => PENDING_APPROVAL_STATUSES.includes(r.status)),
    [requests]
  )

  const filteredRows = useMemo(() => {
    return pendingRequests.filter((req) => {
      const emp = EMPLOYEES.find((e) => e.id === req.employeeId)
      if (!emp) return false

      const f = appliedFilters
      if (f.employeeId && !emp.id.toLowerCase().includes(f.employeeId.toLowerCase()))
        return false
      if (f.employeeName && !emp.name.toLowerCase().includes(f.employeeName.toLowerCase()))
        return false
      if (f.company && !emp.company.toLowerCase().includes(f.company.toLowerCase()))
        return false
      if (f.division && !emp.division.toLowerCase().includes(f.division.toLowerCase()))
        return false
      if (f.department && !emp.department.toLowerCase().includes(f.department.toLowerCase()))
        return false
      if (f.section && !emp.section.toLowerCase().includes(f.section.toLowerCase()))
        return false
      if (f.position && !emp.position.toLowerCase().includes(f.position.toLowerCase()))
        return false
      return true
    })
  }, [pendingRequests, appliedFilters])

  const allSelected =
    filteredRows.length > 0 && filteredRows.every((r) => selectedIds.has(r.id))

  function updateFilter<K extends keyof FilterState>(key: K, value: FilterState[K]) {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  function handleSearch() {
    setAppliedFilters({ ...filters })
  }

  function handleReset() {
    setFilters({ ...EMPTY_FILTER })
    setAppliedFilters({ ...EMPTY_FILTER })
    setSelectedIds(new Set())
    setRejectReason('')
  }

  function toggleRow(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function toggleAll() {
    if (allSelected) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(filteredRows.map((r) => r.id)))
    }
  }

  function handleApprove() {
    if (selectedIds.size === 0) {
      alert('Vui lòng chọn ít nhất một đơn để duyệt.')
      return
    }
    selectedIds.forEach((id) => {
      const req = requests.find((r) => r.id === id)
      if (!req) return
      const newStatus: RequestStatus =
        req.status === 'cancel_approving' ? 'cancel_approved' : 'approved'
      onDecision(id, newStatus, '')
    })
    setSelectedIds(new Set())
  }

  function handleReject() {
    if (selectedIds.size === 0) {
      alert('Vui lòng chọn ít nhất một đơn để từ chối.')
      return
    }
    selectedIds.forEach((id) => {
      const req = requests.find((r) => r.id === id)
      if (!req) return
      const newStatus: RequestStatus =
        req.status === 'cancel_approving' ? 'cancel_rejected' : 'rejected'
      onDecision(id, newStatus, rejectReason)
    })
    setSelectedIds(new Set())
    setRejectReason('')
  }

  return (
    <div className="approval-page">
      <div className="approval-banner">
        <div className="breadcrumbs">
          <button type="button" className="breadcrumb-link" onClick={onBack}>
            DV cá nhân
          </button>
          <span> &gt; </span>
          <span>Phê duyệt chấm công</span>
          <span> &gt; </span>
          <span>Phê duyệt đơn nghỉ</span>
        </div>
        <h1 className="approval-page-title">PHÊ DUYỆT ĐƠN NGHỈ</h1>
      </div>

      <div className="approval-content">
        <div className="approval-filters">
          <div className="filter-grid">
            <div className="filter-item">
              <label>Mã nhân viên</label>
              <input
                value={filters.employeeId}
                onChange={(e) => updateFilter('employeeId', e.target.value)}
              />
            </div>
            <div className="filter-item">
              <label>Tên nhân viên</label>
              <div className="input-with-btn">
                <input
                  value={filters.employeeName}
                  onChange={(e) => updateFilter('employeeName', e.target.value)}
                />
                <button type="button" className="input-btn" aria-label="Tìm nhân viên">
                  ...
                </button>
              </div>
            </div>
            <div className="filter-item">
              <label>Tập đoàn</label>
              <select value={filters.group} onChange={(e) => updateFilter('group', e.target.value)}>
                <option>Messer tại Việt Nam</option>
              </select>
            </div>

            <div className="filter-item">
              <label>Công ty</label>
              <select
                value={filters.company}
                onChange={(e) => updateFilter('company', e.target.value)}
              >
                <option value="">-- Chọn --</option>
                <option>Công ty TNHH Messer Việt Nam</option>
              </select>
            </div>
            <div className="filter-item">
              <label>Khối</label>
              <select
                value={filters.division}
                onChange={(e) => updateFilter('division', e.target.value)}
              >
                <option value="">-- Chọn --</option>
                <option>Logistics</option>
                <option>Sản xuất</option>
                <option>Kỹ thuật</option>
                <option>Nhân sự</option>
              </select>
            </div>
            <div className="filter-item">
              <label>Bộ phận</label>
              <select
                value={filters.section}
                onChange={(e) => updateFilter('section', e.target.value)}
              >
                <option value="">-- Chọn --</option>
              </select>
            </div>

            <div className="filter-item">
              <label>Phòng</label>
              <select
                value={filters.department}
                onChange={(e) => updateFilter('department', e.target.value)}
              >
                <option value="">-- Chọn --</option>
              </select>
            </div>
            <div className="filter-item">
              <label>Khối (2)</label>
              <select
                value={filters.division2}
                onChange={(e) => updateFilter('division2', e.target.value)}
              >
                <option value="">-- Chọn --</option>
              </select>
            </div>
            <div className="filter-item">
              <label>Phòng (2)</label>
              <select
                value={filters.section2}
                onChange={(e) => updateFilter('section2', e.target.value)}
              >
                <option value="">-- Chọn --</option>
              </select>
            </div>

            <div className="filter-item">
              <label>Vị trí công việc</label>
              <select
                value={filters.position}
                onChange={(e) => updateFilter('position', e.target.value)}
              >
                <option value="">-- Chọn --</option>
              </select>
            </div>
            <div className="filter-item">
              <label>Nơi làm việc</label>
              <select
                value={filters.workplace}
                onChange={(e) => updateFilter('workplace', e.target.value)}
              >
                <option value="">-- Chọn --</option>
              </select>
            </div>
            <div className="filter-item filter-radio">
              <label>Tình trạng</label>
              <div className="radio-group">
                <label>
                  <input
                    type="radio"
                    name="workStatus"
                    checked={filters.workStatus === 'active'}
                    onChange={() => updateFilter('workStatus', 'active')}
                  />
                  Đang làm việc
                </label>
                <label>
                  <input
                    type="radio"
                    name="workStatus"
                    checked={filters.workStatus === 'resigned'}
                    onChange={() => updateFilter('workStatus', 'resigned')}
                  />
                  Thôi việc
                </label>
                <label>
                  <input
                    type="radio"
                    name="workStatus"
                    checked={filters.workStatus === 'all'}
                    onChange={() => updateFilter('workStatus', 'all')}
                  />
                  Tất cả
                </label>
              </div>
            </div>

            <div className="filter-item filter-date">
              <label>Từ ngày</label>
              <div className="date-range">
                <input
                  type="text"
                  placeholder="dd/mm/yyyy"
                  value={filters.fromDate}
                  onChange={(e) => updateFilter('fromDate', e.target.value)}
                />
                <span>-</span>
                <input
                  type="text"
                  placeholder="dd/mm/yyyy"
                  value={filters.toDate}
                  onChange={(e) => updateFilter('toDate', e.target.value)}
                />
                <button type="button" className="calendar-btn" aria-label="Chọn ngày">
                  📅
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="approval-toolbar">
          <button type="button" className="toolbar-btn btn-search" onClick={handleSearch}>
            Tìm Kiếm
          </button>
          <button type="button" className="toolbar-btn btn-reset" onClick={handleReset}>
            Làm mới
          </button>
          <button type="button" className="toolbar-btn btn-approve-action" onClick={handleApprove}>
            Duyệt
          </button>
          <button type="button" className="toolbar-btn btn-reject-action" onClick={handleReject}>
            Từ chối
          </button>
          <button type="button" className="toolbar-btn btn-export">
            Xuất dữ liệu
          </button>
          <button type="button" className="toolbar-btn btn-back-grid" onClick={onBack}>
            ← Quay lại lưới
          </button>
        </div>

        <div className="reject-reason-bar">
          <label htmlFor="reject-reason">Lý do từ chối:</label>
          <input
            id="reject-reason"
            type="text"
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            placeholder="Nhập lý do khi từ chối đơn..."
          />
        </div>

        <div className="approval-table-wrapper">
          <table className="approval-table">
            <thead>
              <tr>
                <th className="col-check">
                  <input type="checkbox" checked={allSelected} onChange={toggleAll} />
                </th>
                <th>STT</th>
                <th>Tình trạng</th>
                <th>Mã nhân viên</th>
                <th>Tên nhân viên</th>
                <th>Loại đăng ký nghỉ/ Công tác</th>
                <th>Thời gian nghỉ/ Công tác</th>
                <th>Số ngày nghỉ/ Công tác</th>
                <th>Ghi chú</th>
                <th>Người phê duyệt</th>
                <th>Lý do từ chối</th>
              </tr>
            </thead>
            <tbody>
              {filteredRows.length === 0 ? (
                <tr>
                  <td colSpan={11} className="empty-row">
                    No records to display.
                  </td>
                </tr>
              ) : (
                filteredRows.map((req, index) => {
                  const emp = EMPLOYEES.find((e) => e.id === req.employeeId)!
                  const statusCfg = STATUS_CONFIG[req.status]
                  const isFocused = req.id === focusRequestId
                  const isSelected = selectedIds.has(req.id)

                  return (
                    <tr
                      key={req.id}
                      className={`${isFocused ? 'focused-row' : ''} ${isSelected ? 'selected-row' : ''}`}
                    >
                      <td className="col-check">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleRow(req.id)}
                        />
                      </td>
                      <td>{index + 1}</td>
                      <td style={{ color: statusCfg.color, fontWeight: 600 }}>{statusCfg.label}</td>
                      <td>{emp.id}</td>
                      <td>{emp.name}</td>
                      <td>{req.type}</td>
                      <td>
                        {req.startDate} - {req.endDate}
                      </td>
                      <td>{req.totalDays}</td>
                      <td>{req.note || req.reason}</td>
                      <td>{user.name}</td>
                      <td>{req.status === 'rejected' ? req.note : ''}</td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
