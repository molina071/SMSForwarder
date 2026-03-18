export interface Rule {
  id: string;
  name: string;
  field: 'sender' | 'body';
  pattern: string;
  isRegex: boolean;
  isActive: boolean;
}

export interface SMS {
  id: string;
  sender: string;
  body: string;
  timestamp: Date;
  status: 'forwarded' | 'filtered' | 'error';
  errorMessage?: string;
}

export interface Config {
  botToken: string;
  chatId: string;
}