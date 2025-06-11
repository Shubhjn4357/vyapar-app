import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { CompanyStackParamList } from "../types/navigation";
import CompanyListScreen from "../screens/company/CompanyListScreen";
import CreateCompanyScreen from "../screens/company/CreateCompanyScreen";
import EditCompanyScreen from "../screens/company/EditCompanyScreen";

const Stack = createNativeStackNavigator<CompanyStackParamList>();

export default function CompanyNavigator() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="CompanyList" component={CompanyListScreen}/>
            <Stack.Screen name="CreateCompany" component={CreateCompanyScreen} />
            <Stack.Screen name="EditCompany" component={EditCompanyScreen} />
        </Stack.Navigator>
    );
}
