import type { Request, Response } from 'express';
import cartRepository from './cart.repository.ts';
import productRepository from '../Product/product.repository.ts';

class CartController{

    async getCart(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?._id;

      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'User is not authenticated brother',
        });
        return;
      }

      let cart = await cartRepository.findByUserId(userId);

      if (!cart) {
        cart = await cartRepository.create(userId);
      }

      res.json({
        success: true,
        data: cart,
      });
    } catch (error: any) {
      console.error('Edrror fetching cart:', error);
      res.status(500).json({
        success: false,
        message: 'failed to fetch cart',
        error: error.message,
      });
    }
  }


  async addToCart(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?._id;
      const { productId, quantity = 1 } = req.body;

      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'User not authenticated',
        });
        return;
      }

      if (!productId) {
        res.status(400).json({
          success: false,
          message: 'Product ID is required',
        });
        return;
      }

      // verify krlo product exist krta hai ya nhi
      const product = await productRepository.findById(productId);

      if (!product) {
        res.status(404).json({
          success: false,
          message: 'Product not found',
        });
        return;
      }

    
      

      if (product.stock < quantity) { //stock availability
        res.status(400).json({
          success: false,

          message: 'Insufficient stock',
          availableStock: product.stock,
        });
        return;
      }

      const cartItem = {
        productId: product._id,
        title: product.title,
        price: product.price,
        quantity: parseInt(quantity),
        image: product.image,
        stock: product.stock,
      };

      const cart = await cartRepository.addItem(userId, cartItem);

      res.json({
        success: true,
        message: 'Item succeffully added to cart',
        data: cart,
      });
    } catch (error: any) {
      console.error('error adding to cart:', error);
      res.status(500).json({
        success: false,
        message: 'failed to add item to cart',
        error: error.message,
      });
    }
  }



  async updateCartItem(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?._id;
      const { productId } = req.params;
      const { quantity } = req.body;

      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'user is not authenticated',
        });
        return;
      }

      if (!productId || typeof productId !== 'string') {
        res.status(400).json({
          success: false,
          message: 'Valid Product ID is required',
        });
        return;
      }

      if (quantity === undefined || quantity < 0) {
        res.status(400).json({
          success: false,
          message: 'valid quantity is required',
        });
        return;
      }

      if (quantity > 0) {
        const product = await productRepository.findById(productId);
        
        if (product && product.stock < quantity) {
          res.status(400).json({
            success: false,
            message: 'Insufficient stock',
            availableStock: product.stock,
          });
          return;
        }
      }

      const cart = await cartRepository.updateItemQuantity(
        userId,
        productId,
        parseInt(quantity)
      );

      res.json({
        success: true,
        message: quantity === 0 ? 'Item removed from cart' : 'Cart updated',
        data: cart,
      });
    } catch (error: any) {
      console.error('Error updating cart:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update cart',
        error: error.message,
      });
    }
  }



  async removeCartItem(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?._id;
      const { productId } = req.params;

      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'User not authenticated',
        });
        return;
      }

      if (!productId || typeof productId !== 'string') {
        res.status(400).json({
          success: false,
          message: 'Valid Product ID is required',
        });
        return;
      }

      const cart = await cartRepository.removeItem(userId, productId);

      res.json({
        success: true,
        message: 'Item removed from cart',
        data: cart,
      });
    } catch (error: any) {
      console.error('Error removing cart item:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to remove item',
        error: error.message,
      });
    }
  }


   async clearCart(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?._id;

      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'User is not authenticated',
        });
        return;
      }

      const cart = await cartRepository.clearCart(userId);

      res.json({
        success: true,
        message: 'cart cleared successfully',
        data: cart,
      });
    } catch (error: any) {
      console.error('Error clearing cart:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to clear cart',
        error: error.message,
      });
    }
  }


  // async getCartCount(req: Request, res: Response): Promise<void> {
  //   try {
  //     const userId = req.user?._id;

  //     if (!userId) {
  //       res.status(401).json({
  //         success: false,
  //         message: 'User not authenticated',
  //       });
  //       return;
  //     }

  //     const count = await cartRepository.getItemCount(userId);

  //     res.json({
  //       success: true,
  //       count,
  //     });
  //   } catch (error: any) {
  //     console.error('Error fetching cart count:', error);
  //     res.status(500).json({
  //       success: false,
  //       message: 'Failed to fetch cart count',
  //       error: error.message,
  //     });
  //   }
  // }

};

export default new CartController();



