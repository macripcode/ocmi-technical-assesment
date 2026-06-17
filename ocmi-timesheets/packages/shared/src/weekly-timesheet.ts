export type WeeklyTimesheetStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface WeeklyTimesheet {
  id: string;
  employeeId: string;
  weekStart: Date;
  status: WeeklyTimesheetStatus;
  createdAt: Date;
  updatedAt: Date;
}
