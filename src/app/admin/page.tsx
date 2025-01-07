'use client'

import React, { useState, useEffect } from 'react';
import { PlusCircle, Edit, Trash2, Save, X, Search, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { v4 as uuidv4 } from 'uuid';
import { DynamoDB } from 'aws-sdk';

// Initialize DynamoDB client
const dynamoDB = new DynamoDB.DocumentClient({
  accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY,
  region: process.env.NEXT_PUBLIC_AWS_REGION,
});

type ItemType = 'paper' | 'video' | 'course' | 'tool' | 'community' | 'challenge';

interface LearningItem {
  id: string;
  title: string;
  type: ItemType;
  description: string;
  link: string;
  area: string;
  content?: string;
}

const AI_SAFETY_AREAS = [
  "AI Safety Foundations",
  "Reinforcement Learning from Human (or AI) Feedback",
  "Scalable Oversight",
  "Robustness, Unlearning and Control",
  "Mechanistic Interpretability",
  "Technical Governance Approaches",
  "AI Alignment Theory",
  "Value Learning and Specification",
  "AI Containment and Cybersecurity",
  "Cooperative AI and Multi-Agent Systems"
];

const AdminDashboard: React.FC = () => {
  const [items, setItems] = useState<LearningItem[]>([]);
  const [editingItem, setEditingItem] = useState<LearningItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<ItemType | null>(null);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    setIsLoading(true);
    try {
      const params = {
        TableName: 'AISafetyContent',
      };
      const result = await dynamoDB.scan(params).promise();
      setItems(result.Items as LearningItem[]);
    } catch (err) {
      setError('Failed to fetch items');
      console.error(err);
    }
    setIsLoading(false);
  };

  const saveItem = async (item: LearningItem) => {
    try {
      const params = {
        TableName: 'AISafetyContent',
        Item: item,
      };
      await dynamoDB.put(params).promise();
      setItems(prevItems =>
        item.id ? prevItems.map(i => i.id === item.id ? item : i) : [...prevItems, item]
      );
      setEditingItem(null);
    } catch (err) {
      setError('Failed to save item');
      console.error(err);
    }
  };

  const deleteItem = async (id: string) => {
    try {
      const params = {
        TableName: 'AISafetyContent',
        Key: { id },
      };
      await dynamoDB.delete(params).promise();
      setItems(prevItems => prevItems.filter(item => item.id !== id));
    } catch (err) {
      setError('Failed to delete item');
      console.error(err);
    }
  };

  const handleEdit = (item: LearningItem) => {
    setEditingItem(item);
  };

  const handleCancel = () => {
    setEditingItem(null);
  };

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (editingItem) {
      saveItem(editingItem);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    if (editingItem) {
      setEditingItem({ ...editingItem, [e.target.name]: e.target.value });
    }
  };

  const handleCreate = () => {
    const newItem: LearningItem = {
      id: uuidv4(),
      title: '',
      type: 'paper',
      description: '',
      link: '',
      area: AI_SAFETY_AREAS[0],
    };
    setEditingItem(newItem);
  };

  const filteredItems = items.filter(item =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (!selectedType || item.type === selectedType)
  );

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold mb-8 text-center">AI Safety Content Admin Dashboard</h1>

        <div className="mb-8 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleCreate}
            className="px-6 py-3 bg-blue-500 text-white rounded-full shadow-lg flex items-center justify-center transition-colors duration-300 hover:bg-blue-600"
          >
            <PlusCircle className="mr-2" /> Create New Item
          </motion.button>

          <div className="flex items-center space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <Search className="absolute left-3 top-2.5 text-gray-400" />
            </div>

            <select
              value={selectedType || ''}
              onChange={(e) => setSelectedType(e.target.value as ItemType | null)}
              className="pl-4 pr-10 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
            >
              <option value="">All Types</option>
              <option value="paper">Paper</option>
              <option value="video">Video</option>
              <option value="course">Course</option>
              <option value="tool">Tool</option>
              <option value="community">Community</option>
              <option value="challenge">Challenge</option>
            </select>
          </div>
        </div>

        <AnimatePresence>
          {editingItem && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-8 p-6 bg-white rounded-lg shadow-lg"
            >
              <h2 className="text-2xl font-semibold mb-6">
                {editingItem.id ? 'Edit Item' : 'Create New Item'}
              </h2>
              <form onSubmit={handleSave} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Title</label>
                    <input
                      type="text"
                      name="title"
                      value={editingItem.title}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Type</label>
                    <select
                      name="type"
                      value={editingItem.type}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      <option value="paper">Paper</option>
                      <option value="video">Video</option>
                      <option value="course">Course</option>
                      <option value="tool">Tool</option>
                      <option value="community">Community</option>
                      <option value="challenge">Challenge</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-2">Description</label>
                    <textarea
                      name="description"
                      value={editingItem.description}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows={3}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Link</label>
                    <input
                      type="url"
                      name="link"
                      value={editingItem.link}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Area</label>
                    <select
                      name="area"
                      value={editingItem.area}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      {AI_SAFETY_AREAS.map((area) => (
                        <option key={area} value={area}>{area}</option>
                      ))}
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-2">Content (optional)</label>
                    <textarea
                      name="content"
                      value={editingItem.content || ''}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows={5}
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    className="px-6 py-2 bg-blue-500 text-white rounded-md shadow transition-colors duration-300 hover:bg-blue-600"
                  >
                    <Save className="inline-block mr-2" /> Save
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleCancel}
                    className="px-6 py-2 bg-gray-300 text-gray-700 rounded-md shadow transition-colors duration-300 hover:bg-gray-400"
                  >
                    <X className="inline-block mr-2" /> Cancel
                  </motion.button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {isLoading ? (
          <div className="text-center py-10">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="inline-block w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"
            />
          </div>
        ) : error ? (
          <div className="text-center py-10 text-red-500">{error}</div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white shadow-lg rounded-lg overflow-hidden"
          >
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Area</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <AnimatePresence>
                  {filteredItems.map(item => (
                    <motion.tr
                      key={item.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="hover:bg-gray-50 transition-colors duration-150"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">{item.title}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                          {item.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">{item.area}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleEdit(item)}
                          className="text-indigo-600 hover:text-indigo-900 mr-4"
                        >
                          <Edit className="w-5 h-5" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => deleteItem(item.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="w-5 h-5" />
                        </motion.button>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;