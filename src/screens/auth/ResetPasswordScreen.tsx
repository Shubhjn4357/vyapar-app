import React, { useState, useEffect, useRef } from "react";
import { 
    View, 
    Text, 
    TextInput, 
    TouchableOpacity, 
    KeyboardAvoidingView, 
    Platform, 
    Animated,
    Alert 
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { resetPassword } from "../../api/auth";
import { ResetPasswordScreenProps } from "../../types/navigation";
import { useStyle } from "../../hooks/useStyle";
import { useTheme } from "../../contexts/ThemeContext";
import { useOffline } from "../../contexts/OfflineContext";
import { NavigationHelpers } from "../../services/NavigationService";
import Loader from "../../components/Loader";

const resetPasswordSchema = z.object({
    password: z.string()
        .min(8, "Password must be at least 8 characters")
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "Password must contain at least one uppercase letter, one lowercase letter, and one number"),
    confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});

type ResetPasswordForm = z.infer<typeof resetPasswordSchema>;

export default function ResetPasswordScreen({ navigation, route }: ResetPasswordScreenProps) {
    const { token, mobile, otpId } = route.params;
    const styles = useStyle();
    const { theme } = useTheme();
    const { isOnline } = useOffline();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const fadeAnim = useRef(new Animated.Value(0)).current;

    const { control, handleSubmit, formState: { errors }, watch } = useForm<ResetPasswordForm>({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: { password: "", confirmPassword: "" }
    });

    const password = watch("password");

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
        }).start();
    }, []);

    const onSubmit = async (data: ResetPasswordForm) => {
        if (!isOnline) {
            Alert.alert("No Internet", "Please check your internet connection and try again.");
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const response = await resetPassword(mobile, token, data.password, otpId);
            
            if (response.status === 'success') {
                Alert.alert(
                    "Success", 
                    "Your password has been reset successfully. Please login with your new password.",
                    [
                        {
                            text: "OK",
                            onPress: () => NavigationHelpers.navigateToLogin()
                        }
                    ]
                );
            } else {
                setError(response.message || "Failed to reset password");
            }
        } catch (error: any) {
            setError(error.message || "Failed to reset password. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return <Loader />;
    }

    return (
        <KeyboardAvoidingView
            style={[styles.safeContainer, { backgroundColor: theme.background }]}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
            <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
                <Text style={styles.header}>Set New Password</Text>
                <Text style={styles.body}>
                    Create a strong password for your account
                </Text>
                
                {!isOnline && (
                    <View style={[styles.card, { backgroundColor: theme.warningContainer }]}>
                        <Text style={[styles.body, { color: theme.onWarningContainer }]}>
                            You're offline. Please connect to the internet to reset password.
                        </Text>
                    </View>
                )}

                <View style={{ marginTop: 24 }}>
                    <Text style={styles.inputLabel}>New Password *</Text>
                    <View style={{ position: 'relative' }}>
                        <Controller
                            control={control}
                            name="password"
                            render={({ field: { onChange, value } }) => (
                                <TextInput
                                    style={[styles.input, errors.password && styles.inputError]}
                                    placeholder="Enter new password"
                                    placeholderTextColor={theme.placeholder}
                                    value={value}
                                    onChangeText={onChange}
                                    secureTextEntry={!showPassword}
                                    autoCapitalize="none"
                                    returnKeyType="next"
                                />
                            )}
                        />
                        <TouchableOpacity
                            style={styles.eyeIcon}
                            onPress={() => setShowPassword(!showPassword)}
                        >
                            <Text style={{ color: theme.primary }}>
                                {showPassword ? "Hide" : "Show"}
                            </Text>
                        </TouchableOpacity>
                    </View>
                    {errors.password && <Text style={styles.error}>{errors.password.message}</Text>}

                    <Text style={styles.inputLabel}>Confirm Password *</Text>
                    <View style={{ position: 'relative' }}>
                        <Controller
                            control={control}
                            name="confirmPassword"
                            render={({ field: { onChange, value } }) => (
                                <TextInput
                                    style={[styles.input, errors.confirmPassword && styles.inputError]}
                                    placeholder="Confirm new password"
                                    placeholderTextColor={theme.placeholder}
                                    value={value}
                                    onChangeText={onChange}
                                    secureTextEntry={!showConfirmPassword}
                                    autoCapitalize="none"
                                    returnKeyType="done"
                                    onSubmitEditing={handleSubmit(onSubmit)}
                                />
                            )}
                        />
                        <TouchableOpacity
                            style={styles.eyeIcon}
                            onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                            <Text style={{ color: theme.primary }}>
                                {showConfirmPassword ? "Hide" : "Show"}
                            </Text>
                        </TouchableOpacity>
                    </View>
                    {errors.confirmPassword && <Text style={styles.error}>{errors.confirmPassword.message}</Text>}

                    {/* Password strength indicator */}
                    {password && (
                        <View style={[styles.card, { backgroundColor: theme.surfaceVariant }]}>
                            <Text style={[styles.caption, { color: theme.onSurfaceVariant }]}>
                                Password Requirements:
                            </Text>
                            <Text style={[styles.caption, { 
                                color: password.length >= 8 ? theme.primary : theme.onSurfaceVariant 
                            }]}>
                                • At least 8 characters
                            </Text>
                            <Text style={[styles.caption, { 
                                color: /[A-Z]/.test(password) ? theme.primary : theme.onSurfaceVariant 
                            }]}>
                                • One uppercase letter
                            </Text>
                            <Text style={[styles.caption, { 
                                color: /[a-z]/.test(password) ? theme.primary : theme.onSurfaceVariant 
                            }]}>
                                • One lowercase letter
                            </Text>
                            <Text style={[styles.caption, { 
                                color: /\d/.test(password) ? theme.primary : theme.onSurfaceVariant 
                            }]}>
                                • One number
                            </Text>
                        </View>
                    )}

                    {error && (
                        <View style={[styles.card, { backgroundColor: theme.errorContainer }]}>
                            <Text style={[styles.body, { color: theme.onErrorContainer }]}>
                                {error}
                            </Text>
                        </View>
                    )}

                    <TouchableOpacity
                        style={[styles.button, (!isOnline || isLoading) && styles.buttonDisabled]}
                        onPress={handleSubmit(onSubmit)}
                        disabled={!isOnline || isLoading}
                    >
                        <Text style={styles.buttonTextPrimary}>
                            {isLoading ? "Setting Password..." : "Set New Password"}
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.buttonSecondary, { marginTop: 16 }]}
                        onPress={() => NavigationHelpers.navigateToLogin()}
                    >
                        <Text style={styles.buttonTextSecondary}>
                            Back to Login
                        </Text>
                    </TouchableOpacity>
                </View>
            </Animated.View>
        </KeyboardAvoidingView>
    );
}
