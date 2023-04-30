import {Request, Response, Router} from 'express';
import {put, update, remove, get} from '../controllers/hollow.controller';
// import hollow from './hollow.route';

const router = Router();

router.post('/put', put);
router.post('/update', update);
router.post('/remove', remove);
router.get('/get', get);

export default router;
