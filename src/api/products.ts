import { client } from './client';
import { ApiResponse } from '../types/api';
import { 
    Product, 
    ProductFilters, 
    CreateProductData, 
    UpdateProductData, 
    StockUpdateData 
} from '../types/product';

export interface ProductsListResponse {
    products: Product[];
    total: number;
    page: number;
    totalPages: number;
}

export interface BulkImportResponse {
    imported: number;
    failed: number;
    errors: string[];
}

export interface ExportData {
    format: 'csv' | 'excel';
    filters?: {
        category?: string;
        isActive?: boolean;
        companyId?: string;
    };
}

export interface ExportResponse {
    downloadUrl: string;
    fileName: string;
}

export const productsApi = {
    // Get all products with filters and pagination
    getProducts: async (filters: ProductFilters = {}): Promise<ApiResponse<ProductsListResponse>> => {
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                params.append(key, value.toString());
            }
        });
        
        const response = await client.get(`/products?${params.toString()}`);
        return response as unknown as any;
    },

    // Create a new product
    createProduct: async (productData: CreateProductData): Promise<ApiResponse<Product>> => {
        const response = await client.post('/products', productData);
        return response as unknown as any;
    },

    // Get product by ID
    getProductById: async (id: string): Promise<ApiResponse<Product>> => {
        const response = await client.get(`/products/${id}`);
        return response as unknown as any;
    },

    // Update product
    updateProduct: async (id: string, updateData: UpdateProductData): Promise<ApiResponse<Product>> => {
        const response = await client.put(`/products/${id}`, updateData);
        return response as unknown as any;
    },

    // Delete product
    deleteProduct: async (id: string): Promise<ApiResponse<{ message: string }>> => {
        const response = await client.delete(`/products/${id}`);
        return response as unknown as any;
    },

    // Search products
    searchProducts: async (query: string, filters: {
        companyId?: string;
        limit?: number;
    } = {}): Promise<ApiResponse<Product[]>> => {
        const params = new URLSearchParams({ q: query });
        Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                params.append(key, value.toString());
            }
        });
        
        const response = await client.get(`/products/search?${params.toString()}`);
        return response as unknown as any;
    },

    // Get product categories
    getCategories: async (companyId?: string): Promise<ApiResponse<string[]>> => {
        const params = companyId ? new URLSearchParams({ companyId }) : '';
        const response = await client.get(`/products/categories?${params.toString()}`);
        return response as unknown as any;
    },

    // Get low stock products
    getLowStockProducts: async (filters: {
        threshold?: number;
        companyId?: string;
    } = {}): Promise<ApiResponse<Product[]>> => {
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                params.append(key, value.toString());
            }
        });
        
        const response = await client.get(`/products/low-stock?${params.toString()}`);
        return response as unknown as any;
    },

    // Update stock
    updateStock: async (id: string, stockData: StockUpdateData): Promise<ApiResponse<Product>> => {
        const response = await client.post(`/products/${id}/stock`, stockData);
        return response as unknown as any;
    },

    // Bulk import products
    bulkImport: async (file: FormData): Promise<ApiResponse<BulkImportResponse>> => {
        const response = await client.post('/products/bulk-import', file, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response as unknown as any;
    },

    // Export products
    exportProducts: async (exportData: ExportData): Promise<ApiResponse<ExportResponse>> => {
        const response = await client.post('/products/export', exportData);
        return response as unknown as any;
    },
};