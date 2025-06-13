import React from "react";
import { PaperProvider } from "react-native-paper";
import { ThemeProvider, useTheme } from "../contexts/ThemeContext";
import { NetworkProvider } from '../contexts/NetworkContext';
import { LoadingProvider } from '../contexts/LoadingContext';
import RootNavigator from "../navigation/RootNavigator";
import { ErrorBoundary } from '../components/ErrorBoundary';
import { NetworkBanner } from '../components/NetworkBanner';
import { AuthProvider } from "../contexts/AuthContext";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from 'expo-status-bar';

const AppContent = () => {
    const { theme, mode } = useTheme();
    return (
        <>
            <StatusBar style={mode === "dark" ? 'light' : 'dark'} />
            <NetworkBanner />
            <PaperProvider theme={{ colors: { ...theme }, animation: { scale: 1.0, defaultAnimationDuration: 0.5 } }}>
                <AuthProvider>
                    <RootNavigator />
                </AuthProvider>
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
                    <ThemeProvider>
                        <AppContent />
                    </ThemeProvider>
                </NetworkProvider>
            </LoadingProvider>
        </ErrorBoundary>
        </SafeAreaProvider>
    );
}
