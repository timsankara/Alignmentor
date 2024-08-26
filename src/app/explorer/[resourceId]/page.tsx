'use client'

import React, { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MessageCircle, Sparkles, ChevronUp, ChevronDown, X } from 'lucide-react';
import { DynamoDB } from 'aws-sdk';
import { Viewer, SpecialZoomLevel } from '@react-pdf-viewer/core';
import { pageNavigationPlugin } from '@react-pdf-viewer/page-navigation';

import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';

const PDFWorker = dynamic(
  () => import('@react-pdf-viewer/core').then(mod => mod.Worker),
  { ssr: false }
);

interface ExplorerPageProps {
  params: { resourceId: string };
}

const ExplorerPage: React.FC<ExplorerPageProps> = ({ params }) => {
  const [pdfUrl, setPdfUrl] = useState('');
  const [paperTitle, setPaperTitle] = useState('');
  const [query, setQuery] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedText, setSelectedText] = useState('');
  const [showAIPanel, setShowAIPanel] = useState(false);
  const [aiConversation, setAiConversation] = useState<{ role: 'user' | 'ai'; content: string }[]>([]);

  const pdfContainerRef = useRef<HTMLDivElement>(null);
  const aiPanelRef = useRef<HTMLDivElement>(null);
  const pageNavigationPluginInstance = pageNavigationPlugin();

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

    setAiConversation(prev => [...prev, { role: 'user', content: query }]);
    setQuery('');
    setAiResponse('Thinking...');

    // Simulate AI response (replace with actual AI integration)
    setTimeout(() => {
      const aiReply = `Here's what I think about "${query}": [AI-generated response would go here]`;
      setAiConversation(prev => [...prev, { role: 'ai', content: aiReply }]);
      setAiResponse('');
    }, 1500);
  };

  const handleTextSelection = () => {
    const selection = window.getSelection();
    if (selection && selection.toString().trim() !== '') {
      setSelectedText(selection.toString().trim());
      setQuery(selection.toString().trim());
      setShowAIPanel(true);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <header className="bg-white shadow-sm z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-900">{paperTitle}</h1>
          <button
            onClick={() => setShowAIPanel(!showAIPanel)}
            className="flex items-center px-4 py-2 bg-black text-white rounded-full hover:bg-gray-800 transition-colors duration-200"
          >
            <Sparkles size={20} className="mr-2" />
            AI Assistant
          </button>
        </div>
      </header>

      <div className="flex-grow flex overflow-hidden">
        <div
          ref={pdfContainerRef}
          className="flex-grow overflow-auto"
          onMouseUp={handleTextSelection}
        >
          <PDFWorker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
            <Viewer
              fileUrl={pdfUrl}
              defaultScale={SpecialZoomLevel.PageFit}
              plugins={[pageNavigationPluginInstance]}
            />
          </PDFWorker>
        </div>

        <AnimatePresence>
          {showAIPanel && (
            <motion.div
              ref={aiPanelRef}
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="w-96 bg-white shadow-lg overflow-hidden flex flex-col"
            >
              <div className="p-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-900">AI Assistant</h2>
                <button onClick={() => setShowAIPanel(false)} className="text-gray-500 hover:text-gray-700">
                  <X size={20} />
                </button>
              </div>

              <div className="flex-grow overflow-auto p-4 space-y-4">
                {aiConversation.map((message, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg ${
                      message.role === 'user' ? 'bg-blue-100 ml-4' : 'bg-gray-100 mr-4'
                    }`}
                  >
                    {message.content}
                  </div>
                ))}
                {aiResponse && (
                  <div className="p-3 rounded-lg bg-gray-100 mr-4">
                    {aiResponse}
                  </div>
                )}
              </div>

              <div className="p-4 border-t border-gray-200">
                <div className="flex items-center bg-gray-100 rounded-full overflow-hidden">
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Ask about the paper..."
                    className="flex-grow px-4 py-2 bg-transparent focus:outline-none"
                  />
                  <button
                    onClick={handleQuery}
                    className="px-4 py-2 bg-black text-white rounded-full hover:bg-gray-800 transition-colors duration-200"
                  >
                    <MessageCircle size={20} />
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