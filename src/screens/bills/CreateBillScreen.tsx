import React, { useState } from "react";
import { ScrollView } from "react-native";
import { Text, Button, TextInput } from "react-native-paper";
// import { useBills } from "@/src/hooks/useBills";
// import { BillFormData } from "@/src/types/bills";
// import { useStyles } from "@/src/hooks/useStyles";
import type { NativeStackScreenProps} from '@react-navigation/native-stack';
import { BillStackParamList } from "@/src/types/navigation";
import { useStyle } from "@/src/hooks/useStyle";

type props = NativeStackScreenProps<BillStackParamList,'CreateBill'>
export default function CreateBillScreen({navigation}:props) {
    const [customerName, setCustomerName] = useState("");
    const [amount, setAmount] = useState("");
    // const { addBill, loading } = useBills();
    // const navigation = useNavigation();
    const styles = useStyle();
    const loading=true
    const handleSubmit = async () => {
        if (!customerName || !amount) return;
        // const billData: BillFormData = {
        //     customerName,
        //     amount: parseFloat(amount),
        //     items: [],
        //     date: new Date(),
        //     dueDate: new Date(),
        //     status: "unpaid",
        //     notes: ""
        // };
        // await addBill(billData);
        navigation.goBack();
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text variant="titleLarge">Create Bill</Text>
            <TextInput
                label="Customer Name"
                value={customerName}
                onChangeText={setCustomerName}
                style={styles.input}
            />
            <TextInput
                label="Amount"
                value={amount}
                onChangeText={setAmount}
                keyboardType="numeric"
                style={styles.input}
            />
            <Button mode="contained" onPress={handleSubmit} loading={loading}>
                Save Bill
            </Button>
        </ScrollView>
    );
}
