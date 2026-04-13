export interface Income {
  id: string;
  date: string;
  amount: number;
  category: 'Sales' | 'Service' | 'Other';
  description: string;
  createdAt: string;
}

export interface Expense {
  id: string;
  date: string;
  amount: number;
  category: 'Rent' | 'Utilities' | 'Inventory' | 'Salary' | 'Other';
  description: string;
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  price: number;
  stock: number;
  minStock: number;
  image?: string;
  createdAt: string;
}

export interface Staff {
  id: string;
  name: string;
  role: string;
  email: string;
  phone: string;
  avatar?: string;
  performance: number;
  salesThisMonth: number;
  attendance: number;
  joinedDate: string;
}

export interface Attendance {
  id: string;
  staffId: string;
  date: string;
  status: 'present' | 'absent' | 'late' | 'leave';
  checkIn?: string;
  checkOut?: string;
  hoursWorked?: number;
  notes?: string;
}

export interface ProductCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
  productCount: number;
}

export interface TelegramMessage {
  id: string;
  sender: string;
  amount: number;
  message: string;
  timestamp: string;
  type: 'payment' | 'notification';
}

export interface DashboardStats {
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
  pendingOrders: number;
  lowStockProducts: number;
  totalProducts: number;
  activeStaff: number;
  totalStaff: number;
}

export interface MonthlyData {
  month: string;
  revenue: number;
  expenses: number;
  profit: number;
}

// Re-export enhanced attendance types
export * from './attendance';
