import { useMemo, useState } from 'react'
import { EMPLOYEES } from '../constants'
import type { CurrentUser, Employee, LeaveRequest } from '../types'
import { buildGridDates, isDateInRange } from '../utils/dateUtils'
import { DetailModal } from './DetailModal'
import { LeaveCell } from './LeaveCell'

interface LeaveGridProps {
  requests: LeaveRequest[]
  employees?: Employee[]
  user: CurrentUser
  onNavigateToApproval: (requestId: string) => void
}

type ActiveMenu = { requestId: string; employeeId: string; dateKey: string }

export function LeaveGrid({ requests, employees, user, onNavigateToApproval }: LeaveGridProps) {
  const dates = useMemo(() => buildGridDates(), [])
  const [activeMenu, setActiveMenu] = useState<ActiveMenu | null>(null)
  const [detailRequest, setDetailRequest] = useState<LeaveRequest | null>(null)
  const displayEmployees = employees ?? EMPLOYEES

  const requestsByCell = useMemo(() => {
    const map = new Map<string, LeaveRequest[]>()
    for (const req of requests) {
      for (const date of dates) {
        if (isDateInRange(date.key, req.startDate, req.endDate)) {
          const key = `${req.employeeId}|${date.key}`
          const list = map.get(key) ?? []
          list.push(req)
          map.set(key, list)
        }
      }
    }
    return map
  }, [requests, dates])

  function getCellRequests(employeeId: string, dateKey: string): LeaveRequest[] {
    return requestsByCell.get(`${employeeId}|${dateKey}`) ?? []
  }

  return (
    <>
      <div className="grid-wrapper">
        <table className="leave-grid">
          <thead>
            <tr>
              <th className="sticky-col employee-header">Nhân viên</th>
              {dates.map((date) => (
                <th
                  key={date.key}
                  className="date-header"
                  title={`${date.weekday}, ${date.label}`}
                >
                  <span className="date-weekday">{date.weekday}</span>
                  <span className="date-label">{date.day}/{date.month}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {displayEmployees.length === 0 ? (
              <tr>
                <td
                  colSpan={dates.length + 1}
                  style={{
                    textAlign: 'center',
                    padding: '36px 16px',
                    color: '#666',
                    fontSize: '13px',
                    background: '#fcfcfc',
                  }}
                >
                  Không tìm thấy nhân viên nào phù hợp với điều kiện tìm kiếm.
                </td>
              </tr>
            ) : (
              displayEmployees.map((employee) => (
                <tr key={employee.id}>
                <td className="sticky-col employee-cell">
                  <div className="employee-name">{employee.name}</div>
                  <div className="employee-id">{employee.id}</div>
                </td>
                {dates.map((date) => {
                  const cellRequests = getCellRequests(employee.id, date.key)
                  return (
                    <td
                      key={date.key}
                      className="grid-cell"
                    >
                      {cellRequests.map((req) => {
                        const menuOpen =
                          activeMenu?.requestId === req.id &&
                          activeMenu.employeeId === employee.id &&
                          activeMenu.dateKey === date.key

                        return (
                          <LeaveCell
                            key={req.id}
                            request={req}
                            user={user}
                            isMenuOpen={menuOpen}
                            onToggleMenu={() =>
                              setActiveMenu(
                                menuOpen
                                  ? null
                                  : {
                                      requestId: req.id,
                                      employeeId: employee.id,
                                      dateKey: date.key,
                                    }
                              )
                            }
                            onViewDetail={() => {
                              setDetailRequest(req)
                              setActiveMenu(null)
                            }}
                            onApprove={() => {
                              onNavigateToApproval(req.id)
                              setActiveMenu(null)
                            }}
                            onCloseMenu={() => setActiveMenu(null)}
                          />
                        )
                      })}
                    </td>
                  )
                })}
              </tr>
            ))
          )}
          </tbody>
        </table>
      </div>

      {detailRequest && (
        <DetailModal request={detailRequest} onClose={() => setDetailRequest(null)} />
      )}
    </>
  )
}
