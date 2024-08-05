/* eslint-disable react/no-unescaped-entities */
'use client'

import React, { useState, useEffect, useCallback } from 'react';
import { ChevronDown, Filter, Bookmark, Share2, ArrowRight, Calendar, Sun, Moon, Bot as Robot, Shield, Brain, Search, X } from 'lucide-react';
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

const NoResultsMessage: React.FC<{ selectedAgenda: string }> = ({ selectedAgenda }) => (
  <div className="flex flex-col items-center justify-center p-8 bg-gray-100 dark:bg-gray-800 rounded-3xl shadow-inner text-center">
    <Robot size={64} className="text-purple-500 dark:text-purple-400 mb-4 animate-pulse" />
    <h3 className="text-2xl font-bold text-gray-700 dark:text-gray-300 mb-2">
      No articles found in {selectedAgenda}
    </h3>
    <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">
      We couldn't locate any papers or articles in this specific agenda area.
    </p>
    <p className="text-md text-gray-500 dark:text-gray-500">
      Try adjusting your filters or exploring other AI safety topics.
    </p>
    {/* <button className="mt-6 px-6 py-2 bg-purple-500 text-white rounded-full hover:bg-purple-600 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50">
      Clear Filters
    </button> */}
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
        return prevProgress + 5;
      });
    }, 15);

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

const FilterButton: React.FC<{ label: string; isActive: boolean; onClick: () => void }> = ({ label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded-full transition-all duration-300 text-sm sm:text-base ${isActive
      ? 'bg-purple-600 text-white shadow-md'
      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
      }`}
  >
    {label}
  </button>
);

const DateRangeSelector: React.FC<{
  startDate: string;
  endDate: string;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
}> = ({ startDate, endDate, onStartDateChange, onEndDateChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Select';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-300"
      >
        <div className="flex items-center space-x-2">
          <Calendar size={20} className="text-purple-500 dark:text-purple-400" />
          <span className="text-gray-700 dark:text-gray-200">
            {startDate || endDate
              ? `${formatDate(startDate)} - ${formatDate(endDate)}`
              : 'Select date range'}
          </span>
        </div>
        <ChevronDown size={20} className={`text-gray-500 transition-transform duration-300 ${isOpen ? 'transform rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute z-10 mt-2 w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="p-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => onStartDateChange(e.target.value)}
                className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => onEndDateChange(e.target.value)}
                className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const AISafetyFeed: React.FC = () => {
  const [feedItems, setFeedItems] = useState<FeedItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<FeedItem[]>([]);
  const [selectedAgenda, setSelectedAgenda] = useState<string>('All');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [selectedAuthor, setSelectedAuthor] = useState<string>('All');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAnimationComplete, setIsAnimationComplete] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isFiltersVisible, setIsFiltersVisible] = useState(false);


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
    let result = feedItems;

    if (selectedAgenda !== 'All') {
      result = result.filter(item => item.agenda === selectedAgenda);
    }

    if (startDate && endDate) {
      result = result.filter(item => {
        const itemDate = new Date(item.date);
        return itemDate >= new Date(startDate) && itemDate <= new Date(endDate);
      });
    }

    if (selectedAuthor !== 'All') {
      result = result.filter(item => item.author === selectedAuthor);
    }

    if (searchTerm) {
      result = result.filter(item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredItems(result);
  }, [selectedAgenda, startDate, endDate, selectedAuthor, searchTerm, feedItems]);

  const clearFilters = () => {
    setSelectedAgenda('All');
    setStartDate('');
    setEndDate('');
    setSelectedAuthor('All');
    setSearchTerm('');
  };

  if (isLoading || !isAnimationComplete) {
    return <LoadingAnimation onComplete={handleAnimationComplete} />;
  }

  const uniqueAuthorsSet = new Set(feedItems.map(item => item.author));
  const uniqueAuthors = ['All'].concat(Array.from(uniqueAuthorsSet));

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">AI Safety Feed</h1>
          <button
            onClick={() => setIsFiltersVisible(!isFiltersVisible)}
            className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-300 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            <Filter size={24} />
            <span className="font-medium hidden sm:inline">Filters</span>
            <ChevronDown
              size={24}
              className={`transform transition-transform duration-300 ${isFiltersVisible ? 'rotate-180' : ''}`}
            />
          </button>
        </div>

        <div
          className={`overflow-hidden transition-all duration-500 ease-in-out ${isFiltersVisible
            ? 'max-h-[80vh] sm:max-h-[600px] opacity-100 overflow-y-auto'
            : 'max-h-0 opacity-0'
            }`}
        >
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-6 shadow-lg space-y-4 sm:space-y-6">
            <div className="flex flex-wrap gap-4">
              <FilterButton
                label="All Agendas"
                isActive={selectedAgenda === 'All'}
                onClick={() => setSelectedAgenda('All')}
              />
              {AIAgendas.map(agenda => (
                <FilterButton
                  key={agenda}
                  label={agenda}
                  isActive={selectedAgenda === agenda}
                  onClick={() => setSelectedAgenda(agenda)}
                />
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <DateRangeSelector
                startDate={startDate}
                endDate={endDate}
                onStartDateChange={setStartDate}
                onEndDateChange={setEndDate}
              />
            </div>

            <div className="relative">
              <input
                type="text"
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-full px-4 py-2 pl-10 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X size={20} />
                </button>
              )}
            </div>

            <button
              onClick={clearFilters}
              className="w-full px-4 py-2 bg-purple-500 text-white rounded-full hover:bg-purple-600 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {filteredItems.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredItems.map((item) => (
              <FeedItem key={item._id} item={item} />
            ))}
          </div>
        ) : (
          <NoResultsMessage selectedAgenda={selectedAgenda} />
        )}

        {filteredItems.length > 0 && (
          <div className="flex justify-center">
            <button className="group flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 transform hover:scale-105">
              <span className="font-medium">Load More</span>
              <ArrowRight size={18} className="transform group-hover:translate-x-1 transition-transform duration-300" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AISafetyFeed;