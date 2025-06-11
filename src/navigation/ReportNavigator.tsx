import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ReportStackParamList } from "../types/navigation";
import ReportDashboardScreen from "../screens/reports/ReportDashboardScreen";
import SalesReportScreen from "../screens/reports/SalesReportScreen";
import PurchaseReportScreen from "../screens/reports/PurchaseReportScreen";
import TaxReportScreen from "../screens/reports/TaxReportScreen";
import ProfitLossScreen from "../screens/reports/ProfitLossScreen";

const Stack = createNativeStackNavigator<ReportStackParamList>();

export default function ReportNavigator() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="ReportDashboard" component={ReportDashboardScreen} />
            <Stack.Screen name="SalesReport" component={SalesReportScreen} />
            <Stack.Screen name="PurchaseReport" component={PurchaseReportScreen} />
            <Stack.Screen name="TaxReport" component={TaxReportScreen} />
            <Stack.Screen name="ProfitLoss" component={ProfitLossScreen} />
        </Stack.Navigator>
    );
}
