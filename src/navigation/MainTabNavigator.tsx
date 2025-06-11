import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MainTabParamList } from "../types/navigation";
import { DashboardScreen } from "../screens/dashboard/DashboardScreen";
import BillNavigator from "./BillNavigator";
import AccountingNavigator from "./AccountingNavigator";
import GSTNavigator from "./GSTNavigator";
import ReportNavigator from "./ReportNavigator";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const Tab = createBottomTabNavigator<MainTabParamList>();

export default function MainTabNavigator() {
    return (
        <Tab.Navigator>
            <Tab.Screen
                name="Dashboard"
                component={DashboardScreen}
                options={{
                    tabBarIcon: ({ color }) => (
                        <Icon name="dashboard" color={color} size={24} />
                    ),
                }}
            />
            <Tab.Screen
                name="Bills"
                component={BillNavigator}
                options={{
                    tabBarIcon: ({ color }) => (
                        <Icon name="receipt" color={color} size={24} />
                    ),
                }}
            />
            <Tab.Screen
                name="Accounting"
                component={AccountingNavigator}
                options={{
                    tabBarIcon: ({ color }) => (
                        <Icon name="account-balance" color={color} size={24} />
                    ),
                }}
            />
            <Tab.Screen
                name="GST"
                component={GSTNavigator}
                options={{
                    tabBarIcon: ({ color }) => (
                        <Icon name="monetization-on" color={color} size={24} />
                    ),
                }}
            />
            <Tab.Screen
                name="Reports"
                component={ReportNavigator}
                options={{
                    tabBarIcon: ({ color }) => (
                        <Icon name="assessment" color={color} size={24} />
                    ),
                }}
            />
        </Tab.Navigator>
    );
}
