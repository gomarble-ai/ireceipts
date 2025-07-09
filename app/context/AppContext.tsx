'use client';

import { createContext, useContext, useReducer, ReactNode } from 'react';

// Types
interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  joinDate: string;
  preferences: {
    currency: string;
    notifications: boolean;
    autoSync: boolean;
  };
}

interface Transaction {
  id: string;
  merchant: string;
  amount: number;
  currency: string;
  date: string;
  category: string;
  description: string;
  hasReceipt: boolean;
  receiptUrl?: string;
  walletId: string;
}

interface AppState {
  user: User | null;
  transactions: Transaction[];
  isAuthenticated: boolean;
  isLoading: boolean;
  currentScreen: string;
}

type AppAction = 
  | { type: 'SET_USER'; payload: User }
  | { type: 'SET_TRANSACTIONS'; payload: Transaction[] }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_CURRENT_SCREEN'; payload: string }
  | { type: 'LOGOUT' };

// Dummy transaction data
const dummyTransactions: Transaction[] = [
  {
    id: 'txn001',
    merchant: 'Starbucks',
    amount: 5.47,
    currency: 'USD',
    date: '2024-01-08T09:30:00Z',
    category: 'Food & Drink',
    description: 'Coffee and pastry',
    hasReceipt: true,
    receiptUrl: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    walletId: 'wallet123'
  },
  {
    id: 'txn002',
    merchant: 'Amazon',
    amount: 89.99,
    currency: 'USD',
    date: '2024-01-07T14:22:00Z',
    category: 'Shopping',
    description: 'Electronics and accessories',
    hasReceipt: false,
    walletId: 'wallet123'
  },
  {
    id: 'txn003',
    merchant: 'Shell Gas Station',
    amount: 45.30,
    currency: 'USD',
    date: '2024-01-06T16:45:00Z',
    category: 'Transportation',
    description: 'Fuel purchase',
    hasReceipt: true,
    receiptUrl: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    walletId: 'wallet123'
  },
  {
    id: 'txn004',
    merchant: 'Whole Foods',
    amount: 127.65,
    currency: 'USD',
    date: '2024-01-05T11:15:00Z',
    category: 'Groceries',
    description: 'Weekly grocery shopping',
    hasReceipt: true,
    receiptUrl: 'https://images.unsplash.com/photo-1572715376701-98568319fd0b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    walletId: 'wallet123'
  },
  {
    id: 'txn005',
    merchant: 'Netflix',
    amount: 15.99,
    currency: 'USD',
    date: '2024-01-04T08:00:00Z',
    category: 'Entertainment',
    description: 'Monthly subscription',
    hasReceipt: false,
    walletId: 'wallet123'
  },
  {
    id: 'txn006',
    merchant: 'Uber',
    amount: 12.75,
    currency: 'USD',
    date: '2024-01-03T19:30:00Z',
    category: 'Transportation',
    description: 'Ride to downtown',
    hasReceipt: true,
    receiptUrl: 'https://images.unsplash.com/photo-1549057446-9f5c6ac91a04?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    walletId: 'wallet123'
  },
  {
    id: 'txn007',
    merchant: 'Apple Store',
    amount: 199.99,
    currency: 'USD',
    date: '2024-01-02T13:45:00Z',
    category: 'Technology',
    description: 'AirPods Pro',
    hasReceipt: true,
    receiptUrl: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    walletId: 'wallet123'
  },
  {
    id: 'txn008',
    merchant: 'McDonald\'s',
    amount: 8.99,
    currency: 'USD',
    date: '2024-01-01T12:00:00Z',
    category: 'Food & Drink',
    description: 'Lunch meal',
    hasReceipt: false,
    walletId: 'wallet123'
  }
];

// Initial state
const initialState: AppState = {
  user: null,
  transactions: dummyTransactions,
  isAuthenticated: false,
  isLoading: false,
  currentScreen: 'welcome',
};

// Reducer
function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_USER':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
      };
    case 'SET_TRANSACTIONS':
      return {
        ...state,
        transactions: action.payload,
      };
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };
    case 'SET_CURRENT_SCREEN':
      return {
        ...state,
        currentScreen: action.payload,
      };
    case 'LOGOUT':
      return {
        ...initialState,
      };
    default:
      return state;
  }
}

// Context
const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | undefined>(undefined);

// Provider
export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

// Hook
export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
} 