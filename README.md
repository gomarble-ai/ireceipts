# Smart Transaction & Receipt Tracker

A modern, AI-powered web application for tracking transactions, managing receipts, and gaining insights into spending patterns. Built with Next.js 15, TypeScript, and integrated with Google Wallet and Gemini AI.

## 🌟 Features

### 📱 Complete User Experience
- **Welcome Screen** with feature highlights carousel
- **Multi-login Options** (Gmail, Phone, Skip option)
- **Google Wallet Integration** for seamless transaction sync
- **Profile Setup** with preferences and data sync options

### 🏠 Smart Dashboard
- **Real-time Transaction Overview** with insights
- **Quick Actions** for common tasks
- **Spending Analytics** with visual charts
- **Receipt Management** with view, download, and share options

### 🔍 Advanced Features
- **AI-Powered Chat** with Gemini integration for natural language queries
- **Receipt Scanning** with camera interface and OCR processing
- **Advanced Transaction Filtering** with search and bulk actions
- **Smart Insights** with spending recommendations and trend analysis

### 🛠️ Management Tools
- **Profile Management** with security settings
- **Notifications Center** with customizable alerts
- **Help Center** with AI support and comprehensive FAQ
- **Data Export** and backup options

## 🚀 Live Demo

**🌐 [View Live App](https://ireceipts-7tgfi7mqo-swapnils-projects-4087f33d.vercel.app)**

## 🛠️ Tech Stack

### Frontend
- **Next.js 15.3.5** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icons library

### State Management
- **React Context API** - Global state management
- **React Hooks** - Local state and effects

### Integrations
- **Google Wallet API** - Transaction synchronization
- **Gemini AI** - Intelligent chat and insights
- **Camera API** - Receipt scanning functionality

### Deployment
- **Vercel** - Production deployment platform
- **Git** - Version control

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ireceipts
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   Configure the following variables:
   - `GOOGLE_WALLET_API_KEY` - Google Wallet integration
   - `GEMINI_API_KEY` - Gemini AI chat functionality
   - `NEXT_PUBLIC_APP_URL` - Application URL

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🎯 Usage

### Getting Started
1. Launch the app and view the welcome screen
2. Choose your login method (Gmail, Phone, or Skip)
3. Connect your Google Wallet (optional)
4. Set up your profile and preferences
5. Start tracking transactions!

### Core Workflows

#### 📊 Dashboard Navigation
- View recent transactions and spending insights
- Access quick actions for common tasks
- Monitor spending patterns and trends

#### 🔍 Transaction Management
- **Add Transactions**: Use the scan/upload feature
- **View Receipts**: Click the eye icon on any transaction
- **Filter & Search**: Use advanced filters in the transactions view
- **Bulk Actions**: Select multiple transactions for batch operations

#### 💬 AI Chat Queries
- Ask natural language questions about your spending
- Get insights and recommendations
- Query specific transactions or categories

#### 🎯 Insights & Analytics
- View spending breakdowns by category
- Analyze trends over different time periods
- Get personalized recommendations
- Track financial goals and progress

## Architecture
![mermaid-flow-1x](https://github.com/user-attachments/assets/11c395aa-d07e-4cc6-9122-21c414b6bfc7)


## 📁 Project Structure

```
ireceipts/
├── app/
│   ├── components/           # React components
│   │   ├── WelcomeScreen.tsx
│   │   ├── LoginOptions.tsx
│   │   ├── GoogleWalletIntegration.tsx
│   │   ├── InitialSetup.tsx
│   │   ├── HomeDashboard.tsx
│   │   ├── ScanUpload.tsx
│   │   ├── ChatQuery.tsx
│   │   ├── InsightsDashboard.tsx
│   │   ├── ProfileManagement.tsx
│   │   ├── TransactionsAdvanced.tsx
│   │   ├── NotificationsCenter.tsx
│   │   └── HelpCenter.tsx
│   ├── contexts/             # React contexts
│   │   └── AppContext.tsx
│   ├── globals.css          # Global styles
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Main page component
├── public/                  # Static assets
├── next.config.ts          # Next.js configuration
├── tailwind.config.ts      # Tailwind CSS configuration
├── tsconfig.json           # TypeScript configuration
└── package.json            # Dependencies and scripts
```

## 🔧 Key Components

### 🏠 HomeDashboard
- Central hub with transaction overview
- Quick actions and navigation
- Real-time insights and alerts

### 📊 InsightsDashboard
- Advanced analytics and visualizations
- Spending trends and category breakdowns
- AI-powered recommendations

### 💬 ChatQuery
- Natural language transaction queries
- Gemini AI integration
- Context-aware responses

### 🔍 TransactionsAdvanced
- Comprehensive transaction management
- Advanced filtering and search
- Bulk operations and export

## 🎨 Design Features

### 🎨 User Interface
- **Modern Design** with clean, intuitive layouts
- **Responsive** - Works on desktop and mobile
- **Dark Mode Support** - User preference based
- **Accessibility** - ARIA labels and keyboard navigation

### 🎯 User Experience
- **Progressive Enhancement** - Works without JavaScript
- **Loading States** - Smooth transitions and feedback
- **Error Handling** - Graceful error messages
- **Offline Support** - Core functionality works offline

## 🔗 API Integration

### Google Wallet
- Automatic transaction synchronization
- Secure authentication flow
- Real-time balance updates

### Gemini AI
- Natural language processing
- Contextual transaction insights
- Personalized recommendations

## 🚀 Deployment

### Production Build
```bash
npm run build
npm start
```

### Vercel Deployment
```bash
vercel --prod
```

### Environment Variables
Make sure to set up the following in your deployment environment:
- `GOOGLE_WALLET_API_KEY`
- `GEMINI_API_KEY`
- `NEXT_PUBLIC_APP_URL`

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 Development Guidelines

### Code Style
- Follow TypeScript best practices
- Use ESLint and Prettier for code formatting
- Write meaningful commit messages
- Add comments for complex logic

### Testing
- Write unit tests for utility functions
- Test React components with React Testing Library
- Ensure mobile responsiveness

### Performance
- Optimize images and assets
- Use React.memo for expensive components
- Implement proper loading states

## 🐛 Known Issues

- Google Wallet integration requires API key configuration
- Gemini AI features need proper authentication setup
- Camera scanning works best in good lighting conditions

## 📚 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Vercel for seamless deployment
- Google for Wallet API and Gemini AI
- Lucide for beautiful icons
- Tailwind CSS for utility-first styling

---

**Built with ❤️ using Next.js 15 and TypeScript**
