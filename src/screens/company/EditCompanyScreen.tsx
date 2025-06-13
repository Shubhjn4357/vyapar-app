import React, { useEffect, useState } from "react";
import { Animated, View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Alert } from "react-native";
import type { NativeStackScreenProps} from '@react-navigation/native-stack';
import { RootStackParamList } from "../../types/navigation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useStyle } from "../../hooks/useStyle";
import { useTheme } from "../../contexts/ThemeContext";
import { useCompany } from "../../contexts/CompanyContext";
import { useAuth } from "../../contexts/AuthContext";
import { getCompanyById } from "../../api/company";
import Loader from "../../components/Loader";
type Props = NativeStackScreenProps<RootStackParamList,'EditCompany'>

const CompanySchema = z.object({
    name: z.string().min(3, "Company name must be at least 3 characters"),
    gstin: z.string().min(15, "GSTIN must be 15 characters").max(15, "GSTIN must be 15 characters"),
    address: z.string().optional()
});

type CompanyForm = z.infer<typeof CompanySchema>

export default function EditCompanyScreen({ navigation, route }: Props) {
    const { companyId } = route.params;
    const styles = useStyle();
    const { theme } = useTheme();
    const { token } = useAuth();
    const { updateExistingCompany, isLoading, error } = useCompany();
    const [loadingCompany, setLoadingCompany] = useState(true);
    const fadeAnim = React.useRef(new Animated.Value(0)).current;
    
    const { control, handleSubmit, formState: { errors }, setValue } = useForm<CompanyForm>({
        resolver: zodResolver(CompanySchema),
        defaultValues: { name: '', gstin: '', address: '' }
    });

    const onSubmit = async (data: CompanyForm) => {
        try {
            const company = await updateExistingCompany(companyId, data);
            Alert.alert("Success", `Company "${company.name}" updated successfully!`);
            navigation.goBack();
        } catch (error: any) {
            Alert.alert("Error", error.message || "Failed to update company. Please try again.");
        }
    };

    useEffect(() => {
        async function fetchCompany() {
            try {
                if (!token) return;
                const company = await getCompanyById(companyId, token);
                setValue('name', company.name);
                setValue('gstin', company.gstin);
                setValue('address', company.address || '');
            } catch (error) {
                Alert.alert("Error", "Failed to load company details");
                navigation.goBack();
            } finally {
                setLoadingCompany(false);
            }
        }
        fetchCompany();
    }, [companyId, token, setValue, navigation]);
    React.useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
        }).start();
    }, []);

    if (loadingCompany) {
        return <Loader />;
    }

    return (
        <KeyboardAvoidingView
            style={[styles.safeContainer, { backgroundColor: theme.background }]}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
            <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
                <Text style={styles.header}>Edit Company</Text>
                <Text style={styles.body}>
                    Update your company details
                </Text>

                <View style={{ marginTop: 24 }}>
                    <Text style={styles.inputLabel}>Company Name *</Text>
                    <Controller
                        control={control}
                        name="name"
                        render={({ field: { onChange, value } }) => (
                            <TextInput
                                style={[styles.input, errors.name && styles.inputError]}
                                placeholder="Enter company name"
                                placeholderTextColor={theme.placeholder}
                                value={value}
                                onChangeText={onChange}
                                autoCapitalize="words"
                                returnKeyType="next"
                            />
                        )}
                    />
                    {errors.name && <Text style={styles.error}>{errors.name.message}</Text>}

                    <Text style={styles.inputLabel}>GSTIN *</Text>
                    <Controller
                        control={control}
                        name="gstin"
                        render={({ field: { onChange, value } }) => (
                            <TextInput
                                style={[styles.input, errors.gstin && styles.inputError]}
                                placeholder="Enter 15-digit GSTIN"
                                placeholderTextColor={theme.placeholder}
                                value={value}
                                onChangeText={onChange}
                                autoCapitalize="characters"
                                maxLength={15}
                                returnKeyType="next"
                            />
                        )}
                    />
                    {errors.gstin && <Text style={styles.error}>{errors.gstin.message}</Text>}

                    <Text style={styles.inputLabel}>Address</Text>
                    <Controller
                        control={control}
                        name="address"
                        render={({ field: { onChange, value } }) => (
                            <TextInput
                                style={[styles.input, { minHeight: 80 }]}
                                placeholder="Enter company address (optional)"
                                placeholderTextColor={theme.placeholder}
                                value={value}
                                onChangeText={onChange}
                                multiline
                                numberOfLines={3}
                                returnKeyType="done"
                            />
                        )}
                    />
                    {errors.address && <Text style={styles.error}>{errors.address.message}</Text>}

                    {error && (
                        <View style={[styles.card, { backgroundColor: theme.errorContainer }]}>
                            <Text style={[styles.body, { color: theme.onErrorContainer }]}>
                                {error}
                            </Text>
                        </View>
                    )}

                    <TouchableOpacity
                        style={[styles.button, isLoading && styles.buttonDisabled]}
                        onPress={handleSubmit(onSubmit)}
                        disabled={isLoading}
                    >
                        <Text style={styles.buttonTextPrimary}>
                            {isLoading ? "Updating..." : "Update Company"}
                        </Text>
                    </TouchableOpacity>
                </View>
            </Animated.View>
        </KeyboardAvoidingView>
    );
}
