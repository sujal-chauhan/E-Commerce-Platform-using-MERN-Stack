import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import {
    createOrderFromCart as createOrderFromCartAPI,
    getOrders as getOrdersAPI,
    cancelOrder as cancelOrderAPI,
} from '../services/api';

import type { Order } from "../types/Order";

interface OrderState {
    orders: Order[];
    loading: boolean;
    error: string | null;
}

const initialState: OrderState = {
    orders: [],
    loading: false,
    error: null,
};

export const createOrderFromCart = createAsyncThunk(
    'orders/placeOrder',
    async (_, { rejectWithValue }) => {
        try {
            const response = await createOrderFromCartAPI();
            return response.data.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);


export const fetchOrders = createAsyncThunk(
    'orders/fetchOrders',
    async (_, { rejectWithValue }) => {
        try {
            const response = await getOrdersAPI();
            return response.data.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);


export const cancelOrder = createAsyncThunk(
    'orders/cancelOrder',
    async (orderId: string, { rejectWithValue }) => {
        try {
            const response = await cancelOrderAPI(orderId);
            return response.data.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

const orderSlice = createSlice({
    name: 'orders',
    initialState,
    reducers: {
        clearOrderError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(createOrderFromCart.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createOrderFromCart.fulfilled, (state, action: PayloadAction<Order>) => {
                state.loading = false;
                state.orders = [action.payload, ...state.orders];
            })
            .addCase(createOrderFromCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })




            .addCase(fetchOrders.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchOrders.fulfilled, (state, action: PayloadAction<Order[]>) => {
                state.loading = false;
                state.orders = action.payload;
            })
            .addCase(fetchOrders.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })



            .addCase(cancelOrder.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(cancelOrder.fulfilled, (state, action: PayloadAction<Order>) => {
                state.loading = false;
                const index = state.orders.findIndex(o => o._id === action.payload._id);
                if (index !== -1) {
                    state.orders[index] = action.payload;
                }
            })
            .addCase(cancelOrder.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const { clearOrderError } = orderSlice.actions;
export default orderSlice.reducer;