import express from 'express'
import {clientController} from '../controllers/clientController'
const router = express.Router();

router.post("/createsession", clientController.createFullSession);

export default router;

