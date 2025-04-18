import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BrainCircuit, Video, Code, Music, Palette, Camera, DollarSign, BookOpen, LineChart, Megaphone, Gamepad, Book, Cloud, Coffee, Brush, Smartphone, Search, HeartPulse } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase, type Category } from '../lib/supabase';
import toast from 'react-hot-toast';

const iconMap: { [key: string]: any } = {
  BrainCircuit, Video, Code, Music, Palette, Camera, LineChart,BookOpen, DollarSign, Megaphone,
  Gamepad, Book, Cloud, Coffee, Brush, Smartphone, HeartPulse
};

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1 },
};

export default function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  async function fetchCategories() {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');

      if (error) throw error;
      
      setCategories(data || []);
    } catch (error: any) {
      toast.error('Error loading categories');
      console.error('Error:', error.message);
    } finally {
      setLoading(false);
    }
  }

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    category.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-600"></div>
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center px-4">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">No Categories Available</h1>
        <p className="text-xl text-gray-600 max-w-2xl">
          Please check back later when our administrators have added categories.
        </p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen py-16 bg-gradient-to-br from-gray-50 via-white to-blue-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 mb-6 leading-tight">
            Discover Amazing Tools
          </h1>
          <p className="text-2xl text-gray-600 mb-12 max-w-3xl mx-auto font-light leading-relaxed">
            Find and explore the perfect software tools to enhance your creative and professional workflow
          </p>
          
          <div className="max-w-2xl mx-auto relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl blur-lg opacity-20 transform -rotate-1"></div>
            <div className="relative bg-white rounded-xl shadow-sm border border-gray-100">
              <input
                type="text"
                placeholder="Search for tools..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-6 py-4 pl-14 rounded-xl bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all text-lg"
              />
              <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400 h-6 w-6" />
            </div>
          </div>
        </div>
        
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {filteredCategories.map((category) => {
            const Icon = iconMap[category.icon] || Code;
            
            return (
              <motion.div key={category.id} variants={item}>
                <Link
                  to={`/category/${category.id}`}
                  className="block group h-full"
                >
                  <div className="relative bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 h-full">
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-900/80 to-gray-900/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="relative h-48">
                      <img
                        src={category.image}
                        alt={category.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                      <Icon 
                        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-16 w-16 text-white opacity-90 drop-shadow-lg transition-transform duration-300 group-hover:scale-110"
                      />
                    </div>
                    <div className="p-8">
                      <h3 className="text-2xl font-bold mb-3 text-gray-900 group-hover:text-blue-600 transition-colors">
                        {category.name}
                      </h3>
                      <p className="text-gray-600 text-lg leading-relaxed">
                        {category.description}
                      </p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
        
        {filteredCategories.length === 0 && (
          <div className="text-center mt-12 bg-white rounded-xl p-8 shadow-sm border border-gray-100">
            <p className="text-xl text-gray-600">No categories found matching your search.</p>
            <button 
              onClick={() => setSearchQuery('')}
              className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
            >
              Clear search
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}
