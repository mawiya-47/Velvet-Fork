/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  User as UserIcon, 
  MapPin, 
  Phone, 
  Award, 
  Wallet, 
  Bell, 
  X, 
  Lock, 
  Mail, 
  ChevronRight, 
  Star, 
  Heart, 
  HeartHandshake
} from 'lucide-react';

// Components
import Navbar from './components/Navbar';
import GourmetSommelier from './components/GourmetSommelier';
import Footer from './components/Footer';

// Pages
import Home from './pages/Home';
import Menu from './pages/Menu';
import ReservationPage from './pages/Reservation';
import Ordering, { CartItem } from './pages/Ordering';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/AdminDashboard';
import BlogList from './pages/Blog';
import Faq from './pages/Faq';

// Types
import { User, MenuItem, Order, Reservation, Review, Blog, Notification } from './types';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeView, setActiveView] = useState<string>('home');
  const [cart, setCart] = useState<CartItem[]>([]);
  
  // Database States loaded from Server
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Auth Dialog Modal Controls
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authEmail, setAuthEmail] = useState('');
  const [toastAlerts, setToastAlerts] = useState<Array<{ id: string; msg: string }>>([]);

  // Wishlist local state sync
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [dietaryPreference, setDietaryPreference] = useState<string>('none');

  // Trigger global custom Toast alerts
  const addToast = (msg: string) => {
    const tid = Math.random().toString(36).substr(2, 9);
    setToastAlerts(prev => [...prev, { id: tid, msg }]);
    setTimeout(() => {
      setToastAlerts(prev => prev.filter(t => t.id !== tid));
    }, 4000);
  };

  // 1. Initial configuration loading and session recovery
  useEffect(() => {
    // Check if there is an active session
    const savedEmail = localStorage.getItem('velvet_user_email');
    if (savedEmail) {
      handleSilentLogin(savedEmail);
    } else {
      // Fetch public general menu, blogs, reviews
      fetchPublicContent();
    }

    // Load Cart from localStorage
    const savedCart = localStorage.getItem('velvet_cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error("Cart retrieval error", e);
      }
    }
  }, []);

  const fetchPublicContent = async () => {
    try {
      const [resMenu, resBlogs, resReviews] = await Promise.all([
        fetch('/api/menu'),
        fetch('/api/blogs'),
        fetch('/api/reviews')
      ]);

      const menus = await resMenu.json();
      const bgs = await resBlogs.json();
      const revs = await resReviews.json();

      setMenuItems(menus);
      setBlogs(bgs);
      setReviews(revs);
    } catch (err) {
      console.error("Error loading fine public collections", err);
    }
  };

  const handleSilentLogin = async (email: string) => {
    try {
      const loginRes = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await loginRes.json();
      
      if (data.success && data.user) {
        setCurrentUser(data.user);
        setWishlist(data.user.wishlist || []);
        localStorage.setItem('velvet_user_email', data.user.email);
        
        // Fetch remaining private records
        fetchPrivateContent(data.user.email);
      }
    } catch (err) {
      console.error("Silent login error", err);
    } finally {
      fetchPublicContent();
    }
  };

  const fetchPrivateContent = async (email: string) => {
    try {
      const headers = { 'x-user-email': email };
      const [resReservations, resOrders, resNotifs] = await Promise.all([
        fetch('/api/reservations', { headers }),
        fetch('/api/orders', { headers }),
        fetch('/api/notifications', { headers })
      ]);

      const resv = await resReservations.json();
      const ords = await resOrders.json();
      const nots = await resNotifs.json();

      setReservations(resv);
      setOrders(ords);
      setNotifications(nots);
    } catch (err) {
      console.error("Error retrieving user accounts data", err);
    }
  };

  // 2. Active Session Controller Actions
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authEmail.trim()) {
      addToast("Email credential is required to enter our cellar registry.");
      return;
    }

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: authEmail.trim() })
      });

      const data = await response.json();
      if (data.success && data.user) {
        setCurrentUser(data.user);
        setWishlist(data.user.wishlist || []);
        localStorage.setItem('velvet_user_email', data.user.email);
        
        addToast(`Welcome back, Ambassador ${data.user.name}!`);
        setAuthModalOpen(false);
        setAuthEmail('');

        // Refresh database streams
        fetchPrivateContent(data.user.email);
        fetchPublicContent();
      } else {
        addToast(data.error || "Tasting registry mismatch.");
      }
    } catch (err) {
      console.error(err);
      addToast("Server connection failure. Please verify active ports.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('velvet_user_email');
    setCurrentUser(null);
    setWishlist([]);
    setReservations([]);
    setOrders([]);
    setNotifications([]);
    setActiveView('home');
    addToast("Logged out from Velvet control panel successfully.");
  };

  // 3. Cart State managers
  const handleAddToCart = (item: MenuItem, qty: number) => {
    setCart(prev => {
      const exists = prev.find(c => c.menuItem.id === item.id);
      let updated: CartItem[];
      if (exists) {
        updated = prev.map(c => c.menuItem.id === item.id ? { ...c, quantity: c.quantity + qty } : c);
      } else {
        updated = [...prev, { menuItem: item, quantity: qty }];
      }
      localStorage.setItem('velvet_cart', JSON.stringify(updated));
      return updated;
    });
  };

  const handleRemoveFromCart = (itemId: string) => {
    setCart(prev => {
      const updated = prev.filter(c => c.menuItem.id !== itemId);
      localStorage.setItem('velvet_cart', JSON.stringify(updated));
      return updated;
    });
  };

  const handleUpdateCartQty = (itemId: string, increment: boolean) => {
    setCart(prev => {
      const item = prev.find(c => c.menuItem.id === itemId);
      if (!item) return prev;
      
      let updated: CartItem[];
      const newQty = increment ? item.quantity + 1 : item.quantity - 1;
      
      if (newQty <= 0) {
        updated = prev.filter(c => c.menuItem.id !== itemId);
      } else {
        updated = prev.map(c => c.menuItem.id === itemId ? { ...c, quantity: newQty } : c);
      }
      localStorage.setItem('velvet_cart', JSON.stringify(updated));
      return updated;
    });
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('velvet_cart');
  };

  // 4. API pipelines
  const handleToggleWishlist = async (itemId: string) => {
    if (!currentUser) {
      setAuthModalOpen(true);
      addToast("Tasting credentials required to record wishlisted recipes.");
      return;
    }

    try {
      const response = await fetch('/api/auth/toggle-wishlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-email': currentUser.email
        },
        body: JSON.stringify({ itemId })
      });

      const data = await response.json();
      if (data.success && data.wishlist) {
        setWishlist(data.wishlist);
        setCurrentUser(prev => prev ? { ...prev, wishlist: data.wishlist } : null);
        addToast("Premium recipe saved to your ambassador favorites!");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handlePlaceOrder = async (orderData: {
    address: string;
    phone: string;
    couponCode: string;
    discountAmount: number;
    paymentMode: 'wallet' | 'card';
  }) => {
    if (!currentUser) return;

    // Convert client cart into types-certified array format
    const invoiceItemsTrans = cart.map(c => ({
      menuItemId: c.menuItem.id,
      name: c.menuItem.name,
      price: c.menuItem.price,
      quantity: c.quantity,
      image: c.menuItem.images[0]
    }));

    const subtotal = cart.reduce((acc, c) => acc + (c.menuItem.price * c.quantity), 0);
    const tax = (subtotal - orderData.discountAmount) * 0.09;
    const delivery = subtotal > 60 ? 0 : 5.00;
    const grandTotal = subtotal - orderData.discountAmount + tax + delivery;

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-email': currentUser.email
        },
        body: JSON.stringify({
          items: invoiceItemsTrans,
          subtotal,
          discount: orderData.discountAmount,
          total: grandTotal,
          address: orderData.address,
          phone: orderData.phone,
          paymentMode: orderData.paymentMode,
          specialInstructions: ''
        })
      });

      const data = await response.json();
      if (data.success) {
        // Clear local cart
        clearCart();
        
        // Refresh private data
        fetchPrivateContent(currentUser.email);
        
        // Update user state (deduct wallet balance and add loyalty points)
        if (data.user) {
          setCurrentUser(data.user);
        }
        return { success: true };
      } else {
        return { error: data.error };
      }
    } catch (err: any) {
      console.error(err);
      return { error: "Network transaction failed. Verify credit holds directly." };
    }
  };

  const handleAddReservation = async (resData: {
    date: string;
    time: string;
    guests: number;
    eventType: string;
    paymentMode: 'wallet' | 'card';
    specialInstructions: string;
  }) => {
    if (!currentUser) return;

    try {
      const response = await fetch('/api/reservations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-email': currentUser.email
        },
        body: JSON.stringify(resData)
      });

      const data = await response.json();
      if (data.success) {
        // Refresh entries
        fetchPrivateContent(currentUser.email);
        
        // Update user (wallet points or balance)
        if (data.user) {
          setCurrentUser(data.user);
        }
        return { success: true, reservation: data.reservation };
      } else {
        return { error: data.error };
      }
    } catch (err) {
      console.error(err);
      return { error: "Network booking failure. Try standard dining selection." };
    }
  };

  const handleCancelReservation = async (resId: string) => {
    if (!currentUser) return;

    try {
      const response = await fetch(`/api/reservations/${resId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-user-email': currentUser.email
        },
        body: JSON.stringify({ status: 'Cancelled' })
      });

      const data = await response.json();
      if (data.success) {
        addToast("Dining slot cancelled. Deposited balances returned successfully.");
        fetchPrivateContent(currentUser.email);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddReview = async (menuItemId: string, rating: number, comment: string) => {
    if (!currentUser) return;

    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-email': currentUser.email
        },
        body: JSON.stringify({ rating, comment, menuItemId })
      });

      const data = await response.json();
      if (data.success) {
        // Refresh menu and reviews
        fetchPublicContent();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDepositWallet = async (amount: number) => {
    if (!currentUser) return;

    try {
      const response = await fetch('/api/auth/update-wallet', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-email': currentUser.email
        },
        body: JSON.stringify({ amount })
      });

      const data = await response.json();
      if (data.success && data.user) {
        setCurrentUser(data.user);
        fetchPrivateContent(currentUser.email);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateProfile = async (profileData: { name: string; savedAddress: string; phone: string }) => {
    // Basic local state extension for mockup styling values
    if (currentUser) {
      setCurrentUser(prev => prev ? { ...prev, name: profileData.name, savedAddress: profileData.savedAddress, phone: profileData.phone } : null);
      addToast("Profile credentials changed instantly!");
    }
  };

  const handleMarkNotificationsRead = async () => {
    if (!currentUser) return;

    try {
      await fetch('/api/notifications/mark-read', {
        method: 'POST',
        headers: { 'x-user-email': currentUser.email }
      });
      // Refresh notifications locally
      fetchPrivateContent(currentUser.email);
    } catch (err) {
      console.error(err);
    }
  };

  // 5. Admin actions
  const handleUpdateOrderStatus = async (orderId: string, status: string) => {
    if (!currentUser) return;

    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-user-email': currentUser.email
        },
        body: JSON.stringify({ status })
      });

      const data = await response.json();
      if (data.success) {
        // Refresh
        fetchPrivateContent(currentUser.email);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateReservationStatus = async (resId: string, status: string) => {
    if (!currentUser) return;

    try {
      const response = await fetch(`/api/reservations/${resId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-user-email': currentUser.email
        },
        body: JSON.stringify({ status })
      });

      const data = await response.json();
      if (data.success) {
        fetchPrivateContent(currentUser.email);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddMenuItem = async (newItemData: any) => {
    if (!currentUser) return;

    try {
      const response = await fetch('/api/menu', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-email': currentUser.email
        },
        body: JSON.stringify(newItemData)
      });

      const data = await response.json();
      if (data.success) {
        fetchPublicContent();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteMenuItem = async (itemId: string) => {
    if (!currentUser) return;

    try {
      const response = await fetch(`/api/menu/${itemId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'x-user-email': currentUser.email
        }
      });

      const data = await response.json();
      if (data.success) {
        fetchPublicContent();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleBroadcastNotification = async (title: string, message: string, type: string) => {
    if (!currentUser) return;

    try {
      const response = await fetch('/api/notifications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-email': currentUser.email
        },
        body: JSON.stringify({ title, message, type })
      });

      const data = await response.json();
      if (data.success) {
        fetchPrivateContent(currentUser.email);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Filter to get wishlist MenuItem details
  const wishlistItems = menuItems.filter(item => wishlist.includes(item.id));

  return (
    <div className="bg-[#FFFDF8] min-h-screen text-[#2F2F2F] flex flex-col justify-between selection:bg-[#B76E3A]/20">
      
      {/* 1. TOAST OVERLAYS POPUP LIST */}
      <div className="fixed bottom-6 left-6 z-50 flex flex-col gap-2 max-w-sm">
        {toastAlerts.map((t) => (
          <div 
            key={t.id} 
            className="bg-[#2F2F2F] text-white py-3.5 px-5 rounded-2xl flex items-center justify-between gap-4 border border-white/5 shadow-2xl animate-fade-in text-xs font-bold font-sans tracking-wide"
          >
            <div className="flex items-center gap-2">
              <Sparkles size={14} className="text-[#B76E3A] animate-pulse" />
              <span>{t.msg}</span>
            </div>
            <button 
              onClick={() => setToastAlerts(prev => prev.filter(x => x.id !== t.id))}
              className="text-white/40 hover:text-white shrink-0"
            >
              <X size={12} />
            </button>
          </div>
        ))}
      </div>

      {/* 2. STICKY STYLISH HEADER AREA */}
      <Navbar 
        currentUser={currentUser}
        onLoginClick={() => setAuthModalOpen(true)}
        onLogout={handleLogout}
        activeView={activeView}
        onViewChange={setActiveView}
        cartCount={cart.reduce((acc, c) => acc + c.quantity, 0)}
        notifications={notifications}
        onMarkNotificationsRead={handleMarkNotificationsRead}
      />

      {/* SPECIAL BROADCAST TICKER ALERT */}
      <div className="bg-gradient-to-r from-[#B76E3A] via-[#6D4C41] to-[#B76E3A] text-white text-[10px] uppercase font-bold py-2 px-4 shadow text-center tracking-[0.2em] overflow-hidden whitespace-nowrap">
        <span className="inline-block animate-pulse-slow">
          ✨ VIP Announcement: Standard holding safety deposits on private anniversaries are completely waived with promo code "VELVETVELVET"!
        </span>
      </div>

      {/* 3. DYNAMIC CONTENT ROUTER PORT */}
      <main className="flex-grow">
        {activeView === 'home' && (
          <Home 
            onViewChange={setActiveView} 
            featuredItems={menuItems.filter(item => item.tags.includes('Chef Choice') || item.tags.includes('Best Seller'))}
            reviews={reviews}
            blogs={blogs}
            onToggleWishlist={handleToggleWishlist}
            wishlist={wishlist}
          />
        )}

        {activeView === 'menu' && (
          <Menu 
            menuItems={menuItems}
            reviews={reviews}
            wishlist={wishlist}
            onToggleWishlist={handleToggleWishlist}
            onAddToCart={handleAddToCart}
            onAddReview={handleAddReview}
            currentUser={currentUser}
          />
        )}

        {activeView === 'reservation' && (
          <ReservationPage 
            currentUser={currentUser}
            reservations={reservations}
            onAddReservation={handleAddReservation}
            onLoginClick={() => setAuthModalOpen(true)}
            onCancelReservation={handleCancelReservation}
          />
        )}

        {activeView === 'ordering' && (
          <Ordering 
            currentUser={currentUser}
            cart={cart}
            orders={orders}
            onUpdateCartQty={handleUpdateCartQty}
            onRemoveFromCart={handleRemoveFromCart}
            onPlaceOrder={handlePlaceOrder}
            onLoginClick={() => setAuthModalOpen(true)}
            onAddToast={addToast}
          />
        )}

        {activeView === 'dashboard' && (
          <UserDashboard 
            currentUser={currentUser}
            onUpdateProfile={handleUpdateProfile}
            wishlistItems={wishlistItems}
            onToggleWishlist={handleToggleWishlist}
            orders={orders}
            reservations={reservations}
            notifications={notifications}
            onDepositWallet={handleDepositWallet}
            onViewChange={setActiveView}
            onAddToast={addToast}
          />
        )}

        {activeView === 'admin' && (
          <AdminDashboard 
            currentUser={currentUser}
            menuItems={menuItems}
            orders={orders}
            reservations={reservations}
            onUpdateOrderStatus={handleUpdateOrderStatus}
            onUpdateReservationStatus={handleUpdateReservationStatus}
            onAddMenuItem={handleAddMenuItem}
            onDeleteMenuItem={handleDeleteMenuItem}
            onBroadcastNotification={handleBroadcastNotification}
            onAddToast={addToast}
          />
        )}

        {activeView === 'blog' && (
          <BlogList blogs={blogs} />
        )}

        {activeView === 'faq' && (
          <Faq />
        )}

        {activeView === 'gallery' && (
          <div className="bg-[#FFFDF8] py-16 text-xs font-semibold text-center space-y-12">
            <div className="max-w-xl mx-auto">
              <span className="text-xs uppercase font-black text-[#B76E3A] tracking-[0.25em]">VISUAL DELECTABLES</span>
              <h1 className="text-3xl sm:text-5xl font-serif text-[#2F2F2F] mt-2">Our Culinary Plating Gallery</h1>
              <p className="text-xs text-gray-500 mt-2">Witness first-hand representation of our Michelin aesthetics and fine molecular preparation lines.</p>
            </div>

            <div className="max-w-5xl mx-auto px-4 grid grid-cols-2 md:grid-cols-3 gap-6">
              <div className="relative h-64 rounded-3xl overflow-hidden group shadow-sm">
                <img src="https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=600" className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500" referrerPolicy="no-referrer" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs uppercase tracking-widest font-bold">Australian Lamb Specs</div>
              </div>
              <div className="relative h-64 rounded-3xl overflow-hidden group shadow-sm">
                <img src="https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&q=80&w=600" className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500" referrerPolicy="no-referrer" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs uppercase tracking-widest font-bold">Boulevard Conservatory</div>
              </div>
              <div className="relative h-64 rounded-3xl overflow-hidden group shadow-sm">
                <img src="https://images.unsplash.com/photo-1626132647523-66f5bf380027?auto=format&fit=crop&q=80&w=600" className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500" referrerPolicy="no-referrer" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[10px] uppercase tracking-widest font-bold">Truffled Sauté scallops</div>
              </div>
              <div className="relative h-64 rounded-3xl overflow-hidden group shadow-sm">
                <img src="https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&q=80&w=600" className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500" referrerPolicy="no-referrer" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs uppercase tracking-widest font-bold">Chef plating detail</div>
              </div>
              <div className="relative h-64 rounded-3xl overflow-hidden group shadow-sm">
                <img src="https://images.unsplash.com/photo-1608897013039-887f21d8c804?auto=format&fit=crop&q=80&w=600" className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500" referrerPolicy="no-referrer" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs uppercase tracking-widest font-bold">Creamy Tomato Burrata</div>
              </div>
              <div className="relative h-64 rounded-3xl overflow-hidden group shadow-sm">
                <img src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=600" className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500" referrerPolicy="no-referrer" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs uppercase tracking-widest font-bold">Cellar Reserve hall</div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* FLOATING EXPERT AI SOMMELIER BOT */}
      <GourmetSommelier currentCart={cart} dietaryPreference={dietaryPreference} />

      {/* 4. FOOTER COMPONENT */}
      <Footer />

      {/* 5. GUEST TASTING REGISTRY LOGIN DIALOG POPUP */}
      {authModalOpen && (
        <div className="fixed inset-0 bg-[#2F2F2F]/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#FFFDF8] w-full max-w-md rounded-[32px] shadow-2xl border border-[#F5EFE6] overflow-hidden flex flex-col relative animate-fade-in p-6 sm:p-8 space-y-6">
            
            {/* Close */}
            <button 
              onClick={() => setAuthModalOpen(false)}
              className="absolute top-5 right-5 p-2 bg-white/80 hover:bg-white rounded-full shadow cursor-pointer text-gray-500"
            >
              <X size={16} />
            </button>

            {/* Banner logo */}
            <div className="text-center space-y-2">
              <span className="text-3xl">🔑</span>
              <h3 className="text-xl font-serif text-[#6D4C41] font-black">Banquet Tasting Credentials</h3>
              <p className="text-xs text-gray-400 font-semibold">Identify or register your Velvet Fork passport credentials below. First logs in auto-registers instantly with $1000 credit.</p>
            </div>

            {/* Quick selectors for easy testing! */}
            <div className="p-4 bg-[#F5EFE6]/60 border border-[#F5EFE6] rounded-2xl space-y-3.5">
              <span className="text-[9px] uppercase font-black text-gray-400 block tracking-wider">Fast-Pass Direct Login options</span>
              
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    setAuthEmail('customer@velvetfork.com');
                    addToast("Fast-Pass customer@velvetfork.com loaded!");
                  }}
                  className="px-3 py-2 bg-white hover:bg-[#B76E3A]/5 border border-[#F5EFE6] text-[10px] font-bold uppercase rounded-lg text-[#6D4C41]"
                >
                  Guest customer
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAuthEmail('admin@velvetfork.com');
                    addToast("Fast-Pass admin@velvetfork.com loaded!");
                  }}
                  className="px-3 py-2 bg-white hover:bg-red-50 border border-[#F5EFE6] text-[10px] font-bold uppercase rounded-lg text-red-800"
                >
                  Site Administrator
                </button>
              </div>
            </div>

            {/* Input fields */}
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] text-gray-400 font-black uppercase tracking-wider block">Ambassador Email</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-400" size={14} />
                  <input 
                    type="email" 
                    required
                    value={authEmail}
                    onChange={(e) => setAuthEmail(e.target.value)}
                    placeholder="ambassador@velvetfork.com"
                    className="w-full pl-9 pr-3 py-3 bg-white border border-[#F5EFE6] rounded-xl text-xs placeholder-gray-400 focus:outline-none focus:border-[#B76E3A]" 
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-[#B76E3A] hover:bg-[#6D4C41] text-white font-bold text-xs uppercase tracking-widest rounded-xl transition-all shadow-md"
              >
                Access Registry Registry
              </button>
            </form>

            <div className="text-center font-mono text-[9px] text-gray-400">
              Secured SSL mock authentication
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
