import React from 'react'
import { type Product } from '../../types/Product' 
import './ProductCard.css'
import { useNavigate } from 'react-router-dom';
import { Bounce, toast } from 'react-toastify';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { addToCart } from '../../redux/cartSlice';

interface ProductCardProps{
    product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({product}) => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const {loading, productAdding} = useAppSelector((state)=> state.cart)

    const image = `http://localhost:5000/${product.image}`

    const handleAddToCart = async(e: React.MouseEvent) =>{
        e.stopPropagation();

        try{
            await dispatch(addToCart({productId: product._id})).unwrap();
            toast.success("Successfully added to cart",{
                position: "top-center",
                autoClose: 2000,
                transition: Bounce
            })
        }catch(err:any){
            console.error("Failed to add to cart", err)
            toast.error("Failed to add to cart",{
                position: "top-center",
                autoClose: 2000,
                transition: Bounce,
            }) 
        }
    }

    return (
    <div 
        className='product-card'
        onClick={()=> navigate(`/products/${product._id}`)}
    >
        <div className="product-card-image">
            <img src={image} alt={product.title} />
        </div>

        <div className="product-card-body">
            <h3>{product.title}</h3>

            <p className="product-description">
                {product.description.length > 80
                    ? product.description.slice(0, 80) + '...'
                    : product.description
                }
            </p>
            
            <div className="product-card-footer">
                <strong>
                    <strong>${product.price.toFixed(2)}</strong>
                </strong>

                <div 
                    className='add-to-cart-button'
                >
                    <button
                        onClick={handleAddToCart}
                        disabled={product.stock <= 0 || loading && productAdding === product._id}
                        
                    >
                        {product.stock <= 0 ? 'Out of Stock' : (loading && productAdding === product._id) ? 'Adding...' : 'Add to Cart'}
                    </button>
                </div>

                <span className='rating'>
                    {product.rating.rate}
                </span>
            </div>
        </div>
    </div>
  )
}

export default ProductCard