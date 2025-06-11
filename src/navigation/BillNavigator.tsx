import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { BillStackParamList } from "../types/navigation";
import BillListScreen from "../screens/bills/BillListScreen";
import CreateBillScreen from "../screens/bills/CreateBillScreen";
import BillDetailsScreen from "../screens/bills/BillDetailsScreen";
import EditBillScreen from "../screens/bills/EditBillScreen";

const Stack = createNativeStackNavigator<BillStackParamList>();

export default function BillNavigator() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="BillList" component={BillListScreen} />
            <Stack.Screen name="CreateBill" component={CreateBillScreen} />
            <Stack.Screen name="BillDetails" component={BillDetailsScreen} />
            <Stack.Screen name="EditBill" component={EditBillScreen} />
        </Stack.Navigator>
    );
}
