/* eslint-disable react/no-unescaped-entities */
'use client'
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, ChevronRight, Sun, Moon } from 'lucide-react';
import { DynamoDB } from 'aws-sdk';

// Initialize DynamoDB client
const dynamoDB = new DynamoDB.DocumentClient({
  region: "us-east-1",
  accessKeyId: "AKIA55SBB5ENSF3SCWFI",
  secretAccessKey: "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",
});

type ItemType = 'paper' | 'video' | 'course' | 'tool' | 'community' | 'challenge';

interface LearningItem {
  id: string;
  title: string;
  type: ItemType;
  description: string;
  link: string;
  agenda: string;
}

type AreaKey =
  | "Reinforcement Learning from Human (or AI) Feedback"
  | "Scalable Oversight"
  | "Robustness, Unlearning and Control"
  | "Mechanistic Interpretability"
  | "Technical Governance Approaches"
  | "AI Alignment Theory"
  | "Value Learning and Specification"
  | "AI Containment and Cybersecurity"
  | "Cooperative AI and Multi-Agent Systems";

const AI_SAFETY_AREAS: AreaKey[] = [
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

const AISafetyExplorer: React.FC = () => {
  const [learningItems, setLearningItems] = useState<{ [key in AreaKey]: LearningItem[] }>({} as { [key in AreaKey]: LearningItem[] });
  const [selectedArea, setSelectedArea] = useState<AreaKey | null>(null);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchLearningItems();
  }, []);

  const fetchLearningItems = async () => {
    setIsLoading(true);
    try {
      const params = {
        TableName: 'AISafetyContent',
      };
      const result = await dynamoDB.scan(params).promise();
      const items = result.Items as LearningItem[];
      const groupedItems = items.reduce((acc, item) => {
        if (!acc[item.agenda as AreaKey]) {
          acc[item.agenda as AreaKey] = [];
        }
        acc[item.agenda as AreaKey].push(item);
        return acc;
      }, {} as { [key in AreaKey]: LearningItem[] });
      setLearningItems(groupedItems);
    } catch (err) {
      console.error('Failed to fetch items:', err);
      setError('Failed to fetch learning items. Please try again later.');
    }
    setIsLoading(false);
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  const filteredAreas = AI_SAFETY_AREAS.filter(area =>
    area.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredItems = selectedArea
    ? learningItems[selectedArea]?.filter(item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase())
      ) || []
    : [];

  return (
    <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white ${isDarkMode ? 'dark' : ''}`}>
      <header className="bg-white dark:bg-gray-800 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-semibold">AI Safety Explorer</h1>
          <button onClick={toggleTheme} className="p-2 rounded-full bg-gray-200 dark:bg-gray-700">
            {isDarkMode ? <Sun className="w-6 h-6 text-yellow-400" /> : <Moon className="w-6 h-6 text-gray-800" />}
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="relative">
            <input
              type="text"
              placeholder="Search areas or items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-full py-3 px-4 pl-12 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
            />
            <Search className="absolute left-4 top-3.5 text-gray-400" />
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : error ? (
          <div className="text-red-500 text-center">{error}</div>
        ) : selectedArea ? (
          <div>
            <button
              onClick={() => setSelectedArea(null)}
              className="mb-4 text-indigo-600 dark:text-indigo-400 font-medium flex items-center"
            >
              <ChevronRight className="w-5 h-5 mr-1 transform rotate-180" />
              Back to Areas
            </button>
            <h2 className="text-3xl font-bold mb-6">{selectedArea}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence>
                {filteredItems.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
                  >
                    <div className="p-6">
                      <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                      <p className="text-gray-600 dark:text-gray-300 mb-4">
                        {item.description.length > 100
                          ? `${item.description.substring(0, 100)}...`
                          : item.description}
                      </p>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400 uppercase">
                          {item.type}
                        </span>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => window.open(`/explorer/${item.id}`, '_blank')}
                          className="px-4 py-2 bg-indigo-600 text-white rounded-full text-sm font-medium transition-colors duration-300 hover:bg-indigo-700"
                        >
                          Explore
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {filteredAreas.map((area) => (
                <motion.div
                  key={area}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer"
                  onClick={() => setSelectedArea(area)}
                >
                  <div className="p-6">
                    <h2 className="text-xl font-semibold mb-2">{area}</h2>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      Explore {learningItems[area]?.length || 0} items in this area
                    </p>
                    <motion.div
                      className="flex justify-end"
                      whileHover={{ x: 5 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                    >
                      <ChevronRight className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                    </motion.div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </main>
    </div>
  );
};

export default AISafetyExplorer;