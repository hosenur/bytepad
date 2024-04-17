import express from 'express';
const router = express.Router();
import { getMyPlaygrounds } from '@/controllers/playgroundController';
router.get('/', getMyPlaygrounds);
export default router;