'use client'

import React, { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ArrowLeft, ArrowRight, ZoomIn, ZoomOut, Moon, Sun, MessageCircle, X, Send, HelpCircle, BookOpen } from 'lucide-react';
import { DynamoDB } from 'aws-sdk';
import { Viewer, SpecialZoomLevel } from '@react-pdf-viewer/core';
import { pageNavigationPlugin } from '@react-pdf-viewer/page-navigation';
import { zoomPlugin } from '@react-pdf-viewer/zoom';

import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/page-navigation/lib/styles/index.css';
import '@react-pdf-viewer/zoom/lib/styles/index.css';

const PDFWorker = dynamic(() => import('@react-pdf-viewer/core').then(mod => mod.Worker), { ssr: false });

interface ExplorerPageProps {
  params: { resourceId: string };
}

const AILoader: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-white dark:bg-gray-900">
      <motion.div
        className="relative w-24 h-24"
        animate={{
          rotate: 360,
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "linear"
        }}
      >
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            border: '2px solid rgba(0, 0, 0, 0.1)',
            borderTopColor: '#007AFF',
            borderLeftColor: '#007AFF',
          }}
          animate={{
            rotate: 360,
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div
          className="absolute inset-2 rounded-full"
          style={{
            border: '2px solid rgba(0, 0, 0, 0.1)',
            borderTopColor: '#FF9500',
            borderLeftColor: '#FF9500',
          }}
          animate={{
            rotate: -360,
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div
          className="absolute inset-4 rounded-full bg-white dark:bg-gray-900"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            duration: 0.5,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut"
          }}
        />
      </motion.div>
      <motion.h2
        className="mt-8 text-2xl font-light text-gray-800 dark:text-gray-200"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        Loading AI Paper
      </motion.h2>
      <motion.p
        className="mt-2 text-sm text-gray-500 dark:text-gray-400"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        Please hold on as we start your session
      </motion.p>
    </div>
  );
};

