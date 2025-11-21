import { Router } from 'express';
import {
  getProducts,
  getProductsByArea,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/product.controller';

const router = Router();

// Product routes
router.get('/', getProducts);
router.get('/area/:almacen', getProductsByArea);
router.get('/:id', getProduct);
router.post('/', createProduct);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);

export default router;
