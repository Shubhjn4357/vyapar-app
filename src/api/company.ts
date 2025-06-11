import { Company } from "../types/company";
import { client } from "./client";
import { ApiError } from "./errors";

export const getAllCompanyByUserId = async (ids:string[]): Promise<Company[]> => {
    try {
        const {data} = await client.get<Company[]>(`/company/ids`, { params: { ids } });
        return data
    } catch (error) {
        throw new ApiError('Failed to update profile', error);
    }
};
export const createCompany = async (name:string,gstin:string,address:string|undefined): Promise<Company> => {
    try {
        const {data}=await client.post(`/company/add`,{name,gstin,address});
        return data
    } catch (error) {
        throw new ApiError('Failed to select company', error);
    }
};