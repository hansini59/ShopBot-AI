import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Star, Search, Filter, ShoppingCart, Eye } from 'lucide-react';
import { mockProducts } from '@/data/mockProducts';
import { CartItem } from '@/hooks/useCart';
import { useToast } from '@/hooks/use-toast';

interface ProductCatalogProps {
  onAddToCart: (product: Omit<CartItem, 'quantity'>) => void;
  cartItems: CartItem[];
}

export const ProductCatalog: React.FC<ProductCatalogProps> = ({ onAddToCart, cartItems }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const { toast } = useToast();

  const categories = ['all', ...Array.from(new Set(mockProducts.map(p => p.category)))];

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = mockProducts.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });

    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        default:
          return a.name.localeCompare(b.name);
      }
    });
  }, [searchTerm, selectedCategory, sortBy]);

  const handleAddToCart = (product: any) => {
    onAddToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category
    });
    toast({
      title: "Added to cart!",
      description: `${product.name} has been added to your cart.`
    });
  };

  const getCartQuantity = (productId: string) => {
    const cartItem = cartItems.find(item => item.id === productId);
    return cartItem ? cartItem.quantity : 0;
  };

  const isInCart = (productId: string) => {
    return cartItems.some(item => item.id === productId);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-slate-800">Product Catalog</h1>
        <p className="text-slate-600">Discover our curated collection of premium products</p>
      </div>

      {/* Filters */}
      <Card className="p-6 bg-white">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full md:w-48">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map(category => (
                <SelectItem key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Name (A-Z)</SelectItem>
              <SelectItem value="price-low">Price (Low to High)</SelectItem>
              <SelectItem value="price-high">Price (High to Low)</SelectItem>
              <SelectItem value="rating">Highest Rated</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Results Count */}
      <div className="text-sm text-muted-foreground">
        Showing {filteredAndSortedProducts.length} products
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredAndSortedProducts.map((product) => {
          const cartQuantity = getCartQuantity(product.id);
          
          return (
            <Card key={product.id} className="group hover:shadow-xl transition-all duration-300 hover-scale bg-white">
              <CardHeader className="p-0">
                <div className="relative overflow-hidden rounded-t-lg">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 right-2">
                    <Badge variant="secondary" className="bg-white/90">
                      {product.category}
                    </Badge>
                  </div>
                  {cartQuantity > 0 && (
                    <div className="absolute top-2 left-2">
                      <Badge className="bg-green-600">
                        In Cart ({cartQuantity})
                      </Badge>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="p-4 space-y-3">
                <div>
                  <h3 className="font-semibold text-lg line-clamp-1">{product.name}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                    {product.description}
                  </p>
                </div>
                
                <div className="flex items-center space-x-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`w-4 h-4 ${i < Math.floor(product.rating) 
                          ? 'text-yellow-400 fill-current' 
                          : 'text-gray-300'}`} 
                      />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    ({product.reviews})
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-green-600">
                    ${product.price}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {product.stock} in stock
                  </span>
                </div>

                <div className="flex gap-2">
                  <Button 
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedProduct(product)}
                    className="flex-1"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View
                  </Button>
                  <Button 
                    size="sm"
                    onClick={() => handleAddToCart(product)}
                    disabled={product.stock === 0}
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    {cartQuantity > 0 ? `Add More (${cartQuantity})` : 'Add to Cart'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredAndSortedProducts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-lg text-muted-foreground">No products found matching your criteria.</p>
          <Button 
            variant="outline" 
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('all');
            }}
            className="mt-4"
          >
            Clear Filters
          </Button>
        </div>
      )}

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex justify-between items-start">
                <h2 className="text-2xl font-bold">{selectedProduct.name}</h2>
                <Button 
                  variant="ghost" 
                  onClick={() => setSelectedProduct(null)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  ✕
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <img 
                src={selectedProduct.image} 
                alt={selectedProduct.name}
                className="w-full h-64 object-cover rounded-lg"
              />
              <p className="text-muted-foreground">{selectedProduct.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-3xl font-bold text-green-600">
                  ${selectedProduct.price}
                </span>
                <Badge>{selectedProduct.category}</Badge>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`w-5 h-5 ${i < Math.floor(selectedProduct.rating) 
                        ? 'text-yellow-400 fill-current' 
                        : 'text-gray-300'}`} 
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  {selectedProduct.rating} ({selectedProduct.reviews} reviews)
                </span>
              </div>
              <Button 
                onClick={() => {
                  handleAddToCart(selectedProduct);
                  setSelectedProduct(null);
                }}
                disabled={selectedProduct.stock === 0}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                Add to Cart
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
