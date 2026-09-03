export interface HttpLogEntry {
  method: string;
  url: string;
  timestamp: Date;
  status: 'pending' | number;
  duration?: number;
  responseSize?: number;
  error?: string;
}