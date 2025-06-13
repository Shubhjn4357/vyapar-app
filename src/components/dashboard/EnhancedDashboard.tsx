import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { usePaymentSummary, useRecentPayments } from '../../hooks/usePayments';
import { useLowStockProducts } from '../../hooks/useProducts';
import { useDashboardMetrics } from '../../hooks/useReports';

interface EnhancedDashboardProps {
    navigation: any;
}

export const EnhancedDashboard: React.FC<EnhancedDashboardProps> = ({ navigation }) => {
    const { theme: colors } = useTheme();
    const { summary: paymentSummary } = usePaymentSummary();
    const { recentPayments } = useRecentPayments({ limit: 5 });
    const { lowStockProducts } = useLowStockProducts({ threshold: 10 });
    const { metrics } = useDashboardMetrics();

    const styles = StyleSheet.create({
        container: {
            padding: 16,
        },
        sectionTitle: {
            fontSize: 18,
            fontWeight: 'bold',
            color: colors.text,
            marginBottom: 12,
            marginTop: 20,
        },
        quickActionsContainer: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: 12,
            marginBottom: 20,
        },
        quickActionCard: {
            backgroundColor: colors.surface,
            borderRadius: 12,
            padding: 16,
            alignItems: 'center',
            minWidth: '45%',
            borderWidth: 1,
            borderColor: colors.border,
        },
        quickActionIcon: {
            marginBottom: 8,
        },
        quickActionText: {
            fontSize: 12,
            fontWeight: '600',
            color: colors.text,
            textAlign: 'center',
        },
        summaryContainer: {
            flexDirection: 'row',
            gap: 12,
            marginBottom: 20,
        },
        summaryCard: {
            flex: 1,
            backgroundColor: colors.surface,
            borderRadius: 12,
            padding: 16,
            borderWidth: 1,
            borderColor: colors.border,
        },
        summaryValue: {
            fontSize: 20,
            fontWeight: 'bold',
            color: colors.primary,
            marginBottom: 4,
        },
        summaryLabel: {
            fontSize: 12,
            color: colors.textSecondary,
        },
        alertCard: {
            backgroundColor: colors.surface,
            borderRadius: 12,
            padding: 16,
            marginBottom: 12,
            borderLeftWidth: 4,
            borderLeftColor: colors.error,
            borderWidth: 1,
            borderColor: colors.border,
        },
        alertTitle: {
            fontSize: 14,
            fontWeight: '600',
            color: colors.error,
            marginBottom: 4,
        },
        alertText: {
            fontSize: 12,
            color: colors.textSecondary,
        },
        recentItem: {
            backgroundColor: colors.surface,
            borderRadius: 8,
            padding: 12,
            marginBottom: 8,
            borderWidth: 1,
            borderColor: colors.border,
        },
        recentItemHeader: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 4,
        },
        recentItemAmount: {
            fontSize: 14,
            fontWeight: '600',
            color: colors.primary,
        },
        recentItemDate: {
            fontSize: 12,
            color: colors.textSecondary,
        },
        recentItemMethod: {
            fontSize: 12,
            color: colors.text,
        },
        viewAllButton: {
            backgroundColor: colors.primary,
            borderRadius: 8,
            padding: 12,
            alignItems: 'center',
            marginTop: 8,
        },
        viewAllButtonText: {
            color: colors.surface,
            fontWeight: '600',
        },
    });

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
        }).format(amount);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
        });
    };

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            {/* Quick Actions */}
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            <View style={styles.quickActionsContainer}>
                <TouchableOpacity
                    style={styles.quickActionCard}
                    onPress={() => navigation.navigate('Products', { screen: 'AddProduct' })}
                >
                    <Ionicons name="cube" size={24} color={colors.primary} style={styles.quickActionIcon} />
                    <Text style={styles.quickActionText}>Add Product</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.quickActionCard}
                    onPress={() => navigation.navigate('Payments', { screen: 'AddPayment' })}
                >
                    <Ionicons name="card" size={24} color={colors.primary} style={styles.quickActionIcon} />
                    <Text style={styles.quickActionText}>Record Payment</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.quickActionCard}
                    onPress={() => navigation.navigate('Bills', { screen: 'CreateBill' })}
                >
                    <Ionicons name="receipt" size={24} color={colors.primary} style={styles.quickActionIcon} />
                    <Text style={styles.quickActionText}>Create Bill</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.quickActionCard}
                    onPress={() => navigation.navigate('Reports')}
                >
                    <Ionicons name="analytics" size={24} color={colors.primary} style={styles.quickActionIcon} />
                    <Text style={styles.quickActionText}>View Reports</Text>
                </TouchableOpacity>
            </View>

            {/* Payment Summary */}
            {paymentSummary && (
                <>
                    <Text style={styles.sectionTitle}>Payment Overview</Text>
                    <View style={styles.summaryContainer}>
                        <View style={styles.summaryCard}>
                            <Text style={styles.summaryValue}>
                                {formatCurrency(paymentSummary.totalPayments)}
                            </Text>
                            <Text style={styles.summaryLabel}>Total Payments</Text>
                        </View>
                        <View style={styles.summaryCard}>
                            <Text style={styles.summaryValue}>{paymentSummary.completedPayments}</Text>
                            <Text style={styles.summaryLabel}>Completed</Text>
                        </View>
                        <View style={styles.summaryCard}>
                            <Text style={styles.summaryValue}>{paymentSummary.pendingPayments}</Text>
                            <Text style={styles.summaryLabel}>Pending</Text>
                        </View>
                    </View>
                </>
            )}

            {/* Low Stock Alert */}
            {lowStockProducts.length > 0 && (
                <>
                    <Text style={styles.sectionTitle}>Alerts</Text>
                    <TouchableOpacity
                        style={styles.alertCard}
                        onPress={() => navigation.navigate('Products')}
                    >
                        <Text style={styles.alertTitle}>Low Stock Alert</Text>
                        <Text style={styles.alertText}>
                            {lowStockProducts.length} product(s) are running low on stock
                        </Text>
                    </TouchableOpacity>
                </>
            )}

            {/* Recent Payments */}
            {recentPayments.length > 0 && (
                <>
                    <Text style={styles.sectionTitle}>Recent Payments</Text>
                    {recentPayments.slice(0, 3).map((payment) => (
                        <View key={payment.id} style={styles.recentItem}>
                            <View style={styles.recentItemHeader}>
                                <Text style={styles.recentItemAmount}>
                                    {formatCurrency(payment.amount)}
                                </Text>
                                <Text style={styles.recentItemDate}>
                                    {formatDate(payment.date)}
                                </Text>
                            </View>
                            <Text style={styles.recentItemMethod}>
                                via {payment.method}
                            </Text>
                        </View>
                    ))}
                    <TouchableOpacity
                        style={styles.viewAllButton}
                        onPress={() => navigation.navigate('Payments')}
                    >
                        <Text style={styles.viewAllButtonText}>View All Payments</Text>
                    </TouchableOpacity>
                </>
            )}
        </ScrollView>
    );
};