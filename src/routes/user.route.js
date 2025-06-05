import { Router } from 'express';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { upload } from '../middlewares/multer.middleware.js';
import { 
    getCurrentUser, 
    signInUser, 
    signOutUser, 
    signUpUser, 
    updateUserAvatar
} from '../controllers/user.controller.js';

const router = Router();

router.route("/signup").post(signUpUser);
router.route("/signin").post(signInUser);

router.use(verifyJWT);
router.route("/signout").post(signOutUser);
router.route("/me").get(getCurrentUser);
router.route("/updateAvatar").patch(upload.single("avatar"), updateUserAvatar);

export const userRoutes = router;