import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Card, Text, Button, useTheme, IconButton } from 'react-native-paper';
import { useDashboardMetrics, useSalesReport, useProfitLossReport } from '../../hooks/useReports';
import { format, subMonths, startOfMonth, endOfMonth } from 'date-fns';

const ReportDashboardScreen = () => {
    const theme = useTheme();
    const [selectedPeriod, setSelectedPeriod] = useState('thisMonth');

    const { metrics, loading: metricsLoading } = useDashboardMetrics();
    const { report: salesReport, loading: salesLoading } = useSalesReport();
    const { report: profitLossReport, loading: profitLoading } = useProfitLossReport();

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };

    const reportCards = [
        {
            title: 'Sales Report',
            description: 'View detailed sales analytics',
            icon: 'chart-line',
            value: salesReport ? formatCurrency(salesReport.totalSales) : '₹0',
            subtitle: salesReport ? `${salesReport.billsCount} bills` : '0 bills',
            color: theme.colors.primary,
            onPress: () => console.log('Navigate to Sales Report'),
        },
        {
            title: 'Purchase Report',
            description: 'Track your purchases and expenses',
            icon: 'cart',
            value: '₹0',
            subtitle: '0 purchases',
            color: theme.colors.secondary,
            onPress: () => console.log('Navigate to Purchase Report'),
        },
        {
            title: 'Profit & Loss',
            description: 'Monitor your business profitability',
            icon: 'trending-up',
            value: profitLossReport ? formatCurrency(profitLossReport.netProfit) : '₹0',
            subtitle: profitLossReport ? `${profitLossReport.netProfitMargin.toFixed(1)}% margin` : '0% margin',
            color: profitLossReport && profitLossReport.netProfit > 0 ? theme.colors.primary : theme.colors.error,
            onPress: () => console.log('Navigate to P&L Report'),
        },
        {
            title: 'Tax Report',
            description: 'GST and tax calculations',
            icon: 'receipt',
            value: metrics ? formatCurrency(metrics.gstLiability) : '₹0',
            subtitle: 'GST liability',
            color: theme.colors.tertiary,
            onPress: () => console.log('Navigate to Tax Report'),
        },
        {
            title: 'Cash Flow',
            description: 'Track money in and out',
            icon: 'cash',
            value: metrics ? formatCurrency(metrics.cashFlow) : '₹0',
            subtitle: 'Net cash flow',
            color: metrics && metrics.cashFlow > 0 ? theme.colors.primary : theme.colors.error,
            onPress: () => console.log('Navigate to Cash Flow Report'),
        },
        {
            title: 'Customer Report',
            description: 'Customer-wise sales analysis',
            icon: 'account-group',
            value: metrics ? metrics.totalCustomers.toString() : '0',
            subtitle: `${metrics?.activeCustomers || 0} active`,
            color: theme.colors.secondary,
            onPress: () => console.log('Navigate to Customer Report'),
        },
    ];

    const quickStats = [
        {
            label: 'Total Revenue',
            value: metrics ? formatCurrency(metrics.totalRevenue) : '₹0',
            change: metrics ? `${metrics.monthlyGrowth >= 0 ? '+' : ''}${metrics.monthlyGrowth.toFixed(1)}%` : '0%',
            isPositive: metrics ? metrics.monthlyGrowth >= 0 : true,
        },
        {
            label: 'Total Bills',
            value: metrics ? metrics.totalBills.toString() : '0',
            change: `${metrics?.paidBills || 0} paid`,
            isPositive: true,
        },
        {
            label: 'Outstanding',
            value: metrics ? formatCurrency((metrics.totalRevenue - (metrics.totalRevenue * 0.8))) : '₹0',
            change: `${metrics?.overdueBills || 0} overdue`,
            isPositive: (metrics?.overdueBills || 0) === 0,
        },
    ];

    return (
        <ScrollView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text variant="headlineSmall" style={styles.title}>Reports Dashboard</Text>
                <Text variant="bodyMedium" style={styles.subtitle}>
                    Business insights and analytics
                </Text>
            </View>

            {/* Quick Stats */}
            <View style={styles.quickStatsContainer}>
                {quickStats.map((stat, index) => (
                    <Card key={index} style={styles.quickStatCard}>
                        <Card.Content style={styles.quickStatContent}>
                            <Text variant="bodySmall" style={styles.quickStatLabel}>
                                {stat.label}
                            </Text>
                            <Text variant="titleLarge" style={styles.quickStatValue}>
                                {stat.value}
                            </Text>
                            <Text
                                variant="bodySmall"
                                style={[
                                    styles.quickStatChange,
                                    { color: stat.isPositive ? theme.colors.primary : theme.colors.error }
                                ]}
                            >
                                {stat.change}
                            </Text>
                        </Card.Content>
                    </Card>
                ))}
            </View>

            {/* Report Cards */}
            <View style={styles.reportsGrid}>
                {reportCards.map((report, index) => (
                    <TouchableOpacity
                        key={index}
                        style={styles.reportCardContainer}
                        onPress={report.onPress}
                    >
                        <Card style={styles.reportCard}>
                            <Card.Content>
                                <View style={styles.reportCardHeader}>
                                    <View style={styles.reportCardInfo}>
                                        <Text variant="titleMedium" style={styles.reportCardTitle}>
                                            {report.title}
                                        </Text>
                                        <Text variant="bodySmall" style={styles.reportCardDescription}>
                                            {report.description}
                                        </Text>
                                    </View>
                                    <IconButton
                                        icon={report.icon}
                                        iconColor={report.color}
                                        size={24}
                                        style={[styles.reportCardIcon, { backgroundColor: `${report.color}20` }]}
                                    />
                                </View>

                                <View style={styles.reportCardFooter}>
                                    <Text variant="titleLarge" style={[styles.reportCardValue, { color: report.color }]}>
                                        {report.value}
                                    </Text>
                                    <Text variant="bodySmall" style={styles.reportCardSubtitle}>
                                        {report.subtitle}
                                    </Text>
                                </View>
                            </Card.Content>
                        </Card>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Export Options */}
            <Card style={styles.exportCard}>
                <Card.Content>
                    <Text variant="titleMedium" style={styles.exportTitle}>Export Reports</Text>
                    <Text variant="bodyMedium" style={styles.exportDescription}>
                        Download reports in PDF or Excel format
                    </Text>

                    <View style={styles.exportButtons}>
                        <Button
                            mode="outlined"
                            icon="file-pdf-box"
                            onPress={() => console.log('Export PDF')}
                            style={styles.exportButton}
                        >
                            Export PDF
                        </Button>
                        <Button
                            mode="outlined"
                            icon="microsoft-excel"
                            onPress={() => console.log('Export Excel')}
                            style={styles.exportButton}
                        >
                            Export Excel
                        </Button>
                    </View>
                </Card.Content>
            </Card>

            {/* Recent Activity */}
            <Card style={styles.activityCard}>
                <Card.Content>
                    <Text variant="titleMedium" style={styles.activityTitle}>Recent Activity</Text>
                    <View style={styles.activityList}>
                        <View style={styles.activityItem}>
                            <Text variant="bodyMedium">Sales report generated</Text>
                            <Text variant="bodySmall" style={styles.activityTime}>2 hours ago</Text>
                        </View>
                        <View style={styles.activityItem}>
                            <Text variant="bodyMedium">GST return filed</Text>
                            <Text variant="bodySmall" style={styles.activityTime}>1 day ago</Text>
                        </View>
                        <View style={styles.activityItem}>
                            <Text variant="bodyMedium">Monthly P&L calculated</Text>
                            <Text variant="bodySmall" style={styles.activityTime}>3 days ago</Text>
                        </View>
                    </View>
                </Card.Content>
            </Card>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        padding: 20,
        paddingBottom: 16,
    },
    title: {
        fontWeight: 'bold',
        marginBottom: 4,
    },
    subtitle: {
        opacity: 0.6,
    },
    quickStatsContainer: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        marginBottom: 16,
        gap: 8,
    },
    quickStatCard: {
        flex: 1,
    },
    quickStatContent: {
        alignItems: 'center',
        paddingVertical: 12,
    },
    quickStatLabel: {
        opacity: 0.6,
        marginBottom: 4,
    },
    quickStatValue: {
        fontWeight: 'bold',
        marginBottom: 2,
    },
    quickStatChange: {
        fontSize: 12,
    },
    reportsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingHorizontal: 16,
        gap: 12,
    },
    reportCardContainer: {
        width: '48%',
        marginBottom: 12,
    },
    reportCard: {
        height: 140,
    },
    reportCardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    reportCardInfo: {
        flex: 1,
    },
    reportCardTitle: {
        fontWeight: '600',
        marginBottom: 2,
    },
    reportCardDescription: {
        opacity: 0.6,
        fontSize: 12,
    },
    reportCardIcon: {
        margin: 0,
    },
    reportCardFooter: {
        marginTop: 'auto',
    },
    reportCardValue: {
        fontWeight: 'bold',
        marginBottom: 2,
    },
    reportCardSubtitle: {
        opacity: 0.6,
        fontSize: 12,
    },
    exportCard: {
        margin: 16,
        marginTop: 8,
    },
    exportTitle: {
        fontWeight: 'bold',
        marginBottom: 4,
    },
    exportDescription: {
        opacity: 0.6,
        marginBottom: 16,
    },
    exportButtons: {
        flexDirection: 'row',
        gap: 12,
    },
    exportButton: {
        flex: 1,
    },
    activityCard: {
        margin: 16,
        marginTop: 8,
        marginBottom: 32,
    },
    activityTitle: {
        fontWeight: 'bold',
        marginBottom: 16,
    },
    activityList: {
        gap: 12,
    },
    activityItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.1)',
    },
    activityTime: {
        opacity: 0.6,
    },
});

export default ReportDashboardScreen;
