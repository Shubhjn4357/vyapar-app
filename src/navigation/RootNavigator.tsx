import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useAuth } from "../contexts/AuthContext";
import { RootStackParamList } from "../types/navigation";
import AuthNavigator from "./AuthNavigator";
import MainTabNavigator from "./MainTabNavigator";
import CompanyNavigator from "./CompanyNavigator";
import CompleteProfileScreen from "../screens/auth/CompleteProfileScreen";

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
    const { isAuthenticated, user, company } = useAuth()
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

    if (!company) {
        return (
            <Stack.Navigator screenOptions={{headerShown:false}}>
                <Stack.Screen name="CompanySetup" component={CompanyNavigator} />
            </Stack.Navigator>
        );
    }

    return (
        <Stack.Navigator screenOptions={{ headerShown: false}}>
            <Stack.Screen name="Main" component={MainTabNavigator} />
        </Stack.Navigator>
    );
}
