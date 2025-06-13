import { useTheme } from "../contexts/ThemeContext";
import { ViewStyle, TextStyle, StyleSheet } from "react-native";

type Style = {
    // Layout styles
    container: ViewStyle;
    safeContainer: ViewStyle;
    scrollContainer: ViewStyle;
    centerContainer: ViewStyle;
    row: ViewStyle;
    column: ViewStyle;
    spaceBetween: ViewStyle;
    spaceAround: ViewStyle;
    
    // Typography styles
    header: TextStyle;
    subHeader: TextStyle;
    title: TextStyle;
    subtitle: TextStyle;
    body: TextStyle;
    caption: TextStyle;
    label: TextStyle;
    error: TextStyle;
    success: TextStyle;
    warning: TextStyle;
    
    // Button styles
    button: ViewStyle;
    buttonSecondary: ViewStyle;
    buttonOutlined: ViewStyle;
    buttonText: ViewStyle;
    buttonDisabled: ViewStyle;
    buttonTextPrimary: TextStyle;
    buttonTextSecondary: TextStyle;
    buttonTextOutlined: TextStyle;
    buttonTextDisabled: TextStyle;
    
    // Input styles
    input: ViewStyle & TextStyle;
    inputFocused: ViewStyle;
    inputError: ViewStyle;
    inputLabel: TextStyle;
    inputHelper: TextStyle;
    
    // Card styles
    card: ViewStyle;
    cardElevated: ViewStyle;
    cardHeader: ViewStyle;
    cardContent: ViewStyle;
    cardActions: ViewStyle;
    
    // Modal styles
    modalContainer: ViewStyle;
    modalOverlay: ViewStyle;
    modalContent: ViewStyle;
    
    // List styles
    listItem: ViewStyle;
    listItemPressed: ViewStyle;
    listItemText: TextStyle;
    listItemSubtext: TextStyle;
    
    // Navigation styles
    tabBar: ViewStyle;
    tabItem: ViewStyle;
    tabItemActive: ViewStyle;
    tabLabel: TextStyle;
    tabLabelActive: TextStyle;
    
    // Utility styles
    shadow: ViewStyle;
    divider: ViewStyle;
    badge: ViewStyle;
    badgeText: TextStyle;
    avatar: ViewStyle;
    chip: ViewStyle;
    chipText: TextStyle;
};

interface ThemeColors {
    background: string;
    surface: string;
    surfaceVariant: string;
    primary: string;
    primaryContainer: string;
    secondary: string;
    secondaryContainer: string;
    tertiary: string;
    error: string;
    errorContainer: string;
    onBackground: string;
    onSurface: string;
    onSurfaceVariant: string;
    onPrimary: string;
    onPrimaryContainer: string;
    onSecondary: string;
    onSecondaryContainer: string;
    onError: string;
    outline: string;
    outlineVariant: string;
    shadow: string;
    disabled: string;
    placeholder: string;
    accent: string;
    text: string;
    textSecondary: string;
}

interface StylesFn {
    (theme: ThemeColors): Style;
}

