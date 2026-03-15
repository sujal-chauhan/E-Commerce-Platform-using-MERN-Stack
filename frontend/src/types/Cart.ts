export interface CartItem{
    _id?: string;
    productId: string;
    title: string;
    price: number;
    quantity: number;
    image: File | null;
    stock: number;
}

export interface Cart{
    _id:string;
    userId: string;
    items: CartItem[];
    totalAmount: number;
    createdAt?: string;
    updatedAt?: string;
}

export interface AddToCartRequest{
    productId: string,
    quantity: number;
}

export interface UpdateCartItemRequest{
    quantity: number;
}