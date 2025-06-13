import { useState, useEffect } from 'react';
import { productsApi } from '../api/products';
import { 
    Product, 
    ProductFilters, 
    CreateProductData, 
    UpdateProductData,
    StockUpdateData 
} from '../types/product';

export const useProducts = (filters: ProductFilters = {}) => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);

    const fetchProducts = async (newFilters: ProductFilters = {}) => {
        setLoading(true);
        setError(null);
        try {
            const response = await productsApi.getProducts({ ...filters, ...newFilters });
            if (response.status === 'success' && response.data) {
                setProducts(response.data.products);
                setTotal(response.data.total);
                setPage(response.data.page);
                setTotalPages(response.data.totalPages);
            }
        } catch (err: any) {
            setError(err.message || 'Failed to fetch products');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const createProduct = async (productData: CreateProductData): Promise<Product | null> => {
        setLoading(true);
        setError(null);
        try {
            const response = await productsApi.createProduct(productData);
            if (response.status === 'success' && response.data) {
                await fetchProducts(); // Refresh the list
                return response.data;
            }
            return null;
        } catch (err: any) {
            setError(err.message || 'Failed to create product');
            return null;
        } finally {
            setLoading(false);
        }
    };

    const updateProduct = async (id: string, updateData: UpdateProductData): Promise<Product | null> => {
        setLoading(true);
        setError(null);
        try {
            const response = await productsApi.updateProduct(id, updateData);
            if (response.status === 'success' && response.data) {
                await fetchProducts(); // Refresh the list
                return response.data;
            }
            return null;
        } catch (err: any) {
            setError(err.message || 'Failed to update product');
            return null;
        } finally {
            setLoading(false);
        }
    };

    const deleteProduct = async (id: string): Promise<boolean> => {
        setLoading(true);
        setError(null);
        try {
            const response = await productsApi.deleteProduct(id);
            if (response.status === 'success') {
                await fetchProducts(); // Refresh the list
                return true;
            }
            return false;
        } catch (err: any) {
            setError(err.message || 'Failed to delete product');
            return false;
        } finally {
            setLoading(false);
        }
    };

    const updateStock = async (id: string, stockData: StockUpdateData): Promise<Product | null> => {
        setLoading(true);
        setError(null);
        try {
            const response = await productsApi.updateStock(id, stockData);
            if (response.status === 'success' && response.data) {
                await fetchProducts(); // Refresh the list
                return response.data;
            }
            return null;
        } catch (err: any) {
            setError(err.message || 'Failed to update stock');
            return null;
        } finally {
            setLoading(false);
        }
    };

    const refresh = () => {
        fetchProducts();
    };

    return {
        products,
        loading,
        error,
        total,
        page,
        totalPages,
        fetchProducts,
        createProduct,
        updateProduct,
        deleteProduct,
        updateStock,
        refresh,
    };
};

export const useProductSearch = () => {
    const [searchResults, setSearchResults] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const searchProducts = async (query: string, filters: { companyId?: string; limit?: number } = {}) => {
        if (!query.trim()) {
            setSearchResults([]);
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const response = await productsApi.searchProducts(query, filters);
            if (response.status === 'success' && response.data) {
                setSearchResults(response.data);
            }
        } catch (err: any) {
            setError(err.message || 'Failed to search products');
        } finally {
            setLoading(false);
        }
    };

    const clearSearch = () => {
        setSearchResults([]);
        setError(null);
    };

    return {
        searchResults,
        loading,
        error,
        searchProducts,
        clearSearch,
    };
};

export const useProductCategories = (companyId?: string) => {
    const [categories, setCategories] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchCategories = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await productsApi.getCategories(companyId);
            if (response.status === 'success' && response.data) {
                setCategories(response.data);
            }
        } catch (err: any) {
            setError(err.message || 'Failed to fetch categories');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, [companyId]);

    return {
        categories,
        loading,
        error,
        refresh: fetchCategories,
    };
};

export const useLowStockProducts = (filters: { threshold?: number; companyId?: string } = {}) => {
    const [lowStockProducts, setLowStockProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchLowStockProducts = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await productsApi.getLowStockProducts(filters);
            if (response.status === 'success' && response.data) {
                setLowStockProducts(response.data);
            }
        } catch (err: any) {
            setError(err.message || 'Failed to fetch low stock products');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLowStockProducts();
    }, [filters.threshold, filters.companyId]);

    return {
        lowStockProducts,
        loading,
        error,
        refresh: fetchLowStockProducts,
    };
};