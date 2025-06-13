import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Card, Text, useTheme } from 'react-native-paper';
import { LineChart } from 'react-native-chart-kit';

interface SalesChartProps {
    data: Array<{ period: string; amount: number; count: number }>;
    loading?: boolean;
}

export const SalesChart: React.FC<SalesChartProps> = ({ data, loading = false }) => {
    const theme = useTheme();
    const screenWidth = Dimensions.get('window').width;

    if (loading) {
        return (
            <Card style={styles.container}>
                <Card.Content>
                    <Text>Loading chart...</Text>
                </Card.Content>
            </Card>
        );
    }

    if (!data || data.length === 0) {
        return (
            <Card style={styles.container}>
                <Card.Content>
                    <Text variant="titleMedium" style={styles.title}>Sales Trend</Text>
                    <Text variant="bodyMedium" style={styles.emptyText}>
                        No data available for chart
                    </Text>
                </Card.Content>
            </Card>
        );
    }

    const chartData = {
        labels: data.map(item => {
            // Format period for display (e.g., "Jan", "Feb", etc.)
            const date = new Date(item.period);
            return date.toLocaleDateString('en-US', { month: 'short' });
        }),
        datasets: [
            {
                data: data.map(item => item.amount / 1000), // Convert to thousands for better display
                color: (opacity = 1) => `rgba(${theme.colors.primary}, ${opacity})`,
                strokeWidth: 3,
            },
        ],
    };

    const chartConfig = {
        backgroundColor: theme.colors.surface,
        backgroundGradientFrom: theme.colors.surface,
        backgroundGradientTo: theme.colors.surface,
        decimalPlaces: 0,
        color: (opacity = 1) => `rgba(${theme.colors.onSurface}, ${opacity})`,
        labelColor: (opacity = 1) => `rgba(${theme.colors.onSurface}, ${opacity})`,
        style: {
            borderRadius: 16,
        },
        propsForDots: {
            r: '4',
            strokeWidth: '2',
            stroke: theme.colors.primary,
        },
        propsForBackgroundLines: {
            strokeDasharray: '',
            stroke: `rgba(${theme.colors.outline}, 0.2)`,
        },
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount * 1000); // Convert back from thousands
    };

    return (
        <Card style={styles.container}>
            <Card.Content>
                <Text variant="titleMedium" style={styles.title}>Sales Trend</Text>
                <Text variant="bodySmall" style={styles.subtitle}>
                    Last {data.length} months (in thousands)
                </Text>
                
                <View style={styles.chartContainer}>
                    <LineChart
                        data={chartData}
                        width={screenWidth - 64} // Account for card padding
                        height={220}
                        chartConfig={chartConfig}
                        bezier
                        style={styles.chart}
                        withInnerLines={true}
                        withOuterLines={true}
                        withVerticalLines={true}
                        withHorizontalLines={true}
                        fromZero={true}
                    />
                </View>

                {/* Summary Stats */}
                <View style={styles.statsContainer}>
                    <View style={styles.statItem}>
                        <Text variant="bodySmall" style={styles.statLabel}>Total Sales</Text>
                        <Text variant="titleMedium" style={styles.statValue}>
                            {formatCurrency(data.reduce((sum, item) => sum + item.amount, 0))}
                        </Text>
                    </View>
                    <View style={styles.statItem}>
                        <Text variant="bodySmall" style={styles.statLabel}>Total Bills</Text>
                        <Text variant="titleMedium" style={styles.statValue}>
                            {data.reduce((sum, item) => sum + item.count, 0)}
                        </Text>
                    </View>
                    <View style={styles.statItem}>
                        <Text variant="bodySmall" style={styles.statLabel}>Avg. Bill Value</Text>
                        <Text variant="titleMedium" style={styles.statValue}>
                            {formatCurrency(
                                data.reduce((sum, item) => sum + item.amount, 0) /
                                data.reduce((sum, item) => sum + item.count, 0)
                            )}
                        </Text>
                    </View>
                </View>
            </Card.Content>
        </Card>
    );
};

const styles = StyleSheet.create({
    container: {
        marginVertical: 8,
    },
    title: {
        fontWeight: 'bold',
        marginBottom: 4,
    },
    subtitle: {
        opacity: 0.6,
        marginBottom: 16,
    },
    chartContainer: {
        alignItems: 'center',
        marginVertical: 16,
    },
    chart: {
        borderRadius: 16,
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 16,
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: 'rgba(0,0,0,0.1)',
    },
    statItem: {
        alignItems: 'center',
    },
    statLabel: {
        opacity: 0.6,
        marginBottom: 4,
    },
    statValue: {
        fontWeight: 'bold',
    },
    emptyText: {
        textAlign: 'center',
        opacity: 0.6,
        marginTop: 20,
    },
});