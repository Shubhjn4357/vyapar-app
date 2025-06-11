import { useState, useEffect } from "react";
import { getAllCompanyByUserId } from "@/src/api/company";
import { useAuth } from "@/src/contexts/AuthContext";
import { Company } from "@/src/types/company";

export function useCompany() {
    
    const [companyList, setCompanyList] = useState<Company[]>();
    const [fetchError, setFetchError] = useState<any>(null);
    const [isLoading, setLoading] = useState<boolean>(true);
    const { user,setCompany,company } = useAuth();

    const handleCompanySelect = async (company:Company) => {
        try {
            setLoading(true);
            setCompany(company)
        } catch (error) {
            setFetchError(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        async function loadAllCompany() {
            try {
                if (user?.companies) {
                    const companiesList = await getAllCompanyByUserId(user.companies);
                    setFetchError(null);
                    setCompanyList(companiesList);
                }
            } catch (error) {
                setFetchError(error);
            } finally {
                setLoading(false);
            }
        }
        loadAllCompany();
    }, [user]);

    return {
        selectedCompany:company,
        companyList,
        fetchError,
        isLoading,
        handleCompanySelect,
    };
}
