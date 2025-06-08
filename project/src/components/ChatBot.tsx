import React, { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Send, Bot, User, RotateCcw, ShoppingCart } from 'lucide-react';
import { User as UserType } from '@/hooks/useAuth';
import { CartItem } from '@/hooks/useCart';
import { mockProducts } from '@/data/mockProducts';
import { useToast } from '@/hooks/use-toast';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  products?: any[];
  isTyping?: boolean;
}

interface ChatBotProps {
  user: UserType;
  onAddToCart: (product: Omit<CartItem, 'quantity'>) => void;
  onViewProduct: (productId: string) => void;
  onViewChange: (view: 'chat' | 'catalog' | 'cart') => void;
  cartItems: CartItem[];
  totalPrice: number;
}

export const ChatBot: React.FC<ChatBotProps> = ({ 
  user, 
  onAddToCart, 
  onViewProduct, 
  onViewChange,
  cartItems, 
  totalPrice 
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: `Hello ${user.name}! 👋 I'm your personal shopping assistant. I can help you find products, add them to cart, and checkout. Just tell me what you're looking for!`,
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [currentProducts, setCurrentProducts] = useState<any[]>([]);
  const [conversationState, setConversationState] = useState<'browsing' | 'product_display' | 'cart_action' | 'checkout'>('browsing');
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const searchProducts = (query: string) => {
    const lowerQuery = query.toLowerCase();
    let results = [];

    console.log('Searching for:', lowerQuery);

    // Enhanced search logic
    if (lowerQuery.includes('wireless headphone') || lowerQuery.includes('headphone') || lowerQuery.includes('earphone')) {
      results = mockProducts.filter(p => 
        p.name.toLowerCase().includes('headphone') || 
        p.name.toLowerCase().includes('earbuds') ||
        p.name.toLowerCase().includes('airpods') ||
        p.name.toLowerCase().includes('audio')
      );
    } else if (lowerQuery.includes('laptop') || lowerQuery.includes('computer')) {
      results = mockProducts.filter(p => 
        p.name.toLowerCase().includes('laptop') || 
        p.name.toLowerCase().includes('macbook') ||
        p.name.toLowerCase().includes('dell') ||
        p.name.toLowerCase().includes('gaming laptop')
      );
    } else if (lowerQuery.includes('phone') || lowerQuery.includes('mobile')) {
      results = mockProducts.filter(p => 
        p.name.toLowerCase().includes('iphone') || 
        p.name.toLowerCase().includes('samsung') ||
        p.name.toLowerCase().includes('pixel') ||
        p.name.toLowerCase().includes('oneplus')
      );
    } else if (lowerQuery.includes('book')) {
      results = mockProducts.filter(p => p.category === 'Books');
    } else if (lowerQuery.includes('watch')) {
      results = mockProducts.filter(p => 
        p.name.toLowerCase().includes('watch') ||
        p.name.toLowerCase().includes('garmin') ||
        p.name.toLowerCase().includes('fitbit')
      );
    } else {
      // General search
      const searchTerms = lowerQuery.split(' ').filter(term => term.length > 2);
      results = mockProducts.filter(p => {
        const productText = `${p.name} ${p.description}`.toLowerCase();
        return searchTerms.some(term => productText.includes(term));
      });
    }

    return results.slice(0, 5); // Limit to top 5 results
  };

  const handleUserMessage = async (userInput: string) => {
    const lowerInput = userInput.toLowerCase();

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: userInput,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate bot thinking time
    setTimeout(() => {
      let botResponse = '';
      let products: any[] = [];

      // Handle different conversation states and commands
      if (lowerInput.includes('add product') || lowerInput.includes('add item')) {
        // Enhanced pattern to match "add product 3 4 times" or "add product 2"
        const quantityMatch = lowerInput.match(/(?:add product|add item)\s*(\d+)(?:\s*(\d+)\s*times?)?/);
        if (quantityMatch && currentProducts.length > 0) {
          const productIndex = parseInt(quantityMatch[1]) - 1;
          const quantity = quantityMatch[2] ? parseInt(quantityMatch[2]) : 1;
          
          if (productIndex >= 0 && productIndex < currentProducts.length) {
            const selectedProduct = currentProducts[productIndex];
            
            // Add the product multiple times based on quantity
            for (let i = 0; i < quantity; i++) {
              onAddToCart({
                id: selectedProduct.id,
                name: selectedProduct.name,
                price: selectedProduct.price,
                image: selectedProduct.image,
                category: selectedProduct.category
              });
            }
            
            botResponse = `✅ "${selectedProduct.name}" has been added to your cart ${quantity > 1 ? `${quantity} times` : ''}! Your cart now has ${cartItems.length + quantity} items. \n\nWould you like to:\n• Continue shopping\n• Add more products\n• Go to cart\n• Checkout`;
            setConversationState('cart_action');
          } else {
            botResponse = `Sorry, I couldn't find product ${quantityMatch[1]}. Please choose a number from 1 to ${currentProducts.length}.`;
          }
        } else {
          botResponse = `Please specify which product to add by saying "add product [number]" or "add product [number] [quantity] times". \n\nExamples:\n• "add product 1"\n• "add product 3 2 times"`;
        }
      } else if (lowerInput.includes('go to cart') || lowerInput.includes('open cart') || lowerInput.includes('show my cart')) {
        onViewChange('cart');
        botResponse = `🛒 Taking you to your cart now! You can view all your items and proceed with checkout there.`;
      } else if (lowerInput.includes('checkout') || lowerInput.includes('proceed to checkout')) {
        if (cartItems.length > 0) {
          botResponse = `🛒 **Cart Summary:**\n${cartItems.map(item => `• ${item.name} - ₹${item.price} (Qty: ${item.quantity})`).join('\n')}\n\n💰 **Total: ₹${totalPrice.toFixed(2)}**\n\nWould you like to proceed with payment or go to cart to modify it?`;
          setConversationState('checkout');
        } else {
          botResponse = `Your cart is empty! Please add some products first. What would you like to shop for?`;
          setConversationState('browsing');
        }
      } else if ((lowerInput.includes('proceed with payment') || lowerInput.includes('pay now') || lowerInput.includes('payment')) && conversationState === 'checkout') {
        onViewChange('cart');
        botResponse = `🛒 Taking you to the cart page where you can complete your payment of ₹${totalPrice.toFixed(2)}. Fill in your payment details and click "Complete Order" to finish your purchase!`;
        setConversationState('browsing');
      } else if (lowerInput.includes('view cart')) {
        if (cartItems.length > 0) {
          botResponse = `🛒 **Your Cart:**\n${cartItems.map((item, index) => `${index + 1}. ${item.name} - ₹${item.price} (Qty: ${item.quantity})`).join('\n')}\n\n💰 **Total: ₹${totalPrice.toFixed(2)}**\n\nType "go to cart" to view full cart or "checkout" when ready to proceed!`;
        } else {
          botResponse = `Your cart is empty. What would you like to shop for today?`;
        }
      } else if (lowerInput.includes('continue shopping') || lowerInput.includes('shop more')) {
        botResponse = `Great! What else would you like to look for? I can help you find electronics, books, gadgets, and more!`;
        setConversationState('browsing');
      } else {
        // Search for products
        const searchResults = searchProducts(userInput);
        
        if (searchResults.length > 0) {
          products = searchResults;
          setCurrentProducts(searchResults);
          botResponse = `Great choice! I found ${searchResults.length} ${userInput.toLowerCase()} for you. Here are the top options:\n\n${searchResults.map((product, index) => 
            `**${index + 1}. ${product.name}**\n   ₹${product.price} | ⭐ ${product.rating}/5 (${product.reviews} reviews)\n   ${product.description.substring(0, 80)}...`
          ).join('\n\n')}\n\nTo add any product to cart:\n• "add product [number]" - adds 1 item\n• "add product [number] [quantity] times" - adds multiple\n\nExamples: "add product 1" or "add product 3 4 times"`;
          setConversationState('product_display');
        } else {
          botResponse = `I couldn't find any products matching "${userInput}". Try searching for:\n• Electronics (phones, laptops, headphones)\n• Books\n• Gadgets and accessories\n• Watches\n\nWhat would you like to explore?`;
          setConversationState('browsing');
        }
      }

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: botResponse,
        sender: 'bot',
        timestamp: new Date(),
        products: products
      };

      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1000);
  };

  const resetConversation = () => {
    setMessages([
      {
        id: '1',
        content: `Hello ${user.name}! 👋 I'm your personal shopping assistant. I can help you find products, add them to cart, and checkout. Just tell me what you're looking for!`,
        sender: 'bot',
        timestamp: new Date()
      }
    ]);
    setCurrentProducts([]);
    setConversationState('browsing');
  };

  const quickActions = [
    "Show me wireless headphones",
    "I need a laptop",
    "Looking for books",
    "Go to cart"
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="h-[700px] flex flex-col shadow-2xl border-0 bg-gradient-to-b from-white to-slate-50">
        {/* Chat Header */}
        <div className="p-6 border-b bg-white rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Shopping Assistant</h3>
                <p className="text-sm text-muted-foreground">AI-powered conversational shopping - 100+ products</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline">
                <ShoppingCart className="w-3 h-3 mr-1" />
                {cartItems.length} items
              </Badge>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={resetConversation}
                className="hover:bg-slate-100"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset
              </Button>
            </div>
          </div>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 p-6" ref={scrollAreaRef}>
          <div className="space-y-6">
            {messages.map((message) => (
              <div key={message.id} className="animate-fade-in">
                <div className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`flex space-x-3 max-w-[85%] ${message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                    <Avatar className="w-8 h-8">
                      {message.sender === 'bot' ? (
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                          <Bot className="w-4 h-4 text-white" />
                        </div>
                      ) : (
                        <>
                          <AvatarImage src={user.avatar} />
                          <AvatarFallback>
                            <User className="w-4 h-4" />
                          </AvatarFallback>
                        </>
                      )}
                    </Avatar>
                    
                    <div className={`rounded-2xl px-4 py-3 ${
                      message.sender === 'user' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-white border shadow-sm'
                    }`}>
                      <p className="text-sm whitespace-pre-line font-medium">{message.content}</p>
                      <p className={`text-xs mt-2 ${
                        message.sender === 'user' ? 'text-blue-100' : 'text-muted-foreground'
                      }`}>
                        {message.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Product Images for Bot Messages */}
                {message.products && message.products.length > 0 && (
                  <div className="ml-11 mt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {message.products.map((product, index) => (
                        <Card key={product.id} className="p-3 hover:shadow-md transition-all duration-200 bg-white border">
                          <div className="space-y-2">
                            <img 
                              src={product.image} 
                              alt={product.name}
                              className="w-full h-24 rounded object-cover"
                            />
                            <div>
                              <Badge variant="secondary" className="text-xs mb-1">
                                #{index + 1}
                              </Badge>
                              <h4 className="font-medium text-xs truncate">{product.name}</h4>
                              <p className="text-green-600 font-bold text-sm">₹{product.price}</p>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex justify-start animate-fade-in">
                <div className="flex space-x-3">
                  <Avatar className="w-8 h-8">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                  </Avatar>
                  <div className="bg-white border shadow-sm rounded-2xl px-4 py-3">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Quick Actions */}
        {!isTyping && conversationState === 'browsing' && (
          <div className="px-6 py-2 border-t bg-slate-50">
            <p className="text-xs text-muted-foreground mb-2">Quick actions:</p>
            <div className="flex flex-wrap gap-2">
              {quickActions.map((action, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => handleUserMessage(action)}
                  className="text-xs"
                >
                  {action}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className="p-6 border-t bg-white rounded-b-lg">
          <div className="flex space-x-3">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type your message... (e.g., 'wireless headphones', 'add product 1', 'add product 3 4 times')"
              onKeyPress={(e) => e.key === 'Enter' && !isTyping && inputValue.trim() && handleUserMessage(inputValue)}
              className="flex-1"
            />
            <Button 
              onClick={() => handleUserMessage(inputValue)} 
              disabled={!inputValue.trim() || isTyping}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2 text-center">
            Try: "wireless headphones", "add product 2", "add product 3 4 times", "go to cart"
          </p>
        </div>
      </Card>
    </div>
  );
};
