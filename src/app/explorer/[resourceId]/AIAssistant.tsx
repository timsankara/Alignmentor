import React, { useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, BookOpen, User, Bot } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import OpenAI from "openai";

interface Message {
  role: "user" | "ai";
  content: string;
}

interface AIAssistantProps {
  darkMode: boolean;
  showAiPanel: boolean;
  setShowAiPanel: (show: boolean) => void;
  pdfFileId: string;
}

const openai = new OpenAI({
  apiKey: "sk-proj-avXTs6KIIYIZgQBsuKglT3BlbkFJ7NWO4wHxPaR1e2nvVjti",
  dangerouslyAllowBrowser: true,
});

const AIAssistant: React.FC<AIAssistantProps> = ({
  darkMode,
  showAiPanel,
  setShowAiPanel,
  pdfFileId,
}) => {
  const [query, setQuery] = React.useState("");
  const [aiResponses, setAiResponses] = React.useState<Message[]>([]);
  const [isLoadingAiResponse, setIsLoadingAiResponse] = React.useState(false);

  const aiInputRef = useRef<HTMLTextAreaElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [aiResponses]);

  const handleQuery = async () => {
    if (!query.trim()) return;

    const userQuery = query.trim();
    setAiResponses((prev) => [...prev, { role: "user", content: userQuery }]);
    setQuery("");
    setIsLoadingAiResponse(true);

    try {
      const thread = await openai.beta.threads.create({
        messages: [
          {
            role: "user",
            content: userQuery,
            attachments: [
              {
                file_id: pdfFileId,
                tools: [{ type: "file_search" }],
              },
            ],
          },
        ],
      });

      const run = await openai.beta.threads.runs.create(thread.id, {
        assistant_id: "asst_mWViXAv7irEltBwI5TMiDZ2x",
      });

      let runStatus;
      do {
        runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);
        await new Promise((resolve) => setTimeout(resolve, 1000));
      } while (
        runStatus.status !== "completed" &&
        runStatus.status !== "failed"
      );

      if (runStatus.status === "failed") {
        throw new Error("Run failed: " + runStatus.last_error?.message);
      }

      const messages = await openai.beta.threads.messages.list(thread.id);
      const lastMessage = messages.data.find(
        (message) => message.role === "assistant",
      );

      if (lastMessage) {
        const processedContent = processMessageContent(lastMessage);
        setAiResponses((prev) => [
          ...prev,
          { role: "ai", content: processedContent },
        ]);
      }
    } catch (error) {
      console.error("Error:", error);
      setAiResponses((prev) => [
        ...prev,
        { role: "ai", content: "Error: Please retry your query again" },
      ]);
    } finally {
      setIsLoadingAiResponse(false);
    }
  };

  const processMessageContent = (message: any): string => {
    let processedContent = "";
    const citations: string[] = [];

    message.content.forEach((contentBlock: any) => {
      if (contentBlock.type === "text" && contentBlock.text) {
        let blockContent = contentBlock.text.value;
        const sortedAnnotations =
          contentBlock.text.annotations?.sort(
            (a: any, b: any) => b.start_index - a.start_index,
          ) || [];

        sortedAnnotations.forEach((annotation: any) => {
          blockContent =
            blockContent.slice(0, annotation.start_index) +
            blockContent.slice(annotation.end_index);
        });

        processedContent += blockContent;
      }
    });

    return processedContent;
  };

  const DynamicLoader: React.FC<{ darkMode: boolean }> = ({ darkMode }) => {
    const [complexity, setComplexity] = React.useState(0);

    useEffect(() => {
      const timer = setTimeout(() => {
        setComplexity((prev) => (prev < 2 ? prev + 1 : prev));
      }, 5000);

      return () => clearTimeout(timer);
    }, [complexity]);

    return (
      <div className="flex items-center space-x-2">
        <motion.div className="flex items-center space-x-1">
          {[...Array(3 + complexity)].map((_, index) => (
            <motion.div
              key={index}
              initial={{ scale: 0.8, opacity: 0.7 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                repeat: Infinity,
                repeatType: "reverse",
                duration: 0.5,
                delay: index * 0.15,
              }}
              className={`w-1.5 h-1.5 rounded-full ${
                darkMode ? "bg-gray-400" : "bg-gray-600"
              }`}
            />
          ))}
        </motion.div>
        <motion.p className="text-sm">
          {complexity === 0 && "AI is thinking..."}
          {complexity === 1 && "Still processing..."}
          {complexity === 2 && "This might take a moment..."}
        </motion.p>
      </div>
    );
  };

  const ChatBubble: React.FC<{
    response: Message;
    isLoading?: boolean;
  }> = ({ response, isLoading }) => {
    const isUser = response.role === "user";

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4`}
      >
        <div
          className={`flex ${
            isUser ? "flex-row-reverse" : "flex-row"
          } items-end max-w-[85%]`}
        >
          <div className={`flex-shrink-0 ${isUser ? "ml-3" : "mr-3"}`}>
            {isUser ? (
              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                <User size={16} className="text-white" />
              </div>
            ) : (
              <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
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
                    const value = String(children).replace(/\n$/, "");
                    return (
                      <pre className="overflow-x-auto my-2 p-3 rounded-lg bg-gray-100 dark:bg-gray-800 text-sm">
                        <code className={match ? `language-${match[1]}` : ""}>
                          {value}
                        </code>
                      </pre>
                    );
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

  return (
    <AnimatePresence>
      {showAiPanel && (
        <motion.div
          initial={{ x: "100%", opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: "100%", opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className={`w-1/2 ${
            darkMode ? "bg-gray-900" : "bg-blue-50"
          } flex flex-col border-l`}
          style={{ height: "calc(100vh - 4rem)" }}
        >
          <div
            className={`p-2 ${
              darkMode ? "border-gray-700" : "border-gray-200"
            } border-b flex justify-between items-center rounded-t-3xl`}
          >
            <h2
              className={`text-lg font-bold ${
                darkMode ? "text-gray-100" : "text-gray-900"
              } tracking-tight`}
            >
              AI Assistant Panel
            </h2>
            <button
              onClick={() => setShowAiPanel(false)}
              className={`p-2 rounded-full ${
                darkMode
                  ? "bg-red-500 hover:bg-red-700"
                  : "bg-red-500 hover:bg-red-700"
              } transition-all duration-300 ease-in-out`}
              aria-label="Close Panel"
            >
              <X
                size={10}
                className="text-white transform transition-transform duration-200 hover:rotate-45"
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
                className={`text-center ${
                  darkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                <BookOpen size={48} className="mx-auto mb-4 text-red-400" />
                <p className="text-lg font-medium">
                  Welcome to the AI Research Assistant!
                </p>
                <p className="text-sm">
                  This paper has been analyzed using RAG technology. You can ask
                  questions about its content, methodology, findings, or
                  implications to get detailed insights.
                </p>
              </div>
            )}

            {aiResponses.map((response, index) => (
              <ChatBubble
                key={index}
                response={response}
                isLoading={
                  isLoadingAiResponse &&
                  index === aiResponses.length - 1 &&
                  response.role === "ai"
                }
              />
            ))}

            {isLoadingAiResponse &&
              aiResponses[aiResponses.length - 1]?.role === "user" && (
                <ChatBubble
                  response={{ role: "ai", content: "" }}
                  isLoading={true}
                />
              )}
          </div>

          <div
            className={`pb-6 pt-1 px-2 ${
              darkMode ? "border-gray-700" : "border-gray-200"
            } border-t`}
          >
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
                onClick={handleQuery}
                className="absolute right-4 bottom-4 p-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 transition-all duration-200 shadow-md"
              >
                <Send size={14} />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AIAssistant;