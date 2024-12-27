/* eslint-disable react/no-unescaped-entities */
"use client";

import React, { useState, useEffect } from "react";
import { DynamoDB } from "aws-sdk";
import { MessageCircle, Moon, Sun } from "lucide-react";
import PDFViewer from "./PDFViewer";
import AIAssistant from "./AIAssistant";
import { motion } from "framer-motion";

interface ExplorerPageProps {
  params: { resourceId: string };
}

const AILoader: React.FC = () => (
  <div className="flex flex-col items-center justify-center h-screen bg-white dark:bg-gray-900">
    <motion.div
      className="relative w-24 h-24"
      animate={{ rotate: 360 }}
      transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
    >
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{
          border: "2px solid rgba(0, 0, 0, 0.1)",
          borderTopColor: "#007AFF",
          borderLeftColor: "#007AFF",
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute inset-2 rounded-full"
        style={{
          border: "2px solid rgba(0, 0, 0, 0.1)",
          borderTopColor: "#FF9500",
          borderLeftColor: "#FF9500",
        }}
        animate={{ rotate: -360 }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute inset-4 rounded-full bg-white dark:bg-gray-900"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{
          duration: 0.5,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut",
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

const ExplorerPage: React.FC<ExplorerPageProps> = ({ params }) => {
  const [pdfUrl, setPdfUrl] = useState("");
  const [paperTitle, setPaperTitle] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [showAiPanel, setShowAiPanel] = useState(true);
  const [showAiIntro, setShowAiIntro] = useState(true);
  const [pdfFileId, setPdfFileId] = useState("");

  const dynamodb = new DynamoDB.DocumentClient({
    region: "us-east-1",
    accessKeyId: "AKIA55SBB5ENSF3SCWFI",
    secretAccessKey: "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",
  });

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";

  useEffect(() => {
    if (params.resourceId) {
      fetchPdfData(params.resourceId);
    }
  }, [params.resourceId]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  const fetchPdfData = async (id: string) => {
    setIsLoading(true);
    try {
      const params = {
        TableName: "AISafetyContent",
        Key: { id: id },
      };
      const result = await dynamodb.get(params).promise();
      if (result.Item) {
        const arxivId = result.Item.link.split("/").pop();
        setPaperTitle(result.Item.title);
        setPdfUrl(`${API_BASE_URL}/api/pdf/${arxivId}`);
        setPdfFileId(result.Item.id);
      } else {
        console.error("Item not found or not a paper");
      }
    } catch (error) {
      console.error("Error fetching data from DynamoDB:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <AILoader />;
  }

  return (
    <div
      className={`flex flex-col h-screen ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
      }`}
    >
      <header
        className={`flex justify-between items-center p-4 ${
          darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
        } border-b`}
      >
        <h1 className="text-2xl font-bold truncate max-w-2xl">{paperTitle}</h1>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setShowAiPanel(!showAiPanel)}
            className={`relative flex items-center justify-center p-3 rounded-full text-white transition-all duration-300 ease-in-out shadow-2xl ${
              showAiPanel
                ? "bg-gradient-to-r from-blue-500 to-blue-600"
                : "bg-gradient-to-r from-blue-400 to-blue-500"
            } hover:from-blue-600 hover:to-blue-700 transform hover:scale-105`}
            style={{ minWidth: "200px" }}
          >
            {!showAiPanel && (
              <span className="absolute -top-2 -right-2 bg-red-500 rounded-full w-4 h-4 animate-pulse" />
            )}
            <MessageCircle size={18} className="mr-2" />
            <span className="font-semibold text-lg">AI Assistant</span>
          </button>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`p-2 rounded-full ${
              darkMode
                ? "bg-gray-700 text-gray-200"
                : "bg-gray-200 text-gray-800"
            } hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200 shadow-lg group relative`}
          >
            {darkMode ? <Sun size={24} /> : <Moon size={24} />}
            <span className="absolute hidden group-hover:block bottom-full mb-2 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-gray-800 text-white text-xs rounded whitespace-nowrap">
              Toggle Dark Mode
            </span>
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        <PDFViewer
          pdfUrl={pdfUrl}
          darkMode={darkMode}
          showAiIntro={showAiIntro}
          setShowAiIntro={setShowAiIntro}
          setShowAiPanel={setShowAiPanel}
        />
        <AIAssistant
          darkMode={darkMode}
          showAiPanel={showAiPanel}
          setShowAiPanel={setShowAiPanel}
          pdfFileId={pdfFileId}
        />
      </div>
    </div>
  );
};

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("PDF Explorer Error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-50 dark:bg-gray-900">
          <div className="max-w-md p-8 bg-white dark:bg-gray-800 rounded-lg shadow-xl">
            <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">
              Something went wrong
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              We encountered an error while loading the document. Please try
              refreshing the page or contact support if the problem persists.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const WrappedExplorerPage: React.FC<ExplorerPageProps> = (props) => {
  return (
    <ErrorBoundary>
      <ExplorerPage {...props} />
    </ErrorBoundary>
  );
};

export default WrappedExplorerPage;
