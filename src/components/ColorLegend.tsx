import { LEAVE_TYPE_MAP, STATUS_CONFIG } from '../constants'
import type { RequestStatus } from '../types'

const LEGEND_ORDER: RequestStatus[] = [
  'create',
  'approving',
  'approved',
  'rejected',
  'cancelled',
  'cancel_approving',
  'cancel_approved',
  'cancel_rejected',
]

export function ColorLegend() {
  return (
    <div className="color-legend-container">
      {/* Khối giải thích cấu trúc ô đơn nghỉ */}
      <div className="color-legend-card">
        <h3>QUY CÁCH HIỂN THỊ Ô ĐƠN NGHỈ (LEAVE CELL)</h3>
        <div className="legend-cell-preview">
          <div className="preview-demo-cell">
            <div className="preview-top">
              <span>08:00</span>
              <span>17:00</span>
              <span className="preview-status-badge" title="Đã phê duyệt">✓</span>
            </div>
            <div className="preview-bottom">AL</div>
          </div>
          <div className="preview-description">
            <p>
              <strong>Nửa trên (Xanh lá):</strong> Khung giờ ca nghỉ / làm việc (Ví dụ: <code>08:00</code> đến <code>17:00</code>). Góc phải có chấm ký hiệu trạng thái duyệt (<code>✓</code> Đã duyệt, <code>⏳</code> Chờ duyệt, <code>✕</code> Từ chối).
            </p>
            <p>
              <strong>Nửa dưới:</strong> Mã viết tắt loại đơn nghỉ theo màu đặc trưng (Ví dụ: <code>AL</code> - Nghỉ phép năm). Rê chuột vào ô để xem toàn bộ thông tin chi tiết.
            </p>
          </div>
        </div>

        <h4>DANH MỤC MÃ LOẠI NGHỈ</h4>
        <div className="leave-types-grid">
          {Object.values(LEAVE_TYPE_MAP).map((item) => (
            <div key={item.code} className="leave-type-badge-item">
              <span
                className="type-tag"
                style={{ backgroundColor: item.bgColor, color: item.textColor }}
              >
                {item.code}
              </span>
              <span className="type-desc">
                {item.labelVi} <em>({item.labelEn})</em>
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Bảng trạng thái duyệt */}
      <div className="color-legend-card">
        <h3>CHÚ THÍCH MÀU THEO TÌNH TRẠNG ĐƠN</h3>
        <table>
          <thead>
            <tr>
              <th>Tình trạng</th>
              <th>Status</th>
              <th>Ký hiệu</th>
              <th>Mẫu chữ</th>
            </tr>
          </thead>
          <tbody>
            {LEGEND_ORDER.map((status) => {
              const cfg = STATUS_CONFIG[status]
              let symbol = '•'
              if (status === 'approved' || status === 'cancel_approved') symbol = '✓'
              else if (status === 'approving' || status === 'cancel_approving') symbol = '⏳'
              else if (status === 'rejected' || status === 'cancel_rejected') symbol = '✕'
              else if (status === 'cancelled') symbol = '⊘'

              return (
                <tr key={status}>
                  <td>{cfg.label}</td>
                  <td>{cfg.labelEn}</td>
                  <td style={{ textAlign: 'center', fontWeight: 'bold', color: cfg.color }}>{symbol}</td>
                  <td>
                    <span style={{ color: cfg.color, fontWeight: 600 }}>{cfg.labelEn}</span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
