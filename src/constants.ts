import type { Employee, LeaveRequest, RequestStatus } from './types'

export const STATUS_CONFIG: Record<
  RequestStatus,
  { label: string; labelEn: string; color: string }
> = {
  create: { label: 'Tạo mới', labelEn: 'Create', color: '#000000' },
  approving: { label: 'Chờ phê duyệt', labelEn: 'Approving', color: '#7F6000' },
  approved: { label: 'Đã phê duyệt', labelEn: 'Approved', color: '#33CC33' },
  rejected: { label: 'Từ chối', labelEn: 'Rejected', color: '#DF2800' },
  cancelled: { label: 'Chuyển phê duyệt hủy', labelEn: 'Cancelled', color: '#FF6347' },
  cancel_approving: {
    label: 'Đang chờ phê duyệt hủy',
    labelEn: 'Cancel approving',
    color: '#FF6347',
  },
  cancel_approved: {
    label: 'Đã phê duyệt hủy',
    labelEn: 'Cancel Approved',
    color: '#228B22',
  },
  cancel_rejected: {
    label: 'Không đồng ý hủy',
    labelEn: 'Cancel rejected',
    color: '#33CC33',
  },
}

export const PENDING_APPROVAL_STATUSES: RequestStatus[] = ['approving', 'cancel_approving']

export interface LeaveTypeMeta {
  code: string
  labelVi: string
  labelEn: string
  bgColor: string
  textColor: string
}

export const LEAVE_TYPE_MAP: Record<string, LeaveTypeMeta> = {
  AL: {
    code: 'AL',
    labelVi: 'Nghỉ phép năm',
    labelEn: 'Annual Leave',
    bgColor: '#f5a623',
    textColor: '#ffffff',
  },
  BT: {
    code: 'BT',
    labelVi: 'Công tác',
    labelEn: 'Business Trip',
    bgColor: '#2563eb',
    textColor: '#ffffff',
  },
  SL: {
    code: 'SL',
    labelVi: 'Nghỉ ốm',
    labelEn: 'Sick Leave',
    bgColor: '#db2777',
    textColor: '#ffffff',
  },
  UL: {
    code: 'UL',
    labelVi: 'Nghỉ không lương',
    labelEn: 'Unpaid Leave',
    bgColor: '#4b5563',
    textColor: '#ffffff',
  },
  CL: {
    code: 'CL',
    labelVi: 'Nghỉ bù',
    labelEn: 'Compensatory Leave',
    bgColor: '#7c3aed',
    textColor: '#ffffff',
  },
}

export function resolveLeaveType(rawType: string): LeaveTypeMeta {
  const lower = rawType.toLowerCase()
  if (lower.includes('np') || lower.includes('phép') || lower.includes('al') || lower.includes('annual')) {
    return LEAVE_TYPE_MAP.AL
  }
  if (lower.includes('bt') || lower.includes('công tác') || lower.includes('business')) {
    return LEAVE_TYPE_MAP.BT
  }
  if (lower.includes('no') || lower.includes('ốm') || lower.includes('sick') || lower.includes('sl')) {
    return LEAVE_TYPE_MAP.SL
  }
  if (lower.includes('kl') || lower.includes('không lương') || lower.includes('unpaid') || lower.includes('ul')) {
    return LEAVE_TYPE_MAP.UL
  }
  if (lower.includes('bù') || lower.includes('cl') || lower.includes('compensatory')) {
    return LEAVE_TYPE_MAP.CL
  }
  const match = rawType.match(/\(([^)]+)\)/)
  const code = match ? match[1].toUpperCase() : rawType.slice(0, 2).toUpperCase()
  return {
    code,
    labelVi: rawType,
    labelEn: rawType,
    bgColor: '#f5a623',
    textColor: '#ffffff',
  }
}

