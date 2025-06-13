import { useState, useEffect } from "react";
import { getAllCompanyByUserId } from "@/src/api/company";
import { useAuth } from "@/src/contexts/AuthContext";
import { Company } from "@/src/types/company";
import { ApiError } from "../api/errors";
export function useCompany() {
    
    const [companyList, setCompanyList] = useState<Company[]>();
    const [fetchError, setFetchError] = useState<any>(null);
    const [isLoading, setLoading] = useState<boolean>(true);
    const { user,setCompany,company } = useAuth();
    const handleCompanySelect = async (company:Company) => {
        setCompany(company);
    };
    async function loadAllCompany() {
        try {
            if (user) {
                const companiesList = await getAllCompanyByUserId(user.id);
                setFetchError(null);
                setCompanyList(companiesList);
            }
        } catch (error) {
            if(error as ApiError){
                setFetchError(error);
            }
            console.log('fetch', error)
            setFetchError('No data Available');
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadAllCompany();
    }, [user]);

    return {
        loadAllCompany,
        selectedCompany:company,
        companyList,
        fetchError,
        isLoading,
        handleCompanySelect,
    };
}
