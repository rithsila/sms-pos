import { useState } from 'react';
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
  Filter
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { Staff, Attendance } from '@/types';
import { sampleAttendance } from '@/data/store';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isToday, addMonths, subMonths } from 'date-fns';

interface AttendanceSectionProps {
  staff: Staff[];
}

export default function AttendanceSection({ staff }: AttendanceSectionProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedStaff, setSelectedStaff] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(currentDate),
    end: endOfMonth(currentDate),
  });

  const filteredStaff = staff.filter(member => 
    (selectedStaff === 'all' || member.id === selectedStaff) &&
    (member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
     member.role.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getAttendanceForDay = (staffId: string, date: Date): Attendance | undefined => {
    return sampleAttendance.find(a => 
      a.staffId === staffId && 
      format(new Date(a.date), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present': return { bg: 'var(--color-success-light)', text: 'hsl(var(--success))', icon: Check };
      case 'absent': return { bg: 'var(--color-destructive-light)', text: 'hsl(var(--destructive))', icon: UserX };
      case 'late': return { bg: 'var(--color-warning-light)', text: 'hsl(var(--warning))', icon: Clock };
      case 'leave': return { bg: 'var(--color-primary-light-bg)', text: 'hsl(var(--primary))', icon: Coffee };
      default: return { bg: 'hsl(var(--background))', text: 'hsl(var(--muted-foreground))', icon: AlertCircle };
    }
  };

  const calculateStats = (staffId: string) => {
    const staffAttendance = sampleAttendance.filter(a => a.staffId === staffId);
    const total = staffAttendance.length;
    const present = staffAttendance.filter(a => a.status === 'present').length;
    const absent = staffAttendance.filter(a => a.status === 'absent').length;
    const late = staffAttendance.filter(a => a.status === 'late').length;
    const leave = staffAttendance.filter(a => a.status === 'leave').length;
    const rate = total > 0 ? Math.round((present / total) * 100) : 0;
    
    return { total, present, absent, late, leave, rate };
  };

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="mb-8 animate-fadeInDown">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">Employee Attendance</h1>
            <p className="text-muted-foreground">Track staff attendance and working hours</p>
          </div>
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
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-8">
        <Card className="card-hover animate-fadeIn" style={{ animationDelay: '100ms' }}>
          <CardContent className="p-4 text-center">
            <UserCheck className="w-6 h-6 text-success mx-auto mb-2" />
            <p className="text-2xl font-bold text-foreground">
              {sampleAttendance.filter(a => a.status === 'present').length}
            </p>
            <p className="text-xs text-muted-foreground">Present</p>
          </CardContent>
        </Card>
        <Card className="card-hover animate-fadeIn" style={{ animationDelay: '200ms' }}>
          <CardContent className="p-4 text-center">
            <UserX className="w-6 h-6 text-destructive mx-auto mb-2" />
            <p className="text-2xl font-bold text-foreground">
              {sampleAttendance.filter(a => a.status === 'absent').length}
            </p>
            <p className="text-xs text-muted-foreground">Absent</p>
          </CardContent>
        </Card>
        <Card className="card-hover animate-fadeIn" style={{ animationDelay: '300ms' }}>
          <CardContent className="p-4 text-center">
            <Clock className="w-6 h-6 text-warning mx-auto mb-2" />
            <p className="text-2xl font-bold text-foreground">
              {sampleAttendance.filter(a => a.status === 'late').length}
            </p>
            <p className="text-xs text-muted-foreground">Late</p>
          </CardContent>
        </Card>
        <Card className="card-hover animate-fadeIn" style={{ animationDelay: '400ms' }}>
          <CardContent className="p-4 text-center">
            <Coffee className="w-6 h-6 text-primary mx-auto mb-2" />
            <p className="text-2xl font-bold text-foreground">
              {sampleAttendance.filter(a => a.status === 'leave').length}
            </p>
            <p className="text-xs text-muted-foreground">On Leave</p>
          </CardContent>
        </Card>
        <Card className="card-hover animate-fadeIn" style={{ animationDelay: '500ms' }}>
          <CardContent className="p-4 text-center">
            <Check className="w-6 h-6 text-success mx-auto mb-2" />
            <p className="text-2xl font-bold text-foreground">92%</p>
            <p className="text-xs text-muted-foreground">Avg Rate</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6 animate-fadeIn" style={{ animationDelay: '600ms' }}>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search staff..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedStaff} onValueChange={setSelectedStaff}>
              <SelectTrigger className="w-[200px]">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Select Staff" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Staff</SelectItem>
                {staff.map(member => (
                  <SelectItem key={member.id} value={member.id}>{member.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Attendance Table */}
      <Card className="card-hover animate-fadeIn overflow-hidden" style={{ animationDelay: '700ms' }}>
        <CardHeader className="pb-0">
          <CardTitle>Attendance Calendar</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-background">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground sticky left-0 bg-background z-10">Staff</th>
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
                {filteredStaff.map((member) => (
                    <tr key={member.id} className="border-t border-border hover:bg-background">
                      <td className="px-4 py-3 sticky left-0 bg-white hover:bg-background z-10">
                        <div className="flex items-center gap-3">
                          <Avatar className="w-8 h-8">
                            <AvatarImage src={member.avatar} alt={member.name} />
                            <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-white text-xs">
                              {member.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-foreground text-sm">{member.name}</p>
                            <p className="text-xs text-muted-foreground">{member.role}</p>
                          </div>
                        </div>
                      </td>
                      {daysInMonth.slice(0, 15).map(day => {
                        const attendance = getAttendanceForDay(member.id, day);
                        const status = attendance ? getStatusColor(attendance.status) : null;
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
                  )
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Staff Stats */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold text-foreground mb-4">Individual Statistics</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredStaff.map((member, index) => {
            const stats = calculateStats(member.id);
            return (
              <Card 
                key={member.id} 
                className="card-hover animate-fadeIn"
                style={{ animationDelay: `${800 + index * 50}ms` }}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-4 mb-4">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={member.avatar} alt={member.name} />
                      <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-white">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold text-foreground">{member.name}</p>
                      <p className="text-sm text-muted-foreground">{member.role}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-2 mb-4">
                    <div className="text-center p-2 rounded-lg bg-[#e8f5e9]">
                      <p className="text-lg font-bold text-success">{stats.present}</p>
                      <p className="text-[10px] text-muted-foreground">Present</p>
                    </div>
                    <div className="text-center p-2 rounded-lg bg-[#ffebee]">
                      <p className="text-lg font-bold text-destructive">{stats.absent}</p>
                      <p className="text-[10px] text-muted-foreground">Absent</p>
                    </div>
                    <div className="text-center p-2 rounded-lg bg-[#fff8e1]">
                      <p className="text-lg font-bold text-warning">{stats.late}</p>
                      <p className="text-[10px] text-muted-foreground">Late</p>
                    </div>
                    <div className="text-center p-2 rounded-lg bg-[#e3f2fd]">
                      <p className="text-lg font-bold text-primary">{stats.leave}</p>
                      <p className="text-[10px] text-muted-foreground">Leave</p>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-muted-foreground">Attendance Rate</span>
                      <span className="font-medium" style={{ color: getStatusColor(stats.rate >= 90 ? 'present' : stats.rate >= 80 ? 'late' : 'absent').text }}>
                        {stats.rate}%
                      </span>
                    </div>
                    <div className="w-full h-2 bg-[#e0e0e0] rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full transition-all duration-500"
                        style={{ 
                          width: `${stats.rate}%`,
                          backgroundColor: getStatusColor(stats.rate >= 90 ? 'present' : stats.rate >= 80 ? 'late' : 'absent').text
                        }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <Card className="mt-6 animate-fadeIn" style={{ animationDelay: '900ms' }}>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-[#e8f5e9] flex items-center justify-center">
                <Check className="w-3 h-3 text-success" />
              </div>
              <span className="text-sm text-muted-foreground">Present</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-[#ffebee] flex items-center justify-center">
                <UserX className="w-3 h-3 text-destructive" />
              </div>
              <span className="text-sm text-muted-foreground">Absent</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-[#fff8e1] flex items-center justify-center">
                <Clock className="w-3 h-3 text-warning" />
              </div>
              <span className="text-sm text-muted-foreground">Late</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-[#e3f2fd] flex items-center justify-center">
                <Coffee className="w-3 h-3 text-primary" />
              </div>
              <span className="text-sm text-muted-foreground">On Leave</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
