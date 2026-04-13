import type { Income, Expense, Product, Staff, ProductCategory, TelegramMessage, DashboardStats, MonthlyData } from '@/types';

// Monthly fixed expenses based on user's data
export const fixedMonthlyExpenses = {
  rent: 680,
  staffSalary: 720,
  electricity: 800,
  franchiseFee: 117,
  otherExpenses: 200,
  garbage: 30,
  internet: 15,
  staffBenefits: 60,
  total: 2622
};

// Sample Income Data
export const sampleIncomes: Income[] = [
  { id: '1', date: '2024-01-15', amount: 250, category: 'Sales', description: 'Daily sales - PO #001', createdAt: '2024-01-15T10:00:00Z' },
  { id: '2', date: '2024-01-15', amount: 180, category: 'Sales', description: 'Daily sales - PO #002', createdAt: '2024-01-15T14:30:00Z' },
  { id: '3', date: '2024-01-16', amount: 320, category: 'Sales', description: 'Daily sales - PO #003', createdAt: '2024-01-16T11:00:00Z' },
  { id: '4', date: '2024-01-16', amount: 150, category: 'Service', description: 'Repair service', createdAt: '2024-01-16T16:00:00Z' },
  { id: '5', date: '2024-01-17', amount: 500, category: 'Sales', description: 'Bulk order - PO #004', createdAt: '2024-01-17T09:00:00Z' },
  { id: '6', date: '2024-01-17', amount: 200, category: 'Sales', description: 'Daily sales - PO #005', createdAt: '2024-01-17T15:00:00Z' },
  { id: '7', date: '2024-01-18', amount: 275, category: 'Sales', description: 'Daily sales - PO #006', createdAt: '2024-01-18T10:30:00Z' },
  { id: '8', date: '2024-01-18', amount: 100, category: 'Other', description: 'Miscellaneous income', createdAt: '2024-01-18T17:00:00Z' },
];

// Sample Expense Data
export const sampleExpenses: Expense[] = [
  { id: '1', date: '2024-01-01', amount: 680, category: 'Rent', description: 'Monthly rent payment', createdAt: '2024-01-01T00:00:00Z' },
  { id: '2', date: '2024-01-01', amount: 720, category: 'Salary', description: 'Staff salaries (4 staff)', createdAt: '2024-01-01T00:00:00Z' },
  { id: '3', date: '2024-01-05', amount: 800, category: 'Utilities', description: 'Electricity bill', createdAt: '2024-01-05T00:00:00Z' },
  { id: '4', date: '2024-01-10', amount: 500, category: 'Inventory', description: 'Stock purchase - Electronics', createdAt: '2024-01-10T00:00:00Z' },
  { id: '5', date: '2024-01-15', amount: 300, category: 'Inventory', description: 'Stock purchase - Clothing', createdAt: '2024-01-15T00:00:00Z' },
  { id: '6', date: '2024-01-20', amount: 117, category: 'Other', description: 'Franchise management fee', createdAt: '2024-01-20T00:00:00Z' },
  { id: '7', date: '2024-01-25', amount: 200, category: 'Other', description: 'Other expenses', createdAt: '2024-01-25T00:00:00Z' },
];

// Sample Products Data
export const sampleProducts: Product[] = [
  { id: '1', name: 'Wireless Headphones', sku: 'WH-001', category: 'Electronics', price: 45, stock: 25, minStock: 10, createdAt: '2024-01-01T00:00:00Z' },
  { id: '2', name: 'Smart Watch', sku: 'SW-002', category: 'Electronics', price: 89, stock: 8, minStock: 5, createdAt: '2024-01-01T00:00:00Z' },
  { id: '3', name: 'Cotton T-Shirt', sku: 'TS-003', category: 'Clothing', price: 15, stock: 50, minStock: 20, createdAt: '2024-01-01T00:00:00Z' },
  { id: '4', name: 'Denim Jeans', sku: 'DJ-004', category: 'Clothing', price: 35, stock: 3, minStock: 10, createdAt: '2024-01-01T00:00:00Z' },
  { id: '5', name: 'Coffee Beans 1kg', sku: 'CB-005', category: 'Food & Beverage', price: 12, stock: 15, minStock: 5, createdAt: '2024-01-01T00:00:00Z' },
  { id: '6', name: 'Energy Drink', sku: 'ED-006', category: 'Food & Beverage', price: 3, stock: 100, minStock: 30, createdAt: '2024-01-01T00:00:00Z' },
  { id: '7', name: 'Garden Tools Set', sku: 'GT-007', category: 'Home & Garden', price: 55, stock: 12, minStock: 5, createdAt: '2024-01-01T00:00:00Z' },
  { id: '8', name: 'Plant Pot Large', sku: 'PP-008', category: 'Home & Garden', price: 18, stock: 4, minStock: 8, createdAt: '2024-01-01T00:00:00Z' },
  { id: '9', name: 'Yoga Mat', sku: 'YM-009', category: 'Sports', price: 25, stock: 20, minStock: 10, createdAt: '2024-01-01T00:00:00Z' },
  { id: '10', name: 'Dumbbells 5kg', sku: 'DB-010', category: 'Sports', price: 30, stock: 2, minStock: 5, createdAt: '2024-01-01T00:00:00Z' },
];

