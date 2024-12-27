// types.ts
export interface PaperMetadata {
  id: string;
  title: string;
  link: string;
  abstract?: string;
  authors?: string[];
  publishedDate?: string;
}

export interface AIResponse {
  role: "user" | "ai";
  content: string;
  timestamp: number;
  metadata?: {
    citations?: string[];
    confidence?: number;
    processingTime?: number;
  };
}

export interface PDFViewerProps {
  pdfUrl: string;
  darkMode: boolean;
  showAiIntro: boolean;
  setShowAiIntro: (show: boolean) => void;
  setShowAiPanel: (show: boolean) => void;
}

export class APIError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public errorCode?: string,
  ) {
    super(message);
    this.name = "APIError";
  }
}

export const handleAPIError = (error: unknown): never => {
  if (error instanceof APIError) {
    throw error;
  }

  if (error instanceof Error) {
    throw new APIError(error.message, 500);
  }

  throw new APIError("An unknown error occurred", 500);
};

export const sanitizeInput = (input: string): string => {
  return input.trim().replace(/[<>]/g, "");
};

export const validatePDFUrl = (url: string): boolean => {
  try {
    new URL(url);
    return url.toLowerCase().endsWith(".pdf");
  } catch {
    return false;
  }
};

export const formatErrorMessage = (error: unknown): string => {
  if (error instanceof APIError) {
    return `Error ${error.statusCode}: ${error.message}`;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return "An unknown error occurred";
};

export const retryWithBackoff = async <T>(
  fn: () => Promise<T>,
  maxAttempts = 3,
  baseDelay = 1000,
): Promise<T> => {
  let lastError: unknown;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      if (attempt === maxAttempts) break;

      const delay = baseDelay * Math.pow(2, attempt - 1);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw lastError;
};

export const debounce = <T extends (...args: any[]) => any>(
  fn: T,
  delay: number,
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout;

  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
};

export const createLogger = (component: string) => ({
  info: (message: string, data?: any) => {
    console.log(`[${component}] ${message}`, data);
  },
  error: (message: string, error?: unknown) => {
    console.error(`[${component}] ${message}`, error);
  },
  warn: (message: string, data?: any) => {
    console.warn(`[${component}] ${message}`, data);
  },
});
