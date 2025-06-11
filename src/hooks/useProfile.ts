import { useCallback, useEffect, useState } from "react"
import { completeProfileApi } from "../api/profile";
import * as SecureStore from "expo-secure-store";
import { useNavigation } from "@react-navigation/native";
import { fetchProfileApi } from "../api/auth";
import { User } from "../types/user";
type AuthState = {
    isLoading: boolean;
    error: string | null;
    isProfileComplete:boolean;
    profile:User|null;
};
const useProfile = () => {
    const [state, setState] = useState<AuthState>({
            profile:null,
            isLoading: true,
            error: null,
            isProfileComplete:false
        });
    const navigate = useNavigation()
    useEffect(() => {
        const checkAuthentication = async () => {
                const token = await SecureStore.getItemAsync("token");
                if (token) {
                    try {
                    const userProfile = await fetchProfileApi(token);
                    if(userProfile.name && userProfile.email){
                        await completeProfileApi(userProfile.name, userProfile.email, token);
                        setState(prev => ({
                            ...prev,
                            profile:userProfile,
                            error:null,
                            isProfileComplete: true,
                            isLoading: false
                        }));
                    }
                    else{
                        throw Error('Profile is Incomplete')
                    }
                } catch (error) {
                    setState(prev=>({...prev,error:error instanceof Error ? error.message : "Failed to fetch profile"}));
                }
                finally{
                    setState(prev=>({...prev,isLoading:false}))
                }
                }
                else {
                    setState(prev => ({ ...prev, isLoading: false }));
                    navigate.goBack()
                }
            }
            checkAuthentication()
        },[])
    const clearErorrs=useCallback(()=>setState(prev=>({...prev,error:null})),[])
    const completeProfile=useCallback(async(name:string,email:string)=>{
        setState(prev => ({ ...prev, isLoading: true, error: null }));
        try {
            const token =await SecureStore.getItemAsync('token')
                        if(token){
                        await completeProfileApi(name,email,token);
                        setState(prev => ({ ...prev, isLoading: false,isProfileComplete:true,error:null }));
                        }
                        else{
                            throw new Error('User Not Authenticated')
                        }
                    } catch (error: any) {
                        setState(prev=>({...prev,error:error?.message || "Failed to update Profile"}));
                        throw error;
                    }finally{
                        setState(prev=>({...prev,isLoading:false}))
                    }
        },[])
 return {
    completeProfile,
    isLoading:state.isLoading,
    error:state.error,
    clearErorrs,
    isProfileComplete:state.isProfileComplete

 }
}

export default useProfile