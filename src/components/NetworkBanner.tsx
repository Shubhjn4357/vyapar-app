import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useOffline } from '../contexts/OfflineContext';
import { useTheme } from '../contexts/ThemeContext';

export function NetworkBanner() {
    const { isOnline, pendingActionsCount } = useOffline();
    const { theme } = useTheme();

    if (isOnline && pendingActionsCount === 0) {
        return null;
    }

    return (
        <View style={[
            styles.banner, 
            { 
                backgroundColor: isOnline ? theme.warningContainer : theme.errorContainer 
            }
        ]}>
            <Text style={[
                styles.text, 
                { 
                    color: isOnline ? theme.onWarningContainer : theme.onErrorContainer 
                }
            ]}>
                {!isOnline 
                    ? "No internet connection" 
                    : `${pendingActionsCount} actions pending sync`
                }
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    banner: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        fontSize: 14,
        fontWeight: '500',
    },
});
