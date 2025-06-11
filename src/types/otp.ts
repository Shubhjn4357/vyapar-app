export interface OTP {
    id: number;
    mobile: string;
    otp: string;
    expiresAt: string;
    createdAt?: string;
    verified?: boolean;
}
