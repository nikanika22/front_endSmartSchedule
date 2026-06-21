import { axiosClient } from "@/shared/lib/axios";
import type { LoginPayLoad, RegisterPayload } from "../types/auth-type";
const VITE_API_URL='/auth';


export const loginApi= async(payload:LoginPayLoad)=>{
    const res=await axiosClient.post(`${VITE_API_URL}/login`,payload)
    return res.data
}
export const registerApi= async(payload: Omit<RegisterPayload, 'confirmPassword'>)=>{
    const res=await axiosClient.post(`${VITE_API_URL}/register`,payload)
    return res.data
}