export const EMPLOYEES: Employee[] = [
  {
    id: 'MYB0058',
    name: 'Hoàng Văn Cường',
    company: 'Công ty TNHH Messer Việt Nam',
    joinDate: '26/02/2022',
    division: 'Logistics',
    department: 'PG Logistics',
    section: 'Bulk Logistics',
    position: 'Lái xe tải',
    group: 'Messer tại Việt Nam',
    contractType: 'Hợp đồng vô thời hạn',
  },
  {
    id: 'MYB0012',
    name: 'Nguyễn Thị Lan',
    company: 'Công ty TNHH Messer Việt Nam',
    joinDate: '15/03/2021',
    division: 'Sản xuất',
    department: 'Phòng Sản xuất',
    section: 'Ca 1',
    position: 'Công nhân vận hành',
    group: 'Messer tại Việt Nam',
    contractType: 'Hợp đồng vô thời hạn',
  },
  {
    id: 'MYB0023',
    name: 'Trần Minh Đức',
    company: 'Công ty TNHH Messer Việt Nam',
    joinDate: '01/08/2020',
    division: 'Kỹ thuật',
    department: 'Bảo trì',
    section: 'Điện',
    position: 'Kỹ thuật viên',
    group: 'Messer tại Việt Nam',
    contractType: 'Hợp đồng vô thời hạn',
  },
  {
    id: 'MYB0034',
    name: 'Phạm Thu Hà',
    company: 'Công ty TNHH Messer Việt Nam',
    joinDate: '10/01/2023',
    division: 'Nhân sự',
    department: 'HR',
    section: 'Tuyển dụng',
    position: 'Chuyên viên HR',
    group: 'Messer tại Việt Nam',
    contractType: 'Hợp đồng thử việc',
  },
  {
    id: 'MYB0045',
    name: 'Lê Văn Hùng',
    company: 'Công ty TNHH Messer Việt Nam',
    joinDate: '20/05/2019',
    division: 'Logistics',
    department: 'Kho',
    section: 'Kho trung tâm',
    position: 'Thủ kho',
    group: 'Messer tại Việt Nam',
    contractType: 'Hợp đồng vô thời hạn',
  },
]

function makeHistory(
  employee: Employee,
  statusLabel: string,
  actionDate: string,
  reason = '',
  note = ''
) {
  return {
    stt: 1,
    employeeId: employee.id,
    employeeName: employee.name,
    position: employee.position,
    status: statusLabel,
    actionDate,
    reason,
    note,
  }
}

