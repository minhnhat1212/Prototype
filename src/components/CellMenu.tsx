import { useEffect, useRef } from 'react'
import { PENDING_APPROVAL_STATUSES } from '../constants'
import type { CurrentUser, LeaveRequest } from '../types'

interface CellMenuProps {
  request: LeaveRequest
  user: CurrentUser
  onViewDetail: () => void
  onApprove: () => void
  onClose: () => void
}

export function CellMenu({ request, user, onViewDetail, onApprove, onClose }: CellMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null)
  const isPending = PENDING_APPROVAL_STATUSES.includes(request.status)
  const showApproveOption = user.canApprove && isPending

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose()
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [onClose])

  return (
    <div className="cell-menu" ref={menuRef}>
      <button type="button" className="cell-menu-item" onClick={onViewDetail}>
        Xem chi tiết
      </button>
      {showApproveOption && (
        <button type="button" className="cell-menu-item approve" onClick={onApprove}>
          Duyệt đơn
        </button>
      )}
    </div>
  )
}
