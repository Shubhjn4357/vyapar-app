import { NavigatorScreenParams } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { CompositeNavigationProp, RouteProp } from '@react-navigation/native';

export type RootStackParamList = {
  Splash: undefined;
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Main: NavigatorScreenParams<MainTabParamList>;
  CompanyList: undefined;
  CreateCompany: undefined;
  EditCompany: { companyId: string };
  CompleteProfile: { userId?: number; fromAuth?: boolean };
};

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: { mobile?: string };
  OTPVerification: { 
    mobile: string; 
    otpId: string; 
    type: 'register' | 'forgot_password' | 'login';
    userId?: number;
  };
  ResetPassword: { 
    token: string; 
    mobile: string; 
    otpId: string;
  };
  CompleteProfile: { 
    userId: number; 
    fromAuth: boolean;
  };
  SocialAuth: { 
    provider: 'google' | 'facebook'; 
    token: string; 
  };
};

// Navigation prop types for type safety
export type RootStackNavigationProp = StackNavigationProp<RootStackParamList>;
export type AuthStackNavigationProp = StackNavigationProp<AuthStackParamList>;

// Composite navigation types for nested navigators
export type AuthNavigationProp = CompositeNavigationProp<
  StackNavigationProp<AuthStackParamList>,
  StackNavigationProp<RootStackParamList>
>;

export type MainTabNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<MainTabParamList>,
  StackNavigationProp<RootStackParamList>
>;

// Route prop types
export type AuthRouteProp<T extends keyof AuthStackParamList> = RouteProp<AuthStackParamList, T>;
export type RootRouteProp<T extends keyof RootStackParamList> = RouteProp<RootStackParamList, T>;

// Screen props types for easy use in components
export type LoginScreenProps = {
  navigation: AuthNavigationProp;
  route: AuthRouteProp<'Login'>;
};

export type RegisterScreenProps = {
  navigation: AuthNavigationProp;
  route: AuthRouteProp<'Register'>;
};

export type OTPVerificationScreenProps = {
  navigation: AuthNavigationProp;
  route: AuthRouteProp<'OTPVerification'>;
};

export type ForgotPasswordScreenProps = {
  navigation: AuthNavigationProp;
  route: AuthRouteProp<'ForgotPassword'>;
};

export type ResetPasswordScreenProps = {
  navigation: AuthNavigationProp;
  route: AuthRouteProp<'ResetPassword'>;
};

export type CompleteProfileScreenProps = {
  navigation: RootStackNavigationProp;
  route: RootRouteProp<'CompleteProfile'>;
};

export type CompanyStackParamList = {
  CompanyList: undefined;
  CreateCompany: undefined;
  EditCompany: { companyId: string };
};



export type MainTabParamList = {
  Dashboard: undefined;
  Bills: NavigatorScreenParams<BillStackParamList>;
  Products: NavigatorScreenParams<ProductStackParamList>;
  Payments: NavigatorScreenParams<PaymentStackParamList>;
  GST: NavigatorScreenParams<GSTStackParamList>;
  Reports: NavigatorScreenParams<ReportStackParamList>;
};

export type BillStackParamList = {
  BillList: undefined;
  CreateBill: undefined;
  BillDetails: { billId: number };
  EditBill: { billId: number };
};

export type AccountingStackParamList = {
  LedgerList: undefined;
  CreateLedger: undefined;
  JournalEntry: undefined;
  TrialBalance: undefined;
  BalanceSheet: undefined;
};

export type GSTStackParamList = {
  GSTDashboard: undefined;
  GSTR1: { month: string; year: string };
  GSTR2: { month: string; year: string };
  GSTR3B: { month: string; year: string };
  GSTReconciliation: undefined;
};

export type ProductStackParamList = {
  ProductsList: undefined;
  ProductDetails: { productId: string };
  AddProduct: undefined;
  EditProduct: { productId: string };
};

export type PaymentStackParamList = {
  PaymentsList: undefined;
  PaymentDetails: { paymentId: string };
  AddPayment: undefined;
  EditPayment: { paymentId: string };
};

export type ReportStackParamList = {
  ReportDashboard: undefined;
  SalesReport: { fromDate: string; toDate: string };
  PurchaseReport: { fromDate: string; toDate: string };
  TaxReport: { fromDate: string; toDate: string };
  ProfitLoss: { fromDate: string; toDate: string };
};