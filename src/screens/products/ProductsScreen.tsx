import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    TextInput,
    Alert,
    RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useProducts, useProductCategories, useLowStockProducts } from '../../hooks/useProducts';
import { useTheme } from '../../contexts/ThemeContext';
import { Product } from '../../types/product';
import Loader from '../../components/Loader';

interface ProductsScreenProps {
    navigation: any;
}

export const ProductsScreen: React.FC<ProductsScreenProps> = ({ navigation }) => {
    const { theme: colors } = useTheme();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [showLowStock, setShowLowStock] = useState(false);

    const {
        products,
        loading,
        error,
        total,
        fetchProducts,
        deleteProduct,
        refresh,
    } = useProducts({
        search: searchQuery,
        category: selectedCategory || undefined,
        limit: 20,
    });

    const { categories } = useProductCategories();
    const { lowStockProducts } = useLowStockProducts({ threshold: 10 });

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colors.colors.background,
        },
        header: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: 16,
            backgroundColor: colors.colors.surface,
            borderBottomWidth: 1,
            borderBottomColor: colors.colors.border,
        },
        title: {
            fontSize: 24,
            fontWeight: 'bold',
            color: colors.colors.text,
        },
        addButton: {
            backgroundColor: colors.colors.primary,
            paddingHorizontal: 16,
            paddingVertical: 8,
            borderRadius: 8,
            flexDirection: 'row',
            alignItems: 'center',
        },
        addButtonText: {
            color: colors.colors.surface,
            fontWeight: '600',
            marginLeft: 4,
        },
        searchContainer: {
            flexDirection: 'row',
            padding: 16,
            gap: 12,
        },
        searchInput: {
            flex: 1,
            backgroundColor: colors.colors.surface,
            borderRadius: 8,
            paddingHorizontal: 12,
            paddingVertical: 8,
            borderWidth: 1,
            borderColor: colors.colors.border,
            color: colors.colors.text,
        },
        filterButton: {
            backgroundColor: colors.colors.surface,
            paddingHorizontal: 12,
            paddingVertical: 8,
            borderRadius: 8,
            borderWidth: 1,
            borderColor: colors.colors.border,
            justifyContent: 'center',
        },
        statsContainer: {
            flexDirection: 'row',
            padding: 16,
            gap: 12,
        },
        statCard: {
            flex: 1,
            backgroundColor: colors.colors.surface,
            padding: 12,
            borderRadius: 8,
            alignItems: 'center',
            borderWidth: 1,
            borderColor: colors.colors.border,
        },
        statNumber: {
            fontSize: 20,
            fontWeight: 'bold',
            color: colors.colors.primary,
        },
        statLabel: {
            fontSize: 12,
            color: colors.colors.textSecondary,
            marginTop: 4,
        },
        productCard: {
            backgroundColor: colors.colors.surface,
            marginHorizontal: 16,
            marginVertical: 4,
            padding: 16,
            borderRadius: 8,
            borderWidth: 1,
            borderColor: colors.colors.border,
        },
        productHeader: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: 8,
        },
        productName: {
            fontSize: 16,
            fontWeight: '600',
            color: colors.colors.text,
            flex: 1,
        },
        productSku: {
            fontSize: 12,
            color: colors.colors.textSecondary,
            backgroundColor: colors.colors.background,
            paddingHorizontal: 8,
            paddingVertical: 2,
            borderRadius: 4,
        },
        productDetails: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 8,
        },
        productPrice: {
            fontSize: 16,
            fontWeight: '600',
            color: colors.colors.primary,
        },
        productStock: {
            fontSize: 14,
            color: colors.colors.textSecondary,
        },
        lowStockWarning: {
            color: colors.colors.error,
            fontWeight: '600',
        },
        productActions: {
            flexDirection: 'row',
            justifyContent: 'flex-end',
            marginTop: 12,
            gap: 8,
        },
        actionButton: {
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: 6,
            borderWidth: 1,
        },
        editButton: {
            borderColor: colors.colors.primary,
        },
        deleteButton: {
            borderColor: colors.colors.error,
        },
        actionButtonText: {
            fontSize: 12,
            fontWeight: '600',
        },
        editButtonText: {
            color: colors.colors.primary,
        },
        deleteButtonText: {
            color: colors.colors.error,
        },
        emptyContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            padding: 32,
        },
        emptyText: {
            fontSize: 16,
            color: colors.colors.textSecondary,
            textAlign: 'center',
            marginTop: 16,
        },
        errorContainer: {
            padding: 16,
            backgroundColor: colors.colors.error + '20',
            margin: 16,
            borderRadius: 8,
        },
        errorText: {
            color: colors.colors.error,
            textAlign: 'center',
        },
    });

    const handleDeleteProduct = (product: Product) => {
        Alert.alert(
            'Delete Product',
            `Are you sure you want to delete "${product.name}"?`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        const success = await deleteProduct(product.id);
                        if (success) {
                            Alert.alert('Success', 'Product deleted successfully');
                        }
                    },
                },
            ]
        );
    };

    const renderProduct = ({ item }: { item: Product }) => (
        <TouchableOpacity
            style={styles.productCard}
            onPress={() => navigation.navigate('ProductDetails', { productId: item.id })}
        >
            <View style={styles.productHeader}>
                <Text style={styles.productName}>{item.name}</Text>
                <Text style={styles.productSku}>{item.sku}</Text>
            </View>
            
            {item.description && (
                <Text style={[styles.productStock, { marginBottom: 8 }]}>
                    {item.description}
                </Text>
            )}

            <View style={styles.productDetails}>
                <Text style={styles.productPrice}>₹{item.mrp?.toFixed(2)}</Text>
                <Text style={[
                    styles.productStock,
                    item.stock! < 10 && styles.lowStockWarning
                ]}>
                    Stock: {item.stock} {item.unit}
                </Text>
            </View>

            <View style={styles.productActions}>
                <TouchableOpacity
                    style={[styles.actionButton, styles.editButton]}
                    onPress={() => navigation.navigate('EditProduct', { productId: item.id })}
                >
                    <Text style={[styles.actionButtonText, styles.editButtonText]}>
                        Edit
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.actionButton, styles.deleteButton]}
                    onPress={() => handleDeleteProduct(item)}
                >
                    <Text style={[styles.actionButtonText, styles.deleteButtonText]}>
                        Delete
                    </Text>
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );

    if (loading && products.length === 0) {
        return <Loader />;
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Products</Text>
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => navigation.navigate('AddProduct')}
                >
                    <Ionicons name="add" size={20} color={colors.colors.surface} />
                    <Text style={styles.addButtonText}>Add Product</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.searchContainer}>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search products..."
                    placeholderTextColor={colors.colors.textSecondary}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
                <TouchableOpacity style={styles.filterButton}>
                    <Ionicons name="filter" size={20} color={colors.colors.text} />
                </TouchableOpacity>
            </View>

            <View style={styles.statsContainer}>
                <View style={styles.statCard}>
                    <Text style={styles.statNumber}>{total}</Text>
                    <Text style={styles.statLabel}>Total Products</Text>
                </View>
                <View style={styles.statCard}>
                    <Text style={styles.statNumber}>{lowStockProducts.length}</Text>
                    <Text style={styles.statLabel}>Low Stock</Text>
                </View>
                <View style={styles.statCard}>
                    <Text style={styles.statNumber}>{categories.length}</Text>
                    <Text style={styles.statLabel}>Categories</Text>
                </View>
            </View>

            {error && (
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>{error}</Text>
                </View>
            )}

            <FlatList
                data={products}
                renderItem={renderProduct}
                keyExtractor={(item) => item.id}
                refreshControl={
                    <RefreshControl
                        refreshing={loading}
                        onRefresh={refresh}
                        colors={[colors.colors.primary]}
                    />
                }
                ListEmptyComponent={
                    !loading ? (
                        <View style={styles.emptyContainer}>
                            <Ionicons name="cube-outline" size={64} color={colors.colors.textSecondary} />
                            <Text style={styles.emptyText}>
                                No products found.{'\n'}Add your first product to get started.
                            </Text>
                        </View>
                    ) : null
                }
            />
        </View>
    );
};