import { Router } from 'express';
import productController from './product.controller.ts';
import { authMiddleware } from '../middleware/auth.middleware.ts';
import { roleMiddleware } from '../middleware/role.middleware.ts';
import { upload } from '../middleware/upload.middleware.ts';

 

const router = Router();

router.get('/', productController.getAllProducts);

router.get('/categories/list', productController.getCategories);

router.get('/category/:category', productController.getProductsByCategory);

router.get('/:id', productController.getProductById);

router.post('/', authMiddleware, roleMiddleware, upload.single("image"), productController.createProduct);

router.put('/:id', authMiddleware, roleMiddleware, upload.single("image"), productController.updateProduct);

router.delete('/:id',authMiddleware, roleMiddleware, productController.deleteProduct);

export default router;
