import { resolveLeaveType, STATUS_CONFIG } from '../constants'
import type { CurrentUser, LeaveRequest } from '../types'
import { CellMenu } from './CellMenu'

interface LeaveCellProps {
  request: LeaveRequest
  user: CurrentUser
  isMenuOpen: boolean
  onToggleMenu: () => void
  onViewDetail: () => void
  onApprove: () => void
  onCloseMenu: () => void
}

export function LeaveCell({
  request,
  user,
  isMenuOpen,
  onToggleMenu,
  onViewDetail,
  onApprove,
  onCloseMenu,
}: LeaveCellProps) {
  const statusCfg = STATUS_CONFIG[request.status]
  const typeMeta = resolveLeaveType(request.type)

  const startTime = request.startTime || '08:00'
  const endTime = request.endTime || '17:00'

  // Ký hiệu trạng thái
  const getStatusSymbol = () => {
    switch (request.status) {
      case 'approved':
      case 'cancel_approved':
        return '✓'
      case 'approving':
      case 'cancel_approving':
        return '⏳'
      case 'rejected':
      case 'cancel_rejected':
        return '✕'
      case 'cancelled':
        return '⊘'
      default:
        return '•'
    }
  }

  return (
    <div className="leave-cell-container">
      <div
        className={`leave-cell-block status-${request.status} ${isMenuOpen ? 'menu-active' : ''}`}
        onClick={onToggleMenu}
        role="button"
        tabIndex={0}
        aria-label={`${typeMeta.labelVi} (${startTime} - ${endTime})`}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            onToggleMenu()
          }
        }}
      >
        {/* Nửa trên: Thời gian làm việc / nghỉ (chuẩn 08:00 & 17:00), nền xanh lá */}
        <div className="leave-cell-top">
          <span className="time-text time-start">{startTime}</span>
          <span className="time-text time-end">{endTime}</span>

          {/* Chấm / biểu tượng chỉ báo trạng thái phê duyệt */}
          <span
            className={`cell-status-badge status-${request.status}`}
            style={{ color: statusCfg.color }}
            title={`Trạng thái: ${statusCfg.label}`}
          >
            {getStatusSymbol()}
          </span>

          {/* Nút 3 chấm mở nhanh menu */}
          <button
            type="button"
            className="cell-menu-btn"
            aria-label="Thao tác"
            onClick={(e) => {
              e.stopPropagation()
              onToggleMenu()
            }}
          >
            ⋯
          </button>
        </div>

        {/* Nửa dưới: Mã viết tắt loại đơn (AL, BT, SL...), nền màu riêng biệt */}
        <div
          className="leave-cell-bottom"
          style={{
            backgroundColor: typeMeta.bgColor,
            color: typeMeta.textColor,
          }}
        >
          <span className="leave-code">{typeMeta.code}</span>
        </div>
      </div>

      {/* Menu thao tác khi click */}
      {isMenuOpen && (
        <CellMenu
          request={request}
          user={user}
          onViewDetail={onViewDetail}
          onApprove={onApprove}
          onClose={onCloseMenu}
        />
      )}
    </div>
  )
}
