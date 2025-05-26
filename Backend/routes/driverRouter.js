import express from 'express'
import { changeDriverPassword, getDriverDashboard, getDriverProfile, getPaidFines, getProvisionDetails, registerDriver, updateDriverProfile } from '../controllers/driverController.js'
import { loginDriver } from '../controllers/driverController.js';

const driverRouter = express.Router()

driverRouter.post('/dregister', registerDriver)
driverRouter.post('/login', loginDriver);
driverRouter.get('/paid/:licenseId', getPaidFines);
driverRouter.get('/provisions', getProvisionDetails);
driverRouter.get('/dashboard/:licenseId', getDriverDashboard);
driverRouter.get('/profile/:licenseId', getDriverProfile);
driverRouter.patch('/profile/:licenseId', updateDriverProfile);
driverRouter.patch('/change-password/:licenseId', changeDriverPassword);


export default driverRouter;