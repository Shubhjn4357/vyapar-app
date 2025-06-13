import React from "react";
import { Animated} from "react-native";
import type { NativeStackScreenProps} from '@react-navigation/native-stack';
import { CompanyStackParamList } from "@/src/types/navigation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useStyle } from "@/src/hooks/useStyle";
import { Text, TextInput ,Button, useTheme} from "react-native-paper";
import { KeyboardAvoidingView } from "react-native";
import { Platform } from "react-native";
import { getCompanyById, updateCompany } from "@/src/api/company";
type props = NativeStackScreenProps<CompanyStackParamList,'EditCompany'>
const CompanySchema = z.object({
    companyname: z.string().min(3, "Company Name Is Required"),
    gstin: z.string().min(12, "invalid Gstin"),
    address:z.string().optional()
});
type companyForm=z.infer<typeof CompanySchema>
export default function EditCompanyScreen({ navigation,route }: props) {
    const {companyId}=route.params;
    const styles = useStyle();
    const { colors } = useTheme();
     const fadeAnim = React.useRef(new Animated.Value(0)).current;
   const { control, handleSubmit, formState: { errors },setValue } = useForm<companyForm>({
           resolver: zodResolver(CompanySchema),
           defaultValues: { companyname:'',gstin:'',address:''}
       });

    const onSubmit = async(data:companyForm) => {
       const company = await updateCompany(companyId,data.companyname,data.gstin,data.address)
       alert(`New Company Added ${company.name}`)
        navigation.goBack();
    };
    React.useEffect(()=>{
        async function fetchCompany(){
            const company=await getCompanyById(companyId);
            setValue('companyname',company.name);
            setValue('gstin',company.gstin);
            setValue('address',company.address);
        }
        fetchCompany();

    },[])
    React.useEffect(() => {
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 600,
                useNativeDriver: true,
            }).start();
            // return clearError;
        }, []);
    return (
       <KeyboardAvoidingView
                  style={{ flex: 1, backgroundColor: colors.background }}
                  behavior={Platform.OS === "ios" ? "padding" : undefined}
              >
                  <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
            <Text style={{ fontSize: 22, fontWeight: "bold", marginBottom: 16 }}>Create Company</Text>
            <Controller
                control={control}
                name="companyname"
                render={({ field: { onChange, value } }) => (
                    <TextInput
                        label="Company Name"
                        value={value}
                        onChangeText={onChange}
                        error={!!errors.companyname}
                        style={styles.input}
                        mode="outlined"
                      
                    />
                )}
            />
            {errors.companyname && <Text style={styles.error}>{errors.companyname.message}</Text>}
            <Controller
                control={control}
                name="gstin"
                render={({ field: { onChange, value } }) => (
                    <TextInput
                        label="GSTIN"
                        value={value}
                        onChangeText={onChange}
                        error={!!errors.gstin}
                        style={styles.input}
                        mode="outlined"
                       
                    />
                )}
            />
            {errors.gstin && <Text style={styles.error}>{errors.gstin.message}</Text>}
            <Controller
                control={control}
                name="address"
                render={({ field: { onChange, value } }) => (
                    <TextInput
                        label="Address"
                        value={value}
                        onChangeText={onChange}
                        error={!!errors.address}
                        style={styles.input}
                        mode="outlined"
                        
                    />
                )}
            />
            {errors.address && <Text style={styles.error}>{errors.address.message}</Text>}
           
            <Button mode="contained" onPress={handleSubmit(onSubmit)} >Save or Submit</Button>
       </Animated.View>
       </KeyboardAvoidingView>
    );
}
