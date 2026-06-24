/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';

interface FaqItemItem {
  q: string;
  a: string;
}

export default function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs: FaqItemItem[] = [
    {
      q: "Where is the physical location of the Velvet Fork?",
      a: "Our landmark venue is nestled inside the historic Boulevard sector of South Kensington, London, carrying dedicated private parking, secluded garden conservatories, and sound-insulated VIP chambers."
    },
    {
      q: "Are the recipe options halal and gluten-compliant?",
      a: "Yes, absolutely. The culinary teams prepare every Pakistani and BBQ category using purely organic, certified Halal sources. Our menus label allergens such as peanuts, gluten, and shellfish clearly; you can also prompt our AI Sommelier companion within the menu to adapt recipes instantly."
    },
    {
      q: "How does the Gourmet Wallet and Rewards XP operate?",
      a: "Every registered member gains a Velvet Wallet. Booking anniversaries, birthdays, or private events triggers refundable safety deposits, which you can discharge directly via credit cards or wallet balances. Every dining action builds Gourmet XP rewards, which accrue towards complimentary desserts or Michelin cellar collections."
    },
    {
      q: "What is your refund policy for reservation cancellations?",
      a: "Standard dinner reservations are entirely free. Private event reservations carrying safety holdings ($50 or $150) can be cancelled or rescheduled up to 24 hours prior to dining times for an immediate 100% refund straight back to your original transaction route."
    },
    {
      q: "Can I host corporate galas or customized private tasting events?",
      a: "Yes. Our Private Event blocks support complete room booking up to 60 guests, featuring physical custom printing menu adjustments, dedicated sound aids, and a multi-course degustation progression designed collaboratively with Executive Chef Jean-Luc."
    }
  ];

  return (
    <div className="bg-[#FFFDF8] min-h-screen py-10 sm:py-16 text-xs font-semibold">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Header Title */}
        <div className="text-center mb-12">
          <span className="text-xs uppercase font-bold tracking-[0.25em] text-[#B76E3A] flex justify-center items-center gap-1">
            <Sparkles size={12} /> ENQUIRY CONCIERGE RESK
          </span>
          <h1 className="text-3xl sm:text-5xl font-serif text-[#2F2F2F] mt-1.5">Frequently Asked Matters</h1>
          <p className="text-xs text-gray-500 mt-2">
            Read critical protocols regarding allergen protection, wallet deposit claims, and private event blocks.
          </p>
        </div>

        {/* FAQs list */}
        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div 
                key={idx}
                className="bg-white border border-[#F5EFE6] rounded-2xl overflow-hidden transition-all duration-200"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full px-5 py-4 flex justify-between items-center text-left font-bold text-xs text-[#6D4C41] hover:bg-[#F5EFE6]/30 focus:outline-none focus:bg-[#F5EFE6]/30 transition-colors"
                >
                  <span className="font-serif text-sm sm:text-base">{faq.q}</span>
                  {isOpen ? <ChevronUp size={16} className="text-[#B76E3A]" /> : <ChevronDown size={16} className="text-[#B76E3A]" />}
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs text-gray-600 leading-relaxed font-medium animate-fade-in border-t border-[#F5EFE6]/45 mt-1.5">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
