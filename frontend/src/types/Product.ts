export interface Product{
    _id: string;
    title: string;
    description: string;
    price: number;
    category:string;
    image: string;
    stock:number;
    rating: {
        rate: number,
        count: number
    };
    createdBy: {
        _id: string;
        name: string;
        email?:string;
    }
    createdAt?:string;
    updatedAt?: string;
}

export interface ProductsResponse{
    success:boolean,
    data: Product;
}

export interface CreateProductData{
    title: string;
    description: string;
    price: number;
    category: string;
    image: File;
    stock: number;
}