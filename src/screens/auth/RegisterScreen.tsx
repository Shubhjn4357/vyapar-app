import React from "react";
import { KeyboardAvoidingView, Platform, StyleSheet, Animated } from "react-native";
import { Text, TextInput, Button, useTheme } from "react-native-paper";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/src/contexts/AuthContext";
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from "@/src/types/navigation";
import { requestOTP } from "@/src/api/auth";
const registerSchema = z.object({
    name: z.string().min(2, "Name is required"),
    mobile: z.string().min(10, "Mobile is required"),
    email: z.string().email("Invalid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

type RegisterForm = z.infer<typeof registerSchema>;
type props = NativeStackScreenProps<AuthStackParamList, 'Register'>;
export default function RegisterScreen({ navigation }: props) {
    const { colors } = useTheme();
    const { register, isLoading, error, clearError } = useAuth();
    const fadeAnim = React.useRef(new Animated.Value(0)).current;
    const [showPass,setShowPass] = React.useState(false);
    const { control, handleSubmit, formState: { errors } } = useForm<RegisterForm>({
        resolver: zodResolver(registerSchema),
        defaultValues: { name: "", mobile: "", email: "", password: "" }
    });

    React.useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
        }).start();
        return clearError;
    }, []);

    const onSubmit = async (data: RegisterForm) => {
        try {
            await register(data);
            const response = await requestOTP(data.mobile);
            if (!response) {
                throw new Error("Failed to send OTP. Please try again.");
            }
            navigation.navigate("OTPVerification", { 
                mobile: data.mobile, 
                otpId: response.data.otpId,
                type: 'register'
            });
        } catch (error) {
            console.log(error);
            alert("Registration failed. Please try again.");
        }
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1, backgroundColor: colors.background }}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
            <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
                <Text style={styles.title}>Create Account</Text>
                <Controller
                    control={control}
                    name="name"
                    render={({ field: { onChange, value } }) => (
                        <TextInput
                            label="Full Name"
                            value={value}
                            onChangeText={onChange}
                            error={!!errors.name}
                            style={styles.input}
                            mode="outlined"
                        />
                    )}
                />
                {errors.name && <Text style={styles.error}>{errors.name.message}</Text>}

                <Controller
                    control={control}
                    name="mobile"
                    render={({ field: { onChange, value } }) => (
                        <TextInput
                            label="Mobile"
                            value={value}
                            onChangeText={onChange}
                            error={!!errors.mobile}
                            style={styles.input}
                            mode="outlined"
                            keyboardType="phone-pad"
                        />
                    )}
                />
                {errors.mobile && <Text style={styles.error}>{errors.mobile.message}</Text>}

                <Controller
                    control={control}
                    name="email"
                    render={({ field: { onChange, value } }) => (
                        <TextInput
                            label="Email"
                            value={value}
                            onChangeText={onChange}
                            error={!!errors.email}
                            style={styles.input}
                            mode="outlined"
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                    )}
                />
                {errors.email && <Text style={styles.error}>{errors.email.message}</Text>}

                <Controller
                    control={control}
                    name="password"
                    render={({ field: { onChange, value } }) => (
                        <TextInput
                            label="Password"
                            value={value}
                            onChangeText={onChange}
                            error={!!errors.password}
                            style={styles.input}
                            mode="outlined"
                            right={<TextInput.Icon icon='eye' onPress={()=>setShowPass(!showPass)}/>}
                            secureTextEntry={!showPass}
                        />
                    )}
                />
                {errors.password && <Text style={styles.error}>{errors.password.message}</Text>}

                {error && <Text style={styles.error}>{error}</Text>}

                <Button
                    mode="contained"
                    onPress={handleSubmit(onSubmit)}
                    loading={isLoading}
                    style={styles.button}
                    contentStyle={{ paddingVertical: 8 }}
                >
                    Register
                </Button>
                <Button
                    mode="text"
                    onPress={() => navigation.navigate("Login")}
                    style={styles.link}
                >
                    Already have an account? Login
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
