import express from 'express'
import UserController from '../controllers/user'
const router = express.Router();

router.post("/createExternalUser", UserController.createExternalUser);
router.post("/createInternalUser", UserController.createInternalUser);
router.post("/getUserById", UserController.getUserById);
export default router;

