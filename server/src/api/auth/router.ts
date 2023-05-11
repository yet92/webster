import {Router} from "express";
import AuthController from "./controller";

const router = Router();

const controller = new AuthController();
controller.setup(router);

export default router;