import { createSlice } from "@reduxjs/toolkit";
import type{ PayloadAction } from "@reduxjs/toolkit";
import type { UserInfo } from "../types/User";

interface AuthState{
    user: UserInfo | null;
    isAuthenticated: boolean;
    isAdmin: boolean;
    loading: boolean;
}

const storedUser = localStorage.getItem('user-info')
let initialUser: UserInfo | null = null;  

if(storedUser){
    try{
        initialUser = JSON.parse(storedUser);
    }catch(err){
        console.error('Error parsing stored user infor : ', err)
        localStorage.removeItem('user-info');
    }
}

const initialState: AuthState = {
    user: initialUser,
    isAuthenticated: !!initialUser,
    isAdmin: initialUser?.role === 'admin',
    loading: false,
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login: (state, action:PayloadAction<UserInfo>) =>{
            state.user = action.payload;
            state.isAuthenticated = true;
            state.isAdmin = action.payload.role === 'admin';
            localStorage.setItem('user-info', JSON.stringify(action.payload))
        },

        logout: (state)=>{
            state.user = null;
            state.isAuthenticated = false;
            state.isAdmin = false;
            localStorage.removeItem('user-info');
        },

        updateUser: (state, action:PayloadAction<string>)=>{
            if(state.user){
                state.user.name = action.payload;
                localStorage.setItem('user-info', JSON.stringify(state.user));
            }
        },

        setLoading: (state, action: PayloadAction<boolean>)=>{
            state.loading = action.payload;
        }
    }
})

export const { login, logout, updateUser, setLoading } = authSlice.actions;
export default authSlice.reducer;