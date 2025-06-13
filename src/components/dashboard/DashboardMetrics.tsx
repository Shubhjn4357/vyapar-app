import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Text, useTheme } from 'react-native-paper';
import { DashboardMetrics as MetricsType } from '../../types/reports';

interface DashboardMetricsProps {
    metrics: MetricsType | null;
    loading: boolean;
}

export const DashboardMetrics: React.FC<DashboardMetricsProps> = ({ metrics, loading }) => {
    const theme = useTheme();

    if (loading || !metrics) {
        return (
            <View style={styles.container}>
                <Card style={styles.card}>
                    <Card.Content>
                        <Text>Loading metrics...</Text>
                    </Card.Content>
                </Card>
            </View>
        );
    }

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };

    const formatPercentage = (value: number) => {
        if (typeof value !== 'number' || isNaN(value)) return '0.0%';
        return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`;
    };

    const getGrowthColor = (growth: number) => {
        return growth >= 0 ? theme.colors.primary : theme.colors.error;
    };

    return (
        <View style={styles.container}>
            {/* Revenue & Profit Row */}
            <View style={styles.row}>
                <Card style={[styles.card, styles.halfCard]}>
                    <Card.Content>
                        <Text variant="labelMedium" style={styles.label}>Total Revenue</Text>
                        <Text variant="headlineSmall" style={styles.value}>
                            {formatCurrency(metrics.totalRevenue)}
                        </Text>
                        <Text
                            variant="bodySmall"
                            style={[styles.growth, { color: getGrowthColor(metrics.monthlyGrowth) }]}
                        >
                            {formatPercentage(metrics.monthlyGrowth)} this month
                        </Text>
                    </Card.Content>
                </Card>

                <Card style={[styles.card, styles.halfCard]}>
                    <Card.Content>
                        <Text variant="labelMedium" style={styles.label}>Net Profit</Text>
                        <Text variant="headlineSmall" style={styles.value}>
                            {formatCurrency(metrics.netProfit)}
                        </Text>
                        <Text variant="bodySmall" style={styles.subValue}>
                            Expenses: {formatCurrency(metrics.totalExpenses)}
                        </Text>
                    </Card.Content>
                </Card>
            </View>

            {/* Bills Row */}
            <View style={styles.row}>
                <Card style={[styles.card, styles.halfCard]}>
                    <Card.Content>
                        <Text variant="labelMedium" style={styles.label}>Total Bills</Text>
                        <Text variant="headlineSmall" style={styles.value}>
                            {metrics.totalBills}
                        </Text>
                        <Text variant="bodySmall" style={styles.subValue}>
                            Paid: {metrics.paidBills} | Pending: {metrics.pendingBills}
                        </Text>
                    </Card.Content>
                </Card>

                <Card style={[styles.card, styles.halfCard]}>
                    <Card.Content>
                        <Text variant="labelMedium" style={styles.label}>Overdue Bills</Text>
                        <Text
                            variant="headlineSmall"
                            style={[styles.value, { color: metrics.overdueBills > 0 ? theme.colors.error : theme.colors.primary }]}
                        >
                            {metrics.overdueBills}
                        </Text>
                        <Text variant="bodySmall" style={styles.subValue}>
                            Requires attention
                        </Text>
                    </Card.Content>
                </Card>
            </View>

            {/* Customers & GST Row */}
            <View style={styles.row}>
                <Card style={[styles.card, styles.halfCard]}>
                    <Card.Content>
                        <Text variant="labelMedium" style={styles.label}>Customers</Text>
                        <Text variant="headlineSmall" style={styles.value}>
                            {metrics.totalCustomers}
                        </Text>
                        <Text variant="bodySmall" style={styles.subValue}>
                            Active: {metrics.activeCustomers}
                        </Text>
                    </Card.Content>
                </Card>

                <Card style={[styles.card, styles.halfCard]}>
                    <Card.Content>
                        <Text variant="labelMedium" style={styles.label}>GST Liability</Text>
                        <Text variant="headlineSmall" style={styles.value}>
                            {formatCurrency(metrics.gstLiability)}
                        </Text>
                        <Text variant="bodySmall" style={styles.subValue}>
                            Current month
                        </Text>
                    </Card.Content>
                </Card>
            </View>

            {/* Cash Flow */}
            <Card style={styles.card}>
                <Card.Content>
                    <Text variant="labelMedium" style={styles.label}>Cash Flow</Text>
                    <Text
                        variant="headlineSmall"
                        style={[styles.value, { color: getGrowthColor(metrics.cashFlow) }]}
                    >
                        {formatCurrency(metrics.cashFlow)}
                    </Text>
                    <Text variant="bodySmall" style={styles.subValue}>
                        Net cash flow this month
                    </Text>
                </Card.Content>
            </Card>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 16,
    },
    row: {
        flexDirection: 'row',
        marginBottom: 16,
        gap: 8,
    },
    card: {
        marginBottom: 8,
    },
    halfCard: {
        flex: 1,
    },
    label: {
        opacity: 0.7,
        marginBottom: 4,
    },
    value: {
        fontWeight: 'bold',
        marginBottom: 4,
    },
    subValue: {
        opacity: 0.6,
    },
    growth: {
        fontWeight: '500',
    },
});