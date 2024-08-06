/* eslint-disable react/no-unescaped-entities */
'use client'

import React, { useState, useEffect } from 'react';
import { ChevronRight, ChevronDown, BookOpen, Video, Link as LinkIcon, FileCog, Users, Zap, Search, Moon, Sun, Menu, ChevronLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
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
  area: string;
}

const truncateText = (text, maxLength) => {
  if (text.length <= maxLength) return text;
  return text.substr(0, maxLength) + '...';
};

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

const iconMap: Record<ItemType, React.ElementType> = {
  paper: BookOpen,
  video: Video,
  course: LinkIcon,
  tool: FileCog,
  community: Users,
  challenge: Zap,
};

const gradientColors: Record<ItemType, string> = {
  paper: 'from-blue-400 to-blue-600',
  video: 'from-red-400 to-red-600',
  course: 'from-green-400 to-green-600',
  tool: 'from-yellow-400 to-yellow-600',
  community: 'from-purple-400 to-purple-600',
  challenge: 'from-orange-400 to-orange-600',
};

const getGradientColor = (type: ItemType): string => {
  return gradientColors[type] || 'from-gray-400 to-gray-600';
};

const AISafetyExplorer: React.FC = () => {
  const [learningItems, setLearningItems] = useState<{ [key in AreaKey]: LearningItem[] }>({} as { [key in AreaKey]: LearningItem[] });
  const [selectedArea, setSelectedArea] = useState<AreaKey>(AI_SAFETY_AREAS[0]);
  const [selectedPaperId, setSelectedPaperId] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<ItemType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    fetchLearningItems();
    return () => window.removeEventListener('resize', checkMobile);
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
        if (!acc[item.area as AreaKey]) {
          acc[item.area as AreaKey] = [];
        }
        acc[item.area as AreaKey].push(item);
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

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const handleSelectArea = (area: AreaKey) => {
    setSelectedArea(area);
    setSelectedPaperId(null);
    if (isMobile) setIsSidebarOpen(false);
  };

  const handleSelectPaper = (paperId: string) => {
    setSelectedPaperId(paperId);
    if (isMobile) setIsSidebarOpen(false);
  };

  const filteredItems = learningItems[selectedArea]?.filter(item =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (!selectedType || item.type === selectedType)
  ) || [];

  const Sidebar = () => (
    <motion.div
      className={`bg-white dark:bg-gray-900 text-gray-800 dark:text-white overflow-y-auto transition-all duration-300 ease-in-out ${isMobile ? (isSidebarOpen ? 'w-full' : 'w-0') : 'w-80'}`}
      initial={false}
      animate={{ width: isMobile ? (isSidebarOpen ? '100%' : '0') : '20rem' }}
    >
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">AI Safety Research</h2>
          {isMobile && (
            <button onClick={toggleSidebar} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800">
              <ChevronLeft className="w-6 h-6" />
            </button>
          )}
        </div>
        {AI_SAFETY_AREAS.map(area => (
          <motion.div key={area} className="mb-4" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <button
              onClick={() => handleSelectArea(area)}
              className={`flex items-center justify-between w-full text-left text-lg font-medium hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-150 ${selectedArea === area ? 'text-purple-600 dark:text-purple-400' : ''}`}
            >
              <span>{area}</span>
              {selectedArea === area ? (
                <ChevronDown className="w-5 h-5" />
              ) : (
                <ChevronRight className="w-5 h-5" />
              )}
            </button>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );

  const LearningItems = () => (
    <div className="p-4 sm:p-8 bg-gray-100 dark:bg-gray-800 min-h-screen overflow-y-auto">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl sm:text-4xl font-bold text-gray-800 dark:text-white mb-8"
      >
        {selectedArea}
      </motion.h1>

      <div className="mb-8 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-grow">
          <input
            type="text"
            placeholder="Search items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white dark:bg-gray-700 text-gray-800 dark:text-white rounded-full py-2 px-4 pl-10 focus:outline-none focus:ring-2 focus:ring-purple-600 dark:focus:ring-purple-400"
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" />
        </div>
        <div className="flex flex-wrap gap-2">
          {Object.keys(iconMap).map(type => (
            <motion.button
              key={type}
              onClick={() => setSelectedType(selectedType === type as ItemType ? null : type as ItemType)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors duration-300 ${selectedType === type
                ? 'bg-purple-600 text-white'
                : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
            >
              {type}
            </motion.button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-500"></div>
        </div>
      ) : error ? (
        <div className="text-red-500 text-center">{error}</div>
      ) : (
        <AnimatePresence>
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            initial="hidden"
            animate="visible"
            variants={{
              visible: { transition: { staggerChildren: 0.05 } }
            }}
          >
            {filteredItems.map((item: LearningItem) => {
              const Icon = iconMap[item.type];
              const gradientColor = getGradientColor(item.type);
              return (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
                >
                  <motion.div
                    whileHover={{ scale: 1.03 }}
                    transition={{ type: "spring", stiffness: 300, damping: 10 }}
                  >
                    <div className={`relative h-48 bg-gradient-to-br ${gradientColor}`}>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Icon className="w-24 h-24 text-white opacity-30" />
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute bottom-4 left-4 right-4">
                        <h2 className="text-xl font-semibold text-white mb-2">{item.title}</h2>
                        <span className="text-sm font-medium text-purple-300 uppercase">{item.type}</span>
                      </div>
                    </div>
                    <div className="p-6">
                      <p className="text-gray-600 dark:text-gray-300 mb-4">
                        {truncateText(item.description, 100)}
                      </p>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => item.type === 'paper' ? handleSelectPaper(item.id) : window.open(item.link, '_blank')}
                        className="w-full px-4 py-2 bg-purple-600 dark:bg-purple-500 text-white rounded-full transition-all duration-300 hover:bg-purple-700 dark:hover:bg-purple-600"
                      >
                        {item.type === 'paper' ? 'Preview Paper' : 'Explore'}
                      </motion.button>
                    </div>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileHover={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-2 right-2 w-10 h-10 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-lg"
                  >
                    <Icon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </motion.div>
                </motion.div>
              );
            })}
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );

  const PaperViewer = () => {
    const paper = learningItems[selectedArea]?.find(item => item.id === selectedPaperId);

    if (!paper) return null;

    return (
      <div className="p-8 bg-white dark:bg-gray-900 text-gray-800 dark:text-white min-h-screen overflow-y-auto">
        <h2 className="text-3xl font-bold mb-4">{paper.title}</h2>
        <p className="text-lg mb-6">{paper.description}</p>
        <p className="mb-8">This is where the full content of the paper would be displayed. For demonstration purposes, we're showing a placeholder text.</p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setSelectedPaperId(null)}
          className="px-6 py-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-colors duration-300"
        >
          Back to Learning Items
        </motion.button>
      </div>
    );
  };

  return (
    <div className={`flex h-screen ${isDarkMode ? 'dark' : ''}`}>
      {isMobile && (
        <button onClick={toggleSidebar} className="fixed top-4 left-4 z-50 p-2 bg-white dark:bg-gray-800 rounded-full shadow-lg">
          <Menu className="w-6 h-6 text-gray-800 dark:text-white" />
        </button>
      )}
      <Sidebar />
      <div className="flex-1 overflow-hidden">
        <div className="flex justify-end p-4">
          <button onClick={toggleTheme} className="p-2 rounded-full bg-gray-200 dark:bg-gray-700">
            {isDarkMode ? <Sun className="w-6 h-6 text-yellow-400" /> : <Moon className="w-6 h-6 text-gray-800" />}
          </button>
        </div>
        {selectedPaperId ? <PaperViewer /> : <LearningItems />}
      </div>
    </div>
  );
};

export default AISafetyExplorer;