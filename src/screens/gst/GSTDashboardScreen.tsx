import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Card, Text, Button, useTheme, IconButton, Chip, ProgressBar } from 'react-native-paper';
import { useGSTSummary, useGSTR1, useGSTR3B } from '../../hooks/useGST';
import { format, startOfMonth, endOfMonth } from 'date-fns';

export default function GSTDashboardScreen({ navigation }: any) {
    const theme = useTheme();
    const [selectedPeriod, setSelectedPeriod] = useState(format(new Date(), 'yyyy-MM'));

    const { summary: gstSummary, loading: summaryLoading } = useGSTSummary();
    const { data: gstr1Data, loading: gstr1Loading } = useGSTR1();
    const { data: gstr3bData, loading: gstr3bLoading } = useGSTR3B();

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };

    const gstReturns = [
        {
            title: 'GSTR-1',
            description: 'Outward supplies return',
            dueDate: '11th of next month',
            status: 'pending',
            icon: 'file-document-outline',
            onPress: () => navigation.navigate("GSTR1", { month: selectedPeriod.split('-')[1], year: selectedPeriod.split('-')[0] }),
        },
        {
            title: 'GSTR-2',
            description: 'Inward supplies return',
            dueDate: '13th of next month',
            status: 'draft',
            icon: 'file-document-edit-outline',
            onPress: () => navigation.navigate("GSTR2", { month: selectedPeriod.split('-')[1], year: selectedPeriod.split('-')[0] }),
        },
        {
            title: 'GSTR-3B',
            description: 'Monthly summary return',
            dueDate: '20th of next month',
            status: 'filed',
            icon: 'file-document-check-outline',
            onPress: () => navigation.navigate("GSTR3B", { month: selectedPeriod.split('-')[1], year: selectedPeriod.split('-')[0] }),
        },
    ];

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'filed':
                return theme.colors.primary;
            case 'pending':
                return theme.colors.error;
            case 'draft':
                return theme.colors.tertiary;
            default:
                return theme.colors.outline;
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'filed':
                return 'Filed';
            case 'pending':
                return 'Pending';
            case 'draft':
                return 'Draft';
            default:
                return status;
        }
    };

    return (
        <ScrollView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text variant="headlineSmall" style={styles.title}>GST Dashboard</Text>
                <Text variant="bodyMedium" style={styles.subtitle}>
                    Manage your GST compliance and returns
                </Text>
            </View>

            {/* Period Selector */}
            <Card style={styles.periodCard}>
                <Card.Content>
                    <Text variant="titleMedium" style={styles.periodTitle}>Selected Period</Text>
                    <View style={styles.periodSelector}>
                        <Text variant="titleLarge" style={styles.selectedPeriod}>
                            {format(new Date(selectedPeriod + '-01'), 'MMMM yyyy')}
                        </Text>
                        <Button
                            mode="outlined"
                            onPress={() => {
                                // Show period picker
                                console.log('Show period picker');
                            }}
                        >
                            Change
                        </Button>
                    </View>
                </Card.Content>
            </Card>

            {/* GST Summary */}
            {gstSummary && (
                <Card style={styles.summaryCard}>
                    <Card.Content>
                        <Text variant="titleMedium" style={styles.sectionTitle}>GST Summary</Text>

                        <View style={styles.summaryGrid}>
                            <View style={styles.summaryItem}>
                                <Text variant="bodySmall" style={styles.summaryLabel}>Sales</Text>
                                <Text variant="titleMedium" style={styles.summaryValue}>
                                    {formatCurrency(gstSummary.totalSales)}
                                </Text>
                            </View>
                            <View style={styles.summaryItem}>
                                <Text variant="bodySmall" style={styles.summaryLabel}>Purchases</Text>
                                <Text variant="titleMedium" style={styles.summaryValue}>
                                    {formatCurrency(gstSummary.totalPurchases)}
                                </Text>
                            </View>
                        </View>

                        <View style={styles.summaryGrid}>
                            <View style={styles.summaryItem}>
                                <Text variant="bodySmall" style={styles.summaryLabel}>Tax Collected</Text>
                                <Text variant="titleMedium" style={[styles.summaryValue, { color: theme.colors.primary }]}>
                                    {formatCurrency(gstSummary.totalTaxCollected)}
                                </Text>
                            </View>
                            <View style={styles.summaryItem}>
                                <Text variant="bodySmall" style={styles.summaryLabel}>Tax Paid</Text>
                                <Text variant="titleMedium" style={[styles.summaryValue, { color: theme.colors.secondary }]}>
                                    {formatCurrency(gstSummary.totalTaxPaid)}
                                </Text>
                            </View>
                        </View>

                        <View style={styles.netLiabilityContainer}>
                            <Text variant="bodySmall" style={styles.summaryLabel}>Net Tax Liability</Text>
                            <Text
                                variant="headlineSmall"
                                style={[
                                    styles.netLiabilityValue,
                                    { color: gstSummary.netTaxLiability > 0 ? theme.colors.error : theme.colors.primary }
                                ]}
                            >
                                {formatCurrency(gstSummary.netTaxLiability)}
                            </Text>
                        </View>

                        {/* ITC Details */}
                        <View style={styles.itcContainer}>
                            <Text variant="titleSmall" style={styles.itcTitle}>Input Tax Credit</Text>
                            <View style={styles.itcRow}>
                                <View style={styles.itcItem}>
                                    <Text variant="bodySmall" style={styles.summaryLabel}>Available</Text>
                                    <Text variant="titleMedium" style={styles.summaryValue}>
                                        {formatCurrency(gstSummary.itcAvailable)}
                                    </Text>
                                </View>
                                <View style={styles.itcItem}>
                                    <Text variant="bodySmall" style={styles.summaryLabel}>Utilized</Text>
                                    <Text variant="titleMedium" style={styles.summaryValue}>
                                        {formatCurrency(gstSummary.itcUtilized)}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </Card.Content>
                </Card>
            )}

            {/* GST Returns */}
            <Card style={styles.returnsCard}>
                <Card.Content>
                    <Text variant="titleMedium" style={styles.sectionTitle}>GST Returns</Text>

                    {gstReturns.map((returnItem, index) => (
                        <TouchableOpacity
                            key={index}
                            style={styles.returnItem}
                            onPress={returnItem.onPress}
                        >
                            <View style={styles.returnHeader}>
                                <IconButton
                                    icon={returnItem.icon}
                                    iconColor={getStatusColor(returnItem.status)}
                                    size={24}
                                    style={[styles.returnIcon, { backgroundColor: `${getStatusColor(returnItem.status)}20` }]}
                                />
                                <View style={styles.returnInfo}>
                                    <Text variant="titleMedium" style={styles.returnTitle}>
                                        {returnItem.title}
                                    </Text>
                                    <Text variant="bodySmall" style={styles.returnDescription}>
                                        {returnItem.description}
                                    </Text>
                                    <Text variant="bodySmall" style={styles.returnDueDate}>
                                        Due: {returnItem.dueDate}
                                    </Text>
                                </View>
                                <Chip
                                    mode="outlined"
                                    textStyle={{ fontSize: 12 }}
                                    style={[styles.returnStatusChip, { borderColor: getStatusColor(returnItem.status) }]}
                                >
                                    {getStatusLabel(returnItem.status)}
                                </Chip>
                            </View>
                        </TouchableOpacity>
                    ))}
                </Card.Content>
            </Card>

            {/* Quick Actions */}
            <Card style={styles.actionsCard}>
                <Card.Content>
                    <Text variant="titleMedium" style={styles.sectionTitle}>Quick Actions</Text>

                    <View style={styles.actionsGrid}>
                        <Button
                            mode="outlined"
                            icon="file-plus"
                            onPress={() => console.log('Create GST Transaction')}
                            style={styles.actionButton}
                        >
                            Add Transaction
                        </Button>
                        <Button
                            mode="outlined"
                            icon="sync"
                            onPress={() => navigation.navigate("GSTReconciliation")}
                            style={styles.actionButton}
                        >
                            Reconciliation
                        </Button>
                    </View>

                    <View style={styles.actionsGrid}>
                        <Button
                            mode="outlined"
                            icon="download"
                            onPress={() => console.log('Download Returns')}
                            style={styles.actionButton}
                        >
                            Download JSON
                        </Button>
                        <Button
                            mode="outlined"
                            icon="calculator"
                            onPress={() => console.log('GST Calculator')}
                            style={styles.actionButton}
                        >
                            GST Calculator
                        </Button>
                    </View>
                </Card.Content>
            </Card>

            {/* Compliance Status */}
            <Card style={styles.complianceCard}>
                <Card.Content>
                    <Text variant="titleMedium" style={styles.sectionTitle}>Compliance Status</Text>

                    <View style={styles.complianceItem}>
                        <Text variant="bodyMedium">GSTR-1 Filing</Text>
                        <View style={styles.complianceProgress}>
                            <ProgressBar progress={0.8} color={theme.colors.primary} style={styles.progressBar} />
                            <Text variant="bodySmall" style={styles.progressText}>80%</Text>
                        </View>
                    </View>

                    <View style={styles.complianceItem}>
                        <Text variant="bodyMedium">GSTR-3B Filing</Text>
                        <View style={styles.complianceProgress}>
                            <ProgressBar progress={1.0} color={theme.colors.primary} style={styles.progressBar} />
                            <Text variant="bodySmall" style={styles.progressText}>100%</Text>
                        </View>
                    </View>

                    <View style={styles.complianceItem}>
                        <Text variant="bodyMedium">Tax Payment</Text>
                        <View style={styles.complianceProgress}>
                            <ProgressBar progress={0.6} color={theme.colors.tertiary} style={styles.progressBar} />
                            <Text variant="bodySmall" style={styles.progressText}>60%</Text>
                        </View>
                    </View>
                </Card.Content>
            </Card>
        </ScrollView>
    );
}

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
    periodCard: {
        margin: 16,
        marginTop: 8,
    },
    periodTitle: {
        fontWeight: 'bold',
        marginBottom: 12,
    },
    periodSelector: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    selectedPeriod: {
        fontWeight: 'bold',
    },
    summaryCard: {
        margin: 16,
        marginTop: 8,
    },
    sectionTitle: {
        fontWeight: 'bold',
        marginBottom: 16,
    },
    summaryGrid: {
        flexDirection: 'row',
        marginBottom: 16,
    },
    summaryItem: {
        flex: 1,
        alignItems: 'center',
    },
    summaryLabel: {
        opacity: 0.6,
        marginBottom: 4,
    },
    summaryValue: {
        fontWeight: 'bold',
    },
    netLiabilityContainer: {
        alignItems: 'center',
        paddingVertical: 16,
        borderTopWidth: 1,
        borderTopColor: 'rgba(0,0,0,0.1)',
        marginTop: 8,
    },
    netLiabilityValue: {
        fontWeight: 'bold',
    },
    itcContainer: {
        marginTop: 16,
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: 'rgba(0,0,0,0.1)',
    },
    itcTitle: {
        fontWeight: 'bold',
        marginBottom: 12,
    },
    itcRow: {
        flexDirection: 'row',
    },
    itcItem: {
        flex: 1,
        alignItems: 'center',
    },
    returnsCard: {
        margin: 16,
        marginTop: 8,
    },
    returnItem: {
        marginBottom: 16,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.1)',
    },
    returnHeader: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    returnIcon: {
        margin: 0,
        marginRight: 12,
    },
    returnInfo: {
        flex: 1,
    },
    returnTitle: {
        fontWeight: '600',
        marginBottom: 2,
    },
    returnDescription: {
        opacity: 0.6,
        marginBottom: 2,
    },
    returnDueDate: {
        opacity: 0.6,
        fontSize: 12,
    },
    returnStatusChip: {
        height: 28,
    },
    actionsCard: {
        margin: 16,
        marginTop: 8,
    },
    actionsGrid: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 12,
    },
    actionButton: {
        flex: 1,
    },
    complianceCard: {
        margin: 16,
        marginTop: 8,
        marginBottom: 32,
    },
    complianceItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    complianceProgress: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        marginLeft: 16,
    },
    progressBar: {
        flex: 1,
        height: 8,
        marginRight: 8,
    },
    progressText: {
        minWidth: 35,
        textAlign: 'right',
    },
});
