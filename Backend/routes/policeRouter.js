import express from 'express';
import { getPoliceDashboard, policeLogin, getPoliceProfile, updatePoliceProfile } from '../controllers/policeController.js';
import { addIssuedFine, getProvisionByName, getReportedFines } from '../controllers/issuedfineControler.js';
import { getRevenueByLicenseNumber } from '../controllers/revenueController.js';
import { getReportedFinesByOfficerName } from '../controllers/policeController.js';

const policeRouter = express.Router();


policeRouter.get('/dashboard/:id', getPoliceDashboard);


policeRouter.post('/login', policeLogin);


policeRouter.get('/profile/:id', getPoliceProfile);


policeRouter.put('/profile/:id', updatePoliceProfile);

policeRouter.post('/issue-fine', addIssuedFine);

policeRouter.get('/reported-fine/:licenseId', getReportedFines);

policeRouter.get('/provisionByName/:name', getProvisionByName);

policeRouter.get('/revenue/:licenseNumber', getRevenueByLicenseNumber);


policeRouter.get('/reported-fine-by-officer/:officerName', getReportedFinesByOfficerName);

export default policeRouter;
