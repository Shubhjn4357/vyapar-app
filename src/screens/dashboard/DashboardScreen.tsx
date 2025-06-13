import React, { useState, useEffect } from 'react';
import { ScrollView, RefreshControl, View, StyleSheet } from 'react-native';
import { Card, Text, FAB, useTheme } from 'react-native-paper';
import { useDashboardMetrics } from '../../hooks/useReports';
import { useBills } from '../../hooks/useBills';
import { useGSTSummary } from '../../hooks/useGST';
import { DashboardMetrics } from '../../components/dashboard/DashboardMetrics';
import { RecentTransactions } from '../../components/dashboard/RecentTransactions';
import { SalesChart } from '../../components/dashboard/SalesChart';
import { EnhancedDashboard } from '../../components/dashboard/EnhancedDashboard';
import { billsApi } from '../../api/bills';
import { Bill } from '../../types/bill';

export const DashboardScreen = ({ navigation }: { navigation: any }) => {
  const theme = useTheme();
  const { metrics, loading: metricsLoading, fetchMetrics } = useDashboardMetrics();
  const { bills, loading: billsLoading, fetchBills } = useBills();
  const { summary: gstSummary, loading: gstLoading, fetchSummary: fetchGSTSummary } = useGSTSummary();

  const [refreshing, setRefreshing] = useState(false);
  const [recentBills, setRecentBills] = useState<Bill[]>([]);
  const [salesAnalytics, setSalesAnalytics] = useState<{
    totalBills: number;
    totalAmount: number;
    averageAmount: number;
    chartData: Array<{ period: string; amount: number; count: number }>;
  } | null>(null);

  const fetchRecentBills = async () => {
    try {
      const response = await billsApi.getRecentBills(5);
      setRecentBills(response.data);
    } catch (error) {
      console.error('Failed to fetch recent bills:', error);
    }
  };

  const fetchSalesAnalytics = async () => {
    try {
      const response = await billsApi.getBillAnalytics({
        groupBy: 'month'
      });
      setSalesAnalytics(response.data);
    } catch (error) {
      console.error('Failed to fetch sales analytics:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await Promise.all([
        fetchMetrics(),
        fetchBills(),
        fetchGSTSummary(),
        fetchRecentBills(),
        fetchSalesAnalytics()
      ]);
    } catch (error) {
      console.error('Failed to refresh dashboard:', error);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchRecentBills();
    fetchSalesAnalytics();
  }, []);

  const handleBillPress = (bill: Bill) => {
    // Navigate to bill details
    console.log('Navigate to bill:', bill.id);
  };

  const isLoading = metricsLoading || billsLoading || gstLoading;

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[theme.colors.primary]}
          />
        }
      >
        {/* Dashboard Metrics */}
        <DashboardMetrics
          metrics={metrics}
          loading={metricsLoading}
        />

        {/* Sales Chart */}
        {salesAnalytics && (
          <SalesChart
            data={salesAnalytics.chartData || []}
            loading={false}
          />
        )}

        {/* Recent Transactions */}
        <RecentTransactions
          bills={recentBills}
          onBillPress={handleBillPress}
          loading={billsLoading}
        />

        {/* Enhanced Dashboard Features */}
        <EnhancedDashboard navigation={navigation} />

        {/* Quick Actions */}
        <Card style={styles.quickActionsCard}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>Quick Actions</Text>
            <View style={styles.quickActionsGrid}>
              <Card style={styles.quickActionItem}>
                <Card.Content style={styles.quickActionContent}>
                  <Text variant="bodyMedium">Create Bill</Text>
                </Card.Content>
              </Card>
              <Card style={styles.quickActionItem}>
                <Card.Content style={styles.quickActionContent}>
                  <Text variant="bodyMedium">Add Customer</Text>
                </Card.Content>
              </Card>
              <Card style={styles.quickActionItem}>
                <Card.Content style={styles.quickActionContent}>
                  <Text variant="bodyMedium">View Reports</Text>
                </Card.Content>
              </Card>
              <Card style={styles.quickActionItem}>
                <Card.Content style={styles.quickActionContent}>
                  <Text variant="bodyMedium">GST Returns</Text>
                </Card.Content>
              </Card>
            </View>
          </Card.Content>
        </Card>

        {/* GST Summary */}
        {gstSummary && (
          <Card style={styles.gstCard}>
            <Card.Content>
              <Text variant="titleMedium" style={styles.sectionTitle}>GST Summary</Text>
              <View style={styles.gstRow}>
                <View style={styles.gstItem}>
                  <Text variant="bodySmall" style={styles.gstLabel}>Tax Collected</Text>
                  <Text variant="titleMedium" style={styles.gstValue}>
                    ₹{gstSummary.totalTaxCollected?.toLocaleString('en-IN') || '0'}
                  </Text>
                </View>
                <View style={styles.gstItem}>
                  <Text variant="bodySmall" style={styles.gstLabel}>Tax Paid</Text>
                  <Text variant="titleMedium" style={styles.gstValue}>
                    ₹{gstSummary.totalTaxPaid?.toLocaleString('en-IN') || '0'}
                  </Text>
                </View>
              </View>
              <View style={styles.gstRow}>
                <View style={styles.gstItem}>
                  <Text variant="bodySmall" style={styles.gstLabel}>Net Liability</Text>
                  <Text
                    variant="titleMedium"
                    style={[
                      styles.gstValue,
                      { color: (gstSummary.netTaxLiability || 0) > 0 ? theme.colors.error : theme.colors.primary }
                    ]}
                  >
                    ₹{gstSummary.netTaxLiability?.toLocaleString('en-IN') || '0'}
                  </Text>
                </View>
                <View style={styles.gstItem}>
                  <Text variant="bodySmall" style={styles.gstLabel}>ITC Available</Text>
                  <Text variant="titleMedium" style={styles.gstValue}>
                    ₹{gstSummary.itcAvailable?.toLocaleString('en-IN') || '0'}
                  </Text>
                </View>
              </View>
            </Card.Content>
          </Card>
        )}
      </ScrollView>

      {/* Floating Action Button */}
      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => {
          // Navigate to create bill screen
          console.log('Navigate to create bill');
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 80, // Space for FAB
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginBottom: 16,
  },
  quickActionsCard: {
    margin: 16,
    marginTop: 8,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  quickActionItem: {
    flex: 1,
    minWidth: '45%',
  },
  quickActionContent: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  gstCard: {
    margin: 16,
    marginTop: 8,
  },
  gstRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  gstItem: {
    flex: 1,
    alignItems: 'center',
  },
  gstLabel: {
    opacity: 0.6,
    marginBottom: 4,
  },
  gstValue: {
    fontWeight: 'bold',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});
