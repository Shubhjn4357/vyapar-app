import React from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Card, Text, Chip, useTheme } from 'react-native-paper';
import { Bill } from '../../types/bill';
import { format } from 'date-fns';

interface RecentTransactionsProps {
    bills: Bill[];
    onBillPress?: (bill: Bill) => void;
    loading?: boolean;
}

export const RecentTransactions: React.FC<RecentTransactionsProps> = ({ 
    bills, 
    onBillPress,
    loading = false 
}) => {
    const theme = useTheme();

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
            default:
                return theme.colors.outline;
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'paid':
                return 'Paid';
            case 'pending':
                return 'Pending';
            case 'overdue':
                return 'Overdue';
            case 'draft':
                return 'Draft';
            case 'sent':
                return 'Sent';
            case 'cancelled':
                return 'Cancelled';
            default:
                return status;
        }
    };

    const renderBillItem = ({ item }: { item: Bill }) => (
        <TouchableOpacity
            onPress={() => onBillPress?.(item)}
            style={styles.billItem}
        >
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
            <View style={styles.billFooter}>
                <Text variant="bodySmall" style={styles.date}>
                    {format(new Date(item.date), 'MMM dd, yyyy')}
                </Text>
                {item.dueDate && (
                    <Text variant="bodySmall" style={styles.dueDate}>
                        Due: {format(new Date(item.dueDate), 'MMM dd')}
                    </Text>
                )}
            </View>
        </TouchableOpacity>
    );

    if (loading) {
        return (
            <Card style={styles.container}>
                <Card.Content>
                    <Text>Loading recent transactions...</Text>
                </Card.Content>
            </Card>
        );
    }

    if (!bills || bills.length === 0) {
        return (
            <Card style={styles.container}>
                <Card.Content>
                    <Text variant="titleMedium" style={styles.title}>Recent Transactions</Text>
                    <Text variant="bodyMedium" style={styles.emptyText}>
                        No recent transactions found
                    </Text>
                </Card.Content>
            </Card>
        );
    }

    return (
        <Card style={styles.container}>
            <Card.Content>
                <Text variant="titleMedium" style={styles.title}>Recent Transactions</Text>
                <FlatList
                    data={bills}
                    renderItem={renderBillItem}
                    keyExtractor={(item) => item.id}
                    showsVerticalScrollIndicator={false}
                    scrollEnabled={false}
                />
            </Card.Content>
        </Card>
    );
};

const styles = StyleSheet.create({
    container: {
        marginVertical: 8,
    },
    title: {
        marginBottom: 16,
        fontWeight: 'bold',
    },
    billItem: {
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.1)',
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
    billFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    date: {
        opacity: 0.6,
    },
    dueDate: {
        opacity: 0.6,
        fontStyle: 'italic',
    },
    emptyText: {
        textAlign: 'center',
        opacity: 0.6,
        marginTop: 20,
    },
});