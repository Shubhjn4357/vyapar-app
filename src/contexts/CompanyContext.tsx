import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { getMyCompanies, createCompany, updateCompany, getCompanyById } from "../api/company";
import { Company } from "../types/company";
import { useAuth } from "./AuthContext";

type CompanyState = {
    companies: Company[];
    selectedCompany: Company | null;
    isLoading: boolean;
    error: string | null;
};

type CompanyContextType = CompanyState & {
    loadCompanies: () => Promise<void>;
    selectContextCompany: (company: Company) => void;
    createNewCompany: (data: { name: string; gstin: string; address?: string }) => Promise<Company>;
    updateExistingCompany: (id: string, data: { name: string; gstin: string; address?: string }) => Promise<Company>;
    clearError: () => void;
    refreshSelectedCompany: () => Promise<void>;
};

const CompanyContext = createContext<CompanyContextType | undefined>(undefined);

export const CompanyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { token, user,selectCompany } = useAuth();
    
    const [state, setState] = useState<CompanyState>({
        companies: [],
        selectedCompany: null,
        isLoading: false,
        error: null,
    });
   
    const setError = (error: string | null) =>
        setState(prev => ({ ...prev, error, isLoading: false }));

    const clearError = () => setError(null);

    const loadCompanies = useCallback(async () => {
        if (!token) return;
        
        setState(prev => ({ ...prev, isLoading: true, error: null }));
        try {
            const companies = await getMyCompanies(token);
            setState(prev => ({
                ...prev,
                companies,
                isLoading: false,
                error: null
            }));
        } catch (error: any) {
            setError(error?.message || "Failed to load companies");
            throw error
        }
    }, [token]);

    const selectContextCompany = useCallback((company: Company) => {
        setState(prev => ({ ...prev, selectedCompany: company }));
        selectCompany(company)
    }, []);

    const createNewCompany = useCallback(async (data: { name: string; gstin: string; address?: string }) => {
        if (!token) throw new Error("No token found");
        
        setState(prev => ({ ...prev, isLoading: true, error: null }));
        try {
            const newCompany = await createCompany(data.name, data.gstin, data.address, token);
            setState(prev => ({
                ...prev,
                companies: [...prev.companies, newCompany],
                isLoading: false,
                error: null
            }));
            return newCompany;
        } catch (error: any) {
            setError(error?.message || "Failed to create company");
            throw error;
        }
    }, [token]);

    const updateExistingCompany = useCallback(async (id: string, data: { name: string; gstin: string; address?: string }) => {
        if (!token) throw new Error("No token found");
        
        setState(prev => ({ ...prev, isLoading: true, error: null }));
        try {
            const updatedCompany = await updateCompany(id, data.name, data.gstin, data.address, token);
            setState(prev => ({
                ...prev,
                companies: prev.companies.map(c => c.id === id ? updatedCompany : c),
                selectedCompany: prev.selectedCompany?.id === id ? updatedCompany : prev.selectedCompany,
                isLoading: false,
                error: null
            }));
            
            
            
            return updatedCompany;
        } catch (error: any) {
            setError(error?.message || "Failed to update company");
            throw error;
        }
    }, [token, state.selectedCompany?.id]);

    const refreshSelectedCompany = useCallback(async () => {
        if (!token || !state.selectedCompany) return;
        
        try {
            const refreshedCompany = await getCompanyById(state.selectedCompany.id, token);
            setState(prev => ({
                ...prev,
                selectedCompany: refreshedCompany,
                companies: prev.companies.map(c => c.id === refreshedCompany.id ? refreshedCompany : c)
            }));
        } catch (error: any) {
            setError(error?.message || "Failed to refresh company data");
        }
    }, [token, state.selectedCompany]);


    // Load companies when user is authenticated
    useEffect(() => {
        if (user && token) {
            try {
                loadCompanies();
            } catch (error) {
                console.log("problem in loading Company",error)
            }
        }
    }, [user, token]);
    return (
        <CompanyContext.Provider value={{
            ...state,
            loadCompanies,
            selectContextCompany,
            createNewCompany,
            updateExistingCompany,
            clearError,
            refreshSelectedCompany
        }}>
            {children}
        </CompanyContext.Provider>
    );
};

export const useCompany = () => {
    const ctx = useContext(CompanyContext);
    if (!ctx) throw new Error("useCompany must be used within CompanyProvider");
    return ctx;
};