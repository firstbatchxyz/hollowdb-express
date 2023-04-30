import {Router} from 'express';
import {put, update, remove, get} from '../controllers/hollow.controller';

const router = Router();

router.put('/hollow', put);
router.patch('/hollow', update);
router.delete('/hollow', remove);
router.get('/hollow', get);

export default router;
