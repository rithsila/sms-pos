import { useState } from 'react';
import { 
  BarChart3, 
  Download, 
  Calendar, 
  TrendingUp, 
  TrendingDown, 
  DollarSign,
  Package,
  Users,
  PieChart,
  LineChart,
  BarChart,
  FileText
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  LineChart as ReLineChart, 
  Line, 
  BarChart as ReBarChart,
  Bar,
  PieChart as RePieChart,
  Pie,
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';
import type { Income, Expense, Product, Staff } from '@/types';
import { sampleMonthlyData } from '@/data/store';
import { toast } from 'sonner';
import { downloadCsv } from '@/lib/csvExport';

interface ReportsSectionProps {
  incomes: Income[];
  expenses: Expense[];
  products: Product[];
  staff: Staff[];
}

export default function ReportsSection({ incomes, expenses, products, staff }: ReportsSectionProps) {
  const [dateRange, setDateRange] = useState('30');

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(value);
  };

  // Calculate category data for pie chart
  const categoryData = products.reduce((acc, product) => {
    const existing = acc.find(item => item.name === product.category);
    if (existing) {
      existing.value += product.stock * product.price;
    } else {
      acc.push({ name: product.category, value: product.stock * product.price });
    }
    return acc;
  }, [] as { name: string; value: number }[]);

  const COLORS = ['hsl(var(--primary))', 'hsl(var(--secondary))', 'hsl(var(--success))', 'hsl(var(--warning))', 'hsl(var(--destructive))', 'hsl(var(--primary))'];

  // Staff performance data
  const staffPerformanceData = staff
    .sort((a, b) => b.performance - a.performance)
    .slice(0, 5)
    .map(s => ({
      name: s.name.split(' ')[0],
      performance: s.performance,
      sales: s.salesThisMonth,
    }));

  // Income by category
  const incomeByCategory = incomes.reduce((acc, income) => {
    const existing = acc.find(item => item.name === income.category);
    if (existing) {
      existing.value += income.amount;
    } else {
      acc.push({ name: income.category, value: income.amount });
    }
    return acc;
  }, [] as { name: string; value: number }[]);

  // Expense by category
  const expenseByCategory = expenses.reduce((acc, expense) => {
    const existing = acc.find(item => item.name === expense.category);
    if (existing) {
      existing.value += expense.amount;
    } else {
      acc.push({ name: expense.category, value: expense.amount });
    }
    return acc;
  }, [] as { name: string; value: number }[]);

  const handleExport = (format: string) => {
    if (format !== 'csv') {
      toast.info(`${format.toUpperCase()} export coming soon`);
      return;
    }

    const timestamp = new Date().toISOString().split('T')[0];

    const incomeRows = incomes.map((i) => ({
      id: i.id,
      date: i.date,
      category: i.category,
      amount: i.amount,
      description: i.description,
    }));
    const expenseRows = expenses.map((e) => ({
      id: e.id,
      date: e.date,
      category: e.category,
      amount: e.amount,
      description: e.description,
    }));
    const productRows = products.map((p) => ({
      id: p.id,
      name: p.name,
      sku: p.sku,
      category: p.category,
      price: p.price,
      stock: p.stock,
      minStock: p.minStock,
    }));

    downloadCsv(`income-${timestamp}`, incomeRows);
    downloadCsv(`expenses-${timestamp}`, expenseRows);
    downloadCsv(`products-${timestamp}`, productRows);
    toast.success('CSV reports downloaded (income, expenses, products)');
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="mb-8 animate-fadeInDown">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">Reports & Analytics</h1>
            <p className="text-muted-foreground">Comprehensive business insights and analytics</p>
          </div>
          <div className="flex gap-2">
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-[140px]">
                <Calendar className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">Last 7 Days</SelectItem>
                <SelectItem value="30">Last 30 Days</SelectItem>
                <SelectItem value="90">Last 3 Months</SelectItem>
                <SelectItem value="365">Last Year</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={() => handleExport('csv')}>
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 lg:gap-6 mb-8">
        <Card className="card-hover animate-fadeIn" style={{ animationDelay: '100ms' }}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <p className="text-xl font-bold text-foreground">
                  {formatCurrency(incomes.reduce((sum, i) => sum + i.amount, 0))}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="card-hover animate-fadeIn" style={{ animationDelay: '200ms' }}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center">
                <TrendingDown className="w-5 h-5 text-destructive" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Expenses</p>
                <p className="text-xl font-bold text-foreground">
                  {formatCurrency(expenses.reduce((sum, e) => sum + e.amount, 0))}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="card-hover animate-fadeIn" style={{ animationDelay: '300ms' }}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                <Package className="w-5 h-5 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Products</p>
                <p className="text-xl font-bold text-foreground">{products.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="card-hover animate-fadeIn" style={{ animationDelay: '400ms' }}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center">
                <Users className="w-5 h-5 text-secondary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active Staff</p>
                <p className="text-xl font-bold text-foreground">
                  {staff.filter(s => s.attendance >= 90).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Tabs */}
      <Tabs defaultValue="financial" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 lg:w-auto">
          <TabsTrigger value="financial">
            <LineChart className="w-4 h-4 mr-2" />
            Financial
          </TabsTrigger>
          <TabsTrigger value="products">
            <PieChart className="w-4 h-4 mr-2" />
            Products
          </TabsTrigger>
          <TabsTrigger value="staff">
            <BarChart className="w-4 h-4 mr-2" />
            Staff
          </TabsTrigger>
          <TabsTrigger value="breakdown">
            <FileText className="w-4 h-4 mr-2" />
            Breakdown
          </TabsTrigger>
        </TabsList>

        {/* Financial Tab */}
        <TabsContent value="financial" className="space-y-6">
          <Card className="card-hover animate-fadeIn">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                Revenue vs Expenses Trend
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <ReLineChart data={sampleMonthlyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                    <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                    <YAxis stroke="hsl(var(--muted-foreground))" tickFormatter={(value) => `$${value/1000}k`} />
                    <Tooltip 
                      formatter={(value: number) => formatCurrency(value)}
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="revenue" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={2}
                      dot={{ fill: 'hsl(var(--primary))' }}
                      name="Revenue"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="expenses" 
                      stroke="hsl(var(--destructive))" 
                      strokeWidth={2}
                      dot={{ fill: 'hsl(var(--destructive))' }}
                      name="Expenses"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="profit" 
                      stroke="hsl(var(--success))" 
                      strokeWidth={2}
                      dot={{ fill: 'hsl(var(--success))' }}
                      name="Profit"
                    />
                  </ReLineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="card-hover animate-fadeIn">
              <CardHeader>
                <CardTitle>Income by Category</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RePieChart>
                      <Pie
                        data={incomeByCategory}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {incomeByCategory.map((_entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: number) => formatCurrency(value)} />
                      <Legend />
                    </RePieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="card-hover animate-fadeIn">
              <CardHeader>
                <CardTitle>Expense by Category</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RePieChart>
                      <Pie
                        data={expenseByCategory}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {expenseByCategory.map((_entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: number) => formatCurrency(value)} />
                      <Legend />
                    </RePieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Products Tab */}
        <TabsContent value="products" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="card-hover animate-fadeIn">
              <CardHeader>
                <CardTitle>Inventory Value by Category</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RePieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        outerRadius={150}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {categoryData.map((_entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: number) => formatCurrency(value)} />
                    </RePieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="card-hover animate-fadeIn">
              <CardHeader>
                <CardTitle>Stock Levels</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <ReBarChart data={products.slice(0, 10)}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                      <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" angle={-45} textAnchor="end" height={80} />
                      <YAxis stroke="hsl(var(--muted-foreground))" />
                      <Tooltip />
                      <Bar dataKey="stock" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                    </ReBarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Staff Tab */}
        <TabsContent value="staff" className="space-y-6">
          <Card className="card-hover animate-fadeIn">
            <CardHeader>
              <CardTitle>Staff Performance Ranking</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <ReBarChart data={staffPerformanceData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                    <XAxis type="number" stroke="hsl(var(--muted-foreground))" domain={[0, 100]} />
                    <YAxis dataKey="name" type="category" stroke="hsl(var(--muted-foreground))" width={80} />
                    <Tooltip formatter={(value: number) => `${value}%`} />
                    <Bar dataKey="performance" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                  </ReBarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className="card-hover animate-fadeIn">
              <CardContent className="p-6 text-center">
                <p className="text-sm text-muted-foreground mb-1">Average Performance</p>
                <p className="text-3xl font-bold text-primary">
                  {Math.round(staff.reduce((sum, s) => sum + s.performance, 0) / staff.length)}%
                </p>
              </CardContent>
            </Card>
            <Card className="card-hover animate-fadeIn">
              <CardContent className="p-6 text-center">
                <p className="text-sm text-muted-foreground mb-1">Total Sales</p>
                <p className="text-3xl font-bold text-success">
                  {formatCurrency(staff.reduce((sum, s) => sum + s.salesThisMonth, 0))}
                </p>
              </CardContent>
            </Card>
            <Card className="card-hover animate-fadeIn">
              <CardContent className="p-6 text-center">
                <p className="text-sm text-muted-foreground mb-1">Avg Attendance</p>
                <p className="text-3xl font-bold text-secondary">
                  {Math.round(staff.reduce((sum, s) => sum + s.attendance, 0) / staff.length)}%
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Breakdown Tab */}
        <TabsContent value="breakdown" className="space-y-6">
          <Card className="card-hover animate-fadeIn">
            <CardHeader>
              <CardTitle>Monthly Profit Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <ReBarChart data={sampleMonthlyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                    <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                    <YAxis stroke="hsl(var(--muted-foreground))" tickFormatter={(value) => `$${value/1000}k`} />
                    <Tooltip formatter={(value: number) => formatCurrency(value)} />
                    <Legend />
                    <Bar dataKey="revenue" fill="hsl(var(--primary))" name="Revenue" />
                    <Bar dataKey="expenses" fill="hsl(var(--destructive))" name="Expenses" />
                    <Bar dataKey="profit" fill="hsl(var(--success))" name="Profit" />
                  </ReBarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="card-hover animate-fadeIn">
              <CardHeader>
                <CardTitle>Key Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-xl bg-background">
                  <span className="text-muted-foreground">Average Order Value</span>
                  <span className="font-bold text-foreground">$45.20</span>
                </div>
                <div className="flex items-center justify-between p-4 rounded-xl bg-background">
                  <span className="text-muted-foreground">Conversion Rate</span>
                  <span className="font-bold text-foreground">3.2%</span>
                </div>
                <div className="flex items-center justify-between p-4 rounded-xl bg-background">
                  <span className="text-muted-foreground">Customer Satisfaction</span>
                  <span className="font-bold text-foreground">4.8/5</span>
                </div>
                <div className="flex items-center justify-between p-4 rounded-xl bg-background">
                  <span className="text-muted-foreground">Repeat Customer Rate</span>
                  <span className="font-bold text-foreground">68%</span>
                </div>
              </CardContent>
            </Card>

            <Card className="card-hover animate-fadeIn">
              <CardHeader>
                <CardTitle>Export Options</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start" onClick={() => handleExport('csv')}>
                  <Download className="w-4 h-4 mr-2 text-primary" />
                  Export as CSV
                </Button>
                <Button variant="outline" className="w-full justify-start" onClick={() => handleExport('pdf')} disabled>
                  <FileText className="w-4 h-4 mr-2 text-destructive" />
                  Export as PDF
                  <Badge variant="secondary" className="ml-auto text-[10px]">Soon</Badge>
                </Button>
                <Button variant="outline" className="w-full justify-start" onClick={() => handleExport('excel')} disabled>
                  <BarChart3 className="w-4 h-4 mr-2 text-success" />
                  Export as Excel
                  <Badge variant="secondary" className="ml-auto text-[10px]">Soon</Badge>
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
