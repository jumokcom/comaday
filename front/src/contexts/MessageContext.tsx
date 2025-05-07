import React, { createContext, useContext, useState } from 'react';

interface MessageContextType {
  message: { text: string; type: 'error' | 'success' } | null;
  showError: (text: string) => void;
  showSuccess: (text: string) => void;
  clearMessage: () => void;
}

const MessageContext = createContext<MessageContextType | null>(null);

export const useMessage = () => {
  const context = useContext(MessageContext);
  if (!context) throw new Error('useMessage must be used within a MessageProvider');
  return context;
};

export const MessageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [message, setMessage] = useState<{ text: string; type: 'error' | 'success' } | null>(null);

  const showError = (text: string) => {
    setMessage({ text, type: 'error' });
  };

  const showSuccess = (text: string) => {
    setMessage({ text, type: 'success' });
  };

  const clearMessage = () => setMessage(null);

  return (
    <MessageContext.Provider value={{ message, showError, showSuccess, clearMessage }}>
      {children}
    </MessageContext.Provider>
  );
}; 