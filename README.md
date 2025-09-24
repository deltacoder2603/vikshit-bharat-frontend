# 🏛️ Vikshit Bharat - Smart Civic Issue Management Platform

A comprehensive digital platform for citizens to report civic issues and for administrators to manage them efficiently using AI-powered image analysis.

![Vikshit Bharat](https://img.shields.io/badge/Vikshit-Bharat-blue?style=for-the-badge)
![React](https://img.shields.io/badge/React-18+-blue?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5+-blue?style=for-the-badge&logo=typescript)
![AI Powered](https://img.shields.io/badge/AI-Powered-green?style=for-the-badge&logo=openai)

## 🌟 Features

### 👥 **Multi-Role System**
- **Citizens**: Report civic issues with AI-powered category detection
- **Field Workers**: Manage assigned problems and update status
- **Department Heads**: Oversee department-specific issues
- **District Magistrate**: Complete administrative control and analytics

### 🤖 **AI-Powered Issue Detection**
- **Smart Image Analysis**: Upload photos to automatically detect civic issues
- **Category Suggestions**: AI suggests relevant categories like:
  - Garbage & Waste Management
  - Traffic & Roads
  - Pollution
  - Drainage & Sewage
  - Public Spaces
  - Infrastructure Issues

### 📱 **Modern User Experience**
- **Responsive Design**: Works seamlessly on desktop and mobile
- **Multilingual Support**: Available in Hindi and English
- **Real-time Updates**: Live status updates and notifications
- **Interactive Maps**: Location-based issue reporting and tracking

### 📊 **Advanced Analytics**
- **Dashboard Analytics**: Comprehensive insights for administrators
- **Performance Metrics**: Department and worker performance tracking
- **Real-time Activity**: Live monitoring of civic issue resolution
- **Ward-wise Analytics**: Geographic distribution of issues

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd vikshit-bharat-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env.local` file in the root directory:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_BACKEND_URL=https://vikshit-bharat-backend.vercel.app
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   Navigate to `http://localhost:3000`

## 🏗️ Project Structure

```
vikshit-bharat-frontend/
├── src/
│   ├── components/           # React components
│   │   ├── ui/              # Reusable UI components
│   │   ├── Dashboard.tsx    # Main citizen dashboard
│   │   ├── AdminDashboard.tsx # Administrator dashboard
│   │   └── ...              # Other role-specific components
│   ├── utils/               # Utility functions
│   │   ├── api.tsx          # Backend API integration
│   │   ├── translations.tsx # Multilingual support
│   │   └── geolocation.tsx  # Location services
│   ├── styles/              # Global styles and animations
│   └── App.tsx              # Main application component
├── public/                  # Static assets
├── dist/                    # Production build output
├── vercel.json             # Vercel deployment configuration
└── vite.config.ts          # Vite build configuration
```

## 🔧 Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint

# Deployment
npm run deploy       # Deploy to Vercel (if configured)
```

## 🌐 Backend Integration

The frontend integrates with a Node.js backend that provides:

- **AI Image Analysis**: `/api/analyze-image` - Analyzes uploaded images for civic issues
- **User Management**: Authentication and user profiles
- **Problem Management**: CRUD operations for civic issues
- **Analytics**: Performance metrics and reporting
- **Notifications**: Real-time updates and alerts

### Backend Endpoints

```typescript
// AI Image Analysis
POST /api/analyze-image
// Returns: { categories: ["Garbage & Waste", "Pollution"] }

// User Authentication
POST /api/users/register
POST /api/users/login

// Problem Management
POST /api/problems
GET /api/problems/user/:user_id
GET /api/admin/problems

// Analytics
GET /api/analytics/dashboard
GET /api/analytics/departments
GET /api/analytics/workers
```

## 🎨 Technology Stack

### Frontend
- **React 18** - Modern UI library
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first styling
- **Radix UI** - Accessible component primitives
- **Lucide React** - Beautiful icons
- **Recharts** - Data visualization

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **Google Gemini AI** - Image analysis
- **PostgreSQL** - Database
- **JWT** - Authentication
- **Multer** - File upload handling

### Deployment
- **Vercel** - Frontend hosting
- **Neon** - PostgreSQL database hosting

## 📱 User Roles & Permissions

### 👤 **Citizen**
- Report civic issues with photo upload
- Track submitted problems
- Rate resolved issues
- View problem history

### 👷 **Field Worker**
- View assigned problems
- Update problem status
- Upload completion photos
- Update location and availability

### 🏢 **Department Head**
- Manage department-specific issues
- Assign workers to problems
- View department analytics
- Manage department workers

### 🏛️ **District Magistrate**
- Complete system oversight
- Access all analytics
- Manage departments and workers
- System-wide configuration

## 🌍 Multilingual Support

The application supports multiple languages with easy switching:

- **English** - Default language
- **Hindi** - Complete Hindi translation
- **Extensible** - Easy to add more languages

## 📊 Analytics & Reporting

### Dashboard Metrics
- Total complaints and resolution rates
- Department-wise performance
- Worker efficiency tracking
- Real-time activity monitoring
- Geographic distribution of issues

### Performance Tracking
- Average resolution time
- Citizen satisfaction ratings
- Worker assignment efficiency
- Department budget utilization

## 🚀 Deployment

### Vercel Deployment

1. **Connect Repository**
   ```bash
   vercel --prod
   ```

2. **Environment Variables**
   Set the following in Vercel dashboard:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_BACKEND_URL`

3. **Automatic Deployments**
   - Push to main branch triggers automatic deployment
   - Preview deployments for pull requests

### Build Configuration

The project is optimized for production with:
- **Code Splitting**: Separate chunks for vendor, UI, and app code
- **Tree Shaking**: Unused code elimination
- **Minification**: Optimized bundle sizes
- **Asset Optimization**: Compressed images and assets

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Use ESLint and Prettier for code formatting
- Write meaningful commit messages
- Test components before submitting PRs
- Update documentation for new features

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Figma Design**: Original design from [Figma](https://www.figma.com/design/KevOsQBVKI2RooDLmoY2OI/vviikkssiitt)
- **Google Gemini AI**: For intelligent image analysis
- **Open Source Community**: For the amazing tools and libraries

## 📞 Support

For support, email support@vikshitbharat.com or join our community discussions.

---

**Built with ❤️ for a better India** 🇮🇳

*Vikshit Bharat - Transforming civic issue management through technology*