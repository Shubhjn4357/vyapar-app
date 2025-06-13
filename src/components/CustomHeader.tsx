import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Appbar, Text, useTheme } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import { useNavigation } from '@react-navigation/native';

type Props = {
    title?: string;
    showBack?: boolean;
    onBackPress?: () => void;
    right?: React.ReactNode;
    blurIntensity?: number;
    action?:{
        icon: string;
        onPress: () => void;
    }[]
};

export const CustomHeader: React.FC<Props> = ({
    title,
    showBack = false,
    onBackPress,
    right,
    blurIntensity = 50,
    action=[]
}) => {
    const insets = useSafeAreaInsets();
    const theme = useTheme();
    const navigation = useNavigation();

    const handleBack = () => {
        if (onBackPress) onBackPress();
        else navigation.goBack();
    };

    return (
        <BlurView intensity={blurIntensity} tint={theme.dark ? 'dark' : 'light'} style={[styles.header, { paddingTop: insets.top }]}>
            <Appbar.Header style={styles.inner}>
                {showBack && (
                    <Appbar.BackAction onPress={handleBack} />
                ) }
                <Appbar.Content title={title} />
                {right}
                {action.map((item, index) => (
                    <Appbar.Action key={index} icon={item.icon} onPress={item.onPress} />
                ))}
            </Appbar.Header>
        </BlurView>
    );
};

const styles = StyleSheet.create({
    header: {
        width: '100%',
        zIndex: 10,
    },
    inner: {
        height: 56,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        justifyContent: 'space-between',
    },
    backButton: {
        width: 40,
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    title: {
        fontSize: 18,
        flex: 1,
        textAlign: 'center',
    },
    rightContainer: {
        width: 40,
        alignItems: 'flex-end',
    },
});
