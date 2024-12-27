/* eslint-disable react/no-unescaped-entities */
"use client";

import React, { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  ArrowLeft,
  ArrowRight,
  ZoomIn,
  ZoomOut,
  Moon,
  Sun,
  MessageCircle,
  X,
  Send,
  HelpCircle,
  BookOpen,
  User,
  Bot,
} from "lucide-react";
import { DynamoDB } from "aws-sdk";
import { Viewer, SpecialZoomLevel } from "@react-pdf-viewer/core";
import { pageNavigationPlugin } from "@react-pdf-viewer/page-navigation";
import { zoomPlugin } from "@react-pdf-viewer/zoom";
import OpenAI from "openai";

import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/page-navigation/lib/styles/index.css";
import "@react-pdf-viewer/zoom/lib/styles/index.css";
import "katex/dist/katex.min.css";
// import { InlineMath, BlockMath } from 'react-katex';
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";

const PDFWorker = dynamic(
  () => import("@react-pdf-viewer/core").then((mod) => mod.Worker),
  { ssr: false },
);

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
          ease: "linear",
        }}
      >
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            border: "2px solid rgba(0, 0, 0, 0.1)",
            borderTopColor: "#007AFF",
            borderLeftColor: "#007AFF",
          }}
          animate={{
            rotate: 360,
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: "linear",
          }}
        />
        <motion.div
          className="absolute inset-2 rounded-full"
          style={{
            border: "2px solid rgba(0, 0, 0, 0.1)",
            borderTopColor: "#FF9500",
            borderLeftColor: "#FF9500",
          }}
          animate={{
            rotate: -360,
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "linear",
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
};

const ExplorerPage: React.FC<ExplorerPageProps> = ({ params }) => {
  const [pdfUrl, setPdfUrl] = useState("");
  const [paperTitle, setPaperTitle] = useState("");
  const [query, setQuery] = useState("");
  const [aiResponses, setAiResponses] = useState<
    { role: "user" | "ai"; content: string }[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingAiResponse, setIsLoadingAiResponse] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [scale, setScale] = useState(SpecialZoomLevel.PageFit);
  const [showAiPanel, setShowAiPanel] = useState(false);
  const [showAiIntro, setShowAiIntro] = useState(true);
  const [pdf_file_id, setPdfFileId] = useState("");

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
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";

  const openai = new OpenAI({
    apiKey: "sk-proj-avXTs6KIIYIZgQBsuKglT3BlbkFJ7NWO4wHxPaR1e2nvVjti",
    dangerouslyAllowBrowser: true,
  });

  async function getThreadResponse() {
    console.log("Testing thread response");

    try {
      // Create a thread with the initial message
      const thread = await openai.beta.threads.create({
        messages: [
          {
            role: "user",
            content: query,
            attachments: [
              {
                file_id: pdf_file_id,
                tools: [{ type: "file_search" }],
              },
            ],
          },
        ],
      });

      // Create and start a run
      const run = await openai.beta.threads.runs.create(thread.id, {
        assistant_id: "asst_mWViXAv7irEltBwI5TMiDZ2x",
      });

      // Poll for the run to complete
      let runStatus;
      do {
        runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait for 1 second before polling again
      } while (
        runStatus.status !== "completed" &&
        runStatus.status !== "failed"
      );

      if (runStatus.status === "failed") {
        throw new Error("Run failed: " + runStatus.last_error?.message);
      }

      // Retrieve the messages
      const messages = await openai.beta.threads.messages.list(thread.id);

      // Get the last message from the assistant
      const lastMessage = messages.data.find(
        (message) => message.role === "assistant",
      );
      if (lastMessage && lastMessage.content[0].type === "text") {
        // setResponse(lastMessage.content[0].text.value);
        console.log(lastMessage.content[0].text.value);
      } else {
        // setResponse('No response from the assistant.');
        console.log("No response from assistant");
      }
    } catch (err) {
      console.error("Error:", err);
      // setError(err.message);
    }
  }

  useEffect(() => {
    if (params.resourceId) {
      fetchPdfData(params.resourceId);
    }
  }, [params.resourceId]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [aiResponses]);

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

  // const handleQuery = async () => {
  //   if (!query.trim()) return;

  //   const userQuery = query.trim();
  //   setAiResponses(prev => [...prev, { role: 'user', content: userQuery }]);
  //   setQuery('');

  //   // Simulate AI response (replace with actual RAG-powered AI integration)
  //   setTimeout(() => {
  //     setAiResponses(prev => [...prev, { role: 'ai', content: `Here's what I found regarding "${userQuery}" in the context of this paper, using my RAG-powered analysis: [AI-generated response would go here]` }]);
  //   }, 1000);
  // };
  const handleQuery = async () => {
    if (!query.trim()) return;

    const userQuery = query.trim();
    setAiResponses((prev) => [...prev, { role: "user", content: userQuery }]);
    setQuery("");
    setIsLoadingAiResponse(true);

    try {
      // Create a thread with the initial message
      const thread = await openai.beta.threads.create({
        messages: [
          {
            role: "user",
            content: userQuery,
            attachments: [
              {
                file_id: pdf_file_id,
                tools: [{ type: "file_search" }],
              },
            ],
          },
        ],
      });

      // Create and start a run
      const run = await openai.beta.threads.runs.create(thread.id, {
        assistant_id: "asst_mWViXAv7irEltBwI5TMiDZ2x",
      });

      // Poll for the run to complete
      let runStatus;
      do {
        runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait for 1 second before polling again
      } while (
        runStatus.status !== "completed" &&
        runStatus.status !== "failed"
      );

      if (runStatus.status === "failed") {
        throw new Error("Run failed: " + runStatus.last_error?.message);
      }

      // Retrieve the messages
      const messages = await openai.beta.threads.messages.list(thread.id);

      // Get the last message from the assistant
      const lastMessage = messages.data.find(
        (message) => message.role === "assistant",
      );

      if (lastMessage) {
        // Process the message content
        const processedContent = processMessageContent(lastMessage);
        setAiResponses((prev) => [
          ...prev,
          { role: "ai", content: processedContent },
        ]);
      } else {
        setAiResponses((prev) => [
          ...prev,
          {
            role: "ai",
            content: "No response from our assistant, Please try again.",
          },
        ]);
      }
    } catch (error: unknown) {
      console.error("Error:", error);
      let errorMessage = "An unknown error occurred";
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === "string") {
        errorMessage = error;
      }
      setAiResponses((prev) => [
        ...prev,
        { role: "ai", content: `Error: Please retry your query again` },
      ]);
    } finally {
      setIsLoadingAiResponse(false);
    }
  };

  interface Message {
    content: MessageContent[];
  }

  interface MessageContent {
    type: string;
    text?: MessageContentText;
  }

  interface MessageContentText {
    value: string;
    annotations?: Annotation[];
  }

  interface Annotation {
    type: string;
    text: string;
    start_index: number;
    end_index: number;
    file_citation?: FileCitation;
    file_path?: FilePath;
  }

  interface FileCitation {
    file_id: string;
    quote?: string;
  }

  interface FilePath {
    file_id: string;
  }

  function processMessageContent(message: Message): string {
    let processedContent = "";
    const citations: string[] = [];

    message.content.forEach((contentBlock) => {
      if (contentBlock.type === "text" && contentBlock.text) {
        let blockContent = contentBlock.text.value;
        const sortedAnnotations =
          contentBlock.text.annotations?.sort(
            (a, b) => b.start_index - a.start_index,
          ) || [];

        sortedAnnotations.forEach((annotation: Annotation) => {
          blockContent =
            blockContent.slice(0, annotation.start_index) +
            blockContent.slice(annotation.end_index);
        });

        processedContent += blockContent;
      } else if (contentBlock.type === "image_file") {
        processedContent += "[Image]";
      }
      // Handle other content types if necessary
    });

    // Append citations to the processed content
    if (citations.length > 0) {
      processedContent += "\n\n" + citations.join("\n");
    }

    return processedContent;
  }

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

  // Define types
  type ResponseRole = "user" | "ai";

  interface ChatResponse {
    role: ResponseRole;
    content: string;
  }

  interface ChatBubbleProps {
    response: ChatResponse;
    darkMode: boolean;
    isLoading: boolean;
  }

  interface MathMarkdownResponseListProps {
    aiResponses: ChatResponse[];
    darkMode: boolean;
    isLoading: boolean;
  }

  const CodeBlock: React.FC<{
    value: string;
    language: string | undefined;
  }> = ({ value, language }) => {
    return (
      <pre className="overflow-x-auto my-2 p-3 rounded-lg bg-gray-100 dark:bg-gray-800 text-sm">
        <code className={language ? `language-${language}` : ""}>{value}</code>
      </pre>
    );
  };

  const ChatBubble: React.FC<ChatBubbleProps> = ({
    response,
    darkMode,
    isLoading,
  }) => {
    const isUser = response.role === "user";

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4`}
      >
        <div
          className={`flex ${isUser ? "flex-row-reverse" : "flex-row"} items-end max-w-[85%]`}
        >
          <div className={`flex-shrink-0 ${isUser ? "ml-3" : "mr-3"}`}>
            {isUser ? (
              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center shadow-md">
                <User size={16} className="text-white" />
              </div>
            ) : (
              <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center shadow-md">
                <Bot size={16} className="text-gray-600 dark:text-gray-300" />
              </div>
            )}
          </div>
          <div
            className={`px-5 py-4 rounded-3xl shadow-lg ${
              isUser
                ? "bg-blue-900 text-white"
                : darkMode
                  ? "bg-gray-800 text-gray-100"
                  : "bg-gray-100 text-gray-900"
            }`}
            style={{
              fontFamily:
                '"SF Pro Text", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
              fontSize: "15px",
              lineHeight: "1.6",
              letterSpacing: "-0.015em",
            }}
          >
            {isLoading ? (
              <DynamicLoader darkMode={darkMode} />
            ) : (
              <ReactMarkdown
                remarkPlugins={[remarkMath]}
                rehypePlugins={[rehypeKatex]}
                components={{
                  p: ({ node, ...props }) => (
                    <p className="mb-3 last:mb-0" {...props} />
                  ),
                  h3: ({ node, ...props }) => (
                    <h3
                      className="text-base font-semibold mb-2 mt-3"
                      {...props}
                    />
                  ),
                  code: ({ node, className, children, ...props }) => {
                    const match = /language-(\w+)/.exec(className || "");
                    const language = match ? match[1] : undefined;
                    const value = String(children).replace(/\n$/, "");
                    return <CodeBlock value={value} language={language} />;
                  },
                  ul: ({ node, ...props }) => (
                    <ul className="list-disc list-inside mb-3" {...props} />
                  ),
                  ol: ({ node, ...props }) => (
                    <ol className="list-decimal ml-2 mb-3" {...props} />
                  ),
                  li: ({ node, ...props }) => (
                    <li className="mb-2 mt-0" {...props} />
                  ),
                }}
              >
                {response.content}
              </ReactMarkdown>
            )}
          </div>
        </div>
      </motion.div>
    );
  };

  const DynamicLoader: React.FC<{ darkMode: boolean }> = ({ darkMode }) => {
    const [complexity, setComplexity] = useState(0);

    useEffect(() => {
      const timer = setTimeout(() => {
        setComplexity((prev) => (prev < 2 ? prev + 1 : prev));
      }, 5000); // Increase complexity every 5 seconds

      return () => clearTimeout(timer);
    }, [complexity]);

    const dotVariants = {
      initial: { scale: 0.8, opacity: 0.7 },
      animate: { scale: 1, opacity: 1 },
    };

    const containerVariants = {
      initial: { rotate: 0 },
      animate: { rotate: 360 },
    };

    return (
      <div className="flex items-center space-x-2">
        <motion.div
          variants={containerVariants}
          initial="initial"
          animate="animate"
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="flex items-center justify-center w-12 h-6"
        >
          {[...Array(3 + complexity)].map((_, index) => (
            <motion.div
              key={index}
              variants={dotVariants}
              initial="initial"
              animate="animate"
              transition={{
                repeat: Infinity,
                repeatType: "reverse",
                duration: 0.5,
                delay: index * 0.15,
              }}
              className={`w-1.5 h-1.5 mx-0.5 rounded-full ${
                darkMode ? "bg-gray-400" : "bg-gray-600"
              }`}
            />
          ))}
        </motion.div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-sm"
        >
          {complexity === 0 && "AI is thinking..."}
          {complexity === 1 && "Still processing..."}
          {complexity === 2 && "This might take a moment..."}
        </motion.p>
      </div>
    );
  };

  return (
    <div
      className={`flex flex-col h-screen ${darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"}`}
    >
      <header
        className={`flex justify-between items-center p-4 ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"} border-b`}
      >
        <h1 className="text-2xl font-bold truncate max-w-2xl">{paperTitle}</h1>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setShowAiPanel(!showAiPanel)}
            className={`relative flex items-center justify-center p-3 rounded-full text-white transition-all duration-300 ease-in-out shadow-2xl ${showAiPanel ? "bg-gradient-to-r from-blue-500 to-blue-600" : "bg-gradient-to-r from-blue-400 to-blue-500"} hover:from-blue-600 hover:to-blue-700 transform hover:scale-105`}
            style={{ minWidth: "200px" }}
          >
            {!showAiPanel && (
              <span className="absolute -top-2 -right-2 bg-red-500 rounded-full w-4 h-4 animate-pulse"></span>
            )}
            <MessageCircle size={18} className="mr-2" />
            <span className="font-semibold text-lg">AI Assistant</span>
            <span className="absolute hidden group-hover:block top-full mt-3 left-1/2 transform -translate-x-1/2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg shadow-md">
              Click to Activate AI Assistant
            </span>
          </button>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`p-2 rounded-full ${darkMode ? "bg-gray-700 text-gray-200" : "bg-gray-200 text-gray-800"} hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200 shadow-lg group relative`}
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
            <div style={{ height: "calc(100vh)" }} className="overflow-auto">
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
            className={`absolute bottom-4 left-0 right-0 mx-auto w-max ${darkMode ? "bg-gray-800" : "bg-white"} p-2 rounded-full shadow-lg flex items-center space-x-4`}
          >
            <button
              onClick={() => jumpToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className={`p-2 rounded-full ${darkMode ? "bg-gray-700 text-gray-200" : "bg-gray-200 text-gray-800"} hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 transition-colors duration-200`}
            >
              <ArrowLeft size={20} />
            </button>
            <span className="font-medium">
              {currentPage + 1} / {totalPages}
            </span>
            <button
              onClick={() => jumpToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`p-2 rounded-full ${darkMode ? "bg-gray-700 text-gray-200" : "bg-gray-200 text-gray-800"} hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 transition-colors duration-200`}
            >
              <ArrowRight size={20} />
            </button>
            <ZoomOutButton>
              {(props) => (
                <button
                  onClick={props.onClick}
                  className={`p-2 rounded-full ${darkMode ? "bg-gray-700 text-gray-200" : "bg-gray-200 text-gray-800"} hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200`}
                >
                  <ZoomOut size={20} />
                </button>
              )}
            </ZoomOutButton>
            <ZoomInButton>
              {(props) => (
                <button
                  onClick={props.onClick}
                  className={`p-2 rounded-full ${darkMode ? "bg-gray-700 text-gray-200" : "bg-gray-200 text-gray-800"} hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200`}
                >
                  <ZoomIn size={20} />
                </button>
              )}
            </ZoomInButton>
          </motion.div>

          <AnimatePresence>
            {!showAiIntro && (
              <motion.div
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                className={`absolute top-4 left-4 right-4 ${darkMode ? "bg-blue-900 text-blue-200" : "bg-blue-100 text-blue-800"} p-4 rounded-lg shadow-lg flex items-center justify-between`}
              >
                <div className="flex items-center space-x-4">
                  <HelpCircle
                    size={24}
                    className={darkMode ? "text-blue-300" : "text-blue-500"}
                  />
                  <div>
                    <p className="font-semibold">
                      Need help understanding this paper?
                    </p>
                    <p>
                      Our RAG-powered AI Assistant can analyze the content and
                      answer your questions!
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowAiIntro(false)}
                  className={`${darkMode ? "hover:text-blue-400" : "hover:text-blue-600"}`}
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
              initial={{ x: "100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "100%", opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className={`w-1/2 ${darkMode ? "bg-gray-900" : "bg-blue-50"} flex flex-col border-l`}
              style={{ height: "calc(100vh - 4rem)" }}
            >
              <div
                className={`p-2 ${darkMode ? "border-gray-700" : "border-gray-200"} border-b flex justify-between items-center rounded-t-3xl`}
              >
                <h2
                  className={`text-lg font-bold ${darkMode ? "text-gray-100" : "text-gray-900"} tracking-tight`}
                >
                  AI Assistant Panel
                </h2>

                <button
                  onClick={() => setShowAiPanel(false)}
                  className={`p-2 rounded-full ${darkMode ? "bg-red-500 hover:bg-red-700" : "bg-red-500 hover:bg-red-700"} transition-all duration-300 ease-in-out`}
                  aria-label="Close Panel"
                >
                  <X
                    size={10}
                    className={`${darkMode ? "text-white" : "text-white"} transform transition-transform duration-200 hover:rotate-45`}
                  />
                </button>
              </div>

              <div
                ref={chatContainerRef}
                className="flex-1 overflow-auto p-6 space-y-6"
                style={{ maxHeight: "calc(100% - 5rem)" }}
              >
                {aiResponses.length === 0 && (
                  <div
                    className={`text-center ${darkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    <BookOpen size={48} className="mx-auto mb-4 text-red-400" />
                    <p className="text-lg font-medium">
                      Welcome to the AI Research Assistant!
                    </p>
                    <p className="text-sm">
                      This paper has been analyzed using RAG technology. You can
                      ask questions about its content, methodology, findings, or
                      implications to get detailed insights.
                    </p>
                  </div>
                )}
                {aiResponses.map((response, index) => (
                  <ChatBubble
                    key={index}
                    response={response}
                    darkMode={darkMode}
                    isLoading={
                      isLoading &&
                      index === aiResponses.length - 1 &&
                      response.role === "ai"
                    }
                  />
                ))}
                {isLoadingAiResponse &&
                  aiResponses[aiResponses.length - 1]?.role === "user" && (
                    <ChatBubble
                      response={{ role: "ai", content: "" }}
                      darkMode={darkMode}
                      isLoading={true}
                    />
                  )}
              </div>

              <div
                className={`pb-6 pt-1 px-2 ${darkMode ? "border-gray-700" : "border-gray-200"} border-t`}
              >
                {/* <div className="mb-4">
                  <p className="text-xs font-semibold mb-2">
                    Suggested prompts:
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {suggestedPrompts.map((prompt, index) => (
                      <button
                        key={index}
                        onClick={() => setQuery(prompt)}
                        className={`text-xs px-2 py-1 rounded-full ${darkMode ? "bg-gray-700 text-gray-300 hover:bg-gray-600" : "bg-gray-200 text-gray-700 hover:bg-gray-300"} transition-colors duration-200`}
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                </div> */}

                <div className="relative">
                  <textarea
                    ref={aiInputRef}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleQuery();
                      }
                    }}
                    placeholder="Ask about the paper..."
                    className={`w-full p-5 pr-16 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all resize-none text-[15px] leading-relaxed font-normal tracking-tight ${
                      darkMode
                        ? "bg-gray-800 text-gray-200 border-gray-700"
                        : "bg-white text-gray-900 border-gray-300"
                    }`}
                    style={{
                      fontFamily:
                        '"SF Pro Text", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                    }}
                    rows={3}
                  />
                  <button
                    onClick={() => handleQuery()}
                    className="absolute right-4 bottom-4 p-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 transition-all duration-200 shadow-md"
                  >
                    <Send size={14} />
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
