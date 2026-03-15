export interface User{
    _id: string;
    name: string;
    email: string;
    role: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface UserInfo{
    name: string;
    email: string;
    token: string;
    role: string
}

export interface AuthResponse{
    message: string;
    token: string;
    user: User;
}