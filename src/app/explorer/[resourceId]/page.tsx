'use client'

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { MessageSquare, Search } from 'lucide-react';
import { DynamoDB } from 'aws-sdk';

// Import styles
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';

// Dynamically import the Viewer component
const PDFViewer = dynamic(
  () => import('@react-pdf-viewer/core').then(mod => mod.Viewer),
  { ssr: false }
);

// Dynamically import the Worker component
const PDFWorker = dynamic(
  () => import('@react-pdf-viewer/core').then(mod => mod.Worker),
  { ssr: false }
);

interface ExplorerPageProps {
  params: { resourceId: string };
}

const ExplorerPage: React.FC<ExplorerPageProps> = ({ params }) => {
  const [pdfUrl, setPdfUrl] = useState('');
  const [discussions, setDiscussions] = useState<any[]>([]);
  const [query, setQuery] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [activeTab, setActiveTab] = useState('discussions');
  const [isLoading, setIsLoading] = useState(true);

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

      if (result.Item && result.Item.type === 'paper') {
        const arxivId = result.Item.link.split('/').pop();
        // setPdfUrl(`https://arxiv.org/pdf/${arxivId}`);
        // console.log(`https://arxiv.org/pdf/${arxivId}`);
        setPdfUrl(`${API_BASE_URL}/api/pdf/${arxivId}`);
        console.log(`PDF URL: ${API_BASE_URL}/api/pdf/${arxivId}`);
        // setPdfUrl(`/api/pdf/${arxivId}`);
        // console.log(`PDF URL: /api/pdf/${arxivId}`);
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

  const TabButton: React.FC<{ icon: React.ReactNode, label: string, isActive: boolean, onClick: () => void }> = ({ icon, label, isActive, onClick }) => (
    <button
      onClick={onClick}
      className={`flex items-center px-4 py-2 mr-2 rounded-lg transition-all ${isActive ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        }`}
    >
      {icon}
      <span className="ml-2">{label}</span>
    </button>
  );

  const LoadingSpinner: React.FC = () => (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="w-3/5 p-8 overflow-auto">
        {/* I set this @dist manually to align with what was installed */}
        <PDFWorker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
          <div style={{ height: 'calc(100vh - 4rem)' }}>
            <PDFViewer fileUrl={pdfUrl} />
          </div>
        </PDFWorker>
      </div>
      <div className="w-2/5 p-8 bg-white shadow-lg">
        <div className="flex mb-6">
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
            {discussions.map((discussion: any, index: number) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg shadow">
                <p className="font-semibold text-gray-700 mb-2">{discussion.user}</p>
                <p className="text-gray-600">{discussion.text}</p>
              </div>
            ))}
          </div>
        )}
        {activeTab === 'ai-query' && (
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Ask a question about the paper..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleQuery}
              className="w-full py-3 bg-blue-500 text-white rounded-lg transition-all hover:bg-blue-600"
            >
              Submit Query
            </button>
            {aiResponse && (
              <div className="p-4 bg-gray-50 rounded-lg shadow">
                <p className="font-semibold text-gray-700 mb-2">AI Response:</p>
                <p className="text-gray-600">{aiResponse}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ExplorerPage;