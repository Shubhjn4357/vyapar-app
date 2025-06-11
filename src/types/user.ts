export enum UserRole {
    ADMIN = 'ADMIN',
    USER = 'USER',
    MANAGER = 'MANAGER',
    SUPER = 'SUPER',
}

export enum SubscriptionStatus {
    ACTIVE = 'active',
    EXPIRED = 'expired',
    CANCELLED = 'cancelled',
}

export interface User {
    id: number;
    name?: string;
    email?: string;
    mobile: string;
    password?: string;
    role: UserRole;
    googleId?: string;
    facebookId?: string;
    appleId?: string;
    isProfileComplete?: boolean;
    subscription?: {
        planId: string;
        status: SubscriptionStatus;
        expiresAt: string;
    };
    companies: string[]; // Array of company IDs
    selectedCompanyId?: string;
    createdAt?: string;
    updatedAt?: string;
}

