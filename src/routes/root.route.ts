import {Router} from 'express';
import {put, update, remove, get} from '../controllers/hollow.controller';
import {upload} from '../controllers/bundlr.controller';
import {
  getValidator,
  putValidator,
  removeValidator,
  updateValidator,
} from '../validators/hollow.validator';
import {uploadValidator} from '../validators/bundlr.validator';

const router = Router();

// hollowdb
router.get('/get/:key', getValidator, get);
router.post('/put', putValidator, put);
router.post('/update', updateValidator, update);
router.post('/remove', removeValidator, remove);

// bundlr
router.post('/upload', uploadValidator, upload);

export default router;
