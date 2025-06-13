# Vyapar App

A comprehensive business management mobile application built with React Native, TypeScript, and Expo. This app provides small and medium businesses with powerful tools to manage their operations, from invoicing and inventory to GST compliance and financial reporting.

## 🚀 Features

### Core Features
- **Multi-Platform Support**: iOS and Android with shared codebase
- **Offline-First Architecture**: Works seamlessly without internet connection
- **Type-Safe Navigation**: Comprehensive TypeScript navigation system
- **Real-time Sync**: Automatic data synchronization when online
- **Multi-Company Management**: Switch between multiple business entities
- **Role-Based Access**: Secure authentication with role-based permissions

### Business Features
- **Invoice & Billing**: Create professional invoices with GST calculations
- **Inventory Management**: Track products, stock levels, and pricing
- **Customer Management**: Comprehensive customer database with contact details
- **Payment Tracking**: Record payments and track outstanding amounts
- **GST Compliance**: Automated GST calculations and return filing
- **Financial Reports**: P&L statements, cash flow, and business analytics
- **Expense Tracking**: Monitor business expenses and categorize costs
- **Multi-Currency Support**: Handle transactions in different currencies

### User Experience
- **Dark/Light Theme**: Adaptive UI with user preference support
- **Intuitive Design**: Clean, modern interface following Material Design
- **Quick Actions**: Shortcuts for common business operations
- **Search & Filters**: Advanced search across all business data
- **Export Options**: PDF generation for invoices and reports
- **Backup & Restore**: Secure cloud backup of business data

## 🏗️ Architecture

### Tech Stack
- **Framework**: React Native with Expo
- **Language**: TypeScript for type safety
- **Navigation**: React Navigation v6 with typed navigation
- **State Management**: React Context API with custom hooks
- **UI Components**: React Native Paper (Material Design)
- **Forms**: React Hook Form with Zod validation
- **Storage**: Expo SecureStore for sensitive data, AsyncStorage for app data
- **Network**: Custom API client with offline support and caching
- **Authentication**: JWT-based authentication with biometric support

### Project Structure

