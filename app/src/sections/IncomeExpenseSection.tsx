import { useState } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Plus, 
  Calendar, 
  Tag, 
  Trash2,
  DollarSign,
  Search,
  Filter
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
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
  DialogTrigger,
} from '@/components/ui/dialog';
import type { Income, Expense } from '@/types';
import { format } from 'date-fns';
import { toast } from 'sonner';

interface IncomeExpenseSectionProps {
  incomes: Income[];
  expenses: Expense[];
  onAddIncome: (income: Income) => void;
  onAddExpense: (expense: Expense) => void;
}

export default function IncomeExpenseSection({ 
  incomes, 
  expenses, 
  onAddIncome, 
  onAddExpense 
}: IncomeExpenseSectionProps) {
  const [activeTab, setActiveTab] = useState<'income' | 'expense'>('income');
  const [searchTerm, setSearchTerm] = useState('');
  const [isIncomeDialogOpen, setIsIncomeDialogOpen] = useState(false);
  const [isExpenseDialogOpen, setIsExpenseDialogOpen] = useState(false);

  // Form states
  const [incomeForm, setIncomeForm] = useState<{
    date: string;
    amount: string;
    category: 'Sales' | 'Service' | 'Other';
    description: string;
  }>({
    date: format(new Date(), 'yyyy-MM-dd'),
    amount: '',
    category: 'Sales',
    description: ''
  });

  const [expenseForm, setExpenseForm] = useState<{
    date: string;
    amount: string;
    category: 'Rent' | 'Utilities' | 'Inventory' | 'Salary' | 'Other';
    description: string;
  }>({
    date: format(new Date(), 'yyyy-MM-dd'),
    amount: '',
    category: 'Inventory',
    description: ''
  });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  const totalIncome = incomes.reduce((sum, inc) => sum + inc.amount, 0);
  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const netProfit = totalIncome - totalExpenses;

  const filteredIncomes = incomes.filter(inc => 
    inc.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inc.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredExpenses = expenses.filter(exp => 
    exp.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    exp.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddIncome = () => {
    if (!incomeForm.amount || !incomeForm.description) {
      toast.error('Please fill in all required fields');
      return;
    }

    const newIncome: Income = {
      id: Date.now().toString(),
      date: incomeForm.date,
      amount: parseFloat(incomeForm.amount),
      category: incomeForm.category,
      description: incomeForm.description,
      createdAt: new Date().toISOString(),
    };

    onAddIncome(newIncome);
    setIncomeForm({
      date: format(new Date(), 'yyyy-MM-dd'),
      amount: '',
      category: 'Sales',
      description: ''
    });
    setIsIncomeDialogOpen(false);
  };

  const handleAddExpense = () => {
    if (!expenseForm.amount || !expenseForm.description) {
      toast.error('Please fill in all required fields');
      return;
    }

    const newExpense: Expense = {
      id: Date.now().toString(),
      date: expenseForm.date,
      amount: parseFloat(expenseForm.amount),
      category: expenseForm.category,
      description: expenseForm.description,
      createdAt: new Date().toISOString(),
    };

    onAddExpense(newExpense);
    setExpenseForm({
      date: format(new Date(), 'yyyy-MM-dd'),
      amount: '',
      category: 'Inventory',
      description: ''
    });
    setIsExpenseDialogOpen(false);
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Sales': 'hsl(var(--success))',
      'Service': 'hsl(var(--primary))',
      'Other': 'hsl(var(--muted-foreground))',
      'Rent': 'hsl(var(--destructive))',
      'Utilities': 'hsl(var(--warning))',
      'Inventory': 'hsl(var(--secondary))',
      'Salary': 'hsl(var(--primary))',
    };
    return colors[category] || 'hsl(var(--muted-foreground))';
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="mb-8 animate-fadeInDown">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">Income & Expense Tracker</h1>
        <p className="text-muted-foreground">Manage your shop's financial transactions</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6 mb-8">
        <Card className="card-hover animate-fadeIn border-l-4 border-l-success" style={{ animationDelay: '100ms' }}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Total Income</p>
                <h3 className="text-2xl lg:text-3xl font-bold text-success">
                  {formatCurrency(totalIncome)}
                </h3>
              </div>
              <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-hover animate-fadeIn border-l-4 border-l-destructive" style={{ animationDelay: '200ms' }}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Total Expenses</p>
                <h3 className="text-2xl lg:text-3xl font-bold text-destructive">
                  {formatCurrency(totalExpenses)}
                </h3>
              </div>
              <div className="w-12 h-12 rounded-xl bg-destructive/10 flex items-center justify-center">
                <TrendingDown className="w-6 h-6 text-destructive" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card 
          className={`card-hover animate-fadeIn border-l-4 ${
            netProfit >= 0 ? 'border-l-primary' : 'border-l-warning'
          }`} 
          style={{ animationDelay: '300ms' }}
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Net Profit</p>
                <h3 className={`text-2xl lg:text-3xl font-bold ${
                  netProfit >= 0 ? 'text-primary' : 'text-warning'
                }`}>
                  {formatCurrency(netProfit)}
                </h3>
              </div>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                netProfit >= 0 ? 'bg-primary/10' : 'bg-warning/10'
              }`}>
                <DollarSign className={`w-6 h-6 ${
                  netProfit >= 0 ? 'text-primary' : 'text-warning'
                }`} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Transaction List */}
        <Card className="lg:col-span-2 card-hover animate-fadeIn" style={{ animationDelay: '400ms' }}>
          <CardHeader className="pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab('income')}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    activeTab === 'income'
                      ? 'bg-success text-white'
                      : 'bg-background text-muted-foreground hover:bg-[#e0e0e0]'
                  }`}
                >
                  Income
                </button>
                <button
                  onClick={() => setActiveTab('expense')}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    activeTab === 'expense'
                      ? 'bg-destructive text-white'
                      : 'bg-background text-muted-foreground hover:bg-[#e0e0e0]'
                  }`}
                >
                  Expenses
                </button>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative flex-1 sm:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search transactions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button variant="outline" size="icon">
                  <Filter className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-[500px] overflow-auto">
              {activeTab === 'income' ? (
                filteredIncomes.length === 0 ? (
                  <div className="text-center py-12">
                    <TrendingUp className="w-12 h-12 text-border mx-auto mb-4" />
                    <p className="text-muted-foreground">No income records found</p>
                  </div>
                ) : (
                  filteredIncomes.map((income, index) => (
                    <div
                      key={income.id}
                      className="flex items-center justify-between p-4 rounded-xl bg-[#f8f9fa] hover:bg-[#e8f5e9] transition-all duration-300 group"
                      style={{ animationDelay: `${500 + index * 50}ms` }}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center">
                          <TrendingUp className="w-5 h-5 text-success" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{income.description}</p>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="w-3 h-3" />
                            {format(new Date(income.date), 'MMM d, yyyy')}
                            <span className="w-1 h-1 rounded-full bg-border" />
                            <Badge 
                              variant="secondary" 
                              className="text-xs"
                              style={{ 
                                backgroundColor: `${getCategoryColor(income.category)}15`,
                                color: getCategoryColor(income.category)
                              }}
                            >
                              {income.category}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-lg font-bold text-success">
                          +{formatCurrency(income.amount)}
                        </span>
                        <button
                          aria-label="Delete record"
                          className="opacity-100 md:opacity-40 md:group-hover:opacity-100 p-2 rounded-lg hover:bg-destructive/10 text-destructive transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))
                )
              ) : (
                filteredExpenses.length === 0 ? (
                  <div className="text-center py-12">
                    <TrendingDown className="w-12 h-12 text-border mx-auto mb-4" />
                    <p className="text-muted-foreground">No expense records found</p>
                  </div>
                ) : (
                  filteredExpenses.map((expense, index) => (
                    <div
                      key={expense.id}
                      className="flex items-center justify-between p-4 rounded-xl bg-[#f8f9fa] hover:bg-destructive/10 transition-all duration-300 group"
                      style={{ animationDelay: `${500 + index * 50}ms` }}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center">
                          <TrendingDown className="w-5 h-5 text-destructive" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{expense.description}</p>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="w-3 h-3" />
                            {format(new Date(expense.date), 'MMM d, yyyy')}
                            <span className="w-1 h-1 rounded-full bg-border" />
                            <Badge 
                              variant="secondary" 
                              className="text-xs"
                              style={{ 
                                backgroundColor: `${getCategoryColor(expense.category)}15`,
                                color: getCategoryColor(expense.category)
                              }}
                            >
                              {expense.category}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-lg font-bold text-destructive">
                          -{formatCurrency(expense.amount)}
                        </span>
                        <button
                          aria-label="Delete record"
                          className="opacity-100 md:opacity-40 md:group-hover:opacity-100 p-2 rounded-lg hover:bg-destructive/10 text-destructive transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))
                )
              )}
            </div>
          </CardContent>
        </Card>

        {/* Add Transaction Forms */}
        <div className="space-y-6">
          {/* Add Income Dialog */}
          <Dialog open={isIncomeDialogOpen} onOpenChange={setIsIncomeDialogOpen}>
            <DialogTrigger asChild>
              <Card className="card-hover cursor-pointer border-2 border-dashed border-success/30 hover:border-success animate-fadeIn bg-success/5" style={{ animationDelay: '500ms' }}>
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-success flex items-center justify-center">
                    <Plus className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Add Income</h3>
                    <p className="text-sm text-muted-foreground">Record a new sale or service</p>
                  </div>
                </CardContent>
              </Card>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[520px] p-0 overflow-hidden border-0 shadow-2xl">
              {/* Header with gradient */}
              <div className="bg-gradient-to-r from-success to-success p-6">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-3 text-white text-xl">
                    <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-white" />
                    </div>
                    Add New Income
                  </DialogTitle>
                </DialogHeader>
              </div>
              
              {/* Form Content */}
              <div className="p-6 space-y-5 bg-white">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-muted-foreground">Date</Label>
                    <Input
                      type="date"
                      value={incomeForm.date}
                      onChange={(e) => setIncomeForm({ ...incomeForm, date: e.target.value })}
                      className="h-12 border-border focus:border-success focus:ring-success/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-muted-foreground">Amount ($)</Label>
                    <Input
                      type="number"
                      placeholder="0.00"
                      value={incomeForm.amount}
                      onChange={(e) => setIncomeForm({ ...incomeForm, amount: e.target.value })}
                      className="h-12 border-border focus:border-success focus:ring-success/20"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">Category</Label>
                  <Select
                    value={incomeForm.category}
                    onValueChange={(value) => 
                      setIncomeForm({ ...incomeForm, category: value as any })
                    }
                  >
                    <SelectTrigger className="h-12 border-border focus:border-success focus:ring-success/20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Sales">Sales</SelectItem>
                      <SelectItem value="Service">Service</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">Description</Label>
                  <Input
                    placeholder="Enter description..."
                    value={incomeForm.description}
                    onChange={(e) => setIncomeForm({ ...incomeForm, description: e.target.value })}
                    className="h-12 border-border focus:border-success focus:ring-success/20"
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <Button 
                    variant="outline" 
                    className="flex-1 h-12 border-border text-muted-foreground hover:bg-background hover:text-foreground"
                    onClick={() => setIsIncomeDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    className="flex-1 h-12 bg-gradient-to-r from-success to-success hover:opacity-90 text-white font-medium"
                    onClick={handleAddIncome}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Income
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* Add Expense Dialog */}
          <Dialog open={isExpenseDialogOpen} onOpenChange={setIsExpenseDialogOpen}>
            <DialogTrigger asChild>
              <Card className="card-hover cursor-pointer border-2 border-dashed border-destructive/30 hover:border-destructive animate-fadeIn bg-destructive/5" style={{ animationDelay: '600ms' }}>
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-destructive flex items-center justify-center">
                    <Plus className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Add Expense</h3>
                    <p className="text-sm text-muted-foreground">Record a new expense</p>
                  </div>
                </CardContent>
              </Card>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[520px] p-0 overflow-hidden border-0 shadow-2xl">
              {/* Header with gradient */}
              <div className="bg-gradient-to-r from-destructive to-[#c62828] p-6">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-3 text-white text-xl">
                    <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                      <TrendingDown className="w-5 h-5 text-white" />
                    </div>
                    Add New Expense
                  </DialogTitle>
                </DialogHeader>
              </div>
              
              {/* Form Content */}
              <div className="p-6 space-y-5 bg-white">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-muted-foreground">Date</Label>
                    <Input
                      type="date"
                      value={expenseForm.date}
                      onChange={(e) => setExpenseForm({ ...expenseForm, date: e.target.value })}
                      className="h-12 border-border focus:border-destructive focus:ring-destructive/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-muted-foreground">Amount ($)</Label>
                    <Input
                      type="number"
                      placeholder="0.00"
                      value={expenseForm.amount}
                      onChange={(e) => setExpenseForm({ ...expenseForm, amount: e.target.value })}
                      className="h-12 border-border focus:border-destructive focus:ring-destructive/20"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">Category</Label>
                  <Select
                    value={expenseForm.category}
                    onValueChange={(value) => 
                      setExpenseForm({ ...expenseForm, category: value as any })
                    }
                  >
                    <SelectTrigger className="h-12 border-border focus:border-destructive focus:ring-destructive/20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Rent">Rent</SelectItem>
                      <SelectItem value="Utilities">Utilities</SelectItem>
                      <SelectItem value="Inventory">Inventory</SelectItem>
                      <SelectItem value="Salary">Salary</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">Description</Label>
                  <Input
                    placeholder="Enter description..."
                    value={expenseForm.description}
                    onChange={(e) => setExpenseForm({ ...expenseForm, description: e.target.value })}
                    className="h-12 border-border focus:border-destructive focus:ring-destructive/20"
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <Button 
                    variant="outline" 
                    className="flex-1 h-12 border-border text-muted-foreground hover:bg-background hover:text-foreground"
                    onClick={() => setIsExpenseDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    className="flex-1 h-12 bg-gradient-to-r from-destructive to-[#c62828] hover:opacity-90 text-white font-medium"
                    onClick={handleAddExpense}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Expense
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* Monthly Fixed Expenses Info */}
          <Card className="card-hover animate-fadeIn" style={{ animationDelay: '700ms' }}>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Tag className="w-5 h-5 text-primary" />
                Fixed Monthly Expenses
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Rent</span>
                  <span className="font-medium">$680.00</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Staff Salary (4)</span>
                  <span className="font-medium">$720.00</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Electricity</span>
                  <span className="font-medium">$800.00</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Franchise Fee</span>
                  <span className="font-medium">$117.00</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Other Expenses</span>
                  <span className="font-medium">$200.00</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Garbage & Internet</span>
                  <span className="font-medium">$45.00</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Staff Benefits</span>
                  <span className="font-medium">$60.00</span>
                </div>
                <div className="pt-3 border-t border-border">
                  <div className="flex justify-between">
                    <span className="font-semibold text-foreground">Total Fixed</span>
                    <span className="font-bold text-destructive">$2,622.00</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
