import { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  TrendingUp, 
  Package, 
  Users, 
  MessageCircle, 
  Grid3X3, 
  Calendar, 
  BarChart3, 
  Menu, 
  Bell,
  Settings,
  LogOut,
  User
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Toaster } from '@/components/ui/sonner';
import { toast } from 'sonner';

// Import sections
import DashboardSection from '@/sections/DashboardSection';
import IncomeExpenseSection from '@/sections/IncomeExpenseSection';
import InventorySection from '@/sections/InventorySection';
import StaffSection from '@/sections/StaffSection';
import TelegramSection from '@/sections/TelegramSection';
import CategoriesSection from '@/sections/CategoriesSection';
import EnhancedAttendanceSection from '@/sections/EnhancedAttendanceSection';
import ReportsSection from '@/sections/ReportsSection';

// Import data
import { initialDashboardStats, sampleIncomes, sampleExpenses, sampleProducts, sampleStaff } from '@/data/store';
import type { DashboardStats, Income, Expense, Product, Staff } from '@/types';

type SectionType = 'dashboard' | 'income-expense' | 'inventory' | 'staff' | 'telegram' | 'categories' | 'attendance' | 'reports';

function App() {
  const [activeSection, setActiveSection] = useState<SectionType>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [stats, setStats] = useState<DashboardStats>(initialDashboardStats);
  const [incomes, setIncomes] = useState<Income[]>(sampleIncomes);
  const [expenses, setExpenses] = useState<Expense[]>(sampleExpenses);
  const [products, setProducts] = useState<Product[]>(sampleProducts);
  const [staff] = useState<Staff[]>(sampleStaff);
  const [notifications, setNotifications] = useState(3);

  // Update stats when data changes
  useEffect(() => {
    const totalRevenue = incomes.reduce((sum, inc) => sum + inc.amount, 0);
    const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    const netProfit = totalRevenue - totalExpenses;
    const lowStockProducts = products.filter(p => p.stock <= p.minStock).length;
    
    setStats(prev => ({
      ...prev,
      totalRevenue,
      totalExpenses,
      netProfit,
      lowStockProducts,
      totalProducts: products.length,
    }));
  }, [incomes, expenses, products]);

  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'income-expense', label: 'Income & Expense', icon: TrendingUp },
    { id: 'inventory', label: 'Inventory', icon: Package },
    { id: 'categories', label: 'Categories', icon: Grid3X3 },
    { id: 'staff', label: 'Staff', icon: Users },
    { id: 'attendance', label: 'Attendance', icon: Calendar },
    { id: 'telegram', label: 'Telegram Bot', icon: MessageCircle },
    { id: 'reports', label: 'Reports', icon: BarChart3 },
  ];

  const handleNavigation = (section: SectionType) => {
    setActiveSection(section);
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddIncome = (income: Income) => {
    setIncomes(prev => [income, ...prev]);
    toast.success('Income added successfully!');
  };

  const handleAddExpense = (expense: Expense) => {
    setExpenses(prev => [expense, ...prev]);
    toast.success('Expense added successfully!');
  };

  const handleAddProduct = (product: Product) => {
    setProducts(prev => [product, ...prev]);
    toast.success('Product added successfully!');
  };

  const handleUpdateProduct = (updatedProduct: Product) => {
    setProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
    toast.success('Product updated successfully!');
  };

  const handleDeleteProduct = (productId: string) => {
    setProducts(prev => prev.filter(p => p.id !== productId));
    toast.success('Product deleted successfully!');
  };

  const renderSection = () => {
    switch (activeSection) {
      case 'dashboard':
        return <DashboardSection stats={stats} incomes={incomes} expenses={expenses} />;
      case 'income-expense':
        return (
          <IncomeExpenseSection 
            incomes={incomes} 
            expenses={expenses} 
            onAddIncome={handleAddIncome}
            onAddExpense={handleAddExpense}
          />
        );
      case 'inventory':
        return (
          <InventorySection 
            products={products}
            onAddProduct={handleAddProduct}
            onUpdateProduct={handleUpdateProduct}
            onDeleteProduct={handleDeleteProduct}
          />
        );
      case 'staff':
        return <StaffSection staff={staff} />;
      case 'telegram':
        return <TelegramSection />;
      case 'categories':
        return <CategoriesSection />;
      case 'attendance':
        return <EnhancedAttendanceSection />;
      case 'reports':
        return <ReportsSection incomes={incomes} expenses={expenses} products={products} staff={staff} />;
      default:
        return <DashboardSection stats={stats} incomes={incomes} expenses={expenses} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Skip to main content link (a11y) */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:bg-primary focus:text-primary-foreground focus:px-4 focus:py-2 focus:rounded-md focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-ring"
      >
        Skip to main content
      </a>
      {/* Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/50">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg">
                <LayoutDashboard className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold gradient-text hidden sm:block">ShopManager</span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavigation(item.id as SectionType)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                      activeSection === item.id
                        ? 'bg-primary/10 text-primary'
                        : 'text-muted-foreground hover:bg-primary/5 hover:text-primary'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </button>
                );
              })}
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center gap-3">
              {/* Notifications */}
              <button 
                className="relative p-2 rounded-lg hover:bg-primary/5 transition-colors"
                onClick={() => {
                  setNotifications(0);
                  toast.info('No new notifications');
                }}
              >
                <Bell className="w-5 h-5 text-muted-foreground" />
                {notifications > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-destructive text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                    {notifications}
                  </span>
                )}
              </button>

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 p-1 rounded-full hover:bg-primary/5 transition-colors">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src="/avatar.jpg" alt="User" />
                      <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-white text-sm">
                        AD
                      </AvatarFallback>
                    </Avatar>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-white border border-border shadow-xl">
                  <DropdownMenuLabel className="font-semibold text-foreground">My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    className="cursor-pointer hover:bg-background focus:bg-background"
                    onClick={() => toast.info('Profile page coming soon!')}
                  >
                    <User className="w-4 h-4 mr-2 text-primary" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="cursor-pointer hover:bg-background focus:bg-background"
                    onClick={() => toast.info('Settings page coming soon!')}
                  >
                    <Settings className="w-4 h-4 mr-2 text-muted-foreground" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    className="text-destructive cursor-pointer hover:bg-destructive/10 focus:bg-destructive/10"
                    onClick={() => toast.info('Logged out successfully!')}
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Mobile Menu Button */}
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                  <button className="lg:hidden p-2 rounded-lg hover:bg-primary/5 transition-colors">
                    <Menu className="w-5 h-5 text-muted-foreground" />
                  </button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[280px] p-0 bg-white border-l border-border shadow-2xl">
                  <div className="flex flex-col h-full">
                    <div className="p-4 border-b border-border bg-white">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                          <LayoutDashboard className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-lg font-bold gradient-text">ShopManager</span>
                      </div>
                    </div>
                    <div className="flex-1 overflow-auto py-4 bg-white">
                      <div className="px-3 space-y-1">
                        {navigationItems.map((item) => {
                          const Icon = item.icon;
                          return (
                            <button
                              key={item.id}
                              onClick={() => handleNavigation(item.id as SectionType)}
                              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 ${
                                activeSection === item.id
                                  ? 'bg-primary/10 text-primary'
                                  : 'text-muted-foreground hover:bg-primary/5 hover:text-primary'
                              }`}
                            >
                              <Icon className="w-5 h-5" />
                              {item.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main id="main-content" tabIndex={-1} className="pt-16 min-h-screen focus:outline-none">
        <div className="animate-fadeIn">
          {renderSection()}
        </div>
      </main>

      {/* Toast Notifications */}
      <Toaster position="top-right" richColors />
    </div>
  );
}

export default App;
