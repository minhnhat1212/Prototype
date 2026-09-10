import { useState } from 'react'
import type { Employee } from '../types'

export interface GridFilterState {
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
  requestStatus: string // 'all' | RequestStatus
}

export const DEFAULT_GRID_FILTER: GridFilterState = {
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
  workStatus: 'active',
  fromDate: '21/08/2026',
  toDate: '20/09/2026',
  requestStatus: 'all',
}

interface GridFilterHeaderProps {
  filters: GridFilterState
  onFilterChange: (filters: GridFilterState) => void
  onSearch: () => void
  onReset: () => void
  onExport: () => void
  allEmployees: Employee[]
}

export function GridFilterHeader({
  filters,
  onFilterChange,
  onSearch,
  onReset,
  onExport,
  allEmployees,
}: GridFilterHeaderProps) {
  const [showEmployeePicker, setShowEmployeePicker] = useState(false)

  const updateField = <K extends keyof GridFilterState>(key: K, value: GridFilterState[K]) => {
    onFilterChange({ ...filters, [key]: value })
  }

  // Extract unique options from employees
  const divisions = Array.from(new Set(allEmployees.map((e) => e.division).filter(Boolean)))
  const departments = Array.from(new Set(allEmployees.map((e) => e.department).filter(Boolean)))
  const sections = Array.from(new Set(allEmployees.map((e) => e.section).filter(Boolean)))
  const positions = Array.from(new Set(allEmployees.map((e) => e.position).filter(Boolean)))

  return (
    <div className="grid-filter-header-container">
      {/* 1. Sky Blue Banner with Breadcrumbs & Title */}
      <div className="sky-banner">
        <div className="banner-top-bar">
          <div className="banner-breadcrumbs">
            <span className="bc-item">DV cá nhân</span>
            <span className="bc-sep">›</span>
            <span className="bc-item">Chấm công</span>
            <span className="bc-sep">›</span>
            <span className="bc-item">Làm ngoài giờ</span>
            <span className="bc-sep">›</span>
            <span className="bc-current">Danh sách tổng hợp đăng ký làm ngoài giờ</span>
          </div>
        </div>

        <h1 className="banner-page-title">
          DANH SÁCH TỔNG HỢP ĐĂNG KÝ LÀM NGOÀI GIỜ
        </h1>
      </div>

      {/* 2. Main Search & Filter Form (3 Columns matching Image 2) */}
      <div className="filter-form-wrapper">
        <div className="filter-form-grid">
          {/* Hàng 1 */}
          <div className="filter-field">
            <label className="filter-label">Mã nhân viên</label>
            <div className="filter-input-wrap">
              <input
                type="text"
                className="filter-input"
                value={filters.employeeId}
                placeholder="Nhập mã NV..."
                onChange={(e) => updateField('employeeId', e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && onSearch()}
              />
            </div>
          </div>

          <div className="filter-field">
            <label className="filter-label">Tên nhân viên</label>
            <div className="filter-input-wrap with-btn">
              <input
                type="text"
                className="filter-input"
                value={filters.employeeName}
                placeholder="Nhập tên NV..."
                onChange={(e) => updateField('employeeName', e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && onSearch()}
              />
              <button
                type="button"
                className="filter-more-btn"
                title="Chọn nhân viên từ danh sách"
                onClick={() => setShowEmployeePicker(!showEmployeePicker)}
              >
                ...
              </button>
            </div>

            {/* Quick Picker dropdown */}
            {showEmployeePicker && (
              <div className="emp-quick-picker">
                <div className="emp-picker-header">Chọn nhân viên</div>
                {allEmployees.map((emp) => (
                  <div
                    key={emp.id}
                    className="emp-picker-item"
                    onClick={() => {
                      updateField('employeeId', emp.id)
                      updateField('employeeName', emp.name)
                      setShowEmployeePicker(false)
                    }}
                  >
                    <strong>{emp.name}</strong> ({emp.id}) — <em>{emp.position}</em>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="filter-field">
            <label className="filter-label">Tập đoàn</label>
            <div className="filter-input-wrap">
              <select
                className="filter-select"
                value={filters.group}
                onChange={(e) => updateField('group', e.target.value)}
              >
                <option value="Messer tại Việt Nam">Messer tại Việt Nam</option>
              </select>
            </div>
          </div>

          {/* Hàng 2 */}
          <div className="filter-field">
            <label className="filter-label">Công ty</label>
            <div className="filter-input-wrap">
              <select
                className="filter-select"
                value={filters.company}
                onChange={(e) => updateField('company', e.target.value)}
              >
                <option value="">-- Tất cả --</option>
                <option value="Công ty TNHH Messer Việt Nam">Công ty TNHH Messer Việt Nam</option>
              </select>
            </div>
          </div>

          <div className="filter-field">
            <label className="filter-label">Khối</label>
            <div className="filter-input-wrap">
              <select
                className="filter-select"
                value={filters.division}
                onChange={(e) => updateField('division', e.target.value)}
              >
                <option value="">-- Tất cả --</option>
                {divisions.map((div) => (
                  <option key={div} value={div}>
                    {div}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="filter-field">
            <label className="filter-label">Bộ phận</label>
            <div className="filter-input-wrap">
              <select
                className="filter-select"
                value={filters.section}
                onChange={(e) => updateField('section', e.target.value)}
              >
                <option value="">-- Tất cả --</option>
                {sections.map((sec) => (
                  <option key={sec} value={sec}>
                    {sec}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Hàng 3 */}
          <div className="filter-field">
            <label className="filter-label">Phòng</label>
            <div className="filter-input-wrap">
              <select
                className="filter-select"
                value={filters.department}
                onChange={(e) => updateField('department', e.target.value)}
              >
                <option value="">-- Tất cả --</option>
                {departments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="filter-field">
            <label className="filter-label">Khối (2)</label>
            <div className="filter-input-wrap">
              <select
                className="filter-select"
                value={filters.division2}
                onChange={(e) => updateField('division2', e.target.value)}
              >
                <option value="">-- Tất cả --</option>
                {divisions.map((div) => (
                  <option key={div} value={div}>
                    {div}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="filter-field">
            <label className="filter-label">Phòng (2)</label>
            <div className="filter-input-wrap">
              <select
                className="filter-select"
                value={filters.section2}
                onChange={(e) => updateField('section2', e.target.value)}
              >
                <option value="">-- Tất cả --</option>
                {sections.map((sec) => (
                  <option key={sec} value={sec}>
                    {sec}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Hàng 4 */}
          <div className="filter-field">
            <label className="filter-label">Vị trí công việc</label>
            <div className="filter-input-wrap">
              <select
                className="filter-select"
                value={filters.position}
                onChange={(e) => updateField('position', e.target.value)}
              >
                <option value="">-- Tất cả --</option>
                {positions.map((pos) => (
                  <option key={pos} value={pos}>
                    {pos}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="filter-field">
            <label className="filter-label">Nơi làm việc</label>
            <div className="filter-input-wrap">
              <select
                className="filter-select"
                value={filters.workplace}
                onChange={(e) => updateField('workplace', e.target.value)}
              >
                <option value="">-- Tất cả --</option>
                <option value="Hải Phòng">Hải Phòng</option>
                <option value="Bình Dương">Bình Dương</option>
                <option value="Quảng Ngãi">Quảng Ngãi</option>
                <option value="Bắc Ninh">Bắc Ninh</option>
              </select>
            </div>
          </div>

          <div className="filter-field empty-spacer"></div>
        </div>

        {/* Hàng 5: Radio Tình trạng nhân viên */}
        <div className="work-status-row">
          <span className="work-status-label">Tình trạng</span>
          <div className="work-status-radios">
            <label className="radio-item">
              <input
                type="radio"
                name="workStatus"
                checked={filters.workStatus === 'active'}
                onChange={() => updateField('workStatus', 'active')}
              />
              Đang làm việc
            </label>
            <label className="radio-item">
              <input
                type="radio"
                name="workStatus"
                checked={filters.workStatus === 'resigned'}
                onChange={() => updateField('workStatus', 'resigned')}
              />
              Thôi việc
            </label>
            <label className="radio-item">
              <input
                type="radio"
                name="workStatus"
                checked={filters.workStatus === 'all'}
                onChange={() => updateField('workStatus', 'all')}
              />
              Tất cả
            </label>
          </div>
        </div>

        {/* 3. Date & Status Sub-Bar (Blue Ribbon #B3D3F9 from Image 2) */}
        <div className="date-status-bar">
          <div className="date-range-col">
            <span className="sub-bar-label">Từ ngày</span>
            <div className="date-picker-group">
              <input
                type="text"
                className="date-text-input"
                value={filters.fromDate}
                onChange={(e) => updateField('fromDate', e.target.value)}
              />
              <button type="button" className="cal-icon-btn" aria-label="Lịch">
                📅
              </button>
              <span className="date-dash">-</span>
              <input
                type="text"
                className="date-text-input"
                value={filters.toDate}
                onChange={(e) => updateField('toDate', e.target.value)}
              />
              <button type="button" className="cal-icon-btn" aria-label="Lịch">
                📅
              </button>
            </div>
          </div>

          <div className="status-select-col">
            <span className="sub-bar-label">Tình trạng</span>
            <select
              className="status-dropdown"
              value={filters.requestStatus}
              onChange={(e) => updateField('requestStatus', e.target.value)}
            >
              <option value="all">-- Tất cả trạng thái đơn --</option>
              <option value="approved">Đã phê duyệt (Approved)</option>
              <option value="approving">Chờ phê duyệt (Approving)</option>
              <option value="rejected">Từ chối (Rejected)</option>
              <option value="cancelled">Chuyển phê duyệt hủy (Cancelled)</option>
              <option value="cancel_approving">Đang chờ phê duyệt hủy</option>
              <option value="cancel_approved">Đã phê duyệt hủy</option>
              <option value="cancel_rejected">Không đồng ý hủy</option>
              <option value="create">Tạo mới</option>
            </select>
          </div>
        </div>

        {/* 4. Action Buttons (Tìm Kiếm, Làm mới, Xuất dữ liệu) */}
        <div className="filter-actions-bar">
          <button
            type="button"
            className="action-btn btn-yellow-search"
            onClick={onSearch}
          >
            Tìm Kiếm
          </button>
          <button
            type="button"
            className="action-btn btn-blue-reset"
            onClick={onReset}
          >
            Làm mới
          </button>
          <button
            type="button"
            className="action-btn btn-orange-export"
            onClick={onExport}
          >
            Xuất dữ liệu
          </button>
        </div>
      </div>
    </div>
  )
}
