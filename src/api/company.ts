import { Company } from "../types/company";
import { client } from "./client";
import { ApiError } from "./errors";

interface ApiResponse<T> {
    status: string;
    data: T;
    message?: string;
}

export const getMyCompanies = async (token: string): Promise<Company[]> => {
    try {
        const {data} = await client.get<ApiResponse<Company[]>>(`/company/my`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return data.data;
    } catch (error) {
        console.log('datafetch:', error)
        throw new ApiError('Failed to get Companies', error);
    }
};

export const getAllCompanyByUserId = async (id:number, token: string): Promise<Company[]> => {
    try {
        const {data} = await client.get<ApiResponse<Company[]>>(`/company/user/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return data.data;
    } catch (error) {
        console.log('datafetch:', error)
        throw new ApiError('Failed to get Companies', error);
    }
};

export const getCompanyById = async (id:string, token: string): Promise<Company> => {
    try {
        const {data} = await client.get<ApiResponse<Company>>(`/company/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return data.data;
    } catch (error) {
        console.log('datafetch:', error)
        throw new ApiError('Failed to get Company', error);
    }
};

export const createCompany = async (name:string, gstin:string, address:string|undefined, token: string): Promise<Company> => {
    try {
        const {data}=await client.post<ApiResponse<Company>>(`/company/add`,{name,gstin,address}, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return data.data;
    } catch (error) {
        console.log('datafetch:', error)
        throw new ApiError('Failed to create company', error);
    }
};

export const updateCompany = async (id:string,name:string,gstin:string,address:string|undefined, token: string): Promise<Company> => {
    try {
        const {data}=await client.put<ApiResponse<Company>>(`/company/${id}`,{name,gstin,address}, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return data.data;
    } catch (error) {
        throw new ApiError('Failed to update company', error);
    }
};