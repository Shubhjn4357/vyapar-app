import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useAuth } from "../contexts/AuthContext";
import { CompanyProvider } from "../contexts/CompanyContext";
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

function AuthenticatedNavigator() {
    const { user, company } = useAuth();
    console.log({user, company})
    // If profile is not complete, show profile completion screen
    if (!user?.isProfileComplete) {
        return (
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                <Stack.Screen name="CompleteProfile" component={CompleteProfileScreen} />
            </Stack.Navigator>
        );
    }

    // If no company is selected, show company selection/creation flow
    if (!company) {
        return (
            <Stack.Navigator 
                screenOptions={{
                    headerShown: true,
                    header: ({ route, navigation }) => (
                        <CustomHeader
                            showBack={navigation.canGoBack()}
                            title={route.name === 'CompanyList' ? 'Select Company' : route.name}
                            onBackPress={() => navigation.goBack()}
                        />
                    )
                }}
            >
                <Stack.Screen 
                    name="CompanyList" 
                    component={CompanyListScreen}
                    options={{ headerShown: false }}
                />
                <Stack.Screen 
                    name="CreateCompany" 
                    component={CreateCompanyScreen}
                    options={{ title: 'Create Company' }}
                />
                <Stack.Screen 
                    name="EditCompany" 
                    component={EditCompanyScreen}
                    options={{ title: 'Edit Company' }}
                />
            </Stack.Navigator>
        );
    }

    // Main app navigation with company selected
    return (
        <Stack.Navigator 
            screenOptions={{
                headerShown: true,
                header: ({ route, navigation }) => (
                    <CustomHeader
                        showBack={navigation.canGoBack()}
                        title={route.name}
                        onBackPress={() => navigation.goBack()}
                    />
                )
            }}
        >
            <Stack.Screen 
                name="Main" 
                component={MainTabNavigator} 
                options={{ headerShown: false }} 
            />
            <Stack.Screen 
                name="CompanyList" 
                component={CompanyListScreen}
                options={{ title: 'Switch Company' }}
            />
            <Stack.Screen 
                name="CreateCompany" 
                component={CreateCompanyScreen}
                options={{ title: 'Create Company' }}
            />
            <Stack.Screen 
                name="EditCompany" 
                component={EditCompanyScreen}
                options={{ title: 'Edit Company' }}
            />
        </Stack.Navigator>
    );
}

export default function RootNavigator() {
    const { isAuthenticated, isLoading } = useAuth();

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

    return (
        <CompanyProvider>
            <AuthenticatedNavigator />
        </CompanyProvider>
    );
}
