import { useState } from 'react';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Smartphone, 
  Shirt, 
  Coffee, 
  Home, 
  Dumbbell, 
  Package,
  MoreVertical,
  Check
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { sampleCategories } from '@/data/store';
import type { ProductCategory } from '@/types';
import { toast } from 'sonner';
import { useConfirmDialog } from '@/components/common/ConfirmDialog';

const iconMap: Record<string, React.ElementType> = {
  Smartphone,
  Shirt,
  Coffee,
  Home,
  Dumbbell,
  Package,
};

export default function CategoriesSection() {
  const { confirm, dialog: confirmDialog } = useConfirmDialog();
  const [categories, setCategories] = useState<ProductCategory[]>(sampleCategories);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<ProductCategory | null>(null);
  const [categoryForm, setCategoryForm] = useState({
    name: '',
    icon: 'Package',
    color: 'hsl(var(--primary))',
  });

  const handleAddCategory = () => {
    if (!categoryForm.name) {
      toast.error('Please enter a category name');
      return;
    }

    const newCategory: ProductCategory = {
      id: Date.now().toString(),
      name: categoryForm.name,
      icon: categoryForm.icon,
      color: categoryForm.color,
      productCount: 0,
    };

    setCategories([...categories, newCategory]);
    resetForm();
    setIsAddDialogOpen(false);
    toast.success('Category added successfully!');
  };

  const handleEditCategory = () => {
    if (!editingCategory || !categoryForm.name) return;

    const updatedCategories = categories.map(cat =>
      cat.id === editingCategory.id
        ? { ...cat, name: categoryForm.name, icon: categoryForm.icon, color: categoryForm.color }
        : cat
    );

    setCategories(updatedCategories);
    resetForm();
    setIsEditDialogOpen(false);
    setEditingCategory(null);
    toast.success('Category updated successfully!');
  };

  const handleDeleteCategory = async (categoryId: string) => {
    const ok = await confirm({
      title: 'Delete category?',
      description: 'This action cannot be undone. The category will be permanently removed.',
      confirmLabel: 'Delete category',
      variant: 'destructive',
    });
    if (ok) {
      setCategories(categories.filter(cat => cat.id !== categoryId));
      toast.success('Category deleted successfully!');
    }
  };

  const openEditDialog = (category: ProductCategory) => {
    setEditingCategory(category);
    setCategoryForm({
      name: category.name,
      icon: category.icon,
      color: category.color,
    });
    setIsEditDialogOpen(true);
  };

  const resetForm = () => {
    setCategoryForm({
      name: '',
      icon: 'Package',
      color: 'hsl(var(--primary))',
    });
  };

  const colorOptions = [
    'hsl(var(--primary))', 'hsl(var(--secondary))', 'hsl(var(--success))', 'hsl(var(--warning))', 'hsl(var(--destructive))', 'hsl(var(--primary))', 'hsl(var(--muted-foreground))', '#ff6d00'
  ];

  const iconOptions = ['Smartphone', 'Shirt', 'Coffee', 'Home', 'Dumbbell', 'Package'];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1400px] mx-auto">
      {confirmDialog}
      {/* Header */}
      <div className="mb-8 animate-fadeInDown">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">Product Categories</h1>
            <p className="text-muted-foreground">Organize your products by category</p>
          </div>
          <Button 
            className="btn-primary"
            onClick={() => setIsAddDialogOpen(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Category
          </Button>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {categories.map((category, index) => {
          const Icon = iconMap[category.icon] || Package;
          return (
            <Card 
              key={category.id} 
              className="card-hover overflow-hidden animate-fadeIn group cursor-pointer"
              style={{ animationDelay: `${100 + index * 50}ms` }}
            >
              <div 
                className="h-2"
                style={{ backgroundColor: category.color }}
              />
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div 
                    className="w-14 h-14 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: `${category.color}15` }}
                  >
                    <Icon className="w-7 h-7" style={{ color: category.color }} />
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                      <button
                        aria-label="Category actions"
                        className="p-2 rounded-lg hover:bg-background opacity-100 md:opacity-40 md:group-hover:opacity-100 transition-opacity"
                      >
                        <MoreVertical className="w-4 h-4 text-muted-foreground" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => openEditDialog(category)}>
                        <Edit2 className="w-4 h-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="text-destructive"
                        onClick={() => handleDeleteCategory(category.id)}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <h3 className="font-semibold text-foreground text-lg mb-1">{category.name}</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {category.productCount} product{category.productCount !== 1 ? 's' : ''}
                </p>

                <div className="flex items-center justify-between">
                  <Badge 
                    variant="secondary"
                    style={{ 
                      backgroundColor: `${category.color}15`,
                      color: category.color
                    }}
                  >
                    {category.icon}
                  </Badge>
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: category.color }}
                  />
                </div>
              </CardContent>
            </Card>
          );
        })}

        {/* Add New Category Card */}
        <Card 
          className="card-hover cursor-pointer border-2 border-dashed border-border hover:border-primary bg-background animate-fadeIn flex items-center justify-center min-h-[200px]"
          style={{ animationDelay: `${100 + categories.length * 50}ms` }}
          onClick={() => setIsAddDialogOpen(true)}
        >
          <CardContent className="p-6 text-center">
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
              <Plus className="w-7 h-7 text-primary" />
            </div>
            <h3 className="font-semibold text-foreground">Add New Category</h3>
            <p className="text-sm text-muted-foreground">Create a new product category</p>
          </CardContent>
        </Card>
      </div>

      {/* Add Category Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[520px] p-0 overflow-hidden border-0 shadow-2xl">
          {/* Header with gradient */}
          <div className="bg-gradient-to-r from-warning to-warning p-6">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3 text-white text-xl">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                  <Plus className="w-5 h-5 text-white" />
                </div>
                Add New Category
              </DialogTitle>
            </DialogHeader>
          </div>
          
          {/* Form Content */}
          <div className="p-6 space-y-5 bg-white">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-muted-foreground">Category Name</Label>
              <Input
                placeholder="Enter category name..."
                value={categoryForm.name}
                onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                className="h-12 border-border focus:border-warning focus:ring-warning/20"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-muted-foreground">Icon</Label>
              <div className="grid grid-cols-6 gap-2">
                {iconOptions.map((icon) => {
                  const Icon = iconMap[icon];
                  return (
                    <button
                      key={icon}
                      onClick={() => setCategoryForm({ ...categoryForm, icon })}
                      className={`p-3 rounded-xl border-2 transition-all h-14 ${
                        categoryForm.icon === icon 
                          ? 'border-warning bg-warning/10' 
                          : 'border-border hover:border-warning/50'
                      }`}
                    >
                      <Icon className={`w-5 h-5 mx-auto ${
                        categoryForm.icon === icon ? 'text-warning' : 'text-muted-foreground'
                      }`} />
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-muted-foreground">Color</Label>
              <div className="flex flex-wrap gap-3">
                {colorOptions.map((color) => (
                  <button
                    key={color}
                    onClick={() => setCategoryForm({ ...categoryForm, color })}
                    className={`w-12 h-12 rounded-full border-2 transition-all ${
                      categoryForm.color === color 
                        ? 'border-foreground scale-110 shadow-lg' 
                        : 'border-transparent hover:scale-105'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

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
                className="flex-1 h-12 bg-gradient-to-r from-warning to-warning hover:opacity-90 text-white font-medium"
                onClick={handleAddCategory}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Category
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Category Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[520px] p-0 overflow-hidden border-0 shadow-2xl">
          {/* Header with gradient */}
          <div className="bg-gradient-to-r from-secondary to-primary p-6">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3 text-white text-xl">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                  <Edit2 className="w-5 h-5 text-white" />
                </div>
                Edit Category
              </DialogTitle>
            </DialogHeader>
          </div>
          
          {/* Form Content */}
          <div className="p-6 space-y-5 bg-white">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-muted-foreground">Category Name</Label>
              <Input
                placeholder="Enter category name..."
                value={categoryForm.name}
                onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                className="h-12 border-border focus:border-secondary focus:ring-secondary/20"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-muted-foreground">Icon</Label>
              <div className="grid grid-cols-6 gap-2">
                {iconOptions.map((icon) => {
                  const Icon = iconMap[icon];
                  return (
                    <button
                      key={icon}
                      onClick={() => setCategoryForm({ ...categoryForm, icon })}
                      className={`p-3 rounded-xl border-2 transition-all h-14 ${
                        categoryForm.icon === icon 
                          ? 'border-secondary bg-secondary/10' 
                          : 'border-border hover:border-secondary/50'
                      }`}
                    >
                      <Icon className={`w-5 h-5 mx-auto ${
                        categoryForm.icon === icon ? 'text-secondary' : 'text-muted-foreground'
                      }`} />
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-muted-foreground">Color</Label>
              <div className="flex flex-wrap gap-3">
                {colorOptions.map((color) => (
                  <button
                    key={color}
                    onClick={() => setCategoryForm({ ...categoryForm, color })}
                    className={`w-12 h-12 rounded-full border-2 transition-all ${
                      categoryForm.color === color 
                        ? 'border-foreground scale-110 shadow-lg' 
                        : 'border-transparent hover:scale-105'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button 
                variant="outline" 
                className="flex-1 h-12 border-border text-muted-foreground hover:bg-background hover:text-foreground"
                onClick={() => {
                  resetForm();
                  setIsEditDialogOpen(false);
                  setEditingCategory(null);
                }}
              >
                Cancel
              </Button>
              <Button 
                className="flex-1 h-12 bg-gradient-to-r from-secondary to-primary hover:opacity-90 text-white font-medium"
                onClick={handleEditCategory}
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
