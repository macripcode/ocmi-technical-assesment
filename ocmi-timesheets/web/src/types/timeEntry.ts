export interface TimeEntry {
  id:          string;
  employeeId:  string;
  date:        string; // ISO string from API, "YYYY-MM-DD" in mock
  hoursWorked: number;
  createdAt:   string;
  updatedAt:   string;
}
