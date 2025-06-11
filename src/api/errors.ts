export class ApiError extends Error {
    constructor(
        message: string,
        public originalError?: any,
        public statusCode?: number
    ) {
        super(message,originalError);
        this.name = 'ApiError';
    }
}

export class AuthError extends ApiError {
    constructor(message: string, originalError?: any) {
        super(message, originalError, 401);
        this.name = 'AuthError';
    }
}
