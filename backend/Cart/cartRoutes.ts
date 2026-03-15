import { Router } from 'express';
import cartController from './cart.controller.ts';
import { authMiddleware } from '../middleware/auth.middleware.ts';

const router = Router();

router.use(authMiddleware);

router.get('/', cartController.getCart);

// router.get('/count', cartController.getCartCount);

router.post('/', cartController.addToCart);

router.put('/:productId', cartController.updateCartItem);

router.delete('/:productId', cartController.removeCartItem);

router.delete('/', cartController.clearCart);

export default router;