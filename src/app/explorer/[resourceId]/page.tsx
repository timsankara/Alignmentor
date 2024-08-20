'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { MessageSquare, Search, MessageCircle, Highlighter, Copy, Globe, Languages, HelpCircle, Moon, Sun } from 'lucide-react';
import { DynamoDB } from 'aws-sdk';
import { Viewer, SpecialZoomLevel } from '@react-pdf-viewer/core';
import { pageNavigationPlugin } from '@react-pdf-viewer/page-navigation';

// Import styles
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';

// Dynamically import the Worker component
const PDFWorker = dynamic(
  () => import('@react-pdf-viewer/core').then(mod => mod.Worker),
  { ssr: false }
);

interface ExplorerPageProps {
  params: { resourceId: string };
}

interface TooltipProps {
  x: number;
  y: number;
  onComment: () => void;
  onHighlight: () => void;
  onCopy: () => void;
  onSearch: () => void;
  onTranslate: () => void;
  onAskQuestion: () => void;
}

interface Discussion {
  user: string;
  text: string;
  replyTo?: string;
  pdfPosition?: { pageIndex: number; top: number };
}

const Tooltip: React.FC<TooltipProps> = ({ x, y, onComment, onHighlight, onCopy, onSearch, onTranslate, onAskQuestion }) => (
  <div
    style={{
      position: 'absolute',
      left: `${x}px`,
      top: `${y}px`,
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderRadius: '12px',
      padding: '8px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
      zIndex: 1000,
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
    }}
  >
    <div className="grid grid-cols-3 gap-2">
      <TooltipButton icon={<MessageCircle size={16} />} label="Comment" onClick={onComment} />
      <TooltipButton icon={<Highlighter size={16} />} label="Highlight" onClick={onHighlight} />
      <TooltipButton icon={<Copy size={16} />} label="Copy" onClick={onCopy} />
      <TooltipButton icon={<Globe size={16} />} label="Search" onClick={onSearch} />
      <TooltipButton icon={<Languages size={16} />} label="Translate" onClick={onTranslate} />
      <TooltipButton icon={<HelpCircle size={16} />} label="Ask" onClick={onAskQuestion} />
    </div>
  </div>
);

const TooltipButton: React.FC<{ icon: React.ReactNode; label: string; onClick: () => void }> = ({ icon, label, onClick }) => (
  <button
    onClick={onClick}
    className="flex flex-col items-center justify-center p-2 rounded-lg transition-all hover:bg-gray-100 dark:hover:bg-gray-700"
    style={{ width: '60px', height: '60px' }}
  >
    {icon}
    <span className="mt-1 text-xs font-medium text-gray-600 dark:text-gray-300">{label}</span>
  </button>
);

