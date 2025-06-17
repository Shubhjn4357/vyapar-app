import React from "react";
import { KeyboardAvoidingView, Platform, StyleSheet, Animated } from "react-native";
import { Text, TextInput, Button, useTheme } from "react-native-paper";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/src/contexts/AuthContext";
import { AuthStackParamList } from "@/src/types/navigation";
import { SocialAuth } from "../../components/auth/SocialAuth";
import { ThemeSwitch } from "@/src/components/ThemeSwitch";
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
const loginSchema = z.object({
    mobile: z.string().min(10, "Mobile is required"),
    password: z.string().min(6, "Password is required"),
});

type LoginForm = z.infer<typeof loginSchema>;
type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

export default function LoginScreen({ navigation }: Props) {
    const { colors } = useTheme();
    const { login, isLoading, error, clearError, loginAsGuest } = useAuth();
    const [socialVisible, setSocialVisible] = React.useState(false);
    const fadeAnim = React.useRef(new Animated.Value(0)).current;
    const [showPass,setShowPass] = React.useState(false);
    const { control, handleSubmit, formState: { errors }, getValues } = useForm<LoginForm>({
        resolver: zodResolver(loginSchema),
        defaultValues: { mobile: "", password: "" }
    });

    React.useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
        }).start();
        return clearError;
    }, []);

    const onSubmit = async (data: LoginForm) => {
        try {
            // Call the login API directly
            const { loginApi } = await import('../../api/auth');
            const response = await loginApi(data.mobile, data.password);
            await login(response.token, response.user);
        } catch (error) {
            console.error('Login failed:', error);
            // Error handling is done by the auth context
        }
    };
    return (
        <KeyboardAvoidingView
            style={{ flex: 1, backgroundColor: colors.background }}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
            <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
                <ThemeSwitch />
                <Text style={styles.title}>Login</Text>
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
                    Login
                </Button>
                <Button
                    mode="text"
                    onPress={() => navigation.navigate("Register")}
                    style={styles.link}
                >
                    Don't have an account? Register
                </Button>
                <Button
                    mode="text"
                    onPress={() => navigation.navigate({
                        name: "ForgotPassword", params: {
                            mobile: getValues('mobile')
                        }
                    })}
                    style={styles.link}
                >
                    Forgot Password?
                </Button>
                <Button
                    mode="outlined"
                    icon="account"
                    onPress={() => setSocialVisible(true)}
                    style={styles.socialButton}
                    loading={isLoading}
                >
                    Social Login
                </Button>
                <Button
                    mode="outlined"
                    icon="account-question"
                    onPress={loginAsGuest}
                    style={styles.socialButton}
                    loading={isLoading}
                >
                    Login as Guest
                </Button>
                <SocialAuth
                    visible={socialVisible}
                    onDismiss={() => setSocialVisible(false)}
                />
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
    socialButton: {
        marginTop: 12,
    },
});
