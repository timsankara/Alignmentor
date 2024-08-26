'use client'

import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Sun, Moon, Plus, Clock, User, BookOpen, Tag, FileText } from 'lucide-react';
import { createFeedItem } from '../utils/feed';
import { v4 as uuid } from 'uuid'
// import fs from "fs";
import OpenAI from "openai";
import { AssistantStream } from "openai/lib/AssistantStream";
import { AssistantStreamEvent } from "openai/resources/beta/assistants/assistants";

const AIAgendas = [
  "Scalable Oversight",
  "AI Alignment",
  "Robustness",
  "Transparency",
  "Value Learning",
  "AI Governance",
];

interface FeedItem {
  id: string | undefined;
  title: string;
  description: string;
  agenda: string;
  author: string;
  date: string;
  readTime: string;
  link: string,
  filename: string,
}

interface DynamoDBItem {
  title: { S: string };
  description: { S: string };
  agenda: { S: string };
  author: { S: string };
  date: { S: string };
  readTime: { S: string };
  link: { S: string };
  id: { S: string };
  filename: { S: string };
}

function convertDynamoDBItemToFeedItem(item: DynamoDBItem): FeedItem {
  return {
    title: item.title.S,
    description: item.description.S,
    agenda: item.agenda.S,
    author: item.author.S,
    date: item.date.S,
    readTime: item.readTime.S,
    link: item.link.S,
    id: item.id.S,
    filename: item.filename.S
  };
}

async function getFeedItems(): Promise<DynamoDBItem[]> {
  // Implement your DynamoDB fetching logic here
  // This is a placeholder implementation
  return [];
}

// async function createFeedItem(feedItem: FeedItem) {
//   const params = {
//     TableName: 'AISafetyContent',
//     Item: feedItem,
//   };
//   try {
//     // Implement your DynamoDB put operation here

//     console.log('Feed item created successfully', params);
//     return feedItem;
//   } catch (error) {
//     console.error('Error creating feed item in DynamoDB:', error);
//     throw error;
//   }
// }

interface FileObject {
  bytes: number;
  created_at: number;
  filename: string;
  id: string;
  object: string;
  purpose: string;
  status: string;
  status_details: null | string;
}

