
import React, { useState, useEffect } from 'react';
import { ChatBot } from '@/components/ChatBot';
import { ProductCatalog } from '@/components/ProductCatalog';
import { ShoppingCart } from '@/components/ShoppingCart';
import { AuthModal } from '@/components/AuthModal';
import { Header } from '@/components/Header';
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/hooks/useCart';
import { Button } from '@/components/ui/button';
import { MessageCircle, ShoppingBag, Grid } from 'lucide-react';

const Index = () => {
  const [activeView, setActiveView] = useState<'chat' | 'catalog' | 'cart'>('chat');
  const [showAuth, setShowAuth] = useState(false);
  const { user, login, logout } = useAuth();
  const { cartItems, addToCart, removeFromCart, updateQuantity, getTotalPrice } = useCart();

  useEffect(() => {
    // Check if user is logged in from localStorage
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      login(JSON.parse(savedUser));
    }
  }, [login]);

  const handleAuthSuccess = (userData: any) => {
    login(userData);
    setShowAuth(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header 
        user={user}
        onLogin={() => setShowAuth(true)}
        onLogout={logout}
        cartItemCount={cartItems.length}
        onViewChange={setActiveView}
        activeView={activeView}
      />
      
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {!user ? (
          <div className="text-center py-20">
            <div className="animate-fade-in">
              <h1 className="text-5xl font-bold text-slate-800 mb-6">
                Welcome to ShopBot AI
              </h1>
              <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
                Your intelligent shopping assistant for electronics, books, and premium products. 
                Get personalized recommendations and seamless shopping experience.
              </p>
              <Button 
                onClick={() => setShowAuth(true)}
                size="lg"
                className="px-8 py-3 text-lg bg-blue-600 hover:bg-blue-700 transform hover:scale-105 transition-all duration-200"
              >
                Get Started
              </Button>
            </div>
          </div>
        ) : (
          <div className="animate-fade-in">
            {/* Navigation Pills */}
            <div className="flex justify-center mb-8">
              <div className="bg-white rounded-full p-2 shadow-lg border">
                <div className="flex space-x-2">
                  <Button
                    variant={activeView === 'chat' ? 'default' : 'ghost'}
                    onClick={() => setActiveView('chat')}
                    className="rounded-full px-6 py-2"
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Chat Assistant
                  </Button>
                  <Button
                    variant={activeView === 'catalog' ? 'default' : 'ghost'}
                    onClick={() => setActiveView('catalog')}
                    className="rounded-full px-6 py-2"
                  >
                    <Grid className="w-4 h-4 mr-2" />
                    Browse Products
                  </Button>
                  <Button
                    variant={activeView === 'cart' ? 'default' : 'ghost'}
                    onClick={() => setActiveView('cart')}
                    className="rounded-full px-6 py-2"
                  >
                    <ShoppingBag className="w-4 h-4 mr-2" />
                    Cart ({cartItems.length})
                  </Button>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="transition-all duration-300">
              {activeView === 'chat' && (
                <ChatBot 
                  user={user} 
                  onAddToCart={addToCart}
                  onViewProduct={(productId) => {
                    setActiveView('catalog');
                    // Could scroll to specific product here
                  }}
                  onViewChange={setActiveView}
                  cartItems={cartItems}
                  totalPrice={getTotalPrice()}
                />
              )}
              
              {activeView === 'catalog' && (
                <ProductCatalog 
                  onAddToCart={addToCart}
                  cartItems={cartItems}
                />
              )}
              
              {activeView === 'cart' && (
                <ShoppingCart 
                  items={cartItems}
                  onUpdateQuantity={updateQuantity}
                  onRemoveItem={removeFromCart}
                  totalPrice={getTotalPrice()}
                />
              )}
            </div>
          </div>
        )}
      </main>

      {/* Auth Modal */}
      <AuthModal 
        isOpen={showAuth}
        onClose={() => setShowAuth(false)}
        onAuthSuccess={handleAuthSuccess}
      />
    </div>
  );
};

export default Index;
