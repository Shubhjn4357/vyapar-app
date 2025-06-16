export type UserRole = 'guest' | 'user' | 'staff' | 'manager' | 'admin' | 'developer';

export type SubscriptionStatus = 'active' | 'expired' | 'cancelled' | 'trial';

export type SubscriptionPlan = 'free' | 'basic' | 'premium' | 'unlimited';

export type AuthProvider = 'email' | 'google' | 'facebook' | 'apple';

export type UserPreferences = {
    theme: 'light' | 'dark' | 'system';
    language: string;
    currency: string;
    dateFormat: string;
    notifications: boolean;
    animations: boolean;
};

export type UserSubscription = {
    plan: SubscriptionPlan;
    status: SubscriptionStatus;
    expiresAt: string;
    companiesLimit: number;
    features: string[];
};

export type User = {
    id: number;
    name?: string;
    email?: string;
    mobile?: string;
    password?: string;
    role: UserRole;
    authProvider?: AuthProvider;
    googleId?: string;
    facebookId?: string;
    appleId?: string;
    isGuest?: boolean;
    isProfileComplete?: boolean;
    isEmailVerified?: boolean;
    isMobileVerified?: boolean;
    avatar?: string;
    preferences?: UserPreferences;
    subscription?: UserSubscription;
    lastLoginAt?: string;
    deviceInfo?: any;
    createdAt?: string;
    updatedAt?: string;
};


