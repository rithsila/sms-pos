import type {
  Employee,
  Position,
  AttendanceSchedule,
  Holiday,
  AttendanceRecord,
  LeaveRequest,
  QRCodeData,
  AttendanceSummary,
  UserRole,
} from '@/types/attendance';

// Sample Positions
export const samplePositions: Position[] = [
  {
    id: 'pos-1',
    name: 'Store Manager',
    description: 'Responsible for overall store operations and staff management',
    department: 'Management',
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z',
  },
  {
    id: 'pos-2',
    name: 'Sales Associate',
    description: 'Handles customer sales and product inquiries',
    department: 'Sales',
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z',
  },
  {
    id: 'pos-3',
    name: 'Cashier',
    description: 'Processes customer payments and handles cash register',
    department: 'Sales',
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z',
  },
  {
    id: 'pos-4',
    name: 'Stock Keeper',
    description: 'Manages inventory and stock organization',
    department: 'Operations',
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z',
  },
  {
    id: 'pos-5',
    name: 'Customer Service',
    description: 'Handles customer complaints and inquiries',
    department: 'Support',
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z',
  },
];

// Sample Employees with Roles
export const sampleEmployees: Employee[] = [
  {
    id: 'emp-1',
    name: 'John Doe',
    email: 'john.doe@shop.com',
    phone: '+1234567890',
    role: 'admin',
    positionId: 'pos-1',
    department: 'Management',
    joinDate: '2023-01-15',
    isActive: true,
    qrCode: 'qr-john-doe-001',
    createdAt: '2023-01-15T00:00:00Z',
    updatedAt: '2023-01-15T00:00:00Z',
  },
  {
    id: 'emp-2',
    name: 'Jane Smith',
    email: 'jane.smith@shop.com',
    phone: '+1234567891',
    role: 'operator',
    positionId: 'pos-1',
    department: 'Management',
    joinDate: '2023-03-20',
    isActive: true,
    qrCode: 'qr-jane-smith-002',
    createdAt: '2023-03-20T00:00:00Z',
    updatedAt: '2023-03-20T00:00:00Z',
  },
  {
    id: 'emp-3',
    name: 'Mike Johnson',
    email: 'mike.johnson@shop.com',
    phone: '+1234567892',
    role: 'employee',
    positionId: 'pos-2',
    department: 'Sales',
    joinDate: '2023-05-10',
    isActive: true,
    qrCode: 'qr-mike-johnson-003',
    createdAt: '2023-05-10T00:00:00Z',
    updatedAt: '2023-05-10T00:00:00Z',
  },
  {
    id: 'emp-4',
    name: 'Sarah Williams',
    email: 'sarah.williams@shop.com',
    phone: '+1234567893',
    role: 'employee',
    positionId: 'pos-3',
    department: 'Sales',
    joinDate: '2023-06-01',
    isActive: true,
    qrCode: 'qr-sarah-williams-004',
    createdAt: '2023-06-01T00:00:00Z',
    updatedAt: '2023-06-01T00:00:00Z',
  },
  {
    id: 'emp-5',
    name: 'Tom Brown',
    email: 'tom.brown@shop.com',
    phone: '+1234567894',
    role: 'employee',
    positionId: 'pos-4',
    department: 'Operations',
    joinDate: '2023-08-15',
    isActive: true,
    qrCode: 'qr-tom-brown-005',
    createdAt: '2023-08-15T00:00:00Z',
    updatedAt: '2023-08-15T00:00:00Z',
  },
  {
    id: 'emp-6',
    name: 'Emily Davis',
    email: 'emily.davis@shop.com',
    phone: '+1234567895',
    role: 'employee',
    positionId: 'pos-2',
    department: 'Sales',
    joinDate: '2023-10-01',
    isActive: true,
    qrCode: 'qr-emily-davis-006',
    createdAt: '2023-10-01T00:00:00Z',
    updatedAt: '2023-10-01T00:00:00Z',
  },
];

// Sample Attendance Schedules
export const sampleSchedules: AttendanceSchedule[] = [
  {
    id: 'sched-1',
    name: 'Standard Shift',
    checkInTime: '08:00',
    checkOutTime: '17:00',
    gracePeriodMinutes: 15,
    lateThresholdMinutes: 30,
    earlyLeaveThresholdMinutes: 15,
    workingDays: [1, 2, 3, 4, 5], // Monday to Friday
    isDefault: true,
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z',
  },
  {
    id: 'sched-2',
    name: 'Morning Shift',
    checkInTime: '06:00',
    checkOutTime: '14:00',
    gracePeriodMinutes: 10,
    lateThresholdMinutes: 20,
    earlyLeaveThresholdMinutes: 10,
    workingDays: [1, 2, 3, 4, 5, 6],
    isDefault: false,
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z',
  },
  {
    id: 'sched-3',
    name: 'Evening Shift',
    checkInTime: '14:00',
    checkOutTime: '22:00',
    gracePeriodMinutes: 10,
    lateThresholdMinutes: 20,
    earlyLeaveThresholdMinutes: 10,
    workingDays: [1, 2, 3, 4, 5, 6],
    isDefault: false,
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z',
  },
];

