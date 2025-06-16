import React from "react";
import { NavigationContainer } from '@react-navigation/native';
import { PaperProvider } from "react-native-paper";
import { ThemeProvider, useTheme } from "../contexts/ThemeContext";
import { NetworkProvider } from '../contexts/NetworkContext';
import { LoadingProvider } from '../contexts/LoadingContext';
import { OfflineProvider } from '../contexts/OfflineContext';
import { CompanyProvider } from '../contexts/CompanyContext';
import RootNavigator from "../navigation/RootNavigator";
import { ErrorBoundary } from '../components/ErrorBoundary';
import { NetworkBanner } from '../components/NetworkBanner';
import { AuthProvider } from "../contexts/AuthContext";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from 'expo-status-bar';
import { navigationRef } from '../services/NavigationService';

const AppContent = () => {
    const { theme, mode } = useTheme();
    return (
        <>
            <StatusBar style={mode === "dark" ? 'light' : 'dark'} />
            <NetworkBanner />
            <PaperProvider theme={{ colors: { ...theme }, animation: { scale: 1.0, defaultAnimationDuration: 0.5 } }}>
                {/* <NavigationContainer ref={navigationRef}> */}
                    <AuthProvider>
                        <CompanyProvider>
                            <RootNavigator />
                        </CompanyProvider>
                    </AuthProvider>
                {/* </NavigationContainer> */}
            </PaperProvider>
       </>
    );
};

export default function App() {
    return (
        <SafeAreaProvider>
            <ErrorBoundary>
                <LoadingProvider>
                    <NetworkProvider>
                        <OfflineProvider>
                            <ThemeProvider>
                                <AppContent />
                            </ThemeProvider>
                        </OfflineProvider>
                    </NetworkProvider>
                </LoadingProvider>
            </ErrorBoundary>
        </SafeAreaProvider>
    );
}
