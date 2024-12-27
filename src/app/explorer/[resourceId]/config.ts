// config.ts
export const CONFIG = {
  API: {
    BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || "",
    TIMEOUT: 30000,
    RETRY_ATTEMPTS: 3,
  },
  AWS: {
    REGION: process.env.NEXT_PUBLIC_AWS_REGION || "us-east-1",
    ACCESS_KEY_ID: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID || "",
    SECRET_ACCESS_KEY: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY || "",
    DYNAMODB_TABLE: "AISafetyContent",
  },
  OPENAI: {
    API_KEY: "sk-proj-avXTs6KIIYIZgQBsuKglT3BlbkFJ7NWO4wHxPaR1e2nvVjti",
    ASSISTANT_ID: process.env.NEXT_PUBLIC_OPENAI_ASSISTANT_ID || "",
    MODEL: "gpt-4-turbo-preview",
    MAX_TOKENS: 4000,
  },
  UI: {
    THEME: {
      PRIMARY_COLOR: "#3B82F6",
      SECONDARY_COLOR: "#1F2937",
      ERROR_COLOR: "#EF4444",
      SUCCESS_COLOR: "#10B981",
    },
    ANIMATION: {
      DURATION: 300,
      SPRING_CONFIG: {
        type: "spring",
        stiffness: 300,
        damping: 30,
      },
    },
  },
  PDF: {
    WORKER_URL: "https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js",
    DEFAULT_SCALE: 1.0,
    ZOOM_STEP: 0.1,
    MAX_ZOOM: 3.0,
    MIN_ZOOM: 0.5,
  },
  FEATURES: {
    AI_ASSISTANT: true,
    DARK_MODE: true,
    PDF_ANNOTATIONS: true,
    ERROR_REPORTING: true,
  },
  ERROR_MESSAGES: {
    PDF_LOAD_ERROR: "Failed to load PDF document. Please try again later.",
    API_ERROR: "An error occurred while communicating with the server.",
    AUTH_ERROR: "Authentication failed. Please check your credentials.",
    NETWORK_ERROR:
      "Network connection error. Please check your internet connection.",
    UNKNOWN_ERROR: "An unexpected error occurred. Please try again.",
  },
} as const;

export const PATHS = {
  HOME: "/",
  EXPLORER: "/explorer",
  API: {
    PDF: "/api/pdf",
    AI: "/api/ai",
    AUTH: "/api/auth",
  },
} as const;

export const HTTP_STATUS = {
  OK: 200,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const;

export const EVENTS = {
  PDF_LOADED: "pdf_loaded",
  PDF_ERROR: "pdf_error",
  AI_RESPONSE: "ai_response",
  AI_ERROR: "ai_error",
  USER_INTERACTION: "user_interaction",
} as const;

export const LOCAL_STORAGE_KEYS = {
  DARK_MODE: "darkMode",
  USER_PREFERENCES: "userPreferences",
  RECENT_PAPERS: "recentPapers",
} as const;