// Sample Holidays
export const sampleHolidays: Holiday[] = [
  {
    id: 'hol-1',
    name: 'New Year\'s Day',
    date: '2024-01-01',
    type: 'public',
    description: 'New Year celebration',
    isRecurring: true,
    createdAt: '2023-12-01T00:00:00Z',
  },
  {
    id: 'hol-2',
    name: 'Khmer New Year',
    date: '2024-04-13',
    type: 'public',
    description: 'Traditional Khmer New Year',
    isRecurring: true,
    createdAt: '2023-12-01T00:00:00Z',
  },
  {
    id: 'hol-3',
    name: 'Pchum Ben',
    date: '2024-10-01',
    type: 'public',
    description: 'Ancestors\' Day',
    isRecurring: true,
    createdAt: '2023-12-01T00:00:00Z',
  },
  {
    id: 'hol-4',
    name: 'Company Anniversary',
    date: '2024-06-15',
    type: 'company',
    description: 'Company founding anniversary',
    isRecurring: true,
    createdAt: '2023-12-01T00:00:00Z',
  },
  {
    id: 'hol-5',
    name: 'Staff Team Building',
    date: '2024-07-20',
    type: 'company',
    description: 'Annual team building event',
    isRecurring: false,
    createdAt: '2023-12-01T00:00:00Z',
  },
];

// Generate sample attendance records for the current month
const generateAttendanceRecords = (): AttendanceRecord[] => {
  const records: AttendanceRecord[] = [];
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  
  sampleEmployees.forEach((employee) => {
    // Generate records for each working day of the month
    for (let day = 1; day <= 28; day++) {
      const date = new Date(year, month, day);
      const dayOfWeek = date.getDay();
      
      // Skip weekends (0 = Sunday, 6 = Saturday) for standard schedule
      if (dayOfWeek === 0 || dayOfWeek === 6) continue;
      
      // Check if it's a holiday
      const dateStr = date.toISOString().split('T')[0];
      const isHoliday = sampleHolidays.some(h => h.date === dateStr);
      
      if (isHoliday) {
        records.push({
          id: `att-${employee.id}-${dateStr}`,
          employeeId: employee.id,
          date: dateStr,
          scheduleId: 'sched-1',
          status: 'holiday',
          checkInMethod: 'qr',
          createdAt: `${dateStr}T00:00:00Z`,
          updatedAt: `${dateStr}T00:00:00Z`,
        });
        continue;
      }
      
      // Random attendance status with weighted probabilities
      const rand = Math.random();
      let status: AttendanceRecord['status'] = 'present';
      let checkIn = '08:00:00';
      let checkOut = '17:00:00';
      let lateMinutes = 0;
      let workingHours = 8;
      
      if (rand < 0.05) {
        status = 'absent';
      } else if (rand < 0.15) {
        status = 'late';
        checkIn = `08:${Math.floor(Math.random() * 30 + 15).toString().padStart(2, '0')}:00`;
        lateMinutes = Math.floor(Math.random() * 30 + 15);
      } else if (rand < 0.20) {
        status = 'leave';
      }
      
      if (status !== 'absent' && status !== 'leave') {
        records.push({
          id: `att-${employee.id}-${dateStr}`,
          employeeId: employee.id,
          date: dateStr,
          scheduleId: 'sched-1',
          checkIn,
          checkOut,
          checkInMethod: Math.random() > 0.3 ? 'qr' : 'manual',
          checkOutMethod: Math.random() > 0.3 ? 'qr' : 'manual',
          status,
          workingHours,
          lateMinutes: lateMinutes > 0 ? lateMinutes : undefined,
          createdAt: `${dateStr}T${checkIn}Z`,
          updatedAt: `${dateStr}T${checkOut}Z`,
        });
      } else {
        records.push({
          id: `att-${employee.id}-${dateStr}`,
          employeeId: employee.id,
          date: dateStr,
          scheduleId: 'sched-1',
          status,
          checkInMethod: 'qr',
          createdAt: `${dateStr}T00:00:00Z`,
          updatedAt: `${dateStr}T00:00:00Z`,
        });
      }
    }
  });
  
  return records;
};

export const sampleAttendanceRecords: AttendanceRecord[] = generateAttendanceRecords();

