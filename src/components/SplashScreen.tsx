import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ActivityIndicator, Text } from 'react-native-paper';

const APP_VERSION = '1.0.0';

export function SplashScreen() {
    return (
        <View style={styles.container}>
            <Text variant="headlineMedium">Vyapar App</Text>
            <ActivityIndicator size="large" style={styles.loader} />
            <Text variant="bodySmall" style={styles.version}>v{APP_VERSION}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loader: {
        marginVertical: 20,
    },
    version: {
        position: 'absolute',
        bottom: 20,
    },
});
