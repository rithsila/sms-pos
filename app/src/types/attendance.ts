// Enhanced Attendance System Types

export type UserRole = 'admin' | 'operator' | 'employee';

export type AttendanceStatus = 'present' | 'absent' | 'late' | 'leave' | 'holiday' | 'pending';

export type LeaveStatus = 'pending' | 'approved' | 'rejected';

export type LeaveType = 'sick' | 'vacation' | 'personal' | 'other';

export interface Position {
  id: string;
  name: string;
  description: string;
  department: string;
  createdAt: string;
  updatedAt: string;
}

export interface Employee {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  role: UserRole;
  positionId: string;
  position?: Position;
  department: string;
  joinDate: string;
  isActive: boolean;
  qrCode?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AttendanceSchedule {
  id: string;
  name: string;
  checkInTime: string; // HH:mm format
  checkOutTime: string; // HH:mm format
  gracePeriodMinutes: number;
  lateThresholdMinutes: number;
  earlyLeaveThresholdMinutes: number;
  workingDays: number[]; // 0 = Sunday, 6 = Saturday
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Holiday {
  id: string;
  name: string;
  date: string; // YYYY-MM-DD format
  type: 'public' | 'company' | 'optional';
  description?: string;
  isRecurring: boolean;
  createdAt: string;
}

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  employee?: Employee;
  date: string;
  scheduleId: string;
  schedule?: AttendanceSchedule;
  checkIn?: string; // HH:mm:ss format
  checkOut?: string; // HH:mm:ss format
  checkInLocation?: string;
  checkOutLocation?: string;
  checkInMethod: 'qr' | 'manual' | 'api';
  checkOutMethod?: 'qr' | 'manual' | 'api';
  status: AttendanceStatus;
  workingHours?: number;
  overtimeHours?: number;
  lateMinutes?: number;
  earlyLeaveMinutes?: number;
  notes?: string;
  approvedBy?: string;
  approvedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LeaveRequest {
  id: string;
  employeeId: string;
  employee?: Employee;
  leaveType: LeaveType;
  startDate: string;
  endDate: string;
  totalDays: number;
  reason: string;
  status: LeaveStatus;
  approvedBy?: string;
  approvedByEmployee?: Employee;
  approvedAt?: string;
  rejectionReason?: string;
  attachments?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface QRCodeData {
  id: string;
  employeeId: string;
  employee?: Employee;
  qrCode: string; // Base64 encoded QR code
  expiresAt: string;
  createdAt: string;
}

export interface AttendanceSummary {
  employeeId: string;
  employee?: Employee;
  month: string;
  year: number;
  totalWorkingDays: number;
  presentDays: number;
  absentDays: number;
  lateDays: number;
  leaveDays: number;
  holidayDays: number;
  totalWorkingHours: number;
  totalOvertimeHours: number;
  averageCheckIn?: string;
  averageCheckOut?: string;
  attendanceRate: number;
}

export interface BulkOperation {
  ids: string[];
  action: 'delete' | 'update' | 'export';
  data?: Record<string, any>;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T> {
  data: T[];
  currentPage: number;
  lastPage: number;
  perPage: number;
  total: number;
}

// Filter Types
export interface AttendanceFilter {
  employeeId?: string;
  startDate?: string;
  endDate?: string;
  status?: AttendanceStatus;
  department?: string;
}

export interface LeaveFilter {
  employeeId?: string;
  status?: LeaveStatus;
  leaveType?: LeaveType;
  startDate?: string;
  endDate?: string;
}
