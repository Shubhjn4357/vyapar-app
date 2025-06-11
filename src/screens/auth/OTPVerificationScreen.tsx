import React from "react";
import { KeyboardAvoidingView, Platform, StyleSheet, Animated } from "react-native";
import { Text, TextInput, Button, useTheme } from "react-native-paper";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { requestOTP } from '../../api/auth';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from "@/src/types/navigation";
import { useAuth } from "@/src/contexts/AuthContext";

const otpSchema = z.object({
    mobile: z.string().min(10, "Mobile is required"),
    otp: z.string().length(6, "OTP must be 6 digits"),
});

type OTPForm = z.infer<typeof otpSchema>;
type props = NativeStackScreenProps<AuthStackParamList, 'OTPVerification'>;
export default function OTPVerificationScreen({ navigation, route }: props) {
    const { colors } = useTheme();
    const { verifyOtp, isLoading, error, clearError } = useAuth();
    const fadeAnim = React.useRef(new Animated.Value(0)).current;

    const { control, handleSubmit, formState: { errors }, setValue } = useForm<OTPForm>({
        resolver: zodResolver(otpSchema),
        defaultValues: { mobile: route.params?.mobile || "", otp: route.params?.otpId || "" }
    });

    React.useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
        }).start();
        return clearError;
    }, []);

    const onSubmit = async (data: OTPForm) => {
        await verifyOtp(data.mobile, data.otp);
        navigation.replace('Login')
    };

    const handleResend = async () => {
        const response = await requestOTP(route.params?.mobile);
        if (response) {
            alert("OTP resent successfully");
            setValue("otp", response.otpId); // Assuming the API returns the new OTP ID
        } else {
            alert("Failed to resend OTP");
        }
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1, backgroundColor: colors.background }}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
            <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
                <Text style={styles.title}>OTP Verification</Text>
                <Controller
                    control={control}
                    name="otp"
                    render={({ field: { onChange, value } }) => (
                        <TextInput
                            label="OTP"
                            value={value}
                            onChangeText={onChange}
                            error={!!errors.otp}
                            style={styles.input}
                            mode="outlined"
                            keyboardType="number-pad"
                            maxLength={6}
                        />
                    )}
                />
                {errors.otp && <Text style={styles.error}>{errors.otp.message}</Text>}
                {error && <Text style={styles.error}>{error}</Text>}

                <Button
                    mode="contained"
                    onPress={handleSubmit(onSubmit)}
                    loading={isLoading}
                    style={styles.button}
                    contentStyle={{ paddingVertical: 8 }}
                >
                    Verify OTP
                </Button>
                <Button
                    mode="text"
                    onPress={handleResend}
                    style={styles.link}
                    disabled={isLoading}
                >
                    Resend OTP
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
    link: {
        marginTop: 12,
        alignSelf: "center",
    },
    error: {
        color: "#d32f2f",
        marginBottom: 8,
        marginLeft: 4,
    },
});
