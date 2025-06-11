import React from "react";
import { SafeAreaView, StatusBar } from "react-native";
import { PaperProvider } from "react-native-paper";
import { ThemeProvider, useTheme } from "../contexts/ThemeContext";
import { NetworkProvider } from '../contexts/NetworkContext';
import { LoadingProvider,useLoading } from '../contexts/LoadingContext';
import RootNavigator from "../navigation/RootNavigator";
import { ErrorBoundary } from '../components/ErrorBoundary';
import { NetworkBanner } from '../components/NetworkBanner';
import { storage, StorageKeys } from '../utils/storage';
import { SplashScreen } from '../components/SplashScreen';
import { AuthProvider } from "../contexts/AuthContext";

const AppContent = () => {
    const { theme ,mode} = useTheme();
    const { isLoading, setLoading } = useLoading();
    React.useEffect(() => {
        const initializeApp = async () => {
            try {
                const [themeData, authData] = await Promise.all([
                    storage.get(StorageKeys.THEME),
                    storage.get(StorageKeys.AUTH),
                ]);
                // Add minimum splash screen display time
                await new Promise(resolve => setTimeout(resolve, 2000));
                setLoading(false);
            } catch (error) {
                console.error('App initialization error:', error);
                setLoading(false);
            }
        };

        initializeApp();
    }, []);

    if (isLoading) {
        return <SplashScreen />;
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <StatusBar barStyle={mode === "dark" ? 'dark-content' : 'light-content'} />
            <NetworkBanner />
            <PaperProvider theme={{ colors: { ...theme }, animation: { scale: 1.0 ,defaultAnimationDuration:0.5} }}>
                <AuthProvider>
                        <RootNavigator />
                </AuthProvider>
            </PaperProvider>
        </SafeAreaView>
    );
};

export default function App() {
    return (
        <ErrorBoundary>
            <LoadingProvider>
                <NetworkProvider>
                    <ThemeProvider>
                        <AppContent />
                    </ThemeProvider>
                </NetworkProvider>
            </LoadingProvider>
        </ErrorBoundary>
    );
}
