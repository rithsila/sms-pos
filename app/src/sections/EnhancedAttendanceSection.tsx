import { useState, useMemo } from 'react';
import { 
  Check, 
  Clock, 
  AlertCircle, 
  UserCheck, 
  UserX, 
  Coffee,
  ChevronLeft,
  ChevronRight,
  Search,
  Filter,
  Plus,
  Edit2,
  Trash2,
  Download,
  FileSpreadsheet,
  FileText,
  QrCode,
  Calendar,
  Users,
  Briefcase,
  Sun,
  X,
  MoreHorizontal,
  Shield,
  XCircle,
  CheckCircle,
  Clock4,
  AlertTriangle,
  BarChart3,
  UserPlus,
  Printer,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import type { 
  Employee, 
  Position, 
  AttendanceSchedule, 
  Holiday, 
  AttendanceRecord, 
  LeaveRequest,
  UserRole,
  LeaveType,
  AttendanceStatus,
  LeaveStatus,
} from '@/types/attendance';
import {
  sampleEmployees,
  samplePositions,
  sampleSchedules,
  sampleHolidays,
  sampleAttendanceRecords,
  sampleLeaveRequests,
  hasPermission,
  getEmployeeById,
  getPositionById,
} from '@/data/attendanceStore';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isToday, addMonths, subMonths } from 'date-fns';

// Role Badge Component
const RoleBadge = ({ role }: { role: UserRole }) => {
  const styles = {
    admin: 'bg-purple-100 text-purple-700 border-purple-200',
    operator: 'bg-blue-100 text-blue-700 border-blue-200',
    employee: 'bg-green-100 text-green-700 border-green-200',
  };
  
  const labels = {
    admin: 'Admin',
    operator: 'Operator',
    employee: 'Employee',
  };
  
  return (
    <Badge variant="outline" className={`${styles[role]} font-medium`}>
      <Shield className="w-3 h-3 mr-1" />
      {labels[role]}
    </Badge>
  );
};

// Status Badge Component
const StatusBadge = ({ status }: { status: AttendanceStatus | LeaveStatus }) => {
  const styles: Record<string, string> = {
    present: 'bg-green-100 text-green-700 border-green-200',
    absent: 'bg-red-100 text-red-700 border-red-200',
    late: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    leave: 'bg-blue-100 text-blue-700 border-blue-200',
    holiday: 'bg-purple-100 text-purple-700 border-purple-200',
    pending: 'bg-orange-100 text-orange-700 border-orange-200',
    approved: 'bg-green-100 text-green-700 border-green-200',
    rejected: 'bg-red-100 text-red-700 border-red-200',
  };
  
  const icons: Record<string, React.ElementType> = {
    present: CheckCircle,
    absent: XCircle,
    late: Clock4,
    leave: Coffee,
    holiday: Sun,
    pending: AlertTriangle,
    approved: CheckCircle,
    rejected: XCircle,
  };
  
  const Icon = icons[status] || AlertCircle;
  
  return (
    <Badge variant="outline" className={`${styles[status]} font-medium capitalize`}>
      <Icon className="w-3 h-3 mr-1" />
      {status}
    </Badge>
  );
};

// QR Code Display Component
const QRCodeDisplay = ({ employee, onDownload }: { employee: Employee; onDownload: () => void }) => (
  <div className="flex flex-col items-center p-6 bg-white rounded-xl border border-gray-200">
    <div className="w-48 h-48 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
      <QrCode className="w-32 h-32 text-gray-400" />
    </div>
    <p className="font-semibold text-gray-900">{employee.name}</p>
    <p className="text-sm text-gray-500">{getPositionById(employee.positionId)?.name}</p>
    <Button variant="outline" size="sm" className="mt-4" onClick={onDownload}>
      <Download className="w-4 h-4 mr-2" />
      Download PDF
    </Button>
  </div>
);

