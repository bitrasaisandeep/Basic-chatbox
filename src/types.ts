export interface Message {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: Date;
}

export type ExecutionStep = 
  | 'idle'
  | 'input'
  | 'check-if'
  | 'check-elif-how'
  | 'check-elif-bye'
  | 'check-else'
  | 'output-print'
  | 'loop-break';

export interface PredefinedCommand {
  text: string;
  description: string;
  category: 'Hello' | 'Status' | 'Goodbye' | 'Custom';
}
