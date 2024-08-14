/* eslint-disable react/no-unescaped-entities */
'use client'

import React, { useState, useEffect } from 'react';
import { Sun, Moon, ChevronRight, Rss, GraduationCap, Brain, Zap, Users } from 'lucide-react';
import Link from 'next/link';
import Feed from "./feed/page"
import Learn from "./learn/page"

const Home = () => {
  const [darkMode, setDarkMode] = useState(true);
  const [activeFeature, setActiveFeature] = useState(0);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  const features = [
    {
      title: 'Curated AI Safety Feed',
      description: 'Stay updated with a personalized stream of the latest AI safety research, news, and discussions.',
      icon: Rss,
      color: 'text-blue-600 dark:text-blue-400'
    },
    {
      title: 'Interactive Learning Path',
      description: 'Embark on a structured journey to deepen your understanding of AI safety concepts and challenges.',
      icon: GraduationCap,
      color: 'text-green-600 dark:text-green-400'
    },
    {
      title: 'Expert Insights',
      description: 'Gain knowledge from leading AI safety researchers through exclusive content and analyses.',
      icon: Brain,
      color: 'text-purple-600 dark:text-purple-400'
    },
    {
      title: 'Progress Tracking',
      description: 'Monitor your learning journey with intuitive progress indicators and knowledge assessments.',
      icon: Zap,
      color: 'text-yellow-600 dark:text-yellow-400'
    },
  ];

  return (
    <div className="min-h-screen font-sans bg-gray-900 text-gray-900 dark:bg-gray-900 dark:text-white transition-all duration-300">
      <Learn />
      <footer className="container mx-auto px-4 py-8 text-center text-gray-600 dark:text-gray-400">
        <p>&copy; 2024 AI Safety Feed. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;