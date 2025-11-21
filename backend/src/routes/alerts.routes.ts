import { Router } from 'express';
import {
  getAlerts,
  getAlertsByArea,
  formatWhatsAppMessage,
  getAlertsSummary,
} from '../controllers/alert.controller.js';

const router = Router();

// Alert routes
router.get('/', getAlerts);
router.get('/by-area/:almacen', getAlertsByArea);
router.get('/summary', getAlertsSummary);
router.post('/format-whatsapp', formatWhatsAppMessage);

export default router;
