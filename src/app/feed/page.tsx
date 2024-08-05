'use client'

import React, { useState, useEffect, useCallback } from 'react';
import { ChevronDown, Filter, Bookmark, Share2, ArrowRight, Sun, Moon, Bot as Robot, Shield, Brain } from 'lucide-react';
import { getFeedItems } from '../utils/feed';

const AIAgendas: string[] = [
  "Scalable Oversight",
  "AI Alignment",
  "Robustness",
  "Transparency",
  "Value Learning",
  "AI Governance",
];

interface FeedItem {
  _id: number;
  title: string;
  description: string;
  agenda: string;
  author: string;
  date: string;
  readTime: string;
}

interface FeedItemProps {
  item: FeedItem;
}

const FeedItem: React.FC<FeedItemProps> = ({ item }) => (
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

const LoadingAnimation: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    { icon: Robot, text: "Initializing AI systems..." },
    { icon: Shield, text: "Implementing safety protocols..." },
    { icon: Brain, text: "Aligning AI objectives..." }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 100) {
          clearInterval(interval);
          onComplete();
          return 100;
        }
        return prevProgress + 1;
      });
    }, 30);

    return () => clearInterval(interval);
  }, [onComplete]);

  useEffect(() => {
    setCurrentStep(Math.min(Math.floor(progress / (100 / steps.length)), steps.length - 1));
  }, [progress, steps.length]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 dark:from-gray-800 dark:to-gray-900">
      <h2 className="mt-0 text-2xl font-bold text-white dark:text-white">
        {steps[currentStep].text}
      </h2>
      <p className="mt-0 text-xl font-semibold text-blue-600 dark:text-blue-400">
        {progress}%
      </p>
      <div className="mt-4 w-64 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div
          className="h-full bg-blue-500 dark:bg-blue-400 transition-all duration-300 ease-in-out"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <div className="w-64 h-64 relative" hidden>
        <div className="absolute inset-0 rounded-full border-8 border-gray-200 dark:border-gray-700"></div>
        <div
          className="absolute inset-0 rounded-full border-8 border-blue-500 dark:border-blue-400 transition-all duration-300 ease-in-out"
          style={{
            clipPath: `inset(0 ${100 - progress}% 0 0)`,
            transform: `rotate(${progress * 3.6}deg)`
          }}
        ></div>
        <div className="absolute inset-4 flex items-center justify-center">
          {React.createElement(steps[currentStep].icon, {
            size: 80,
            className: "text-blue-500 dark:text-blue-400 animate-bounce"
          })}
        </div>
      </div>
    </div>
  );
};

const AISafetyFeed: React.FC = () => {
  const [feedItems, setFeedItems] = useState<FeedItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<FeedItem[]>([]);
  const [selectedAgenda, setSelectedAgenda] = useState<string>('All');
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAnimationComplete, setIsAnimationComplete] = useState<boolean>(false);

  useEffect(() => {
    if (selectedAgenda === 'All') {
      setFilteredItems(feedItems);
    } else {
      setFilteredItems(feedItems.filter(item => item.agenda === selectedAgenda));
    }
  }, [selectedAgenda, feedItems]);

  const handleAnimationComplete = useCallback(() => {
    setIsAnimationComplete(true);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getFeedItems();
        if (Array.isArray(data) && data.every(item =>
          typeof item === 'object' &&
          '_id' in item &&
          'title' in item &&
          'description' in item &&
          'agenda' in item &&
          'author' in item &&
          'date' in item &&
          'readTime' in item
        )) {
          setFeedItems(data as FeedItem[]);
        } else {
          console.error('Received data is not in the expected format:', data);
          setFeedItems([]);
        }
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching feed items:', error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

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

  if (isLoading || !isAnimationComplete) {
    return <LoadingAnimation onComplete={handleAnimationComplete} />;
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark' : ''}`}>
      <div className="max-w-7xl mx-auto px-6 space-y-8 transition-colors duration-300 dark:bg-gray-900">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <h2 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600" hidden>AI Safety Feed</h2>
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
            {/* <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-300"
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button> */}
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredItems.map((item) => (
            <FeedItem key={item._id} item={item} />
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