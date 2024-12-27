import React, { useRef } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  ZoomIn,
  ZoomOut,
  X,
  HelpCircle,
} from "lucide-react";
import { Viewer, SpecialZoomLevel } from "@react-pdf-viewer/core";
import { pageNavigationPlugin } from "@react-pdf-viewer/page-navigation";
import { zoomPlugin } from "@react-pdf-viewer/zoom";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/page-navigation/lib/styles/index.css";
import "@react-pdf-viewer/zoom/lib/styles/index.css";

const PDFWorker = dynamic(
  () => import("@react-pdf-viewer/core").then((mod) => mod.Worker),
  { ssr: false },
);

interface PDFViewerProps {
  pdfUrl: string;
  darkMode: boolean;
  showAiIntro: boolean;
  setShowAiIntro: (show: boolean) => void;
  setShowAiPanel: (show: boolean) => void;
}

const PDFViewer: React.FC<PDFViewerProps> = ({
  pdfUrl,
  darkMode,
  showAiIntro,
  setShowAiIntro,
  setShowAiPanel,
}) => {
  const [currentPage, setCurrentPage] = React.useState(0);
  const [totalPages, setTotalPages] = React.useState(1);
  const [scale, setScale] = React.useState(SpecialZoomLevel.PageFit);

  const pdfContainerRef = useRef<HTMLDivElement>(null);
  const pageNavigationPluginInstance = pageNavigationPlugin();
  const { jumpToPage } = pageNavigationPluginInstance;
  const zoomPluginInstance = zoomPlugin();
  const { ZoomIn: ZoomInButton, ZoomOut: ZoomOutButton } = zoomPluginInstance;

  const handlePageChange = (e: { currentPage: number }) => {
    setCurrentPage(e.currentPage);
  };

  const handleDocumentLoad = (e: { doc: { numPages: number } }) => {
    setTotalPages(e.doc.numPages);
  };

  return (
    <div className="flex-1 h-full relative" ref={pdfContainerRef}>
      <PDFWorker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
        <div
          style={{
            height: "100%",
            overflow: "auto",
            position: "absolute",
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            backgroundColor: darkMode ? "#1a1a1a" : "#f5f5f5",
          }}
        >
          <div style={{ margin: "0 auto", maxWidth: "100%" }}>
            <Viewer
              fileUrl={pdfUrl}
              defaultScale={scale}
              onPageChange={handlePageChange}
              onDocumentLoad={handleDocumentLoad}
              plugins={[pageNavigationPluginInstance, zoomPluginInstance]}
            />
          </div>
        </div>
      </PDFWorker>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={`absolute bottom-4 left-0 right-0 mx-auto w-max ${
          darkMode ? "bg-gray-800" : "bg-white"
        } p-2 pl-6 bg-blue-200 rounded-full shadow-lg flex items-center space-x-4`}
      >
        {/* <button
          onClick={() => jumpToPage(currentPage - 1)}
          disabled={currentPage === 0}
          className={`p-2 rounded-full ${
            darkMode ? "bg-gray-700 text-gray-200" : "bg-gray-200 text-gray-800"
          } hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 transition-colors duration-200`}
        >
          <ArrowLeft size={20} />
        </button> */}
        <span className="font-medium text-black">
          {currentPage + 1} / {totalPages}
        </span>
        {/* <button
          onClick={() => jumpToPage(currentPage + 1)}
          disabled={currentPage === totalPages - 1}
          className={`p-2 rounded-full ${
            darkMode ? "bg-gray-700 text-gray-200" : "bg-gray-200 text-gray-800"
          } hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 transition-colors duration-200`}
        >
          <ArrowRight size={20} />
        </button> */}
        <ZoomOutButton>
          {(props) => (
            <button
              onClick={props.onClick}
              className={`p-2 rounded-full ${
                darkMode
                  ? "bg-gray-700 text-gray-200"
                  : "bg-gray-200 text-gray-800"
              } hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200`}
            >
              <ZoomOut size={20} />
            </button>
          )}
        </ZoomOutButton>
        <ZoomInButton>
          {(props) => (
            <button
              onClick={props.onClick}
              className={`p-2 rounded-full ${
                darkMode
                  ? "bg-gray-700 text-gray-200"
                  : "bg-gray-200 text-gray-800"
              } hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200`}
            >
              <ZoomIn size={20} />
            </button>
          )}
        </ZoomInButton>
      </motion.div>

      {!showAiIntro && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className={`absolute top-4 left-4 right-4 ${
            darkMode ? "bg-blue-900 text-blue-200" : "bg-blue-100 text-blue-800"
          } p-4 rounded-lg shadow-lg flex items-center justify-between z-10`}
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
                Our RAG-powered AI Assistant can analyze the content and answer
                your questions!
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowAiIntro(false)}
            className={darkMode ? "hover:text-blue-400" : "hover:text-blue-600"}
          >
            <X size={20} />
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default PDFViewer;
