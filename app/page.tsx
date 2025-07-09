'use client';

import { useApp } from './context/AppContext';
import WelcomeScreen from './components/WelcomeScreen';
import LoginOptionsScreen from './components/LoginOptionsScreen';
import GoogleWalletIntegrationScreen from './components/GoogleWalletIntegrationScreen';
import InitialSetupScreen from './components/InitialSetupScreen';
import HomeDashboard from './components/HomeDashboard';
import ScanUploadPage from './components/ScanUploadPage';
import ChatQueryPage from './components/ChatQueryPage';
import InsightsDashboard from './components/InsightsDashboard';
import ProfileManagement from './components/ProfileManagement';
import TransactionsAdvanced from './components/TransactionsAdvanced';
import NotificationsCenter from './components/NotificationsCenter';
import HelpCenter from './components/HelpCenter';

// Dummy user data for simulation
const dummyUser = {
  id: "user123",
  name: "John Doe",
  email: "john.doe@gmail.com",
  avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  joinDate: "2024-01-15",
  preferences: {
    currency: "USD",
    notifications: true,
    autoSync: true
  }
};

export default function Home() {
  const { state, dispatch } = useApp();

  const handleGetStarted = () => {
    dispatch({ type: 'SET_CURRENT_SCREEN', payload: 'login' });
  };

  const handleBackToWelcome = () => {
    dispatch({ type: 'SET_CURRENT_SCREEN', payload: 'welcome' });
  };

  const handleBackToLogin = () => {
    dispatch({ type: 'SET_CURRENT_SCREEN', payload: 'login' });
  };

  const handleBackToWallet = () => {
    dispatch({ type: 'SET_CURRENT_SCREEN', payload: 'google-wallet' });
  };

  const handleBackToDashboard = () => {
    dispatch({ type: 'SET_CURRENT_SCREEN', payload: 'home-dashboard' });
  };

  const handleLoginSuccess = (method: 'gmail' | 'phone' | 'skip') => {
    // Simulate successful login
    console.log(`Login successful with method: ${method}`);
    
    // Set user data based on login method
    if (method === 'gmail') {
      dispatch({ type: 'SET_USER', payload: dummyUser });
    } else if (method === 'phone') {
      dispatch({ type: 'SET_USER', payload: { 
        ...dummyUser, 
        email: "+1 (555) 123-4567",
        name: "Phone User"
      }});
    }
    
    // Move to Google Wallet integration
    dispatch({ type: 'SET_CURRENT_SCREEN', payload: 'google-wallet' });
  };

  const handleWalletIntegrationComplete = () => {
    // Move to initial setup screen
    dispatch({ type: 'SET_CURRENT_SCREEN', payload: 'initial-setup' });
  };

  const handleInitialSetupComplete = (setupData: any) => {
    // Update user preferences with setup data
    if (state.user) {
      const updatedUser = {
        ...state.user,
        name: setupData.profile.name || state.user.name,
        avatar: setupData.profile.avatar || state.user.avatar,
        preferences: {
          ...state.user.preferences,
          currency: setupData.preferences.currency,
          notifications: setupData.preferences.notifications.push,
          autoSync: setupData.preferences.autoSync
        }
      };
      dispatch({ type: 'SET_USER', payload: updatedUser });
    }
    
    // Move to main dashboard
    dispatch({ type: 'SET_CURRENT_SCREEN', payload: 'home-dashboard' });
  };

  const handleScanComplete = (scannedData: any) => {
    // Add the scanned transaction to the transactions list
    const newTransaction = {
      id: scannedData.id,
      merchant: scannedData.merchant,
      amount: scannedData.amount,
      currency: state.user?.preferences.currency || 'USD',
      date: scannedData.date,
      category: scannedData.category,
      description: `${scannedData.documentType} - ${scannedData.items.length} items`,
      hasReceipt: true,
      receiptUrl: scannedData.imageUrl,
      walletId: 'manual_scan'
    };

    // Add to transactions (in a real app, this would be an API call)
    dispatch({ type: 'SET_TRANSACTIONS', payload: [newTransaction, ...state.transactions] });
    
    // Navigate back to dashboard
    dispatch({ type: 'SET_CURRENT_SCREEN', payload: 'home-dashboard' });
    
    console.log('Scan completed and transaction added:', newTransaction);
  };

  const handleNavigate = (screen: string) => {
    dispatch({ type: 'SET_CURRENT_SCREEN', payload: screen });
  };

  const handleLogout = () => {
    dispatch({ type: 'LOGOUT' });
    dispatch({ type: 'SET_CURRENT_SCREEN', payload: 'welcome' });
  };

  const handleUserUpdate = (userData: any) => {
    dispatch({ type: 'SET_USER', payload: userData });
  };

  const handleTransactionUpdate = (id: string, updates: any) => {
    const updatedTransactions = state.transactions.map(t => 
      t.id === id ? { ...t, ...updates } : t
    );
    dispatch({ type: 'SET_TRANSACTIONS', payload: updatedTransactions });
  };

  const handleTransactionDelete = (id: string) => {
    const updatedTransactions = state.transactions.filter(t => t.id !== id);
    dispatch({ type: 'SET_TRANSACTIONS', payload: updatedTransactions });
  };

  const handleBulkAction = (action: string, selectedIds: string[]) => {
    console.log(`Bulk action: ${action} on transactions:`, selectedIds);
    // In a real app, this would make API calls based on the action
    switch (action) {
      case 'delete':
        const filteredTransactions = state.transactions.filter(t => !selectedIds.includes(t.id));
        dispatch({ type: 'SET_TRANSACTIONS', payload: filteredTransactions });
        break;
      case 'export':
        // Export selected transactions
        console.log('Exporting transactions:', selectedIds);
        break;
      case 'categorize':
        // Show category selection modal
        console.log('Categorizing transactions:', selectedIds);
        break;
      case 'archive':
        // Archive selected transactions
        console.log('Archiving transactions:', selectedIds);
        break;
      case 'flag':
        // Flag selected transactions for review
        console.log('Flagging transactions:', selectedIds);
        break;
      default:
        console.log('Unknown bulk action:', action);
    }
  };

  // Screen routing logic
  switch (state.currentScreen) {
    case 'welcome':
      return <WelcomeScreen onGetStarted={handleGetStarted} />;
    
    case 'login':
      return (
        <LoginOptionsScreen 
          onBack={handleBackToWelcome}
          onLoginSuccess={handleLoginSuccess}
        />
      );
    
    case 'google-wallet':
      return (
        <GoogleWalletIntegrationScreen 
          onBack={handleBackToLogin}
          onComplete={handleWalletIntegrationComplete}
        />
      );
    
    case 'initial-setup':
      return (
        <InitialSetupScreen 
          onBack={handleBackToWallet}
          onComplete={handleInitialSetupComplete}
        />
      );
    
    case 'home-dashboard':
      return (
        <HomeDashboard 
          user={state.user!}
          onNavigate={handleNavigate}
        />
      );
    
    case 'scan-upload':
      return (
        <ScanUploadPage 
          onBack={handleBackToDashboard}
          onComplete={handleScanComplete}
        />
      );
    
    case 'chat-query':
      return (
        <ChatQueryPage 
          onBack={handleBackToDashboard}
          user={state.user!}
          transactions={state.transactions}
        />
      );
    
    case 'insights-dashboard':
      return (
        <InsightsDashboard 
          onBack={handleBackToDashboard}
          user={state.user!}
          transactions={state.transactions}
        />
      );
    
    case 'profile-management':
      return (
        <ProfileManagement 
          onBack={handleBackToDashboard}
          user={state.user!}
          onUpdateUser={handleUserUpdate}
          onLogout={handleLogout}
        />
      );
    
    case 'transactions-advanced':
      return (
        <TransactionsAdvanced 
          onBack={handleBackToDashboard}
          transactions={state.transactions}
          onUpdateTransaction={handleTransactionUpdate}
          onDeleteTransaction={handleTransactionDelete}
          onBulkAction={handleBulkAction}
        />
      );
    
    case 'notifications-center':
      return (
        <NotificationsCenter 
          onBack={handleBackToDashboard}
          user={state.user!}
        />
      );
    
    case 'help-center':
      return (
        <HelpCenter 
          onBack={handleBackToDashboard}
          user={state.user!}
        />
      );
    
    default:
      // Placeholder for other screens
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center max-w-md mx-auto p-4">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Screen: {state.currentScreen}
            </h1>
            <p className="text-gray-600 mb-6">
              This screen will be implemented next.
            </p>
            
            {/* Show user info if logged in */}
            {state.user && (
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-4">
                <div className="flex items-center space-x-3 mb-3">
                  <img 
                    src={state.user.avatar} 
                    alt="Profile" 
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-medium text-gray-900">{state.user.name}</p>
                    <p className="text-sm text-gray-600">{state.user.email}</p>
                  </div>
                </div>
                <div className="text-sm text-gray-600">
                  <p>• Currency: {state.user.preferences.currency}</p>
                  <p>• Notifications: {state.user.preferences.notifications ? 'Enabled' : 'Disabled'}</p>
                  <p>• Auto-sync: {state.user.preferences.autoSync ? 'Enabled' : 'Disabled'}</p>
                </div>
              </div>
            )}
            
            <div className="space-y-2">
              <button
                onClick={() => dispatch({ type: 'SET_CURRENT_SCREEN', payload: 'home-dashboard' })}
                className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
              >
                Go to Dashboard
              </button>
              
              <button
                onClick={() => dispatch({ type: 'SET_CURRENT_SCREEN', payload: 'welcome' })}
                className="w-full bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
              >
                Back to Welcome
              </button>
              
              {state.user && (
                <button
                  onClick={() => dispatch({ type: 'LOGOUT' })}
                  className="w-full bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
                >
                  Logout
                </button>
              )}
            </div>
          </div>
        </div>
      );
  }
}
