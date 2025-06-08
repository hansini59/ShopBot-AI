
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Trash2, Plus, Minus, CreditCard, ShoppingBag, CheckCircle } from 'lucide-react';
import { CartItem } from '@/hooks/useCart';
import { useToast } from '@/hooks/use-toast';

interface ShoppingCartProps {
  items: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  totalPrice: number;
}

export const ShoppingCart: React.FC<ShoppingCartProps> = ({
  items,
  onUpdateQuantity,
  onRemoveItem,
  totalPrice
}) => {
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [checkoutForm, setCheckoutForm] = useState({
    email: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    name: '',
    address: ''
  });
  const { toast } = useToast();

  const handleCheckout = async () => {
    if (items.length === 0) return;
    
    setIsCheckingOut(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsCheckingOut(false);
      setOrderComplete(true);
      toast({
        title: "Order Complete!",
        description: `Successfully processed payment of $${totalPrice.toFixed(2)}`,
      });
    }, 3000);
  };

  const subtotal = totalPrice;
  const shipping = subtotal > 100 ? 0 : 10;
  const tax = subtotal * 0.08;
  const finalTotal = subtotal + shipping + tax;

  if (orderComplete) {
    return (
      <div className="max-w-2xl mx-auto text-center space-y-6">
        <Card className="p-8 bg-gradient-to-b from-green-50 to-white border-green-200">
          <div className="space-y-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-green-800">Order Complete!</h2>
            <p className="text-green-600">
              Thank you for your purchase. Your order has been processed successfully.
            </p>
            <div className="bg-white p-4 rounded-lg border">
              <p className="text-sm text-muted-foreground">Order Total</p>
              <p className="text-2xl font-bold text-green-600">${finalTotal.toFixed(2)}</p>
            </div>
            <Button 
              onClick={() => setOrderComplete(false)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Continue Shopping
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto text-center space-y-6">
        <Card className="p-8">
          <div className="space-y-4">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto">
              <ShoppingBag className="w-8 h-8 text-slate-400" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800">Your cart is empty</h2>
            <p className="text-slate-600">
              Start shopping to add items to your cart!
            </p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-slate-800">Shopping Cart</h1>
        <p className="text-slate-600">{items.length} item(s) in your cart</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <Card key={item.id} className="p-4 bg-white">
              <div className="flex space-x-4">
                <img 
                  src={item.image} 
                  alt={item.name}
                  className="w-20 h-20 rounded-lg object-cover"
                />
                <div className="flex-1 space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">{item.name}</h3>
                      <Badge variant="secondary" className="mt-1">
                        {item.category}
                      </Badge>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onRemoveItem(item.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="w-3 h-3" />
                      </Button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                      >
                        <Plus className="w-3 h-3" />
                      </Button>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg">${(item.price * item.quantity).toFixed(2)}</p>
                      <p className="text-sm text-muted-foreground">${item.price} each</p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Order Summary */}
        <div className="space-y-4">
          <Card className="p-6 bg-white">
            <CardHeader className="p-0 pb-4">
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="p-0 space-y-3">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
              </div>
              {shipping === 0 && (
                <p className="text-sm text-green-600">Free shipping on orders over $100!</p>
              )}
              <div className="flex justify-between">
                <span>Tax</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>${finalTotal.toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>

          {/* Checkout Form */}
          <Card className="p-6 bg-white">
            <CardHeader className="p-0 pb-4">
              <CardTitle>Checkout Information</CardTitle>
            </CardHeader>
            <CardContent className="p-0 space-y-4">
              <div>
                <label className="text-sm font-medium">Email</label>
                <Input 
                  type="email"
                  placeholder="your@email.com"
                  value={checkoutForm.email}
                  onChange={(e) => setCheckoutForm(prev => ({ ...prev, email: e.target.value }))}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">Card Number</label>
                <Input 
                  placeholder="1234 5678 9012 3456"
                  value={checkoutForm.cardNumber}
                  onChange={(e) => setCheckoutForm(prev => ({ ...prev, cardNumber: e.target.value }))}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-sm font-medium">Expiry</label>
                  <Input 
                    placeholder="MM/YY"
                    value={checkoutForm.expiryDate}
                    onChange={(e) => setCheckoutForm(prev => ({ ...prev, expiryDate: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">CVV</label>
                  <Input 
                    placeholder="123"
                    value={checkoutForm.cvv}
                    onChange={(e) => setCheckoutForm(prev => ({ ...prev, cvv: e.target.value }))}
                  />
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium">Cardholder Name</label>
                <Input 
                  placeholder="John Doe"
                  value={checkoutForm.name}
                  onChange={(e) => setCheckoutForm(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>

              <Button 
                onClick={handleCheckout}
                disabled={isCheckingOut || !checkoutForm.email || !checkoutForm.cardNumber}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                {isCheckingOut ? (
                  <div className="flex items-center">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Processing...
                  </div>
                ) : (
                  <>
                    <CreditCard className="w-4 h-4 mr-2" />
                    Complete Order - ${finalTotal.toFixed(2)}
                  </>
                )}
              </Button>
              
              <p className="text-xs text-muted-foreground text-center">
                This is a demo checkout. No real payment will be processed.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
