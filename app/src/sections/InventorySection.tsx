import { useState } from 'react';
import { 
  Package, 
  Plus, 
  Search, 
  Filter, 
  Edit2, 
  Trash2, 
  AlertTriangle,
  Check,
  Grid3X3,
  List
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { Product } from '@/types';
import { toast } from 'sonner';

interface InventorySectionProps {
  products: Product[];
  onAddProduct: (product: Product) => void;
  onUpdateProduct: (product: Product) => void;
  onDeleteProduct: (productId: string) => void;
}

export default function InventorySection({ 
  products, 
  onAddProduct, 
  onUpdateProduct, 
  onDeleteProduct 
}: InventorySectionProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productForm, setProductForm] = useState({
    name: '',
    sku: '',
    category: 'Electronics',
    price: '',
    stock: '',
    minStock: '',
  });

  const categories = ['All', 'Electronics', 'Clothing', 'Food & Beverage', 'Home & Garden', 'Sports', 'Others'];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const lowStockProducts = products.filter(p => p.stock <= p.minStock);

  const getStockStatus = (product: Product) => {
    if (product.stock === 0) return { label: 'Out of Stock', color: 'hsl(var(--destructive))', bgColor: 'var(--color-destructive-light)' };
    if (product.stock <= product.minStock) return { label: 'Low Stock', color: 'hsl(var(--warning))', bgColor: 'var(--color-warning-light)' };
    return { label: 'In Stock', color: 'hsl(var(--success))', bgColor: 'var(--color-success-light)' };
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Electronics': 'hsl(var(--primary))',
      'Clothing': 'hsl(var(--secondary))',
      'Food & Beverage': 'hsl(var(--success))',
      'Home & Garden': 'hsl(var(--warning))',
      'Sports': 'hsl(var(--destructive))',
      'Others': 'hsl(var(--muted-foreground))',
    };
    return colors[category] || 'hsl(var(--muted-foreground))';
  };

  const handleAddProduct = () => {
    if (!productForm.name || !productForm.sku || !productForm.price || !productForm.stock) {
      toast.error('Please fill in all required fields');
      return;
    }

    const newProduct: Product = {
      id: Date.now().toString(),
      name: productForm.name,
      sku: productForm.sku,
      category: productForm.category,
      price: parseFloat(productForm.price),
      stock: parseInt(productForm.stock),
      minStock: parseInt(productForm.minStock) || 5,
      createdAt: new Date().toISOString(),
    };

    onAddProduct(newProduct);
    resetForm();
    setIsAddDialogOpen(false);
  };

  const handleEditProduct = () => {
    if (!editingProduct) return;

    const updatedProduct: Product = {
      ...editingProduct,
      name: productForm.name,
      sku: productForm.sku,
      category: productForm.category,
      price: parseFloat(productForm.price),
      stock: parseInt(productForm.stock),
      minStock: parseInt(productForm.minStock) || 5,
    };

    onUpdateProduct(updatedProduct);
    resetForm();
    setIsEditDialogOpen(false);
    setEditingProduct(null);
  };

  const handleDeleteProduct = (productId: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      onDeleteProduct(productId);
    }
  };

  const openEditDialog = (product: Product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      sku: product.sku,
      category: product.category,
      price: product.price.toString(),
      stock: product.stock.toString(),
      minStock: product.minStock.toString(),
    });
    setIsEditDialogOpen(true);
  };

  const resetForm = () => {
    setProductForm({
      name: '',
      sku: '',
      category: 'Electronics',
      price: '',
      stock: '',
      minStock: '',
    });
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="mb-8 animate-fadeInDown">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">Inventory Management</h1>
            <p className="text-muted-foreground">Manage your products and stock levels</p>
          </div>
          <Button 
            className="btn-primary"
            onClick={() => setIsAddDialogOpen(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Product
          </Button>
        </div>
      </div>

      {/* Low Stock Alert */}
      {lowStockProducts.length > 0 && (
        <Card className="mb-6 border-l-4 border-l-warning bg-[#fff8e1] animate-fadeIn" style={{ animationDelay: '100ms' }}>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-warning/20 flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="w-5 h-5 text-[#f9a825]" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-foreground">
                {lowStockProducts.length} product{lowStockProducts.length > 1 ? 's' : ''} running low on stock
              </p>
              <p className="text-sm text-muted-foreground">
                Please restock soon to avoid running out of inventory
              </p>
            </div>
            <Button variant="outline" size="sm">
              View All
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <Card className="card-hover animate-fadeIn" style={{ animationDelay: '200ms' }}>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground mb-1">Total Products</p>
            <p className="text-2xl font-bold text-foreground">{products.length}</p>
          </CardContent>
        </Card>
        <Card className="card-hover animate-fadeIn" style={{ animationDelay: '300ms' }}>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground mb-1">In Stock</p>
            <p className="text-2xl font-bold text-success">
              {products.filter(p => p.stock > p.minStock).length}
            </p>
          </CardContent>
        </Card>
        <Card className="card-hover animate-fadeIn" style={{ animationDelay: '400ms' }}>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground mb-1">Low Stock</p>
            <p className="text-2xl font-bold text-warning">
              {products.filter(p => p.stock > 0 && p.stock <= p.minStock).length}
            </p>
          </CardContent>
        </Card>
        <Card className="card-hover animate-fadeIn" style={{ animationDelay: '500ms' }}>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground mb-1">Out of Stock</p>
            <p className="text-2xl font-bold text-destructive">
              {products.filter(p => p.stock === 0).length}
            </p>
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
                placeholder="Search products by name or SKU..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-[180px]">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(cat => (
                    <SelectItem key={cat} value={cat.toLowerCase()}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex border rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${viewMode === 'grid' ? 'bg-primary text-white' : 'bg-white text-muted-foreground'}`}
                >
                  <Grid3X3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${viewMode === 'list' ? 'bg-primary text-white' : 'bg-white text-muted-foreground'}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Products Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredProducts.map((product, index) => {
            const status = getStockStatus(product);
            return (
              <Card 
                key={product.id} 
                className="card-hover overflow-hidden animate-fadeIn"
                style={{ animationDelay: `${700 + index * 50}ms` }}
              >
                <div className="h-32 bg-gradient-to-br from-background to-muted flex items-center justify-center">
                  <Package className="w-12 h-12 text-border" />
                </div>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold text-foreground line-clamp-1">{product.name}</h3>
                      <p className="text-sm text-muted-foreground">{product.sku}</p>
                    </div>
                  </div>
                  
                  <Badge 
                    variant="secondary" 
                    className="mb-3"
                    style={{ 
                      backgroundColor: `${getCategoryColor(product.category)}15`,
                      color: getCategoryColor(product.category)
                    }}
                  >
                    {product.category}
                  </Badge>

                  <div className="flex items-center justify-between mb-3">
                    <span className="text-lg font-bold text-primary">
                      {formatCurrency(product.price)}
                    </span>
                    <Badge 
                      variant="secondary"
                      style={{ backgroundColor: status.bgColor, color: status.color }}
                    >
                      {status.label}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between text-sm mb-4">
                    <span className="text-muted-foreground">Stock: {product.stock}</span>
                    <span className="text-muted-foreground">Min: {product.minStock}</span>
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => openEditDialog(product)}
                    >
                      <Edit2 className="w-3 h-3 mr-1" />
                      Edit
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="text-destructive hover:bg-destructive/10"
                      onClick={() => handleDeleteProduct(product.id)}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card className="animate-fadeIn" style={{ animationDelay: '700ms' }}>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-background">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Product</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">SKU</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Category</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Price</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Stock</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Status</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product) => {
                    const status = getStockStatus(product);
                    return (
                      <tr key={product.id} className="border-t border-border hover:bg-background">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-background flex items-center justify-center">
                              <Package className="w-5 h-5 text-border" />
                            </div>
                            <span className="font-medium text-foreground">{product.name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-muted-foreground">{product.sku}</td>
                        <td className="px-4 py-3">
                          <Badge 
                            variant="secondary"
                            style={{ 
                              backgroundColor: `${getCategoryColor(product.category)}15`,
                              color: getCategoryColor(product.category)
                            }}
                          >
                            {product.category}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 font-medium text-primary">
                          {formatCurrency(product.price)}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          {product.stock} / {product.minStock}
                        </td>
                        <td className="px-4 py-3">
                          <Badge 
                            variant="secondary"
                            style={{ backgroundColor: status.bgColor, color: status.color }}
                          >
                            {status.label}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex justify-end gap-2">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => openEditDialog(product)}
                            >
                              <Edit2 className="w-4 h-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              className="text-destructive"
                              onClick={() => handleDeleteProduct(product.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {filteredProducts.length === 0 && (
        <div className="text-center py-16 animate-fadeIn">
          <Package className="w-16 h-16 text-border mx-auto mb-4" />
          <p className="text-lg text-muted-foreground mb-2">No products found</p>
          <p className="text-sm text-muted-foreground">Try adjusting your search or filters</p>
        </div>
      )}

      {/* Add Product Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[520px] p-0 overflow-hidden border-0 shadow-2xl">
          {/* Header with gradient */}
          <div className="bg-gradient-to-r from-primary to-secondary p-6">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3 text-white text-xl">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                  <Plus className="w-5 h-5 text-white" />
                </div>
                Add New Product
              </DialogTitle>
            </DialogHeader>
          </div>
          
          {/* Form Content */}
          <div className="p-6 space-y-5 bg-white">
            {/* Product Name - Full Width */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-muted-foreground">Product Name</Label>
              <Input
                placeholder="Enter product name..."
                value={productForm.name}
                onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                className="h-12 border-border focus:border-primary focus:ring-primary/20"
              />
            </div>
            
            {/* SKU & Category Row */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-muted-foreground">SKU</Label>
                <Input
                  placeholder="SKU-001"
                  value={productForm.sku}
                  onChange={(e) => setProductForm({ ...productForm, sku: e.target.value })}
                  className="h-12 border-border focus:border-primary focus:ring-primary/20"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-muted-foreground">Category</Label>
                <Select
                  value={productForm.category}
                  onValueChange={(value) => setProductForm({ ...productForm, category: value })}
                >
                  <SelectTrigger className="h-12 border-border focus:border-primary focus:ring-primary/20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.filter(c => c !== 'All').map(cat => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {/* Price, Stock, Min Stock Row */}
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-muted-foreground">Price ($)</Label>
                <Input
                  type="number"
                  placeholder="0.00"
                  value={productForm.price}
                  onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                  className="h-12 border-border focus:border-primary focus:ring-primary/20"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-muted-foreground">Stock</Label>
                <Input
                  type="number"
                  placeholder="0"
                  value={productForm.stock}
                  onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                  className="h-12 border-border focus:border-primary focus:ring-primary/20"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-muted-foreground">Min Stock</Label>
                <Input
                  type="number"
                  placeholder="5"
                  value={productForm.minStock}
                  onChange={(e) => setProductForm({ ...productForm, minStock: e.target.value })}
                  className="h-12 border-border focus:border-primary focus:ring-primary/20"
                />
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button 
                variant="outline" 
                className="flex-1 h-12 border-border text-muted-foreground hover:bg-background hover:text-foreground"
                onClick={() => {
                  resetForm();
                  setIsAddDialogOpen(false);
                }}
              >
                Cancel
              </Button>
              <Button 
                className="flex-1 h-12 bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white font-medium"
                onClick={handleAddProduct}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Product
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Product Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[520px] p-0 overflow-hidden border-0 shadow-2xl">
          {/* Header with gradient */}
          <div className="bg-gradient-to-r from-success to-primary p-6">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3 text-white text-xl">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                  <Edit2 className="w-5 h-5 text-white" />
                </div>
                Edit Product
              </DialogTitle>
            </DialogHeader>
          </div>
          
          {/* Form Content */}
          <div className="p-6 space-y-5 bg-white">
            {/* Product Name - Full Width */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-muted-foreground">Product Name</Label>
              <Input
                placeholder="Enter product name..."
                value={productForm.name}
                onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                className="h-12 border-border focus:border-success focus:ring-success/20"
              />
            </div>
            
            {/* SKU & Category Row */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-muted-foreground">SKU</Label>
                <Input
                  placeholder="SKU-001"
                  value={productForm.sku}
                  onChange={(e) => setProductForm({ ...productForm, sku: e.target.value })}
                  className="h-12 border-border focus:border-success focus:ring-success/20"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-muted-foreground">Category</Label>
                <Select
                  value={productForm.category}
                  onValueChange={(value) => setProductForm({ ...productForm, category: value })}
                >
                  <SelectTrigger className="h-12 border-border focus:border-success focus:ring-success/20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.filter(c => c !== 'All').map(cat => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {/* Price, Stock, Min Stock Row */}
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-muted-foreground">Price ($)</Label>
                <Input
                  type="number"
                  placeholder="0.00"
                  value={productForm.price}
                  onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                  className="h-12 border-border focus:border-success focus:ring-success/20"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-muted-foreground">Stock</Label>
                <Input
                  type="number"
                  placeholder="0"
                  value={productForm.stock}
                  onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                  className="h-12 border-border focus:border-success focus:ring-success/20"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-muted-foreground">Min Stock</Label>
                <Input
                  type="number"
                  placeholder="5"
                  value={productForm.minStock}
                  onChange={(e) => setProductForm({ ...productForm, minStock: e.target.value })}
                  className="h-12 border-border focus:border-success focus:ring-success/20"
                />
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button 
                variant="outline" 
                className="flex-1 h-12 border-border text-muted-foreground hover:bg-background hover:text-foreground"
                onClick={() => {
                  resetForm();
                  setIsEditDialogOpen(false);
                  setEditingProduct(null);
                }}
              >
                Cancel
              </Button>
              <Button 
                className="flex-1 h-12 bg-gradient-to-r from-success to-primary hover:opacity-90 text-white font-medium"
                onClick={handleEditProduct}
              >
                <Check className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
