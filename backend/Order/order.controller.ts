import type { Request, Response } from 'express';
import orderRepository from './order.repository.ts';
import cartRepository from '../Cart/cart.repository.ts';
import productRepository from '../Product/product.repository.ts';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import dotenv from 'dotenv';
dotenv.config();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY || "",
  key_secret: process.env.RAZORPAY_SECRET || "",
})





class OrderController {
    

    async createOrderFromCart(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?._id;

      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'User not authenticated',
        });
        return;
      }

      const cart = await cartRepository.lockForCheckout(userId);
      
      if (!cart) {
        console.log(`Lock failed for user ${userId}. Checking cart status...`);
        const currentCart = await cartRepository.findByUserId(userId);
        console.log(`Current cart status for ${userId}:`, currentCart ? { itemCount: currentCart.items.length, isCheckingOut: currentCart.isCheckingOut } : 'NOT_FOUND');

        if (!currentCart || currentCart.items.length === 0) {
          res.status(400).json({
            success: false,
            message: 'Cart is empty',
          });
        } else {
          res.status(400).json({
            success: false,
            message: 'Checkout is already in progress. Please try again or refresh your cart by adding/removing an item.',
          });
        }
        return;
      }

      try {
        // stock verify for all items in cart
        for (const item of cart.items) {
          const product = await productRepository.findById(item.productId.toString());
          
          if (!product) {
            await cartRepository.unlockCheckout(userId);
            res.status(404).json({
              success: false,
              message: `Product ${item.title} not found`,
            });
            return;
          }

          if (product.stock < item.quantity) {
            await cartRepository.unlockCheckout(userId);
            res.status(400).json({
              success: false,
              message: `Insufficient stock for ${item.title}`,
              availableStock: product.stock,
            });
            return;
          }
        }

        const order = await orderRepository.create({
          userId,
          items: cart.items,
          totalAmount: cart.totalAmount,
          status: 'confirmed',
        });

        // sare items ka stock updation
        for (const item of cart.items) {
          await productRepository.updateStock(item.productId.toString(), item.quantity);
        }

        await cartRepository.clearCart(userId);

        res.json({
          success: true,
          message: 'Order placed successfully',
          data: order,
        });
      } catch (innerError) {
        await cartRepository.unlockCheckout(userId);
        throw innerError;
      }
    } catch (error: any) {
      console.error('Error creating order from cart:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create order',
        error: error.message,
      });
    }
  }




    async buyNow(req: Request, res: Response): Promise<void> {
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



      const product = await productRepository.findById(productId);

      if (!product) {
        res.status(404).json({
          success: false,
          message: 'Product not found',
        });
        return;
      }




      if (product.stock < quantity) {
        res.status(400).json({
          success: false,
          message: 'Insufficient stock',
          availableStock: product.stock,
        });
        return;
      }



      const orderItem = {
        productId: product._id,
        title: product.title,
        price: product.price,
        quantity: parseInt(quantity),
        image: product.image,
      };



      const totalAmount = product.price * quantity;



      const order = await orderRepository.create({
        userId,
        items: [orderItem],
        totalAmount,
        status: 'confirmed',
      });


//stock update
      await productRepository.updateStock(productId, quantity);

      res.json({
        success: true,
        message: 'Order placed successfully',
        data: order,
      });
    } catch (error: any) {
      console.error('Error in buy now:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create order',
        error: error.message,
      });
    }
  }


  async getOrders(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?._id;

      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'User not authenticated',
        });
        return;
      }


      const { orders, total } = await orderRepository.findByUserId(
        userId
      );

      res.json({
        success: true,
        data: orders,
      });
    } catch (error: any) {
      console.error('Error fetching orders:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch orders',
        error: error.message,
      });
    }
  }



  async cancelOrder(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?._id;
      const { orderId } = req.params;

      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'User not authenticated',
        });
        return;
      }

      if (!orderId || typeof orderId !== 'string') {
        res.status(400).json({
          success: false,
          message: 'Valid Order ID is required',
        });
        return;
      }

      const order = await orderRepository.findByOrderId(orderId);

      if (!order) {
        res.status(404).json({
          success: false,
          message: 'Order not found',
        });
        return;
      }

      
      if (order.userId._id.toString() !== userId) {
        res.status(403).json({
          success: false,
          message: 'Access denied',
        });
        return;
      }

      
      if (order.status === 'cancelled') {
        res.status(400).json({
          success: false,
          message: 'Order already cancelled',
        });
        return;
      }

     
      const updatedOrder = await orderRepository.updateStatus(orderId, 'cancelled');

      

   //restoring stock
      for (const item of order.items) {
        await productRepository.restoreStock(item.productId.toString(), item.quantity);
      }

      

      res.json({
        success: true,
        message: 'Order cancelled successfully',
        data: updatedOrder,
      });


    } catch (error: any) {
      console.error('Error cancelling order:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to cancel order',
        error: error.message,
      });
    }
  }
 

  async createRazorpayOrder(req: Request, res:Response):Promise<void>{
    try{
      const userId = req.user?._id;

      if(!userId){
        res.status(401).json({
          success:false, 
          message:'User not authenticated'
        });
        return;
      }

      const cart = await cartRepository.findByUserId(userId);
      if(!cart || cart.items.length === 0){
        res.status(400).json({success: false, message: 'Cart is empty'})
        return;
      }

      const options = {
        amount: Math.round(cart.totalAmount * 100),
        currency: 'INR',
        receipt: `receipt_${Date.now()}`,
      };

      const razorpayOrder = await razorpay.orders.create(options);

      res.json({
        success:true,
        order_id: razorpayOrder.id,
        currency: razorpayOrder.currency,
        amount: razorpayOrder.amount,
      });

    }catch(error: any){
      console.error('Error creating Razorpay order : ', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create Razorpay order', error:error.message
      });
    }
  }


  async verifyPayment(req:Request, res:Response):Promise<void>{
    try{
      const userId = req.user?._id;
      const {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature
      } = req.body;

      if(!userId){
        res.status(401).json({
          success: false,
          message: 'User not authenticated'
        });
        return;
      }

      const sign = razorpay_order_id + "|" + razorpay_payment_id;

      const expectedSign = crypto
        .createHmac("sha256", process.env.RAZORPAY_SECRET || "")
        .update(sign.toString())
        .digest("hex");

      if(razorpay_signature !== expectedSign){
        res.status(400).json({
          success:false, message:"Invalid payment signature"
        });
        return;
      }  
      
      const cart = await cartRepository.findByUserId(userId);

      if(!cart){
        res.status(400).json({
          success:false,
          message:"Cart not found"
        });
        return;
      }

      const order = await orderRepository.create({
        userId,
        items: cart.items,
        totalAmount: cart.totalAmount,
        status:'confirmed',
        paymentDetails: {
          razorpay_order_id,
          razorpay_payment_id,
          razorpay_signature,
        }
      })

      for(const item of cart.items){ //stock updaton
        await productRepository.updateStock(item.productId.toString(), item.quantity);
      }

      await cartRepository.clearCart(userId);

      res.json({
        success: true,
        message: 'Payment verified and order placed successfully',
        data: order,
      });

    }catch(error: any){
      console.error("Error verifying payment: ",error);
      res.status(500).json({
        success: false,
        message:'Payment verification failure', error:error.message
      });
    }
  }


  
  
};

export default new OrderController();