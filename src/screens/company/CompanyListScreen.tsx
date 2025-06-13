import Loader from "@/src/components/Loader";
import { useCompany } from "@/src/hooks/useCompany";
import React from "react";
import { FlatList,TouchableOpacity, View } from "react-native";
import { Button, IconButton, Text } from "react-native-paper";
import type { NativeStackScreenProps} from '@react-navigation/native-stack';

import { Company } from "@/src/types/company";
import { RootStackParamList } from "@/src/types/navigation";
type Props = NativeStackScreenProps<RootStackParamList,'CompanyList'>
export default function CompanyListScreen({ navigation }:Props ) {
   const{isLoading,companyList,selectedCompany,handleCompanySelect,fetchError,loadAllCompany}= useCompany()
    
    if (isLoading) {
        return <Loader />
    }
    const SelectCompany = (company: Company) => {
        handleCompanySelect(company)
        navigation.replace("Main", { screen: "Dashboard" })
    };
    return (
        <View style={{ flex: 1, padding: 16 }}>
            <Text style={{ fontSize: 22, fontWeight: "bold", marginBottom: 16 }}>
                All Companies
            </Text>

            <FlatList
                data={companyList}
                keyExtractor={item => item.id}
                refreshing={isLoading}
                onRefresh={loadAllCompany}
                ListFooterComponent={
                    <>
                        {fetchError && (
                            <Text style={{ color: 'red', marginTop: 12 }}>
                                {JSON.stringify(fetchError)}
                            </Text>
                        )}
                        <Button
                            mode="contained"
                            icon="office-building"
                            onPress={() => navigation.navigate("CreateCompany")}
                            style={{ marginTop: 16 }}
                        >
                            Add Company
                        </Button>
                    </>
                }
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={{
                            padding: 16,
                            borderRadius: 18,
                            backgroundColor:
                                selectedCompany?.id === item.id ? '#c3c3c3' : 'transparent',
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            marginBottom: 12,
                        }}
                        onPress={() => SelectCompany(item)}
                    >
                        <View>
                            <Text style={{ fontSize: 18 }}>{item.name}</Text>
                            <Text style={{ color: "#888" }}>{item.gstin}</Text>
                        </View>
                        <IconButton
                            onPress={() =>
                                navigation.navigate("EditCompany", { companyId: item.id })
                            }
                            icon="file-document-edit"
                        />
                    </TouchableOpacity>
                )}
            />
        </View>
    );
}      
