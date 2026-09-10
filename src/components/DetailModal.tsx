import { EMPLOYEES } from '../constants'
import type { LeaveRequest } from '../types'

interface DetailModalProps {
  request: LeaveRequest
  onClose: () => void
}

export function DetailModal({ request, onClose }: DetailModalProps) {
  const employee = EMPLOYEES.find((e) => e.id === request.employeeId)
  if (!employee) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal detail-modal" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="modal-close" onClick={onClose} aria-label="Đóng">
          ×
        </button>

        <h2 className="detail-title">CHI TIẾT ĐƠN NGHỈ PHÉP/ CÔNG TÁC</h2>

        <div className="detail-grid">
          <div className="detail-col">
            <div className="detail-row">
              <span className="label">Mã nhân viên</span>
              <span className="value">{employee.id}</span>
            </div>
            <div className="detail-row">
              <span className="label">Công ty</span>
              <span className="value">{employee.company}</span>
            </div>
            <div className="detail-row">
              <span className="label">Ngày vào làm</span>
              <span className="value">{employee.joinDate}</span>
            </div>
            <div className="detail-row">
              <span className="label">Năm</span>
              <span className="value">{request.year}</span>
            </div>
          </div>

          <div className="detail-col">
            <div className="detail-row">
              <span className="label">Tên nhân viên</span>
              <span className="value">{employee.name}</span>
            </div>
            <div className="detail-row">
              <span className="label">Khối</span>
              <span className="value">{employee.division}</span>
            </div>
            <div className="detail-row">
              <span className="label">Phòng</span>
              <span className="value">{employee.department}</span>
            </div>
            <div className="detail-row">
              <span className="label">Vị trí công việc</span>
              <span className="value">{employee.position}</span>
            </div>
          </div>

          <div className="detail-col">
            <div className="detail-row">
              <span className="label">Tập đoàn</span>
              <span className="value">{employee.group}</span>
            </div>
            <div className="detail-row">
              <span className="label">Bộ phận</span>
              <span className="value">{employee.section}</span>
            </div>
            <div className="detail-row">
              <span className="label">Loại hợp đồng</span>
              <span className="value">{employee.contractType}</span>
            </div>
          </div>
        </div>

        <div className="detail-section">
          <div className="detail-row inline">
            <span className="label">Đăng ký nghỉ/ Công tác</span>
            <span className="value italic">{request.type}</span>
          </div>
          <div className="detail-row inline">
            <span className="label">Từ ngày</span>
            <span className="value">
              {request.startDate} → {request.endDate}
            </span>
          </div>
          <div className="detail-row inline">
            <span className="label">Số ngày nghỉ/ Công tác</span>
            <span className="value">{request.totalDays}</span>
          </div>
          <div className="detail-row inline">
            <span className="label">Lý do Nghỉ/ Công tác</span>
            <span className="value">{request.reason}</span>
          </div>
          {request.note && (
            <div className="detail-row inline">
              <span className="label">Ghi chú</span>
              <span className="value">{request.note}</span>
            </div>
          )}
        </div>

        <div className="leave-info-bar">
          <strong>Thông tin phép</strong>
          <div className="leave-info-items">
            <span>Tổng số ngày phép năm: {request.leaveInfo.totalAnnual}</span>
            <span>Đã sử dụng: {request.leaveInfo.used}</span>
            <span>Số ngày phép còn lại: {request.leaveInfo.remaining}</span>
          </div>
        </div>

        <table className="history-table">
          <thead>
            <tr>
              <th>STT</th>
              <th>Mã nhân viên</th>
              <th>Tên nhân viên</th>
              <th>Vị trí công việc</th>
              <th>Tình trạng</th>
              <th>Ngày thao tác</th>
              <th>Lý do</th>
              <th>Ghi chú</th>
            </tr>
          </thead>
          <tbody>
            {request.history.map((row) => (
              <tr key={row.stt}>
                <td>{row.stt}</td>
                <td>{row.employeeId}</td>
                <td>{row.employeeName}</td>
                <td>{row.position}</td>
                <td>{row.status}</td>
                <td>{row.actionDate}</td>
                <td>{row.reason}</td>
                <td>{row.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
