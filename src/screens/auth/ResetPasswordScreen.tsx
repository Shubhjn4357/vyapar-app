import React from "react";
import { KeyboardAvoidingView, Platform, StyleSheet, Animated } from "react-native";
import { Text, TextInput, Button, useTheme } from "react-native-paper";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AuthStackParamList } from "@/src/types/navigation";
import { useAuth } from "@/src/contexts/AuthContext";

const resetSchema = z.object({
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Confirm your password"),
}).refine(data => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});

type ResetForm = z.infer<typeof resetSchema>;
type Props = NativeStackScreenProps<AuthStackParamList, 'ResetPassword'>;

export default function ResetPasswordScreen({ navigation, route }: Props) {
    const { colors } = useTheme();
    const fadeAnim = React.useRef(new Animated.Value(0)).current;
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);
    const { resetPassword } = useAuth()
    const { control, handleSubmit, formState: { errors } } = useForm<ResetForm>({
        resolver: zodResolver(resetSchema),
        defaultValues: { password: "", confirmPassword: "" }
    });

    React.useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
        }).start();
    }, []);

    const onSubmit = async (data: ResetForm) => {
        setLoading(true);
        setError(null);
        try {
            await resetPassword(route.params.mobile, route.params.token, data.password);
            navigation.navigate("Login");
        } catch (err: any) {
            setError(err?.message || "Failed to reset password");
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1, backgroundColor: colors.background }}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
            <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
                <Text style={styles.title}>Set New Password</Text>
                <Controller
                    control={control}
                    name="password"
                    render={({ field: { onChange, value } }) => (
                        <TextInput
                            label="New Password"
                            value={value}
                            onChangeText={onChange}
                            error={!!errors.password}
                            style={styles.input}
                            mode="outlined"
                            secureTextEntry
                        />
                    )}
                />
                {errors.password && <Text style={styles.error}>{errors.password.message}</Text>}
                <Controller
                    control={control}
                    name="confirmPassword"
                    render={({ field: { onChange, value } }) => (
                        <TextInput
                            label="Confirm Password"
                            value={value}
                            onChangeText={onChange}
                            error={!!errors.confirmPassword}
                            style={styles.input}
                            mode="outlined"
                            secureTextEntry
                        />
                    )}
                />
                {errors.confirmPassword && <Text style={styles.error}>{errors.confirmPassword.message}</Text>}
                {error && <Text style={styles.error}>{error}</Text>}
                <Button
                    mode="contained"
                    onPress={handleSubmit(onSubmit)}
                    loading={loading}
                    style={styles.button}
                    contentStyle={{ paddingVertical: 8 }}
                >
                    Set Password
                </Button>
            </Animated.View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        padding: 24,
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        marginBottom: 24,
        alignSelf: "center",
    },
    input: {
        marginBottom: 12,
    },
    button: {
        marginTop: 16,
        borderRadius: 8,
    },
    error: {
        color: "#d32f2f",
        marginBottom: 8,
        marginLeft: 4,
    },
});
