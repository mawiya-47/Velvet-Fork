/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Utensils, 
  User as UserIcon, 
  ShoppingBag, 
  Bell, 
  Award, 
  Wallet, 
  Menu as MenuIcon, 
  X, 
  FileText,
  Bookmark,
  LogOut,
  ShieldAlert
} from 'lucide-react';
import { User, Notification } from '../types';

interface NavbarProps {
  currentUser: User | null;
  onLoginClick: () => void;
  onLogout: () => void;
  activeView: string;
  onViewChange: (view: string) => void;
  cartCount: number;
  notifications: Notification[];
  onMarkNotificationsRead: () => void;
}

export default function Navbar({
  currentUser,
  onLoginClick,
  onLogout,
  activeView,
  onViewChange,
  cartCount,
  notifications,
  onMarkNotificationsRead
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const unreadNotifications = notifications.filter(n => !n.read);

  const menuItems = [
    { id: 'home', label: 'Home' },
    { id: 'menu', label: 'Menu' },
    { id: 'reservation', label: 'Reservation' },
    { id: 'ordering', label: 'Order Online' },
    { id: 'gallery', label: 'Gallery' },
    { id: 'blog', label: 'Stories' },
    { id: 'faq', label: 'FAQ' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#FFFDF8]/95 backdrop-blur-md border-b border-[#F5EFE6] transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Brand Logo & Icon */}
          <div 
            className="flex items-center gap-2.5 cursor-pointer group"
            onClick={() => { onViewChange('home'); setMobileMenuOpen(false); }}
          >
            <div className="w-11 h-11 bg-[#B76E3A] flex items-center justify-center rounded-xl shadow-md group-hover:bg-[#6D4C41] transition-transform duration-300 group-hover:scale-105">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M17 2v10c0 1.1-.9 2-2 2h-1v7h-2v-7h-1c-1.1 0-2-.9-2-2V2c0-.55.45-1 1-1h1c.55 0 1 .45 1 1v7h1V2c0-.55.45-1 1-1h1c.55 0 1 .45 1 1zM4 2v7c0 3.31 2.69 6 6 6v7h2v-7c3.31 0 6-2.69 6-6V2h-2v7c0 2.21-1.79 4-4 4s-4-1.79-4-4V2H4z" fill="white"/>
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-serif font-black tracking-widest text-[#6D4C41] group-hover:text-[#B76E3A] transition-colors leading-none">
                VELVET FORK
              </span>
              <span className="text-[9px] font-sans font-bold tracking-[0.2em] text-[#B76E3A] uppercase mt-0.5">
                FINE GASTRONOMY
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-7">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onViewChange(item.id)}
                className={`text-xs font-bold uppercase tracking-[0.15em] transition-all duration-300 relative py-2 ${
                  activeView === item.id 
                    ? 'text-[#B76E3A]' 
                    : 'text-[#6D4C41]/80 hover:text-[#B76E3A]'
                }`}
              >
                {item.label}
                {activeView === item.id && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#B76E3A] rounded-full animate-fade-in" />
                )}
              </button>
            ))}
          </nav>

          {/* Action Hub Panel */}
          <div className="hidden lg:flex items-center gap-4">
            
            {/* Wallet Quick Balance Button (Only if Logged In) */}
            {currentUser && (
              <div 
                onClick={() => onViewChange('dashboard')} 
                className="flex items-center gap-2 px-3 py-1.5 bg-[#F5EFE6] border border-[#B76E3A]/20 rounded-full text-[#6D4C41] cursor-pointer hover:bg-[#B76E3A]/10 transition-all duration-200"
                title="Your Velvet Wallet Balance"
              >
                <Wallet size={14} className="text-[#B76E3A]" />
                <span className="text-xs font-bold font-mono">${currentUser.balance.toFixed(2)}</span>
              </div>
            )}

            {/* Shopping Cart Trigger */}
            <button 
              onClick={() => onViewChange('ordering')}
              className="relative p-2.5 text-[#6D4C41] hover:text-[#B76E3A] hover:bg-[#F5EFE6] rounded-full transition-all duration-200"
              title="Shopping Cart"
            >
              <ShoppingBag size={20} />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 bg-[#B76E3A] text-white text-[9px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center shadow-sm animate-bounce">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Notification Drawer Button */}
            <div className="relative">
              <button 
                onClick={() => {
                  setNotifDropdownOpen(!notifDropdownOpen);
                  setUserDropdownOpen(false);
                  if (!notifDropdownOpen && unreadNotifications.length > 0) {
                    onMarkNotificationsRead();
                  }
                }}
                className="relative p-2.5 text-[#6D4C41] hover:text-[#B76E3A] hover:bg-[#F5EFE6] rounded-full transition-all duration-200"
                title="Notifications"
              >
                <Bell size={20} />
                {unreadNotifications.length > 0 && (
                  <span className="absolute top-1 right-1 bg-red-500 text-white text-[8px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center">
                    {unreadNotifications.length}
                  </span>
                )}
              </button>

              {/* Notification Dropdown Container */}
              {notifDropdownOpen && (
                <div className="absolute right-0 mt-3 w-80 bg-[#FFFDF8] border border-[#F5EFE6] rounded-2xl shadow-xl z-50 overflow-hidden py-1 animate-fade-in">
                  <div className="px-4 py-3 border-b border-[#F5EFE6] flex justify-between items-center">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#6D4C41]">Gourmet Alerts</span>
                    <button 
                      onClick={onMarkNotificationsRead}
                      className="text-[10px] text-[#B76E3A] hover:underline font-bold"
                    >
                      Clear All
                    </button>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="px-4 py-6 text-center text-xs text-gray-400 font-medium">
                        No notifications at current.
                      </div>
                    ) : (
                      notifications.slice().reverse().map((notif) => (
                        <div 
                          key={notif.id} 
                          className={`px-4 py-3 border-b border-[#FFFDF8] hover:bg-[#F5EFE6]/50 transition-colors ${!notif.read ? 'bg-[#B76E3A]/5' : ''}`}
                        >
                          <div className="flex gap-2">
                            <span className="text-xs">
                              {notif.type === 'reservation' ? '📅' : notif.type === 'order' ? '🍔' : '✨'}
                            </span>
                            <div className="flex-1">
                              <p className="text-xs font-bold text-[#2F2F2F]">{notif.title}</p>
                              <p className="text-[11px] text-gray-500 mt-0.5 leading-snug">{notif.message}</p>
                              <span className="text-[9px] text-[#B76E3A] font-semibold block mt-1">
                                {new Date(notif.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Loyalty points banner (If logged in) */}
            {currentUser && (
              <div 
                className="flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-[#B76E3A]/10 to-[#6D4C41]/10 border border-[#B76E3A]/20 rounded-md text-xs font-semibold text-[#6D4C41]"
                title="Your Loyalty Ambassador reward points"
              >
                <Award size={14} className="text-[#B76E3A]" />
                <span className="font-bold">{currentUser.points} Gourmet XP</span>
              </div>
            )}

            {/* User Session Controller */}
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => {
                    setUserDropdownOpen(!userDropdownOpen);
                    setNotifDropdownOpen(false);
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-[#6D4C41] text-white rounded-xl text-xs font-bold tracking-wider hover:bg-[#B76E3A] transition-all shadow-sm"
                >
                  <UserIcon size={14} />
                  <span>{currentUser.name}</span>
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-3 w-48 bg-[#FFFDF8] border border-[#F5EFE6] rounded-xl shadow-xl z-50 overflow-hidden py-1 animate-fade-in">
                    <button
                      onClick={() => { onViewChange('dashboard'); setUserDropdownOpen(false); }}
                      className="w-full text-left px-4 py-2.5 text-xs font-semibold text-[#6D4C41] hover:bg-[#F5EFE6] flex items-center gap-2"
                    >
                      <UserIcon size={14} />
                      My Gourmet Profile
                    </button>
                    {currentUser.role === 'admin' && (
                      <button
                        onClick={() => { onViewChange('admin'); setUserDropdownOpen(false); }}
                        className="w-full text-left px-4 py-2.5 text-xs font-semibold text-red-700 hover:bg-red-50 flex items-center gap-2 border-t border-[#F5EFE6]"
                      >
                        <ShieldAlert size={14} />
                        Admin Headquarters
                      </button>
                    )}
                    <button
                      onClick={() => { onLogout(); setUserDropdownOpen(false); }}
                      className="w-full text-left px-4 py-2.5 text-xs font-semibold text-gray-500 hover:bg-[#F5EFE6] flex items-center gap-2 border-t border-[#F5EFE6]"
                    >
                      <LogOut size={14} />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={onLoginClick}
                className="px-5 py-2.5 bg-[#B76E3A] text-white rounded-full text-xs font-bold uppercase tracking-widest hover:bg-[#6D4C41] transition-colors shadow-md"
              >
                Sign In
              </button>
            )}

          </div>

          {/* Mobile Menu Actions Button */}
          <div className="lg:hidden flex items-center gap-3">
            <button 
              onClick={() => onViewChange('ordering')}
              className="relative p-2 text-[#6D4C41]"
            >
              <ShoppingBag size={20} />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 bg-[#B76E3A] text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#6D4C41] hover:bg-[#F5EFE6] rounded-lg"
            >
              {mobileMenuOpen ? <X size={24} /> : <MenuIcon size={24} />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Navigation Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#F5EFE6] bg-[#FFFDF8] py-4 px-4 space-y-3 shadow-inner">
          <div className="grid grid-cols-2 gap-2 pb-4 border-b border-[#F5EFE6]">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onViewChange(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`text-left px-3 py-2 text-xs font-bold uppercase tracking-wider rounded-lg ${
                  activeView === item.id 
                    ? 'bg-[#B76E3A] text-white' 
                    : 'text-[#6D4C41] hover:bg-[#F5EFE6]'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {currentUser && (
            <div className="space-y-2 py-2">
              <div className="flex justify-between items-center px-3 py-1.5 bg-[#F5EFE6] rounded-xl">
                <span className="text-xs text-[#6D4C41] font-semibold flex items-center gap-1">
                  <Wallet size={12} /> Wallet
                </span>
                <span className="text-xs font-bold font-mono">${currentUser.balance.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center px-3 py-1.5 bg-gradient-to-r from-[#B76E3A]/10 to-[#6D4C41]/10 rounded-xl">
                <span className="text-xs text-[#6D4C41] font-semibold flex items-center gap-1">
                  <Award size={12} /> Rewards XP
                </span>
                <span className="text-xs font-bold text-[#6D4C41]">{currentUser.points} XP</span>
              </div>
            </div>
          )}

          <div className="pt-2">
            {currentUser ? (
              <div className="space-y-2">
                <button
                  onClick={() => {
                    onViewChange('dashboard');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2.5 bg-[#6D4C41] text-white rounded-xl text-xs font-bold tracking-wider text-center block"
                >
                  My Profile Dashboard
                </button>
                {currentUser.role === 'admin' && (
                  <button
                    onClick={() => {
                      onViewChange('admin');
                      setMobileMenuOpen(false);
                    }}
                    className="w-full py-2.5 bg-red-700 text-white rounded-xl text-xs font-bold tracking-wider text-center block"
                  >
                    Admin Area
                  </button>
                )}
                <button
                  onClick={() => {
                    onLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2.5 bg-gray-200 text-[#2F2F2F] rounded-xl text-xs font-bold tracking-wider text-center block"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  onLoginClick();
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2.5 bg-[#B76E3A] text-white rounded-xl text-xs font-bold uppercase tracking-widest text-center block"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
