/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, MessageCircle, X, Send, Loader2, ArrowRight } from 'lucide-react';
import { MenuItem, OrderItem } from '../types';

interface GourmetSommelierProps {
  currentCart: any[];
  dietaryPreference: string;
}

export default function GourmetSommelier({ currentCart, dietaryPreference }: GourmetSommelierProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Array<{ sender: 'sommelier' | 'user'; text: string }>>([
    {
      sender: 'sommelier',
      text: "Salutations, gourmet enthusiast. I am your Velvet Fork AI Culinary Sommelier. Allow me to design a magnificent 3-course degustation experience, suggest an exquisite wine pairing, or adjust our current menu recipes to fulfill your exact dietary preferences perfectly. What culinary masterwork can I assist you with today?"
    }
  ]);
  const [inputVal, setInputVal] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const starterBubbles = [
    "Recommend a luxury 3-course pairing for a celebration",
    "What wine pairs perfectly with Truffle Butter Scallops?",
    "How can you modify Lamb Korma to accommodate a nut allergy?",
    "Show me keto-friendly and low-carb choices on the menu"
  ];

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim() || loading) return;

    const userMsg = textToSend;
    setMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
    setInputVal('');
    setLoading(true);

    try {
      const response = await fetch('/api/gemini/sommelier', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-email': 'guest@velvetfork.com'
        },
        body: JSON.stringify({
          prompt: userMsg,
          currentCart,
          dietaryPreference
        })
      });

      const data = await response.json();
      if (data.success && data.text) {
        setMessages(prev => [...prev, { sender: 'sommelier', text: data.text }]);
      } else {
        setMessages(prev => [...prev, {
          sender: 'sommelier',
          text: "Forgive me, dear guest. A temporary cellar oversight has occurred. Our kitchen is standing by; feel free to ask again or browse our fine selections."
        }]);
      }
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, {
        sender: 'sommelier',
        text: "My apologies. I have run down to the reserve wine vault. Please try again shortly."
      }]);
    } finally {
      setLoading(false);
    }
  };

  // Turn markdown markers like #, **, *, -, and line breaks into elegant luxury text markup
  const parseMarkdownText = (text: string) => {
    const lines = text.split('\n');
    return lines.map((line, idx) => {
      let parsed = line;
      
      // Headers
      if (parsed.startsWith('### ')) {
        return <h4 key={idx} className="text-sm font-bold text-[#6D4C41] mt-3 mb-1 uppercase tracking-wider">{parsed.replace('### ', '')}</h4>;
      }
      if (parsed.startsWith('## ')) {
        return <h3 key={idx} className="text-[#B76E3A] font-serif text-lg font-bold mt-4 mb-2 border-b border-[#F5EFE6] pb-1">{parsed.replace('## ', '')}</h3>;
      }
      if (parsed.startsWith('# ')) {
        return <h2 key={idx} className="text-[#6D4C41] font-serif text-xl font-black mt-4 mb-2">{parsed.replace('# ', '')}</h2>;
      }

      // Bullet points
      if (parsed.startsWith('- ') || parsed.startsWith('* ')) {
        const clearLine = parsed.replace(/^[-*]\s+/, '');
        return (
          <li key={idx} className="ml-4 list-disc text-xs text-gray-700 leading-relaxed my-1">
            {formatBoldItalic(clearLine)}
          </li>
        );
      }

      // Default line formatting
      return <p key={idx} className="text-xs text-gray-700 leading-relaxed my-1.5">{formatBoldItalic(parsed)}</p>;
    });
  };

  const formatBoldItalic = (text: string) => {
    // Basic regex-like processing for **bold** text
    const parts = text.split(/\*\*([\s\S]*?)\*\*/g);
    return parts.map((part, i) => {
      if (i % 2 === 1) {
        return <strong key={i} className="font-extrabold text-[#6D4C41]">{part}</strong>;
      }
      // Process *italic*
      const subparts = part.split(/\*([\s\S]*?)\*/g);
      return subparts.map((subpart, j) => {
        if (j % 2 === 1) {
          return <em key={j} className="italic text-[#B76E3A]">{subpart}</em>;
        }
        return subpart;
      });
    });
  };

  return (
    <>
      {/* Sommelier Floating Trigger Launcher Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 px-4.5 py-3.5 bg-gradient-to-r from-[#B76E3A] to-[#6D4C41] text-white rounded-full shadow-2xl hover:scale-105 transition-all duration-300 group border border-[#FFFDF8]/20"
        title="Consult our Expert AI Sommelier"
        id="ai-sommelier-launcher"
      >
        <Sparkles size={18} className="animate-pulse" />
        <span className="text-xs font-bold uppercase tracking-widest hidden sm:inline">Ask Sommelier</span>
      </button>

      {/* Embedded Sommelier Dialog Chat Overlay */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-96 max-w-[calc(100vw-2rem)] h-[550px] bg-[#FFFDF8] border border-[#F5EFE6] rounded-[28px] shadow-2xl z-50 flex flex-col overflow-hidden animate-fade-in">
          
          {/* Header Banner */}
          <div className="px-5 py-4 bg-gradient-to-r from-[#FFFDF8] to-[#F5EFE6] border-b border-[#F5EFE6] flex justify-between items-center relative">
            <div className="absolute top-0 left-0 right-0 h-1 bg-[#B76E3A]" />
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 bg-[#B76E3A]/10 rounded-full flex items-center justify-center border border-[#B76E3A]/20">
                🍷
              </div>
              <div>
                <h3 className="text-xs font-bold uppercase tracking-widest text-[#6D4C41] leading-none mb-1">AI Sommelier</h3>
                <span className="text-[10px] text-[#B76E3A] font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" /> Cellar & Kitchen Consultant
                </span>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="p-1.5 text-gray-400 hover:text-[#6D4C41] hover:bg-[#F5EFE6] rounded-full transition-all"
            >
              <X size={16} />
            </button>
          </div>

          {/* Conversation Feed */}
          <div className="flex-1 overflow-y-auto px-5 py-4 bg-gradient-to-b from-[#FFFDF8] via-white to-[#FFFDF8] space-y-4">
            {messages.map((msg, i) => (
              <div 
                key={i} 
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[85%] rounded-2xl px-4 py-3 shadow-sm ${
                    msg.sender === 'user' 
                      ? 'bg-[#6D4C41] text-white rounded-br-none font-medium text-xs' 
                      : 'bg-[#F5EFE6]/60 backdrop-blur-sm border border-[#F5EFE6] text-gray-800 rounded-bl-none text-xs'
                  }`}
                >
                  {msg.sender === 'user' ? (
                    <p className="leading-relaxed">{msg.text}</p>
                  ) : (
                    <div>{parseMarkdownText(msg.text)}</div>
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-[#F5EFE6]/60 border border-[#F5EFE6] rounded-2xl rounded-bl-none px-4 py-3 flex items-center gap-2 text-xs text-gray-500">
                  <Loader2 size={14} className="animate-spin text-[#B76E3A]" />
                  <span>The Sommelier is deliberating with the cellar master...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Prompt Suggestions Triggers */}
          <div className="px-5 py-2.5 bg-[#F5EFE6]/30 border-t border-[#F5EFE6] overflow-x-auto flex gap-2 whitespace-nowrap scrollbar-none">
            {starterBubbles.map((bubble, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSend(bubble)}
                className="inline-block px-3 py-1.5 bg-white border border-[#F5EFE6] hover:border-[#B76E3A]/40 text-[10px] font-semibold text-[#6D4C41] rounded-full transition-all duration-200 cursor-pointer shadow-sm hover:bg-[#FFFDF8]"
              >
                {bubble}
              </button>
            ))}
          </div>

          {/* Input Chat Box Control */}
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSend(inputVal); }}
            className="p-3 bg-[#FFFDF8] border-t border-[#F5EFE6] flex gap-2"
          >
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="Inquire about wine pairs, recipe edits..."
              className="flex-1 px-4 py-2.5 bg-[#F5EFE6]/40 border border-[#F5EFE6] rounded-xl text-xs placeholder-gray-400 focus:outline-none focus:border-[#B76E3A]/60 font-medium transition-colors"
            />
            <button
              type="submit"
              disabled={loading || !inputVal.trim()}
              className="p-2.5 bg-[#B76E3A] hover:bg-[#6D4C41] disabled:bg-gray-200 text-white rounded-xl transition-all shadow-md flex items-center justify-center cursor-pointer"
            >
              <Send size={16} />
            </button>
          </form>

        </div>
      )}
    </>
  );
}
