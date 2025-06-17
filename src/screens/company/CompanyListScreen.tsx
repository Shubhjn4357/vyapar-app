import React, { useEffect } from "react";
import { FlatList, TouchableOpacity, View, Text, RefreshControl, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { Company } from "../../types/company";
import { RootStackParamList } from "../../types/navigation";
import { useCompany } from "../../contexts/CompanyContext";
import { useAuth } from "../../contexts/AuthContext";
import { useStyle } from "../../hooks/useStyle";
import { useTheme } from "../../contexts/ThemeContext";
import Loader from "../../components/Loader";

type Props = NativeStackScreenProps<RootStackParamList, 'CompanyList'>

export default function CompanyListScreen({ navigation }: Props) {
    const { companies, selectedCompany, isLoading, error, loadCompanies, selectContextCompany:selectCompany } = useCompany();
    const { user } = useAuth();
    const styles = useStyle();
    const { theme } = useTheme();
    useEffect(() => {
        loadCompanies();
    }, []);

    const handleSelectCompany = (company: Company) => {
        selectCompany(company);
        navigation.replace("Main", { screen: "Dashboard" });
    };

    const handleCreateCompany = () => {
        navigation.navigate("CreateCompany");
    };

    const handleEditCompany = (companyId: string) => {
        navigation.navigate("EditCompany", { companyId });
    };

    if (isLoading && companies.length === 0) {
        return <Loader />;
    }

    const renderCompanyItem = ({ item }: { item: Company }) => {
        const isSelected = selectedCompany?.id === item.id;
        
        return (
            <TouchableOpacity
                style={[
                    styles.card,
                    isSelected && { 
                        backgroundColor: theme.colors.primaryContainer,
                        borderColor: theme.colors.primary,
                        borderWidth: 2
                    }
                ]}
                onPress={() => handleSelectCompany(item)}
                activeOpacity={0.7}
            >
                <View style={styles.spaceBetween}>
                    <View style={{ flex: 1 }}>
                        <View style={styles.row}>
                            <View style={[
                                styles.avatar,
                                { backgroundColor: isSelected ? theme.colors.primary : theme.colors.surfaceVariant }
                            ]}>
                                <Ionicons 
                                    name="business" 
                                    size={20} 
                                    color={isSelected ? theme.colors.onPrimary : theme.colors.onSurfaceVariant} 
                                />
                            </View>
                            <View style={{ marginLeft: 12, flex: 1 }}>
                                <Text style={[
                                    styles.subtitle,
                                    isSelected && { color: theme.colors.onPrimaryContainer }
                                ]}>
                                    {item.name}
                                </Text>
                                <Text style={[
                                    styles.caption,
                                    isSelected && { color: theme.colors.onPrimaryContainer }
                                ]}>
                                    GSTIN: {item.gstin}
                                </Text>
                                {item.address && (
                                    <Text style={[
                                        styles.caption,
                                        isSelected && { color: theme.colors.onPrimaryContainer }
                                    ]}>
                                        {item.address}
                                    </Text>
                                )}
                            </View>
                        </View>
                    </View>
                    
                    <TouchableOpacity
                        style={[styles.buttonText, { padding: 8 }]}
                        onPress={() => handleEditCompany(item.id)}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                        <Ionicons 
                            name="pencil" 
                            size={20} 
                            color={theme.colors.primary} 
                        />
                    </TouchableOpacity>
                </View>
                
                {isSelected && (
                    <View style={[styles.chip, { marginTop: 8, alignSelf: 'flex-start' }]}>
                        <Text style={styles.chipText}>Selected</Text>
                    </View>
                )}
            </TouchableOpacity>
        );
    };

    const renderEmptyState = () => (
        <View style={styles.centerContainer}>
            <Ionicons name="business-outline" size={64} color={theme.colors.onSurfaceVariant} />
            <Text style={[styles.title, { textAlign: 'center', marginTop: 16 }]}>
                No Companies Found
            </Text>
            <Text style={[styles.body, { textAlign: 'center', marginBottom: 24 }]}>
                Create your first company to get started with managing your business
            </Text>
            <TouchableOpacity style={styles.button} onPress={handleCreateCompany}>
                <Text style={styles.buttonTextPrimary}>Create Company</Text>
            </TouchableOpacity>
        </View>
    );

    const renderHeader = () => (
        <View style={{ marginBottom: 16 }}>
            <Text style={styles.header}>Select Company</Text>
            <Text style={styles.body}>
                Choose a company to continue or create a new one
            </Text>
            
            {user?.subscription && (
                <View style={[styles.card, { backgroundColor: theme.colors.primaryContainer, marginTop: 16 }]}>
                    <View style={styles.row}>
                        <Ionicons name="diamond" size={20} color={theme.colors.onPrimaryContainer} />
                        <Text style={[styles.body, { color: theme.colors.onPrimaryContainer, marginLeft: 8 }]}>
                            {user?.subscription?.plan
    ? user.subscription.plan.charAt(0).toUpperCase() + user.subscription.plan.slice(1) + " Plan"
    : "Plan not set"}
                        </Text>
                    </View>
                    <Text style={[styles.caption, { color: theme.colors.onPrimaryContainer, marginTop: 4 }]}>
                        {companies.length} of {
                            user.subscription.plan === 'free' ? '1' :
                            user.subscription.plan === 'basic' ? '3' : '10'
                        } companies used
                    </Text>
                </View>
            )}
        </View>
    );

    return (
        <View style={styles.safeContainer}>
            <FlatList
                style={styles.container}
                data={companies}
                keyExtractor={(item) => item.id}
                renderItem={renderCompanyItem}
                ListHeaderComponent={renderHeader}
                ListEmptyComponent={!isLoading ? renderEmptyState : null}
                ListFooterComponent={
                    companies.length > 0 ? (
                        <View style={{ marginTop: 16 }}>
                            {error && (
                                <View style={[styles.card, { backgroundColor: theme.colors.errorContainer }]}>
                                    <Text style={[styles.body, { color: theme.colors.onErrorContainer }]}>
                                        {error}
                                    </Text>
                                </View>
                            )}
                            
                            <TouchableOpacity 
                                style={styles.buttonOutlined} 
                                onPress={handleCreateCompany}
                            >
                                <View style={styles.row}>
                                    <Ionicons name="add" size={20} color={theme.colors.primary} />
                                    <Text style={[styles.buttonTextOutlined, { marginLeft: 8 }]}>
                                        Add New Company
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    ) : null
                }
                refreshControl={
                    <RefreshControl
                        refreshing={isLoading}
                        onRefresh={loadCompanies}
                        colors={[theme.colors.primary]}
                        tintColor={theme.colors.primary}
                    />
                }
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 32 }}
            />
        </View>
    );
}
