import AsyncStorage from '@react-native-async-storage/async-storage';

export const StorageKeys = {
    THEME: 'app_theme',
    AUTH: 'auth_state',
};

export const storage = {
    async get(key: string) {
        try {
            const value = await AsyncStorage.getItem(key);
            return value ? JSON.parse(value) : null;
        } catch (error) {
            console.error('Storage get error:', error);
            return null;
        }
    },

    async set(key: string, value: any) {
        try {
            await AsyncStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.error('Storage set error:', error);
        }
    },
};
