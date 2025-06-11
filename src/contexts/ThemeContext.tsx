import React, { createContext, useContext, useState, useMemo } from "react";
import { lightColors, darkColors } from "../theme/colors";

type ThemeMode = "light" | "dark";

const ThemeContext = createContext<{
    theme: typeof lightColors;
    mode: ThemeMode;
    setMode: (mode: ThemeMode) => void;
}>({
    theme: lightColors,
    mode: "light",
    setMode: () => { },
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [mode, setMode] = useState<ThemeMode>("light");

    const theme = useMemo(() => (mode === "dark" ? darkColors : lightColors), [mode]);

    return (
        <ThemeContext.Provider value={{ theme, mode, setMode }}>
            {children}
        </ThemeContext.Provider>
    );
};

export function useTheme() {
    return useContext(ThemeContext);
}
