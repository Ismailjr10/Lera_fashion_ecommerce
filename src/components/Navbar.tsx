import { useState } from 'react';
import { ShoppingBag, Search, Menu, X, LogOut } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  onCartClick: () => void;
  onSearchClick: () => void;
  onAuthModalOpen: () => void;
  onProfileOpen: () => void;
}

export function Navbar({ onCartClick, onSearchClick, onAuthModalOpen, onProfileOpen }: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false);
  const { getTotalItems } = useCart();
  const { user, signOut } = useAuth();
  const totalItems = getTotalItems();

  const handleLogout = async () => {
    await signOut();
    setIsAccountDropdownOpen(false);
  };

  return (
    <nav className="sticky top-0 bg-white border-b border-gray-200 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-8 flex-1">
            <h1 className="text-2xl font-bold text-maroon-900 font-serif tracking-tight">Lera</h1>
            <div className="hidden md:flex items-center gap-8">
              <a href="#" className="text-gray-700 hover:text-maroon-900 transition-colors font-medium text-sm">
                Home
              </a>
              <a href="#shop" className="text-gray-700 hover:text-maroon-900 transition-colors font-medium text-sm">
                Shop
              </a>
              <a href="#about" className="text-gray-700 hover:text-maroon-900 transition-colors font-medium text-sm">
                About
              </a>
              <a href="#contact" className="text-gray-700 hover:text-maroon-900 transition-colors font-medium text-sm">
                Contact
              </a>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={onSearchClick}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Search"
            >
              <Search size={20} className="text-maroon-900" />
            </button>

            <button
              onClick={onCartClick}
              className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Cart"
            >
              <ShoppingBag size={20} className="text-maroon-900" />
              {totalItems > 0 && (
                <span className="absolute top-0 right-0 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold animate-pulse">
                  {totalItems}
                </span>
              )}
            </button>

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsAccountDropdownOpen(!isAccountDropdownOpen)}
                  className="text-gray-700 hover:text-maroon-900 transition-colors font-medium text-sm"
                >
                  My Account
                </button>
                {isAccountDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                    <button
                      onClick={() => {
                        onProfileOpen();
                        setIsAccountDropdownOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 text-sm font-medium first:rounded-t-lg"
                    >
                      Profile
                    </button>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 text-sm font-medium flex items-center gap-2 last:rounded-b-lg border-t border-gray-200"
                    >
                      <LogOut size={16} />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={onAuthModalOpen}
                className="text-gray-700 hover:text-maroon-900 transition-colors font-medium text-sm"
              >
                Login
              </button>
            )}

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pt-4 border-t border-gray-200 space-y-3">
            <a href="#" className="block text-gray-700 hover:text-maroon-900 transition-colors font-medium">
              Home
            </a>
            <a href="#shop" className="block text-gray-700 hover:text-maroon-900 transition-colors font-medium">
              Shop
            </a>
            <a href="#about" className="block text-gray-700 hover:text-maroon-900 transition-colors font-medium">
              About
            </a>
            <a href="#contact" className="block text-gray-700 hover:text-maroon-900 transition-colors font-medium">
              Contact
            </a>
          </div>
        )}
      </div>
    </nav>
  );
}
