import { useTheme } from "../contexts/ThemeContext";

import { ViewStyle, TextStyle, StyleSheet } from "react-native";

type Style = {
    container: ViewStyle;
    header: TextStyle;
    button: ViewStyle;
    buttonText: TextStyle;
    error:TextStyle;
    input: TextStyle & ViewStyle;
    card: ViewStyle;
    row: ViewStyle;
    modalContainer: ViewStyle;
};

interface ThemeColors {
    background: string;
    primaryText: string;
    primary: string;
    buttonText: string;
    border: string;
    inputText: string;
    inputBackground: string;
    cardBackground: string;
    error:string;
}

interface StylesFn {
    (theme: ThemeColors): Style;
}

const styles: StylesFn = (theme) => ({
    container: {
        flex: 1,
        backgroundColor: theme.background,
        padding: 16,
    },
    header: {
        fontSize: 24,
        fontWeight: "bold",
        color: theme.primaryText,
        marginBottom: 12,
    },
    button: {
        backgroundColor: theme.primary,
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
        alignItems: "center" as ViewStyle["alignItems"],
        marginVertical: 8,
    },
    buttonText: {
        color: theme.buttonText,
        fontSize: 16,
        fontWeight: "600",
    },
    error: {
        color: theme.error,
        marginBottom: 8,
        marginLeft: 4,
    },
    input: {
        borderWidth: 1,
        borderColor: theme.border,
        borderRadius: 6,
        padding: 10,
        marginBottom: 12,
        color: theme.inputText,
        backgroundColor: theme.inputBackground,
    },
    modalContainer: {
        backgroundColor: theme.background,
        padding: 24,
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        position: "absolute",
        bottom: 0,
        width: "100%",
        alignSelf: "center",
    },
    card: {
        backgroundColor: theme.cardBackground,
        borderRadius: 10,
        padding: 16,
        marginVertical: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    row: {
        flexDirection: "row",
        alignItems: "center" as ViewStyle["alignItems"],
        justifyContent: "space-between" as ViewStyle["justifyContent"],
    },
});

export function useStyle() {
    const { theme } = useTheme();

    // Map MD3Theme to ThemeColors
    const themeColors: ThemeColors = {
        background: theme.background,
        primaryText: theme.onBackground,
        primary: theme.primary,
        buttonText: theme.onPrimary,
        border: theme.outline,
        inputText: theme.surface,
        inputBackground: theme.surfaceVariant,
        cardBackground: theme.surface,
        error:theme.error
    };

    return StyleSheet.create(styles(themeColors));
}