export default function EnhancedAttendanceSection() {
  // Current user role (simulated - in real app would come from auth context)
  const currentUserRole: UserRole = 'admin';
  const currentUserId = 'emp-1';
  
  // State
  const [activeTab, setActiveTab] = useState('dashboard');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedRecords, setSelectedRecords] = useState<string[]>([]);
  
  // Dialog states
  const [isEmployeeDialogOpen, setIsEmployeeDialogOpen] = useState(false);
  const [isPositionDialogOpen, setIsPositionDialogOpen] = useState(false);
  const [isScheduleDialogOpen, setIsScheduleDialogOpen] = useState(false);
  const [isHolidayDialogOpen, setIsHolidayDialogOpen] = useState(false);
  const [isLeaveDialogOpen, setIsLeaveDialogOpen] = useState(false);
  const [isQRDialogOpen, setIsQRDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [editingPosition, setEditingPosition] = useState<Position | null>(null);
  const [editingSchedule, setEditingSchedule] = useState<AttendanceSchedule | null>(null);
  const [editingHoliday, setEditingHoliday] = useState<Holiday | null>(null);
  
  // Form states
  const [employeeForm, setEmployeeForm] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'employee' as UserRole,
    positionId: '',
    department: '',
  });
  
  const [positionForm, setPositionForm] = useState({
    name: '',
    description: '',
    department: '',
  });
  
  const [scheduleForm, setScheduleForm] = useState({
    name: '',
    checkInTime: '08:00',
    checkOutTime: '17:00',
    gracePeriodMinutes: 15,
    lateThresholdMinutes: 30,
    earlyLeaveThresholdMinutes: 15,
    workingDays: [1, 2, 3, 4, 5],
    isDefault: false,
  });
  
  const [holidayForm, setHolidayForm] = useState({
    name: '',
    date: '',
    type: 'public' as 'public' | 'company' | 'optional',
    description: '',
    isRecurring: false,
  });
  
  const [leaveForm, setLeaveForm] = useState({
    leaveType: 'sick' as LeaveType,
    startDate: '',
    endDate: '',
    reason: '',
  });

  // Data states
  const [employees, setEmployees] = useState<Employee[]>(sampleEmployees);
  const [positions, setPositions] = useState<Position[]>(samplePositions);
  const [schedules, setSchedules] = useState<AttendanceSchedule[]>(sampleSchedules);
  const [holidays, setHolidays] = useState<Holiday[]>(sampleHolidays);
  const [attendanceRecords] = useState<AttendanceRecord[]>(sampleAttendanceRecords);
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>(sampleLeaveRequests);

  // Derived data
  const departments = useMemo(() => 
    [...new Set(employees.map(e => e.department))],
    [employees]
  );
  
  const filteredEmployees = useMemo(() => {
    return employees.filter(emp => {
      const matchesSearch = emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           emp.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDept = selectedDepartment === 'all' || emp.department === selectedDepartment;
      return matchesSearch && matchesDept;
    });
  }, [employees, searchTerm, selectedDepartment]);
  
  const pendingLeaves = useMemo(() => 
    leaveRequests.filter(l => l.status === 'pending'),
    [leaveRequests]
  );
  
  const todayAttendance = useMemo(() => {
    const today = format(new Date(), 'yyyy-MM-dd');
    return attendanceRecords.filter(r => r.date === today);
  }, [attendanceRecords]);

  // Statistics
  const stats = useMemo(() => {
    const today = format(new Date(), 'yyyy-MM-dd');
    const todayRecords = attendanceRecords.filter(r => r.date === today);
    
    return {
      totalEmployees: employees.length,
      activeEmployees: employees.filter(e => e.isActive).length,
      presentToday: todayRecords.filter(r => r.status === 'present').length,
      absentToday: todayRecords.filter(r => r.status === 'absent').length,
      lateToday: todayRecords.filter(r => r.status === 'late').length,
      onLeaveToday: todayRecords.filter(r => r.status === 'leave').length,
      pendingLeaves: pendingLeaves.length,
      upcomingHolidays: holidays.filter(h => new Date(h.date) > new Date()).length,
    };
  }, [employees, attendanceRecords, pendingLeaves, holidays]);

  // Handlers
  const handleAddEmployee = () => {
    if (!employeeForm.name || !employeeForm.email || !employeeForm.positionId) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    const newEmployee: Employee = {
      id: `emp-${Date.now()}`,
      ...employeeForm,
      joinDate: format(new Date(), 'yyyy-MM-dd'),
      isActive: true,
      qrCode: `qr-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    setEmployees([...employees, newEmployee]);
    toast.success('Employee added successfully!');
    setIsEmployeeDialogOpen(false);
    setEmployeeForm({ name: '', email: '', phone: '', role: 'employee', positionId: '', department: '' });
  };
  
  const handleAddPosition = () => {
    if (!positionForm.name) {
      toast.error('Please enter position name');
      return;
    }
    
    const newPosition: Position = {
      id: `pos-${Date.now()}`,
      ...positionForm,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    setPositions([...positions, newPosition]);
    toast.success('Position added successfully!');
    setIsPositionDialogOpen(false);
    setPositionForm({ name: '', description: '', department: '' });
  };
  
  const handleAddSchedule = () => {
    if (!scheduleForm.name) {
      toast.error('Please enter schedule name');
      return;
    }
    
    const newSchedule: AttendanceSchedule = {
      id: `sched-${Date.now()}`,
      ...scheduleForm,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    setSchedules([...schedules, newSchedule]);
    toast.success('Schedule added successfully!');
    setIsScheduleDialogOpen(false);
  };
  
  const handleAddHoliday = () => {
    if (!holidayForm.name || !holidayForm.date) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    const newHoliday: Holiday = {
      id: `hol-${Date.now()}`,
      ...holidayForm,
      createdAt: new Date().toISOString(),
    };
    
    setHolidays([...holidays, newHoliday]);
    toast.success('Holiday added successfully!');
    setIsHolidayDialogOpen(false);
    setHolidayForm({ name: '', date: '', type: 'public', description: '', isRecurring: false });
  };
  
  const handleSubmitLeave = () => {
    if (!leaveForm.startDate || !leaveForm.endDate || !leaveForm.reason) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    const start = new Date(leaveForm.startDate);
    const end = new Date(leaveForm.endDate);
    const totalDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    
    const newLeave: LeaveRequest = {
      id: `leave-${Date.now()}`,
      employeeId: currentUserId,
      ...leaveForm,
      totalDays,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    setLeaveRequests([...leaveRequests, newLeave]);
    toast.success('Leave request submitted successfully!');
    setIsLeaveDialogOpen(false);
    setLeaveForm({ leaveType: 'sick', startDate: '', endDate: '', reason: '' });
  };
  
  const handleApproveLeave = (leaveId: string, approve: boolean) => {
    setLeaveRequests(leaveRequests.map(leave => 
      leave.id === leaveId 
        ? { 
            ...leave, 
            status: approve ? 'approved' : 'rejected',
            approvedBy: currentUserId,
            approvedAt: new Date().toISOString(),
          }
        : leave
    ));
    toast.success(approve ? 'Leave approved!' : 'Leave rejected!');
  };
  
  const handleBulkDelete = () => {
    if (selectedRecords.length === 0) {
      toast.error('Please select records to delete');
      return;
    }
    
    if (confirm(`Are you sure you want to delete ${selectedRecords.length} records?`)) {
      // In real app, would delete from backend
      toast.success(`${selectedRecords.length} records deleted!`);
      setSelectedRecords([]);
    }
  };
  
  const handleExport = (format: 'csv' | 'excel') => {
    toast.success(`Data exported as ${format.toUpperCase()}!`);
  };
  
  const handleDownloadQR = (employee: Employee) => {
    toast.success(`QR Code for ${employee.name} downloaded!`);
  };
  
  const toggleRecordSelection = (id: string) => {
    setSelectedRecords(prev => 
      prev.includes(id) 
        ? prev.filter(r => r !== id)
        : [...prev, id]
    );
  };
  
  const selectAllRecords = (records: { id: string }[]) => {
    if (selectedRecords.length === records.length) {
      setSelectedRecords([]);
    } else {
      setSelectedRecords(records.map(r => r.id));
    }
  };

  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(currentDate),
    end: endOfMonth(currentDate),
  });

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

  const getAttendanceForDay = (employeeId: string, date: Date): AttendanceRecord | undefined => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return attendanceRecords.find(r => r.employeeId === employeeId && r.date === dateStr);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present': return { bg: 'var(--color-success-light)', text: 'hsl(var(--success))', icon: Check };
      case 'absent': return { bg: 'var(--color-destructive-light)', text: 'hsl(var(--destructive))', icon: UserX };
      case 'late': return { bg: 'var(--color-warning-light)', text: 'hsl(var(--warning))', icon: Clock };
      case 'leave': return { bg: 'var(--color-primary-light-bg)', text: 'hsl(var(--primary))', icon: Coffee };
      case 'holiday': return { bg: 'var(--color-secondary-light-bg)', text: 'hsl(var(--secondary))', icon: Sun };
      default: return { bg: 'hsl(var(--background))', text: 'hsl(var(--muted-foreground))', icon: AlertCircle };
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="mb-6 animate-fadeInDown">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">Attendance Management</h1>
            <p className="text-muted-foreground">Comprehensive employee attendance tracking system</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {hasPermission(currentUserRole, 'edit_attendance') && (
              <Button variant="outline" onClick={() => setIsLeaveDialogOpen(true)}>
                <Calendar className="w-4 h-4 mr-2" />
                Request Leave
              </Button>
            )}
            <Button variant="outline" onClick={() => handleExport('csv')}>
              <FileText className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
            <Button variant="outline" onClick={() => handleExport('excel')}>
              <FileSpreadsheet className="w-4 h-4 mr-2" />
              Export Excel
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content Tabs - Moved above KPI cards */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 lg:w-auto mb-6">
          <TabsTrigger value="dashboard">
            <BarChart3 className="w-4 h-4 mr-2" />
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="attendance">
            <Calendar className="w-4 h-4 mr-2" />
            Attendance
          </TabsTrigger>
          <TabsTrigger value="employees">
            <Users className="w-4 h-4 mr-2" />
            Employees
          </TabsTrigger>
          <TabsTrigger value="positions">
            <Briefcase className="w-4 h-4 mr-2" />
            Positions
          </TabsTrigger>
          <TabsTrigger value="schedules">
            <Clock className="w-4 h-4 mr-2" />
            Schedules
          </TabsTrigger>
          <TabsTrigger value="holidays">
            <Sun className="w-4 h-4 mr-2" />
            Holidays
          </TabsTrigger>
          <TabsTrigger value="leaves">
            <Calendar className="w-4 h-4 mr-2" />
            Leaves
          </TabsTrigger>
          <TabsTrigger value="qrcheckin">
            <QrCode className="w-4 h-4 mr-2" />
            QR Check-in
          </TabsTrigger>
        </TabsList>

        {/* Stats Overview - Now below tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4 mb-4">
          <Card className="card-hover animate-fadeIn" style={{ animationDelay: '100ms' }}>
            <CardContent className="p-4 text-center">
              <Users className="w-5 h-5 text-primary mx-auto mb-2" />
              <p className="text-xl font-bold text-foreground">{stats.totalEmployees}</p>
              <p className="text-xs text-muted-foreground">Total Staff</p>
            </CardContent>
          </Card>
          <Card className="card-hover animate-fadeIn" style={{ animationDelay: '150ms' }}>
            <CardContent className="p-4 text-center">
              <UserCheck className="w-5 h-5 text-success mx-auto mb-2" />
              <p className="text-xl font-bold text-foreground">{stats.presentToday}</p>
              <p className="text-xs text-muted-foreground">Present Today</p>
            </CardContent>
          </Card>
          <Card className="card-hover animate-fadeIn" style={{ animationDelay: '200ms' }}>
            <CardContent className="p-4 text-center">
              <UserX className="w-5 h-5 text-destructive mx-auto mb-2" />
              <p className="text-xl font-bold text-foreground">{stats.absentToday}</p>
              <p className="text-xs text-muted-foreground">Absent Today</p>
            </CardContent>
          </Card>
          <Card className="card-hover animate-fadeIn" style={{ animationDelay: '250ms' }}>
            <CardContent className="p-4 text-center">
              <Clock className="w-5 h-5 text-warning mx-auto mb-2" />
              <p className="text-xl font-bold text-foreground">{stats.lateToday}</p>
              <p className="text-xs text-muted-foreground">Late Today</p>
            </CardContent>
          </Card>
          <Card className="card-hover animate-fadeIn" style={{ animationDelay: '300ms' }}>
            <CardContent className="p-4 text-center">
              <Coffee className="w-5 h-5 text-secondary mx-auto mb-2" />
              <p className="text-xl font-bold text-foreground">{stats.onLeaveToday}</p>
              <p className="text-xs text-muted-foreground">On Leave</p>
            </CardContent>
          </Card>
          <Card className="card-hover animate-fadeIn" style={{ animationDelay: '350ms' }}>
            <CardContent className="p-4 text-center">
              <AlertTriangle className="w-5 h-5 text-[#ff6d00] mx-auto mb-2" />
              <p className="text-xl font-bold text-foreground">{stats.pendingLeaves}</p>
              <p className="text-xs text-muted-foreground">Pending Leaves</p>
            </CardContent>
          </Card>
          <Card className="card-hover animate-fadeIn" style={{ animationDelay: '400ms' }}>
            <CardContent className="p-4 text-center">
              <Sun className="w-5 h-5 text-[#00acc1] mx-auto mb-2" />
              <p className="text-xl font-bold text-foreground">{stats.upcomingHolidays}</p>
              <p className="text-xs text-muted-foreground">Upcoming Holidays</p>
            </CardContent>
          </Card>
          <Card className="card-hover animate-fadeIn" style={{ animationDelay: '450ms' }}>
            <CardContent className="p-4 text-center">
              <BarChart3 className="w-5 h-5 text-muted-foreground mx-auto mb-2" />
              <p className="text-xl font-bold text-foreground">92%</p>
              <p className="text-xs text-muted-foreground">Avg Rate</p>
            </CardContent>
          </Card>
        </div>

        {/* Dashboard Tab */}
        <TabsContent value="dashboard" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Today's Attendance */}
            <Card className="card-hover">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-primary" />
                  Today's Attendance
                </CardTitle>
                <CardDescription>{format(new Date(), 'EEEE, MMMM d, yyyy')}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {todayAttendance.slice(0, 5).map((record) => {
                    const employee = getEmployeeById(record.employeeId);
                    if (!employee) return null;
                    return (
                      <div key={record.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                        <div className="flex items-center gap-3">
                          <Avatar className="w-8 h-8">
                            <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-white text-xs">
                              {employee.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-sm">{employee.name}</p>
                            <p className="text-xs text-gray-500">
                              {record.checkIn} - {record.checkOut || '...'}
                            </p>
                          </div>
                        </div>
                        <StatusBadge status={record.status} />
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Pending Leave Requests */}
            <Card className="card-hover">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-warning" />
                  Pending Leave Requests
                </CardTitle>
                <CardDescription>{pendingLeaves.length} requests awaiting approval</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {pendingLeaves.slice(0, 3).map((leave) => {
                    const employee = getEmployeeById(leave.employeeId);
                    if (!employee) return null;
                    return (
                      <div key={leave.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                        <div className="flex items-center gap-3">
                          <Avatar className="w-8 h-8">
                            <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-white text-xs">
                              {employee.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-sm">{employee.name}</p>
                            <p className="text-xs text-gray-500">
                              {leave.leaveType} • {leave.totalDays} day{leave.totalDays > 1 ? 's' : ''}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="h-8 text-green-600"
                            onClick={() => handleApproveLeave(leave.id, true)}
                          >
                            <Check className="w-4 h-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="h-8 text-red-600"
                            onClick={() => handleApproveLeave(leave.id, false)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Attendance Calendar Tab */}
        <TabsContent value="attendance" className="space-y-6">
          <Card className="card-hover">
            <CardHeader className="pb-0">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <CardTitle>Attendance Calendar</CardTitle>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="icon" onClick={prevMonth}>
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <span className="text-lg font-semibold min-w-[150px] text-center">
                    {format(currentDate, 'MMMM yyyy')}
                  </span>
                  <Button variant="outline" size="icon" onClick={nextMonth}>
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-background">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground sticky left-0 bg-background z-10">Employee</th>
                      {daysInMonth.slice(0, 15).map(day => (
                        <th key={day.toISOString()} className="px-2 py-3 text-center text-xs font-medium text-muted-foreground min-w-[40px]">
                          <div className={isToday(day) ? 'text-primary font-bold' : ''}>
                            {format(day, 'd')}
                          </div>
                          <div className="text-[10px] text-muted-foreground">
                            {format(day, 'EEE')}
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredEmployees.map((employee) => (
                      <tr key={employee.id} className="border-t border-border hover:bg-background">
                        <td className="px-4 py-3 sticky left-0 bg-white hover:bg-background z-10">
                          <div className="flex items-center gap-3">
                            <Avatar className="w-8 h-8">
                              <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-white text-xs">
                                {employee.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-foreground text-sm">{employee.name}</p>
                              <p className="text-xs text-muted-foreground">{getPositionById(employee.positionId)?.name}</p>
                            </div>
                          </div>
                        </td>
                        {daysInMonth.slice(0, 15).map(day => {
                          const attendance = getAttendanceForDay(employee.id, day);
                          const status = attendance ? getStatusColor(attendance.status) : null;
                          const isHoliday = holidays.some(h => h.date === format(day, 'yyyy-MM-dd'));
                          
                          if (isHoliday) {
                            return (
                              <td key={day.toISOString()} className="px-1 py-2 text-center">
                                <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center mx-auto">
                                  <Sun className="w-4 h-4 text-purple-600" />
                                </div>
                              </td>
                            );
                          }
                          
                          return (
                            <td key={day.toISOString()} className="px-1 py-2 text-center">
                              {status && attendance ? (
                                <div 
                                  className="w-8 h-8 rounded-lg flex items-center justify-center mx-auto cursor-pointer hover:scale-110 transition-transform"
                                  style={{ backgroundColor: status.bg }}
                                  title={`${attendance.status}${attendance.checkIn ? ` - ${attendance.checkIn}` : ''}`}
                                >
                                  <status.icon className="w-4 h-4" style={{ color: status.text }} />
                                </div>
                              ) : (
                                <div className="w-8 h-8 rounded-lg bg-background mx-auto" />
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Employees Tab */}
        <TabsContent value="employees" className="space-y-6">
          <Card className="card-hover">
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <CardTitle>Employee Management</CardTitle>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search employees..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-[200px]"
                    />
                  </div>
                  <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                    <SelectTrigger className="w-[150px]">
                      <Filter className="w-4 h-4 mr-2" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Departments</SelectItem>
                      {departments.map(dept => (
                        <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {hasPermission(currentUserRole, 'edit_employees') && (
                    <Button onClick={() => setIsEmployeeDialogOpen(true)}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Employee
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-background">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                        <Checkbox 
                          checked={selectedRecords.length === filteredEmployees.length && filteredEmployees.length > 0}
                          onCheckedChange={() => selectAllRecords(filteredEmployees)}
                        />
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Employee</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Role</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Position</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Department</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Status</th>
                      <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredEmployees.map((employee) => (
                      <tr key={employee.id} className="border-t border-border hover:bg-background">
                        <td className="px-4 py-3">
                          <Checkbox 
                            checked={selectedRecords.includes(employee.id)}
                            onCheckedChange={() => toggleRecordSelection(employee.id)}
                          />
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <Avatar className="w-10 h-10">
                              <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-white">
                                {employee.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-foreground">{employee.name}</p>
                              <p className="text-sm text-muted-foreground">{employee.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <RoleBadge role={employee.role} />
                        </td>
                        <td className="px-4 py-3 text-sm text-muted-foreground">
                          {getPositionById(employee.positionId)?.name}
                        </td>
                        <td className="px-4 py-3 text-sm text-muted-foreground">{employee.department}</td>
                        <td className="px-4 py-3">
                          <Badge variant={employee.isActive ? 'default' : 'secondary'} className={employee.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}>
                            {employee.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => { setSelectedEmployee(employee); setIsQRDialogOpen(true); }}>
                                <QrCode className="w-4 h-4 mr-2" />
                                View QR Code
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Edit2 className="w-4 h-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-red-600">
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {selectedRecords.length > 0 && (
                <div className="mt-4 flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
                  <span className="text-sm text-blue-700">{selectedRecords.length} selected</span>
                  <Button variant="outline" size="sm" onClick={handleBulkDelete} className="ml-auto text-red-600">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Selected
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Positions Tab */}
        <TabsContent value="positions" className="space-y-6">
          <Card className="card-hover">
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <CardTitle>Position Management</CardTitle>
                <Button onClick={() => setIsPositionDialogOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Position
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {positions.map((position) => (
                  <Card key={position.id} className="border border-gray-200">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-semibold text-foreground">{position.name}</h4>
                          <p className="text-sm text-muted-foreground mt-1">{position.department}</p>
                          <p className="text-xs text-gray-500 mt-2">{position.description}</p>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => { setEditingPosition(position); setIsPositionDialogOpen(true); }}>
                              <Edit2 className="w-4 h-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      <div className="mt-4 pt-3 border-t border-gray-100">
                        <p className="text-xs text-gray-500">
                          {employees.filter(e => e.positionId === position.id).length} employees
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Schedules Tab */}
        <TabsContent value="schedules" className="space-y-6">
          <Card className="card-hover">
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <CardTitle>Attendance Schedules</CardTitle>
                <Button onClick={() => setIsScheduleDialogOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Schedule
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {schedules.map((schedule) => (
                  <Card key={schedule.id} className={`border ${schedule.isDefault ? 'border-blue-300 bg-blue-50/30' : 'border-gray-200'}`}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                            <Clock className="w-6 h-6 text-blue-600" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-semibold text-foreground">{schedule.name}</h4>
                              {schedule.isDefault && (
                                <Badge className="bg-blue-100 text-blue-700">Default</Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {schedule.checkInTime} - {schedule.checkOutTime} • 
                              Grace: {schedule.gracePeriodMinutes}min • 
                              Late after: {schedule.lateThresholdMinutes}min
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex gap-1">
                            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, idx) => (
                              <span 
                                key={idx} 
                                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                                  schedule.workingDays.includes(idx) 
                                    ? 'bg-blue-500 text-white' 
                                    : 'bg-gray-100 text-gray-400'
                                }`}
                              >
                                {day}
                              </span>
                            ))}
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => { setEditingSchedule(schedule); setIsScheduleDialogOpen(true); }}>
                                <Edit2 className="w-4 h-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600">
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Holidays Tab */}
        <TabsContent value="holidays" className="space-y-6">
          <Card className="card-hover">
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <CardTitle>Holiday Management</CardTitle>
                <Button onClick={() => setIsHolidayDialogOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Holiday
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-background">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Name</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Date</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Type</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Recurring</th>
                      <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {holidays.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()).map((holiday) => (
                      <tr key={holiday.id} className="border-t border-border hover:bg-background">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
                              <Sun className="w-4 h-4 text-purple-600" />
                            </div>
                            <div>
                              <p className="font-medium text-foreground">{holiday.name}</p>
                              {holiday.description && (
                                <p className="text-xs text-gray-500">{holiday.description}</p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-muted-foreground">
                          {format(new Date(holiday.date), 'MMM d, yyyy')}
                        </td>
                        <td className="px-4 py-3">
                          <Badge variant="outline" className="capitalize">
                            {holiday.type}
                          </Badge>
                        </td>
                        <td className="px-4 py-3">
                          {holiday.isRecurring ? (
                            <Check className="w-4 h-4 text-green-600" />
                          ) : (
                            <X className="w-4 h-4 text-gray-400" />
                          )}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => { setEditingHoliday(holiday); setIsHolidayDialogOpen(true); }}>
                                <Edit2 className="w-4 h-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600">
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Leaves Tab */}
        <TabsContent value="leaves" className="space-y-6">
          <Card className="card-hover">
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <CardTitle>Leave Requests</CardTitle>
                <Button onClick={() => setIsLeaveDialogOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Request Leave
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-background">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Employee</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Type</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Duration</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Reason</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Status</th>
                      <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leaveRequests.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map((leave) => {
                      const employee = getEmployeeById(leave.employeeId);
                      if (!employee) return null;
                      return (
                        <tr key={leave.id} className="border-t border-border hover:bg-background">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <Avatar className="w-8 h-8">
                                <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-white text-xs">
                                  {employee.name.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                              </Avatar>
                              <span className="font-medium text-sm">{employee.name}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <Badge variant="outline" className="capitalize">
                              {leave.leaveType}
                            </Badge>
                          </td>
                          <td className="px-4 py-3 text-sm text-muted-foreground">
                            {format(new Date(leave.startDate), 'MMM d')} - {format(new Date(leave.endDate), 'MMM d')}
                            <span className="text-xs text-gray-400 ml-1">({leave.totalDays} days)</span>
                          </td>
                          <td className="px-4 py-3 text-sm text-muted-foreground max-w-[200px] truncate">
                            {leave.reason}
                          </td>
                          <td className="px-4 py-3">
                            <StatusBadge status={leave.status} />
                          </td>
                          <td className="px-4 py-3 text-right">
                            {leave.status === 'pending' && hasPermission(currentUserRole, 'approve_leave') && (
                              <div className="flex gap-2 justify-end">
                                <Button 
                                  size="sm" 
                                  variant="outline" 
                                  className="h-8 text-green-600"
                                  onClick={() => handleApproveLeave(leave.id, true)}
                                >
                                  <Check className="w-4 h-4" />
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="outline" 
                                  className="h-8 text-red-600"
                                  onClick={() => handleApproveLeave(leave.id, false)}
                                >
                                  <X className="w-4 h-4" />
                                </Button>
                              </div>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* QR Check-in Tab */}
        <TabsContent value="qrcheckin" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* QR Code Display - Single QR for all staff */}
            <Card className="card-hover">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <QrCode className="w-5 h-5 text-primary" />
                  Staff Check-in QR Code
                </CardTitle>
                <CardDescription>Scan this QR code to check in or check out</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center">
                <div className="w-64 h-64 bg-white rounded-2xl border-4 border-primary/20 flex items-center justify-center mb-6 p-4">
                  <div className="w-full h-full bg-gradient-to-br from-primary/5 to-secondary/5 rounded-xl flex items-center justify-center">
                    <QrCode className="w-48 h-48 text-primary" />
                  </div>
                </div>
                <div className="text-center">
                  <p className="font-semibold text-lg text-foreground">Shop Attendance</p>
                  <p className="text-sm text-muted-foreground">Scan to check in/out</p>
                </div>
                <div className="flex gap-3 mt-6">
                  <Button variant="outline" onClick={() => toast.success('QR Code downloaded!')}>
                    <Download className="w-4 h-4 mr-2" />
                    Download QR
                  </Button>
                  <Button variant="outline" onClick={() => toast.success('QR Code printed!')}>
                    <Printer className="w-4 h-4 mr-2" />
                    Print
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Staff Login & Scan Simulation */}
            <Card className="card-hover">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserCheck className="w-5 h-5 text-success" />
                  Staff Check-in/out
                </CardTitle>
                <CardDescription>Select employee to simulate QR scan</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-muted-foreground">Select Employee</Label>
                    <Select
                      value={selectedEmployee?.id || ''}
                      onValueChange={(value) => {
                        const emp = employees.find(e => e.id === value);
                        setSelectedEmployee(emp || null);
                      }}
                    >
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Select employee..." />
                      </SelectTrigger>
                      <SelectContent>
                        {employees.filter(e => e.isActive).map(emp => (
                          <SelectItem key={emp.id} value={emp.id}>
                            <div className="flex items-center gap-2">
                              <Avatar className="w-6 h-6">
                                <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-white text-xs">
                                  {emp.name.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                              </Avatar>
                              {emp.name}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {selectedEmployee && (
                    <div className="p-4 bg-gray-50 rounded-xl">
                      <div className="flex items-center gap-3 mb-4">
                        <Avatar className="w-12 h-12">
                          <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-white">
                            {selectedEmployee.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold text-foreground">{selectedEmployee.name}</p>
                          <p className="text-sm text-muted-foreground">{getPositionById(selectedEmployee.positionId)?.name}</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3">
                        <Button 
                          className="h-14 bg-gradient-to-r from-success to-success hover:opacity-90 text-white"
                          onClick={() => {
                            toast.success(`${selectedEmployee.name} checked in at ${format(new Date(), 'HH:mm')}`);
                          }}
                        >
                          <UserCheck className="w-5 h-5 mr-2" />
                          Check In
                        </Button>
                        <Button 
                          className="h-14 bg-gradient-to-r from-destructive to-[#c62828] hover:opacity-90 text-white"
                          onClick={() => {
                            toast.success(`${selectedEmployee.name} checked out at ${format(new Date(), 'HH:mm')}`);
                          }}
                        >
                          <UserX className="w-5 h-5 mr-2" />
                          Check Out
                        </Button>
                      </div>
                    </div>
                  )}

                  <div className="border-t border-gray-200 pt-4">
                    <p className="text-sm font-medium text-muted-foreground mb-3">Today's Activity</p>
                    <div className="space-y-2 max-h-[200px] overflow-auto">
                      {todayAttendance.slice(0, 5).map((record) => {
                        const employee = getEmployeeById(record.employeeId);
                        if (!employee) return null;
                        return (
                          <div key={record.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                            <div className="flex items-center gap-3">
                              <Avatar className="w-8 h-8">
                                <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-white text-xs">
                                  {employee.name.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium text-sm">{employee.name}</p>
                                <p className="text-xs text-gray-500">
                                  {record.checkIn} - {record.checkOut || '...'}
                                </p>
                              </div>
                            </div>
                            <StatusBadge status={record.status} />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Add Employee Dialog */}
      <Dialog open={isEmployeeDialogOpen} onOpenChange={setIsEmployeeDialogOpen}>
        <DialogContent className="sm:max-w-[520px] p-0 overflow-hidden border-0 shadow-2xl">
          <div className="bg-gradient-to-r from-primary to-secondary p-6">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3 text-white text-xl">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                  <UserPlus className="w-5 h-5 text-white" />
                </div>
                Add New Employee
              </DialogTitle>
            </DialogHeader>
          </div>
          <div className="p-6 space-y-5 bg-white">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-muted-foreground">Full Name</Label>
              <Input
                placeholder="Enter employee name..."
                value={employeeForm.name}
                onChange={(e) => setEmployeeForm({ ...employeeForm, name: e.target.value })}
                className="h-12"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-muted-foreground">Email</Label>
                <Input
                  type="email"
                  placeholder="employee@shop.com"
                  value={employeeForm.email}
                  onChange={(e) => setEmployeeForm({ ...employeeForm, email: e.target.value })}
                  className="h-12"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-muted-foreground">Phone</Label>
                <Input
                  placeholder="+1234567890"
                  value={employeeForm.phone}
                  onChange={(e) => setEmployeeForm({ ...employeeForm, phone: e.target.value })}
                  className="h-12"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-muted-foreground">Role</Label>
                <Select
                  value={employeeForm.role}
                  onValueChange={(value) => setEmployeeForm({ ...employeeForm, role: value as UserRole })}
                >
                  <SelectTrigger className="h-12">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="operator">Operator</SelectItem>
                    <SelectItem value="employee">Employee</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-muted-foreground">Position</Label>
                <Select
                  value={employeeForm.positionId}
                  onValueChange={(value) => {
                    const position = getPositionById(value);
                    setEmployeeForm({ 
                      ...employeeForm, 
                      positionId: value,
                      department: position?.department || ''
                    });
                  }}
                >
                  <SelectTrigger className="h-12">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {positions.map(pos => (
                      <SelectItem key={pos.id} value={pos.id}>{pos.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex gap-3 pt-4">
              <Button 
                variant="outline" 
                className="flex-1 h-12"
                onClick={() => {
                  setEmployeeForm({ name: '', email: '', phone: '', role: 'employee', positionId: '', department: '' });
                  setIsEmployeeDialogOpen(false);
                }}
              >
                Cancel
              </Button>
              <Button 
                className="flex-1 h-12 bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white"
                onClick={handleAddEmployee}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Employee
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Position Dialog */}
      <Dialog open={isPositionDialogOpen} onOpenChange={setIsPositionDialogOpen}>
        <DialogContent className="sm:max-w-[520px] p-0 overflow-hidden border-0 shadow-2xl">
          <div className="bg-gradient-to-r from-success to-success p-6">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3 text-white text-xl">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                  <Briefcase className="w-5 h-5 text-white" />
                </div>
                {editingPosition ? 'Edit Position' : 'Add New Position'}
              </DialogTitle>
            </DialogHeader>
          </div>
          <div className="p-6 space-y-5 bg-white">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-muted-foreground">Position Name</Label>
              <Input
                placeholder="e.g. Sales Manager"
                value={positionForm.name}
                onChange={(e) => setPositionForm({ ...positionForm, name: e.target.value })}
                className="h-12"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-muted-foreground">Department</Label>
              <Input
                placeholder="e.g. Sales"
                value={positionForm.department}
                onChange={(e) => setPositionForm({ ...positionForm, department: e.target.value })}
                className="h-12"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-muted-foreground">Description</Label>
              <Input
                placeholder="Brief description of the role..."
                value={positionForm.description}
                onChange={(e) => setPositionForm({ ...positionForm, description: e.target.value })}
                className="h-12"
              />
            </div>
            <div className="flex gap-3 pt-4">
              <Button 
                variant="outline" 
                className="flex-1 h-12"
                onClick={() => {
                  setPositionForm({ name: '', description: '', department: '' });
                  setEditingPosition(null);
                  setIsPositionDialogOpen(false);
                }}
              >
                Cancel
              </Button>
              <Button 
                className="flex-1 h-12 bg-gradient-to-r from-success to-success hover:opacity-90 text-white"
                onClick={handleAddPosition}
              >
                <Plus className="w-4 h-4 mr-2" />
                {editingPosition ? 'Save Changes' : 'Add Position'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Schedule Dialog */}
      <Dialog open={isScheduleDialogOpen} onOpenChange={setIsScheduleDialogOpen}>
        <DialogContent className="sm:max-w-[520px] p-0 overflow-hidden border-0 shadow-2xl">
          <div className="bg-gradient-to-r from-warning to-warning p-6">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3 text-white text-xl">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-white" />
                </div>
                {editingSchedule ? 'Edit Schedule' : 'Add New Schedule'}
              </DialogTitle>
            </DialogHeader>
          </div>
          <div className="p-6 space-y-5 bg-white">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-muted-foreground">Schedule Name</Label>
              <Input
                placeholder="e.g. Morning Shift"
                value={scheduleForm.name}
                onChange={(e) => setScheduleForm({ ...scheduleForm, name: e.target.value })}
                className="h-12"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-muted-foreground">Check-in Time</Label>
                <Input
                  type="time"
                  value={scheduleForm.checkInTime}
                  onChange={(e) => setScheduleForm({ ...scheduleForm, checkInTime: e.target.value })}
                  className="h-12"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-muted-foreground">Check-out Time</Label>
                <Input
                  type="time"
                  value={scheduleForm.checkOutTime}
                  onChange={(e) => setScheduleForm({ ...scheduleForm, checkOutTime: e.target.value })}
                  className="h-12"
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-muted-foreground">Grace (min)</Label>
                <Input
                  type="number"
                  value={scheduleForm.gracePeriodMinutes}
                  onChange={(e) => setScheduleForm({ ...scheduleForm, gracePeriodMinutes: parseInt(e.target.value) })}
                  className="h-12"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-muted-foreground">Late Threshold (min)</Label>
                <Input
                  type="number"
                  value={scheduleForm.lateThresholdMinutes}
                  onChange={(e) => setScheduleForm({ ...scheduleForm, lateThresholdMinutes: parseInt(e.target.value) })}
                  className="h-12"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-muted-foreground">Early Leave (min)</Label>
                <Input
                  type="number"
                  value={scheduleForm.earlyLeaveThresholdMinutes}
                  onChange={(e) => setScheduleForm({ ...scheduleForm, earlyLeaveThresholdMinutes: parseInt(e.target.value) })}
                  className="h-12"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                checked={scheduleForm.isDefault}
                onCheckedChange={(checked) => setScheduleForm({ ...scheduleForm, isDefault: checked })}
              />
              <Label className="text-sm font-medium text-muted-foreground">Set as default schedule</Label>
            </div>
            <div className="flex gap-3 pt-4">
              <Button 
                variant="outline" 
                className="flex-1 h-12"
                onClick={() => {
                  setScheduleForm({
                    name: '',
                    checkInTime: '08:00',
                    checkOutTime: '17:00',
                    gracePeriodMinutes: 15,
                    lateThresholdMinutes: 30,
                    earlyLeaveThresholdMinutes: 15,
                    workingDays: [1, 2, 3, 4, 5],
                    isDefault: false,
                  });
                  setEditingSchedule(null);
                  setIsScheduleDialogOpen(false);
                }}
              >
                Cancel
              </Button>
              <Button 
                className="flex-1 h-12 bg-gradient-to-r from-warning to-warning hover:opacity-90 text-white"
                onClick={handleAddSchedule}
              >
                <Plus className="w-4 h-4 mr-2" />
                {editingSchedule ? 'Save Changes' : 'Add Schedule'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Holiday Dialog */}
      <Dialog open={isHolidayDialogOpen} onOpenChange={setIsHolidayDialogOpen}>
        <DialogContent className="sm:max-w-[520px] p-0 overflow-hidden border-0 shadow-2xl">
          <div className="bg-gradient-to-r from-[#00acc1] to-[#00838f] p-6">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3 text-white text-xl">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                  <Sun className="w-5 h-5 text-white" />
                </div>
                {editingHoliday ? 'Edit Holiday' : 'Add New Holiday'}
              </DialogTitle>
            </DialogHeader>
          </div>
          <div className="p-6 space-y-5 bg-white">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-muted-foreground">Holiday Name</Label>
              <Input
                placeholder="e.g. New Year's Day"
                value={holidayForm.name}
                onChange={(e) => setHolidayForm({ ...holidayForm, name: e.target.value })}
                className="h-12"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-muted-foreground">Date</Label>
                <Input
                  type="date"
                  value={holidayForm.date}
                  onChange={(e) => setHolidayForm({ ...holidayForm, date: e.target.value })}
                  className="h-12"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-muted-foreground">Type</Label>
                <Select
                  value={holidayForm.type}
                  onValueChange={(value) => setHolidayForm({ ...holidayForm, type: value as 'public' | 'company' | 'optional' })}
                >
                  <SelectTrigger className="h-12">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">Public Holiday</SelectItem>
                    <SelectItem value="company">Company Holiday</SelectItem>
                    <SelectItem value="optional">Optional</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-muted-foreground">Description</Label>
              <Input
                placeholder="Optional description..."
                value={holidayForm.description}
                onChange={(e) => setHolidayForm({ ...holidayForm, description: e.target.value })}
                className="h-12"
              />
            </div>
            <div className="flex items-center gap-2">
              <Switch
                checked={holidayForm.isRecurring}
                onCheckedChange={(checked) => setHolidayForm({ ...holidayForm, isRecurring: checked })}
              />
              <Label className="text-sm font-medium text-muted-foreground">Recurring annually</Label>
            </div>
            <div className="flex gap-3 pt-4">
              <Button 
                variant="outline" 
                className="flex-1 h-12"
                onClick={() => {
                  setHolidayForm({ name: '', date: '', type: 'public', description: '', isRecurring: false });
                  setEditingHoliday(null);
                  setIsHolidayDialogOpen(false);
                }}
              >
                Cancel
              </Button>
              <Button 
                className="flex-1 h-12 bg-gradient-to-r from-[#00acc1] to-[#00838f] hover:opacity-90 text-white"
                onClick={handleAddHoliday}
              >
                <Plus className="w-4 h-4 mr-2" />
                {editingHoliday ? 'Save Changes' : 'Add Holiday'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Request Leave Dialog */}
      <Dialog open={isLeaveDialogOpen} onOpenChange={setIsLeaveDialogOpen}>
        <DialogContent className="sm:max-w-[520px] p-0 overflow-hidden border-0 shadow-2xl">
          <div className="bg-gradient-to-r from-secondary to-[#6a1b9a] p-6">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3 text-white text-xl">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-white" />
                </div>
                Request Leave
              </DialogTitle>
            </DialogHeader>
          </div>
          <div className="p-6 space-y-5 bg-white">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-muted-foreground">Leave Type</Label>
              <Select
                value={leaveForm.leaveType}
                onValueChange={(value) => setLeaveForm({ ...leaveForm, leaveType: value as LeaveType })}
              >
                <SelectTrigger className="h-12">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sick">Sick Leave</SelectItem>
                  <SelectItem value="vacation">Vacation</SelectItem>
                  <SelectItem value="personal">Personal Leave</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-muted-foreground">Start Date</Label>
                <Input
                  type="date"
                  value={leaveForm.startDate}
                  onChange={(e) => setLeaveForm({ ...leaveForm, startDate: e.target.value })}
                  className="h-12"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-muted-foreground">End Date</Label>
                <Input
                  type="date"
                  value={leaveForm.endDate}
                  onChange={(e) => setLeaveForm({ ...leaveForm, endDate: e.target.value })}
                  className="h-12"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-muted-foreground">Reason</Label>
              <Input
                placeholder="Enter reason for leave..."
                value={leaveForm.reason}
                onChange={(e) => setLeaveForm({ ...leaveForm, reason: e.target.value })}
                className="h-12"
              />
            </div>
            <div className="flex gap-3 pt-4">
              <Button 
                variant="outline" 
                className="flex-1 h-12"
                onClick={() => {
                  setLeaveForm({ leaveType: 'sick', startDate: '', endDate: '', reason: '' });
                  setIsLeaveDialogOpen(false);
                }}
              >
                Cancel
              </Button>
              <Button 
                className="flex-1 h-12 bg-gradient-to-r from-secondary to-[#6a1b9a] hover:opacity-90 text-white"
                onClick={handleSubmitLeave}
              >
                <Check className="w-4 h-4 mr-2" />
                Submit Request
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* QR Code Dialog */}
      <Dialog open={isQRDialogOpen} onOpenChange={setIsQRDialogOpen}>
        <DialogContent className="sm:max-w-[400px] p-0 overflow-hidden border-0 shadow-2xl">
          <div className="bg-gradient-to-r from-muted-foreground to-foreground p-6">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3 text-white text-xl">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                  <QrCode className="w-5 h-5 text-white" />
                </div>
                Employee QR Code
              </DialogTitle>
            </DialogHeader>
          </div>
          <div className="p-6 bg-white">
            {selectedEmployee && (
              <QRCodeDisplay 
                employee={selectedEmployee} 
                onDownload={() => handleDownloadQR(selectedEmployee)} 
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
