import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, RefreshControl } from 'react-native';
import {
    Card,
    Text,
    Searchbar,
    FAB,
    Chip,
    Button,
    Menu,
    useTheme,
    ActivityIndicator
} from 'react-native-paper';
import { useBills } from '../../hooks/useBills';
import { Bill } from '../../types/bill';
import { format } from 'date-fns';

export default function BillListScreen() {
    const theme = useTheme();
    const { bills, loading, error, pagination, fetchBills } = useBills();

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('all');
    const [refreshing, setRefreshing] = useState(false);
    const [menuVisible, setMenuVisible] = useState(false);

    const statusOptions = [
        { label: 'All', value: 'all' },
        { label: 'Draft', value: 'draft' },
        { label: 'Sent', value: 'sent' },
        { label: 'Paid', value: 'paid' },
        { label: 'Overdue', value: 'overdue' },
        { label: 'Cancelled', value: 'cancelled' },
    ];

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchBills({
            search: searchQuery,
            status: selectedStatus !== 'all' ? selectedStatus : undefined,
        });
        setRefreshing(false);
    };

    const handleSearch = (query: string) => {
        setSearchQuery(query);
        fetchBills({
            search: query,
            status: selectedStatus !== 'all' ? selectedStatus : undefined,
        });
    };

    const handleStatusFilter = (status: string) => {
        setSelectedStatus(status);
        setMenuVisible(false);
        fetchBills({
            search: searchQuery,
            status: status !== 'all' ? status : undefined,
        });
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'paid':
                return theme.colors.primary;
            case 'pending':
                return theme.colors.tertiary;
            case 'overdue':
                return theme.colors.error;
            case 'draft':
                return theme.colors.outline;
            case 'sent':
                return theme.colors.secondary;
            case 'cancelled':
                return theme.colors.surfaceVariant;
            default:
                return theme.colors.outline;
        }
    };

    const getStatusLabel = (status: string) => {
        return status.charAt(0).toUpperCase() + status.slice(1);
    };

    const renderBillItem = ({ item }: { item: Bill }) => (
        <Card style={styles.billCard} onPress={() => handleBillPress(item)}>
            <Card.Content>
                <View style={styles.billHeader}>
                    <View style={styles.billInfo}>
                        <Text variant="titleMedium" style={styles.customerName}>
                            {item.customerName}
                        </Text>
                        <Text variant="bodySmall" style={styles.billNumber}>
                            #{item.billNumber}
                        </Text>
                    </View>
                    <View style={styles.billAmount}>
                        <Text variant="titleMedium" style={styles.amount}>
                            {formatCurrency(item.totalAmount)}
                        </Text>
                        <Chip
                            mode="outlined"
                            textStyle={{ fontSize: 10 }}
                            style={[styles.statusChip, { borderColor: getStatusColor(item.status) }]}
                        >
                            {getStatusLabel(item.status)}
                        </Chip>
                    </View>
                </View>

                <View style={styles.billDetails}>
                    <Text variant="bodySmall" style={styles.date}>
                        Date: {format(new Date(item.date), 'MMM dd, yyyy')}
                    </Text>
                    {item.dueDate && (
                        <Text variant="bodySmall" style={styles.dueDate}>
                            Due: {format(new Date(item.dueDate), 'MMM dd, yyyy')}
                        </Text>
                    )}
                </View>

                {item.items && item.items.length > 0 && (
                    <Text variant="bodySmall" style={styles.itemsCount}>
                        {item.items.length} item{item.items.length > 1 ? 's' : ''}
                    </Text>
                )}
            </Card.Content>
        </Card>
    );

    const handleBillPress = (bill: Bill) => {
        // Navigate to bill details
        console.log('Navigate to bill details:', bill.id);
    };

    const handleCreateBill = () => {
        // Navigate to create bill screen
        console.log('Navigate to create bill');
    };

    if (loading && bills.length === 0) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" />
                <Text style={styles.loadingText}>Loading bills...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Search and Filter */}
            <View style={styles.searchContainer}>
                <Searchbar
                    placeholder="Search bills..."
                    onChangeText={handleSearch}
                    value={searchQuery}
                    style={styles.searchbar}
                />
                <Menu
                    visible={menuVisible}
                    onDismiss={() => setMenuVisible(false)}
                    anchor={
                        <Button
                            mode="outlined"
                            onPress={() => setMenuVisible(true)}
                            style={styles.filterButton}
                        >
                            {statusOptions.find(opt => opt.value === selectedStatus)?.label}
                        </Button>
                    }
                >
                    {statusOptions.map((option) => (
                        <Menu.Item
                            key={option.value}
                            onPress={() => handleStatusFilter(option.value)}
                            title={option.label}
                        />
                    ))}
                </Menu>
            </View>

            {/* Bills List */}
            <FlatList
                data={bills}
                renderItem={renderBillItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContainer}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={[theme.colors.primary]}
                    />
                }
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text variant="bodyLarge" style={styles.emptyText}>
                            No bills found
                        </Text>
                        <Text variant="bodyMedium" style={styles.emptySubtext}>
                            Create your first bill to get started
                        </Text>
                    </View>
                }
            />

            {/* Floating Action Button */}
            <FAB
                icon="plus"
                style={styles.fab}
                onPress={handleCreateBill}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    searchContainer: {
        flexDirection: 'row',
        padding: 16,
        gap: 8,
    },
    searchbar: {
        flex: 1,
    },
    filterButton: {
        minWidth: 80,
    },
    listContainer: {
        padding: 16,
        paddingTop: 0,
        paddingBottom: 80,
    },
    billCard: {
        marginBottom: 12,
    },
    billHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 8,
    },
    billInfo: {
        flex: 1,
    },
    customerName: {
        fontWeight: '600',
        marginBottom: 2,
    },
    billNumber: {
        opacity: 0.6,
    },
    billAmount: {
        alignItems: 'flex-end',
    },
    amount: {
        fontWeight: 'bold',
        marginBottom: 4,
    },
    statusChip: {
        height: 24,
    },
    billDetails: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 4,
    },
    date: {
        opacity: 0.6,
    },
    dueDate: {
        opacity: 0.6,
        fontStyle: 'italic',
    },
    itemsCount: {
        opacity: 0.6,
        fontSize: 12,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 16,
        opacity: 0.6,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 60,
    },
    emptyText: {
        marginBottom: 8,
        opacity: 0.6,
    },
    emptySubtext: {
        opacity: 0.4,
        textAlign: 'center',
    },
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
    },
});
