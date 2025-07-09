'use client';

import { useState, useMemo } from 'react';
import { 
  ArrowLeft, 
  Search, 
  Filter, 
  SortAsc, 
  SortDesc, 
  MoreVertical, 
  Edit3, 
  Trash2, 
  Download, 
  Share2, 
  Receipt, 
  Calendar, 
  DollarSign, 
  Check, 
  X, 
  Plus, 
  Grid, 
  List, 
  CheckSquare, 
  Square, 
  Eye, 
  ExternalLink,
  Coffee,
  Car,
  ShoppingBag,
  Home,
  CreditCard,
  Target,
  Star,
  ChevronDown,
  ChevronUp,
  Archive,
  Tag,
  Clock,
  TrendingUp,
  TrendingDown,
  Copy,
  Flag
} from 'lucide-react';

interface TransactionsAdvancedProps {
  onBack: () => void;
  transactions: any[];
  onUpdateTransaction: (id: string, updates: any) => void;
  onDeleteTransaction: (id: string) => void;
  onBulkAction: (action: string, selectedIds: string[]) => void;
}

interface FilterState {
  search: string;
  categories: string[];
  merchants: string[];
  dateRange: 'all' | 'today' | 'week' | 'month' | 'quarter' | 'year' | 'custom';
  startDate: string;
  endDate: string;
  minAmount: number;
  maxAmount: number;
  hasReceipt: 'all' | 'yes' | 'no';
  status: 'all' | 'pending' | 'completed' | 'cancelled';
}

interface SortState {
  field: 'date' | 'amount' | 'merchant' | 'category';
  direction: 'asc' | 'desc';
}

const categoryIcons = {
  'Food & Drink': Coffee,
  'Transportation': Car,
  'Shopping': ShoppingBag,
  'Bills & Utilities': Home,
  'Entertainment': Star,
  'Groceries': ShoppingBag,
  'Health & Fitness': Target,
  'Subscriptions': CreditCard
};

const bulkActions = [
  { id: 'export', label: 'Export Selected', icon: Download },
  { id: 'delete', label: 'Delete Selected', icon: Trash2 },
  { id: 'categorize', label: 'Change Category', icon: Tag },
  { id: 'archive', label: 'Archive Selected', icon: Archive },
  { id: 'flag', label: 'Flag for Review', icon: Flag }
];

