export type LoginPayLoad={
   email:string,
   password:string,  
};
export type RegisterPayload={
    massv:string;
    fullName: string;
    email: string;
    password: string;
    confirmPassword: string;
};

export type RegisterApiPayload = {
    student_id: string;
    name: string;
    email: string;
    password: string;
    role?: string;
};  
export type UpdateMePayload = {
    name?: string;
    password?: string;
    old_password?: string;
};
