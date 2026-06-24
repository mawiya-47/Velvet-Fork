/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Feather, Calendar, Clock, ChevronRight, X, Sparkles, BookOpen } from 'lucide-react';
import { Blog } from '../types';

interface BlogListProps {
  blogs: Blog[];
}

export default function BlogList({ blogs }: BlogListProps) {
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);

  return (
    <div className="bg-[#FFFDF8] min-h-screen py-10 sm:py-16 text-xs font-semibold">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Introduction */}
        <div className="text-center max-w-xl mx-auto mb-16">
          <span className="text-xs uppercase font-bold tracking-[0.25em] text-[#B76E3A]">MICHELIN CHRONICLES</span>
          <h1 className="text-3xl sm:text-5xl font-serif text-[#2F2F2F] mt-1">Velvet Fork Chronicles</h1>
          <p className="text-xs text-gray-500 mt-2">
            Explore editorial culinary records compiled directly by our head chefs, wine sommeliers, and molecular biologists.
          </p>
        </div>

        {/* Stories Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map((blog) => (
            <div 
              key={blog.id}
              onClick={() => setSelectedBlog(blog)}
              className="bg-white border border-[#F5EFE6] rounded-[36px] overflow-hidden shadow-sm hover:shadow-lg hover:border-[#B76E3A]/20 cursor-pointer transition-all duration-300 group flex flex-col justify-between"
            >
              <div className="h-64 h-56 relative bg-gray-100 overflow-hidden">
                <img 
                  src={blog.image} 
                  alt={blog.title} 
                  className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute bottom-4 left-4 px-2.5 py-1 bg-[#FFFDF8]/90 text-[9px] font-bold text-[#6D4C41] rounded-lg shadow-xs uppercase tracking-wider">
                  {blog.tags[0]}
                </span>
              </div>

              <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex gap-3 text-gray-400 text-[10px] font-bold uppercase tracking-wider mb-2">
                    <span>{blog.author}</span>
                    <span>&bull;</span>
                    <span>{blog.readTime}</span>
                  </div>
                  <h3 className="text-lg font-serif font-bold text-[#2F2F2F] group-hover:text-[#B76E3A] transition-colors leading-snug line-clamp-2">
                    {blog.title}
                  </h3>
                  <p className="text-xs text-gray-600 mt-2 leading-relaxed line-clamp-3">
                    {blog.excerpt}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#F5EFE6] flex justify-between items-center">
                  <span className="text-[10px] text-[#B76E3A] font-bold uppercase tracking-widest flex items-center gap-1">
                    Read editorial article <ChevronRight size={13} />
                  </span>
                  <span className="text-[9px] text-gray-400">{new Date(blog.date).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* FULL BLOG TEXT READ POPUP DIALOG */}
      {selectedBlog && (
        <div className="fixed inset-0 bg-[#2F2F2F]/60 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#FFFDF8] w-full max-w-3xl rounded-[40px] shadow-2xl border border-[#F5EFE6] overflow-hidden flex flex-col relative animate-fade-in max-h-[85vh]">
            
            {/* Close */}
            <button 
              onClick={() => setSelectedBlog(null)}
              className="absolute top-5 right-5 z-25 p-2 bg-white/90 hover:bg-white rounded-full shadow text-[#2F2F2F] cursor-pointer"
            >
              <X size={18} />
            </button>

            {/* Editorial Header Banner */}
            <div className="h-64 relative bg-gray-100 shrink-0">
              <img src={selectedBlog.image} alt={selectedBlog.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              
              <div className="absolute bottom-6 left-6 right-6 text-white space-y-2">
                <span className="px-2.5 py-1 bg-[#B76E3A] text-white text-[9px] font-bold uppercase tracking-widest rounded-full">
                  {selectedBlog.tags.join(' &bull; ')}
                </span>
                <h2 className="text-2xl sm:text-3xl font-serif text-white font-bold leading-tight">{selectedBlog.title}</h2>
              </div>
            </div>

            {/* Article Content body scrolling */}
            <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
              
              {/* Writer metadata */}
              <div className="flex justify-between items-center pb-4 border-b border-[#F5EFE6] text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                <div className="flex items-center gap-2">
                  <Feather size={14} className="text-[#B76E3A]" />
                  <span>Authored by <strong className="text-[#6D4C41]">{selectedBlog.author}</strong></span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-0.5"><Clock size={12} /> {selectedBlog.readTime}</span>
                  <span>&bull;</span>
                  <span> {new Date(selectedBlog.date).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Rich Blog post simulation */}
              <div className="text-xs text-gray-700 leading-relaxed font-medium space-y-4">
                <p className="text-sm font-semibold text-[#6D4C41] italic bg-[#F5EFE6]/30 p-4 border-l-4 border-[#B76E3A] rounded-r-lg">
                  "{selectedBlog.excerpt}"
                </p>
                <p>
                  At Velvet Fork, every ingredient carries a passport of sustainability. When selecting the grade of Australian Lamb Chops or the exact soil profiles for local Saffron cultivation, our kitchen treats biodiversity as secondary to flavor. Gastronomy is science married to sensory poetry.
                </p>
                <blockquote className="my-4 p-4 text-center border-t border-b border-[#F5EFE6] font-serif text-base italic text-[#B76E3A]">
                  "Plating is not decoration; it is the physical architecture of anticipation."
                </blockquote>
                <p>
                  We recommend pairing our major saffron main courses with select dry Chardonnays, which elevate the botanical properties of the plate without masking the delicate meat juices. Consult our interactive AI Sommelier companion inside the shopping console for bespoke wine bottle selections.
                </p>
              </div>

            </div>

            {/* Footer action */}
            <div className="p-5 border-t border-[#F5EFE6] text-center bg-[#F5EFE6]/10 shrink-0">
              <button 
                onClick={() => setSelectedBlog(null)}
                className="px-6 py-2 bg-[#6D4C41] hover:bg-[#B76E3A] text-white font-bold text-[10px] uppercase tracking-widest rounded-xl"
              >
                End Editorial Reading
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