export function buildSampleRequests(baseYear: number, baseMonth: number): LeaveRequest[] {
  const pad = (n: number) => String(n).padStart(2, '0')
  const d = (day: number, monthOffset = 0) => {
    let m = baseMonth + monthOffset
    let y = baseYear
    while (m > 12) {
      m -= 12
      y += 1
    }
    while (m < 1) {
      m += 12
      y -= 1
    }
    return `${pad(day)}/${pad(m)}/${y}`
  }

  const leaveInfo = { totalAnnual: 12, used: 3, remaining: 9 }

  return [
    {
      id: 'REQ001',
      employeeId: 'MYB0058',
      status: 'approved',
      type: 'Nghỉ phép năm (NP)',
      startDate: d(25, 0),
      endDate: d(27, 0),
      startTime: '08:00',
      endTime: '17:00',
      totalDays: 3,
      reason: 'Test CTP MHD',
      note: '',
      year: baseYear,
      leaveInfo,
      history: [
        makeHistory(EMPLOYEES[0], 'Đã phê duyệt', `${d(24, 0)} 23:59:43`),
      ],
    },
    {
      id: 'REQ002',
      employeeId: 'MYB0012',
      status: 'approving',
      type: 'Nghỉ phép năm (NP)',
      startDate: d(22, 0),
      endDate: d(23, 0),
      startTime: '08:00',
      endTime: '17:00',
      totalDays: 2,
      reason: 'Nghỉ cá nhân',
      note: '',
      year: baseYear,
      leaveInfo,
      history: [
        makeHistory(EMPLOYEES[1], 'Chờ phê duyệt', `${d(21, 0)} 08:30:00`),
      ],
    },
    {
      id: 'REQ003',
      employeeId: 'MYB0023',
      status: 'create',
      type: 'Nghỉ ốm (NO)',
      startDate: d(24, 0),
      endDate: d(24, 0),
      startTime: '08:00',
      endTime: '12:00',
      totalDays: 0.5,
      reason: 'Khám bệnh buổi sáng',
      note: '',
      year: baseYear,
      leaveInfo,
      history: [makeHistory(EMPLOYEES[2], 'Tạo mới', `${d(23, 0)} 14:00:00`)],
    },
    {
      id: 'REQ004',
      employeeId: 'MYB0034',
      status: 'rejected',
      type: 'Nghỉ phép năm (NP)',
      startDate: d(26, 0),
      endDate: d(28, 0),
      startTime: '08:00',
      endTime: '17:00',
      totalDays: 3,
      reason: 'Du lịch',
      note: 'Không đủ nhân sự',
      year: baseYear,
      leaveInfo,
      history: [
        makeHistory(EMPLOYEES[3], 'Từ chối', `${d(25, 0)} 10:15:22`, 'Không đủ nhân sự'),
      ],
    },
    {
      id: 'REQ005',
      employeeId: 'MYB0045',
      status: 'cancelled',
      type: 'Công tác (BT)',
      startDate: d(20, 0),
      endDate: d(21, 0),
      startTime: '08:00',
      endTime: '17:00',
      totalDays: 2,
      reason: 'Gia đình',
      note: '',
      year: baseYear,
      leaveInfo,
      history: [
        makeHistory(EMPLOYEES[4], 'Chuyển phê duyệt hủy', `${d(19, 0)} 16:45:00`),
      ],
    },
    {
      id: 'REQ006',
      employeeId: 'MYB0012',
      status: 'cancel_approving',
      type: 'Công tác (BT)',
      startDate: d(5, 1),
      endDate: d(6, 1),
      startTime: '08:00',
      endTime: '17:00',
      totalDays: 2,
      reason: 'Hủy công tác',
      note: '',
      year: baseYear,
      leaveInfo,
      history: [
        makeHistory(EMPLOYEES[1], 'Đang chờ phê duyệt hủy', `${d(4, 1)} 09:00:00`),
      ],
    },
    {
      id: 'REQ007',
      employeeId: 'MYB0023',
      status: 'cancel_approved',
      type: 'Nghỉ phép năm (NP)',
      startDate: d(10, 1),
      endDate: d(11, 1),
      startTime: '08:00',
      endTime: '17:00',
      totalDays: 2,
      reason: 'Thay đổi kế hoạch',
      note: '',
      year: baseYear,
      leaveInfo,
      history: [
        makeHistory(EMPLOYEES[2], 'Đã phê duyệt hủy', `${d(9, 1)} 11:30:00`),
      ],
    },
    {
      id: 'REQ008',
      employeeId: 'MYB0034',
      status: 'cancel_rejected',
      type: 'Nghỉ phép năm (NP)',
      startDate: d(15, 1),
      endDate: d(16, 1),
      startTime: '08:00',
      endTime: '17:00',
      totalDays: 2,
      reason: 'Không hủy được',
      note: '',
      year: baseYear,
      leaveInfo,
      history: [
        makeHistory(EMPLOYEES[3], 'Không đồng ý hủy', `${d(14, 1)} 15:20:00`),
      ],
    },
    {
      id: 'REQ009',
      employeeId: 'MYB0058',
      status: 'approving',
      type: 'Nghỉ phép năm (NP)',
      startDate: d(2, 1),
      endDate: d(3, 1),
      startTime: '08:00',
      endTime: '17:00',
      totalDays: 2,
      reason: 'Việc riêng',
      note: '',
      year: baseYear,
      leaveInfo,
      history: [
        makeHistory(EMPLOYEES[0], 'Chờ phê duyệt', `${d(1, 1)} 07:45:00`),
      ],
    },
  ]
}
