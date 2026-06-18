const en = {
  nav: {
    employees:     'Employees',
    timeEntries:   'Time Entries',
    weeklySummary: 'Weekly Summary',
  },
  common: {
    theme: { light: 'Light', dark: 'Dark' },
  },
  employees: {
    title:        'Employees',
    addEmployee:  'Add Employee',
    showInactive: 'Show Inactive',
    table: {
      name:       'Name',
      hourlyRate: 'Hourly Rate',
      status:     'Status',
      actions:    'Actions',
    },
    status: {
      active:   'Active',
      inactive: 'Inactive',
    },
    actions: {
      edit:       'Edit',
      deactivate: 'Deactivate',
      reactivate: 'Reactivate',
    },
    sort: {
      label:     'Sort by',
      name:      'First name',
      lastName:  'Last name',
      createdAt: 'Created date',
      updatedAt: 'Updated date',
      asc:       'A → Z',
      desc:      'Z → A',
      newest:    'Newest first',
      oldest:    'Oldest first',
    },
    empty: 'No employees found.',
    form: {
      titleAdd:   'Add Employee',
      titleEdit:  'Edit Employee',
      name:       'First name',
      lastName:   'Last name',
      hourlyRate: 'Hourly rate ($/hr)',
      save:       'Save',
      cancel:     'Cancel',
    },
  },
  timeEntries: {
    title:          'Time Entries',
    selectEmployee: 'Employee',
    addEntry:       '+ Log time',
    form: {
      label: 'Log time',
      date:  'Date',
      hours: 'Hours',
      save:  'Save',
    },
    actions: {
      edit:   'Edit entry',
      delete: 'Delete entry',
    },
    empty: 'No time entries for this employee.',
  },
  weeklySummary: {
    title:     'Weekly Summary',
    weekOf:    'Week of',
    regular:   'Regular',
    overtime:  'Overtime',
    pay:       'Pay',
    locked:    'Locked',
    noEntries: 'No time entries this week.',
    actions: {
      approve: 'Approve',
      reject:  'Reject',
    },
    status: {
      pending:  'Pending',
      approved: 'Approved',
      rejected: 'Rejected',
    },
  },
} as const;

export default en;

// Recursively replaces all leaf types with string so Spanish translations
// are not forced to match the exact English literal values.
type DeepString<T> = T extends object
  ? { [K in keyof T]: DeepString<T[K]> }
  : string;

export type Translations = DeepString<typeof en>;
