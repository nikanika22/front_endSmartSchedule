import { axiosClient } from "@/shared/lib/axios";
import type { LoginPayLoad, RegisterApiPayload, UpdateMePayload } from "../types/auth-type";
const VITE_API_URL='/auth';


export const loginApi= async(payload:LoginPayLoad)=>{
    const res=await axiosClient.post(`${VITE_API_URL}/login`,payload)
    return res.data
}
export const registerApi= async(payload: RegisterApiPayload)=>{
    const res=await axiosClient.post(`${VITE_API_URL}/register`,payload)
    return res.data
}
export const updateMeApi = async (payload: UpdateMePayload) => {
    const res = await axiosClient.patch(`${VITE_API_URL}/me`, payload)
    return res.data
}
