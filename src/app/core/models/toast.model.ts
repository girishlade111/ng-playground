export interface ToastMessage {
  id: string;
  type: 'error' | 'success' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
}