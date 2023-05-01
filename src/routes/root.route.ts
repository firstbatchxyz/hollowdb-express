import {Router} from 'express';
import {put, update, remove, get} from '../controllers/hollow.controller';
// import {upload} from '../controllers/bundlr.controller';
import {schemas} from '../schemas/schema';
import {validate} from '../middlewares/validator';

const router = Router();

router.post('/put', validate(schemas.put, 'body'), put);
router.post('/update', validate(schemas.update, 'body'), update);
router.post('/remove', validate(schemas.remove, 'body'), remove);
router.get('/get/:key', validate(schemas.get, 'params'), get);

// router.post('/upload', upload);

export default router;
