# 🔗 URL Shortener - All-in-One Link Management Platform

## 📹 Demo Video

> **🎥 Click the video below to watch the complete demo showcasing all application features:**

https://github.com/user-attachments/assets/61aaa2c4-07c4-4802-b3dd-117333715a07

**What you'll see in the demo:**

- 🔗 URL shortening process with instant results
- 📱 Automatic QR code generation and download
- 🔐 User authentication and secure login
- 📊 Interactive dashboard with analytics
- 📈 Real-time click tracking and monthly charts
- ✨ Beautiful UI animations and responsive design

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

## 🧪 Comprehensive Testing Strategy

### ✅ Functional Test Cases

Our application has been designed with comprehensive testing in mind, covering all critical user flows and business logic:

#### **Authentication & User Management**

- ✅ **New User Registration**: Successful account creation with email validation
- ✅ **User Login**: Existing user authentication with credential verification
- ✅ **Invalid Credentials**: Proper rejection and error handling for wrong passwords
- ✅ **Session Management**: JWT token validation and secure logout functionality

#### **URL Shortening Core Features**

- ✅ **Valid URL Processing**: Successful shortening of http/https URLs
- ✅ **QR Code Generation**: Automatic QR code creation for every shortened link
- ✅ **Instant Response**: Real-time short URL and QR code delivery
- ✅ **Link Deduplication**: Smart detection - same user + same URL returns existing short link

#### **Redirect & Analytics**

- ✅ **Redirect Functionality**: Seamless redirection from short URL to original destination
- ✅ **Click Tracking**: Accurate increment of total click counts
- ✅ **Monthly Analytics**: Precise month-by-month click tracking
- ✅ **Real-time Updates**: Instant analytics updates on each click

### 🛡️ Edge Cases & Security Testing

#### **Input Validation & Security**

- 🔒 **Invalid URL Schemes**: Rejection of URLs without proper scheme (`example.com`)
- 🔒 **Unsupported Protocols**: Blocking dangerous protocols (`ftp://`, `javascript:`, `data:`)
- 🔒 **Redirect Loop Prevention**: Intelligent detection and blocking of URLs starting with `BASE_URL`
- 🔒 **XSS Prevention**: Comprehensive input sanitization and validation

#### **Authorization & Data Protection**

- 🔐 **User Isolation**: Users cannot view or modify other users' links
- 🔐 **Authentication Required**: Protected routes properly enforce login requirements
- 🔐 **Data Ownership**: Strict enforcement of link ownership for analytics access

#### **System Reliability**

- ⚡ **Short Code Collisions**: Unique database index with automatic retry on rare collisions
- ⚡ **Concurrent Clicks**: Atomic database operations ensure accurate click counting
- ⚡ **Malformed Input**: Graceful error handling without server crashes
- ⚡ **Database Consistency**: Proper error handling and transaction management

#### **Analytics Accuracy**

- 📊 **Timezone Consistency**: Month bucketing aligned with server timezone
- 📊 **Data Integrity**: Accurate monthly analytics with proper date handling
- 📊 **Performance Metrics**: Reliable calculation of growth rates and trends

### 🔍 Quality Assurance Highlights

- **Comprehensive Validation**: Every input is validated both client-side and server-side
- **Security-First Approach**: Multiple layers of security testing and validation
- **Error Handling**: Graceful degradation and meaningful error messages
- **Performance Testing**: Optimized database queries and efficient data structures
- **Cross-Browser Compatibility**: Tested across different browsers and devices
- **Responsive Design**: Thorough testing on various screen sizes and orientations

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

## 🎯 Use Cases

- **Marketing Campaigns**: Track link performance across different channels
- **Social Media**: Share clean, professional-looking links
- **Email Marketing**: Monitor click-through rates and engagement
- **Event Management**: Create trackable links for event promotions
- **Content Sharing**: Generate QR codes for offline-to-online transitions
- **Analytics Tracking**: Understand audience behavior and preferences

---

**Built with ❤️ using modern web technologies and best practices for security, performance, and user experience.**
