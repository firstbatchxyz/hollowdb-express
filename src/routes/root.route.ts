import {Router} from 'express';
import {put, update, remove, get} from '../controllers/hollow.controller';
import {
  getValidator,
  putValidator,
  removeValidator,
  updateValidator,
} from '../validators/hollow.validator';

const router = Router();

router.get('/get/:key', getValidator, get);
router.post('/put', putValidator, put);
router.post('/update', updateValidator, update);
router.post('/remove', removeValidator, remove);

export default router;
