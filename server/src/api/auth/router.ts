import { Router } from "express";
import passport from "passport";
import AuthController from "./controller";

const router = Router();

const controller = new AuthController();

router.post("/credentials/signup", controller.signup.bind(controller));
router.post("/credentials/login", controller.login.bind(controller));
router.post(
    "/credentials/test_JWT_STRATEGY",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
        res.send(req.user);
    }
);

router.get(
    "/google",
    passport.authenticate("google", {
        scope: ["email", "profile"],
    })
);
router.get(
    "/google/callback",
    passport.authenticate("google", {
        session: false,
        failureRedirect: "/failedLogin",
    }),
    controller.googleLogin.bind(controller)
);

export default router;
