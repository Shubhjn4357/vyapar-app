import React from "react";
import { View, Text, Button, TextInput, StyleSheet } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { useAuth } from "@/src/contexts/AuthContext";
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from "@/src/types/navigation";


type Props = NativeStackScreenProps<AuthStackParamList, 'ForgotPassword'>;

export default function ForgotPasswordScreen({ navigation, route }: Props) {
    const { forgotPassword, isLoading, error, clearError } = useAuth();
    const { control, handleSubmit, formState: { errors } } = useForm<{ mobile: string }>({
        defaultValues: { mobile: route.params.mobile || "" }
    });

    React.useEffect(() => clearError, []);

    const onSubmit = async (data: { mobile: string }) => {
        const response = await forgotPassword(data.mobile);
        navigation.navigate("OTPVerification", { mobile: data.mobile, otpId: response });
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Forgot Password</Text>
            <Controller
                control={control}
                name="mobile"
                render={({ field: { onChange, value } }) => (
                    <TextInput
                        placeholder="Mobile"
                        value={value}
                        onChangeText={onChange}
                        style={styles.input}
                        keyboardType="phone-pad"
                    />
                )}
            />
            {errors.mobile && <Text style={styles.error}>{errors.mobile.message}</Text>}
            {error && <Text style={styles.error}>{error}</Text>}
            <Button title="Send OTP" onPress={handleSubmit(onSubmit)} disabled={isLoading} />
            <Button title="Go to Login" onPress={() => navigation.navigate("Login")} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 24 },
    title: { fontSize: 22, fontWeight: "bold", marginBottom: 16 },
    input: { borderWidth: 1, borderColor: "#ccc", padding: 8, marginBottom: 12, width: "100%" },
    error: { color: "#d32f2f", marginBottom: 8 },
});
