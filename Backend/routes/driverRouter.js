import express from 'express';
import authDriver from '../middlewares/authDriver.js';  
import {
    changeDriverPassword, getDriverDashboard, getDriverProfile,
    getPaidFines, getProvisionDetails, registerDriver, updateDriverProfile, loginDriver,
    getPendingFines
} from '../controllers/driverController.js';
import { markFineAsPaid } from '../controllers/issuedfineControler.js';

const driverRouter = express.Router();

driverRouter.post('/dregister', registerDriver);
driverRouter.post('/login', loginDriver);
driverRouter.get('/paid/:licenseId', authDriver, getPaidFines);  
driverRouter.get('/provisions', authDriver, getProvisionDetails);  
driverRouter.get('/dashboard/:licenseId', authDriver, getDriverDashboard);  
driverRouter.get('/profile/:licenseId', authDriver, getDriverProfile);  
driverRouter.patch('/profile/:licenseId', authDriver, updateDriverProfile);  
driverRouter.patch('/change-password/:licenseId', authDriver, changeDriverPassword);  
driverRouter.get('/pending/:licenseId', authDriver, getPendingFines);
driverRouter.patch('/fine/pay/:referenceNo', authDriver, markFineAsPaid);  

export default driverRouter;
