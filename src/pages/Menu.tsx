/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Search, 
  Sparkles, 
  SlidersHorizontal, 
  Heart, 
  ShoppingBag, 
  Star, 
  Clock, 
  X, 
  Plus, 
  Minus, 
  Flame,
  Check,
  ChevronRight
} from 'lucide-react';
import { MenuItem, Review } from '../types';

interface MenuProps {
  menuItems: MenuItem[];
  reviews: Review[];
  wishlist: string[];
  onToggleWishlist: (itemId: string) => void;
  onAddToCart: (item: MenuItem, quantity: number) => void;
  onAddReview: (menuItemId: string, rating: number, comment: string) => void;
  currentUser: any;
}

export default function Menu({ 
  menuItems, 
  reviews, 
  wishlist, 
  onToggleWishlist, 
  onAddToCart,
  onAddReview,
  currentUser
}: MenuProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedTag, setSelectedTag] = useState('All');
  const [sortBy, setSortBy] = useState('rating-desc');
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  
  // Detail Modal specific states
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [orderQty, setOrderQty] = useState(1);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [successToast, setSuccessToast] = useState('');

  const categories = ['All', 'Starters', 'Pizza', 'Burgers', 'BBQ', 'Pakistani Food', 'Pasta', 'Seafood', 'Desserts', 'Drinks'];
  const filterTags = ['All', 'Chef Choice', 'Gluten Free', 'Vegan', 'Best Seller'];

  // 1. Filter and sorting logic
  const filteredItems = menuItems
    .filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            item.ingredients.some(ing => ing.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
      const matchesTag = selectedTag === 'All' || item.tags.includes(selectedTag);
      return matchesSearch && matchesCategory && matchesTag;
    })
    .sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'rating-desc') return b.rating - a.rating;
      return 0;
    });

  const triggerToast = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(''), 3000);
  };

  const handleOpenDetailModal = (item: MenuItem) => {
    setSelectedItem(item);
    setSelectedImageIndex(0);
    setOrderQty(1);
    setNewComment('');
  };

  const handlePostReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      triggerToast("Please login or sign in to write five-star reviews.");
      return;
    }
    if (!newComment.trim()) return;
    if (selectedItem) {
      onAddReview(selectedItem.id, newRating, newComment);
      setNewComment('');
      triggerToast("Thank you! Your critique has been recorded.");
    }
  };

  return (
    <div className="bg-[#FFFDF8] min-h-screen py-8 sm:py-12 relative">
      
      {/* Toast Alert overlay */}
      {successToast && (
        <div className="fixed top-24 left-1/2 transform -translate-x-1/2 z-50 bg-[#6D4C41] text-white px-6 py-3 rounded-full flex items-center gap-2 shadow-2xl border border-[#B76E3A]/20 animate-fade-in text-xs font-bold tracking-wider uppercase">
          <Sparkles size={14} className="text-[#B76E3A]" />
          <span>{successToast}</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Introduction */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
          <span className="inline-flex items-center gap-1 text-xs font-bold tracking-[0.25em] text-[#B76E3A] uppercase">
            👑 EXQUISITE MENU SELECTIONS
          </span>
          <h1 className="text-3xl sm:text-5xl font-serif text-[#2F2F2F] mt-2">Gastronomic Collections</h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-3 leading-relaxed">
            Every masterpiece of our kitchen is designed to order by our Michelin-accredited culinary teams. Sort by price or filter by active dietary tags below to formulate your bespoke meal structure.
          </p>
        </div>

        {/* Filter Controls Row */}
        <div className="space-y-6 bg-white p-6 sm:p-8 rounded-[32px] border border-[#F5EFE6] shadow-sm mb-12">
          
          <div className="grid md:grid-cols-12 gap-4 items-center">
            
            {/* Search Input */}
            <div className="md:col-span-5 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input 
                type="text" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search recipe, ingredients, culinary style..."
                className="w-full pl-11 pr-4 py-3 bg-[#FFFDF8] border border-[#F5EFE6] rounded-xl text-xs placeholder-gray-400 font-medium focus:outline-none focus:border-[#B76E3A]"
              />
            </div>

            {/* Sorting Choice */}
            <div className="md:col-span-4 flex items-center gap-2">
              <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider whitespace-nowrap">Sort By:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-3 bg-[#FFFDF8] border border-[#F5EFE6] rounded-xl text-xs font-semibold text-[#6D4C41] focus:outline-none focus:border-[#B76E3A]"
              >
                <option value="rating-desc">Michelin Assessment (Top Rated)</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>

            {/* Dietary Preference quick selector */}
            <div className="md:col-span-3 flex items-center gap-2">
              <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider whitespace-nowrap">Type:</span>
              <div className="flex gap-1 w-full">
                {filterTags.slice(0, 4).map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setSelectedTag(tag === selectedTag ? 'All' : tag)}
                    className={`flex-1 py-2 text-[10px] font-bold rounded-lg border uppercase tracking-wider transition-all cursor-pointer ${
                      selectedTag === tag 
                        ? 'bg-[#B76E3A]/10 border-[#B76E3A] text-[#B76E3A]' 
                        : 'bg-transparent border-[#F5EFE6] text-[#6D4C41] hover:bg-[#F5EFE6]'
                    }`}
                  >
                    {tag === 'All' ? 'Mixed' : tag.split(' ')[0]}
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Dynamic Categories Scrollbar */}
          <div className="border-t border-[#F5EFE6] pt-6 overflow-x-auto flex gap-2 scrollbar-none pb-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all duration-200 cursor-pointer whitespace-nowrap ${
                  selectedCategory === cat 
                    ? 'bg-[#6D4C41] text-white shadow-md' 
                    : 'bg-[#FFFDF8] border border-[#F5EFE6] text-[#6D4C41] hover:bg-[#F5EFE6]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

        </div>

        {/* Dynamic Items Counter */}
        <div className="flex justify-between items-center mb-6">
          <span className="text-xs font-bold text-[#6D4C41] uppercase tracking-wider">
            Displaying {filteredItems.length} Gastronomic Masterpieces
          </span>
          {searchTerm && (
            <button 
              onClick={() => { setSearchTerm(''); setSelectedCategory('All'); setSelectedTag('All'); }}
              className="text-xs text-[#B76E3A] font-bold uppercase hover:underline"
            >
              Reset Filters
            </button>
          )}
        </div>

        {/* Empty State */}
        {filteredItems.length === 0 && (
          <div className="bg-white rounded-[32px] border border-[#F5EFE6] p-16 text-center space-y-4 max-w-xl mx-auto">
            <span className="text-4xl">🧑‍🍳</span>
            <h3 className="text-lg font-serif font-black text-[#2F2F2F]">Cellar Secrets Concealed</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              We couldn't locate any dining options corresponding to "{searchTerm}". Try broadening your category parameters or write to our Head Sommelier for customized adjustments.
            </p>
          </div>
        )}

        {/* Dish Menu Grid listing */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map((item) => {
            const isWishlisted = wishlist.includes(item.id);
            return (
              <div 
                key={item.id}
                className="bg-white rounded-[36px] border border-[#F5EFE6] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col justify-between"
              >
                
                {/* Visual Area */}
                <div 
                  className="relative h-64 bg-gray-100 overflow-hidden cursor-pointer"
                  onClick={() => handleOpenDetailModal(item)}
                >
                  <img 
                    src={item.images[0]} 
                    alt={item.name} 
                    className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                    <span className="text-xs font-bold text-white uppercase tracking-widest flex items-center gap-1">
                      Explore Plum Plating <ChevronRight size={12} />
                    </span>
                  </div>

                  {/* Header tags inside image */}
                  <div className="absolute top-4 left-4 flex flex-col gap-1 z-10">
                    {item.tags.map((tag, idx) => (
                      <span key={idx} className="bg-[#FFFDF8]/90 text-[9px] font-bold text-[#6D4C41] px-2 py-0.5 rounded shadow-sm uppercase tracking-wider">
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Wishlist favorite button overlay */}
                  <button 
                    onClick={(e) => { e.stopPropagation(); onToggleWishlist(item.id); }}
                    className="absolute top-4 right-4 p-2.5 bg-[#FFFDF8]/90 backdrop-blur-sm rounded-full text-[#B76E3A] cursor-pointer shadow-md hover:scale-110 active:scale-95 transition-all z-10 border border-[#F5EFE6]"
                  >
                    <Heart size={14} fill={isWishlisted ? "#B76E3A" : "none"} />
                  </button>
                </div>

                {/* Narrative Plating Content */}
                <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex justify-between items-center text-gray-500 text-[10px] uppercase font-bold tracking-widest">
                      <span>{item.category}</span>
                      <span className="flex items-center gap-0.5 text-[#B76E3A] font-mono"><Clock size={11} /> {item.prepTime}</span>
                    </div>

                    <h3 
                      className="text-lg font-serif font-bold text-[#2F2F2F] mt-2 group-hover:text-[#B76E3A] cursor-pointer transition-colors line-clamp-1"
                      onClick={() => handleOpenDetailModal(item)}
                    >
                      {item.name}
                    </h3>
                    <p className="text-xs text-gray-600 mt-2 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                    
                    {/* Basic Ingredients snippet */}
                    <div className="flex flex-wrap gap-1 mt-3">
                      {item.ingredients.slice(0, 3).map((ing, i) => (
                        <span key={i} className="text-[9px] bg-[#F5EFE6]/60 text-[#6D4C41] px-2 py-0.5 rounded-md font-medium">
                          {ing}
                        </span>
                      ))}
                      {item.ingredients.length > 3 && (
                        <span className="text-[8px] text-gray-400 font-bold self-center">+ {item.ingredients.length - 3} more</span>
                      )}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-[#F5EFE6] flex justify-between items-center">
                    <div className="flex flex-col">
                      <span className="text-xl font-mono font-bold text-[#6D4C41]">${item.price.toFixed(2)}</span>
                      <div className="flex items-center gap-0.5 text-amber-500 mt-0.5">
                        <Star size={10} fill="#B76E3A" className="text-[#B76E3A]" />
                        <span className="text-[10px] font-bold text-gray-600">{item.rating} Rating</span>
                      </div>
                    </div>
                    
                    <button 
                      onClick={() => { onAddToCart(item, 1); triggerToast(`${item.name} added to cart`); }}
                      className="px-4 py-2.5 bg-[#6D4C41] hover:bg-[#B76E3A] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
                    >
                      <ShoppingBag size={13} />
                      <span>Order</span>
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

      </div>

      {/* 5-STAR RECIPE DETAIL MODAL DISPLAY */}
      {selectedItem && (
        <div className="fixed inset-0 bg-[#2F2F2F]/60 backdrop-blur-md z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <div className="bg-[#FFFDF8] w-full max-w-4xl rounded-[40px] shadow-2xl border border-[#F5EFE6] overflow-hidden flex flex-col md:flex-row relative animate-fade-in max-h-[90vh]">
            
            {/* Close trigger */}
            <button 
              onClick={() => setSelectedItem(null)}
              className="absolute top-5 right-5 z-20 p-2.5 bg-white/80 hover:bg-white rounded-full shadow-md text-[#2F2F2F] cursor-pointer"
            >
              <X size={18} />
            </button>

            {/* Left Image Section */}
            <div className="md:w-1/2 bg-gray-100 flex flex-col relative h-full min-h-[300px]">
              
              {/* Dynamic Image Canvas */}
              <div className="flex-1 overflow-hidden relative">
                <img 
                  src={selectedItem.images[selectedImageIndex] || selectedItem.images[0]} 
                  alt={selectedItem.name} 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                
                {/* Gold decoration */}
                <div className="absolute top-4 left-4 bg-[#B76E3A] text-white text-[9px] font-bold uppercase tracking-widest px-3 py-1 rounded-full shadow">
                  Plating Variant {selectedImageIndex + 1}
                </div>
              </div>

              {/* Multi-Image thumbnails row (simulating rich food photography) */}
              <div className="p-4 bg-white/90 border-t border-[#F5EFE6] flex gap-2">
                {/* Main image */}
                <div 
                  onClick={() => setSelectedImageIndex(0)}
                  className={`w-16 h-12 rounded-lg bg-gray-200 overflow-hidden cursor-pointer border-2 transition-all ${selectedImageIndex === 0 ? 'border-[#B76E3A] scale-102' : 'border-transparent opacity-70'}`}
                >
                  <img src={selectedItem.images[0]} alt="View 1" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
                {/* Plating alternative mock 2 */}
                <div 
                  onClick={() => setSelectedImageIndex(1)}
                  className={`w-16 h-12 rounded-lg bg-gray-200 overflow-hidden cursor-pointer border-2 transition-all ${selectedImageIndex === 1 ? 'border-[#B76E3A] scale-102' : 'border-transparent opacity-70'}`}
                >
                  <img src="https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=600" alt="Plating 2" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
                {/* Plating alternative mock 3 */}
                <div 
                  onClick={() => setSelectedImageIndex(2)}
                  className={`w-16 h-12 rounded-lg bg-gray-200 overflow-hidden cursor-pointer border-2 transition-all ${selectedImageIndex === 2 ? 'border-[#B76E3A] scale-102' : 'border-transparent opacity-70'}`}
                >
                  <img src="https://images.unsplash.com/photo-1532636875304-0c8fe119fa9e?auto=format&fit=crop&q=80&w=600" alt="Preparation closeup" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
              </div>

            </div>

            {/* Right Details narrative */}
            <div className="md:w-1/2 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto h-full max-h-[85vh]">
              
              <div className="space-y-6">
                <div>
                  <span className="text-[9px] font-bold tracking-[0.2em] text-[#B76E3A] uppercase block">
                    {selectedItem.category} &bull; PLATING PLUM
                  </span>
                  <h2 className="text-2xl font-serif font-black text-[#2F2F2F] mt-1">{selectedItem.name}</h2>
                  <p className="text-xs text-gray-600 leading-relaxed mt-2">{selectedItem.description}</p>
                </div>

                {/* Interactive Ingredient Listing */}
                <div>
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#6D4C41]">Gourmet Ingredients</h4>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {selectedItem.ingredients.map((ing, i) => (
                      <span key={i} className="px-2.5 py-1 bg-[#F5EFE6]/50 border border-[#F5EFE6] text-[10px] font-bold text-[#6D4C41] rounded-lg">
                        {ing}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Structural Nutritional Info */}
                <div className="p-4 bg-[#F5EFE6]/40 border border-[#F5EFE6] rounded-2xl">
                  <h4 className="text-[9px] font-bold uppercase tracking-widest text-[#6D4C41] mb-2.5">Macro-Nutritional Value</h4>
                  <div className="grid grid-cols-4 gap-2 text-center">
                    <div className="p-2 bg-white rounded-lg">
                      <span className="text-[11px] font-mono text-[#B76E3A] font-bold block">{selectedItem.nutritionalInfo.calories}</span>
                      <span className="text-[8px] uppercase text-gray-400 font-bold">Calories</span>
                    </div>
                    <div className="p-2 bg-white rounded-lg">
                      <span className="text-[11px] font-mono text-[#B76E3A] font-bold block">{selectedItem.nutritionalInfo.protein}</span>
                      <span className="text-[8px] uppercase text-gray-400 font-bold">Protein</span>
                    </div>
                    <div className="p-2 bg-white rounded-lg">
                      <span className="text-[11px] font-mono text-[#B76E3A] font-bold block">{selectedItem.nutritionalInfo.carbs}</span>
                      <span className="text-[8px] uppercase text-gray-400 font-bold">Carbs</span>
                    </div>
                    <div className="p-2 bg-white rounded-lg">
                      <span className="text-[11px] font-mono text-[#B76E3A] font-bold block">{selectedItem.nutritionalInfo.fat}</span>
                      <span className="text-[8px] uppercase text-gray-400 font-bold">Fat</span>
                    </div>
                  </div>
                </div>

                {/* Specific Gourmet Reviews Section */}
                <div className="border-t border-[#F5EFE6] pt-5">
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#6D4C41] mb-3">Verified Critic Accolades</h4>
                  <div className="space-y-3 max-h-36 overflow-y-auto pr-1">
                    {reviews.filter(r => r.menuItemId === selectedItem.id).length === 0 ? (
                      <p className="text-[11px] text-gray-400 italic">No formal critique written for this recipe yet. Be the first to publish.</p>
                    ) : (
                      reviews.filter(r => r.menuItemId === selectedItem.id).map((rev) => (
                        <div key={rev.id} className="p-3 bg-[#FFFDF8] border border-[#F5EFE6] rounded-xl text-xs space-y-1">
                          <div className="flex justify-between items-center text-[10px] font-bold text-[#6D4C41]">
                            <span>{rev.userName}</span>
                            <div className="flex text-amber-500">
                              {Array.from({ length: rev.rating }).map((_, rIdx) => (
                                <Star key={rIdx} fill="#B76E3A" size={9} className="text-[#B76E3A]" />
                              ))}
                            </div>
                          </div>
                          <p className="text-[11px] text-gray-500 italic mt-1 leading-snug">"{rev.comment}"</p>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Add Review Critic Form */}
                  <form onSubmit={handlePostReview} className="mt-4 pt-4 border-t border-[#F5EFE6] space-y-2.5">
                    <div className="flex justify-between items-center">
                      <span className="text-[9px] font-bold text-[#6D4C41] uppercase tracking-wider">Leave Recipe Critique</span>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((starVal) => (
                          <Star 
                            key={starVal} 
                            size={12} 
                            onClick={() => setNewRating(starVal)}
                            className="cursor-pointer"
                            fill={starVal <= newRating ? "#B76E3A" : "none"}
                            color="#B76E3A"
                          />
                        ))}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder={currentUser ? "Elegant comments on presentation..." : "Please login to write reviews..."}
                        disabled={!currentUser}
                        className="flex-1 px-3 py-2 bg-white border border-[#F5EFE6] rounded-xl text-xs placeholder-gray-400 focus:outline-none"
                      />
                      <button 
                        type="submit" 
                        disabled={!currentUser || !newComment.trim()}
                        className="px-4 py-2 bg-[#B76E3A] hover:bg-[#6D4C41] disabled:bg-gray-200 text-white rounded-xl text-[10px] font-bold uppercase tracking-wider"
                      >
                        Publish
                      </button>
                    </div>
                  </form>
                </div>

              </div>

              {/* Detail Pricing & Counter Action */}
              <div className="pt-6 mt-6 border-t border-[#F5EFE6] flex items-center justify-between gap-4">
                <div className="flex flex-col">
                  <span className="text-[10px] text-gray-400 uppercase font-black">Gastronomical Price</span>
                  <span className="text-2xl font-mono font-bold text-[#6D4C41]">${(selectedItem.price * orderQty).toFixed(2)}</span>
                </div>

                <div className="flex items-center gap-3">
                  {/* Quantity incrementor */}
                  <div className="flex items-center border border-[#F5EFE6] bg-white rounded-xl overflow-hidden shadow-sm">
                    <button 
                      onClick={() => setOrderQty(Math.max(1, orderQty - 1))}
                      className="p-2.5 hover:bg-[#F5EFE6] text-[#6D4C41] active:scale-95 transition-all"
                    >
                      <Minus size={12} />
                    </button>
                    <span className="px-4 text-xs font-bold text-[#6D4C41] font-mono">{orderQty}</span>
                    <button 
                      onClick={() => setOrderQty(orderQty + 1)}
                      className="p-2.5 hover:bg-[#F5EFE6] text-[#6D4C41] active:scale-95 transition-all"
                    >
                      <Plus size={12} />
                    </button>
                  </div>

                  <button 
                    onClick={() => {
                      onAddToCart(selectedItem, orderQty);
                      setSelectedItem(null);
                      triggerToast(`${orderQty}x ${selectedItem.name} added to cart`);
                    }}
                    className="flex-1 px-6 py-3.5 bg-[#B76E3A] hover:bg-[#6D4C41] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
                  >
                    <ShoppingBag size={14} />
                    <span>Purchase Selection</span>
                  </button>
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}
