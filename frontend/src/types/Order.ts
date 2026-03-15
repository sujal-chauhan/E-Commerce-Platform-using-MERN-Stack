export interface OrderItem{
    productId: string;
    title: string;
    price: number;
    quantity: number;
    image: string;
}

export interface Order{
    _id: string;
    orderId: string;
    userId: {
        _id: string;
        name: string;
        email: string;
    };
    items: OrderItem[];
    totalAmount: number;
    status: 'pending' | 'confirmed' | 'cancelled';
    orderDate: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface BuyNowRequest{
    productId: string;
    quantity: number;
}

export interface OrdersResponse{
    success: boolean;
    data: Order[];
}