export default function TransactionsAdvanced({ 
  onBack, 
  transactions, 
  onUpdateTransaction, 
  onDeleteTransaction, 
  onBulkAction 
}: TransactionsAdvancedProps) {
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [showFilters, setShowFilters] = useState(false);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [selectedTransactions, setSelectedTransactions] = useState<string[]>([]);
  const [expandedTransaction, setExpandedTransaction] = useState<string | null>(null);
  const [showTransactionDetails, setShowTransactionDetails] = useState<string | null>(null);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState<{
    transaction: any;
    receiptUrl: string;
  } | null>(null);

  const [filters, setFilters] = useState<FilterState>({
    search: '',
    categories: [],
    merchants: [],
    dateRange: 'all',
    startDate: '',
    endDate: '',
    minAmount: 0,
    maxAmount: 1000,
    hasReceipt: 'all',
    status: 'all'
  });

  const [sort, setSort] = useState<SortState>({
    field: 'date',
    direction: 'desc'
  });

  const uniqueCategories = useMemo(() => {
    return [...new Set(transactions.map(t => t.category))];
  }, [transactions]);

  const uniqueMerchants = useMemo(() => {
    return [...new Set(transactions.map(t => t.merchant))];
  }, [transactions]);

  const filteredAndSortedTransactions = useMemo(() => {
    let filtered = transactions;

    // Apply search filter
    if (filters.search) {
      filtered = filtered.filter(t => 
        t.merchant.toLowerCase().includes(filters.search.toLowerCase()) ||
        t.category.toLowerCase().includes(filters.search.toLowerCase()) ||
        t.description?.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    // Apply category filter
    if (filters.categories.length > 0) {
      filtered = filtered.filter(t => filters.categories.includes(t.category));
    }

    // Apply merchant filter
    if (filters.merchants.length > 0) {
      filtered = filtered.filter(t => filters.merchants.includes(t.merchant));
    }

    // Apply amount filter
    filtered = filtered.filter(t => t.amount >= filters.minAmount && t.amount <= filters.maxAmount);

    // Apply receipt filter
    if (filters.hasReceipt !== 'all') {
      filtered = filtered.filter(t => 
        filters.hasReceipt === 'yes' ? t.hasReceipt : !t.hasReceipt
      );
    }

    // Apply date filter
    if (filters.dateRange !== 'all') {
      const now = new Date();
      let startDate = new Date();
      
      switch (filters.dateRange) {
        case 'today':
          startDate.setHours(0, 0, 0, 0);
          break;
        case 'week':
          startDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          startDate.setMonth(now.getMonth() - 1);
          break;
        case 'quarter':
          startDate.setMonth(now.getMonth() - 3);
          break;
        case 'year':
          startDate.setFullYear(now.getFullYear() - 1);
          break;
        case 'custom':
          if (filters.startDate && filters.endDate) {
            startDate = new Date(filters.startDate);
            const endDate = new Date(filters.endDate);
            filtered = filtered.filter(t => {
              const transactionDate = new Date(t.date);
              return transactionDate >= startDate && transactionDate <= endDate;
            });
          }
          break;
      }
      
      if (filters.dateRange !== 'custom') {
        filtered = filtered.filter(t => new Date(t.date) >= startDate);
      }
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (sort.field) {
        case 'date':
          aValue = new Date(a.date).getTime();
          bValue = new Date(b.date).getTime();
          break;
        case 'amount':
          aValue = a.amount;
          bValue = b.amount;
          break;
        case 'merchant':
          aValue = a.merchant.toLowerCase();
          bValue = b.merchant.toLowerCase();
          break;
        case 'category':
          aValue = a.category.toLowerCase();
          bValue = b.category.toLowerCase();
          break;
        default:
          return 0;
      }

      if (sort.direction === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [transactions, filters, sort]);

  const handleSelectTransaction = (id: string) => {
    setSelectedTransactions(prev => 
      prev.includes(id) 
        ? prev.filter(t => t !== id)
        : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedTransactions.length === filteredAndSortedTransactions.length) {
      setSelectedTransactions([]);
    } else {
      setSelectedTransactions(filteredAndSortedTransactions.map(t => t.id));
    }
  };

  const handleBulkAction = (action: string) => {
    onBulkAction(action, selectedTransactions);
    setSelectedTransactions([]);
    setShowBulkActions(false);
  };

  const handleViewReceipt = (transaction: any) => {
    if (transaction.hasReceipt && transaction.receiptUrl) {
      setSelectedReceipt({ transaction, receiptUrl: transaction.receiptUrl });
      setShowReceiptModal(true);
    }
  };

  const handleCloseReceiptModal = () => {
    setShowReceiptModal(false);
    setSelectedReceipt(null);
  };

  const handleDownloadReceipt = () => {
    if (selectedReceipt?.receiptUrl) {
      // In a real app, this would download the receipt
      console.log('Downloading receipt:', selectedReceipt.receiptUrl);
    }
  };

  const handleShareReceipt = () => {
    if (selectedReceipt?.receiptUrl) {
      // In a real app, this would share the receipt
      console.log('Sharing receipt:', selectedReceipt.receiptUrl);
    }
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getCategoryIcon = (category: string) => {
    const IconComponent = categoryIcons[category as keyof typeof categoryIcons] || ShoppingBag;
    return IconComponent;
  };

  const renderFilters = () => (
    showFilters && (
      <div className="bg-white border-b border-gray-200 p-4 space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search transactions..."
            value={filters.search}
            onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Filter Row 1 */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
            <select
              value={filters.dateRange}
              onChange={(e) => setFilters(prev => ({ ...prev, dateRange: e.target.value as any }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">Last 7 Days</option>
              <option value="month">Last 30 Days</option>
              <option value="quarter">Last 3 Months</option>
              <option value="year">Last Year</option>
              <option value="custom">Custom Range</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Amount Range</label>
            <div className="flex items-center space-x-2">
              <input
                type="number"
                placeholder="Min"
                value={filters.minAmount}
                onChange={(e) => setFilters(prev => ({ ...prev, minAmount: Number(e.target.value) }))}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <span className="text-gray-500">-</span>
              <input
                type="number"
                placeholder="Max"
                value={filters.maxAmount}
                onChange={(e) => setFilters(prev => ({ ...prev, maxAmount: Number(e.target.value) }))}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Filter Row 2 */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Categories</label>
            <div className="max-h-24 overflow-y-auto border border-gray-300 rounded-lg p-2">
              {uniqueCategories.map(category => (
                <label key={category} className="flex items-center space-x-2 text-sm py-1">
                  <input
                    type="checkbox"
                    checked={filters.categories.includes(category)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFilters(prev => ({ ...prev, categories: [...prev.categories, category] }));
                      } else {
                        setFilters(prev => ({ ...prev, categories: prev.categories.filter(c => c !== category) }));
                      }
                    }}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span>{category}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Has Receipt</label>
            <select
              value={filters.hasReceipt}
              onChange={(e) => setFilters(prev => ({ ...prev, hasReceipt: e.target.value as any }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All</option>
              <option value="yes">With Receipt</option>
              <option value="no">Without Receipt</option>
            </select>
          </div>
        </div>

        {/* Custom Date Range */}
        {filters.dateRange === 'custom' && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
              <input
                type="date"
                value={filters.startDate}
                onChange={(e) => setFilters(prev => ({ ...prev, startDate: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
              <input
                type="date"
                value={filters.endDate}
                onChange={(e) => setFilters(prev => ({ ...prev, endDate: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        )}

        {/* Clear Filters */}
        <div className="flex justify-end">
          <button
            onClick={() => setFilters({
              search: '',
              categories: [],
              merchants: [],
              dateRange: 'all',
              startDate: '',
              endDate: '',
              minAmount: 0,
              maxAmount: 1000,
              hasReceipt: 'all',
              status: 'all'
            })}
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
          >
            Clear All Filters
          </button>
        </div>
      </div>
    )
  );

  const renderTransactionRow = (transaction: any) => {
    const IconComponent = getCategoryIcon(transaction.category);
    const isSelected = selectedTransactions.includes(transaction.id);
    const isExpanded = expandedTransaction === transaction.id;

    return (
      <div key={transaction.id} className="bg-white border-b border-gray-200">
        <div className="flex items-center space-x-4 p-4 hover:bg-gray-50 transition-colors">
          {/* Select Checkbox */}
          <button
            onClick={() => handleSelectTransaction(transaction.id)}
            className="text-gray-400 hover:text-blue-600 transition-colors"
          >
            {isSelected ? (
              <CheckSquare className="w-5 h-5 text-blue-600" />
            ) : (
              <Square className="w-5 h-5" />
            )}
          </button>

          {/* Transaction Icon */}
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
              <IconComponent className="w-5 h-5 text-gray-600" />
            </div>
          </div>

          {/* Transaction Details */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900 truncate">{transaction.merchant}</p>
                <p className="text-sm text-gray-600">{transaction.category}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-900">{formatAmount(transaction.amount)}</p>
                <p className="text-sm text-gray-600">{formatDate(transaction.date)}</p>
              </div>
            </div>
            
            {/* Receipt Status */}
            {transaction.hasReceipt && (
              <div className="flex items-center space-x-1 mt-1">
                <Receipt className="w-3 h-3 text-green-600" />
                <span className="text-xs text-green-600">Receipt available</span>
                {transaction.receiptUrl && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleViewReceipt(transaction);
                    }}
                    className="text-blue-600 hover:text-blue-800 text-xs underline ml-1"
                  >
                    View
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setExpandedTransaction(isExpanded ? null : transaction.id)}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              {isExpanded ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>
            
            <button
              onClick={() => setShowTransactionDetails(transaction.id)}
              className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
            >
              <Eye className="w-4 h-4" />
            </button>
            
            <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Expanded Details */}
        {isExpanded && (
          <div className="px-4 pb-4 bg-gray-50">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-medium text-gray-700">Description</p>
                <p className="text-gray-600">{transaction.description || 'No description'}</p>
              </div>
              <div>
                <p className="font-medium text-gray-700">Wallet ID</p>
                <p className="text-gray-600">{transaction.walletId || 'Manual entry'}</p>
              </div>
              <div>
                <p className="font-medium text-gray-700">Currency</p>
                <p className="text-gray-600">{transaction.currency || 'USD'}</p>
              </div>
              <div>
                <p className="font-medium text-gray-700">Status</p>
                <p className="text-gray-600">Completed</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 mt-4">
              <button className="flex items-center space-x-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors">
                <Edit3 className="w-4 h-4" />
                <span>Edit</span>
              </button>
              <button className="flex items-center space-x-2 px-3 py-1 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                <Copy className="w-4 h-4" />
                <span>Duplicate</span>
              </button>
              <button className="flex items-center space-x-2 px-3 py-1 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors">
                <Trash2 className="w-4 h-4" />
                <span>Delete</span>
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-3">
            <button
              onClick={onBack}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Go back"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Transactions</h1>
              <p className="text-sm text-gray-600">
                {filteredAndSortedTransactions.length} of {transactions.length} transactions
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`p-2 rounded-lg transition-colors ${
                showFilters ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Filter className="w-5 h-5" />
            </button>
            
            <button
              onClick={() => setViewMode(viewMode === 'list' ? 'grid' : 'list')}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {viewMode === 'list' ? <Grid className="w-5 h-5" /> : <List className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Bulk Actions Bar */}
        {selectedTransactions.length > 0 && (
          <div className="bg-blue-50 border-t border-blue-200 px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <button
                  onClick={handleSelectAll}
                  className="text-blue-600 hover:text-blue-700 transition-colors"
                >
                  {selectedTransactions.length === filteredAndSortedTransactions.length ? (
                    <CheckSquare className="w-5 h-5" />
                  ) : (
                    <Square className="w-5 h-5" />
                  )}
                </button>
                <span className="text-sm font-medium text-blue-800">
                  {selectedTransactions.length} selected
                </span>
              </div>
              
              <div className="flex items-center space-x-2">
                {bulkActions.map((action) => (
                  <button
                    key={action.id}
                    onClick={() => handleBulkAction(action.id)}
                    className="flex items-center space-x-1 px-3 py-1 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <action.icon className="w-4 h-4" />
                    <span className="text-sm">{action.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Sort Controls */}
        <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-t border-gray-200">
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-gray-700">Sort by:</span>
            {['date', 'amount', 'merchant', 'category'].map((field) => (
              <button
                key={field}
                onClick={() => setSort(prev => ({
                  field: field as any,
                  direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc'
                }))}
                className={`flex items-center space-x-1 px-3 py-1 rounded-lg transition-colors ${
                  sort.field === field
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <span className="text-sm capitalize">{field}</span>
                {sort.field === field && (
                  sort.direction === 'asc' ? (
                    <SortAsc className="w-4 h-4" />
                  ) : (
                    <SortDesc className="w-4 h-4" />
                  )
                )}
              </button>
            ))}
          </div>
          
          <button className="flex items-center space-x-2 px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
            <Plus className="w-4 h-4" />
            <span className="text-sm">Add Transaction</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      {renderFilters()}

      {/* Transaction List */}
      <div className="divide-y divide-gray-200">
        {filteredAndSortedTransactions.length === 0 ? (
          <div className="text-center py-12">
            <Receipt className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No transactions found</p>
            <p className="text-sm text-gray-400">Try adjusting your filters</p>
          </div>
        ) : (
          filteredAndSortedTransactions.map(transaction => renderTransactionRow(transaction))
        )}
      </div>

      {/* Load More */}
      {filteredAndSortedTransactions.length > 0 && (
        <div className="p-4 text-center">
          <button className="px-6 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
            Load More Transactions
          </button>
        </div>
      )}

      {/* Receipt Modal */}
      {showReceiptModal && selectedReceipt && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Receipt</h3>
                <p className="text-sm text-gray-600">
                  {selectedReceipt.transaction.merchant} • {formatDate(selectedReceipt.transaction.date)}
                </p>
              </div>
              <button
                onClick={handleCloseReceiptModal}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-4">
              <div className="text-center">
                <img
                  src={selectedReceipt.receiptUrl}
                  alt="Receipt"
                  className="max-w-full h-auto rounded-lg shadow-sm border border-gray-200"
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex items-center justify-between space-x-3">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-900">
                    {formatAmount(selectedReceipt.transaction.amount)}
                  </span>
                  <span className="text-xs text-gray-500">•</span>
                  <span className="text-sm text-gray-600">
                    {selectedReceipt.transaction.category}
                  </span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleDownloadReceipt}
                    className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    aria-label="Download receipt"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleShareReceipt}
                    className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    aria-label="Share receipt"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 