export interface ApiResponse<T = any> {
    data: T;
    message?: string;
    status: 'success' | 'error';
}

export interface PaginatedResponse<T> extends ApiResponse {
    data: {
        items: T[];
        total: number;
        page: number;
        pageSize: number;
    };
}

export interface ErrorResponse {
    message: string;
    code?: string;
    details?: Record<string, any>;
}
