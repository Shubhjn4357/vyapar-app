import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "../../contexts/AuthContext";
import { useStyle } from "../../hooks/useStyle";
import { useTheme } from "../../contexts/ThemeContext";
import Loader from "../../components/Loader";

const profileSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
});

type ProfileForm = z.infer<typeof profileSchema>;

export default function CompleteProfileScreen() {
    const { completeProfile, isLoading, error, user } = useAuth();
    const styles = useStyle();
    const { theme } = useTheme();
    const [focusedField, setFocusedField] = useState<string | null>(null);

    const { control, handleSubmit, formState: { errors } } = useForm<ProfileForm>({
        resolver: zodResolver(profileSchema),
        defaultValues: { 
            name: user?.name || "", 
            email: user?.email || "" 
        }
    });

    const onSubmit = async (data: ProfileForm) => {
        try {
            await completeProfile(data);
            Alert.alert("Success", "Profile completed successfully!");
        } catch (error: any) {
            Alert.alert("Error", error.message || "Failed to complete profile");
        }
    };

    if (isLoading) {
        return <Loader />;
    }

    return (
        <ScrollView style={styles.safeContainer}>
            <View style={styles.container}>
                <View style={styles.centerContainer}>
                    <Text style={styles.header}>Complete Your Profile</Text>
                    <Text style={styles.body}>
                        Please provide your details to continue using the app
                    </Text>
                </View>

                <View style={{ marginTop: 32 }}>
                    <Text style={styles.inputLabel}>Full Name *</Text>
                    <Controller
                        control={control}
                        name="name"
                        render={({ field: { onChange, value } }) => (
                            <TextInput
                                style={[
                                    styles.input,
                                    focusedField === 'name' && styles.inputFocused,
                                    errors.name && styles.inputError
                                ]}
                                placeholder="Enter your full name"
                                placeholderTextColor={theme.placeholder}
                                value={value}
                                onChangeText={onChange}
                                onFocus={() => setFocusedField('name')}
                                onBlur={() => setFocusedField(null)}
                                autoCapitalize="words"
                                returnKeyType="next"
                            />
                        )}
                    />
                    {errors.name && (
                        <Text style={styles.error}>{errors.name.message}</Text>
                    )}

                    <Text style={styles.inputLabel}>Email Address *</Text>
                    <Controller
                        control={control}
                        name="email"
                        render={({ field: { onChange, value } }) => (
                            <TextInput
                                style={[
                                    styles.input,
                                    focusedField === 'email' && styles.inputFocused,
                                    errors.email && styles.inputError
                                ]}
                                placeholder="Enter your email address"
                                placeholderTextColor={theme.placeholder}
                                value={value}
                                onChangeText={onChange}
                                onFocus={() => setFocusedField('email')}
                                onBlur={() => setFocusedField(null)}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                autoCorrect={false}
                                returnKeyType="done"
                            />
                        )}
                    />
                    {errors.email && (
                        <Text style={styles.error}>{errors.email.message}</Text>
                    )}

                    {error && (
                        <View style={[styles.card, { backgroundColor: theme.errorContainer }]}>
                            <Text style={[styles.body, { color: theme.onErrorContainer }]}>
                                {error}
                            </Text>
                        </View>
                    )}

                    <TouchableOpacity
                        style={[
                            styles.button,
                            isLoading && styles.buttonDisabled
                        ]}
                        onPress={handleSubmit(onSubmit)}
                        disabled={isLoading}
                    >
                        <Text style={styles.buttonTextPrimary}>
                            {isLoading ? "Saving..." : "Save & Continue"}
                        </Text>
                    </TouchableOpacity>

                    <Text style={[styles.caption, { textAlign: 'center', marginTop: 16 }]}>
                        This information helps us personalize your experience
                    </Text>
                </View>
            </View>
        </ScrollView>
    );
}
