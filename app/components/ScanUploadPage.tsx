'use client';

import { useState, useRef } from 'react';
import { 
  ArrowLeft, 
  Camera, 
  Upload, 
  Image, 
  Zap, 
  ZapOff, 
  RotateCcw,
  FileText,
  Receipt,
  CreditCard,
  File,
  CloudUpload,
  Folder,
  CheckCircle,
  X,
  Edit3,
  Save,
  Trash2,
  RefreshCw
} from 'lucide-react';

interface ScanUploadPageProps {
  onBack: () => void;
  onComplete: (scannedData: ScannedData) => void;
}

interface ScannedData {
  id: string;
  merchant: string;
  amount: number;
  date: string;
  category: string;
  items: string[];
  documentType: string;
  imageUrl: string;
}

type UploadStep = 'camera' | 'upload' | 'processing' | 'review';
type DocumentType = 'receipt' | 'bill' | 'invoice' | 'other';

const documentTypes = [
  { value: 'receipt' as DocumentType, label: 'Receipt', icon: Receipt, color: 'bg-blue-500' },
  { value: 'bill' as DocumentType, label: 'Bill', icon: FileText, color: 'bg-green-500' },
  { value: 'invoice' as DocumentType, label: 'Invoice', icon: CreditCard, color: 'bg-purple-500' },
  { value: 'other' as DocumentType, label: 'Other', icon: File, color: 'bg-gray-500' }
];

const categories = [
  'Food & Drink', 'Groceries', 'Transportation', 'Shopping', 
  'Entertainment', 'Healthcare', 'Utilities', 'Other'
];

// Simulated OCR extracted data
const mockExtractedData = {
  merchant: 'Starbucks Coffee',
  amount: 15.47,
  date: '2024-01-08',
  category: 'Food & Drink',
  items: [
    'Venti Caffe Latte - $5.95',
    'Chocolate Croissant - $3.25',
    'Banana Bread - $2.95',
    'Tax - $0.98',
    'Tip - $2.34'
  ]
};

