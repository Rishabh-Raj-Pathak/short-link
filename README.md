# 🔗 URL Shortener - All-in-One Link Management Platform

> **📹 Demo Video**: Check out [`shorten-url-demo-video.mp4`](./client/public/shorten-url-demo-video.mp4) in the `client/public/` folder for a complete walkthrough of the application features and functionality.

A modern, full-stack URL shortening platform built with the MERN stack. Transform long URLs into short, trackable links with comprehensive analytics, QR code generation, and a beautiful user interface.

## ✨ Key Features

### 🎯 Core Functionality

- **Smart URL Shortening**: Generate unique 7-character short codes using base62 encoding
- **Instant QR Codes**: Automatic QR code generation for every shortened URL with download capability
- **Universal Access**: Works for both anonymous users and registered members
- **Duplicate Detection**: Smart deduplication for authenticated users - same URL returns existing short link

### 🔐 Authentication & Security

- **Secure Authentication**: JWT-based auth with HTTP-only cookies
- **Password Security**: bcrypt hashing with salt rounds ≥ 10
- **Input Validation**: Comprehensive URL validation (http/https only)
- **Loop Prevention**: Automatic detection and blocking of redirect loops
- **CORS Protection**: Strict cross-origin resource sharing policies

### 📊 Advanced Analytics

- **Real-time Click Tracking**: Instant click count updates
- **Monthly Analytics**: Detailed month-by-month performance breakdown
- **Interactive Charts**: Beautiful bar charts showing performance trends
- **Date Range Filtering**: Analyze performance within custom time periods
- **Performance Metrics**: Average monthly clicks, peak performance months, growth rates

### 🎨 User Experience

- **Modern UI/UX**: Beautiful gradient designs with smooth animations
- **Responsive Design**: Perfect experience across desktop, tablet, and mobile
- **Dark/Light Themes**: Elegant color schemes with purple and blue gradients
- **Interactive Elements**: Hover effects, loading states, and micro-animations
- **Copy-to-Clipboard**: One-click copying of shortened URLs

### 🏗️ Dashboard Features

- **Link Management**: View all your shortened links in one place
- **Search & Filter**: Find links quickly with real-time search
- **Sorting Options**: Sort by creation date or click performance
- **Detailed Analytics**: Click on any link to view comprehensive analytics
- **Performance Overview**: Visual progress bars and trend indicators

## 🛠️ Tech Stack

### Frontend

- **Framework**: React 19 with Vite for lightning-fast development
- **Routing**: React Router v7 for seamless navigation
- **Styling**: Tailwind CSS v4 with custom animations and gradients
- **Charts**: Recharts for beautiful, interactive data visualizations
- **QR Codes**: qrcode.react for instant QR code generation
- **HTTP Client**: Native Fetch API with credential handling

### Backend

- **Runtime**: Node.js with Express.js framework
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT tokens stored in secure HTTP-only cookies
- **Password Hashing**: bcrypt for secure password storage
- **URL Generation**: nanoid for generating unique short codes
- **Environment Management**: dotenv for configuration

### Database Schema

- **Users Collection**: Email, hashed passwords, creation timestamps
- **Links Collection**: Owner references, short codes, original URLs, click analytics
- **Analytics Tracking**: Total clicks and monthly breakdown with Map data structure

## 🚀 Architecture Highlights

### Security First

- HTTP-only cookies prevent XSS attacks
- CORS configured for specific origins only
- Input sanitization and validation at every endpoint
- Secure password hashing with industry-standard practices

### Performance Optimized

- Efficient MongoDB indexing for fast lookups
- Atomic click increment operations
- Optimized React rendering with proper state management
- Responsive design with minimal bundle size

### Scalable Design

- RESTful API architecture
- Modular component structure
- Environment-based configuration
- Database indexes for optimal query performance

## 📱 User Journey

### Public Access

1. **Home Page**: Clean, intuitive interface for URL shortening
2. **Instant Results**: Get shortened URL and QR code immediately
3. **No Registration Required**: Anonymous users can create short links

### Authenticated Experience

1. **Sign Up/Login**: Secure account creation and authentication
2. **Personal Dashboard**: Manage all your shortened links
3. **Advanced Analytics**: Deep insights into link performance
4. **Link Deduplication**: Intelligent handling of duplicate URLs

### Analytics Deep Dive

1. **Click Tracking**: Real-time click count updates
2. **Monthly Breakdown**: Detailed performance by month
3. **Visual Charts**: Interactive bar charts for trend analysis
4. **Export Options**: Download QR codes as PNG files

## 🔧 API Endpoints

### Authentication

- `POST /auth/signup` - Create new user account
- `POST /auth/login` - User authentication
- `POST /auth/logout` - Secure session termination
- `GET /auth/me` - Get current user profile

### Link Management

- `POST /api/shorten` - Create shortened URL (public/authenticated)
- `GET /api/links` - List user's links with sorting and search
- `GET /api/links/:id` - Get specific link details
- `GET /api/links/:id/analytics` - Detailed analytics with date filtering
- `DELETE /api/links/:id` - Remove link (optional feature)

### Redirect Service

- `GET /:shortCode` - Redirect to original URL with analytics tracking

## 🎨 Design Philosophy

### Modern Aesthetics

- **Gradient-based Design**: Beautiful purple-to-blue color schemes
- **Glassmorphism Effects**: Frosted glass backgrounds with backdrop blur
- **Smooth Animations**: CSS transitions and keyframe animations
- **Interactive Feedback**: Hover states and loading indicators

### User-Centric Approach

- **Intuitive Navigation**: Clear information hierarchy
- **Responsive Layout**: Mobile-first design principles
- **Accessibility**: Semantic HTML and proper contrast ratios
- **Performance**: Optimized images and efficient rendering

## 🔒 Security Features

- **JWT Security**: Secure token-based authentication
- **HTTPS Enforcement**: SSL/TLS encryption for all communications
- **Input Validation**: Comprehensive server-side validation
- **SQL Injection Prevention**: Mongoose ODM protection
- **XSS Protection**: HTTP-only cookies and input sanitization

## 📈 Analytics Capabilities

### Real-time Metrics

- Total click counts with live updates
- Monthly performance breakdowns
- Peak performance identification
- Growth rate calculations

### Visual Analytics

- Interactive bar charts
- Performance trend indicators
- Monthly comparison views
- Custom date range analysis

## 🌟 Unique Features

1. **Smart Deduplication**: Returns existing short links for authenticated users
2. **Anonymous Support**: Works without registration for basic functionality
3. **Instant QR Codes**: Automatic generation with download options
4. **Beautiful UI**: Modern design with smooth animations
5. **Comprehensive Analytics**: Deep insights into link performance
6. **Mobile Optimized**: Perfect experience across all devices

## 🎯 Use Cases

- **Marketing Campaigns**: Track link performance across different channels
- **Social Media**: Share clean, professional-looking links
- **Email Marketing**: Monitor click-through rates and engagement
- **Event Management**: Create trackable links for event promotions
- **Content Sharing**: Generate QR codes for offline-to-online transitions
- **Analytics Tracking**: Understand audience behavior and preferences

---

**Built with ❤️ using modern web technologies and best practices for security, performance, and user experience.**
