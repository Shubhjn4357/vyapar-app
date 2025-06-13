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
import { requestOTP, verifyOTP } from '../../api/auth';
import { OTPVerificationScreenProps } from "../../types/navigation";
import { useAuth } from "../../contexts/AuthContext";
import { useStyle } from "../../hooks/useStyle";
import { useTheme } from "../../contexts/ThemeContext";
import { useOffline } from "../../contexts/OfflineContext";
import { NavigationHelpers } from "../../services/NavigationService";
import Loader from "../../components/Loader";

const otpSchema = z.object({
    otp: z.string().length(6, "OTP must be 6 digits"),
});

type OTPForm = z.infer<typeof otpSchema>;

export default function OTPVerificationScreen({ navigation, route }: OTPVerificationScreenProps) {
    const { mobile, otpId, type, userId } = route.params;
    const styles = useStyle();
    const { theme } = useTheme();
    const { token, login, completeRegistration } = useAuth();
    const { isOnline } = useOffline();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [resendCooldown, setResendCooldown] = useState(0);
    const fadeAnim = useRef(new Animated.Value(0)).current;

    const { control, handleSubmit, formState: { errors }, reset } = useForm<OTPForm>({
        resolver: zodResolver(otpSchema),
        defaultValues: { otp: "" }
    });

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
        }).start();
    }, []);

    useEffect(() => {
        if (resendCooldown > 0) {
            const timer = setTimeout(() => {
                setResendCooldown(resendCooldown - 1);
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [resendCooldown]);

    const onSubmit = async (data: OTPForm) => {
        if (!isOnline) {
            Alert.alert("No Internet", "Please check your internet connection and try again.");
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const response = await verifyOTP(mobile, data.otp, otpId);
            
            if (response.status === 'success') {
                switch (type) {
                    case 'register':
                        if (userId) {
                            // Complete registration flow
                            await completeRegistration(response.data.token, response.data.user);
                            NavigationHelpers.navigateToCompleteProfile({ 
                                userId, 
                                fromAuth: true 
                            });
                        } else {
                            Alert.alert("Error", "Registration incomplete. Please try again.");
                            NavigationHelpers.navigateToRegister();
                        }
                        break;
                        
                    case 'login':
                        // Complete login flow
                        await login(response.data.token, response.data.user);
                        if (response.data.user.isProfileComplete) {
                            NavigationHelpers.navigateToCompanyList();
                        } else {
                            NavigationHelpers.navigateToCompleteProfile({ 
                                userId: response.data.user.id, 
                                fromAuth: true 
                            });
                        }
                        break;
                        
                    case 'forgot_password':
                        // Navigate to reset password
                        NavigationHelpers.navigateToResetPassword({
                            token: response.data.resetToken || '',
                            mobile,
                            otpId
                        });
                        break;
                        
                    default:
                        Alert.alert("Error", "Invalid verification type");
                        NavigationHelpers.navigateToLogin();
                }
            } else {
                setError(response.message || "OTP verification failed");
            }
        } catch (error: any) {
            setError(error.message || "Failed to verify OTP. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleResend = async () => {
        if (!isOnline) {
            Alert.alert("No Internet", "Please check your internet connection and try again.");
            return;
        }

        if (resendCooldown > 0) {
            return;
        }

        try {
            setIsLoading(true);
            const response = await requestOTP(mobile);
            
            if (response.status === 'success') {
                Alert.alert("Success", "OTP has been resent to your mobile number");
                setResendCooldown(60); // 60 seconds cooldown
                reset(); // Clear the OTP input
            } else {
                Alert.alert("Error", response.message || "Failed to resend OTP");
            }
        } catch (error: any) {
            Alert.alert("Error", error.message || "Failed to resend OTP. Please try again.");
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
                <Text style={styles.header}>Verify OTP</Text>
                <Text style={styles.body}>
                    Enter the 6-digit code sent to {mobile}
                </Text>
                
                {!isOnline && (
                    <View style={[styles.card, { backgroundColor: theme.warningContainer }]}>
                        <Text style={[styles.body, { color: theme.onWarningContainer }]}>
                            You're offline. Please connect to the internet to verify OTP.
                        </Text>
                    </View>
                )}

                <View style={{ marginTop: 24 }}>
                    <Text style={styles.inputLabel}>OTP Code *</Text>
                    <Controller
                        control={control}
                        name="otp"
                        render={({ field: { onChange, value } }) => (
                            <TextInput
                                style={[styles.input, errors.otp && styles.inputError]}
                                placeholder="Enter 6-digit OTP"
                                placeholderTextColor={theme.placeholder}
                                value={value}
                                onChangeText={onChange}
                                keyboardType="number-pad"
                                maxLength={6}
                                autoFocus
                                returnKeyType="done"
                                onSubmitEditing={handleSubmit(onSubmit)}
                            />
                        )}
                    />
                    {errors.otp && <Text style={styles.error}>{errors.otp.message}</Text>}

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
                            {isLoading ? "Verifying..." : "Verify OTP"}
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.buttonSecondary, { marginTop: 16 }]}
                        onPress={handleResend}
                        disabled={!isOnline || isLoading || resendCooldown > 0}
                    >
                        <Text style={[styles.buttonTextSecondary, 
                            (!isOnline || isLoading || resendCooldown > 0) && { opacity: 0.5 }
                        ]}>
                            {resendCooldown > 0 
                                ? `Resend OTP in ${resendCooldown}s` 
                                : "Resend OTP"
                            }
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.buttonSecondary, { marginTop: 16 }]}
                        onPress={() => navigation.goBack()}
                    >
                        <Text style={styles.buttonTextSecondary}>
                            Change Mobile Number
                        </Text>
                    </TouchableOpacity>
                </View>
            </Animated.View>
        </KeyboardAvoidingView>
    );
}
