import React, { useState } from 'react';
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
import { usePayments, usePaymentSummary, usePaymentMethods } from '../../hooks/usePayments';
import { useTheme } from '../../contexts/ThemeContext';
import { Payment } from '../../types/payment';
import Loader from '../../components/Loader';

interface PaymentsScreenProps {
    navigation: any;
}

export const PaymentsScreen: React.FC<PaymentsScreenProps> = ({ navigation }) => {
    const { theme: colors } = useTheme();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedStatus, setSelectedStatus] = useState<string>('');

    const {
        payments,
        loading,
        error,
        total,
        fetchPayments,
        deletePayment,
        refresh,
    } = usePayments({
        search: searchQuery,
        status: selectedStatus as any || undefined,
        limit: 20,
    });

    const { summary } = usePaymentSummary();
    const { methods } = usePaymentMethods();

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colors.background,
        },
        header: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: 16,
            backgroundColor: colors.surface,
            borderBottomWidth: 1,
            borderBottomColor: colors.border,
        },
        title: {
            fontSize: 24,
            fontWeight: 'bold',
            color: colors.text,
        },
        addButton: {
            backgroundColor: colors.primary,
            paddingHorizontal: 16,
            paddingVertical: 8,
            borderRadius: 8,
            flexDirection: 'row',
            alignItems: 'center',
        },
        addButtonText: {
            color: colors.surface,
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
            backgroundColor: colors.surface,
            borderRadius: 8,
            paddingHorizontal: 12,
            paddingVertical: 8,
            borderWidth: 1,
            borderColor: colors.border,
            color: colors.text,
        },
        filterButton: {
            backgroundColor: colors.surface,
            paddingHorizontal: 12,
            paddingVertical: 8,
            borderRadius: 8,
            borderWidth: 1,
            borderColor: colors.border,
            justifyContent: 'center',
        },
        summaryContainer: {
            flexDirection: 'row',
            padding: 16,
            gap: 12,
        },
        summaryCard: {
            flex: 1,
            backgroundColor: colors.surface,
            padding: 12,
            borderRadius: 8,
            alignItems: 'center',
            borderWidth: 1,
            borderColor: colors.border,
        },
        summaryNumber: {
            fontSize: 16,
            fontWeight: 'bold',
            color: colors.primary,
        },
        summaryLabel: {
            fontSize: 10,
            color: colors.textSecondary,
            marginTop: 4,
            textAlign: 'center',
        },
        paymentCard: {
            backgroundColor: colors.surface,
            marginHorizontal: 16,
            marginVertical: 4,
            padding: 16,
            borderRadius: 8,
            borderWidth: 1,
            borderColor: colors.border,
        },
        paymentHeader: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: 8,
        },
        paymentAmount: {
            fontSize: 18,
            fontWeight: 'bold',
            color: colors.primary,
        },
        paymentStatus: {
            fontSize: 12,
            fontWeight: '600',
            paddingHorizontal: 8,
            paddingVertical: 2,
            borderRadius: 4,
            overflow: 'hidden',
        },
        statusCompleted: {
            backgroundColor: '#10B981',
            color: 'white',
        },
        statusPending: {
            backgroundColor: '#F59E0B',
            color: 'white',
        },
        statusFailed: {
            backgroundColor: '#EF4444',
            color: 'white',
        },
        paymentDetails: {
            gap: 4,
        },
        paymentMethod: {
            fontSize: 14,
            color: colors.text,
            fontWeight: '500',
        },
        paymentDate: {
            fontSize: 12,
            color: colors.textSecondary,
        },
        paymentReference: {
            fontSize: 12,
            color: colors.textSecondary,
            fontStyle: 'italic',
        },
        paymentActions: {
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
            borderColor: colors.primary,
        },
        deleteButton: {
            borderColor: colors.error,
        },
        actionButtonText: {
            fontSize: 12,
            fontWeight: '600',
        },
        editButtonText: {
            color: colors.primary,
        },
        deleteButtonText: {
            color: colors.error,
        },
        emptyContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            padding: 32,
        },
        emptyText: {
            fontSize: 16,
            color: colors.textSecondary,
            textAlign: 'center',
            marginTop: 16,
        },
        errorContainer: {
            padding: 16,
            backgroundColor: colors.error + '20',
            margin: 16,
            borderRadius: 8,
        },
        errorText: {
            color: colors.error,
            textAlign: 'center',
        },
    });

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'completed':
                return styles.statusCompleted;
            case 'pending':
                return styles.statusPending;
            case 'failed':
                return styles.statusFailed;
            default:
                return styles.statusPending;
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        });
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
        }).format(amount);
    };

    const handleDeletePayment = (payment: Payment) => {
        Alert.alert(
            'Delete Payment',
            `Are you sure you want to delete this payment of ${formatCurrency(payment.amount)}?`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        const success = await deletePayment(payment.id);
                        if (success) {
                            Alert.alert('Success', 'Payment deleted successfully');
                        }
                    },
                },
            ]
        );
    };

    const renderPayment = ({ item }: { item: Payment }) => (
        <TouchableOpacity
            style={styles.paymentCard}
            onPress={() => navigation.navigate('PaymentDetails', { paymentId: item.id })}
        >
            <View style={styles.paymentHeader}>
                <Text style={styles.paymentAmount}>
                    {formatCurrency(item.amount)}
                </Text>
                <Text style={[styles.paymentStatus, getStatusStyle(item.status)]}>
                    {item.status.toUpperCase()}
                </Text>
            </View>

            <View style={styles.paymentDetails}>
                <Text style={styles.paymentMethod}>
                    Method: {item.method}
                </Text>
                <Text style={styles.paymentDate}>
                    Date: {formatDate(item.date)}
                </Text>
                {item.reference && (
                    <Text style={styles.paymentReference}>
                        Ref: {item.reference}
                    </Text>
                )}
            </View>

            <View style={styles.paymentActions}>
                <TouchableOpacity
                    style={[styles.actionButton, styles.editButton]}
                    onPress={() => navigation.navigate('EditPayment', { paymentId: item.id })}
                >
                    <Text style={[styles.actionButtonText, styles.editButtonText]}>
                        Edit
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.actionButton, styles.deleteButton]}
                    onPress={() => handleDeletePayment(item)}
                >
                    <Text style={[styles.actionButtonText, styles.deleteButtonText]}>
                        Delete
                    </Text>
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );

    if (loading && payments.length === 0) {
        return <Loader />;
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Payments</Text>
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => navigation.navigate('AddPayment')}
                >
                    <Ionicons name="add" size={20} color={colors.surface} />
                    <Text style={styles.addButtonText}>Add Payment</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.searchContainer}>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search payments..."
                    placeholderTextColor={colors.textSecondary}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
                <TouchableOpacity style={styles.filterButton}>
                    <Ionicons name="filter" size={20} color={colors.text} />
                </TouchableOpacity>
            </View>

            {summary && (
                <View style={styles.summaryContainer}>
                    <View style={styles.summaryCard}>
                        <Text style={styles.summaryNumber}>
                            {formatCurrency(summary.totalPayments)}
                        </Text>
                        <Text style={styles.summaryLabel}>Total Payments</Text>
                    </View>
                    <View style={styles.summaryCard}>
                        <Text style={styles.summaryNumber}>{summary.completedPayments}</Text>
                        <Text style={styles.summaryLabel}>Completed</Text>
                    </View>
                    <View style={styles.summaryCard}>
                        <Text style={styles.summaryNumber}>{summary.pendingPayments}</Text>
                        <Text style={styles.summaryLabel}>Pending</Text>
                    </View>
                </View>
            )}

            {error && (
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>{error}</Text>
                </View>
            )}

            <FlatList
                data={payments}
                renderItem={renderPayment}
                keyExtractor={(item) => item.id}
                refreshControl={
                    <RefreshControl
                        refreshing={loading}
                        onRefresh={refresh}
                        colors={[colors.primary]}
                    />
                }
                ListEmptyComponent={
                    !loading ? (
                        <View style={styles.emptyContainer}>
                            <Ionicons name="card-outline" size={64} color={colors.textSecondary} />
                            <Text style={styles.emptyText}>
                                No payments found.{'\n'}Add your first payment to get started.
                            </Text>
                        </View>
                    ) : null
                }
            />
        </View>
    );
};