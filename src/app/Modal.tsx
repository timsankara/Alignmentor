import React from 'react';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';

interface ModalProps {
  title: string;
  content: string;
  onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ title, content, onClose }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 50, opacity: 0 }}
        className="bg-white rounded-lg p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-3xl font-bold mb-4">{title}</h2>
        <div className="prose prose-sm">
          <ReactMarkdown>{content}</ReactMarkdown>
        </div>
        <button
          className="mt-6 bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition-colors duration-300"
          onClick={onClose}
        >
          Close
        </button>
      </motion.div>
    </motion.div>
  );
};

export default Modal;