/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  CalendarDays, 
  Clock, 
  Users, 
  Sparkles, 
  FileText, 
  CreditCard, 
  Wallet, 
  CheckCircle2, 
  AlertTriangle,
  History,
  PartyPopper
} from 'lucide-react';
import { Reservation, User } from '../types';

interface ReservationProps {
  currentUser: User | null;
  reservations: Reservation[];
  onAddReservation: (reservationData: {
    date: string;
    time: string;
    guests: number;
    eventType: string;
    paymentMode: 'wallet' | 'card';
    specialInstructions: string;
  }) => Promise<any>;
  onLoginClick: () => void;
  onCancelReservation: (resId: string) => void;
}

export default function ReservationPage({
  currentUser,
  reservations,
  onAddReservation,
  onLoginClick,
  onCancelReservation
}: ReservationProps) {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('19:30');
  const [guests, setGuests] = useState(2);
  const [eventType, setEventType] = useState('Standard Dining');
  const [paymentMode, setPaymentMode] = useState<'wallet' | 'card'>('wallet');
  const [specialInstructions, setSpecialInstructions] = useState('');
  
  // UX State variables
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const timeSlots = ['17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00'];
  const eventTypes = [
    { name: 'Standard Dining', deposit: 0, desc: 'Casual gourmet table reservation' },
    { name: 'Private Event Block', deposit: 150, desc: 'Full room reservation with customized chef consultations' },
    { name: 'Birthday Jubilee', deposit: 50, desc: 'Complimentary lava soufflé, balloons, and prime area seating' },
    { name: 'Anniversary celebration', deposit: 50, desc: 'Complimentary glass sparkler and candle lights' },
    { name: 'Business Meeting', deposit: 0, desc: 'Secluded silent area with high-speed presentation aids' }
  ];

  // Calculate required deposit based on selected event type
  const selectedEvent = eventTypes.find(e => e.name === eventType || e.name.toLowerCase().includes(eventType.toLowerCase().split(' ')[0])) || eventTypes[0];
  const requiredDeposit = selectedEvent.deposit;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      onLoginClick();
      return;
    }

    if (!date) {
      setErrorMsg("Please select a dining date.");
      return;
    }

    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const response = await onAddReservation({
        date,
        time,
        guests: Number(guests),
        eventType: selectedEvent.name,
        paymentMode,
        specialInstructions
      });

      if (response && response.error) {
        setErrorMsg(response.error);
      } else {
        setSuccessMsg(`Reservation booked successfully! Table #${response.reservation.tableNumber} is reserved for you on ${date} at ${time}.`);
        // Reset state
        setDate('');
        setSpecialInstructions('');
        setEventType('Standard Dining');
      }
    } catch (err: any) {
      setErrorMsg(err.message || "An error occurred while reserving your table.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#FFFDF8] min-h-screen py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Title */}
        <div className="text-center max-w-xl mx-auto mb-12">
          <span className="text-xs uppercase font-bold tracking-[0.25em] text-[#B76E3A]">Instant Table Select</span>
          <h1 className="text-3xl sm:text-5xl font-serif text-[#2F2F2F] mt-1.5">Private Reservation Registry</h1>
          <p className="text-xs text-gray-500 mt-2">
            Secure prime seating in our luxury halls. Standard dining slots are free, while special anniversaries or full private hall sessions carry small refundable holding deposits.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-12 items-start">
          
          {/* Left panel: Reservation scheduler Form */}
          <div className="lg:col-span-7 bg-white border border-[#F5EFE6] rounded-[36px] p-6 sm:p-10 shadow-sm space-y-6">
            
            <h2 className="text-xl font-serif font-black text-[#6D4C41]">Select Table Schedule</h2>

            {currentUser ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Alert logs */}
                {successMsg && (
                  <div className="p-4 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-xl text-xs flex items-start gap-4">
                    <CheckCircle2 size={16} className="text-emerald-600 mt-0.5 shrink-0" />
                    <span>{successMsg}</span>
                  </div>
                )}

                {errorMsg && (
                  <div className="p-4 bg-red-50 border border-red-300 text-red-800 rounded-xl text-xs flex items-start gap-4">
                    <AlertTriangle size={16} className="text-red-600 mt-0.5 shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <div className="grid sm:grid-cols-2 gap-6">
                  {/* Date selection */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Dining Date</label>
                    <div className="relative">
                      <CalendarDays className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                      <input 
                        type="date" 
                        value={date}
                        min={new Date().toISOString().split('T')[0]}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full pl-10 pr-3 py-3 bg-[#FFFDF8] border border-[#F5EFE6] rounded-xl text-xs font-semibold text-[#6D4C41] focus:outline-none focus:border-[#B76E3A]" 
                      />
                    </div>
                  </div>

                  {/* Guess selection */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Number of Guests</label>
                    <div className="relative">
                      <Users className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                      <select 
                        value={guests} 
                        onChange={(e) => setGuests(Number(e.target.value))}
                        className="w-full pl-10 pr-3 py-3 bg-[#FFFDF8] border border-[#F5EFE6] rounded-xl text-xs font-semibold text-[#6D4C41] focus:outline-none focus:border-[#B76E3A]"
                      >
                        {[1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20].map((num) => (
                          <option key={num} value={num}>{num} Guest{num > 1 ? 's' : ''}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Time picker row */}
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Available Dining Times</span>
                  <div className="grid grid-cols-5 gap-2">
                    {timeSlots.map((slot) => (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setTime(slot)}
                        className={`py-2 text-[10px] font-bold rounded-lg border text-center transition-all ${
                          time === slot 
                            ? 'bg-[#B76E3A] border-[#B76E3A] text-white shadow-sm' 
                            : 'bg-white border-[#F5EFE6] text-[#6D4C41] hover:bg-[#F5EFE6]'
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Event types */}
                <div className="space-y-2.5">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Event Theme & Arrangement</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {eventTypes.map((et) => (
                      <div 
                        key={et.name}
                        onClick={() => setEventType(et.name)}
                        className={`p-4 border rounded-2xl cursor-pointer transition-all ${
                          eventType === et.name 
                            ? 'border-[#B76E3A] bg-[#B76E3A]/5 shadow-sm' 
                            : 'border-[#F5EFE6] bg-[#FFFDF8] hover:bg-[#F5EFE6]/50'
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <span className="text-xs font-bold text-[#6D4C41] block">{et.name}</span>
                          <span className="text-[9px] font-mono font-bold text-[#B76E3A]">
                            {et.deposit > 0 ? `$${et.deposit}.00 Deposit` : 'No Fee'}
                          </span>
                        </div>
                        <p className="text-[10px] text-gray-500 mt-1">{et.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Special Instruction Textarea */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Special Plating Instructions (Optional)</label>
                  <textarea 
                    value={specialInstructions}
                    onChange={(e) => setSpecialInstructions(e.target.value)}
                    rows={2}
                    placeholder="Allergies, high chair, terrace proximity requested, candlelights, floral configurations..."
                    className="w-full px-4 py-3 bg-[#FFFDF8] border border-[#F5EFE6] rounded-xl text-xs placeholder-gray-400 focus:outline-none focus:border-[#B76E3A]"
                  />
                </div>

                {/* Optional deposit transaction selection */}
                {requiredDeposit > 0 && (
                  <div className="p-4 bg-[#F5EFE6]/60 border border-[#F5EFE6] rounded-2xl space-y-3">
                    <div className="flex justify-between items-center pb-2.5 border-b border-[#F5EFE6]">
                      <div>
                        <span className="text-xs font-bold text-[#6D4C41] block">Secure Holding Deposit Required</span>
                        <span className="text-[9px] text-gray-500">Refunded upon check-in or cancellation 24h prior.</span>
                      </div>
                      <span className="text-lg font-mono font-bold text-[#B76E3A]">${requiredDeposit}.00</span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-1">
                      <div 
                        onClick={() => setPaymentMode('wallet')}
                        className={`p-3 border rounded-xl cursor-pointer flex items-center justify-between transition-all ${paymentMode === 'wallet' ? 'border-[#B76E3A] bg-white text-[#6D4C41]' : 'border-transparent text-gray-400 opacity-60'}`}
                      >
                        <span className="text-xs font-bold flex items-center gap-1.5"><Wallet size={14} /> Wallet Points</span>
                        <span className="text-[10px] font-mono font-bold">${currentUser.balance.toFixed(0)}</span>
                      </div>
                      <div 
                        onClick={() => setPaymentMode('card')}
                        className={`p-3 border rounded-xl cursor-pointer flex items-center justify-between transition-all ${paymentMode === 'card' ? 'border-[#B76E3A] bg-white text-[#6D4C41]' : 'border-transparent text-gray-400 opacity-60'}`}
                      >
                        <span className="text-xs font-bold flex items-center gap-1.5"><CreditCard size={14} /> Credit Card</span>
                        <span className="text-[9px] text-emerald-600 font-bold uppercase">Stripe Active</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Submittal Button with points incentive */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-[#B76E3A] hover:bg-[#6D4C41] text-white text-xs font-bold uppercase tracking-widest rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  {loading ? 'Transacting slots...' : requiredDeposit > 0 ? `Process Deposit & Book for $${requiredDeposit}.00` : 'Confirm Free Reservation'}
                </button>

              </form>
            ) : (
              <div className="p-8 text-center bg-[#F5EFE6]/40 rounded-3xl border border-[#F5EFE6] space-y-4">
                <span className="text-3xl">🔑</span>
                <h3 className="text-base font-serif font-bold text-[#6D4C41]">Gourmet Credentials Required</h3>
                <p className="text-xs text-gray-500 max-w-sm mx-auto leading-relaxed">
                  Please identify yourself or register a Velvet Fork tasting credential to book table reservations and allocate gourmet event deposit schedules.
                </p>
                <button 
                  onClick={onLoginClick}
                  className="px-6 py-2.5 bg-[#B76E3A] hover:bg-[#6D4C41] text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-colors cursor-pointer"
                >
                  Enter Reservation Desk
                </button>
              </div>
            )}

          </div>

          {/* Right panel: Active Reservation Statuses & Ambiance Details */}
          <div className="lg:col-span-5 space-y-8">
            
            {/* Ambiance visual card */}
            <div className="bg-gradient-to-br from-[#6D4C41] to-[#2F2F2F] text-white p-6 sm:p-8 rounded-[36px] shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-xl" />
              <div className="relative z-10 space-y-4">
                <PartyPopper size={24} className="text-[#B76E3A]" />
                <h3 className="text-lg font-serif">Meticulous Plating details</h3>
                <ol className="text-xs space-y-3 list-decimal list-inside text-white/90 font-medium">
                  <li>24K Wagyu Gold burgers are custom-allocated only.</li>
                  <li>Cancellations 24h prior return full deposits.</li>
                  <li>Loyalty Ambassadors redeem points at the checkout desk.</li>
                  <li>Every VIP Private event gains customized menu layouts.</li>
                </ol>
              </div>
            </div>

            {/* Curvaceous Reservation History */}
            <div className="bg-white border border-[#F5EFE6] rounded-[36px] p-6 sm:p-8 shadow-sm">
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#6D4C41] mb-6 flex items-center gap-1.5 border-b border-[#F5EFE6] pb-3">
                <History size={16} /> My Reservations History
              </h3>

              {!currentUser ? (
                <p className="text-xs text-gray-400 italic text-center py-6">Sign in to check pending book logs.</p>
              ) : reservations.length === 0 ? (
                <p className="text-xs text-gray-400 italic text-center py-6">No previous dining registries booked on this email.</p>
              ) : (
                <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
                  {reservations.slice().reverse().map((res) => (
                    <div key={res.id} className="p-4 bg-[#FFFDF8] border border-[#F5EFE6] rounded-2xl flex justify-between items-center gap-4">
                      <div className="space-y-1">
                        <span className="text-[9px] font-serif font-black uppercase text-[#B76E3A]">Table #{res.tableNumber}</span>
                        <div className="text-xs font-bold text-[#6D4C41]">{res.eventType}</div>
                        <div className="text-[10px] text-gray-400 font-semibold">{res.date} at {res.time} &bull; {res.guests} Guests</div>
                        
                        {res.cardChargedAmount ? (
                          <span className="text-[9px] text-[#B76E3A] font-bold block mt-1">Paid: ${res.cardChargedAmount}.00</span>
                        ) : null}
                      </div>

                      <div className="text-right space-y-2">
                        <span className={`inline-block px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider ${
                          res.status === 'Confirmed' ? 'bg-emerald-100 text-emerald-800' :
                          res.status === 'Cancelled' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {res.status}
                        </span>

                        {res.status !== 'Cancelled' && res.status !== 'Checked In' && (
                          <button
                            onClick={() => onCancelReservation(res.id)}
                            className="text-[9px] text-[#B76E3A] hover:underline font-bold block w-full text-right"
                          >
                            Cancel
                          </button>
                        )}
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
