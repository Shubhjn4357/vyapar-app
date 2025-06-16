export interface OTP {
    id: number;
    identifier: string;
    type: string;
    otp: string;
    expiresAt: string;
    createdAt?: string;
    verified?: boolean;
}
