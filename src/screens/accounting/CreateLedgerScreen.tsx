import React, { useState } from "react";
import { View, Text, TextInput, Button } from "react-native";

export default function CreateLedgerScreen({ navigation }: any) {
    const [name, setName] = useState("");
    const [type, setType] = useState("");

    const handleCreate = () => {
        // TODO: Call API to create ledger
        navigation.goBack();
    };

    return (
        <View style={{ flex: 1, padding: 16 }}>
            <Text style={{ fontSize: 22, fontWeight: "bold", marginBottom: 16 }}>Create Ledger</Text>
            <TextInput
                placeholder="Ledger Name"
                value={name}
                onChangeText={setName}
                style={{ borderWidth: 1, borderColor: "#ccc", marginBottom: 12, padding: 8 }}
            />
            <TextInput
                placeholder="Type (asset/liability/expense/income)"
                value={type}
                onChangeText={setType}
                style={{ borderWidth: 1, borderColor: "#ccc", marginBottom: 12, padding: 8 }}
            />
            <Button title="Create" onPress={handleCreate} />
        </View>
    );
}
