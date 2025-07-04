import React from "react";
import { View, Text } from "react-native";

export default function GSTR2Screen({ route }: any) {
    const { month, year } = route.params || {};
    return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <Text style={{ fontSize: 22, fontWeight: "bold" }}>GSTR-2 Report</Text>
            <Text>Month: {month}</Text>
            <Text>Year: {year}</Text>
        </View>
    );
}
