import { NavigatorScreenParams } from '@react-navigation/native';

export type RootStackParamList = {
  Splash: undefined;
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Main: NavigatorScreenParams<MainTabParamList>;
  CompanyList: undefined;
  CreateCompany: undefined;
  EditCompany: { companyId: string };
  CompleteProfile?: { userId: number };
};

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: {mobile?:string};
  OTPVerification: { mobile: string; otpId: string };
  CompleteProfile?: { userId: number };
  ResetPassword: { token: string; mobile: string }; // <-- add mobile here
  SocialAuth: { provider: 'google' | 'facebook'; token: string };
  Main: NavigatorScreenParams<MainTabParamList>;
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