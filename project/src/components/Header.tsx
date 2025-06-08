
import React from 'react';
import { Button } from '@/components/ui/button';
import { User, LogOut, MessageCircle } from 'lucide-react';
import { User as UserType } from '@/hooks/useAuth';

interface HeaderProps {
  user: UserType | null;
  onLogin: () => void;
  onLogout: () => void;
  cartItemCount: number;
  onViewChange: (view: 'chat' | 'catalog' | 'cart') => void;
  activeView: 'chat' | 'catalog' | 'cart';
}

export const Header: React.FC<HeaderProps> = ({
  user,
  onLogin,
  onLogout,
  cartItemCount,
  onViewChange,
  activeView
}) => {
  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              ShopBot AI
            </h1>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {user ? (
            <>
              <span className="text-sm font-medium text-slate-700">
                Welcome, {user.name}
              </span>
              
              <Button
                variant="outline"
                size="sm"
                onClick={onLogout}
                className="text-slate-600 hover:text-slate-800"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </>
          ) : (
            <Button onClick={onLogin} className="bg-blue-600 hover:bg-blue-700">
              Sign In
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};
