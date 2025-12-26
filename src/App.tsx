import { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { CartProvider } from './context/CartContext';
import { ProductsProvider } from './context/ProductsContext';
import { AuthProvider } from './context/AuthContext';
import { Product } from './lib/supabase';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ShopPage } from './components/ShopPage';
import { CartSidebar } from './components/CartSidebar';
import { QuickViewModal } from './components/QuickViewModal';
import { SearchOverlay } from './components/SearchOverlay';
import { AuthModal } from './components/AuthModal';
import { ProfileModal } from './components/ProfileModal';
import { Footer } from './components/Footer';

function AppContent() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

  const handleQuickView = (product: Product) => {
    setSelectedProduct(product);
    setIsQuickViewOpen(true);
  };

  const handleShopClick = () => {
    const shopSection = document.getElementById('shop');
    shopSection?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white">
      <Toaster position="top-center" />
      <Navbar
        onCartClick={() => setIsCartOpen(true)}
        onSearchClick={() => setIsSearchOpen(true)}
        onAuthModalOpen={() => setIsAuthModalOpen(true)}
        onProfileOpen={() => setIsProfileModalOpen(true)}
      />
      <Hero onShopClick={handleShopClick} />
      <ShopPage onQuickView={handleQuickView} />
      <Footer />

      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <QuickViewModal product={selectedProduct} isOpen={isQuickViewOpen} onClose={() => setIsQuickViewOpen(false)} />
      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} onSelectProduct={handleQuickView} />
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
      <ProfileModal isOpen={isProfileModalOpen} onClose={() => setIsProfileModalOpen(false)} />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <ProductsProvider>
          <AppContent />
        </ProductsProvider>
      </CartProvider>
    </AuthProvider>
  );
}
