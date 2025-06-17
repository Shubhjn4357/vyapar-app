import React from "react";
import { PaperProvider, MD3LightTheme, MD3DarkTheme } from "react-native-paper";
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

const AppContent = () => {
    const { theme, mode } = useTheme();

    // Merge custom theme with Paper's MD3 theme
    const paperTheme = React.useMemo(() => {
        const base = mode === "dark" ? MD3DarkTheme : MD3LightTheme;
        return {
            ...base,
            colors: {
                ...base.colors,
                ...theme.colors
            }
            // You can add more customizations here if needed
        };
    }, [theme, mode]);

    return (
        <>
            <StatusBar style={mode === "dark" ? 'light' : 'dark'} />
            <NetworkBanner />
            <PaperProvider theme={paperTheme}>
                <AuthProvider>
                    <CompanyProvider>
                        <RootNavigator />
                    </CompanyProvider>
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