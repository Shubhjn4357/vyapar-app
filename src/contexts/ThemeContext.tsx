import React, { createContext, useContext, useState, useMemo, useEffect } from "react";
import { Appearance, ColorSchemeName } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { lightColors, darkColors } from "../theme/colors";

export type ThemeMode = "light" | "dark" | "system";

export interface ThemeSpacing {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    xxl: number;
}

export interface ThemeBorderRadius {
    sm: number;
    md: number;
    lg: number;
    xl: number;
}

export interface ThemeTypography {
    h1: { fontSize: number; fontWeight: string };
    h2: { fontSize: number; fontWeight: string };
    h3: { fontSize: number; fontWeight: string };
    h4: { fontSize: number; fontWeight: string };
    body: { fontSize: number; fontWeight: string };
    caption: { fontSize: number; fontWeight: string };
}

export interface EnhancedTheme {
    colors: typeof lightColors;
    spacing: ThemeSpacing;
    borderRadius: ThemeBorderRadius;
    typography: ThemeTypography;
    shadows: {
        sm: object;
        md: object;
        lg: object;
    };
}

const spacing: ThemeSpacing = {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
};

const borderRadius: ThemeBorderRadius = {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
};

const typography: ThemeTypography = {
    h1: { fontSize: 32, fontWeight: 'bold' },
    h2: { fontSize: 28, fontWeight: 'bold' },
    h3: { fontSize: 24, fontWeight: '600' },
    h4: { fontSize: 20, fontWeight: '600' },
    body: { fontSize: 16, fontWeight: 'normal' },
    caption: { fontSize: 14, fontWeight: 'normal' },
};

const createShadows = (isDark: boolean) => ({
    sm: {
        shadowColor: isDark ? '#fff' : '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: isDark ? 0.1 : 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    md: {
        shadowColor: isDark ? '#fff' : '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: isDark ? 0.15 : 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    lg: {
        shadowColor: isDark ? '#fff' : '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: isDark ? 0.2 : 0.15,
        shadowRadius: 8,
        elevation: 5,
    },
});

const ThemeContext = createContext<{
    theme: EnhancedTheme;
    mode: ThemeMode;
    setMode: (mode: ThemeMode) => void;
    animationsEnabled: boolean;
    setAnimationsEnabled: (enabled: boolean) => void;
}>({
    theme: {
        colors: lightColors,
        spacing,
        borderRadius,
        typography,
        shadows: createShadows(false)
    },
    mode: "light",
    setMode: () => { },
    animationsEnabled: true,
    setAnimationsEnabled: () => { },
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [mode, setModeState] = useState<ThemeMode>("system");
    const [animationsEnabled, setAnimationsEnabledState] = useState(true);
    const [systemColorScheme, setSystemColorScheme] = useState<ColorSchemeName>(
        Appearance.getColorScheme()
    );

    // Listen to system theme changes
    useEffect(() => {
        const subscription = Appearance.addChangeListener(({ colorScheme }) => {
            setSystemColorScheme(colorScheme);
        });

        return () => subscription?.remove();
    }, []);

    // Load saved preferences
    useEffect(() => {
        loadThemePreferences();
    }, []);

    // Save preferences when they change
    useEffect(() => {
        saveThemePreferences();
    }, [mode, animationsEnabled]);

    const loadThemePreferences = async () => {
        try {
            const savedThemeMode = await AsyncStorage.getItem('themeMode');
            const savedAnimationsEnabled = await AsyncStorage.getItem('animationsEnabled');

            if (savedThemeMode) {
                setModeState(savedThemeMode as ThemeMode);
            }

            if (savedAnimationsEnabled !== null) {
                setAnimationsEnabledState(JSON.parse(savedAnimationsEnabled));
            }
        } catch (error) {
            console.error('Failed to load theme preferences:', error);
        }
    };

    const saveThemePreferences = async () => {
        try {
            await AsyncStorage.setItem('themeMode', mode);
            await AsyncStorage.setItem('animationsEnabled', JSON.stringify(animationsEnabled));
        } catch (error) {
            console.error('Failed to save theme preferences:', error);
        }
    };

    const setMode = (newMode: ThemeMode) => {
        setModeState(newMode);
    };

    const setAnimationsEnabled = (enabled: boolean) => {
        setAnimationsEnabledState(enabled);
    };

    const theme = useMemo(() => {
        let effectiveMode: 'light' | 'dark';

        if (mode === 'system') {
            effectiveMode = systemColorScheme === 'dark' ? 'dark' : 'light';
        } else {
            effectiveMode = mode;
        }

        const colors = effectiveMode === "dark" ? darkColors : lightColors;
        const shadows = createShadows(effectiveMode === "dark");

        return {
            colors,
            spacing,
            borderRadius,
            typography,
            shadows
        };
    }, [mode, systemColorScheme]);

    return (
        <ThemeContext.Provider value={{ 
            theme, 
            mode, 
            setMode, 
            animationsEnabled, 
            setAnimationsEnabled 
        }}>
            {children}
        </ThemeContext.Provider>
    );
};

export function useTheme() {
    return useContext(ThemeContext);
}
