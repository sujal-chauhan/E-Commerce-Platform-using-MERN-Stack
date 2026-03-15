import React, { useEffect, useState } from 'react'
// import products from '../dummydata/data.json'
import ProductCard from './ProductCard'
// import { useNavigate } from 'react-router-dom'
import type { Product } from '../../types/Product'
import { getAllProducts } from '../../services/api'
import "./ProductList.css"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faMagnifyingGlass} from "@fortawesome/free-solid-svg-icons"
import { Bounce, toast } from 'react-toastify'




const ProductList: React.FC = () => {

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(()=>{
    fetchProducts();
  },[]);

  const fetchProducts = async() =>{
    try{
      setLoading(true) ;
      const response = await getAllProducts();
      setProducts(response.data.data.products)
    }catch(err){
      setError('Failed to fetch products')
      toast.error("Failed to fetch products",{
        position: "top-center",
        autoClose: 5000,
        transition: Bounce
      })
    }finally{
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(product => 
    product.title.toLowerCase().includes(searchTerm.toLowerCase())
  );
 
  if(loading){
    return(
      <div className="products-page">
        <div className="products-header">
          <h1>Everything you need, all in one place</h1>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', padding: '50px', height: '100vh' }}>
          <p className="center-text">Loading products...</p>
        </div>
      </div>
    )
  }

  if(error){
    return(
      <div className="products-page">
        <div className="products-header">
          <h1>Everything you need, all in one place</h1>
        </div>
        <p className="center-text">{error}</p>
      </div>
    )
  }

  return (
    <div className="products-page">
      <div className="products-header">
        <h1>Everything you need, all in one place</h1>
        <div className="search-container">
          <FontAwesomeIcon icon={faMagnifyingGlass}/>
          <input 
            type="text" 
            placeholder="Search products..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
      </div>
      
      <div className="products-grid">
        {
          filteredProducts.length > 0 ? (
            filteredProducts.map((product, index)=>(
              <ProductCard
                key = {index}
                product={product}
              />
            ))
          ) : (
            <p className="no-products">No products found matching "{searchTerm}"
            </p>
          )
        }
      </div>
    </div>
  )
}

export default ProductList