// Sample Leave Requests
export const sampleLeaveRequests: LeaveRequest[] = [
  {
    id: 'leave-1',
    employeeId: 'emp-3',
    leaveType: 'sick',
    startDate: '2024-01-15',
    endDate: '2024-01-16',
    totalDays: 2,
    reason: 'Fever and flu symptoms',
    status: 'approved',
    approvedBy: 'emp-1',
    approvedAt: '2024-01-14T10:00:00Z',
    createdAt: '2024-01-13T09:00:00Z',
    updatedAt: '2024-01-14T10:00:00Z',
  },
  {
    id: 'leave-2',
    employeeId: 'emp-4',
    leaveType: 'vacation',
    startDate: '2024-02-10',
    endDate: '2024-02-15',
    totalDays: 6,
    reason: 'Family vacation to Siem Reap',
    status: 'pending',
    createdAt: '2024-01-20T14:00:00Z',
    updatedAt: '2024-01-20T14:00:00Z',
  },
  {
    id: 'leave-3',
    employeeId: 'emp-5',
    leaveType: 'personal',
    startDate: '2024-01-20',
    endDate: '2024-01-20',
    totalDays: 1,
    reason: 'Personal matters',
    status: 'rejected',
    approvedBy: 'emp-1',
    approvedAt: '2024-01-19T16:00:00Z',
    rejectionReason: 'Insufficient staff on that day',
    createdAt: '2024-01-18T10:00:00Z',
    updatedAt: '2024-01-19T16:00:00Z',
  },
  {
    id: 'leave-4',
    employeeId: 'emp-6',
    leaveType: 'sick',
    startDate: '2024-01-25',
    endDate: '2024-01-26',
    totalDays: 2,
    reason: 'Medical appointment',
    status: 'pending',
    createdAt: '2024-01-24T08:00:00Z',
    updatedAt: '2024-01-24T08:00:00Z',
  },
  {
    id: 'leave-5',
    employeeId: 'emp-2',
    leaveType: 'vacation',
    startDate: '2024-03-01',
    endDate: '2024-03-05',
    totalDays: 5,
    reason: 'Annual leave',
    status: 'approved',
    approvedBy: 'emp-1',
    approvedAt: '2024-02-15T11:00:00Z',
    createdAt: '2024-02-10T09:00:00Z',
    updatedAt: '2024-02-15T11:00:00Z',
  },
];

// Sample QR Codes
export const sampleQRCodes: QRCodeData[] = sampleEmployees.map((employee) => ({
  id: `qr-${employee.id}`,
  employeeId: employee.id,
  qrCode: `data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0id2hpdGUiLz48dGV4dCB4PSI1MCIgeT0iNTUiIGZvbnQtc2l6ZT0iMTAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9ImJsYWNrIj5RUiBDb2RlPC90ZXh0Pjwvc3ZnPg==`,
  expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
  createdAt: employee.createdAt,
}));

// Sample Attendance Summaries
export const sampleAttendanceSummaries: AttendanceSummary[] = sampleEmployees.map((employee) => {
  const employeeRecords = sampleAttendanceRecords.filter(r => r.employeeId === employee.id);
  const presentDays = employeeRecords.filter(r => r.status === 'present').length;
  const absentDays = employeeRecords.filter(r => r.status === 'absent').length;
  const lateDays = employeeRecords.filter(r => r.status === 'late').length;
  const leaveDays = employeeRecords.filter(r => r.status === 'leave').length;
  const holidayDays = employeeRecords.filter(r => r.status === 'holiday').length;
  const totalWorkingHours = employeeRecords.reduce((sum, r) => sum + (r.workingHours || 0), 0);
  
  return {
    employeeId: employee.id,
    month: new Date().toLocaleString('default', { month: 'long' }),
    year: new Date().getFullYear(),
    totalWorkingDays: employeeRecords.length - holidayDays,
    presentDays,
    absentDays,
    lateDays,
    leaveDays,
    holidayDays,
    totalWorkingHours,
    totalOvertimeHours: 0,
    attendanceRate: Math.round((presentDays / (employeeRecords.length - holidayDays)) * 100) || 0,
  };
});

// Helper functions
export const getEmployeeById = (id: string): Employee | undefined => {
  return sampleEmployees.find(e => e.id === id);
};

export const getPositionById = (id: string): Position | undefined => {
  return samplePositions.find(p => p.id === id);
};

export const getScheduleById = (id: string): AttendanceSchedule | undefined => {
  return sampleSchedules.find(s => s.id === id);
};

export const getHolidayByDate = (date: string): Holiday | undefined => {
  return sampleHolidays.find(h => h.date === date);
};

export const getAttendanceRecordsByEmployee = (employeeId: string): AttendanceRecord[] => {
  return sampleAttendanceRecords.filter(r => r.employeeId === employeeId);
};

export const getLeaveRequestsByEmployee = (employeeId: string): LeaveRequest[] => {
  return sampleLeaveRequests.filter(l => l.employeeId === employeeId);
};

export const getPendingLeaveRequests = (): LeaveRequest[] => {
  return sampleLeaveRequests.filter(l => l.status === 'pending');
};

export const getEmployeesByRole = (role: UserRole): Employee[] => {
  return sampleEmployees.filter(e => e.role === role);
};

export const getEmployeesByDepartment = (department: string): Employee[] => {
  return sampleEmployees.filter(e => e.department === department);
};

// Role-based permissions
export const hasPermission = (role: UserRole, permission: string): boolean => {
  const permissions: Record<UserRole, string[]> = {
    admin: ['*'], // All permissions
    operator: [
      'view_attendance',
      'edit_attendance',
      'approve_leave',
      'view_employees',
      'edit_employees',
      'view_reports',
      'export_data',
    ],
    employee: [
      'view_own_attendance',
      'request_leave',
      'view_own_profile',
      'qr_checkin',
    ],
  };
  
  const rolePermissions = permissions[role] || [];
  return rolePermissions.includes('*') || rolePermissions.includes(permission);
};
