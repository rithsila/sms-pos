import { useState } from 'react';
import { 
  Users, 
  Search, 
  Mail, 
  Phone, 
  TrendingUp, 
  Award,
  Star,
  Calendar,
  MoreVertical,
  Edit2,
  Trash2,
  UserPlus,
  User
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { Staff } from '@/types';
import { format } from 'date-fns';

interface StaffSectionProps {
  staff: Staff[];
}

export default function StaffSection({ staff }: StaffSectionProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  
  // Form state for adding new staff
  const [staffForm, setStaffForm] = useState({
    name: '',
    role: '',
    email: '',
    phone: '',
  });

  const filteredStaff = staff.filter(member => 
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const averagePerformance = Math.round(staff.reduce((sum, s) => sum + s.performance, 0) / staff.length);
  const topPerformer = staff.reduce((max, s) => s.performance > max.performance ? s : max, staff[0]);

  const getPerformanceColor = (performance: number) => {
    if (performance >= 90) return 'hsl(var(--success))';
    if (performance >= 80) return 'hsl(var(--primary))';
    if (performance >= 70) return 'hsl(var(--warning))';
    return 'hsl(var(--destructive))';
  };

  const getAttendanceColor = (attendance: number) => {
    if (attendance >= 95) return 'hsl(var(--success))';
    if (attendance >= 90) return 'hsl(var(--primary))';
    if (attendance >= 80) return 'hsl(var(--warning))';
    return 'hsl(var(--destructive))';
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const openStaffDetails = (member: Staff) => {
    setSelectedStaff(member);
    setIsDetailsOpen(true);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="mb-8 animate-fadeInDown">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">Staff Performance</h1>
            <p className="text-muted-foreground">Track and manage your team</p>
          </div>
          <Button className="btn-primary" onClick={() => setIsAddDialogOpen(true)}>
            <UserPlus className="w-4 h-4 mr-2" />
            Add Staff
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6 mb-8">
        <Card className="card-hover animate-fadeIn" style={{ animationDelay: '100ms' }}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Total Staff</p>
                <h3 className="text-3xl font-bold text-foreground">{staff.length}</h3>
                <p className="text-sm text-success mt-1">
                  {staff.filter(s => s.attendance >= 90).length} active today
                </p>
              </div>
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center">
                <Users className="w-7 h-7 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-hover animate-fadeIn" style={{ animationDelay: '200ms' }}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Avg Performance</p>
                <h3 className="text-3xl font-bold text-foreground">{averagePerformance}%</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Team efficiency score
                </p>
              </div>
              <div className="w-14 h-14 rounded-xl bg-success/10 flex items-center justify-center">
                <TrendingUp className="w-7 h-7 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-hover animate-fadeIn" style={{ animationDelay: '300ms' }}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Top Performer</p>
                <h3 className="text-xl font-bold text-foreground">{topPerformer?.name}</h3>
                <p className="text-sm text-warning mt-1">
                  {topPerformer?.performance}% performance
                </p>
              </div>
              <div className="w-14 h-14 rounded-xl bg-warning/10 flex items-center justify-center">
                <Award className="w-7 h-7 text-warning" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card className="mb-6 animate-fadeIn" style={{ animationDelay: '400ms' }}>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search staff by name, role, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Staff Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStaff.map((member, index) => (
          <Card 
            key={member.id} 
            className="card-hover overflow-hidden animate-fadeIn cursor-pointer"
            style={{ animationDelay: `${500 + index * 100}ms` }}
            onClick={() => openStaffDetails(member)}
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <Avatar className="w-16 h-16 border-2 border-white shadow-lg">
                    <AvatarImage src={member.avatar} alt={member.name} />
                    <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-white text-xl">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-foreground">{member.name}</h3>
                    <p className="text-sm text-muted-foreground">{member.role}</p>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                    <button className="p-2 rounded-lg hover:bg-background">
                      <MoreVertical className="w-4 h-4 text-muted-foreground" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Edit2 className="w-4 h-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="space-y-4">
                {/* Performance */}
                <div>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-muted-foreground">Performance</span>
                    <span className="font-medium" style={{ color: getPerformanceColor(member.performance) }}>
                      {member.performance}%
                    </span>
                  </div>
                  <div className="w-full h-2 bg-[#e0e0e0] rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-500"
                      style={{ 
                        width: `${member.performance}%`,
                        backgroundColor: getPerformanceColor(member.performance)
                      }}
                    />
                  </div>
                </div>

                {/* Attendance */}
                <div>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-muted-foreground">Attendance</span>
                    <span className="font-medium" style={{ color: getAttendanceColor(member.attendance) }}>
                      {member.attendance}%
                    </span>
                  </div>
                  <div className="w-full h-2 bg-[#e0e0e0] rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-500"
                      style={{ 
                        width: `${member.attendance}%`,
                        backgroundColor: getAttendanceColor(member.attendance)
                      }}
                    />
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="text-center p-3 rounded-lg bg-background">
                    <p className="text-lg font-bold text-primary">
                      {formatCurrency(member.salesThisMonth)}
                    </p>
                    <p className="text-xs text-muted-foreground">Sales This Month</p>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-background">
                    <p className="text-lg font-bold text-success">
                      {member.attendance}%
                    </p>
                    <p className="text-xs text-muted-foreground">Attendance</p>
                  </div>
                </div>

                {/* Contact Info */}
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Mail className="w-3 h-3" />
                    <span className="truncate max-w-[120px]">{member.email}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Phone className="w-3 h-3" />
                    <span>{member.phone}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredStaff.length === 0 && (
        <div className="text-center py-16 animate-fadeIn">
          <Users className="w-16 h-16 text-border mx-auto mb-4" />
          <p className="text-lg text-muted-foreground mb-2">No staff found</p>
          <p className="text-sm text-muted-foreground">Try adjusting your search</p>
        </div>
      )}

      {/* Staff Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden border-0 shadow-2xl bg-white">
          {selectedStaff && (
            <>
              {/* Header with gradient */}
              <div className="bg-gradient-to-r from-primary to-secondary p-6">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-3 text-white text-xl">
                    <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    Staff Details
                  </DialogTitle>
                </DialogHeader>
              </div>
              
              <div className="p-6 bg-white">
                <div className="flex items-center gap-6 mb-6">
                  <Avatar className="w-24 h-24 border-4 border-white shadow-xl">
                    <AvatarImage src={selectedStaff.avatar} alt={selectedStaff.name} />
                    <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-white text-3xl">
                      {selectedStaff.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="text-2xl font-bold text-foreground">{selectedStaff.name}</h2>
                    <p className="text-muted-foreground">{selectedStaff.role}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge 
                        variant="secondary"
                        style={{ 
                          backgroundColor: `${getPerformanceColor(selectedStaff.performance)}15`,
                          color: getPerformanceColor(selectedStaff.performance)
                        }}
                      >
                        <Star className="w-3 h-3 mr-1" />
                        {selectedStaff.performance}% Performance
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="p-4 rounded-xl bg-background">
                    <p className="text-sm text-muted-foreground mb-1">Sales This Month</p>
                    <p className="text-2xl font-bold text-primary">
                      {formatCurrency(selectedStaff.salesThisMonth)}
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-background">
                    <p className="text-sm text-muted-foreground mb-1">Attendance Rate</p>
                    <p className="text-2xl font-bold text-success">
                      {selectedStaff.attendance}%
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-[#f8f9fa]">
                    <Mail className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="font-medium text-foreground">{selectedStaff.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-[#f8f9fa]">
                    <Phone className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Phone</p>
                      <p className="font-medium text-foreground">{selectedStaff.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-[#f8f9fa]">
                    <Calendar className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Joined Date</p>
                      <p className="font-medium text-foreground">
                        {format(new Date(selectedStaff.joinedDate), 'MMMM d, yyyy')}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <Button className="flex-1 bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white">
                    <Edit2 className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    View Reports
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Add Staff Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[520px] p-0 overflow-hidden border-0 shadow-2xl">
          {/* Header with gradient */}
          <div className="bg-gradient-to-r from-secondary to-primary p-6">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3 text-white text-xl">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                  <UserPlus className="w-5 h-5 text-white" />
                </div>
                Add New Staff
              </DialogTitle>
            </DialogHeader>
          </div>
          
          {/* Form Content */}
          <div className="p-6 space-y-5 bg-white">
            {/* Name */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-muted-foreground">Full Name</Label>
              <Input
                placeholder="Enter staff name..."
                value={staffForm.name}
                onChange={(e) => setStaffForm({ ...staffForm, name: e.target.value })}
                className="h-12 border-border focus:border-secondary focus:ring-secondary/20"
              />
            </div>
            
            {/* Role & Email Row */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-muted-foreground">Role</Label>
                <Input
                  placeholder="e.g. Sales Associate"
                  value={staffForm.role}
                  onChange={(e) => setStaffForm({ ...staffForm, role: e.target.value })}
                  className="h-12 border-border focus:border-secondary focus:ring-secondary/20"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-muted-foreground">Email</Label>
                <Input
                  type="email"
                  placeholder="staff@shop.com"
                  value={staffForm.email}
                  onChange={(e) => setStaffForm({ ...staffForm, email: e.target.value })}
                  className="h-12 border-border focus:border-secondary focus:ring-secondary/20"
                />
              </div>
            </div>
            
            {/* Phone */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-muted-foreground">Phone Number</Label>
              <Input
                placeholder="+1234567890"
                value={staffForm.phone}
                onChange={(e) => setStaffForm({ ...staffForm, phone: e.target.value })}
                className="h-12 border-border focus:border-secondary focus:ring-secondary/20"
              />
            </div>
            
            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button 
                variant="outline" 
                className="flex-1 h-12 border-border text-muted-foreground hover:bg-background hover:text-foreground"
                onClick={() => {
                  setStaffForm({ name: '', role: '', email: '', phone: '' });
                  setIsAddDialogOpen(false);
                }}
              >
                Cancel
              </Button>
              <Button 
                className="flex-1 h-12 bg-gradient-to-r from-secondary to-primary hover:opacity-90 text-white font-medium"
                onClick={() => {
                  if (!staffForm.name || !staffForm.role || !staffForm.email) {
                    toast.error('Please fill in all required fields');
                    return;
                  }
                  toast.success('Staff added successfully!');
                  setStaffForm({ name: '', role: '', email: '', phone: '' });
                  setIsAddDialogOpen(false);
                }}
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Add Staff
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
