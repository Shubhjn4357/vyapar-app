import React, { useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import {
    Text,
    TextInput,
    Button,
    Card,
    useTheme,
    Divider,
    IconButton,
    Chip,
} from 'react-native-paper';
import { BillItem, BillType } from '../../types/bill';

export default function CreateBillScreen() {
    const theme = useTheme();
    const [billType, setBillType] = useState<BillType>(BillType.SALES);
    const [customerName, setCustomerName] = useState('');
    const [customerPhone, setCustomerPhone] = useState('');
    const [customerGSTIN, setCustomerGSTIN] = useState('');
    const [items, setItems] = useState<BillItem[]>([
        {
            id: '1',
            name: '',
            description: '',
            quantity: 1,
            unit: 'pcs',
            rate: 0,
            amount: 0,
            taxRate: 18,
            taxAmount: 0,
            total: 0,
        },
    ]);

    const addItem = () => {
        const newItem: BillItem = {
            id: Date.now().toString(),
            name: '',
            description: '',
            quantity: 1,
            unit: 'pcs',
            rate: 0,
            amount: 0,
            taxRate: 18,
            taxAmount: 0,
            total: 0,
        };
        setItems([...items, newItem]);
    };

    const updateItem = (index: number, field: keyof BillItem, value: any) => {
        const updatedItems = [...items];
        updatedItems[index] = { ...updatedItems[index], [field]: value };

        // Recalculate amounts
        const item = updatedItems[index];
        item.amount = item.quantity * item.rate;
        item.taxAmount = (item.amount * item.taxRate) / 100;
        item.total = item.amount + item.taxAmount;

        setItems(updatedItems);
    };

    const removeItem = (index: number) => {
        if (items.length > 1) {
            setItems(items.filter((_, i) => i !== index));
        }
    };

    const calculateTotals = () => {
        const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
        const totalTax = items.reduce((sum, item) => sum + item.taxAmount, 0);
        const total = subtotal + totalTax;
        return { subtotal, totalTax, total };
    };

    const { subtotal, totalTax, total } = calculateTotals();

    const handleSave = () => {
        // TODO: Implement save functionality
        console.log('Saving bill...', {
            billType,
            customerName,
            customerPhone,
            customerGSTIN,
            items,
            subtotal,
            totalTax,
            total,
        });
    };
    return (
        <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <View style={styles.header}>
                <Text variant="headlineMedium" style={{ color: theme.colors.onBackground }}>
                    Create {billType === 'SALES' ? 'Sales' : 'Purchase'} Bill
                </Text>
                <View style={styles.billTypeContainer}>
                    <Chip
                        selected={billType === 'SALES'}
                        onPress={() => setBillType(BillType.SALES)}
                        style={styles.chip}
                    >
                        Sales
                    </Chip>
                    <Chip
                        selected={billType === 'PURCHASE'}
                        onPress={() => setBillType(BillType.PURCHASE)}
                        style={styles.chip}
                    >
                        Purchase
                    </Chip>
                </View>
            </View>

            <Card style={styles.card}>
                <Card.Content>
                    <Text variant="titleMedium" style={styles.sectionTitle}>
                        {billType === 'SALES' ? 'Customer' : 'Supplier'} Details
                    </Text>
                    <TextInput
                        label={`${billType === 'SALES' ? 'Customer' : 'Supplier'} Name`}
                        value={customerName}
                        onChangeText={setCustomerName}
                        style={styles.input}
                        mode="outlined"
                    />
                    <TextInput
                        label="Phone Number"
                        value={customerPhone}
                        onChangeText={setCustomerPhone}
                        style={styles.input}
                        mode="outlined"
                        keyboardType="phone-pad"
                    />
                    <TextInput
                        label="GSTIN (Optional)"
                        value={customerGSTIN}
                        onChangeText={setCustomerGSTIN}
                        style={styles.input}
                        mode="outlined"
                    />
                </Card.Content>
            </Card>

            <Card style={styles.card}>
                <Card.Content>
                    <View style={styles.itemsHeader}>
                        <Text variant="titleMedium" style={styles.sectionTitle}>
                            Items
                        </Text>
                        <Button mode="contained" onPress={addItem} compact>
                            Add Item
                        </Button>
                    </View>

                    {items.map((item, index) => (
                        <View key={item.id} style={styles.itemContainer}>
                            <View style={styles.itemHeader}>
                                <Text variant="titleSmall">Item {index + 1}</Text>
                                {items.length > 1 && (
                                    <IconButton
                                        icon="delete"
                                        size={20}
                                        onPress={() => removeItem(index)}
                                    />
                                )}
                            </View>

                            <TextInput
                                label="Item Name"
                                value={item.name}
                                onChangeText={(value) => updateItem(index, 'name', value)}
                                style={styles.input}
                                mode="outlined"
                            />

                            <TextInput
                                label="Description (Optional)"
                                value={item.description}
                                onChangeText={(value) => updateItem(index, 'description', value)}
                                style={styles.input}
                                mode="outlined"
                                multiline
                            />

                            <View style={styles.row}>
                                <TextInput
                                    label="Quantity"
                                    value={item.quantity.toString()}
                                    onChangeText={(value) => updateItem(index, 'quantity', parseFloat(value) || 0)}
                                    style={[styles.input, styles.flex1]}
                                    mode="outlined"
                                    keyboardType="numeric"
                                />
                                <TextInput
                                    label="Unit"
                                    value={item.unit}
                                    onChangeText={(value) => updateItem(index, 'unit', value)}
                                    style={[styles.input, styles.flex1]}
                                    mode="outlined"
                                />
                                <TextInput
                                    label="Rate"
                                    value={item.rate.toString()}
                                    onChangeText={(value) => updateItem(index, 'rate', parseFloat(value) || 0)}
                                    style={[styles.input, styles.flex1]}
                                    mode="outlined"
                                    keyboardType="numeric"
                                />
                            </View>

                            <View style={styles.row}>
                                <TextInput
                                    label="Tax Rate (%)"
                                    value={item.taxRate.toString()}
                                    onChangeText={(value) => updateItem(index, 'taxRate', parseFloat(value) || 0)}
                                    style={[styles.input, styles.flex1]}
                                    mode="outlined"
                                    keyboardType="numeric"
                                />
                                <View style={[styles.flex1, styles.amountContainer]}>
                                    <Text variant="bodySmall">Amount: ₹{item.amount.toFixed(2)}</Text>
                                    <Text variant="bodySmall">Tax: ₹{item.taxAmount.toFixed(2)}</Text>
                                    <Text variant="titleSmall">Total: ₹{item.total.toFixed(2)}</Text>
                                </View>
                            </View>

                            {index < items.length - 1 && <Divider style={styles.divider} />}
                        </View>
                    ))}
                </Card.Content>
            </Card>

            <Card style={styles.card}>
                <Card.Content>
                    <Text variant="titleMedium" style={styles.sectionTitle}>
                        Bill Summary
                    </Text>
                    <View style={styles.summaryRow}>
                        <Text variant="bodyLarge">Subtotal:</Text>
                        <Text variant="bodyLarge">₹{subtotal.toFixed(2)}</Text>
                    </View>
                    <View style={styles.summaryRow}>
                        <Text variant="bodyLarge">Total Tax:</Text>
                        <Text variant="bodyLarge">₹{totalTax.toFixed(2)}</Text>
                    </View>
                    <Divider style={styles.divider} />
                    <View style={styles.summaryRow}>
                        <Text variant="titleMedium" style={{ fontWeight: 'bold' }}>
                            Total Amount:
                        </Text>
                        <Text variant="titleMedium" style={{ fontWeight: 'bold' }}>
                            ₹{total.toFixed(2)}
                        </Text>
                    </View>
                </Card.Content>
            </Card>

            <View style={styles.actions}>
                <Button mode="outlined" style={styles.actionButton}>
                    Save as Draft
                </Button>
                <Button mode="contained" style={styles.actionButton} onPress={handleSave}>
                    Save Bill
                </Button>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    header: {
        marginBottom: 16,
    },
    billTypeContainer: {
        flexDirection: 'row',
        marginTop: 8,
        gap: 8,
    },
    chip: {
        marginRight: 8,
    },
    card: {
        marginBottom: 16,
    },
    sectionTitle: {
        marginBottom: 16,
        fontWeight: 'bold',
    },
    input: {
        marginBottom: 12,
    },
    itemsHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    itemContainer: {
        marginBottom: 16,
    },
    itemHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    row: {
        flexDirection: 'row',
        gap: 8,
    },
    flex1: {
        flex: 1,
    },
    amountContainer: {
        justifyContent: 'center',
        alignItems: 'flex-end',
        paddingHorizontal: 8,
    },
    divider: {
        marginVertical: 16,
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    actions: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 32,
    },
    actionButton: {
        flex: 1,
    },
});