```
src/
├── api/                        # API layer and HTTP client
│   ├── auth.ts                 # Authentication API calls
│   ├── bills.ts                # Billing and invoice APIs
│   ├── client.ts               # HTTP client configuration
│   ├── company.ts              # Company management APIs
│   ├── customers.ts            # Customer management APIs
│   ├── errors.ts               # API error handling
│   ├── gst.ts                  # GST-related APIs
│   ├── payments.ts             # Payment tracking APIs
│   ├── products.ts             # Product/inventory APIs
│   ├── profile.ts              # User profile APIs
│   └── reports.ts              # Analytics and reporting APIs
├── app/
│   └── App.tsx                 # Main application component
├── components/                 # Reusable UI components
│   ├── auth/                   # Authentication-specific components
│   ├── dashboard/              # Dashboard widgets and components
│   ├── AnimatedModal.tsx       # Custom modal with animations
│   ├── CompanySelector.tsx     # Company switching component
│   ├── CustomHeader.tsx        # Navigation header component
│   ├── ErrorBoundary.tsx       # Error boundary for crash handling
│   ├── Loader.tsx              # Loading indicators
│   ├── NetworkBanner.tsx       # Network status indicator
│   ├── SplashScreen.tsx        # App launch screen
│   └── ThemeSwitch.tsx         # Theme toggle component
├── config/
│   └── api.ts                  # API configuration and base URLs
├── contexts/                   # React Context providers
│   ├── AuthContext.tsx         # Authentication state management
│   ├── CompanyContext.tsx      # Company data management
│   ├── LoadingContext.tsx      # Global loading state
│   ├── NetworkContext.tsx      # Network connectivity state
│   ├── OfflineContext.tsx      # Offline functionality management
│   └── ThemeContext.tsx        # Theme and appearance settings
├── hooks/                      # Custom React hooks
│   ├── useBills.ts             # Bill management hooks
│   ├── useCompany.ts           # Company operations hooks
│   ├── useGST.ts               # GST calculation hooks
│   ├── usePayments.ts          # Payment tracking hooks
│   ├── useProducts.ts          # Product management hooks
│   ├── useProfile.ts           # User profile hooks
│   ├── useReports.ts           # Analytics and reporting hooks
│   └── useStyle.ts             # Theme-aware styling hooks
├── navigation/                 # Navigation configuration
│   ├── AccountingNavigator.tsx # Accounting module navigation
│   ├── AuthNavigator.tsx       # Authentication flow navigation
│   ├── BillNavigator.tsx       # Billing module navigation
│   ├── GSTNavigator.tsx        # GST module navigation
│   ├── MainTabNavigator.tsx    # Main tab navigation
│   ├── PaymentNavigator.tsx    # Payment module navigation
│   ├── ProductNavigator.tsx    # Product module navigation
│   ├── ReportNavigator.tsx     # Reports module navigation
│   └── RootNavigator.tsx       # Root navigation container
├── screens/                    # Screen components organized by feature
│   ├── accounting/             # Accounting and bookkeeping screens
│   ├── auth/                   # Authentication screens
│   │   ├── LoginScreen.tsx     # User login
│   │   ├── RegisterScreen.tsx  # User registration
│   │   ├── OTPVerificationScreen.tsx # OTP verification
│   │   ├── ForgotPasswordScreen.tsx  # Password recovery
│   │   ├── ResetPasswordScreen.tsx   # Password reset
│   │   └── CompleteProfileScreen.tsx # Profile completion
│   ├── bills/                  # Billing and invoice screens
│   ├── company/                # Company management screens
│   ├── dashboard/              # Dashboard and overview screens
│   ├── gst/                    # GST compliance screens
│   ├── payments/               # Payment tracking screens
│   ├── products/               # Product management screens
│   └── reports/                # Analytics and reporting screens
├── services/                   # Business logic and utilities
│   ├── ApiService.ts           # HTTP client with offline support
│   ├── NavigationService.ts    # Navigation utilities and helpers
│   └── OfflineService.ts       # Offline functionality and sync
├── theme/
│   └── colors.ts               # Theme colors and styling constants
├── types/                      # TypeScript type definitions
│   ├── account.ts              # Account and financial types
│   ├── aiInsight.ts            # AI insights and analytics types
│   ├── api.ts                  # API request/response types
│   ├── bill.ts                 # Billing and invoice types
│   ├── company.ts              # Company and business types
│   ├── customer.ts             # Customer management types
│   ├── gstTransaction.ts       # GST transaction types
│   ├── navigation.ts           # Navigation parameter types
│   ├── otp.ts                  # OTP verification types
│   ├── payment.ts              # Payment and transaction types
│   ├── product.ts              # Product and inventory types
│   ├── reports.ts              # Analytics and reporting types
│   └── user.ts                 # User profile and auth types
└── utils/
    └── storage.ts              # Storage utilities and helpers
```

## 📱 Screen Flow & Navigation

### Authentication Flow
```
SplashScreen → LoginScreen → OTPVerificationScreen → Dashboard
                    ↓
              RegisterScreen → OTPVerificationScreen → CompleteProfileScreen → Dashboard
                    ↓
            ForgotPasswordScreen → OTPVerificationScreen → ResetPasswordScreen → LoginScreen
```

### Main Application Flow
```
Dashboard (Tab Navigator)
├── Home (Dashboard Overview)
├── Bills (Invoice Management)
│   ├── BillListScreen
│   ├── CreateBillScreen
│   ├── EditBillScreen
│   └── BillDetailsScreen
├── Products (Inventory Management)
│   ├── ProductListScreen
│   ├── AddProductScreen
│   ├── EditProductScreen
│   └── ProductDetailsScreen
├── Payments (Payment Tracking)
│   ├── PaymentListScreen
│   ├── RecordPaymentScreen
│   └── PaymentDetailsScreen
└── Reports (Analytics)
    ├── SalesReportScreen
    ├── ProfitLossScreen
    ├── GSTReportScreen
    └── CustomReportScreen
```

