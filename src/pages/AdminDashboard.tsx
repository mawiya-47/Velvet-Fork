/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  ShieldCheck, 
  TrendingUp, 
  ChefHat, 
  Calendar, 
  Bell, 
  Trash2, 
  Cpu, 
  TrendingDown, 
  CheckCircle2, 
  Loader2, 
  Plus, 
  Sparkles, 
  Edit3
} from 'lucide-react';
import { MenuItem, Order, Reservation, User } from '../types';

interface AdminDashboardProps {
  currentUser: User | null;
  menuItems: MenuItem[];
  orders: Order[];
  reservations: Reservation[];
  onUpdateOrderStatus: (orderId: string, status: string) => void;
  onUpdateReservationStatus: (resId: string, status: string) => void;
  onAddMenuItem: (itemData: Omit<MenuItem, 'id' | 'rating' | 'reviewsCount'>) => void;
  onDeleteMenuItem: (itemId: string) => void;
  onBroadcastNotification: (title: string, message: string, type: 'info' | 'order' | 'reservation') => void;
  onAddToast: (msg: string) => void;
}

export default function AdminDashboard({
  currentUser,
  menuItems,
  orders,
  reservations,
  onUpdateOrderStatus,
  onUpdateReservationStatus,
  onAddMenuItem,
  onDeleteMenuItem,
  onBroadcastNotification,
  onAddToast
}: AdminDashboardProps) {
  
  // Tabs: 'analytics' | 'orders' | 'reservations' | 'menu' | 'broadcast'
  const [activeTab, setActiveTab] = useState<'analytics' | 'orders' | 'reservations' | 'menu' | 'broadcast'>('analytics');

  // Broadcast state logs
  const [broadcastTitle, setBroadcastTitle] = useState('');
  const [broadcastMsg, setBroadcastMsg] = useState('');
  const [broadcastType, setBroadcastType] = useState<'info' | 'order' | 'reservation'>('info');

  // New Menu Item inventory creation states
  const [newItemName, setNewItemName] = useState('');
  const [newItemPrice, setNewItemPrice] = useState('');
  const [newItemCategory, setNewItemCategory] = useState('Starters');
  const [newItemPrep, setNewItemPrep] = useState('15 mins');
  const [newItemDesc, setNewItemDesc] = useState('');
  const [newItemImage, setNewItemImage] = useState('');
  const [newItemIngredients, setNewItemIngredients] = useState('');
  const [newItemTag, setNewItemTag] = useState('Chef Choice');

  if (!currentUser || currentUser.role !== 'admin') {
    return (
      <div className="bg-[#FFFDF8] min-h-screen py-24 text-center">
        <span className="text-4xl text-red-700">⚠️</span>
        <h2 className="text-xl font-serif text-red-800 font-bold mt-4">Sovereign Authority clearance required</h2>
        <p className="text-xs text-gray-500 max-w-sm mt-2 mx-auto leading-relaxed">
          Access to this headquarters is restricted only to verified Velvet Fork Administrators. Contact the system registrar with your security credentials.
        </p>
      </div>
    );
  }

  // 1. Calculations for high-fidelity Analytics
  const completedOrders = orders.filter(o => o.status === 'Delivered');
  const grossRevenue = orders.reduce((acc, o) => o.status !== 'Cancelled' ? acc + o.total : acc, 0);
  const averageOrderValue = orders.length > 0 ? grossRevenue / orders.length : 0;
  
  // Group metrics
  const pendingReservations = reservations.filter(r => r.status === 'Pending').length;
  const activeDeliveryLanes = orders.filter(o => o.status !== 'Delivered' && o.status !== 'Cancelled').length;

  const handleBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastTitle.trim() || !broadcastMsg.trim()) return;

    onBroadcastNotification(broadcastTitle, broadcastMsg, broadcastType);
    setBroadcastTitle('');
    setBroadcastMsg('');
    onAddToast("Diplomatic Announcement broadcasted to all VIP users!");
  };

  const handleCreateMenuItem = (e: React.FormEvent) => {
    e.preventDefault();
    const priceNum = Number(newItemPrice);
    if (!newItemName.trim() || isNaN(priceNum) || priceNum <= 0) {
      onAddToast("Invalid item labels or cost structures.");
      return;
    }

    const defaultImage = newItemImage.trim() || "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=800";
    const ingredientsArr = newItemIngredients.split(',').map(s => s.trim()).filter(Boolean);

    onAddMenuItem({
      name: newItemName,
      price: priceNum,
      category: newItemCategory,
      prepTime: newItemPrep,
      description: newItemDesc,
      images: [defaultImage],
      ingredients: ingredientsArr.length > 0 ? ingredientsArr : ['Fresh Plated Herb', 'Chef Olive Extract'],
      tags: [newItemTag],
      nutritionalInfo: {
        calories: 280,
        protein: "14g",
        carbs: "32g",
        fat: "10g"
      }
    });

    onAddToast(`${newItemName} enrolled into inventory ledger!`);

    // Reset inventory fields
    setNewItemName('');
    setNewItemPrice('');
    setNewItemDesc('');
    setNewItemImage('');
    setNewItemIngredients('');
  };

  return (
    <div className="bg-[#FFFDF8] min-h-screen py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Title */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10 border-b border-[#F5EFE6] pb-6">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-red-800 flex items-center gap-1">
              <ShieldCheck size={12} /> SECURE HEADQUARTERS
            </span>
            <h1 className="text-3xl sm:text-5xl font-serif text-[#2F2F2F] mt-1">Velvet Control Desk</h1>
          </div>
          
          <div className="flex gap-2 bg-white p-1 border border-[#F5EFE6] rounded-xl overflow-x-auto scrollbar-none w-full sm:w-auto">
            <button 
              onClick={() => setActiveTab('analytics')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${activeTab === 'analytics' ? 'bg-[#6D4C41] text-white' : 'text-[#6D4C41] hover:bg-[#F5EFE6]'}`}
            >
              Overview
            </button>
            <button 
              onClick={() => setActiveTab('orders')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${activeTab === 'orders' ? 'bg-[#6D4C41] text-white' : 'text-[#6D4C41] hover:bg-[#F5EFE6]'}`}
            >
              Stoves & Deliveries ({activeDeliveryLanes})
            </button>
            <button 
              onClick={() => setActiveTab('reservations')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${activeTab === 'reservations' ? 'bg-[#6D4C41] text-white' : 'text-[#6D4C41] hover:bg-[#F5EFE6]'}`}
            >
              Tables Registry ({pendingReservations})
            </button>
            <button 
              onClick={() => setActiveTab('menu')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${activeTab === 'menu' ? 'bg-[#6D4C41] text-white' : 'text-[#6D4C41] hover:bg-[#F5EFE6]'}`}
            >
              Recipe Inventory
            </button>
            <button 
              onClick={() => setActiveTab('broadcast')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${activeTab === 'broadcast' ? 'bg-[#6D4C41] text-white' : 'text-[#6D4C41] hover:bg-[#F5EFE6]'}`}
            >
              Notice Wire
            </button>
          </div>
        </div>

        {/* TAB 1: EXECUTIVE ANALYTICS */}
        {activeTab === 'analytics' && (
          <div className="space-y-10 animate-fade-in text-xs font-medium">
            
            {/* Bento Grid Analytics */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              
              <div className="bg-white p-7 rounded-3xl border border-[#F5EFE6] shadow-sm flex flex-col justify-between">
                <span className="text-xs font-bold uppercase text-gray-400 block tracking-wider">Gross Banquet Revenue</span>
                <div className="mt-4">
                  <span className="text-3xl font-mono font-bold text-[#6D4C41]">${grossRevenue.toFixed(2)}</span>
                  <p className="text-[10px] text-emerald-600 font-bold block mt-1">+9.4% holding gains</p>
                </div>
              </div>

              <div className="bg-white p-7 rounded-3xl border border-[#F5EFE6] shadow-sm flex flex-col justify-between">
                <span className="text-xs font-bold uppercase text-gray-400 block tracking-wider">Delivery Tickets placed</span>
                <div className="mt-4">
                  <span className="text-3xl font-mono font-bold text-[#6D4C41]">{orders.length} orders</span>
                  <p className="text-[10px] text-gray-500 font-bold block mt-1">{activeDeliveryLanes} currently baking</p>
                </div>
              </div>

              <div className="bg-white p-7 rounded-3xl border border-[#F5EFE6] shadow-sm flex flex-col justify-between">
                <span className="text-xs font-bold uppercase text-gray-400 block tracking-wider">Average Cart Cost</span>
                <div className="mt-4">
                  <span className="text-3xl font-mono font-bold text-[#6D4C41]">${averageOrderValue.toFixed(2)}</span>
                  <p className="text-[10px] text-gray-500 font-bold block mt-1">Calculated across live bills</p>
                </div>
              </div>

              <div className="bg-white p-7 rounded-3xl border border-[#F5EFE6] shadow-sm flex flex-col justify-between">
                <span className="text-xs font-bold uppercase text-gray-400 block tracking-wider">Meticulous book logs</span>
                <div className="mt-4">
                  <span className="text-3xl font-mono font-bold text-[#6D4C41]">{reservations.length} tables</span>
                  <p className="text-[10px] text-amber-700 font-bold block mt-1">{pendingReservations} approvals pending</p>
                </div>
              </div>

            </div>

            {/* Visual Charts simulation details */}
            <div className="grid lg:grid-cols-3 gap-8">
              
              {/* Left chart details */}
              <div className="lg:col-span-2 bg-white border border-[#F5EFE6] rounded-[36px] p-6 sm:p-8 shadow-sm">
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#6D4C41] mb-6 border-b border-[#F5EFE6] pb-3 flex justify-between">
                  <span>Gross Plated Hourly Flow</span>
                  <span className="text-[10px] uppercase font-bold text-gray-400 font-mono">Simulated LEDGER</span>
                </h3>

                <div className="h-48 flex items-end gap-3.5 border-b border-[#F5EFE6] pb-2 text-center text-gray-400 font-bold">
                  <div className="flex-1 flex flex-col justify-end h-full">
                    <div className="bg-[#B76E3A]/40 w-full h-[30%] rounded-t-md hover:bg-[#B76E3A] transition-all" />
                    <span className="text-[9px] font-semibold mt-1">9 AM</span>
                  </div>
                  <div className="flex-1 flex flex-col justify-end h-full">
                    <div className="bg-[#B76E3A]/40 w-full h-[65%] rounded-t-md hover:bg-[#B76E3A] transition-all" />
                    <span className="text-[9px] font-semibold mt-1">1 PM</span>
                  </div>
                  <div className="flex-1 flex flex-col justify-end h-full">
                    <div className="bg-[#B76E3A] w-full h-[95%] rounded-t-md shadow-l" />
                    <span className="text-[9px] font-bold text-[#6D4C41] mt-1">6 PM</span>
                  </div>
                  <div className="flex-1 flex flex-col justify-end h-full">
                    <div className="bg-[#B76E3A]/40 w-full h-[45%] rounded-t-md hover:bg-[#B76E3A] transition-all" />
                    <span className="text-[9px] font-semibold mt-1">11 PM</span>
                  </div>
                </div>
              </div>

              {/* Right details box */}
              <div className="bg-[#6D4C41] text-[#FFFDF8] rounded-[36px] p-6 sm:p-8 flex flex-col justify-between">
                <div className="space-y-4">
                  <Cpu size={24} className="text-[#B76E3A]" />
                  <h4 className="text-base font-serif font-black">System Terminal Status</h4>
                  <p className="text-[11px] text-[#FFFDF8]/80 leading-relaxed">
                    All local database indices are online and aligned! Plating actions and payment transfers bypass credit pipelines successfully over standard mock layers.
                  </p>
                </div>

                <div className="pt-4 border-t border-[#FFFDF8]/20 flex justify-between items-center text-[10px] text-[#FFFDF8]/60">
                  <span>SSL encryption</span>
                  <span>v4.0 stable development</span>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* TAB 2: ACTIVE DELIVERIES WITH TRANSIT ADJUSTMENTS */}
        {activeTab === 'orders' && (
          <div className="space-y-6 animate-fade-in">
            <h2 className="text-xl font-serif text-[#6D4C41] font-black mb-4">Kitchen Stoves & Active Delivery Tickets</h2>

            {orders.length === 0 ? (
              <p className="text-xs text-gray-400 italic text-center py-10 bg-white border border-[#F5EFE6] rounded-3xl">No delivery requests placed on the system server.</p>
            ) : (
              <div className="bg-white border border-[#F5EFE6] rounded-[36px] overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-[#F5EFE6] text-[#6D4C41] font-bold uppercase text-[9px] tracking-wider border-b border-[#F5EFE6]">
                        <th className="p-4">Invoice ID</th>
                        <th className="p-4">Recipient</th>
                        <th className="p-4">Items / Details</th>
                        <th className="p-4">Invoice Cost</th>
                        <th className="p-4">Dynamic State</th>
                        <th className="p-4 text-right">Route Controller</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F5EFE6] font-medium">
                      {orders.slice().reverse().map((ord) => (
                        <tr key={ord.id} className="hover:bg-[#FFFDF8]/60">
                          <td className="p-4 font-mono font-bold text-[#6D4C41]">
                            #{ord.id.substring(ord.id.length - 8).toUpperCase()}
                          </td>
                          <td className="p-4">
                            <span className="font-bold text-[#2F2F2F] block">{ord.userEmail}</span>
                            <span className="text-[10px] text-gray-400 font-semibold max-w-[150px] block truncate">{ord.address}</span>
                          </td>
                          <td className="p-4">
                            <div className="space-y-0.5 text-[10px]">
                              {ord.items.map((it, idx) => (
                                <div key={idx} className="text-gray-600">&bull; {it.quantity}x {it.name}</div>
                              ))}
                            </div>
                          </td>
                          <td className="p-4 font-mono font-bold text-[#B76E3A]">
                            ${ord.total.toFixed(2)}
                          </td>
                          <td className="p-4">
                            <span className={`inline-block px-2.5 py-0.5 rounded text-[9px] font-black uppercase ${
                              ord.status === 'Delivered' ? 'bg-emerald-100 text-emerald-800' :
                              ord.status === 'Cancelled' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                            }`}>
                              {ord.status}
                            </span>
                          </td>
                          <td className="p-4 text-right">
                            {ord.status !== 'Delivered' && ord.status !== 'Cancelled' && (
                              <select 
                                value={ord.status}
                                onChange={(e) => {
                                  onUpdateOrderStatus(ord.id, e.target.value);
                                  onAddToast(`Order #${ord.id.substring(ord.id.length - 8).toUpperCase()} moved to ${e.target.value}!`);
                                }}
                                className="px-2 py-1 bg-[#FFFDF8] border border-[#F5EFE6] text-[10px] font-bold rounded-lg uppercase tracking-wider text-[#6D4C41] focus:outline-none"
                              >
                                <option value="Received">Received</option>
                                <option value="Preparing">Preparing</option>
                                <option value="In Transit">In Transit</option>
                                <option value="Delivered">Delivered</option>
                                <option value="Cancelled">Cancelled</option>
                              </select>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: TABLE RESERVATIONS LOG SHEET */}
        {activeTab === 'reservations' && (
          <div className="space-y-6 animate-fade-in">
            <h2 className="text-xl font-serif text-[#6D4C41] font-black mb-4">Master Table Reservation approval Ledger</h2>

            {reservations.length === 0 ? (
              <p className="text-xs text-gray-400 italic text-center py-10 bg-white border border-[#F5EFE6] rounded-3xl">No reservation logs found on database.</p>
            ) : (
              <div className="bg-white border border-[#F5EFE6] rounded-[36px] overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-[#F5EFE6] text-[#6D4C41] font-bold uppercase text-[9px] tracking-wider border-b border-[#F5EFE6]">
                        <th className="p-4">Table #</th>
                        <th className="p-4">Guest Label</th>
                        <th className="p-4">Schedule Date & Time</th>
                        <th className="p-4">Guests</th>
                        <th className="p-4">Theme Style</th>
                        <th className="p-4">Hold status</th>
                        <th className="p-4 text-right">Table Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F5EFE6] font-medium">
                      {reservations.slice().reverse().map((res) => (
                        <tr key={res.id} className="hover:bg-[#FFFDF8]/60">
                          <td className="p-4 font-serif font-black text-sm text-[#B76E3A]">
                            #{res.tableNumber}
                          </td>
                          <td className="p-4 font-bold text-[#2F2F2F]">
                            {res.userEmail}
                          </td>
                          <td className="p-4 font-mono">
                            {res.date} &bull; {res.time}
                          </td>
                          <td className="p-4 font-mono font-bold">
                            {res.guests} max
                          </td>
                          <td className="p-4 font-bold text-gray-600">
                            {res.eventType}
                          </td>
                          <td className="p-4">
                            <span className={`inline-block px-2.5 py-0.5 rounded text-[9px] font-black uppercase ${
                              res.status === 'Confirmed' || res.status === 'Checked In' ? 'bg-emerald-100 text-emerald-800' :
                              res.status === 'Cancelled' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                            }`}>
                              {res.status}
                            </span>
                          </td>
                          <td className="p-4 text-right space-y-1">
                            {res.status === 'Pending' && (
                              <button
                                onClick={() => {
                                  onUpdateReservationStatus(res.id, 'Confirmed');
                                  onAddToast(`Table #${res.tableNumber} Reservation Confirmed.`);
                                }}
                                className="px-2.5 py-1 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg text-[9px] uppercase tracking-wider cursor-pointer mr-1"
                              >
                                Approve
                              </button>
                            )}
                            {res.status !== 'Cancelled' && res.status !== 'Checked In' && (
                              <button
                                onClick={() => {
                                  onUpdateReservationStatus(res.id, 'Cancelled');
                                  onAddToast(`Table #${res.tableNumber} Reservation Cancelled.`);
                                }}
                                className="px-2.5 py-1 bg-red-750 hover:bg-red-800 text-white font-bold rounded-lg text-[9px] uppercase tracking-wider cursor-pointer"
                              >
                                Cancel
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: RECIPIE INVENTORY CRUD CONTROLS */}
        {activeTab === 'menu' && (
          <div className="grid lg:grid-cols-12 gap-8 items-start animate-fade-in text-xs font-medium">
            
            {/* Left: Create food form */}
            <form onSubmit={handleCreateMenuItem} className="lg:col-span-5 bg-white border border-[#F5EFE6] rounded-[36px] p-6 sm:p-8 space-y-4 shadow-sm">
              <h3 className="text-base font-serif font-black text-[#6D4C41] flex items-center gap-1"><Plus size={16} /> Enroll New Master Dish</h3>
              
              <div className="space-y-1">
                <label className="text-[10px] text-gray-400 font-bold uppercase">Recipe Name</label>
                <input 
                  type="text" 
                  required
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  placeholder="e.g. Saffron Garlic Ribs"
                  className="w-full px-3 py-2 bg-[#FFFDF8] border border-[#F5EFE6] rounded-xl text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] text-gray-400 font-bold uppercase">Tasting Cost ($)</label>
                  <input 
                    type="number" 
                    required
                    step="0.01"
                    value={newItemPrice}
                    onChange={(e) => setNewItemPrice(e.target.value)}
                    placeholder="24.99"
                    className="w-full px-3 py-2 bg-[#FFFDF8] border border-[#F5EFE6] rounded-xl text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-gray-400 font-bold uppercase">Plating prep time</label>
                  <input 
                    type="text" 
                    required
                    value={newItemPrep}
                    onChange={(e) => setNewItemPrep(e.target.value)}
                    placeholder="15 mins"
                    className="w-full px-3 py-2 bg-[#FFFDF8] border border-[#F5EFE6] rounded-xl text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] text-gray-400 font-bold uppercase">Banquet Category</label>
                  <select
                    value={newItemCategory}
                    onChange={(e) => setNewItemCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-[#FFFDF8] border border-[#F5EFE6] rounded-xl text-xs"
                  >
                    {['Starters', 'Pizza', 'Burgers', 'BBQ', 'Pakistani Food', 'Pasta', 'Seafood', 'Desserts', 'Drinks'].map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-gray-400 font-bold uppercase">Dietary Feature Tag</label>
                  <select
                    value={newItemTag}
                    onChange={(e) => setNewItemTag(e.target.value)}
                    className="w-full px-3 py-2 bg-[#FFFDF8] border border-[#F5EFE6] rounded-xl text-xs"
                  >
                    {['Chef Choice', 'Gluten Free', 'Vegan', 'Best Seller', 'Hot/Spicy', 'None'].map((tag) => (
                      <option key={tag} value={tag}>{tag}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-gray-400 font-bold uppercase">Plating Description</label>
                <textarea 
                  required
                  value={newItemDesc}
                  onChange={(e) => setNewItemDesc(e.target.value)}
                  rows={2}
                  placeholder="Decadent description of taste profile, reductions, textures..."
                  className="w-full px-3 py-2 bg-[#FFFDF8] border border-[#F5EFE6] rounded-xl text-xs focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-gray-400 font-bold uppercase">Ingredients list (comma separated)</label>
                <input 
                  type="text" 
                  value={newItemIngredients}
                  onChange={(e) => setNewItemIngredients(e.target.value)}
                  placeholder="Saffron, Imported ribs, Caramelized garlic, Thyme extracts"
                  className="w-full px-3 py-2 bg-[#FFFDF8] border border-[#F5EFE6] rounded-xl text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-gray-400 font-bold uppercase">Food Unsplash Photo URL (Optional)</label>
                <input 
                  type="url" 
                  value={newItemImage}
                  onChange={(e) => setNewItemImage(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3 py-2 bg-[#FFFDF8] border border-[#F5EFE6] rounded-xl text-xs"
                />
              </div>

              <button 
                type="submit"
                className="w-full py-3 bg-[#B76E3A] hover:bg-[#6D4C41] text-white text-xs font-bold uppercase rounded-xl transition-all shadow-md cursor-pointer"
              >
                Enroll Dish to catalog
              </button>

            </form>

            {/* Right: Listed items CRUD removal */}
            <div className="lg:col-span-7 bg-white border border-[#F5EFE6] rounded-[36px] p-6 sm:p-8 space-y-6 shadow-sm max-h-[600px] overflow-y-auto">
              <h3 className="text-base font-serif font-black text-[#6D4C41]">Current Listed Recipe ledger</h3>

              <div className="divide-y divide-[#F5EFE6]">
                {menuItems.map((item) => (
                  <div key={item.id} className="py-3 flex justify-between items-center gap-4">
                    <div className="flex items-center gap-3">
                      <img src={item.images[0]} alt={item.name} className="w-10 h-10 rounded-lg object-cover bg-gray-50 shrink-0" referrerPolicy="no-referrer" />
                      <div>
                        <h4 className="text-xs font-bold text-[#2F2F2F]">{item.name}</h4>
                        <span className="text-[10px] text-[#B76E3A] font-bold uppercase tracking-wider">{item.category} &bull; ${item.price.toFixed(2)}</span>
                      </div>
                    </div>

                    <button 
                      onClick={() => {
                        onDeleteMenuItem(item.id);
                        onAddToast(`${item.name} removed from inventory.`);
                      }}
                      className="p-1.5 text-gray-300 hover:text-red-700 transition-colors cursor-pointer"
                      title="Delist from menu catalog"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* TAB 5: BROADCAST WIRE */}
        {activeTab === 'broadcast' && (
          <div className="bg-white border border-[#F5EFE6] rounded-[36px] p-6 sm:p-10 max-w-xl mx-auto shadow-sm space-y-6 animate-fade-in text-xs font-medium">
            <div className="text-center">
              <span className="text-3xl">📢</span>
              <h2 className="text-lg font-serif font-black text-[#6D4C41] mt-2">Gourmet Diplomats Wire</h2>
              <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">This panel transmits a direct websocket-simulated pushed bulletin array to all active user profiles instantly.</p>
            </div>

            <form onSubmit={handleBroadcast} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] text-gray-400 font-bold uppercase">Announcement Title</label>
                <input 
                  type="text" 
                  required
                  value={broadcastTitle}
                  onChange={(e) => setBroadcastTitle(e.target.value)}
                  placeholder="e.g. Rare 1998 Bordeaux Cellars unlocked!"
                  className="w-full px-3 py-2.5 bg-[#FFFDF8] border border-[#F5EFE6] rounded-xl text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-gray-400 font-bold uppercase font-bold">Bulletin Category</label>
                <select
                  value={broadcastType}
                  onChange={(e) => setBroadcastType(e.target.value as any)}
                  className="w-full px-3 py-2.5 bg-[#FFFDF8] border border-[#F5EFE6] rounded-xl text-xs"
                >
                  <option value="info">General Information Notice</option>
                  <option value="order">Online Ordering Announcement</option>
                  <option value="reservation">Table Reservation Registry Alert</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-gray-400 font-bold uppercase">Announcement message text</label>
                <textarea 
                  required
                  value={broadcastMsg}
                  onChange={(e) => setBroadcastMsg(e.target.value)}
                  rows={3}
                  placeholder="Greetings VIP Ambassadors, ... Free dessert is authorized for all reservations today using code RARESWEET!"
                  className="w-full px-3 py-2.5 bg-[#FFFDF8] border border-[#F5EFE6] rounded-xl text-xs focus:outline-none"
                />
              </div>

              <button 
                type="submit"
                className="w-full py-3.5 bg-red-800 hover:bg-red-900 font-bold text-white uppercase text-xs rounded-xl tracking-widest shadow"
              >
                Broadcast Diplomatic notice Action
              </button>
            </form>
          </div>
        )}

      </div>
    </div>
  );
}
