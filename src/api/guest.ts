
import { User } from "../types/user";
import client from "./client";
import { ApiError } from "./errors";

export const loginAsGuestApi = async ({ deviceId, deviceInfo }: {
    deviceId: string, deviceInfo: {
        platform: "ios" | "android" | "windows" | "macos" | "web";
        version: string;
        model: string;
    } }) => {
    try {
        const { data } = await client.post<{ 
                            token:string, 
                            user: User,
                            isGuest: boolean 
                        }>('/auth/guest', { deviceId, deviceInfo });
        return data;
    } catch (error) {
        console.log({error})
        throw new ApiError('Failed to fetch profile', error);
    }
};
