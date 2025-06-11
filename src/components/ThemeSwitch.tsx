import React from "react";
import { View, StyleSheet } from "react-native";
import { Switch, Text } from "react-native-paper";
import { useTheme } from "../contexts/ThemeContext";

export const ThemeSwitch: React.FC = () => {
    const { mode, setMode } = useTheme();

    return (
        <View style={styles.row}>
            <Text style={styles.label}>{mode === "dark" ? "Dark Mode" : "Light Mode"}</Text>
            <Switch
                value={mode === "dark"}
                onValueChange={v => setMode(v ? "dark" : "light")}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    row: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-end",
        padding: 8,
    },
    label: {
        marginRight: 8,
        fontSize: 16,
    },
});
