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
import { requestOTP } from "../../api/auth";
import { ForgotPasswordScreenProps } from "../../types/navigation";
import { useStyle } from "../../hooks/useStyle";
import { useTheme } from "../../contexts/ThemeContext";
import { useOffline } from "../../contexts/OfflineContext";
import { NavigationHelpers } from "../../services/NavigationService";
import Loader from "../../components/Loader";

const forgotPasswordSchema = z.object({
    mobile: z.string()
        .min(10, "Mobile number must be at least 10 digits")
        .max(15, "Mobile number must be at most 15 digits")
        .regex(/^\d+$/, "Mobile number must contain only digits"),
});

type ForgotPasswordForm = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordScreen({ navigation, route }: ForgotPasswordScreenProps) {
    const { mobile } = route.params || {};
    const styles = useStyle();
    const { theme } = useTheme();
    const { isOnline } = useOffline();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const fadeAnim = useRef(new Animated.Value(0)).current;

    const { control, handleSubmit, formState: { errors } } = useForm<ForgotPasswordForm>({
        resolver: zodResolver(forgotPasswordSchema),
        defaultValues: { mobile: mobile || "" }
    });

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
        }).start();
    }, []);

    const onSubmit = async (data: ForgotPasswordForm) => {
        if (!isOnline) {
            Alert.alert("No Internet", "Please check your internet connection and try again.");
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const response = await requestOTP(data.mobile);
            
            if (response.status === 'success') {
                NavigationHelpers.navigateToOTP({
                    mobile: data.mobile,
                    otpId: response.data.otpId,
                    type: 'forgot_password'
                });
            } else {
                setError(response.message || "Failed to send OTP");
            }
        } catch (error: any) {
            setError(error.message || "Failed to send OTP. Please try again.");
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
                <Text style={styles.header}>Forgot Password</Text>
                <Text style={styles.body}>
                    Enter your mobile number to receive an OTP for password reset
                </Text>
                
                {!isOnline && (
                    <View style={[styles.card, { backgroundColor: theme.warningContainer }]}>
                        <Text style={[styles.body, { color: theme.onWarningContainer }]}>
                            You're offline. Please connect to the internet to send OTP.
                        </Text>
                    </View>
                )}

                <View style={{ marginTop: 24 }}>
                    <Text style={styles.inputLabel}>Mobile Number *</Text>
                    <Controller
                        control={control}
                        name="mobile"
                        render={({ field: { onChange, value } }) => (
                            <TextInput
                                style={[styles.input, errors.mobile && styles.inputError]}
                                placeholder="Enter your mobile number"
                                placeholderTextColor={theme.placeholder}
                                value={value}
                                onChangeText={onChange}
                                keyboardType="phone-pad"
                                maxLength={15}
                                autoFocus
                                returnKeyType="done"
                                onSubmitEditing={handleSubmit(onSubmit)}
                            />
                        )}
                    />
                    {errors.mobile && <Text style={styles.error}>{errors.mobile.message}</Text>}

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
                            {isLoading ? "Sending OTP..." : "Send OTP"}
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
