import React from 'react';
import { ScrollView } from 'react-native';
import { Card, Text } from 'react-native-paper';
// import { useBills } from '@/src/hooks/useBills';
// import { useGSTReports } from '@/src/hooks/useGSTReports';
// import { DashboardMetrics } from '@/src/components/dashboard/DashboardMetrics';
// import { RecentTransactions } from '@/src/components/dashboard/RecentTransactions';
// import { useStyles } from '@/src/hooks/useStyles';

export const DashboardScreen = () => {
  // const { bills, totalRevenue, loading: billsLoading } = useBills();
  // const { gstSummary, loading: gstLoading } = useGSTReports();
  // const styles = useStyles();

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      {/* <DashboardMetrics
        billsCount={bills.length}
        totalRevenue={totalRevenue}
        gstLiability={gstSummary?.totalTax || 0}
        loading={billsLoading || gstLoading}
      /> */}

      <Card >
        <Card.Content>
          <Text variant='titleLarge'>Recent Transactions</Text>
          {/* <RecentTransactions bills={bills.slice(0, 5)} /> */}
        </Card.Content>
      </Card>

      {/* Add more dashboard components */}
    </ScrollView>
  );
};
