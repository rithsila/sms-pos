import { useEffect, useState } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Package, 
  Users, 
  ShoppingCart,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Box,
  CreditCard,
  FileText
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import type { DashboardStats, Income, Expense } from '@/types';
import { sampleMonthlyData } from '@/data/store';
import { format } from 'date-fns';

interface DashboardSectionProps {
  stats: DashboardStats;
  incomes: Income[];
  expenses: Expense[];
}

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative' | 'neutral';
  icon: React.ElementType;
  color: string;
  delay: number;
}

function StatCard({ title, value, change, changeType, icon: Icon, color, delay }: StatCardProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <Card 
      className={`card-hover overflow-hidden transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
            <h3 className="text-2xl font-bold text-foreground mb-2">{value}</h3>
            <div className="flex items-center gap-1">
              {changeType === 'positive' ? (
                <ArrowUpRight className="w-4 h-4 text-success" />
              ) : changeType === 'negative' ? (
                <ArrowDownRight className="w-4 h-4 text-destructive" />
              ) : null}
              <span className={`text-sm font-medium ${
                changeType === 'positive' ? 'text-success' : 
                changeType === 'negative' ? 'text-destructive' : 'text-muted-foreground'
              }`}>
                {change}
              </span>
            </div>
          </div>
          <div 
            className="w-12 h-12 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: `${color}15` }}
          >
            <Icon className="w-6 h-6" style={{ color }} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function DashboardSection({ stats, incomes, expenses }: DashboardSectionProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const recentTransactions = [
    ...incomes.map(i => ({ ...i, type: 'income' as const })),
    ...expenses.map(e => ({ ...e, type: 'expense' as const })),
  ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="mb-8 animate-fadeInDown">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-1">Dashboard Overview</h1>
            <p className="text-muted-foreground">Real-time insights into your business performance</p>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="w-4 h-4" />
            {format(new Date(), 'MMMM d, yyyy')}
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
        <StatCard
          title="Total Revenue"
          value={formatCurrency(stats.totalRevenue)}
          change="+12%"
          changeType="positive"
          icon={DollarSign}
          color="hsl(var(--primary))"
          delay={100}
        />
        <StatCard
          title="Total Expenses"
          value={formatCurrency(stats.totalExpenses)}
          change="+5%"
          changeType="negative"
          icon={TrendingDown}
          color="hsl(var(--destructive))"
          delay={200}
        />
        <StatCard
          title="Net Profit"
          value={formatCurrency(stats.netProfit)}
          change="+18%"
          changeType="positive"
          icon={TrendingUp}
          color="hsl(var(--success))"
          delay={300}
        />
        <StatCard
          title="Pending Orders"
          value={stats.pendingOrders.toString()}
          change="5 new"
          changeType="neutral"
          icon={ShoppingCart}
          color="hsl(var(--warning))"
          delay={400}
        />
      </div>

      {/* Charts and Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Revenue Chart */}
        <Card className="lg:col-span-2 card-hover animate-fadeIn" style={{ animationDelay: '500ms' }}>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold">Revenue vs Expenses</CardTitle>
              <Badge variant="secondary" className="bg-primary/10 text-primary">
                Last 30 Days
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] sm:h-[350px]">
              {mounted && (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={sampleMonthlyData}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--destructive))" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="hsl(var(--destructive))" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                    <XAxis 
                      dataKey="month" 
                      stroke="hsl(var(--muted-foreground))" 
                      fontSize={12}
                      tickLine={false}
                    />
                    <YAxis 
                      stroke="hsl(var(--muted-foreground))" 
                      fontSize={12}
                      tickLine={false}
                      tickFormatter={(value) => `$${value/1000}k`}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: '1px solid #e0e0e0',
                        borderRadius: '8px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                      }}
                      formatter={(value: number) => formatCurrency(value)}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="revenue" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={2}
                      fillOpacity={1} 
                      fill="url(#colorRevenue)" 
                      name="Revenue"
                    />
                    <Area 
                      type="monotone" 
                      dataKey="expenses" 
                      stroke="hsl(var(--destructive))" 
                      strokeWidth={2}
                      fillOpacity={1} 
                      fill="url(#colorExpenses)" 
                      name="Expenses"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions & Alerts */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card className="card-hover animate-fadeIn" style={{ animationDelay: '600ms' }}>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start gap-3 btn-primary" variant="default">
                <Plus className="w-4 h-4" />
                Add Sale
              </Button>
              <Button className="w-full justify-start gap-3 btn-danger" variant="default">
                <CreditCard className="w-4 h-4" />
                Add Expense
              </Button>
              <Button className="w-full justify-start gap-3 btn-success" variant="default">
                <FileText className="w-4 h-4" />
                View Report
              </Button>
              <Button className="w-full justify-start gap-3 bg-secondary hover:bg-secondary" variant="default">
                <Box className="w-4 h-4" />
                Manage Inventory
              </Button>
            </CardContent>
          </Card>

          {/* Low Stock Alert */}
          <Card className="card-hover animate-fadeIn border-l-4 border-l-warning" style={{ animationDelay: '700ms' }}>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Package className="w-5 h-5 text-warning" />
                Low Stock Alert
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-3">
                <span className="text-3xl font-bold text-foreground">{stats.lowStockProducts}</span>
                <Badge className="bg-warning/10 text-[#f9a825]">Action Needed</Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Products running below minimum stock level
              </p>
              <Button variant="outline" className="w-full text-sm">
                View All
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recent Transactions & Staff Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Transactions */}
        <Card className="card-hover animate-fadeIn" style={{ animationDelay: '800ms' }}>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold">Recent Transactions</CardTitle>
              <Button variant="ghost" size="sm" className="text-primary">
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentTransactions.map((transaction, index) => (
                <div 
                  key={transaction.id}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-background transition-colors"
                  style={{ animationDelay: `${900 + index * 100}ms` }}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      transaction.type === 'income' 
                        ? 'bg-success/10' 
                        : 'bg-destructive/10'
                    }`}>
                      {transaction.type === 'income' ? (
                        <TrendingUp className="w-5 h-5 text-success" />
                      ) : (
                        <TrendingDown className="w-5 h-5 text-destructive" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{transaction.description}</p>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(transaction.date), 'MMM d, yyyy')}
                      </p>
                    </div>
                  </div>
                  <span className={`font-semibold ${
                    transaction.type === 'income' ? 'text-success' : 'text-destructive'
                  }`}>
                    {transaction.type === 'income' ? '+' : '-'}
                    {formatCurrency(transaction.amount)}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Staff Overview */}
        <Card className="card-hover animate-fadeIn" style={{ animationDelay: '900ms' }}>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold">Staff Overview</CardTitle>
              <Button variant="ghost" size="sm" className="text-primary">
                Manage
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="p-4 rounded-xl bg-primary/5 text-center">
                <Users className="w-6 h-6 text-primary mx-auto mb-2" />
                <p className="text-2xl font-bold text-foreground">{stats.totalStaff}</p>
                <p className="text-sm text-muted-foreground">Total Staff</p>
              </div>
              <div className="p-4 rounded-xl bg-success/5 text-center">
                <TrendingUp className="w-6 h-6 text-success mx-auto mb-2" />
                <p className="text-2xl font-bold text-foreground">{stats.activeStaff}</p>
                <p className="text-sm text-muted-foreground">Active Today</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Attendance Rate</span>
                <span className="font-semibold text-success">92%</span>
              </div>
              <div className="w-full h-2 bg-[#e0e0e0] rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-success to-success rounded-full" style={{ width: '92%' }} />
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Performance Score</span>
                <span className="font-semibold text-primary">87%</span>
              </div>
              <div className="w-full h-2 bg-[#e0e0e0] rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-primary to-secondary rounded-full" style={{ width: '87%' }} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
