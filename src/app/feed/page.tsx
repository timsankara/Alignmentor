'use client'

import React, { useState, useEffect } from 'react';
import { ChevronDown, Filter, Bookmark, Share2, ArrowRight, Sun, Moon } from 'lucide-react';

const AIAgendas = [
  "Scalable Oversight",
  "AI Alignment",
  "Robustness",
  "Transparency",
  "Value Learning",
  "AI Governance",
];

const sampleFeedItems: FeedItem[] = [
  {
    id: 1,
    title: "Advances in Scalable Oversight Techniques",
    description: "Recent research shows promising results in developing scalable oversight methods for large language models, potentially addressing key AI safety concerns.",
    agenda: "Scalable Oversight",
    author: "Dr. Emily Chen",
    date: "2024-05-15",
    readTime: "5 min read"
  },
  {
    id: 2,
    title: "AI Alignment: Bridging the Gap Between Human and Machine Values",
    description: "A new framework for AI alignment proposes a novel approach to ensure AI systems behave in accordance with human values and intentions.",
    agenda: "AI Alignment",
    author: "Prof. David Lee",
    date: "2024-05-10",
    readTime: "7 min read"
  },
  {
    id: 3,
    title: "Enhancing AI Robustness Through Adversarial Training",
    description: "Researchers demonstrate significant improvements in AI system robustness using advanced adversarial training techniques, marking a step forward in AI safety.",
    agenda: "Robustness",
    author: "Dr. Sarah Johnson",
    date: "2024-05-05",
    readTime: "6 min read"
  },
  {
    id: 4,
    title: "Transparency in AI Decision Making: A New Approach",
    description: "A groundbreaking study introduces a method to make AI decision-making processes more transparent and interpretable, addressing a key challenge in AI safety.",
    agenda: "Transparency",
    author: "Prof. Michael Brown",
    date: "2024-04-30",
    readTime: "8 min read"
  },
  {
    id: 5,
    title: "Value Learning: Teaching AI Systems Human Preferences",
    description: "Recent advancements in value learning algorithms show promise in enabling AI systems to better understand and align with complex human preferences.",
    agenda: "Value Learning",
    author: "Dr. Lisa Zhang",
    date: "2024-04-25",
    readTime: "5 min read"
  },
  {
    id: 6,
    title: "The Role of Governance in Ensuring Safe AI Development",
    description: "A comprehensive report outlines key policy recommendations for governing AI development to ensure safety and ethical considerations are prioritized.",
    agenda: "AI Governance",
    author: "Prof. Robert Taylor",
    date: "2024-04-20",
    readTime: "9 min read"
  }
];

interface FeedItem {
  id: number;
  title: string;
  description: string;
  agenda: string;
  author: string;
  date: string;
  readTime: string;
}

const FeedItem: React.FC<{ item: FeedItem }> = ({ item }) => (
  <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-105 space-y-4 overflow-hidden group">
    <div className="flex items-center space-x-2 text-sm font-medium">
      <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full">{item.agenda}</span>
      <span className="text-gray-500 dark:text-gray-400">{item.readTime}</span>
    </div>
    <h3 className="text-xl font-bold text-gray-900 dark:text-white leading-tight">{item.title}</h3>
    <p className="text-gray-600 dark:text-gray-300 line-clamp-3">{item.description}</p>
    <div className="flex justify-between items-center">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
          {item.author.split(' ').map(n => n[0]).join('')}
        </div>
        <div>
          <p className="font-medium text-gray-900 dark:text-white">{item.author}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">{item.date}</p>
        </div>
      </div>
      <div className="flex space-x-2">
        <button className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300">
          <Bookmark size={18} />
        </button>
        <button className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300">
          <Share2 size={18} />
        </button>
      </div>
    </div>
    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-in-out"></div>
  </div>
);

const AISafetyFeed = () => {
  const [feedItems, setFeedItems] = useState(sampleFeedItems);
  const [filteredItems, setFilteredItems] = useState(sampleFeedItems);
  const [selectedAgenda, setSelectedAgenda] = useState('All');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    if (selectedAgenda === 'All') {
      setFilteredItems(feedItems);
    } else {
      setFilteredItems(feedItems.filter(item => item.agenda === selectedAgenda));
    }
  }, [selectedAgenda, feedItems]);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark' : ''}`}>
      <div className="max-w-6xl mx-auto p-6 space-y-8 transition-colors duration-300 dark:bg-gray-900">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <h2 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">AI Safety Feed</h2>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="flex items-center space-x-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 px-4 py-2 rounded-full shadow-md hover:shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
              >
                <Filter size={18} />
                <span className="font-medium">Filter</span>
                <ChevronDown size={18} className={`transform transition-transform duration-300 ${isFilterOpen ? 'rotate-180' : ''}`} />
              </button>
              {isFilterOpen && (
                <div className="absolute right-0 mt-2 py-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-xl z-20 transition-all duration-300 ease-in-out transform origin-top">
                  <button
                    onClick={() => { setSelectedAgenda('All'); setIsFilterOpen(false); }}
                    className="block px-4 py-2 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left transition-colors duration-200"
                  >
                    All Agendas
                  </button>
                  {AIAgendas.map((agenda) => (
                    <button
                      key={agenda}
                      onClick={() => { setSelectedAgenda(agenda); setIsFilterOpen(false); }}
                      className="block px-4 py-2 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left transition-colors duration-200"
                    >
                      {agenda}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-300"
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredItems.map((item) => (
            <FeedItem key={item.id} item={item} />
          ))}
        </div>

        <div className="flex justify-center">
          <button className="group flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 transform hover:scale-105">
            <span className="font-medium">Load More</span>
            <ArrowRight size={18} className="transform group-hover:translate-x-1 transition-transform duration-300" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AISafetyFeed;