import { createNavigationContainerRef, CommonActions } from '@react-navigation/native';
import { RootStackParamList } from '../types/navigation';

export const navigationRef = createNavigationContainerRef<RootStackParamList>();

export function navigate<T extends keyof RootStackParamList>(
  name: T,
  params?: RootStackParamList[T]
) {
  if (navigationRef.isReady()) {
    navigationRef.navigate(name as any, params as any);
  }
}

export function goBack() {
  if (navigationRef.isReady()) {
    navigationRef.goBack();
  }
}

export function reset(routeName: keyof RootStackParamList, params?: any) {
  if (navigationRef.isReady()) {
    navigationRef.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: routeName as any, params }],
      })
    );
  }
}

export function push<T extends keyof RootStackParamList>(
  name: T,
  params?: RootStackParamList[T]
) {
  if (navigationRef.isReady()) {
    navigationRef.dispatch(CommonActions.navigate({ name: name as any, params }));
  }
}

export function replace<T extends keyof RootStackParamList>(
  name: T,
  params?: RootStackParamList[T]
) {
  if (navigationRef.isReady()) {
    navigationRef.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: name as any, params }],
      })
    );
  }
}

export function getCurrentRoute() {
  if (navigationRef.isReady()) {
    return navigationRef.getCurrentRoute();
  }
  return null;
}

export function getRootState() {
  if (navigationRef.isReady()) {
    return navigationRef.getRootState();
  }
  return null;
}

// Type-safe navigation helpers for specific flows
export const NavigationHelpers = {
  // Auth flow helpers
  navigateToLogin: () => navigate('Auth', { screen: 'Login' }),
  navigateToRegister: () => navigate('Auth', { screen: 'Register' }),
  navigateToOTP: (params: { mobile: string; otpId: string; type: 'register' | 'forgot_password' | 'login'; userId?: number }) => 
    navigate('Auth', { screen: 'OTPVerification', params }),
  navigateToForgotPassword: (mobile?: string) => 
    navigate('Auth', { screen: 'ForgotPassword', params: { mobile } }),
  navigateToResetPassword: (params: { token: string; mobile: string; otpId: string }) => 
    navigate('Auth', { screen: 'ResetPassword', params }),
  navigateToCompleteProfile: (params: { userId?: number; fromAuth?: boolean }) => 
    navigate('CompleteProfile', params),
  
  // Main app flow helpers
  navigateToMain: () => reset('Main'),
  navigateToCompanyList: () => navigate('CompanyList'),
  navigateToCreateCompany: () => navigate('CreateCompany'),
  navigateToEditCompany: (companyId: string) => navigate('EditCompany', { companyId }),
  
  // Reset to specific flows
  resetToAuth: () => reset('Auth'),
  resetToMain: () => reset('Main'),
  resetToSplash: () => reset('Splash'),
};