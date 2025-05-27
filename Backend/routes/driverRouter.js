import express from 'express';
import authDriver from '../middlewares/authDriver.js';  // Import this!
import {
    changeDriverPassword, getDriverDashboard, getDriverProfile,
    getPaidFines, getProvisionDetails, registerDriver, updateDriverProfile, loginDriver,
    getPendingFines
} from '../controllers/driverController.js';
import { markFineAsPaid } from '../controllers/issuedfineControler.js';

const driverRouter = express.Router();

driverRouter.post('/dregister', registerDriver);
driverRouter.post('/login', loginDriver);
driverRouter.get('/paid/:licenseId', authDriver, getPaidFines);  // Protect!
driverRouter.get('/provisions', authDriver, getProvisionDetails);  // Optional
driverRouter.get('/dashboard/:licenseId', authDriver, getDriverDashboard);  // Protect!
driverRouter.get('/profile/:licenseId', authDriver, getDriverProfile);  // Protect!
driverRouter.patch('/profile/:licenseId', authDriver, updateDriverProfile);  // Protect!
driverRouter.patch('/change-password/:licenseId', authDriver, changeDriverPassword);  // Protect!
driverRouter.get('/pending/:licenseId', authDriver, getPendingFines);
driverRouter.patch('/fine/pay/:referenceNo', authDriver, markFineAsPaid);  // 🔥

export default driverRouter;