## 🔧 Key Features Implementation

### Offline-First Architecture
- **Local Storage**: Critical data cached locally using AsyncStorage
- **Sync Queue**: Pending actions queued and executed when online
- **Conflict Resolution**: Smart merging of offline and online data
- **Network Detection**: Real-time network status monitoring

### Type-Safe Navigation
```typescript
// Navigation parameter types
type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Main: NavigatorScreenParams<MainTabParamList>;
  CompanyList: undefined;
  CompanyDetails: { companyId: string };
};

type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  OTPVerification: {
    mobile: string;
    otpId: string;
    type: 'register' | 'login' | 'forgot_password';
  };
  ForgotPassword: undefined;
  ResetPassword: {
    token: string;
    mobile: string;
    otpId: string;
  };
  CompleteProfile: {
    userId: string;
    token: string;
  };
};
```

### State Management
- **AuthContext**: User authentication and session management
- **CompanyContext**: Multi-company data and switching
- **OfflineContext**: Offline functionality and sync status
- **ThemeContext**: UI theme and appearance settings

### API Integration
- **Centralized HTTP Client**: Consistent API communication
- **Error Handling**: Comprehensive error management and user feedback
- **Request/Response Interceptors**: Authentication and logging
- **Retry Logic**: Automatic retry for failed requests

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Expo CLI (`npm install -g @expo/cli`)
- iOS Simulator (for iOS development)
- Android Studio/Emulator (for Android development)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Shubhjn4357/vyapar-app.git
   cd vyapar-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:
   ```env
   # API Configuration
   EXPO_PUBLIC_API_URL=http://localhost:3000/api
   
   # App Configuration
   EXPO_PUBLIC_APP_NAME=Vyapar
   EXPO_PUBLIC_APP_VERSION=1.0.0
   
   # Feature Flags
   EXPO_PUBLIC_ENABLE_BIOMETRIC_AUTH=true
   EXPO_PUBLIC_ENABLE_OFFLINE_MODE=true
   ```

4. **Start the development server**
   ```bash
   npm start
   ```

5. **Run on device/simulator**
   ```bash
   # iOS
   npm run ios
   
   # Android
   npm run android
   
   # Web (for testing)
   npm run web
   ```

### Development Workflow

1. **Code Style**
   ```bash
   # Lint code
   npm run lint
   
   # Format code
   npm run format
   
   # Type check
   npm run type-check
   ```

2. **Testing**
   ```bash
   # Run tests
   npm test
   
   # Run tests with coverage
   npm run test:coverage
   
   # Run E2E tests
   npm run test:e2e
   ```

3. **Build for Production**
   ```bash
   # Build for iOS
   npm run build:ios
   
   # Build for Android
   npm run build:android
   
   # Build for both platforms
   npm run build
   ```

## 📦 Dependencies

### Core Dependencies
- **react-native**: Mobile app framework
- **expo**: Development platform and tools
- **@react-navigation/native**: Navigation library
- **react-native-paper**: Material Design components
- **react-hook-form**: Form management
- **zod**: Runtime type validation
- **@react-native-async-storage/async-storage**: Local storage
- **@react-native-community/netinfo**: Network status
- **expo-secure-store**: Secure storage for sensitive data

### Development Dependencies
- **typescript**: Type safety
- **@types/react**: React type definitions
- **eslint**: Code linting
- **prettier**: Code formatting
- **jest**: Testing framework
- **@testing-library/react-native**: Testing utilities

## 🎨 UI/UX Design

### Design System
- **Material Design 3**: Modern, accessible design language
- **Consistent Typography**: Hierarchical text styling
- **Color Palette**: Brand-consistent colors with dark/light theme support
- **Spacing System**: Consistent spacing and layout patterns
- **Component Library**: Reusable, themed components

### Accessibility
- **Screen Reader Support**: VoiceOver and TalkBack compatibility
- **High Contrast**: Support for high contrast mode
- **Font Scaling**: Dynamic font size support
- **Touch Targets**: Minimum 44pt touch targets
- **Color Contrast**: WCAG AA compliant color ratios

