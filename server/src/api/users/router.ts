import { Router } from 'express';
import UsersController from './controller';

const router = Router();

const controller = new UsersController();

router.get('/:id', controller.retrieveOne.bind(controller));
router.get('/', controller.retrieveAll.bind(controller));

export default router;
