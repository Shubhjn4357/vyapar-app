import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AccountingStackParamList } from "../types/navigation";
import LedgerListScreen from "../screens/accounting/LedgerListScreen";
import CreateLedgerScreen from "../screens/accounting/CreateLedgerScreen";
import JournalEntryScreen from "../screens/accounting/JournalEntryScreen";
import TrialBalanceScreen from "../screens/accounting/TrialBalanceScreen";
import BalanceSheetScreen from "../screens/accounting/BalanceSheetScreen";

const Stack = createNativeStackNavigator<AccountingStackParamList>();

export default function AccountingNavigator() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="LedgerList" component={LedgerListScreen} />
            <Stack.Screen name="CreateLedger" component={CreateLedgerScreen} />
            <Stack.Screen name="JournalEntry" component={JournalEntryScreen} />
            <Stack.Screen name="TrialBalance" component={TrialBalanceScreen} />
            <Stack.Screen name="BalanceSheet" component={BalanceSheetScreen} />
        </Stack.Navigator>
    );
}
