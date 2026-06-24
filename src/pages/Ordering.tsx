/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, 
  Trash2, 
  Tag, 
  Plus, 
  Minus, 
  CreditCard, 
  Wallet, 
  MapPin, 
  Phone, 
  Clock, 
  CheckCircle2, 
  ChevronRight,
  TrendingUp,
  FileSpreadsheet
} from 'lucide-react';
import { Order, OrderItem, MenuItem, User } from '../types';

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
}

interface OrderingProps {
  currentUser: User | null;
  cart: CartItem[];
  orders: Order[];
  onUpdateCartQty: (itemId: string, increment: boolean) => void;
  onRemoveFromCart: (itemId: string) => void;
  onPlaceOrder: (orderData: {
    address: string;
    phone: string;
    couponCode: string;
    discountAmount: number;
    paymentMode: 'wallet' | 'card';
  }) => Promise<any>;
  onLoginClick: () => void;
  onAddToast: (msg: string) => void;
}

export default function Ordering({
  currentUser,
  cart,
  orders,
  onUpdateCartQty,
  onRemoveFromCart,
  onPlaceOrder,
  onLoginClick,
  onAddToast
}: OrderingProps) {
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [paymentMode, setPaymentMode] = useState<'wallet' | 'card'>('wallet');
  
  const [loading, setLoading] = useState(false);
  const [selectedHistoricalOrder, setSelectedHistoricalOrder] = useState<Order | null>(null);

  // Auto-initialize details if user logged in
  useEffect(() => {
    if (currentUser) {
      setAddress(currentUser.savedAddress || '');
      setPhone(currentUser.phone || '');
    }
  }, [currentUser]);

  // Invoice calculations
  const subtotal = cart.reduce((acc, item) => acc + (item.menuItem.price * item.quantity), 0);
  const discountAmount = subtotal * (discountPercent / 100);
  const deliveryFee = subtotal > 60 || subtotal === 0 ? 0 : 5.00;
  const taxAmount = (subtotal - discountAmount) * 0.09;
  const grandTotal = subtotal - discountAmount + deliveryFee + taxAmount;

  const handleApplyPromo = () => {
    const code = promoCode.trim().toUpperCase();
    if (code === 'VELVETVELVET') {
      setDiscountPercent(15);
      setAppliedPromo(code);
      onAddToast("Promo standard applied: 15% VIP discount enabled!");
    } else if (code === 'MAWIYAGOURMET') {
      setDiscountPercent(100);
      setAppliedPromo(code);
      onAddToast("Test coupon accepted: 100% discount unlocked!");
    } else {
      onAddToast("Invalid vintage promo code.");
    }
    setPromoCode('');
  };

  const handleCreateCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      onLoginClick();
      return;
    }
    if (cart.length === 0) {
      onAddToast("The banquet bag is empty.");
      return;
    }
    if (!address.trim() || !phone.trim()) {
      onAddToast("Delivery coordinates and phone lines are required.");
      return;
    }

    setLoading(true);
    try {
      const response = await onPlaceOrder({
        address,
        phone,
        couponCode: appliedPromo,
        discountAmount,
        paymentMode
      });

      if (response && response.error) {
        onAddToast(response.error);
      } else {
        onAddToast("Banquet order transacted! Preparing kitchen stoves.");
        setAppliedPromo('');
        setDiscountPercent(0);
      }
    } catch (err: any) {
      onAddToast(err.message || "Checkout failed. Please verify credits.");
    } finally {
      setLoading(false);
    }
  };

  // Get current active orders
  const activeOrders = orders.filter(o => o.status !== 'Delivered' && o.status !== 'Cancelled');
  const pastOrders = orders.filter(o => o.status === 'Delivered' || o.status === 'Cancelled');

  const getProgressPercent = (status: string) => {
    switch(status) {
      case 'Received': return 15;
      case 'Preparing': return 50;
      case 'In Transit': return 80;
      case 'Delivered': return 100;
      default: return 0;
    }
  };

  return (
    <div className="bg-[#FFFDF8] min-h-screen py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page title banner */}
        <div className="text-center max-w-xl mx-auto mb-12">
          <span className="text-xs uppercase font-bold tracking-[0.25em] text-[#B76E3A]">Home Degustation Delivery</span>
          <h1 className="text-3xl sm:text-5xl font-serif text-[#2F2F2F] mt-1">Sovereign Checkout Desk</h1>
          <p className="text-xs text-gray-500 mt-2">
            Formulate your banquet bag. Orders exceeding sixty dollars obtain free transit premium services. Keep track of dynamic stove progress bars instantly on this dashboard.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-12 items-start">
          
          {/* Main Cart & checkout panel */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Banquet block items */}
            <div className="bg-white border border-[#F5EFE6] rounded-[36px] p-6 sm:p-8 shadow-sm">
              <h2 className="text-lg font-serif font-bold text-[#6D4C41] mb-6 flex items-center gap-1.5 border-b border-[#F5EFE6] pb-3">
                <ShoppingBag size={18} /> Plated Dishes in Bag
              </h2>

              {cart.length === 0 ? (
                <div className="text-center py-10 space-y-4">
                  <span className="text-3xl">🧺</span>
                  <p className="text-xs text-gray-400 italic">No delicacies are currently loaded. Navigate back to the menu tasting.</p>
                </div>
              ) : (
                <div className="divide-y divide-[#F5EFE6]">
                  {cart.map((item) => (
                    <div key={item.menuItem.id} className="py-4 flex justify-between items-center gap-4">
                      <div className="flex items-center gap-4">
                        <img 
                          src={item.menuItem.images[0]} 
                          alt={item.menuItem.name} 
                          className="w-16 h-16 rounded-xl object-cover shrink-0 bg-gray-50 border border-[#F5EFE6]"
                          referrerPolicy="no-referrer"
                        />
                        <div>
                          <span className="text-[10px] font-bold text-[#B76E3A] uppercase tracking-wider">{item.menuItem.category}</span>
                          <h4 className="text-sm font-bold text-[#2F2F2F] line-clamp-1">{item.menuItem.name}</h4>
                          <span className="text-xs font-mono font-bold text-gray-500">${item.menuItem.price.toFixed(2)} each</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="flex items-center border border-[#F5EFE6] rounded-lg overflow-hidden bg-[#FFFDF8]">
                          <button 
                            onClick={() => onUpdateCartQty(item.menuItem.id, false)}
                            className="p-1.5 hover:bg-[#F5EFE6] text-[#6D4C41]"
                          >
                            <Minus size={10} />
                          </button>
                          <span className="px-3 text-xs font-bold font-mono text-[#6D4C41]">{item.quantity}</span>
                          <button 
                            onClick={() => onUpdateCartQty(item.menuItem.id, true)}
                            className="p-1.5 hover:bg-[#F5EFE6] text-[#6D4C41]"
                          >
                            <Plus size={10} />
                          </button>
                        </div>

                        <span className="text-sm font-mono font-bold text-[#6D4C41] w-16 text-right">
                          ${(item.menuItem.price * item.quantity).toFixed(2)}
                        </span>

                        <button 
                          onClick={() => onRemoveFromCart(item.menuItem.id)}
                          className="p-1.5 text-gray-300 hover:text-red-600 transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Delivery address & security panel */}
            {cart.length > 0 && (
              <form onSubmit={handleCreateCheckout} className="bg-white border border-[#F5EFE6] rounded-[36px] p-6 sm:p-8 shadow-sm space-y-6">
                <h3 className="text-base font-serif font-bold text-[#6D4C41]">Shipping Coordinates & Liquidity</h3>
                
                {currentUser ? (
                  <div className="space-y-6">
                    <div className="grid sm:grid-cols-2 gap-4">
                      
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Home Delivery Address</label>
                        <div className="relative">
                          <MapPin className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-400" size={14} />
                          <input 
                            type="text" 
                            required
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            placeholder="Apartment suite number, street range, city..."
                            className="w-full pl-9 pr-3 py-3 bg-[#FFFDF8] border border-[#F5EFE6] rounded-xl text-xs placeholder-gray-400 focus:outline-none focus:border-[#B76E3A]" 
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Line Phone Number</label>
                        <div className="relative">
                          <Phone className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-400" size={14} />
                          <input 
                            type="tel" 
                            required
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="+1 (555) 0192-384"
                            className="w-full pl-9 pr-3 py-3 bg-[#FFFDF8] border border-[#F5EFE6] rounded-xl text-xs placeholder-gray-400 focus:outline-none focus:border-[#B76E3A]" 
                          />
                        </div>
                      </div>

                    </div>

                    {/* Promo insertion box */}
                    <div className="p-4 bg-[#F5EFE6]/40 border border-[#F5EFE6] rounded-2xl flex gap-2 items-center">
                      <Tag size={16} className="text-[#B76E3A]" />
                      <input 
                        type="text"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        placeholder="Promotional code (e.g. VELVETVELVET)"
                        className="flex-1 bg-white border border-[#F5EFE6] px-3 py-2.5 rounded-xl text-xs placeholder-gray-400 focus:outline-none"
                      />
                      <button 
                        type="button" 
                        onClick={handleApplyPromo}
                        className="px-4 py-2.5 bg-[#6D4C41] hover:bg-[#B76E3A] text-white text-[10px] font-bold uppercase tracking-wider rounded-xl transition-all"
                      >
                        Apply
                      </button>
                    </div>

                    {/* Liquidity setup */}
                    <div className="space-y-2.5">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Transaction Route</span>
                      <div className="grid grid-cols-2 gap-3">
                        <div 
                          onClick={() => setPaymentMode('wallet')}
                          className={`p-4 border rounded-xl cursor-pointer flex items-center justify-between transition-all ${paymentMode === 'wallet' ? 'border-[#B76E3A] bg-[#FFFDF8]/50' : 'border-transparent text-gray-400 opacity-60'}`}
                        >
                          <span className="text-xs font-bold flex items-center gap-1.5"><Wallet size={14} /> Gourmet Wallet balance</span>
                          <span className="text-xs font-mono font-bold text-[#6D4C41]">${currentUser.balance.toFixed(2)}</span>
                        </div>
                        <div 
                          onClick={() => setPaymentMode('card')}
                          className={`p-4 border rounded-xl cursor-pointer flex items-center justify-between transition-all ${paymentMode === 'card' ? 'border-[#B76E3A] bg-[#FFFDF8]/50' : 'border-transparent text-gray-400 opacity-60'}`}
                        >
                          <span className="text-xs font-bold flex items-center gap-1.5"><CreditCard size={14} /> Mastercard/Visa</span>
                          <span className="text-[10px] text-emerald-600 font-bold uppercase">Mock Stripe active</span>
                        </div>
                      </div>
                    </div>

                    <button 
                      type="submit" 
                      disabled={loading}
                      className="w-full py-4 bg-[#B76E3A] hover:bg-[#6D4C41] text-white text-xs font-bold uppercase tracking-widest rounded-xl transition-all shadow-md flex justify-center gap-2"
                    >
                      {loading ? 'Validating credits...' : `Authorize delivery ticket for $${grandTotal.toFixed(2)}`}
                    </button>
                  </div>
                ) : (
                  <div className="p-6 text-center bg-[#F5EFE6]/40 rounded-2xl border border-[#F5EFE6] space-y-4">
                    <span className="text-2xl">🔑</span>
                    <h3 className="text-sm font-serif font-bold text-[#6D4C41]">Gourmet Passport required</h3>
                    <p className="text-[11px] text-gray-500 max-w-xs mx-auto">Please identify your account to initiate delivery routes and apply master VIP coupon codes.</p>
                    <button 
                      type="button" 
                      onClick={onLoginClick}
                      className="px-5 py-2 bg-[#B76E3A] text-white text-xs font-bold uppercase rounded"
                    >
                      Sign In
                    </button>
                  </div>
                )}
              </form>
            )}

            {/* Active order stove progress tracker with details */}
            {activeOrders.length > 0 && (
              <div className="bg-white border border-[#F5EFE6] rounded-[36px] p-6 sm:p-8 shadow-sm space-y-6">
                <div>
                  <span className="text-[9px] font-sans font-bold tracking-[0.2em] text-[#B76E3A] uppercase">Real-Time Kitchen Feed</span>
                  <h3 className="text-base font-serif font-bold text-[#6D4C41]">Cooking Stoves Tracker</h3>
                </div>

                {activeOrders.map((ord) => {
                  const percent = getProgressPercent(ord.status);
                  return (
                    <div key={ord.id} className="p-5 bg-[#FFFDF8] border border-[#F5EFE6] rounded-3xl space-y-4">
                      
                      {/* Meta header */}
                      <div className="flex justify-between items-center text-xs font-bold">
                        <div>
                          <span className="text-[#6D4C41] block">Order #{ord.id.substring(ord.id.length - 8).toUpperCase()}</span>
                          <span className="text-[9px] text-gray-400 font-semibold uppercase">{new Date(ord.date).toLocaleTimeString()} &bull; Delivery to Suite</span>
                        </div>
                        <span className="text-xs uppercase font-mono font-bold text-[#B76E3A]">{ord.status}</span>
                      </div>

                      {/* Bar indicator */}
                      <div className="space-y-1.5">
                        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div 
                            className="bg-[#B76E3A] h-full rounded-full transition-all duration-1000"
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                        <div className="flex justify-between text-[9px] font-bold text-gray-400 uppercase tracking-wider">
                          <span className={ord.status === 'Received' ? 'text-[#B76E3A]' : ''}>Received</span>
                          <span className={ord.status === 'Preparing' ? 'text-[#B76E3A]' : ''}>Stoves Hot</span>
                          <span className={ord.status === 'In Transit' ? 'text-[#B76E3A]' : ''}>In Transit</span>
                          <span className={ord.status === 'Delivered' ? 'text-[#B76E3A]' : ''}>Arrived</span>
                        </div>
                      </div>

                      {/* Items loop summary */}
                      <div className="pt-3 border-t border-[#F5EFE6]">
                        <span className="text-[10px] uppercase font-black text-gray-400 block mb-2">Banquet Items</span>
                        <div className="grid grid-cols-2 gap-2 text-[11px] font-semibold text-[#6D4C41]">
                          {ord.items.map((it, idx) => (
                            <span key={idx}>&bull; {it.quantity}x {it.name}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

          </div>

          {/* Right sidebar: Receipt calculation details */}
          <div className="lg:col-span-4 space-y-6">
            
            {cart.length > 0 && (
              <div className="bg-white border border-[#F5EFE6] rounded-[36px] p-6 sm:p-7 shadow-sm space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-widest text-[#6D4C41] border-b border-[#F5EFE6] pb-3">Ticket Invoicing</h3>
                
                <div className="space-y-2.5 text-xs font-medium text-gray-600">
                  <div className="flex justify-between">
                    <span>Menu Subtotal</span>
                    <span className="font-mono">${subtotal.toFixed(2)}</span>
                  </div>

                  {discountPercent > 0 && (
                    <div className="flex justify-between text-rose-700">
                      <span>Promo Applied ({discountPercent}%)</span>
                      <span className="font-mono">-${discountAmount.toFixed(2)}</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span>Fine Transit Delivery</span>
                    <span className="font-mono">{deliveryFee === 0 ? 'FREE' : `$${deliveryFee.toFixed(2)}`}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Gourmet VAT tax (9%)</span>
                    <span className="font-mono">${taxAmount.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between text-base font-serif font-bold text-[#6D4C41] pt-3 border-t border-[#F5EFE6]">
                    <span>Invoiced Total</span>
                    <span className="font-mono text-lg text-[#B76E3A]">${grandTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Past orders list */}
            <div className="bg-white border border-[#F5EFE6] rounded-[36px] p-6 sm:p-7 shadow-sm">
              <h3 className="text-xs font-bold uppercase tracking-widest text-[#6D4C41] mb-4 flex items-center gap-1 border-b border-[#F5EFE6] pb-3">
                <FileSpreadsheet size={15} /> Historical Invoices
              </h3>

              {!currentUser ? (
                <p className="text-[11px] text-gray-400 italic text-center py-4">Sign in to check invoice logs.</p>
              ) : pastOrders.length === 0 ? (
                <p className="text-[11px] text-gray-400 italic text-center py-4">No previous order receipts found.</p>
              ) : (
                <div className="space-y-3 max-h-[300px] overflow-y-auto">
                  {pastOrders.slice().reverse().map((ord) => (
                    <div 
                      key={ord.id} 
                      onClick={() => setSelectedHistoricalOrder(selectedHistoricalOrder?.id === ord.id ? null : ord)}
                      className="p-3 bg-[#FFFDF8] border border-[#F5EFE6] rounded-xl hover:border-[#B76E3A] transition-all cursor-pointer space-y-1.5"
                    >
                      <div className="flex justify-between text-[11px] font-bold text-[#6D4C41]">
                        <span>Invoice #{ord.id.substring(ord.id.length - 8).toUpperCase()}</span>
                        <span className="text-rose-900 font-mono">${ord.total.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-[9px] text-gray-400 font-bold uppercase">
                        <span>{new Date(ord.date).toLocaleDateString()}</span>
                        <span className={ord.status === 'Cancelled' ? 'text-red-700' : 'text-emerald-700'}>{ord.status}</span>
                      </div>

                      {/* Item expand collapse details */}
                      {selectedHistoricalOrder?.id === ord.id && (
                        <div className="pt-2 mt-2 border-t border-[#F5EFE6] text-[10px] text-gray-600 space-y-1 bg-[#F5EFE6]/30 p-2 rounded-lg">
                          {ord.items.map((it, idx) => (
                            <div key={idx} className="flex justify-between">
                              <span>{it.quantity}x {it.name}</span>
                              <span className="font-mono">${(it.price * it.quantity).toFixed(2)}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
