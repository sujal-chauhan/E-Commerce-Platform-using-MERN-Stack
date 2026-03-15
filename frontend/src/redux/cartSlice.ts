import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import {
    getCart, 
    addToCart as addToCartAPI, 
    updateCartItem as updateCartItemAPI,
    removeCartItem as removeCartItemAPI,
    clearCart as clearCartItemAPI,
} from '../services/api';

import type{ Cart } from "../types/Cart";

interface CartState{
    cart: Cart | null;
    loading: boolean;
    productAdding: string;
}



const initialState: CartState = {
    cart: null,
    loading: false,
    productAdding: ""
}

export const fetchCart = createAsyncThunk(
    '/cart/fetchCart',
    async(_, {rejectWithValue})=>{
    try{
        const response = await getCart();
        return response.data.data;
    }catch(error:any){
        return rejectWithValue(error.response?.data || error.message);
    }
});

export const addToCart = createAsyncThunk(
    'cart/addToCart',
    async({productId, quantity = 1}: {productId:string, quantity?:number}, {rejectWithValue})=>{
        try{
            const response = await addToCartAPI(productId, quantity);
            return response.data.data;
        }catch(error: any){
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const updateCartItem = createAsyncThunk(
    'cart/updateCart',
    async({productId, quantity}: {productId:string, quantity:number}, {rejectWithValue})=>{
        try{
            const response = await updateCartItemAPI(productId, quantity);
            return response.data.data;
        }catch(error: any){
            return rejectWithValue(error.response?.data || error.message)
        }
    }
);

export const removeCartItem = createAsyncThunk(
    'cart/removeCart',
    async({productId}:{productId:string}, {rejectWithValue})=>{
        try{
            const response = await removeCartItemAPI(productId);
            return response.data.data;
        }
        catch(error: any){
            return rejectWithValue(error.response?.data || error.message)
        }
    }
)

export const clearCart = createAsyncThunk(
    'cart/clearCart',
    async(_, {rejectWithValue})=> {
        try{
            const response = await clearCartItemAPI();
            return response.data.data;
        }catch(error:any){
            return rejectWithValue(error.response?.data || error.message);
        }
    }
)




const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        clearCartData: (state)=> {state.cart = null;}
    },
    extraReducers: (builder) => {
        builder


        .addCase(fetchCart.pending, (state)=> {state.loading = true})
        .addCase(fetchCart.fulfilled, (state, action)=> {
            state.loading = false;
            state.cart = action.payload
        })
        .addCase(fetchCart.rejected, (state)=> {state.loading = false;})



        .addCase(addToCart.pending, (state, action)=>{
            state.loading = true;
            state.productAdding = action.meta.arg.productId;
        })
        .addCase(addToCart.fulfilled, (state, action)=>{
            state.loading = false;
            state.cart = action.payload;
            state.productAdding = "";
        })
        .addCase(addToCart.rejected, (state)=>{
            state.loading = false;
            state.productAdding = "";
        })



        .addCase(updateCartItem.pending, (state)=>{
            state.loading = true;
        })
        .addCase(updateCartItem.fulfilled, (state, action)=>{
            state.loading = false;
            state.cart = action.payload;
        })
        .addCase(updateCartItem.rejected, (state)=>{
            state.loading = false;
        })



        .addCase(removeCartItem.pending, (state)=>{
            state.loading = true;
        })
        .addCase(removeCartItem.fulfilled, (state, action)=>{
            state.loading = false;
            state.cart = action.payload;
        })
        .addCase(removeCartItem.rejected, (state)=>{
            state.loading = false;
        })



        .addCase(clearCart.pending, (state)=>{
            state.loading = true;
        })
        .addCase(clearCart.fulfilled, (state)=>{
            state.loading = false;
            state.cart = null;
        })
        .addCase(clearCart.rejected, (state)=>{
            state.loading = false;
        })

        // Clear the cart after a successful order
        .addMatcher(
            (action) => action.type === 'orders/placeOrder/fulfilled',
            (state) => {
                state.loading = false;
                state.cart = null;
            }
        );
        

    }
})

export const {} = cartSlice.actions;
export default cartSlice.reducer;