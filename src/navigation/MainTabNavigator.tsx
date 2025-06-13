import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MainTabParamList } from "../types/navigation";
import { DashboardScreen } from "../screens/dashboard/DashboardScreen";
import BillNavigator from "./BillNavigator";
import AccountingNavigator from "./AccountingNavigator";
import GSTNavigator from "./GSTNavigator";
import ReportNavigator from "./ReportNavigator";
import ProductNavigator from "./ProductNavigator";
import PaymentNavigator from "./PaymentNavigator";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import CompanySelector from "../components/CompanySelector";

const Tab = createBottomTabNavigator<MainTabParamList>();

export default function MainTabNavigator() {
   
    return (
        <Tab.Navigator initialRouteName="Dashboard" screenOptions={{headerRight:()=>{
            return <CompanySelector/>
        }
        }}>
            <Tab.Screen
                name="Dashboard"
                component={DashboardScreen}
                options={{
                    tabBarIcon: ({ color,size }) => (
                        <Icon name="view-dashboard" color={color} size={size} />
                    ),
                }}
            />
            <Tab.Screen
                name="Bills"
                component={BillNavigator}
                options={{
                    tabBarIcon: ({ color,size }) => (
                        <Icon name="receipt" color={color} size={size} />
                    ),
                }}
            />
            <Tab.Screen
                name="Products"
                component={ProductNavigator}
                options={{
                    tabBarIcon: ({ color,size }) => (
                        <Icon name="cube" color={color} size={size} />
                    ),
                }}
            />
            <Tab.Screen
                name="Payments"
                component={PaymentNavigator}
                options={{
                    tabBarIcon: ({ color,size }) => (
                        <Icon name="credit-card" color={color} size={size} />
                    ),
                }}
            />
            <Tab.Screen
                name="GST"
                component={GSTNavigator}
                options={{
                    tabBarIcon: ({ color,size }) => (
                        <Icon name="hand-coin" color={color} size={size} />
                    ),
                }}
            />
            <Tab.Screen
                name="Reports"
                component={ReportNavigator}
                options={{
                    tabBarIcon: ({ color,size }) => (
                        <Icon name="file-chart" color={color} size={size} />
                    ),
                }}
            />
        </Tab.Navigator>
    );
}