const AIAgendaDashboard: React.FC = () => {

  const openai = new OpenAI({
    apiKey: "sk-proj-avXTs6KIIYIZgQBsuKglT3BlbkFJ7NWO4wHxPaR1e2nvVjti",
    dangerouslyAllowBrowser: true
  });

  const [feedItems, setFeedItems] = useState<FeedItem[]>([]);
  const [newItem, setNewItem] = useState<Omit<FeedItem, '_id' | 'date'>>({
    title: '',
    description: '',
    agenda: '',
    author: '',
    readTime: '',
    link: '',
    id: '',
    filename: ''
  });
  const [darkMode, setDarkMode] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(false);
  const [fileItem, setFileItem] = useState<FileObject>();
  const [uploadingFile, setUploadingFile] = useState(false)

  useEffect(() => {
    const isDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    setDarkMode(isDarkMode);

    const fetchFeedItems = async () => {
      try {
        const items = await getFeedItems();
        const convertedItems = items.map(convertDynamoDBItemToFeedItem);
        setFeedItems(convertedItems);
      } catch (error) {
        console.error('Failed to fetch feed items:', error);
      }
    };
    fetchFeedItems();
  }, []);

  useEffect(() => {
    async function getThreadResponse() {
      try {
        // Create a thread with the initial message
        const thread = await openai.beta.threads.create({
          messages: [
            {
              role: "user",
              content: "Explain how KAN's work?",
              attachments: [
                {
                  file_id: "file-sXuh6CF8oUAuMbFYoxLJ0tfW",
                  tools: [{ type: "file_search" }]
                }
              ]
            }
          ]
        });

        // Create and start a run
        const run = await openai.beta.threads.runs.create(thread.id, {
          assistant_id: "asst_mWViXAv7irEltBwI5TMiDZ2x",
        });

        // Poll for the run to complete
        let runStatus;
        do {
          runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);
          await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for 1 second before polling again
        } while (runStatus.status !== 'completed' && runStatus.status !== 'failed');

        if (runStatus.status === 'failed') {
          throw new Error('Run failed: ' + runStatus.last_error?.message);
        }

        // Retrieve the messages
        const messages = await openai.beta.threads.messages.list(thread.id);

        // Get the last message from the assistant
        const lastMessage = messages.data.find(message => message.role === 'assistant');
        if (lastMessage && lastMessage.content[0].type === 'text') {
          // setResponse(lastMessage.content[0].text.value);
          console.log(lastMessage.content[0].text.value);

        } else {
          // setResponse('No response from the assistant.');
          console.log('No response from assistant');
        }
      } catch (err) {
        console.error('Error:', err);
        // setError(err.message);
      }
    }
    getThreadResponse();
  }, []);



  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setNewItem({ ...newItem, [e.target.name]: e.target.value });
  };

  const uploadToOpenAI = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setUploadingFile(true);
    const fileInput = e.target;
    if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
      console.error('No file selected');
      return;
    }
    const selectedFile = fileInput.files[0];
    try {
      const file = await openai.files.create({
        file: selectedFile,
        purpose: "assistants",
      });

      // console.log("Raw file response:", JSON.stringify(file, null, 2));

      setUploadedFile(true);

      // Use a type guard to ensure file matches FileObject structure
      if (isFileObject(file)) {
        setFileItem(file);
        // console.log("File Item set as:", file);
      } else {
        console.error("File response does not match expected structure");
      }
      setUploadingFile(false);
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  // Type guard function
  function isFileObject(obj: any): obj is FileObject {
    return (
      typeof obj === 'object' &&
      obj !== null &&
      'bytes' in obj &&
      'created_at' in obj &&
      'filename' in obj &&
      'id' in obj &&
      'object' in obj &&
      'purpose' in obj &&
      'status' in obj &&
      'status_details' in obj
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const item: FeedItem = {
      ...newItem,
      id: fileItem?.id,
      date: new Date().toISOString().split('T')[0],
    };
    try {
      await createFeedItem(item);
      setFeedItems([item, ...feedItems]);
      setNewItem({
        title: '',
        description: '',
        agenda: '',
        author: '',
        readTime: '',
        link: '',
        id: '',
        filename: ''
      });
    } catch (error) {
      console.error('Failed to create feed item:', error);
    }
  };

  const inputClass = `block w-full rounded-md shadow-sm sm:text-sm ${darkMode
    ? 'bg-gray-700 text-white border-gray-600 focus:ring-blue-500 focus:border-blue-500'
    : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'
    } h-10 px-3`;

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
      <nav className={`${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>AI Agenda Feed</h1>
            </div>
            <div className="flex items-center">
              <button
                onClick={toggleDarkMode}
                className={`p-2 rounded-full ${darkMode ? 'bg-gray-700 text-yellow-400' : 'bg-gray-200 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white`}
              >
                {darkMode ? <Sun size={24} /> : <Moon size={24} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm rounded-lg p-6 mb-8`}>
            <h2 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'} flex items-center`}>
              <Plus size={24} className="mr-2" />
              Create New Feed Item
            </h2>
            {uploadedFile ? (
              <p className="flex flex-col items-center justify-center w-full px-4 transition">
                File Uploaded Successfully: {fileItem?.id}
              </p>
            ) : (
              <>
                {!uploadedFile && uploadingFile ? (
                  <div className="flex flex-col items-center justify-center w-full h-40 bg-white rounded-lg">
                    <div className="w-12 h-12 mb-4 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
                    <p className="text-sm font-medium text-gray-600">Uploading file...</p>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center w-full h-40 px-4 transition bg-white border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:border-gray-400 hover:bg-gray-50">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <FileText className="w-10 h-10 mb-3 text-gray-400" />
                      <p className="mb-2 text-sm text-gray-500">
                        <span className="font-semibold">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-gray-500">PDF files only</p>
                    </div>
                    <input
                      id="fileInput"
                      type="file"
                      className="hidden"
                      accept=".pdf"
                      onChange={uploadToOpenAI}
                    />
                  </label>
                )}
              </>
            )}
            <form onSubmit={handleSubmit} className="space-y-4" hidden={!uploadedFile}>
              <div>
                <label htmlFor="title" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Title</label>
                <input
                  type="text"
                  name="title"
                  id="title"
                  value={newItem.title}
                  onChange={handleInputChange}
                  required
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor="description" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Description</label>
                <textarea
                  name="description"
                  id="description"
                  rows={3}
                  value={newItem.description}
                  onChange={handleInputChange}
                  required
                  className={`${inputClass} h-auto`}
                />
              </div>
              <div>
                <label htmlFor="title" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Link</label>
                <input
                  type="text"
                  name="link"
                  id="link"
                  value={newItem.link}
                  onChange={handleInputChange}
                  required
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor="agenda" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Agenda</label>
                <select
                  name="agenda"
                  id="agenda"
                  value={newItem.agenda}
                  onChange={handleInputChange}
                  required
                  className={inputClass}
                >
                  <option value="">Select an agenda</option>
                  {AIAgendas.map((agenda) => (
                    <option key={agenda} value={agenda}>{agenda}</option>
                  ))}
                </select>
              </div>
              <div className="flex space-x-4">
                <div className="flex-1">
                  <label htmlFor="author" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Author</label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User size={16} className={darkMode ? 'text-gray-400' : 'text-gray-500'} />
                    </div>
                    <input
                      type="text"
                      name="author"
                      id="author"
                      value={newItem.author}
                      onChange={handleInputChange}
                      required
                      className={`${inputClass} pl-10`}
                    />
                  </div>
                </div>
                <div className="flex-1">
                  <label htmlFor="readTime" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Read Time</label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Clock size={16} className={darkMode ? 'text-gray-400' : 'text-gray-500'} />
                    </div>
                    <input
                      type="text"
                      name="readTime"
                      id="readTime"
                      value={newItem.readTime}
                      onChange={handleInputChange}
                      placeholder="e.g., 5 min"
                      required
                      className={`${inputClass} pl-10`}
                    />
                  </div>
                </div>
              </div>
              <div>
                <button
                  type="submit"
                  className={`w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${darkMode ? 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500' : 'bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500'} focus:outline-none focus:ring-2 focus:ring-offset-2 h-10`}
                >
                  <Plus size={18} className="mr-2" />
                  Create Feed Item
                </button>
              </div>
            </form>
          </div>

          <div className="space-y-6">
            <h2 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} flex items-center`}>
              <BookOpen size={24} className="mr-2" />
              Recent Feed Items
            </h2>
            {feedItems.map((item) => (
              <div key={item.id} className={`${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm rounded-lg overflow-hidden transition-all duration-300 hover:shadow-md`}>
                <div className="px-6 py-4">
                  <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>{item.title}</h3>
                  <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-4`}>{item.description}</p>
                  <div className={`flex items-center text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    <Tag size={16} className="mr-1" />
                    <span className={`font-medium ${darkMode ? 'text-blue-400' : 'text-indigo-600'} mr-2`}>{item.agenda}</span>
                    <span>•</span>
                    <User size={16} className="mx-2" />
                    <span className="mr-2">{item.author}</span>
                    <span>•</span>
                    <Clock size={16} className="mx-2" />
                    <span>{item.readTime} read</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAgendaDashboard;