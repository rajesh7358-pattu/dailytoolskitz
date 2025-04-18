import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Video, BrainCircuit, Code, HeartPulse, Megaphone, Music, BookOpen, DollarSign, Palette, Camera, LineChart, Gamepad, Book, Cloud, Coffee, Brush, Smartphone } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase, type Category } from '../lib/supabase';
import toast from 'react-hot-toast';

const iconMap: { [key: string]: any } = {
  Video, BrainCircuit, Code, Music, HeartPulse, Megaphone, BookOpen, DollarSign, Palette, Camera, LineChart,
  Gamepad, Book, Cloud, Coffee, Brush, Smartphone
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
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
      className="py-12"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-4">
            Find the Perfect Tools
          </h1>
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
            Discover and download the best software tools for your creative and professional needs
          </p>
        </div>
        
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {categories.map((category) => {
            const Icon = iconMap[category.icon] || Code;
            const gradientClass = category.gradient || 'from-blue-500 to-blue-700';
            
            return (
              <motion.div key={category.id} variants={item}>
                <Link
                  to={`/category/${category.id}`}
                  className="block group h-full"
                >
                  <div className="bg-white rounded-2xl shadow-xl overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-2xl h-full">
                    <div className="relative h-48">
                      <img
                        src={category.image}
                        alt={category.name}
                        className="w-full h-full object-cover"
                      />
                      <div className={`absolute inset-0 bg-gradient-to-br ${gradientClass} opacity-90`} />
                      <Icon 
                        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-16 w-16 text-white opacity-90"
                        style={{ color: category.color || '#ffffff' }}
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="text-2xl font-bold mb-3 group-hover:text-blue-600 transition-colors">
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
      </div>
    </motion.div>
  );
}
