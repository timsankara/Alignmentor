'use client'

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ChevronRight, Sun, Moon, ChevronDown, ChevronUp, BookOpen, FileText, Clock, User, Calendar, AlertTriangle } from 'lucide-react';
import { DynamoDB } from 'aws-sdk';

// Initialize DynamoDB client
const dynamoDB = new DynamoDB.DocumentClient({
  region: "us-east-1",
  accessKeyId: "AKIA55SBB5ENSF3SCWFI",
  secretAccessKey: "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",
});

interface LearningItem {
  id: string;
  agenda: string;
  author: string;
  date: string;
  description: string;
  filename?: string;
  link: string;
  readTime: number;
  title: string;
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

const FuturisticLoader: React.FC = () => (
  <div className="flex flex-col items-center justify-center h-64">
    <svg width="120" height="120" viewBox="0 0 120 120" className="text-indigo-600">
      <motion.circle
        cx="60"
        cy="60"
        r="50"
        stroke="currentColor"
        strokeWidth="4"
        fill="none"
        initial={{ pathLength: 0, rotate: 0 }}
        animate={{ pathLength: 1, rotate: 360 }}
        transition={{
          duration: 2,
          ease: "easeInOut",
          repeat: Infinity,
          repeatType: "loop"
        }}
      />
      <motion.circle
        cx="60"
        cy="60"
        r="40"
        stroke="currentColor"
        strokeWidth="4"
        fill="none"
        initial={{ pathLength: 0, rotate: 0 }}
        animate={{ pathLength: 1, rotate: -360 }}
        transition={{
          duration: 2,
          ease: "easeInOut",
          repeat: Infinity,
          repeatType: "loop",
          delay: 0.5
        }}
      />
      <motion.text
        x="60"
        y="65"
        textAnchor="middle"
        className="text-3xl font-bold fill-current"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 1 }}
      >
        AI
      </motion.text>
    </svg>
    <motion.p
      className="mt-4 text-lg font-semibold text-indigo-600 dark:text-indigo-400"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.5 }}
    >
      Loading AI Safety Content...
    </motion.p>
  </div>
);

