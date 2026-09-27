export interface HttpLogEntry {
  /** Unique id assigned by HttpLogService.addEntry — used to update the
   *  correct entry when several requests are in flight concurrently. */
  id: string;
  method: string;
  url: string;
  timestamp: Date;
  status: 'pending' | number;
  duration?: number;
  responseSize?: number;
  error?: string;
}