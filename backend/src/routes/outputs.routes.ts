import { Router } from 'express';
import {
  getOutputs,
  getWeeklyOutputs,
  getOutputsByDateRange,
  createOutput,
  deleteOutput,
  weeklyReset,
  getWeeklySummary,
} from '../controllers/output.controller.js';

const router = Router();

// Output routes
router.get('/', getOutputs);
router.get('/weekly', getWeeklyOutputs);
router.get('/weekly-summary', getWeeklySummary);
router.get('/by-date-range', getOutputsByDateRange);
router.post('/', createOutput);
router.delete('/:id', deleteOutput);
router.delete('/reset/weekly', weeklyReset);

export default router;
