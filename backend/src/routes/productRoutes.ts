import { Router } from 'express';
import { addProduct, getPartnerProducts, placeOrder } from '../controllers/productController';
import { verifyToken } from '../middlewares/authMiddleware'; // এই লাইনটি যোগ করুন

const router = Router();

// Admin Routes (আপাতত মিডলওয়্যার ছাড়াই রাখছি টেস্ট করার সুবিধার জন্য)
router.post('/admin/products', addProduct);

// Partner Routes (এখন টোকেন ছাড়া কেউ এক্সেস করতে পারবে না)
router.get('/partner/products', verifyToken, getPartnerProducts);
router.post('/partner/orders', verifyToken, placeOrder);

export default router;