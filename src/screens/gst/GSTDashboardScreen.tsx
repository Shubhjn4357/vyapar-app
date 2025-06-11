import React from "react";
import { View, Text, Button } from "react-native";

export default function GSTDashboardScreen({ navigation }: any) {
    return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <Text style={{ fontSize: 22, fontWeight: "bold" }}>GST Dashboard</Text>
            <Button title="Go to GSTR-1" onPress={() => navigation.navigate("GSTR1", { month: "01", year: "2024" })} />
            <Button title="Go to GSTR-2" onPress={() => navigation.navigate("GSTR2", { month: "01", year: "2024" })} />
            <Button title="Go to GSTR-3B" onPress={() => navigation.navigate("GSTR3B", { month: "01", year: "2024" })} />
            <Button title="GST Reconciliation" onPress={() => navigation.navigate("GSTReconciliation")} />
        </View>
    );
}
