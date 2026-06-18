export type WeeklyStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface WeeklySummaryEntry {
  employeeId:    string;
  employeeName:  string;
  regularHours:  number;
  overtimeHours: number;
  regularPay:    number;
  overtimePay:   number;
  totalPay:      number;
  status:        WeeklyStatus;
}