// Sample Staff Data
export const sampleStaff: Staff[] = [
  { id: '1', name: 'John Doe', role: 'Manager', email: 'john@shop.com', phone: '+1234567890', performance: 95, salesThisMonth: 5200, attendance: 98, joinedDate: '2023-01-15' },
  { id: '2', name: 'Jane Smith', role: 'Sales Associate', email: 'jane@shop.com', phone: '+1234567891', performance: 88, salesThisMonth: 3800, attendance: 95, joinedDate: '2023-03-20' },
  { id: '3', name: 'Mike Johnson', role: 'Sales Associate', email: 'mike@shop.com', phone: '+1234567892', performance: 82, salesThisMonth: 3200, attendance: 92, joinedDate: '2023-05-10' },
  { id: '4', name: 'Sarah Williams', role: 'Cashier', email: 'sarah@shop.com', phone: '+1234567893', performance: 90, salesThisMonth: 2900, attendance: 96, joinedDate: '2023-06-01' },
  { id: '5', name: 'Tom Brown', role: 'Stock Keeper', email: 'tom@shop.com', phone: '+1234567894', performance: 85, salesThisMonth: 0, attendance: 94, joinedDate: '2023-08-15' },
  { id: '6', name: 'Emily Davis', role: 'Sales Associate', email: 'emily@shop.com', phone: '+1234567895', performance: 78, salesThisMonth: 2600, attendance: 90, joinedDate: '2023-10-01' },
];

// Sample Product Categories
export const sampleCategories: ProductCategory[] = [
  { id: '1', name: 'Electronics', icon: 'Smartphone', color: '#1a73e8', productCount: 45 },
  { id: '2', name: 'Clothing', icon: 'Shirt', color: '#8e24aa', productCount: 78 },
  { id: '3', name: 'Food & Beverage', icon: 'Coffee', color: '#34a853', productCount: 32 },
  { id: '4', name: 'Home & Garden', icon: 'Home', color: '#fbbc04', productCount: 23 },
  { id: '5', name: 'Sports', icon: 'Dumbbell', color: '#ea4335', productCount: 19 },
  { id: '6', name: 'Others', icon: 'Package', color: '#5f6368', productCount: 12 },
];

// Sample Telegram Messages
export const sampleTelegramMessages: TelegramMessage[] = [
  { id: '1', sender: 'ABA Payway', amount: 250, message: 'Payment received: $250.00 - Order #001', timestamp: '2024-01-15T10:00:00Z', type: 'payment' },
  { id: '2', sender: 'ABA Payway', amount: 180, message: 'Payment received: $180.00 - Order #002', timestamp: '2024-01-15T14:30:00Z', type: 'payment' },
  { id: '3', sender: 'ABA Payway', amount: 320, message: 'Payment received: $320.00 - Order #003', timestamp: '2024-01-16T11:00:00Z', type: 'payment' },
  { id: '4', sender: 'System', amount: 0, message: 'Daily report generated', timestamp: '2024-01-16T23:59:00Z', type: 'notification' },
  { id: '5', sender: 'ABA Payway', amount: 500, message: 'Payment received: $500.00 - Order #004', timestamp: '2024-01-17T09:00:00Z', type: 'payment' },
];

// Sample Monthly Data for Charts
export const sampleMonthlyData: MonthlyData[] = [
  { month: 'Jan', revenue: 8500, expenses: 6200, profit: 2300 },
  { month: 'Feb', revenue: 9200, expenses: 6400, profit: 2800 },
  { month: 'Mar', revenue: 8800, expenses: 6100, profit: 2700 },
  { month: 'Apr', revenue: 10500, expenses: 6800, profit: 3700 },
  { month: 'May', revenue: 11200, expenses: 7000, profit: 4200 },
  { month: 'Jun', revenue: 10800, expenses: 6900, profit: 3900 },
  { month: 'Jul', revenue: 12500, expenses: 7500, profit: 5000 },
  { month: 'Aug', revenue: 13200, expenses: 7800, profit: 5400 },
  { month: 'Sep', revenue: 11800, expenses: 7200, profit: 4600 },
  { month: 'Oct', revenue: 14200, expenses: 8200, profit: 6000 },
  { month: 'Nov', revenue: 13800, expenses: 8000, profit: 5800 },
  { month: 'Dec', revenue: 15500, expenses: 8500, profit: 7000 },
];

// Calculate Dashboard Stats
export const calculateDashboardStats = (incomes: Income[], expenses: Expense[], products: Product[], staff: Staff[]): DashboardStats => {
  const totalRevenue = incomes.reduce((sum, inc) => sum + inc.amount, 0);
  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const netProfit = totalRevenue - totalExpenses;
  const lowStockProducts = products.filter(p => p.stock <= p.minStock).length;
  const totalProducts = products.length;
  const activeStaff = staff.filter(s => s.attendance >= 90).length;
  const totalStaff = staff.length;
  
  return {
    totalRevenue,
    totalExpenses,
    netProfit,
    pendingOrders: 23, // Sample value
    lowStockProducts,
    totalProducts,
    activeStaff,
    totalStaff
  };
};

// Initial dashboard stats
export const initialDashboardStats: DashboardStats = {
  totalRevenue: 124500,
  totalExpenses: 89200,
  netProfit: 35300,
  pendingOrders: 23,
  lowStockProducts: 5,
  totalProducts: 209,
  activeStaff: 10,
  totalStaff: 12
};
