import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { GSTStackParamList } from "../types/navigation";
import GSTDashboardScreen from "../screens/gst/GSTDashboardScreen";
import GSTR1Screen from "../screens/gst/GSTR1Screen";
import GSTR2Screen from "../screens/gst/GSTR2Screen";
import GSTR3BScreen from "../screens/gst/GSTR3BScreen";
import GSTReconciliationScreen from "../screens/gst/GSTReconciliationScreen";

const Stack = createNativeStackNavigator<GSTStackParamList>();

export default function GSTNavigator() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="GSTDashboard" component={GSTDashboardScreen} />
            <Stack.Screen name="GSTR1" component={GSTR1Screen} />
            <Stack.Screen name="GSTR2" component={GSTR2Screen} />
            <Stack.Screen name="GSTR3B" component={GSTR3BScreen} />
            <Stack.Screen name="GSTReconciliation" component={GSTReconciliationScreen} />
        </Stack.Navigator>
    );
}