const ExplorerPage: React.FC<ExplorerPageProps> = ({ params }) => {
  const [pdfUrl, setPdfUrl] = useState('');
  const [discussions, setDiscussions] = useState<Discussion[]>([]);
  const [query, setQuery] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [activeTab, setActiveTab] = useState('discussions');
  const [isLoading, setIsLoading] = useState(true);
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [selectedText, setSelectedText] = useState('');
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [highlightedText, setHighlightedText] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [paperTitle, setPaperTitle] = useState("")
  const pdfContainerRef = useRef<HTMLDivElement>(null);
  const pdfViewerRef = useRef<Viewer>(null);
  const pageNavigationPluginInstance = pageNavigationPlugin();
  const { jumpToPage } = pageNavigationPluginInstance;

  // Initialize DynamoDB client
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
    const handleClickOutside = (event: MouseEvent) => {
      if (pdfContainerRef.current && !pdfContainerRef.current.contains(event.target as Node)) {
        setShowTooltip(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const fetchPdfData = async (id: string) => {
    setIsLoading(true);
    try {
      const params = {
        TableName: 'AISafetyContent',
        Key: {
          id: id
        }
      };
      const result = await dynamodb.get(params).promise();

      if (result.Item) {
        const arxivId = result.Item.link.split('/').pop();
        setPaperTitle(result.Item.title)
        setPdfUrl(`${API_BASE_URL}/api/pdf/${arxivId}`);
        setDiscussions(result.Item.discussions || []);
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
    setAiResponse('Processing your query...');
    // Implement actual AI query logic here
    setTimeout(() => {
      setAiResponse(`AI response to: "${query}"`);
    }, 1000);
  };

  const handleTextSelection = () => {
    const selection = window.getSelection();
    if (selection && selection.toString().trim() !== '') {
      setSelectedText(selection.toString());
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      setTooltipPosition({
        x: rect.left + window.scrollX,
        y: rect.bottom + window.scrollY,
      });
    } else {
      setSelectedText('');
    }
  };

  const handleRightClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (selectedText) {
      setShowTooltip(true);
    }
  };

  const handleComment = () => {
    console.log('Comment on:', selectedText);
    // Implement comment functionality
    setShowTooltip(false);
  };

  const handleHighlight = () => {
    console.log('Highlight:', selectedText);
    // Implement highlight functionality
    setShowTooltip(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedText);
    setShowTooltip(false);
  };

  const handleSearch = () => {
    window.open(`https://www.google.com/search?q=${encodeURIComponent(selectedText)}`, '_blank');
    setShowTooltip(false);
  };

  const handleTranslate = () => {
    window.open(`https://translate.google.com/?text=${encodeURIComponent(selectedText)}`, '_blank');
    setShowTooltip(false);
  };

  const handleAskQuestion = () => {
    setActiveTab('discussions');
    setDiscussions([...discussions, {
      user: 'You',
      text: selectedText,
      replyTo: undefined,
      pdfPosition: { pageIndex: currentPageIndex, top: window.scrollY }
    }]);
    setQuery('');
    setShowTooltip(false);
  };

  const handleDiscussionTextClick = (text: string, pdfPosition?: { pageIndex: number; top: number }) => {
    if (pdfPosition && jumpToPage) {
      jumpToPage(pdfPosition.pageIndex);
      setTimeout(() => {
        if (pdfContainerRef.current) {
          pdfContainerRef.current.scrollTo(0, pdfPosition.top);
        }
      }, 100);
      setHighlightedText(text);
      setTimeout(() => setHighlightedText(''), 3000); // Remove highlight after 3 seconds
    }
  };

  const renderPage = useCallback(
    (props: any) => (
      <>
        {props.canvasLayer.children}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
        }}>
          {highlightedText && (
            <mark style={{
              backgroundColor: 'rgba(255, 213, 79, 0.4)',
              color: 'inherit',
            }}>
              {highlightedText}
            </mark>
          )}
        </div>
        {props.textLayer.children}
        {props.annotationLayer.children}
      </>
    ),
    [highlightedText]
  );

  const handlePageChange = (e: any) => {
    setCurrentPageIndex(e.currentPage);
  };

  const TabButton: React.FC<{ icon: React.ReactNode, label: string, isActive: boolean, onClick: () => void }> = ({ icon, label, isActive, onClick }) => (
    <button
      onClick={onClick}
      className={`flex items-center px-4 py-2 mr-2 rounded-full transition-all ${isActive ? 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
    >
      {icon}
      <span className="ml-2 font-medium">{label}</span>
    </button>
  );

  const LoadingSpinner: React.FC = () => (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-gray-900 dark:border-gray-100"></div>
    </div>
  );

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className={`flex flex-col h-screen bg-white dark:bg-gray-900 transition-colors duration-200`}>
      <header className="flex justify-between items-center p-4 bg-gray-100 dark:bg-gray-800">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Explore {paperTitle}</h1>
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
        >
          {darkMode ? <Sun className="text-gray-200" /> : <Moon className="text-gray-800" />}
        </button>
      </header>
      <div className="flex flex-1 overflow-hidden">
        <div className="w-1/2 p-4 border-r border-gray-200 dark:border-gray-700" ref={pdfContainerRef}>
          <PDFWorker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
            <div
              style={{ height: 'calc(100vh - 8rem)' }}
              onMouseUp={handleTextSelection}
              onContextMenu={handleRightClick}
              className="rounded-lg overflow-hidden shadow-lg"
            >
              <Viewer
                fileUrl={pdfUrl}
                defaultScale={SpecialZoomLevel.PageFit}
                onPageChange={handlePageChange}
                renderPage={renderPage}
                ref={pdfViewerRef}
              />
            </div>
          </PDFWorker>
          {showTooltip && (
            <Tooltip
              x={tooltipPosition.x}
              y={tooltipPosition.y}
              onComment={handleComment}
              onHighlight={handleHighlight}
              onCopy={handleCopy}
              onSearch={handleSearch}
              onTranslate={handleTranslate}
              onAskQuestion={handleAskQuestion}
            />
          )}
        </div>
        <div className="w-1/2 p-6 bg-gray-50 dark:bg-gray-800">
          <div className="flex mb-6 bg-white dark:bg-gray-700 rounded-full p-1 shadow-sm">
            <TabButton
              icon={<MessageSquare size={20} />}
              label="Discussions"
              isActive={activeTab === 'discussions'}
              onClick={() => setActiveTab('discussions')}
            />
            <TabButton
              icon={<Search size={20} />}
              label="AI Query"
              isActive={activeTab === 'ai-query'}
              onClick={() => setActiveTab('ai-query')}
            />
          </div>
          {activeTab === 'discussions' && (
            <div className="space-y-4">
              {discussions.map((discussion: Discussion, index: number) => (
                <div key={index} className="p-4 bg-white dark:bg-gray-700 rounded-lg shadow-sm transition-all hover:shadow-md">
                  {discussion.replyTo && (
                    <div className="mb-2 p-2 bg-gray-50 dark:bg-gray-600 rounded border-l-4 border-blue-400">
                      <p className="text-sm text-gray-600 dark:text-gray-300">{discussion.replyTo}</p>
                    </div>
                  )}
                  <p className="font-semibold text-gray-800 dark:text-gray-200 mb-2">{discussion.user}</p>
                  <p
                    className="text-gray-700 dark:text-gray-300 cursor-pointer hover:bg-yellow-50 dark:hover:bg-gray-600 rounded p-1 transition-all"
                    onClick={() => handleDiscussionTextClick(discussion.text, discussion.pdfPosition)}
                  >
                    {discussion.text}
                  </p>
                </div>
              ))}
              <div className="mt-4">
                <input
                  type="text"
                  placeholder="Ask a question..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500 transition-all bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                />
                <button
                  onClick={handleQuery}
                  className="mt-2 w-full py-3 bg-blue-500 text-white rounded-full transition-all hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-500"
                >
                  Ask Question
                </button>
              </div>
            </div>
          )}
          {activeTab === 'ai-query' && (
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Ask AI about the paper..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500 transition-all bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
              />
              <button
                onClick={handleQuery}
                className="mt-2 w-full py-3 bg-blue-500 text-white rounded-full transition-all hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-500"
              >
                Submit Query
              </button>
              {aiResponse && (
                <div className="mt-4 p-4 bg-white dark:bg-gray-700 rounded-lg shadow-sm transition-all hover:shadow-md">
                  <p className="font-semibold text-gray-800 dark:text-gray-200 mb-2">AI Response:</p>
                  <p className="text-gray-700 dark:text-gray-300">{aiResponse}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExplorerPage;