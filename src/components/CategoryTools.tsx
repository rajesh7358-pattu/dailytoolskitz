import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Download, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase, type Tool } from '../lib/supabase';
import toast from 'react-hot-toast';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const item = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1 },
};

export default function CategoryTools() {
  const { categoryId } = useParams();
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (categoryId) {
      fetchTools();
    }
  }, [categoryId]);

  async function fetchTools() {
    try {
      const { data, error } = await supabase
        .from('tools')
        .select('*')
        .eq('category_id', categoryId)
        .order('name');

      if (error) throw error;

      if (!data || data.length === 0) {
        // Add some default tools if none exist
        const defaultTools = [
          {
            category_id: categoryId,
            name: 'Sample Tool',
            description: 'This is a sample tool description',
            image: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?auto=format&fit=crop&q=80&w=1000',
            affiliate_link: 'https://example.com',
            price: 'Free',
            features: ['Feature 1', 'Feature 2', 'Feature 3']
          }
        ];

        const { error: insertError } = await supabase
          .from('tools')
          .insert(defaultTools);

        if (insertError) throw insertError;

        setTools(defaultTools as Tool[]);
      } else {
        setTools(data);
      }
    } catch (error: any) {
      toast.error('Error loading tools');
      console.error('Error:', error.message);
    } finally {
      setLoading(false);
    }
  }

  const handleDownload = (affiliateLink: string) => {
    window.open(affiliateLink, '_blank');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      <div className="flex items-center space-x-4 mb-8">
        <Link
          to="/"
          className="inline-flex items-center text-blue-600 hover:text-blue-700 transition-colors"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Categories
        </Link>
      </div>
      
      <h2 className="text-4xl font-bold text-gray-900 mb-4 capitalize">
        {categoryId?.replace('-', ' ')} Tools
      </h2>
      
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 gap-8"
      >
        {tools.map((tool) => (
          <motion.div
            key={tool.id}
            variants={item}
            className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-2xl"
          >
            <div className="relative">
              <img
                src={tool.image}
                alt={tool.name}
                className="w-full h-56 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            </div>
            <div className="p-8">
              <h3 className="text-2xl font-semibold text-gray-900 mb-3">
                {tool.name}
              </h3>
              <p className="text-gray-600 text-lg mb-6">{tool.description}</p>
              <div className="mb-6">
                <div className="flex flex-wrap gap-2">
                  {tool.features?.map((feature, index) => (
                    <span
                      key={index}
                      className="bg-blue-100 text-blue-800 text-sm font-medium px-4 py-2 rounded-full"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xl font-semibold text-gray-900">
                  {tool.price}
                </span>
                <button
                  onClick={() => handleDownload(tool.affiliate_link)}
                  className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors transform hover:scale-105 duration-200"
                >
                  <Download className="h-5 w-5 mr-2" />
                  Download Now
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}