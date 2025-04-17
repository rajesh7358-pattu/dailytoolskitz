import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Save, Trash2, Edit2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { supabase, type Category, type Tool } from '../lib/supabase';

export default function AdminPanel() {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [tools, setTools] = useState<Tool[]>([]);
  const [editingTool, setEditingTool] = useState<Tool | null>(null);
  const [newTool, setNewTool] = useState<Partial<Tool>>({
    name: '',
    description: '',
    image: '',
    affiliate_link: '',
    price: '',
    features: [''],
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      fetchTools();
    } else {
      setTools([]);
    }
  }, [selectedCategory]);

  async function fetchCategories() {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');

      if (error) throw error;
      setCategories(data || []);

      // If there are categories but none selected, select the first one
      if (data && data.length > 0 && !selectedCategory) {
        setSelectedCategory(data[0].id);
      }
    } catch (error: any) {
      toast.error('Error loading categories');
      console.error('Error:', error.message);
    }
  }

  async function fetchTools() {
    if (!selectedCategory) return;

    try {
      const { data, error } = await supabase
        .from('tools')
        .select('*')
        .eq('category_id', selectedCategory)
        .order('name');

      if (error) throw error;
      setTools(data || []);
    } catch (error: any) {
      toast.error('Error loading tools');
      console.error('Error:', error.message);
    }
  }

  const handleSave = async () => {
    if (!selectedCategory) {
      toast.error('Please select a category first');
      return;
    }

    try {
      const toolData = {
        ...newTool,
        category_id: selectedCategory,
        features: newTool.features?.filter(f => f.trim() !== '') || [],
      };

      if (editingTool) {
        const { error } = await supabase
          .from('tools')
          .update(toolData)
          .eq('id', editingTool.id);

        if (error) throw error;
        toast.success('Tool updated successfully!');
      } else {
        const { error } = await supabase
          .from('tools')
          .insert([toolData]);

        if (error) throw error;
        toast.success('New tool added successfully!');
      }

      setEditingTool(null);
      setNewTool({
        name: '',
        description: '',
        image: '',
        affiliate_link: '',
        price: '',
        features: [''],
      });
      fetchTools();
    } catch (error: any) {
      toast.error('Error saving tool');
      console.error('Error:', error.message);
    }
  };

  const handleDelete = async (toolId: string) => {
    try {
      const { error } = await supabase
        .from('tools')
        .delete()
        .eq('id', toolId);

      if (error) throw error;
      toast.success('Tool deleted successfully!');
      fetchTools();
    } catch (error: any) {
      toast.error('Error deleting tool');
      console.error('Error:', error.message);
    }
  };

  const handleEdit = (tool: Tool) => {
    setEditingTool(tool);
    setNewTool({
      name: tool.name,
      description: tool.description,
      image: tool.image,
      affiliate_link: tool.affiliate_link,
      price: tool.price,
      features: [...(tool.features || []), ''],
    });
  };

  const addFeature = () => {
    setNewTool(prev => ({
      ...prev,
      features: [...(prev.features || []), ''],
    }));
  };

  const updateFeature = (index: number, value: string) => {
    const updatedFeatures = [...(newTool.features || [])];
    updatedFeatures[index] = value;
    setNewTool(prev => ({
      ...prev,
      features: updatedFeatures,
    }));
  };

  const removeFeature = (index: number) => {
    setNewTool(prev => ({
      ...prev,
      features: prev.features?.filter((_, i) => i !== index) || [],
    }));
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-4xl mx-auto space-y-8"
    >
      <h1 className="text-4xl font-bold text-gray-900">Admin Panel</h1>
      
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-semibold mb-4">Manage Tools</h2>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full rounded-lg border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
            >
              <option value="">Select a category...</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {selectedCategory && (
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-4">
                  {editingTool ? 'Edit Tool' : 'Add New Tool'}
                </h3>
                
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Tool Name"
                    value={newTool.name || ''}
                    onChange={(e) => setNewTool(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full rounded-lg border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
                  />
                  
                  <textarea
                    placeholder="Description"
                    value={newTool.description || ''}
                    onChange={(e) => setNewTool(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full rounded-lg border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
                    rows={3}
                  />
                  
                  <input
                    type="url"
                    placeholder="Image URL"
                    value={newTool.image || ''}
                    onChange={(e) => setNewTool(prev => ({ ...prev, image: e.target.value }))}
                    className="w-full rounded-lg border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
                  />
                  
                  <input
                    type="url"
                    placeholder="Affiliate Link"
                    value={newTool.affiliate_link || ''}
                    onChange={(e) => setNewTool(prev => ({ ...prev, affiliate_link: e.target.value }))}
                    className="w-full rounded-lg border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
                  />
                  
                  <input
                    type="text"
                    placeholder="Price"
                    value={newTool.price || ''}
                    onChange={(e) => setNewTool(prev => ({ ...prev, price: e.target.value }))}
                    className="w-full rounded-lg border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
                  />
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Features
                    </label>
                    {newTool.features?.map((feature, index) => (
                      <div key={index} className="flex gap-2">
                        <input
                          type="text"
                          placeholder={`Feature ${index + 1}`}
                          value={feature}
                          onChange={(e) => updateFeature(index, e.target.value)}
                          className="flex-1 rounded-lg border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
                        />
                        <button
                          onClick={() => removeFeature(index)}
                          className="p-2 text-red-600 hover:text-red-700 transition-colors"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={addFeature}
                      className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Feature
                    </button>
                  </div>
                  
                  <button
                    onClick={handleSave}
                    className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Save className="h-5 w-5 mr-2" />
                    {editingTool ? 'Update Tool' : 'Add Tool'}
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Existing Tools</h3>
                {tools.length === 0 ? (
                  <p className="text-gray-600">No tools found in this category. Add your first tool above!</p>
                ) : (
                  tools.map(tool => (
                    <div
                      key={tool.id}
                      className="bg-white rounded-lg border p-4 flex items-center justify-between"
                    >
                      <div>
                        <h4 className="font-semibold">{tool.name}</h4>
                        <p className="text-gray-600">{tool.price}</p>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(tool)}
                          className="p-2 text-blue-600 hover:text-blue-700 transition-colors"
                        >
                          <Edit2 className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(tool.id)}
                          className="p-2 text-red-600 hover:text-red-700 transition-colors"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}