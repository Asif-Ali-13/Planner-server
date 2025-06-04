import { Router } from 'express';
import { User } from '../models/user.model.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { getCurrentUser, signInUser, signOutUser, signUpUser } from '../controllers/user.controller.js';

const router = Router();

router.route("/signup").post(signUpUser);
router.route("/signin").post(signInUser);
router.route("/signout").post(signOutUser);

router.use(verifyJWT);
router.route("/me").get(getCurrentUser);

export const userRoutes = router;