export default function ScanUploadPage({ onBack, onComplete }: ScanUploadPageProps) {
  const [currentStep, setCurrentStep] = useState<UploadStep>('camera');
  const [selectedDocType, setSelectedDocType] = useState<DocumentType>('receipt');
  const [flashEnabled, setFlashEnabled] = useState(false);
  const [cameraMode, setCameraMode] = useState<'camera' | 'upload'>('camera');
  const [processingProgress, setProcessingProgress] = useState(0);
  const [processingStage, setProcessingStage] = useState(0);
  const [extractedData, setExtractedData] = useState<ScannedData>({
    id: `scan_${Date.now()}`,
    merchant: '',
    amount: 0,
    date: '',
    category: '',
    items: [],
    documentType: 'receipt',
    imageUrl: '/placeholder-receipt.jpg'
  });
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processingStages = [
    'Uploading document...',
    'Analyzing image quality...',
    'Extracting text with OCR...',
    'Identifying merchant...',
    'Parsing transaction details...',
    'Categorizing items...',
    'Finalizing results...'
  ];

  const handleCapture = () => {
    // Simulate camera capture
    console.log('Camera capture triggered');
    startProcessing();
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      console.log('File uploaded:', file.name);
      startProcessing();
    }
  };

  const handleDragDrop = (event: React.DragEvent) => {
    event.preventDefault();
    const files = event.dataTransfer.files;
    if (files.length > 0) {
      console.log('File dropped:', files[0].name);
      startProcessing();
    }
  };

  const startProcessing = () => {
    setCurrentStep('processing');
    setProcessingProgress(0);
    setProcessingStage(0);

    // Simulate processing stages
    const interval = setInterval(() => {
      setProcessingProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          // Set mock extracted data and move to review
          setExtractedData({
            ...extractedData,
            ...mockExtractedData,
            documentType: selectedDocType
          });
          setCurrentStep('review');
          return 100;
        }
        return prev + 2;
      });
    }, 100);

    // Update processing stage
    const stageInterval = setInterval(() => {
      setProcessingStage(prev => {
        if (prev >= processingStages.length - 1) {
          clearInterval(stageInterval);
          return prev;
        }
        return prev + 1;
      });
    }, 700);
  };

  const handleSave = () => {
    onComplete(extractedData);
  };

  const handleDiscard = () => {
    setCurrentStep('camera');
    setExtractedData({
      id: `scan_${Date.now()}`,
      merchant: '',
      amount: 0,
      date: '',
      category: '',
      items: [],
      documentType: 'receipt',
      imageUrl: '/placeholder-receipt.jpg'
    });
  };

  const updateExtractedData = (field: keyof ScannedData, value: any) => {
    setExtractedData(prev => ({ ...prev, [field]: value }));
  };

  if (currentStep === 'processing') {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="max-w-sm w-full text-center">
          {/* Processing Animation */}
          <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center mb-6 mx-auto shadow-lg">
            <RefreshCw className="w-10 h-10 text-white animate-spin" />
          </div>

          {/* Progress */}
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Processing Document
          </h1>
          
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${processingProgress}%` }}
            />
          </div>
          
          {/* Current Stage */}
          <p className="text-gray-600 mb-8">
            {processingStages[processingStage]}
          </p>

          {/* Processing Steps */}
          <div className="space-y-3">
            {processingStages.map((stage, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div className={`w-2 h-2 rounded-full ${
                  index <= processingStage ? 'bg-blue-500' : 'bg-gray-300'
                }`} />
                <span className={`text-sm ${
                  index <= processingStage ? 'text-gray-900' : 'text-gray-500'
                }`}>
                  {stage}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (currentStep === 'review') {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-white border-b border-gray-200">
          <button
            onClick={handleDiscard}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Discard and try again"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h1 className="text-lg font-semibold text-gray-900">Review & Edit</h1>
          <div className="w-9" />
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Document Preview */}
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Document Preview</h2>
            <div className="w-full h-48 bg-gray-100 rounded-lg flex items-center justify-center">
              <div className="text-center text-gray-500">
                <Receipt className="w-12 h-12 mx-auto mb-2" />
                <p className="text-sm">Receipt Image</p>
              </div>
            </div>
          </div>

          {/* Extracted Data */}
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Extracted Data</h2>
              <CheckCircle className="w-5 h-5 text-green-500" />
            </div>

            <div className="space-y-4">
              {/* Merchant */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Merchant Name
                </label>
                <input
                  type="text"
                  value={extractedData.merchant}
                  onChange={(e) => updateExtractedData('merchant', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Amount */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Total Amount
                </label>
                <input
                  type="number"
                  value={extractedData.amount}
                  onChange={(e) => updateExtractedData('amount', parseFloat(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  step="0.01"
                />
              </div>

              {/* Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date
                </label>
                <input
                  type="date"
                  value={extractedData.date}
                  onChange={(e) => updateExtractedData('date', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={extractedData.category}
                  onChange={(e) => updateExtractedData('category', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              {/* Items List */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Items
                </label>
                <div className="space-y-2">
                  {extractedData.items.map((item, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={item}
                        onChange={(e) => {
                          const newItems = [...extractedData.items];
                          newItems[index] = e.target.value;
                          updateExtractedData('items', newItems);
                        }}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-transparent text-sm"
                      />
                      <button
                        onClick={() => {
                          const newItems = extractedData.items.filter((_, i) => i !== index);
                          updateExtractedData('items', newItems);
                        }}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => updateExtractedData('items', [...extractedData.items, 'New Item'])}
                    className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-gray-400 hover:text-gray-600 transition-colors text-sm"
                  >
                    + Add Item
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-white p-4 border-t border-gray-200">
          <div className="flex space-x-3">
            <button
              onClick={handleDiscard}
              className="flex-1 bg-gray-100 text-gray-700 py-3 px-6 rounded-xl font-semibold hover:bg-gray-200 transition-colors flex items-center justify-center space-x-2"
            >
              <Trash2 className="w-4 h-4" />
              <span>Discard</span>
            </button>
            <button
              onClick={handleSave}
              className="flex-1 bg-blue-500 text-white py-3 px-6 rounded-xl font-semibold hover:bg-blue-600 transition-colors flex items-center justify-center space-x-2"
            >
              <Save className="w-4 h-4" />
              <span>Save Transaction</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-white border-b border-gray-200">
        <button
          onClick={onBack}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="Go back"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <h1 className="text-lg font-semibold text-gray-900">
          {cameraMode === 'camera' ? 'Scan Document' : 'Upload Document'}
        </h1>
        <div className="w-9" />
      </div>

      {/* Mode Toggle */}
      <div className="bg-white px-4 py-3 border-b border-gray-200">
        <div className="flex bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setCameraMode('camera')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              cameraMode === 'camera' 
                ? 'bg-white text-gray-900 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Camera className="w-4 h-4 inline mr-2" />
            Camera
          </button>
          <button
            onClick={() => setCameraMode('upload')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              cameraMode === 'upload' 
                ? 'bg-white text-gray-900 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Upload className="w-4 h-4 inline mr-2" />
            Upload
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-4">
        {cameraMode === 'camera' ? (
          // Camera Interface
          <div className="space-y-6">
            {/* Camera Preview */}
            <div className="relative bg-black rounded-2xl overflow-hidden aspect-[3/4]">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white">
                  <Camera className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium mb-2">Camera Preview</p>
                  <p className="text-sm opacity-75">Position document in frame</p>
                </div>
              </div>
              
              {/* Camera Controls Overlay */}
              <div className="absolute top-4 right-4 flex flex-col space-y-2">
                <button
                  onClick={() => setFlashEnabled(!flashEnabled)}
                  className={`p-3 rounded-full ${
                    flashEnabled ? 'bg-yellow-500' : 'bg-black bg-opacity-50'
                  } transition-colors`}
                >
                  {flashEnabled ? (
                    <Zap className="w-5 h-5 text-white" />
                  ) : (
                    <ZapOff className="w-5 h-5 text-white" />
                  )}
                </button>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="p-3 bg-black bg-opacity-50 rounded-full"
                >
                  <Image className="w-5 h-5 text-white" />
                </button>
              </div>

              {/* Capture Button */}
              <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
                <button
                  onClick={handleCapture}
                  className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition-transform"
                >
                  <div className="w-12 h-12 bg-blue-500 rounded-full" />
                </button>
              </div>
            </div>

            {/* Document Type Selector */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Document Type</h3>
              <div className="grid grid-cols-2 gap-3">
                {documentTypes.map((type) => (
                  <button
                    key={type.value}
                    onClick={() => setSelectedDocType(type.value)}
                    className={`p-4 rounded-xl border-2 transition-colors ${
                      selectedDocType === type.value
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    <div className={`w-8 h-8 ${type.color} rounded-lg flex items-center justify-center mb-2 mx-auto`}>
                      <type.icon className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-sm font-medium text-gray-900">{type.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          // Upload Interface
          <div className="space-y-6">
            {/* Drag & Drop Area */}
            <div
              onDrop={handleDragDrop}
              onDragOver={(e) => e.preventDefault()}
              className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center hover:border-gray-400 transition-colors cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <CloudUpload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Drop files here or click to browse
              </h3>
              <p className="text-gray-600 mb-4">
                Supports JPG, PNG, PDF files up to 10MB
              </p>
              <button className="bg-blue-500 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-600 transition-colors">
                Choose Files
              </button>
            </div>

            {/* Upload Options */}
            <div className="grid grid-cols-1 gap-4">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center space-x-4 p-4 bg-white rounded-xl border border-gray-200 hover:border-gray-300 transition-colors"
              >
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Folder className="w-5 h-5 text-blue-600" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-gray-900">Browse Files</p>
                  <p className="text-sm text-gray-600">Choose from your device</p>
                </div>
              </button>

              <button className="flex items-center space-x-4 p-4 bg-white rounded-xl border border-gray-200 hover:border-gray-300 transition-colors">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <CloudUpload className="w-5 h-5 text-green-600" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-gray-900">Google Drive</p>
                  <p className="text-sm text-gray-600">Import from cloud storage</p>
                </div>
              </button>

              <button className="flex items-center space-x-4 p-4 bg-white rounded-xl border border-gray-200 hover:border-gray-300 transition-colors">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <CloudUpload className="w-5 h-5 text-purple-600" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-gray-900">Dropbox</p>
                  <p className="text-sm text-gray-600">Import from Dropbox</p>
                </div>
              </button>
            </div>

            {/* Document Type Selector */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Document Type</h3>
              <div className="grid grid-cols-2 gap-3">
                {documentTypes.map((type) => (
                  <button
                    key={type.value}
                    onClick={() => setSelectedDocType(type.value)}
                    className={`p-4 rounded-xl border-2 transition-colors ${
                      selectedDocType === type.value
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    <div className={`w-8 h-8 ${type.color} rounded-lg flex items-center justify-center mb-2 mx-auto`}>
                      <type.icon className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-sm font-medium text-gray-900">{type.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,.pdf"
        onChange={handleFileUpload}
        className="hidden"
      />
    </div>
  );
} 