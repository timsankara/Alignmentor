'use client'

import React, { useState, useEffect } from 'react';
import { ChevronRight, ChevronDown, BookOpen, Video, Link as LinkIcon, FileCog, Users, Zap, Search, Moon, Sun, Menu, ChevronLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AI_SAFETY_AREAS = [
  "Reinforcement Learning from Human (or AI) Feedback",
  "Scalable Oversight",
  "Robustness, Unlearning and Control",
  "Mechanistic Interpretability",
  "Technical Governance Approaches",
  "AI Alignment Theory",
  "Value Learning and Specification",
  "AI Containment and Cybersecurity",
  "Cooperative AI and Multi-Agent Systems",
];

const MOCK_LEARNING_ITEMS = {
  "Reinforcement Learning from Human (or AI) Feedback": [
    { id: '1', title: "Deep RL from Human Preferences", type: 'paper', description: "Seminal paper on learning from human feedback", link: "#", image: "/api/placeholder/400/250" },
    { id: '2', title: "Introduction to RLHF", type: 'video', description: "Comprehensive video tutorial on RLHF", link: "#", image: "/api/placeholder/400/250" },
    { id: '3', title: "RLHF in Practice", type: 'course', description: "Hands-on course for implementing RLHF", link: "#", image: "/api/placeholder/400/250" },
  ],
  "Scalable Oversight": [
    { id: '4', title: "Recursive Reward Modeling", type: 'paper', description: "Framework for scalable AI oversight", link: "#", image: "/api/placeholder/400/250" },
    { id: '5', title: "Debate as an AI Safety Technique", type: 'video', description: "Exploring debate for AI alignment", link: "#", image: "/api/placeholder/400/250" },
  ],
  "Robustness, Unlearning and Control": [
    { id: '6', title: "Adversarial Training Methods", type: 'paper', description: "Techniques for improving AI robustness", link: "#", image: "/api/placeholder/400/250" },
    { id: '7', title: "Machine Unlearning", type: 'course', description: "Methods for selective forgetting in AI systems", link: "#", image: "/api/placeholder/400/250" },
  ],
  // Add more areas and items as needed
};

const iconMap = {
  paper: BookOpen,
  video: Video,
  course: LinkIcon,
  tool: FileCog,
  community: Users,
  challenge: Zap,
};

const AISafetyExplorer: React.FC = () => {
  const [selectedArea, setSelectedArea] = useState(AI_SAFETY_AREAS[0]);
  const [selectedPaperId, setSelectedPaperId] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const handleSelectArea = (area: string) => {
    setSelectedArea(area);
    setSelectedPaperId(null);
    if (isMobile) setIsSidebarOpen(false);
  };

  const handleSelectPaper = (paperId: string) => {
    setSelectedPaperId(paperId);
    if (isMobile) setIsSidebarOpen(false);
  };

  const filteredItems = MOCK_LEARNING_ITEMS[selectedArea]?.filter(item =>
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
              onClick={() => setSelectedType(selectedType === type ? null : type)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors duration-300 ${
                selectedType === type
                  ? 'bg-purple-600 text-white'
                  : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {type}
            </motion.button>
          ))}
        </div>
      </div>

      <AnimatePresence>
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          initial="hidden"
          animate="visible"
          variants={{
            visible: { transition: { staggerChildren: 0.1 } }
          }}
        >
          {filteredItems.map((item) => {
            const Icon = iconMap[item.type as keyof typeof iconMap];
            return (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                whileHover={{ scale: 1.03 }}
                onHoverStart={() => setHoveredItem(item.id)}
                onHoverEnd={() => setHoveredItem(null)}
                className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
              >
                <div className="relative">
                  <img src={item.image} alt={item.title} className="w-full h-48 object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <h2 className="text-xl font-semibold text-white mb-2">{item.title}</h2>
                    <span className="text-sm font-medium text-purple-300 uppercase">{item.type}</span>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-gray-600 dark:text-gray-300 mb-4">{item.description}</p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => item.type === 'paper' ? handleSelectPaper(item.id) : window.open(item.link, '_blank')}
                    className="w-full px-4 py-2 bg-purple-600 dark:bg-purple-500 text-white rounded-full transition-all duration-300 hover:bg-purple-700 dark:hover:bg-purple-600"
                  >
                    {item.type === 'paper' ? 'Read Paper' : 'Explore'}
                  </motion.button>
                </div>
                <AnimatePresence>
                  {hoveredItem === item.id && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="absolute top-2 right-2 w-10 h-10 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-lg"
                    >
                      <Icon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </motion.div>
      </AnimatePresence>
    </div>
  );

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
        {selectedPaperId ? (
          <div className="p-8 bg-white dark:bg-gray-900 text-gray-800 dark:text-white">
            <h2 className="text-2xl font-bold mb-4">Paper Viewer</h2>
            <p>Viewing paper with ID: {selectedPaperId}</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedPaperId(null)}
              className="mt-4 px-6 py-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-colors duration-300"
            >
              Back to Learning Items
            </motion.button>
          </div>
        ) : (
          <LearningItems />
        )}
      </div>
    </div>
  );
};

export default AISafetyExplorer;