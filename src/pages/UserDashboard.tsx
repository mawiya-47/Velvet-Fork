/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  User as UserIcon, 
  MapPin, 
  Phone, 
  Award, 
  Heart, 
  Wallet, 
  History, 
  Bell, 
  CheckCircle2,
  Bookmark,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { User, MenuItem, Order, Reservation, Notification } from '../types';

interface UserDashboardProps {
  currentUser: User | null;
  onUpdateProfile: (profileData: { name: string; savedAddress: string; phone: string }) => void;
  wishlistItems: MenuItem[];
  onToggleWishlist: (itemId: string) => void;
  orders: Order[];
  reservations: Reservation[];
  notifications: Notification[];
  onDepositWallet: (amount: number) => void;
  onViewChange: (view: string) => void;
  onAddToast: (msg: string) => void;
}

export default function UserDashboard({
  currentUser,
  onUpdateProfile,
  wishlistItems,
  onToggleWishlist,
  orders,
  reservations,
  notifications,
  onDepositWallet,
  onViewChange,
  onAddToast
}: UserDashboardProps) {
  const [name, setName] = useState(currentUser?.name || '');
  const [address, setAddress] = useState(currentUser?.savedAddress || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [depositAmount, setDepositAmount] = useState('50');
  
  const [isEditing, setIsEditing] = useState(false);
  const [isDepositing, setIsDepositing] = useState(false);

  if (!currentUser) {
    return (
      <div className="bg-[#FFFDF8] min-h-screen py-16 text-center flex flex-col justify-center items-center">
        <span className="text-4xl">🔒</span>
        <h2 className="text-xl font-serif text-[#6D4C41] mt-4 font-bold">Unauthorized Ambassador access</h2>
        <p className="text-xs text-gray-500 max-w-sm mt-2 leading-relaxed">
          Please log in using your Velvet Fork account to view personal culinary ledgers, wallet balances, and wishlists.
        </p>
      </div>
    );
  }

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({ name, savedAddress: address, phone });
    setIsEditing(false);
    onAddToast("Ambassador Profile modified successfully.");
  };

  const handleDeposit = () => {
    const amt = Number(depositAmount);
    if (isNaN(amt) || amt <= 0) {
      onAddToast("Please specify a genuine billing deposit load.");
      return;
    }
    onDepositWallet(amt);
    setIsDepositing(false);
    onAddToast(`$${amt.toFixed(2)} loaded to Velvet Wallet!`);
  };

  return (
    <div className="bg-[#FFFDF8] min-h-screen py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Profile Card Header Banner */}
        <div className="bg-[#F5EFE6] border border-[#B76E3A]/20 rounded-[38px] p-8 sm:p-10 mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative overflow-hidden">
          {/* Subtle decoration */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-[#B76E3A]/5 rounded-full blur-2xl" />

          <div className="flex items-center gap-5 relative z-10">
            <div className="w-16 h-16 bg-[#B76E3A] text-white flex items-center justify-center text-3xl font-serif font-bold rounded-2xl shadow-md">
              {currentUser.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#B76E3A]">Gold Ambassador</span>
              <h1 className="text-2xl sm:text-3xl font-serif font-black text-[#2F2F2F] mt-0.5">{currentUser.name}</h1>
              <span className="text-xs text-gray-400 font-mono font-bold block mt-1">{currentUser.email}</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 relative z-10 w-full md:w-auto">
            {/* Wallet Quick Load */}
            <div className="flex-1 min-w-[140px] bg-white border border-[#F5EFE6] p-4 rounded-2xl shadow-sm">
              <span className="text-[9px] font-bold text-gray-400 uppercase block">Velvet Wallet</span>
              <span className="text-lg font-mono font-bold text-[#6D4C41] block mt-1">${currentUser.balance.toFixed(2)}</span>
              <button 
                onClick={() => setIsDepositing(!isDepositing)}
                className="text-[10px] text-[#B76E3A] font-bold uppercase hover:underline mt-1.5"
              >
                + Top Up Wallet
              </button>
            </div>

            {/* Loyalty points tracker */}
            <div className="flex-1 min-w-[140px] bg-[#6D4C41] p-4 rounded-2xl text-[#FFFDF8] shadow-sm">
              <span className="text-[9px] font-bold text-[#FFFDF8]/60 uppercase block">Ambassador XP</span>
              <span className="text-lg font-mono font-bold block mt-1">{currentUser.points} XP</span>
              <p className="text-[9px] text-[#FFFDF8]/80 mt-1">Unlock free desserts at 500 XP</p>
            </div>
          </div>

        </div>

        {/* Top Up Wallet Light modal */}
        {isDepositing && (
          <div className="bg-white border border-[#B76E3A]/30 p-6 rounded-3xl shadow-lg mb-8 max-w-md mx-auto animate-fade-in space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#6D4C41] flex items-center gap-1.5"><Wallet size={15} /> Load Wallet Tokens</h4>
            <div className="flex gap-2">
              <span className="self-center font-mono text-sm text-[#6D4C41]">$</span>
              <input 
                type="number" 
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                className="flex-1 bg-[#FFFDF8] border border-[#F5EFE6] px-3 py-2 rounded-xl text-xs font-bold focus:outline-none focus:border-[#B76E3A]" 
              />
              <button 
                onClick={handleDeposit}
                className="px-4 py-2 bg-[#B76E3A] hover:bg-[#6D4C41] text-white text-xs font-bold uppercase rounded-xl transition-colors"
              >
                Load
              </button>
            </div>
            <p className="text-[10px] text-gray-400 italic">Simulated secure billing via credit test lines.</p>
          </div>
        )}

        <div className="grid lg:grid-cols-12 gap-8 items-start">
          
          {/* Main content tabs/pages */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Wishlist Favorites Card */}
            <div className="bg-white border border-[#F5EFE6] rounded-[38px] p-6 sm:p-8 shadow-sm">
              <h3 className="text-sm font-bold uppercase tracking-widest text-[#6D4C41] mb-6 flex items-center gap-1.5 border-b border-[#F5EFE6] pb-3">
                <Heart size={16} className="text-[#B76E3A]" /> Saved Gastronomy Wishlist
              </h3>

              {wishlistItems.length === 0 ? (
                <div className="text-center py-8 space-y-3">
                  <span className="text-2xl">🍽️</span>
                  <p className="text-xs text-gray-400 italic">No recipes are current favorited. Navigate back to explore our cuisine catalog.</p>
                  <button 
                    onClick={() => onViewChange('menu')}
                    className="text-xs text-[#B76E3A] font-bold uppercase hover:underline"
                  >
                    Tasting Catalog
                  </button>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 gap-4">
                  {wishlistItems.map((item) => (
                    <div key={item.id} className="p-4 bg-[#FFFDF8] border border-[#F5EFE6] rounded-2xl flex gap-3 justify-between items-center group shadow-none hover:shadow-xs transition-shadow">
                      <div className="flex items-center gap-3">
                        <img src={item.images[0]} alt={item.name} className="w-12 h-12 rounded-lg object-cover bg-gray-100 shrink-0" referrerPolicy="no-referrer" />
                        <div>
                          <h4 className="text-xs font-bold text-[#2F2F2F] line-clamp-1">{item.name}</h4>
                          <span className="text-[10px] font-mono text-[#6D4C41] font-bold">${item.price.toFixed(2)}</span>
                        </div>
                      </div>

                      <button 
                        onClick={() => onToggleWishlist(item.id)}
                        className="text-[9px] text-[#B76E3A] hover:underline font-bold"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Profile editor panel */}
            <div className="bg-white border border-[#F5EFE6] rounded-[38px] p-6 sm:p-8 shadow-sm space-y-5">
              <div className="flex justify-between items-center border-b border-[#F5EFE6] pb-3">
                <h3 className="text-sm font-bold uppercase tracking-widest text-[#6D4C41] flex items-center gap-1.5">
                  <UserIcon size={16} /> Ambassador Coordinates
                </h3>
                <button
                  type="button"
                  onClick={() => setIsEditing(!isEditing)}
                  className="text-xs text-[#B76E3A] font-bold uppercase hover:underline"
                >
                  {isEditing ? 'Cancel Edit' : 'Edit Coordinates'}
                </button>
              </div>

              {isEditing ? (
                <form onSubmit={handleUpdate} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] text-gray-400 font-bold uppercase block">Ambassador Full Name</label>
                      <input 
                        type="text" 
                        required
                        value={name} 
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-3 py-2.5 bg-[#FFFDF8] border border-[#F5EFE6] rounded-xl text-xs placeholder-gray-400"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-gray-400 font-bold uppercase block">Direct Phone Line</label>
                      <input 
                        type="tel" 
                        required
                        value={phone} 
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full px-3 py-2.5 bg-[#FFFDF8] border border-[#F5EFE6] rounded-xl text-xs placeholder-gray-400"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-gray-400 font-bold uppercase block">Default Shipping Coordinates</label>
                    <input 
                      type="text" 
                      required
                      value={address} 
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full px-3 py-2.5 bg-[#FFFDF8] border border-[#F5EFE6] rounded-xl text-xs placeholder-gray-400"
                    />
                  </div>
                  <button 
                    type="submit"
                    className="px-6 py-2 bg-[#6D4C41] hover:bg-[#B76E3A] text-white text-xs font-bold uppercase rounded-lg transition-colors"
                  >
                    Save Plating Settings
                  </button>
                </form>
              ) : (
                <div className="grid sm:grid-cols-2 gap-6 text-xs text-gray-600 font-medium">
                  <div className="space-y-2">
                    <div>
                      <span className="text-[9px] text-gray-400 font-bold block uppercase">Official Label</span>
                      <p className="text-xs text-[#2F2F2F] font-bold mt-1">{currentUser.name}</p>
                    </div>
                    <div>
                      <span className="text-[9px] text-gray-400 font-bold block uppercase">Phone Line</span>
                      <p className="text-xs text-[#2F2F2F] font-bold mt-1">{currentUser.phone || 'No phone line linked.'}</p>
                    </div>
                  </div>
                  <div>
                    <span className="text-[9px] text-gray-400 font-bold block uppercase">Dining Coordinates</span>
                    <p className="text-xs text-[#2F2F2F] font-bold mt-1 leading-relaxed">{currentUser.savedAddress || 'No default shipping address specified yet.'}</p>
                  </div>
                </div>
              )}
            </div>

          </div>

          {/* Right panel: Alerts & notifications broadcast logs */}
          <div className="lg:col-span-4 space-y-6">
            
            <div className="bg-white border border-[#F5EFE6] rounded-[38px] p-6 sm:p-7 shadow-sm">
              <h3 className="text-xs font-bold uppercase tracking-widest text-[#6D4C41] mb-4 border-b border-[#F5EFE6] pb-3 flex items-center gap-1">
                <Bell size={15} /> Diplomatic Bulletins
              </h3>

              {notifications.length === 0 ? (
                <p className="text-xs text-gray-400 italic text-center py-6">No notifications on this ledger.</p>
              ) : (
                <div className="space-y-3.5 max-h-[400px] overflow-y-auto">
                  {notifications.slice().reverse().map((notif) => (
                    <div 
                      key={notif.id} 
                      className={`p-3 bg-[#FFFDF8] border border-[#F5EFE6] rounded-xl text-xs relative ${!notif.read ? 'bg-[#B76E3A]/5 border-[#B76E3A]/20' : ''}`}
                    >
                      <div className="flex gap-2">
                        <span className="text-xs">{notif.type === 'reservation' ? '📅' : '🍔'}</span>
                        <div>
                          <p className="font-bold text-[#6D4C41]">{notif.title}</p>
                          <p className="text-[11px] text-gray-500 mt-0.5 leading-snug">{notif.message}</p>
                          <span className="text-[8px] text-amber-900 block mt-1 font-mono font-bold">
                            {new Date(notif.date).toLocaleDateString()} at {new Date(notif.date).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}
                          </span>
                        </div>
                      </div>
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