const ExplorerPage: React.FC<ExplorerPageProps> = ({ params }) => {
  const [pdfUrl, setPdfUrl] = useState('');
  const [paperTitle, setPaperTitle] = useState('');
  const [query, setQuery] = useState('');
  const [aiResponses, setAiResponses] = useState<{ role: 'user' | 'ai', content: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [scale, setScale] = useState(SpecialZoomLevel.PageFit);
  const [showAiPanel, setShowAiPanel] = useState(false);
  const [showAiIntro, setShowAiIntro] = useState(true);

  const pdfContainerRef = useRef<HTMLDivElement>(null);
  const aiInputRef = useRef<HTMLTextAreaElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const pageNavigationPluginInstance = pageNavigationPlugin();
  const { jumpToPage } = pageNavigationPluginInstance;

  const zoomPluginInstance = zoomPlugin();
  const { ZoomIn: ZoomInButton, ZoomOut: ZoomOutButton } = zoomPluginInstance;

  const dynamodb = new DynamoDB.DocumentClient({
    region: "us-east-1",
    accessKeyId: "AKIA55SBB5ENSF3SCWFI",
    secretAccessKey: "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",
  });
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '';

  useEffect(() => {
    if (params.resourceId) {
      fetchPdfData(params.resourceId);
    }
  }, [params.resourceId]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [aiResponses]);

  const fetchPdfData = async (id: string) => {
    setIsLoading(true);
    try {
      const params = {
        TableName: 'AISafetyContent',
        Key: { id: id }
      };
      const result = await dynamodb.get(params).promise();
      if (result.Item) {
        const arxivId = result.Item.link.split('/').pop();
        setPaperTitle(result.Item.title);
        setPdfUrl(`${API_BASE_URL}/api/pdf/${arxivId}`);
      } else {
        console.error('Item not found or not a paper');
      }
    } catch (error) {
      console.error('Error fetching data from DynamoDB:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuery = async () => {
    if (!query.trim()) return;

    const userQuery = query.trim();
    setAiResponses(prev => [...prev, { role: 'user', content: userQuery }]);
    setQuery('');

    // Simulate AI response (replace with actual RAG-powered AI integration)
    setTimeout(() => {
      setAiResponses(prev => [...prev, { role: 'ai', content: `Here's what I found regarding "${userQuery}" in the context of this paper, using my RAG-powered analysis: [AI-generated response would go here]` }]);
    }, 1000);
  };

  const handlePageChange = (e: any) => {
    setCurrentPage(e.currentPage);
  };

  const handleDocumentLoad = (e: any) => {
    setTotalPages(e.doc.numPages);
  };

  const suggestedPrompts = [
    "Summarize the main points of this paper",
    "Explain the methodology used in this research",
    "What are the key findings of this study?",
    "How does this paper contribute to the field?",
    "Are there any limitations to this research?",
  ];

  if (isLoading) {
    return <AILoader />;
  }

  return (
    <div className={`flex flex-col h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <header className={`flex justify-between items-center p-4 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b`}>
        <h1 className="text-2xl font-bold truncate max-w-2xl">{paperTitle}</h1>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setShowAiPanel(!showAiPanel)}
            className={`p-2 rounded-full ${showAiPanel ? 'bg-blue-600' : 'bg-blue-500'} text-white hover:bg-blue-600 transition-colors duration-200 shadow-lg relative group`}
          >
            {!showAiPanel && (
              <span className="absolute -top-1 -right-1 bg-red-500 rounded-full w-3 h-3"></span>
            )}
            <MessageCircle size={24} />
            <span className="absolute hidden group-hover:block bottom-full mb-2 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-gray-800 text-white text-xs rounded whitespace-nowrap">
              Toggle AI Assistant
            </span>
          </button>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`p-2 rounded-full ${darkMode ? 'bg-gray-700 text-gray-200' : 'bg-gray-200 text-gray-800'} hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200 shadow-lg group relative`}
          >
            {darkMode ? <Sun size={24} /> : <Moon size={24} />}
            <span className="absolute hidden group-hover:block bottom-full mb-2 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-gray-800 text-white text-xs rounded whitespace-nowrap">
              Toggle Dark Mode
            </span>
          </button>
        </div>
      </header>
      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 relative" ref={pdfContainerRef}>
          <PDFWorker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
            <div style={{ height: 'calc(100vh - 8rem)' }} className="overflow-auto">
              <Viewer
                fileUrl={pdfUrl}
                defaultScale={scale}
                onPageChange={handlePageChange}
                onDocumentLoad={handleDocumentLoad}
                plugins={[pageNavigationPluginInstance, zoomPluginInstance]}
              />
            </div>
          </PDFWorker>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={`absolute bottom-4 left-0 right-0 mx-auto w-max ${darkMode ? 'bg-gray-800' : 'bg-white'} p-2 rounded-full shadow-lg flex items-center space-x-4`}
          >
            <button
              onClick={() => jumpToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className={`p-2 rounded-full ${darkMode ? 'bg-gray-700 text-gray-200' : 'bg-gray-200 text-gray-800'} hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 transition-colors duration-200`}
            >
              <ArrowLeft size={20} />
            </button>
            <span className="font-medium">
              {currentPage + 1} / {totalPages}
            </span>
            <button
              onClick={() => jumpToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`p-2 rounded-full ${darkMode ? 'bg-gray-700 text-gray-200' : 'bg-gray-200 text-gray-800'} hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 transition-colors duration-200`}
            >
              <ArrowRight size={20} />
            </button>
            <ZoomOutButton>
              {(props) => (
                <button
                  onClick={props.onClick}
                  className={`p-2 rounded-full ${darkMode ? 'bg-gray-700 text-gray-200' : 'bg-gray-200 text-gray-800'} hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200`}
                >
                  <ZoomOut size={20} />
                </button>
              )}
            </ZoomOutButton>
            <ZoomInButton>
              {(props) => (
                <button
                  onClick={props.onClick}
                  className={`p-2 rounded-full ${darkMode ? 'bg-gray-700 text-gray-200' : 'bg-gray-200 text-gray-800'} hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200`}
                >
                  <ZoomIn size={20} />
                </button>
              )}
            </ZoomInButton>
          </motion.div>

          <AnimatePresence>
            {showAiIntro && (
              <motion.div
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                className={`absolute top-4 left-4 right-4 ${darkMode ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-800'} p-4 rounded-lg shadow-lg flex items-center justify-between`}
              >
                <div className="flex items-center space-x-4">
                  <HelpCircle size={24} className={darkMode ? 'text-blue-300' : 'text-blue-500'} />
                  <div>
                    <p className="font-semibold">Need help understanding this paper?</p>
                    <p>Our RAG-powered AI Assistant can analyze the content and answer your questions!</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowAiIntro(false)}
                  className={`${darkMode ? 'hover:text-blue-400' : 'hover:text-blue-600'}`}
                >
                  <X size={20} />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <AnimatePresence>
          {showAiPanel && (
            <motion.div
              initial={{ x: '100%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '100%', opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className={`w-96 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-2xl flex flex-col`}
            >
              <div className={`p-4 ${darkMode ? 'border-gray-700' : 'border-gray-200'} border-b flex justify-between items-center`}>
                <h2 className="text-xl font-bold">RAG AI Assistant</h2>
                <button
                  onClick={() => setShowAiPanel(false)}
                  className={`p-1 rounded-full ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'} transition-colors duration-200`}
                >
                  <X size={24} className={darkMode ? 'text-gray-400' : 'text-gray-600'} />
                </button>
              </div>
              <div ref={chatContainerRef} className="flex-1 overflow-auto p-4 space-y-4">
                {aiResponses.length === 0 && (
                  <div className={`text-center ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    <BookOpen size={48} className="mx-auto mb-2" />
                    <p className="font-semibold">Welcome to your AI Research Assistant!</p>
                    <p>I've analyzed this paper using RAG technology. Ask me anything about the content, methodology, or implications.</p>
                  </div>
                )}
                {aiResponses.map((response, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`p-3 rounded-lg ${response.role === 'user'
                      ? darkMode ? 'bg-blue-900 ml-8' : 'bg-blue-100 ml-8'
                      : darkMode ? 'bg-gray-700 mr-8' : 'bg-gray-100 mr-8'
                      }`}
                  >
                    <p className={`text-sm ${response.role === 'user'
                      ? darkMode ? 'text-blue-200' : 'text-blue-800'
                      : darkMode ? 'text-gray-200' : 'text-gray-800'
                      }`}>
                      {response.content}
                    </p>
                  </motion.div>
                ))}
              </div>
              <div className={`p-4 ${darkMode ? 'border-gray-700' : 'border-gray-200'} border-t`}>
                <div className="mb-2">
                  <p className="text-sm font-semibold mb-1">Suggested prompts:</p>
                  <div className="flex flex-wrap gap-2">
                    {suggestedPrompts.map((prompt, index) => (
                      <button
                        key={index}
                        onClick={() => setQuery(prompt)}
                        className={`text-xs px-2 py-1 rounded-full ${darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'} transition-colors duration-200`}
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="relative">
                  <textarea
                    ref={aiInputRef}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleQuery();
                      }
                    }}
                    placeholder="Ask about the paper..."
                    className={`w-full p-3 pr-12 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all resize-none ${darkMode
                      ? 'bg-gray-700 text-gray-200 border-gray-600'
                      : 'bg-white text-gray-800 border-gray-300'
                      }`}
                    rows={3}
                  />
                  <button
                    onClick={handleQuery}
                    className="absolute right-2 bottom-2 p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 transition-all duration-200"
                  >
                    <Send size={20} />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ExplorerPage;