import React from "react";
import { View, Text, Button } from "react-native";

export default function LedgerListScreen({ navigation }: any) {
    return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <Text style={{ fontSize: 22, fontWeight: "bold" }}>Ledger List</Text>
            <Button title="Create Ledger" onPress={() => navigation.navigate("CreateLedger")} />
        </View>
    );
}
