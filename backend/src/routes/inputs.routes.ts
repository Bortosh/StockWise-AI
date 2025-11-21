import { Router } from 'express';
import {
  getInputs,
  getInputsByDateRange,
  createInput,
  deleteInput,
} from '../controllers/input.controller.js';

const router = Router();

// Input routes
router.get('/', getInputs);
router.get('/by-date-range', getInputsByDateRange);
router.post('/', createInput);
router.delete('/:id', deleteInput);

export default router;
