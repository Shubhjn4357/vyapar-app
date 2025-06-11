import { client } from "./client";
import { ApiError } from "./errors";

export const completeProfileApi = async (name:string,email:string,token:string): Promise<void> => {
    try {
        await client.put('/user/me/profile?token=' + token, { name,email});
    } catch (error) {
        console.log(error)
        throw new ApiError('Failed to update profile', error);
    }
};