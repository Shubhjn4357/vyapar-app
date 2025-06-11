import React from "react";
import { View } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import useProfile from "@/src/hooks/useProfile";
import { Button, Text, TextInput } from "react-native-paper";

const profileSchema = z.object({
    name: z.string().min(2, "Name is required"),
    email: z.string().email("Invalid email"),
});

type ProfileForm = z.infer<typeof profileSchema>;

export default function CompleteProfileScreen() {
    const {completeProfile,isLoading,error,isProfileComplete} = useProfile()
    const { control, handleSubmit, formState: { errors } } = useForm<ProfileForm>({
        resolver: zodResolver(profileSchema),
        defaultValues: { name: "", email: "" }
    });

    const onSubmit = async(data: ProfileForm) => {
        await completeProfile(data.name,data.email)
        
    };

    return (
        <View style={{ flex: 1, justifyContent: "center", padding: 24 }}>
            <Text style={{ fontSize: 20, marginBottom: 16 }}>Complete Your Profile</Text>
            {isProfileComplete && <View style={{backgroundColor:'green200'}}>
                <Text style={{color:'green'}}>Profile is completed</Text>
                </View>}
            <Controller
                control={control}
                name="name"
                render={({ field: { onChange, value } }) => (
                    <TextInput
                        placeholder="Full Name"
                        value={value}
                        onChangeText={onChange}
                        style={{ borderWidth: 1, marginBottom: 8, padding: 8 }}
                    />
                )}
            />
            {errors.name && <Text style={{ color: "red" }}>{errors.name.message}</Text>}
            <Controller
                control={control}
                name="email"
                render={({ field: { onChange, value } }) => (
                    <TextInput
                        placeholder="Email"
                        value={value}
                        onChangeText={onChange}
                        style={{ borderWidth: 1, marginBottom: 8, padding: 8 }}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />
                )}
            />
            {errors.email && <Text style={{ color: "red" }}>{errors.email.message}</Text>}
            {error && <Text style={{color:"red"}}>{error}</Text>}
            <Button mode="contained" loading={isLoading} onPress={handleSubmit(onSubmit)} >Save & Continue</Button>
        </View>
    );
}
