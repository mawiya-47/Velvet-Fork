/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Mail, ShieldCheck, Clock, MapPin, Sparkles } from 'lucide-react';

export default function Footer() {
  const [newsEmail, setNewsEmail] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsEmail.trim()) return;
    setSuccess(true);
    setNewsEmail('');
    setTimeout(() => setSuccess(false), 4000);
  };

  return (
    <footer className="bg-[#F5EFE6] text-[#2F2F2F] pt-16 pb-8 border-t border-[#B76E3A]/10 text-xs font-semibold relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-12 gap-8 lg:gap-12 pb-12 border-b border-[#6D4C41]/10">
          
          {/* Brand block info */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-[#B76E3A] text-white flex items-center justify-center rounded-lg shadow font-serif text-lg font-black">
                V
              </div>
              <div>
                <span className="text-sm font-serif font-black tracking-widest text-[#6D4C41]">VELVET FORK</span>
                <span className="text-[8px] tracking-[0.2em] text-[#B76E3A] block font-bold uppercase">FINE CULINARY ARTISTRY</span>
              </div>
            </div>

            <p className="text-gray-600 max-w-sm leading-relaxed">
              Serving world-class luxury gourmets since 2012. Our South Kensington kitchen blends traditional European, South Asian Pakistani, and BBQ fusion culinary crafts elegantly.
            </p>

            <div className="space-y-2 pt-2 text-[11px] text-[#6D4C41] font-bold">
              <div className="flex items-center gap-2">
                <MapPin size={14} className="text-[#B76E3A]" />
                <span>Kensington Palace Gardens, London, W8 4QX</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={14} className="text-[#B76E3A]" />
                <span>Mon - Sun: 12:00 PM - 11:30 PM (CST)</span>
              </div>
            </div>
          </div>

          {/* Useful categories quick nav */}
          <div className="md:col-span-3 space-y-4 text-xs font-bold uppercase tracking-wider text-[#6D4C41]">
            <h4 className="text-xs text-[#2F2F2F] border-b border-[#6D4C41]/20 pb-2">Tasting Divisions</h4>
            <ul className="space-y-2 text-[11px] text-gray-500 font-medium normal-case">
              <li><span className="hover:text-[#B76E3A] transition-colors">Truffled Starters Platters</span></li>
              <li><span className="hover:text-[#B76E3A] transition-colors">Pakistani Gourmet Curries</span></li>
              <li><span className="hover:text-[#B76E3A] transition-colors">Michelin BBQ Charcoal Grills</span></li>
              <li><span className="hover:text-[#B76E3A] transition-colors">Premium Sweet Souffles & Wines</span></li>
            </ul>
          </div>

          {/* Newsletter signup block */}
          <div className="md:col-span-4 space-y-4">
            <h4 className="text-xs text-[#6D4C41] border-b border-[#6D4C41]/20 pb-2 uppercase tracking-wide">Subscribe to Registry newsletters</h4>
            <p className="text-xs text-gray-500 leading-relaxed font-semibold">
              Obtain priority alerts of rare vintage releases, Michelin guest chefs, and exclusive loyalty cashbacks.
            </p>

            {success ? (
              <div className="p-3.5 bg-emerald-50 text-emerald-800 rounded-xl text-xs flex items-center gap-2">
                <Sparkles size={14} className="text-emerald-600 shrink-0" />
                <span>Diplomatic subscription succeeded! Thank you.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <input 
                  type="email" 
                  required
                  value={newsEmail}
                  onChange={(e) => setNewsEmail(e.target.value)}
                  placeholder="Insert royal email..."
                  className="flex-1 bg-white border border-[#B76E3A]/20 px-3.5 py-2.5 rounded-xl text-xs placeholder-gray-400 focus:outline-none"
                />
                <button 
                  type="submit" 
                  className="px-4 py-2.5 bg-[#6D4C41] hover:bg-[#B76E3A] text-white font-bold rounded-xl text-[10px] uppercase tracking-wider shadow"
                >
                  Join
                </button>
              </form>
            )}
          </div>

        </div>

        {/* Brand Copyright and regulatory signs */}
        <div className="pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-gray-500 text-[11px] font-semibold">
          <div>
            &copy; {new Date().getFullYear()} Velvet Fork. Designed elegantly by Muhammad Mawiya.
          </div>
          <div className="flex items-center gap-2.5 text-xs">
            <ShieldCheck size={14} className="text-emerald-700" />
            <span className="text-gray-400 font-bold uppercase">Michelin Plated Quality Certified</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