const styles: StylesFn = (theme) => ({
    // Layout styles
    container: {
        flex: 1,
        backgroundColor: theme.background,
        padding: 16,
    },
    safeContainer: {
        flex: 1,
        backgroundColor: theme.background,
    },
    scrollContainer: {
        flexGrow: 1,
        backgroundColor: theme.background,
        padding: 16,
    },
    centerContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: theme.background,
        padding: 16,
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
    },
    column: {
        flexDirection: "column",
    },
    spaceBetween: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    spaceAround: {
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
    },
    
    // Typography styles
    header: {
        fontSize: 32,
        fontWeight: "bold",
        color: theme.onBackground,
        marginBottom: 16,
    },
    subHeader: {
        fontSize: 24,
        fontWeight: "600",
        color: theme.onBackground,
        marginBottom: 12,
    },
    title: {
        fontSize: 20,
        fontWeight: "600",
        color: theme.onBackground,
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        fontWeight: "500",
        color: theme.onSurface,
        marginBottom: 4,
    },
    body: {
        fontSize: 14,
        color: theme.onSurface,
        lineHeight: 20,
    },
    caption: {
        fontSize: 12,
        color: theme.onSurfaceVariant,
        lineHeight: 16,
    },
    label: {
        fontSize: 14,
        fontWeight: "500",
        color: theme.onSurface,
        marginBottom: 4,
    },
    error: {
        fontSize: 12,
        color: theme.error,
        marginTop: 4,
        marginLeft: 4,
    },
    success: {
        fontSize: 12,
        color: "#4CAF50",
        marginTop: 4,
        marginLeft: 4,
    },
    warning: {
        fontSize: 12,
        color: "#FF9800",
        marginTop: 4,
        marginLeft: 4,
    },
    
    // Button styles
    button: {
        backgroundColor: theme.primary,
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
        alignItems: "center",
        justifyContent: "center",
        marginVertical: 8,
        minHeight: 48,
    },
    buttonSecondary: {
        backgroundColor: theme.secondary,
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
        alignItems: "center",
        justifyContent: "center",
        marginVertical: 8,
        minHeight: 48,
    },
    buttonOutlined: {
        backgroundColor: "transparent",
        borderWidth: 1,
        borderColor: theme.outline,
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
        alignItems: "center",
        justifyContent: "center",
        marginVertical: 8,
        minHeight: 48,
    },
    buttonText: {
        backgroundColor: "transparent",
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
        alignItems: "center",
        justifyContent: "center",
        marginVertical: 8,
        minHeight: 48,
    },
    buttonDisabled: {
        backgroundColor: theme.disabled,
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
        alignItems: "center",
        justifyContent: "center",
        marginVertical: 8,
        minHeight: 48,
    },
    buttonTextPrimary: {
        color: theme.onPrimary,
        fontSize: 16,
        fontWeight: "600",
    },
    buttonTextSecondary: {
        color: theme.onSecondary,
        fontSize: 16,
        fontWeight: "600",
    },
    buttonTextOutlined: {
        color: theme.primary,
        fontSize: 16,
        fontWeight: "600",
    },
    buttonTextDisabled: {
        color: theme.onSurfaceVariant,
        fontSize: 16,
        fontWeight: "600",
    },
    
    // Input styles
    input: {
        borderWidth: 1,
        borderColor: theme.outline,
        borderRadius: 8,
        padding: 12,
        marginBottom: 16,
        color: theme.onSurface,
        backgroundColor: theme.surface,
        fontSize: 16,
        minHeight: 48,
    },
    inputFocused: {
        borderColor: theme.primary,
        borderWidth: 2,
    },
    inputError: {
        borderColor: theme.error,
        borderWidth: 2,
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: "500",
        color: theme.onSurface,
        marginBottom: 4,
    },
    inputHelper: {
        fontSize: 12,
        color: theme.onSurfaceVariant,
        marginTop: 4,
        marginLeft: 4,
    },
    
    // Card styles
    card: {
        backgroundColor: theme.surface,
        borderRadius: 12,
        padding: 16,
        marginVertical: 8,
        borderWidth: 1,
        borderColor: theme.outlineVariant,
    },
    cardElevated: {
        backgroundColor: theme.surface,
        borderRadius: 12,
        padding: 16,
        marginVertical: 8,
        shadowColor: theme.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    cardHeader: {
        marginBottom: 12,
    },
    cardContent: {
        marginBottom: 12,
    },
    cardActions: {
        flexDirection: "row",
        justifyContent: "flex-end",
        marginTop: 8,
    },
    
    // Modal styles
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalOverlay: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalContent: {
        backgroundColor: theme.surface,
        borderRadius: 16,
        padding: 24,
        margin: 20,
        maxWidth: "90%",
        maxHeight: "80%",
    },
    
    // List styles
    listItem: {
        backgroundColor: theme.surface,
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: theme.outlineVariant,
    },
    listItemPressed: {
        backgroundColor: theme.surfaceVariant,
    },
    listItemText: {
        fontSize: 16,
        color: theme.onSurface,
        fontWeight: "500",
    },
    listItemSubtext: {
        fontSize: 14,
        color: theme.onSurfaceVariant,
        marginTop: 2,
    },
    
    // Navigation styles
    tabBar: {
        backgroundColor: theme.surface,
        borderTopWidth: 1,
        borderTopColor: theme.outlineVariant,
        paddingBottom: 8,
    },
    tabItem: {
        flex: 1,
        alignItems: "center",
        paddingVertical: 8,
    },
    tabItemActive: {
        flex: 1,
        alignItems: "center",
        paddingVertical: 8,
    },
    tabLabel: {
        fontSize: 12,
        color: theme.onSurfaceVariant,
        marginTop: 4,
    },
    tabLabelActive: {
        fontSize: 12,
        color: theme.primary,
        marginTop: 4,
        fontWeight: "600",
    },
    
    // Utility styles
    shadow: {
        shadowColor: theme.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    divider: {
        height: 1,
        backgroundColor: theme.outlineVariant,
        marginVertical: 8,
    },
    badge: {
        backgroundColor: theme.error,
        borderRadius: 12,
        paddingHorizontal: 8,
        paddingVertical: 4,
        minWidth: 24,
        alignItems: "center",
        justifyContent: "center",
    },
    badgeText: {
        color: theme.onError,
        fontSize: 12,
        fontWeight: "600",
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: theme.primaryContainer,
        alignItems: "center",
        justifyContent: "center",
    },
    chip: {
        backgroundColor: theme.surfaceVariant,
        borderRadius: 16,
        paddingHorizontal: 12,
        paddingVertical: 6,
        alignItems: "center",
        justifyContent: "center",
    },
    chipText: {
        color: theme.onSurfaceVariant,
        fontSize: 14,
        fontWeight: "500",
    },
});

export function useStyle() {
    const { theme } = useTheme();

    // Map theme to comprehensive colors
    const themeColors: ThemeColors = {
        background: theme.background,
        surface: theme.surface,
        surfaceVariant: theme.surfaceVariant,
        primary: theme.primary,
        primaryContainer: theme.primaryContainer,
        secondary: theme.secondary,
        secondaryContainer: theme.secondaryContainer,
        tertiary: theme.tertiary,
        error: theme.error,
        errorContainer: theme.errorContainer,
        onBackground: theme.onBackground,
        onSurface: theme.onSurface,
        onSurfaceVariant: theme.onSurfaceVariant,
        onPrimary: theme.onPrimary,
        onPrimaryContainer: theme.onPrimaryContainer,
        onSecondary: theme.onSecondary,
        onSecondaryContainer: theme.onSecondaryContainer,
        onError: theme.onError,
        outline: theme.outline,
        outlineVariant: theme.outlineVariant,
        shadow: theme.shadow,
        disabled: theme.disabled,
        placeholder: theme.placeholder,
        accent: theme.accent,
        text: theme.text,
        textSecondary: theme.textSecondary,
    };

    return StyleSheet.create(styles(themeColors));
}
