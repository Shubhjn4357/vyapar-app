# Vyapar App - Complete Setup Guide

This guide will help you set up the comprehensive Vyapar business management application with all its advanced features.

## 🚀 Features Implemented

### Authentication & User Management
- ✅ Guest mode (offline usage)
- ✅ Email/Mobile OTP authentication
- ✅ Google OAuth integration
- ✅ Facebook OAuth integration
- ✅ Role-based access control (Developer, Admin, Manager, Staff, Guest)
- ✅ Profile completion flow
- ✅ Guest to user conversion

### Offline/Online Synchronization
- ✅ Complete offline functionality
- ✅ Automatic sync when online
- ✅ Conflict resolution
- ✅ Background sync
- ✅ Sync status tracking

### Business Features
- ✅ Multi-company support with subscription limits
- ✅ Role-based permissions per company
- ✅ Bill management with export options
- ✅ Inventory management
- ✅ Customer management
- ✅ Payment tracking
- ✅ GST compliance
- ✅ AI-powered insights and analytics

### Advanced Features
- ✅ File upload with image compression
- ✅ QR code generation for payments
- ✅ Ledger creation (Tally-like)
- ✅ Bill template customization
- ✅ Multiple export formats (PDF, Excel, JSON, Tally.dat)
- ✅ Push notifications
- ✅ Advanced theming (Light/Dark/System)
- ✅ Gesture controls
- ✅ Admin panel for super users

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- PostgreSQL database (Neon recommended)
- Expo CLI
- Android Studio (for Android development)
- Xcode (for iOS development)

## 🛠️ Server Setup

### 1. Environment Configuration

Create `.env` file in `/workspace/vyapar-server/`:

```env
# Database
DATABASE_URL="postgresql://username:password@host:5432/database_name"

# JWT Secret (generate a strong secret)
JWT_SECRET="your-super-secret-jwt-key-minimum-32-characters"

# Email Configuration (Gmail SMTP - Free)
EMAIL_USER="your-email@gmail.com"
EMAIL_APP_PASSWORD="your-16-character-app-password"

# Twilio Configuration (Free trial: $15 credit)
TWILIO_ACCOUNT_SID="ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
TWILIO_AUTH_TOKEN="your-twilio-auth-token"
TWILIO_PHONE_NUMBER="+1234567890"

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Facebook OAuth
FACEBOOK_APP_ID="your-facebook-app-id"
FACEBOOK_APP_SECRET="your-facebook-app-secret"

# OpenAI API (for AI insights)
OPENAI_API_KEY="sk-your-openai-api-key"

# Server Configuration
PORT=4000
NODE_ENV="development"
```

### 2. Install Dependencies

```bash
cd /workspace/vyapar-server
npm install
```

### 3. Database Setup

```bash
# Generate and run migrations
npm run db:generate
npm run db:migrate
```

### 4. Start Server

```bash
npm run dev
```

## 📱 Client Setup

### 1. Environment Configuration

Create `.env` file in `/workspace/vyapar-app/`:

```env
EXPO_PUBLIC_API_URL="http://localhost:4000"

# Google OAuth (get from Google Cloud Console)
EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID="your-web-client-id.apps.googleusercontent.com"
EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID="your-ios-client-id.apps.googleusercontent.com"
EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID="your-android-client-id.apps.googleusercontent.com"

# Facebook OAuth (get from Facebook Developers)
EXPO_PUBLIC_FACEBOOK_APP_ID="your-facebook-app-id"
```

### 2. Install Dependencies

```bash
cd /workspace/vyapar-app
npm install
```

### 3. Start Development Server

```bash
npx expo start
```

## 🔑 Getting OAuth Credentials

### Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client IDs"
5. Create credentials for:
   - Web application
   - iOS application  
   - Android application
6. Add authorized redirect URIs:
   - Web: `http://localhost:4000/api/auth/google/callback`
   - Mobile: Use Expo's redirect URI format

### Facebook OAuth Setup

1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Create a new app
3. Add Facebook Login product
4. Configure OAuth redirect URIs:
   - Web: `http://localhost:4000/api/auth/facebook/callback`
   - Mobile: Use Expo's redirect URI format
5. Get App ID and App Secret

### Email Setup (Gmail)

1. Enable 2-Factor Authentication on your Gmail account
2. Go to Google Account settings
3. Generate an "App Password" for the application
4. Use this 16-character password in EMAIL_APP_PASSWORD

### SMS Setup (Twilio)

1. Sign up at [Twilio](https://www.twilio.com/)
2. Get $15 free credit for trial
3. Get Account SID, Auth Token, and Phone Number
4. Verify your phone number for testing

### OpenAI Setup

1. Sign up at [OpenAI](https://platform.openai.com/)
2. Get API key from API section
3. Add billing information (pay-per-use)

## 🗄️ Database Setup (Neon)

1. Sign up at [Neon](https://neon.tech/)
2. Create a new PostgreSQL database
3. Copy the connection string
4. Update DATABASE_URL in server .env

## 📦 Build Configuration

### Android Build

```bash
cd /workspace/vyapar-app
npx expo build:android
```

### iOS Build

```bash
cd /workspace/vyapar-app
npx expo build:ios
```

### Web Build

```bash
cd /workspace/vyapar-app
npx expo export:web
```

## 🔧 Advanced Configuration

### Push Notifications

1. Configure Expo push notifications
2. Get push tokens in the app
3. Send tokens to server for storage
4. Use server notification service to send notifications

### File Storage

- Local storage for offline mode
- Server storage for uploaded files
- Image compression for optimization

### Backup & Sync

- Google Drive integration for backup
- Automatic sync when online
- Conflict resolution for data integrity

## 🚀 Deployment

### Server Deployment (Railway/Vercel/Heroku)

1. Set up environment variables
2. Configure database connection
3. Deploy server code
4. Update client API_URL

### Client Deployment

1. Build for production
2. Deploy web version to Vercel/Netlify
3. Submit mobile apps to stores

## 📊 Subscription Plans

- **Free**: 1 company, basic features
- **Basic**: 3 companies, advanced features  
- **Premium**: 5 companies, all features
- **Unlimited**: Contact developer, unlimited access

## 🛡️ Security Features

- JWT authentication
- Role-based access control
- Data encryption
- Secure file uploads
- Input validation
- SQL injection prevention

## 📈 Performance Optimizations

- Image compression
- Lazy loading
- Offline caching
- Background sync
- Optimized queries
- CDN for static assets

## 🐛 Troubleshooting

### Common Issues

1. **Database connection failed**: Check DATABASE_URL format
2. **OAuth not working**: Verify redirect URIs
3. **OTP not received**: Check Twilio configuration
4. **Build failures**: Clear cache and reinstall dependencies

### Debug Commands

```bash
# Clear Expo cache
npx expo r -c

# Reset Metro cache
npx react-native start --reset-cache

# Check database connection
npm run db:studio
```

## 📞 Support

For issues and support:
- Check the troubleshooting section
- Review environment configuration
- Verify all API keys and credentials
- Check server logs for errors

## 🎯 Next Steps

1. Set up all environment variables
2. Configure OAuth providers
3. Test authentication flows
4. Set up database
5. Deploy to production
6. Configure push notifications
7. Set up monitoring and analytics

This comprehensive setup will give you a fully functional business management application with offline capabilities, advanced authentication, AI insights, and much more!