### Responsive Design
- **Adaptive Layouts**: Responsive to different screen sizes
- **Orientation Support**: Portrait and landscape modes
- **Tablet Optimization**: Enhanced layouts for larger screens
- **Safe Area Handling**: Proper handling of notches and home indicators

## 🔐 Security

### Data Protection
- **Encryption**: Sensitive data encrypted at rest
- **Secure Storage**: Biometric-protected secure storage
- **API Security**: JWT tokens with refresh mechanism
- **Input Validation**: Client and server-side validation
- **Error Handling**: Secure error messages without data leakage

### Authentication
- **Multi-Factor Authentication**: OTP-based verification
- **Biometric Authentication**: Fingerprint and Face ID support
- **Session Management**: Secure token handling and refresh
- **Auto-Logout**: Automatic logout on inactivity

## 📊 Performance

### Optimization Strategies
- **Code Splitting**: Lazy loading of screens and components
- **Image Optimization**: Compressed and cached images
- **Bundle Analysis**: Regular bundle size monitoring
- **Memory Management**: Efficient memory usage patterns
- **Network Optimization**: Request batching and caching

### Monitoring
- **Crash Reporting**: Automatic crash detection and reporting
- **Performance Metrics**: App performance monitoring
- **User Analytics**: Usage patterns and feature adoption
- **Error Tracking**: Real-time error monitoring and alerts

## 🧪 Testing

### Testing Strategy
- **Unit Tests**: Component and utility function testing
- **Integration Tests**: API integration and data flow testing
- **E2E Tests**: Complete user journey testing
- **Visual Testing**: UI consistency and regression testing
- **Performance Testing**: Load and stress testing

### Test Coverage
- Minimum 80% code coverage
- Critical path testing for all user flows
- Error scenario testing
- Offline functionality testing

## 🚀 Deployment

### Build Process
1. **Pre-build Checks**: Linting, type checking, and testing
2. **Asset Optimization**: Image compression and bundling
3. **Code Signing**: iOS and Android app signing
4. **Store Submission**: Automated submission to app stores

### Release Management
- **Semantic Versioning**: Consistent version numbering
- **Release Notes**: Detailed changelog for each release
- **Staged Rollout**: Gradual release to user base
- **Rollback Strategy**: Quick rollback for critical issues

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Guidelines
1. Follow TypeScript best practices
2. Write tests for new features
3. Update documentation for API changes
4. Follow the established code style
5. Create detailed pull request descriptions

## 🆘 Support

### Getting Help
- **Documentation**: Check the [Wiki](../../wiki) for detailed guides
- **Issues**: Report bugs and request features on [GitHub Issues](../../issues)
- **Discussions**: Join community discussions on [GitHub Discussions](../../discussions)
- **Email**: Contact support at support@vyapar.app

### Troubleshooting
- **Build Issues**: Check the [Build Troubleshooting Guide](docs/troubleshooting.md)
- **Performance**: See [Performance Optimization Guide](docs/performance.md)
- **Deployment**: Review [Deployment Guide](docs/deployment.md)

## 🔄 Changelog

### v1.0.0 (Current)
- ✅ Complete authentication flow with OTP verification
- ✅ Multi-company management system
- ✅ Offline-first architecture with sync capabilities
- ✅ Type-safe navigation system
- ✅ Material Design 3 UI components
- ✅ GST compliance features
- ✅ Invoice and billing management
- ✅ Product and inventory tracking
- ✅ Payment management system
- ✅ Financial reporting and analytics

### Upcoming Features
- 🔄 AI-powered business insights
- 🔄 Advanced reporting dashboard
- 🔄 Multi-currency support
- 🔄 Expense tracking module
- 🔄 Integration with accounting software
- 🔄 Advanced GST return filing
- 🔄 Customer portal access
- 🔄 Inventory forecasting

---

**Built with ❤️ for small businesses in India**

*Empowering entrepreneurs with technology to grow their businesses efficiently and compliantly.*