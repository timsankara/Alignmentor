/* eslint-disable react/no-unescaped-entities */
'use client'

import React, { useState, useEffect } from 'react';
import { Sun, Moon, ChevronRight, Rss, GraduationCap, Brain, Zap, Users } from 'lucide-react';
import Link from 'next/link';
import Feed from "./feed/page"

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
      <header className="container mx-auto px-4 py-6 flex justify-between items-center">
        <h1 className="text-2xl font-semibold">AI Safety Feed</h1>
        {/* <button
          onClick={toggleDarkMode}
          className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 transition-all duration-300 hover:rotate-12"
          aria-label="Toggle dark mode"
        >
          {darkMode ? <Sun size={24} /> : <Moon size={24} />}
        </button> */}
      </header>

      <main className="container mx-auto px-4 pt-16 space-y-24">
        <section className="text-center space-y-6">
          <h2 className="text-5xl font-bold leading-tight">
            {/* <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-green-600">
              Latest in AI safety
            </span> */}
            {/* <br /> */}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-green-600">
              Learn, and Contribute to AIS
            </span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto" hidden>
            Discover a powerful dual platform: a curated feed of cutting-edge AI safety content
            and an interactive learning tool to deepen your understanding of this critical field.
          </p>
          {/* <div className="flex justify-center space-x-4">
            <Link href="/feed" passHref>
              <button className="px-6 py-3 bg-blue-600 text-white text-lg font-semibold rounded-full hover:bg-blue-700 transition-all duration-300 transform hover:scale-105"
              >
                Explore the Feed
              </button>
            </Link>
            <button className="px-6 py-3 bg-green-600 text-white text-lg font-semibold rounded-full hover:bg-green-700 transition-all duration-300 transform hover:scale-105">
              Start Learning
            </button>
          </div> */}
        </section>

        <Feed />

        <section className="grid md:grid-cols-2 gap-12">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`space-y-4 p-6 rounded-2xl transition-all duration-300 transform hover:scale-105 cursor-pointer ${activeFeature === index ? 'bg-white dark:bg-gray-800 shadow-lg' : ''
                }`}
              onMouseEnter={() => setActiveFeature(index)}
              hidden
            >
              <feature.icon size={48} className={`${feature.color}`} />
              <h3 className="text-2xl font-semibold">{feature.title}</h3>
              <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
            </div>
          ))}
        </section>

        <section className="bg-white dark:bg-gray-800 rounded-3xl p-12 shadow-lg transition-all duration-300 hover:shadow-xl" hidden>
          <h2 className="text-3xl font-semibold mb-8">Join Our Community</h2>
          <p className="text-xl mb-8">
            Whether you're an AI researcher, enthusiast, or just curious about AI safety,
            there's a place for you here. Contribute, learn, and connect with like-minded individuals.
          </p>
          <a
            href="#"
            className="inline-flex items-center text-blue-600 dark:text-blue-400 text-lg font-semibold hover:underline group"
          >
            Sign up now
            <ChevronRight className="ml-2 transition-transform duration-300 group-hover:translate-x-2" />
          </a>
        </section>

        <section className="text-center" hidden>
          <h2 className="text-4xl font-bold mb-8">What Our Users Say</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {[
              { name: 'Alex Chen', quote: 'This platform has dramatically accelerated my understanding of AI safety while keeping me updated with the latest developments.' },
              { name: 'Sarah Johnson', quote: 'An indispensable resource for both staying informed and deepening my knowledge in AI safety. The learning path is particularly valuable.' },
            ].map((testimonial, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
                <p className="text-lg mb-4">"{testimonial.quote}"</p>
                <p className="font-semibold">{testimonial.name}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="container mx-auto px-4 py-8 text-center text-gray-600 dark:text-gray-400">
        <p>&copy; 2024 AI Safety Feed. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;