const AISafetyExplorer: React.FC = () => {
  const [learningItems, setLearningItems] = useState<{ [key in AreaKey]: LearningItem[] }>({} as { [key in AreaKey]: LearningItem[] });
  const [selectedArea, setSelectedArea] = useState<AreaKey | null>(null);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

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
        if (item.agenda && AI_SAFETY_AREAS.includes(item.agenda as AreaKey)) {
          if (!acc[item.agenda as AreaKey]) {
            acc[item.agenda as AreaKey] = [];
          }
          acc[item.agenda as AreaKey].push(item);
        }
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

  const toggleItemExpansion = (itemId: string) => {
    setExpandedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  const filteredAreas = AI_SAFETY_AREAS.filter(area =>
    area.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredItems = selectedArea
    ? learningItems[selectedArea]?.filter(item =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase())
    ) || []
    : [];

  const truncateDescription = (description: string, maxLength: number = 100) => {
    if (!description) return '';
    if (description.length <= maxLength) return description;
    return description.slice(0, maxLength) + '...';
  };

  const getFileType = (filename: string | undefined): string => {
    if (!filename) return 'Paper';

    const extension = filename.split('.').pop()?.toLowerCase() || '';
    switch (extension) {
      case 'pdf':
        return 'PDF';
      case 'mp4':
      case 'avi':
      case 'mov':
        return 'Video';
      case 'mp3':
      case 'wav':
        return 'Audio';
      default:
        return 'Document';
    }
  };

  const renderItemCard = (item: LearningItem) => {
    const isExpanded = expandedItems.has(item.id);
    const fileType = getFileType(item.filename);
    const truncatedDescription = truncateDescription(item.description);
    const needsExpansion = truncatedDescription !== item.description;

    return (
      <motion.div
        key={item.id}
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.3 }}
        className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 flex flex-col"
      >
        <div className="p-4 flex-grow">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold break-words pr-2">{item.title || 'Untitled'}</h3>
            <div className="flex-shrink-0 flex items-center bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 px-2 py-1 rounded-full text-xs font-medium">
              <FileText className="w-3 h-3 mr-1" />
              {fileType}
            </div>
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400 mb-2 flex items-center flex-wrap">
            {item.author && (
              <span className="flex items-center mr-3 mb-1">
                <User className="w-3 h-3 mr-1" />
                {item.author}
              </span>
            )}
            {/* {item.date && (
              <span className="flex items-center mr-3 mb-1">
                <Calendar className="w-3 h-3 mr-1" />
                {new Date(item.date).toLocaleDateString()}
              </span>
            )} */}
            {item.readTime !== undefined && (
              <span className="flex items-center mb-1">
                <Clock className="w-3 h-3 mr-1" />
                {item.readTime} min read
              </span>
            )}
          </div>
          <motion.div
            initial={false}
            animate={{ height: isExpanded ? 'auto' : 'auto' }}
            transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }}
            className="overflow-hidden"
          >
            <motion.p
              className="text-sm text-gray-600 dark:text-gray-300"
              initial={false}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {isExpanded ? item.description : truncatedDescription}
            </motion.p>
          </motion.div>
          {needsExpansion && (
            <div className="mt-2">
              <button
                onClick={() => toggleItemExpansion(item.id)}
                className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline flex items-center"
              >
                {isExpanded ? (
                  <>
                    <ChevronUp className="w-3 h-3 mr-1" />
                    Show less
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-3 h-3 mr-1" />
                    Read more
                  </>
                )}
              </button>
            </div>
          )}
        </div>
        <div className="p-4 mt-auto">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.open(`/explorer/${item.id}`, '_blank')}
            className="w-full px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full text-sm font-medium transition-colors duration-300 flex items-center justify-center"
          >
            <BookOpen className="w-4 h-4 mr-2" />
            Read Full Article
          </motion.button>
        </div>
      </motion.div>
    );
  };

  const renderAreaCard = (area: AreaKey) => (
    <motion.div
      key={area}
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.3 }}
      className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer group"
      onClick={() => setSelectedArea(area)}
    >
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-2 text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-300">{area}</h2>
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
  );

  return (
    <div className={`min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white ${isDarkMode ? 'dark' : ''}`}>
      <header className="bg-white dark:bg-gray-800 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <motion.button
            className="text-3xl font-bold text-indigo-600 dark:text-indigo-400"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            onClick={() => window.open(`/`)}
          >
            Alignmentor
          </motion.button>
          <motion.button
            onClick={toggleTheme}
            className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-300"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {isDarkMode ? <Sun className="w-6 h-6 text-yellow-400" /> : <Moon className="w-6 h-6 text-gray-800" />}
          </motion.button>
        </div>
      </header>

      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="relative">
            <input
              type="text"
              placeholder="Search research areas or items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-full py-3 px-4 pl-12 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 transition-all duration-300"
            />
            <Search className="absolute left-4 top-3.5 text-gray-400" />
          </div>
        </motion.div>

        {isLoading ? (
          <FuturisticLoader />
        ) : error ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md"
            role="alert"
          >
            <div className="flex">
              <div className="py-1">
                <AlertTriangle className="h-6 w-6 text-red-500 mr-4" />
              </div>
              <div>
                <p className="font-bold">Error</p>
                <p>{error}</p>
              </div>
            </div>
          </motion.div>
        ) : selectedArea ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.button
              onClick={() => setSelectedArea(null)}
              className="mb-4 text-indigo-600 dark:text-indigo-400 font-medium flex items-center hover:underline"
              whileHover={{ x: -5 }}
              transition={{ type: 'spring', stiffness: 400, damping: 10 }}
            >
              <ChevronRight className="w-5 h-5 mr-1 transform rotate-180" />
              Back to Research Areas
            </motion.button>
            <h2 className="text-3xl font-bold mb-6 text-indigo-600 dark:text-indigo-400">{selectedArea}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence>
                {filteredItems.map((item) => renderItemCard(item))}
              </AnimatePresence>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            <h2 className="text-2xl font-semibold text-center mb-6">Explore AI Safety Research Areas</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence>
                {filteredAreas.map((area) => renderAreaCard(area))}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </main>

      <footer className="mt-auto bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">&copy; 2024 Alignmentor. All rights reserved.</p>
          <p className="text-sm text-gray-500 dark:text-gray-500 mt-2 sm:mt-0">Dedicated to advancing safe and ethical AI development</p>
        </div>
      </footer>
    </div>
  );
};

export default AISafetyExplorer;