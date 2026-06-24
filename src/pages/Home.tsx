/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  Award, 
  Clock, 
  MapPin, 
  Star, 
  Sparkles, 
  ChevronRight, 
  ShieldCheck, 
  Heart,
  Quote,
  Feather
} from 'lucide-react';
import { MenuItem, Blog, Review } from '../types';

interface HomeProps {
  onViewChange: (view: string) => void;
  featuredItems: MenuItem[];
  reviews: Review[];
  blogs: Blog[];
  onToggleWishlist: (itemId: string) => void;
  wishlist: string[];
}

export default function Home({ 
  onViewChange, 
  featuredItems, 
  reviews, 
  blogs, 
  onToggleWishlist, 
  wishlist 
}: HomeProps) {
  
  return (
    <div className="bg-[#FFFDF8] min-h-screen">
      
      {/* 1. Fullscreen Luxury Hero Section */}
      <section className="relative overflow-hidden py-16 lg:py-24 border-b border-[#F5EFE6]">
        {/* Soft Background Glares */}
        <div className="absolute top-[-100px] right-[-100px] w-[500px] h-[500px] bg-[#F5EFE6] rounded-full opacity-40 blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-[-150px] left-[-100px] w-[500px] h-[500px] bg-[#B76E3A]/10 rounded-full opacity-30 blur-3xl"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Narrative */}
            <div className="lg:col-span-7 flex flex-col justify-center space-y-6">
              <div className="space-y-3">
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#B76E3A]/10 text-[#B76E3A] text-[10px] font-bold uppercase tracking-[0.25em] rounded-md border border-[#B76E3A]/20">
                  <Sparkles size={11} className="text-[#B76E3A]" /> The Five-Star Fine Dining Experience
                </span>
                <h1 className="text-5xl sm:text-7xl font-serif leading-[1.1] text-[#2F2F2F] tracking-tight">
                  Where Every <span className="italic text-[#B76E3A] font-serif font-light">Bite</span> Becomes a Memory.
                </h1>
              </div>
              <p className="text-base sm:text-lg text-[#2F2F2F]/75 leading-relaxed max-w-xl font-sans font-medium">
                Indulge in an exquisite sensory journey where traditional Gastronomy meets modern Luxury. Velvet Fork offers a curated symphony of flavors, handcheck ingredients, and gold-standard vintages.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button 
                  onClick={() => onViewChange('menu')}
                  className="px-8 py-3.5 bg-[#6D4C41] text-xs font-bold uppercase tracking-wider text-white rounded-xl flex items-center gap-2 shadow-xl hover:bg-[#B76E3A] transition-all duration-300"
                >
                  Explore Menu Tasting <ChevronRight size={14} />
                </button>
                <button 
                  onClick={() => onViewChange('reservation')}
                  className="px-8 py-3.5 bg-transparent border border-[#6D4C41]/30 text-xs font-bold uppercase tracking-wider text-[#6D4C41] rounded-xl hover:bg-[#F5EFE6] transition-all"
                >
                  Secure Table Booking
                </button>
              </div>

              {/* Accolades Indicator */}
              <div className="flex items-center gap-6 mt-8 pt-6 border-t border-[#F5EFE6] max-w-md">
                <div className="flex -space-x-3">
                  <div className="w-12 h-12 rounded-full border-4 border-[#FFFDF8] bg-[#F5EFE6] flex items-center justify-center text-lg shadow-sm">👑</div>
                  <div className="w-12 h-12 rounded-full border-4 border-[#FFFDF8] bg-[#B76E3A] text-white flex items-center justify-center text-xs font-bold shadow-sm">5★</div>
                </div>
                <div>
                  <div className="text-xs font-bold text-[#6D4C41] uppercase tracking-wider">Top-Tier Michelin Choice</div>
                  <p className="text-[11px] text-gray-500 font-medium">Over 1,200 verified five-star private events & critiques.</p>
                </div>
              </div>
            </div>

            {/* Right Visual Highlight (Bento Hero Block) */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              
              {/* Main Dish Banner */}
              <div className="relative h-72 sm:h-80 bg-[#F5EFE6] rounded-[36px] overflow-hidden shadow-2xl border border-[#F5EFE6] group">
                <img 
                  src="https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=800"
                  alt="Smoked Australia Lamb Ribeye"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#2F2F2F]/80 via-[#2F2F2F]/20 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <span className="text-[9px] uppercase font-bold tracking-widest text-[#B76E3A] bg-[#FFFDF8] px-2 py-0.5 rounded mb-2 inline-block">
                    Chef's Signature
                  </span>
                  <h3 className="text-xl font-serif font-bold text-white">Rosemary Glazed Australian Lamb Chops</h3>
                  <p className="text-xs text-white/80 mt-1 line-clamp-1">Charcoal grill-kissed rack on dynamic copper pomegranate reduction.</p>
                </div>
              </div>

              {/* Smaller Card Bento Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-[#F5EFE6] shadow-sm flex flex-col justify-between h-36">
                  <div className="text-xs font-bold text-[#6D4C41] opacity-60 uppercase tracking-widest">Next Open Slots</div>
                  <div>
                    <div className="text-lg font-serif text-[#2F2F2F] font-bold">8:30 PM Tonight</div>
                    <span className="text-[9px] font-bold text-amber-700 uppercase">98% Occupied Today</span>
                  </div>
                </div>
                <div 
                  onClick={() => onViewChange('reservation')}
                  className="bg-[#B76E3A] p-5 rounded-2xl text-white flex flex-col justify-between h-36 cursor-pointer hover:bg-[#6D4C41] transition-all duration-300"
                >
                  <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center">📅</div>
                  <div>
                    <div className="text-sm font-bold uppercase tracking-wider">Book Now</div>
                    <span className="text-[10px] opacity-95">Instant slot confirmation</span>
                  </div>
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* 2. Restaurant Story introduction */}
      <section className="py-16 bg-[#F5EFE6]/40 border-b border-[#F5EFE6]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <span className="text-xs uppercase font-bold tracking-widest text-[#B76E3A]">A Culinary Legacy</span>
              <h2 className="text-3xl sm:text-4xl font-serif text-[#6D4C41]">Gourmet Artistry, Redefined.</h2>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                Founded by Executive Chef Jean-Luc and culinary technologist Muhammad Mawiya, Velvet Fork is built on a simple philosophy: fine dining is not just about sustenance, but about transforming high-grade, sustainable organic ingredients into a deeply personal performance.
              </p>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                From our handmade custom bronze-cut pasta to our curated cellar of ancient Bordeaux vintages, every detail of the Velvet Fork experience is polished with soft glassmorphism, warm shadows, and michelin-class hospitality.
              </p>
              <div className="grid grid-cols-3 gap-4 pt-4 text-center">
                <div className="p-4 bg-white rounded-xl border border-[#F5EFE6] shadow-sm">
                  <div className="text-2xl font-serif text-[#B76E3A] font-bold">250+</div>
                  <div className="text-[9px] font-bold text-[#6D4C41] uppercase tracking-wider">Fine Vintages</div>
                </div>
                <div className="p-4 bg-white rounded-xl border border-[#F5EFE6] shadow-sm">
                  <div className="text-2xl font-serif text-[#B76E3A] font-bold">12+</div>
                  <div className="text-[9px] font-bold text-[#6D4C41] uppercase tracking-wider">Master Chefs</div>
                </div>
                <div className="p-4 bg-white rounded-xl border border-[#F5EFE6] shadow-sm">
                  <div className="text-2xl font-serif text-[#B76E3A] font-bold">3</div>
                  <div className="text-[9px] font-bold text-[#6D4C41] uppercase tracking-wider">Private Halls</div>
                </div>
              </div>
            </div>
            
            {/* Split Ambiance Mosaic */}
            <div className="grid grid-cols-2 gap-4">
              <img 
                src="https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&q=80&w=600" 
                alt="Velvet Fork Dining Ambiance" 
                className="rounded-2xl h-64 w-full object-cover shadow-md"
                referrerPolicy="no-referrer"
              />
              <img 
                src="https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&q=80&w=600" 
                alt="Executive Chef plated recipe" 
                className="rounded-2xl h-64 w-full object-cover shadow-md mt-6"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 3. Featured Master Chef Recommendations (Menu Carousel Preview) */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex justify-between items-end mb-12">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#B76E3A]">Highly Appraised</span>
              <h2 className="text-3xl sm:text-4xl font-serif text-[#2F2F2F] mt-1">Chef's Featured Delicacies</h2>
            </div>
            <button 
              onClick={() => onViewChange('menu')}
              className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#B76E3A] hover:text-[#6D4C41] transition-colors"
            >
              View Full Menu Tasting <ChevronRight size={14} />
            </button>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredItems.slice(0, 3).map((item) => {
              const isWishlisted = wishlist.includes(item.id);
              return (
                <div 
                  key={item.id} 
                  className="bg-white border border-[#F5EFE6] rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group flex flex-col h-full"
                >
                  <div className="relative h-56 w-full overflow-hidden bg-gray-100">
                    <img 
                      src={item.images[0] || "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=800"} 
                      alt={item.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    {/* Tags overlay */}
                    <div className="absolute top-4 left-4 flex flex-wrap gap-1">
                      {item.tags.map((tag, i) => (
                        <span key={i} className="px-2 py-0.5 bg-[#FFFDF8]/90 text-[9px] font-bold text-[#6D4C41] uppercase tracking-widest rounded shadow-sm">
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Favorite Button trigger */}
                    <button
                      onClick={() => onToggleWishlist(item.id)}
                      className="absolute top-4 right-4 p-2.5 bg-[#FFFDF8] text-[#B76E3A] rounded-full shadow-md hover:scale-110 transition-transform cursor-pointer"
                    >
                      <Heart size={14} fill={isWishlisted ? "#B76E3A" : "none"} />
                    </button>
                  </div>

                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-center text-gray-400 text-[10px] font-bold uppercase tracking-wider mb-2">
                        <span>{item.category}</span>
                        <span className="flex items-center gap-1 font-mono text-[#B76E3A] font-bold"><Clock size={11} /> {item.prepTime}</span>
                      </div>
                      <h3 className="text-lg font-serif font-bold text-[#2F2F2F] group-hover:text-[#B76E3A] transition-colors line-clamp-1">
                        {item.name}
                      </h3>
                      <p className="text-xs text-gray-600 mt-2 line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>
                    </div>

                    <div className="pt-6 mt-6 border-t border-[#F5EFE6] flex justify-between items-center">
                      <span className="text-xl font-mono font-bold text-[#6D4C41]">${item.price.toFixed(2)}</span>
                      <button
                        onClick={() => onViewChange('menu')}
                        className="px-4 py-2 bg-[#F5EFE6] hover:bg-[#B76E3A] hover:text-white text-[10px] font-bold text-[#6D4C41] uppercase tracking-wider rounded-xl transition-all duration-200"
                      >
                        Tasting Options
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 4. Why Velvet Fork Fine Dining (Bento Showcase grid) */}
      <section className="py-20 bg-[#F5EFE6]/20 border-t border-b border-[#F5EFE6]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-[#B76E3A]">Our Sovereign Values</span>
            <h2 className="text-3xl font-serif text-[#2F2F2F] mt-1">Five-Star Dining Standards</h2>
            <p className="text-xs text-gray-600 mt-3 leading-relaxed">
              We focus on absolute luxury in hospitality, curated cellar vintages, and a secure smart loyalty ledger designed to provide frequent diners with exclusive culinary benefits.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-8 rounded-3xl border border-[#F5EFE6] shadow-sm flex flex-col justify-between">
              <span className="text-3xl">🍷</span>
              <div className="mt-6">
                <h4 className="text-sm font-bold uppercase tracking-wider text-[#6D4C41]">Gourmet Cellar</h4>
                <p className="text-xs text-gray-500 mt-2 leading-relaxed">Over 250 verified high-grade heritage wines and craft high-ball sparklers curated by our head sommelier.</p>
              </div>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-[#F5EFE6] shadow-sm flex flex-col justify-between">
              <span className="text-3xl">🍳</span>
              <div className="mt-6">
                <h4 className="text-sm font-bold uppercase tracking-wider text-[#6D4C41]">Master Gastronomy</h4>
                <p className="text-xs text-gray-500 mt-2 leading-relaxed">Chefs trained in Tokyo, Paris, and ancient Lahore courts, bringing complex fusion recipes to life.</p>
              </div>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-[#F5EFE6] shadow-sm flex flex-col justify-between">
              <span className="text-3xl">🏆</span>
              <div className="mt-6">
                <h4 className="text-sm font-bold uppercase tracking-wider text-[#6D4C41]">Loyalty Program</h4>
                <p className="text-xs text-gray-500 mt-2 leading-relaxed">Earn elegant Gourmet Rewards XP on every booking deposit and online dining purchase, redeemable on free delicacies.</p>
              </div>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-[#F5EFE6] shadow-sm flex flex-col justify-between">
              <span className="text-3xl">🌿</span>
              <div className="mt-6">
                <h4 className="text-sm font-bold uppercase tracking-wider text-[#6D4C41]">Dietary Customizing</h4>
                <p className="text-xs text-gray-500 mt-2 leading-relaxed">Our AI Sommelier and gourmet kitchen customizes menus in real-time to adjust for allergies, gluten choices, or Halal, preserving absolute flavor.</p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 5. Customer Review Gastronomy Experiences */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-5 gap-12 items-center">
            
            <div className="lg:col-span-2 space-y-4">
              <span className="text-xs uppercase font-bold tracking-widest text-[#B76E3A]">Sovereign Critiques</span>
              <h2 className="text-3xl font-serif text-[#2F2F2F]">What Our Elite Diners Say</h2>
              <p className="text-xs text-gray-500 leading-relaxed">
                "Velvet Fork is where we turn small celebrations into core lifelong memories. Chef Tariq's Saffron Lamb Korma was purely transcendent."
              </p>
              <div className="flex items-center gap-2">
                <div className="flex text-amber-500">
                  <Star fill="#B76E3A" size={13} className="text-[#B76E3A]" />
                  <Star fill="#B76E3A" size={13} className="text-[#B76E3A]" />
                  <Star fill="#B76E3A" size={13} className="text-[#B76E3A]" />
                  <Star fill="#B76E3A" size={13} className="text-[#B76E3A]" />
                  <Star fill="#B76E3A" size={13} className="text-[#B76E3A]" />
                </div>
                <span className="text-xs font-bold text-[#6D4C41]">5.0 Overall Critic Rating</span>
              </div>
            </div>

            <div className="lg:col-span-3 grid sm:grid-cols-2 gap-6">
              {reviews.slice(0, 2).map((rev) => (
                <div key={rev.id} className="bg-white p-6 rounded-2xl border border-[#F5EFE6] shadow-sm flex flex-col justify-between h-52">
                  <Quote size={20} className="text-[#B76E3A] opacity-25" />
                  <p className="text-xs italic text-gray-700 leading-relaxed mt-2 line-clamp-4">
                    "{rev.comment}"
                  </p>
                  <div className="mt-4 pt-4 border-t border-[#F5EFE6] flex justify-between items-center">
                    <span className="text-xs font-bold text-[#6D4C41]">{rev.userName}</span>
                    <div className="flex text-amber-500">
                      {Array.from({ length: rev.rating }).map((_, i) => (
                        <Star key={i} fill="#B76E3A" size={10} className="text-[#B76E3A]" />
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* 6. Reservation Banner Invitation */}
      <section className="py-12 bg-gradient-to-r from-[#6D4C41] to-[#2F2F2F] text-[#FFFDF8] relative overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center mix-blend-overlay opacity-25" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=1200')" }} />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10 text-center space-y-6">
          <span className="text-[10px] tracking-[0.25em] font-sans font-black text-[#B76E3A] uppercase">Exclusive Booking Registry</span>
          <h2 className="text-3xl sm:text-4xl font-serif text-white">Ensure Your Table for Tonight's Degustation</h2>
          <p className="text-xs text-[#FFFDF8]/80 max-w-xl mx-auto">
            Event reservations require a premium refundable deposit or gourmet wallet credits. Guarantee your private event slots seamlessly with table select and custom instructions.
          </p>
          <div className="pt-2">
            <button 
              onClick={() => onViewChange('reservation')}
              className="px-8 py-3.5 bg-[#B76E3A] hover:bg-[#FFFDF8] hover:text-[#2F2F2F] text-xs font-bold uppercase tracking-wider text-white rounded-xl transition-all shadow-md transform hover:-translate-y-0.5 cursor-pointer"
            >
              Reserve a Royal Table Now
            </button>
          </div>
        </div>
      </section>

      {/* 7. Latest Gastronomic Stories & Blogs */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex justify-between items-end mb-12">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#B76E3A]">Chef Diaries</span>
              <h2 className="text-3xl font-serif text-[#2F2F2F] mt-1">Velvet Fork Chronicles</h2>
            </div>
            <button 
              onClick={() => onViewChange('blog')}
              className="flex items-center gap-1.2 text-xs font-bold uppercase tracking-widest text-[#B76E3A] hover:text-[#6D4C41]"
            >
              Browse All Stories <ChevronRight size={14} />
            </button>
          </div>

          <div className="grid sm:grid-cols-2 gap-8">
            {blogs.slice(0, 2).map((blog) => (
              <div 
                key={blog.id} 
                onClick={() => onViewChange('blog')} 
                className="bg-white border border-[#F5EFE6] rounded-3xl overflow-hidden shadow-sm hover:shadow-md cursor-pointer transition-all duration-300 group"
              >
                <div className="h-56 overflow-hidden relative">
                  <img src={blog.image} alt={blog.title} className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500" />
                  <span className="absolute bottom-4 left-4 px-2 py-0.5 bg-[#FFFDF8]/90 text-[9px] font-bold text-[#6D4C41] rounded uppercase tracking-wider">
                    {blog.tags[0]}
                  </span>
                </div>
                <div className="p-6">
                  <div className="flex gap-4 text-gray-400 text-[10px] font-bold uppercase tracking-wider mb-2">
                    <span>{blog.author}</span>
                    <span>&bull;</span>
                    <span>{blog.readTime}</span>
                  </div>
                  <h3 className="text-lg font-serif font-bold text-[#2F2F2F] group-hover:text-[#B76E3A] transition-colors">
                    {blog.title}
                  </h3>
                  <p className="text-xs text-gray-500 mt-2 line-clamp-2 leading-relaxed">
                    {blog.excerpt}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

    </div>
  );
}
