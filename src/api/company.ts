import { Company } from "../types/company";
import { client } from "./client";
import { ApiError } from "./errors";

export const getAllCompanyByUserId = async (id:number): Promise<Company[]> => {
    try {
        const {data} = await client.get<Company[]>(`/company/user/${id}`);
        return data
    } catch (error) {
        console.log('datafetch:', error)
        throw new ApiError('Failed to get Companies', error);
    }
};
export const getCompanyById = async (id:string): Promise<Company> => {
    try {
        const {data} = await client.get<Company>(`/company/${id}`);
        return data
    } catch (error) {
        console.log('datafetch:', error)
        throw new ApiError('Failed to get Company', error);
    }
};

export const createCompany = async (userId:number,name:string,gstin:string,address:string|undefined): Promise<Company> => {
    try {
        const {data}=await client.post(`/company/add`,{name,gstin,address,userId});
        return data
    } catch (error) {
        console.log('datafetch:', error)
        throw new ApiError('Failed to create company', error);
    }
};

export const updateCompany = async (id:string,name:string,gstin:string,address:string|undefined): Promise<Company> => {
    try {
        const {data}=await client.put(`/company/${id}`,{name,gstin,address});
        return data
    } catch (error) {
        throw new ApiError('Failed to select company', error);
    }
};