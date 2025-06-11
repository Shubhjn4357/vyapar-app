import Loader from "@/src/components/Loader";
import { useCompany } from "@/src/hooks/useCompany";
import React from "react";
import { FlatList, TouchableOpacity, View } from "react-native";
import { Button, IconButton, Text } from "react-native-paper";
export default function CompanyListScreen({ navigation }: any) {
   const{isLoading,companyList,selectedCompany,handleCompanySelect,fetchError}= useCompany()
    
    if (isLoading) {
        return <Loader />
    }
    return (
        <View style={{ flex: 1, padding: 16 }}>
            <Text style={{ fontSize: 22, fontWeight: "bold", marginBottom: 16 }}>All Companies</Text>
            <FlatList
                data={companyList}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={{
                            padding: 16,
                            borderRadius: 18,
                            backgroundColor: selectedCompany?.id === item.id ? '#c3c3c3' : 'transparent',
                            flex: 1,
                            flexDirection: 'row',
                            justifyContent: 'space-between'
                        }}
                        onPress={() => handleCompanySelect(item)}
                    >
                        <View>
                            <Text style={{ fontSize: 18 }}>{item.name}</Text>
                            <Text style={{ color: "#888" }}>{item.gstin}</Text>
                        </View>
                        <IconButton onPress={() => navigation.navigate("EditCompany", { companyId: item.id })} icon='file-document-edit' />
                    </TouchableOpacity>
                )}
            />
            {fetchError && <View> <Text style={{ color: 'red' }}>{fetchError}</Text></View>}
            <Button mode="contained" onPress={() => navigation.navigate("CreateCompany")} icon='office-building'>Add Company</Button>
        </View>
    );
}
