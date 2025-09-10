import express from 'express'
import OrganisationController from '../controllers/organisation'
const router = express.Router();

router.post("/create", OrganisationController.createOrganisation);
export default router;

