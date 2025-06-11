import React, { useState } from "react";
import { View, Text, TextInput, Button } from "react-native";

const mockCompany = {
    id: 1,
    name: "Acme Corp",
    gstin: "22AAAAA0000A1Z5",
    address: "123 Main St, City",
};

export default function EditCompanyScreen({ route, navigation }: any) {
    // In real app, fetch company by route.params.companyId
    const [name, setName] = useState(mockCompany.name);
    const [gstin, setGstin] = useState(mockCompany.gstin);
    const [address, setAddress] = useState(mockCompany.address);

    const handleSave = () => {
        // TODO: Call API to update company
        navigation.goBack();
    };

    return (
        <View style={{ flex: 1, padding: 16 }}>
            <Text style={{ fontSize: 22, fontWeight: "bold", marginBottom: 16 }}>Edit Company</Text>
            <TextInput
                placeholder="Company Name"
                value={name}
                onChangeText={setName}
                style={{ borderWidth: 1, borderColor: "#ccc", marginBottom: 12, padding: 8 }}
            />
            <TextInput
                placeholder="GSTIN"
                value={gstin}
                onChangeText={setGstin}
                style={{ borderWidth: 1, borderColor: "#ccc", marginBottom: 12, padding: 8 }}
            />
            <TextInput
                placeholder="Address"
                value={address}
                onChangeText={setAddress}
                style={{ borderWidth: 1, borderColor: "#ccc", marginBottom: 12, padding: 8 }}
            />
            <Button title="Save" onPress={handleSave} />
        </View>
    );
}
