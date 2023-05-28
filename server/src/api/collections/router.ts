import { Router } from "express";
import CollectionsController from "./controller";
import passport from "passport";

const router = Router();

const controller = new CollectionsController();

router.post("/", passport.authenticate("jwt", { session: false }), controller.create.bind(controller));
router.get("/:id", passport.authenticate("jwt", { session: false }), controller.retrieveOne.bind(controller));
router.get("/", passport.authenticate("jwt", { session: false }), controller.retrieveAll.bind(controller));

export default router;
