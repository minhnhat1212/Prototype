export type RequestStatus =
  | 'create'
  | 'approving'
  | 'approved'
  | 'rejected'
  | 'cancelled'
  | 'cancel_approving'
  | 'cancel_approved'
  | 'cancel_rejected'

export type UserRole = 'employee' | 'messer'

export interface Employee {
  id: string
  name: string
  company: string
  joinDate: string
  division: string
  department: string
  section: string
  position: string
  group: string
  contractType: string
}

export interface ApprovalHistory {
  stt: number
  employeeId: string
  employeeName: string
  position: string
  status: string
  actionDate: string
  reason: string
  note: string
}

export interface LeaveRequest {
  id: string
  employeeId: string
  status: RequestStatus
  type: string
  startDate: string
  endDate: string
  startTime?: string
  endTime?: string
  totalDays: number
  reason: string
  note: string
  year: number
  leaveInfo: {
    totalAnnual: number
    used: number
    remaining: number
  }
  history: ApprovalHistory[]
}

export interface CurrentUser {
  role: UserRole
  canApprove: boolean
  name: string
}
