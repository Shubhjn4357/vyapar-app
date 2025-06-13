import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useAuth } from "../contexts/AuthContext";
import { RootStackParamList } from "../types/navigation";
import AuthNavigator from "./AuthNavigator";
import MainTabNavigator from "./MainTabNavigator";
import CompleteProfileScreen from "../screens/auth/CompleteProfileScreen";
import { SplashScreen } from "../components/SplashScreen";
import CompanyListScreen from "../screens/company/CompanyListScreen";
import CreateCompanyScreen from "../screens/company/CreateCompanyScreen";
import EditCompanyScreen from "../screens/company/EditCompanyScreen";
import { CustomHeader } from "../components/CustomHeader";

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
    const { isAuthenticated, user, company, isLoading } = useAuth()
    if (isLoading) {
        return <SplashScreen />;
    }
    if (!isAuthenticated) {
        return (
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                <Stack.Screen name="Auth" component={AuthNavigator} />
            </Stack.Navigator>
        );
    }

    if (!user?.isProfileComplete) {
        return (
            <Stack.Navigator screenOptions={{headerShown:false}}>
                <Stack.Screen name="CompleteProfile" component={CompleteProfileScreen} />
            </Stack.Navigator>
        );
    }


    return (
        <Stack.Navigator screenOptions={{
            headerShown: true,
            header: ({ route, navigation }) => (
                <CustomHeader
                    showBack={navigation.canGoBack()}
                    title={route.name}
                    onBackPress={() => navigation.goBack()}
                />)
}}>
            <Stack.Screen name="CompanyList" component={CompanyListScreen} />
            <Stack.Screen name="CreateCompany" component={CreateCompanyScreen} />
            <Stack.Screen name="EditCompany" component={EditCompanyScreen} />
            <Stack.Screen name="Main" options={{ headerShown: false }} component={MainTabNavigator} />
        </Stack.Navigator>
    );
}
