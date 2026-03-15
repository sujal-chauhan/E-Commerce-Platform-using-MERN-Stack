import { Router } from 'express';
import orderController from './order.controller.ts';
import { authMiddleware } from '../middleware/auth.middleware.ts';

const router = Router();

router.use(authMiddleware);

router.post('/checkout', orderController.createOrderFromCart);

router.post('/buy-now', orderController.buyNow);

router.get('/', orderController.getOrders);

router.put('/:orderId/cancel', orderController.cancelOrder); 


router.post('/razorpay/order', orderController.createRazorpayOrder);
router.post('/razorpay/verify', orderController.verifyPayment);


export default router;
