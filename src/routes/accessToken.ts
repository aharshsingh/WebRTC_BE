import express from 'express'
import TokenController from '../controllers/accessToken'
const router = express.Router();

router.post("/issueToken", TokenController.issueToken);
router.post("/validateToken", TokenController.validateToken);
router.post("/revokeToken", TokenController.revokeToken);
export default router;

