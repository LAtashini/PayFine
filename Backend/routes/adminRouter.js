import express from 'express';
import {
    registerAdmin,
    loginAdmin,
    getAdminDashboard
} from '../controllers/adminController.js';
import {
    addPolice,
    getAllPolice
} from '../controllers/policeController.js';
import upload from '../middlewares/multer.js';
import authAdmin from '../middlewares/authAdmin.js';
import { payFine, getAllIssuedFines, getPendingFinesByLicenseId } from '../controllers/issuedfineControler.js';
import { getAllDrivers } from '../controllers/driverController.js';

const adminRouter = express.Router();

// Admin Authentication Routes
adminRouter.post('/register', registerAdmin);  // Admin registration
adminRouter.post('/login', loginAdmin);        // Admin login

// Admin Dashboard
adminRouter.get('/dashboard', authAdmin, getAdminDashboard);  // Protected

// Police Management (Protected)
adminRouter.post('/add-police', authAdmin, upload.single('image'), addPolice);
adminRouter.get('/police', authAdmin, getAllPolice);

// Driver Management (Protected)
adminRouter.get('/drivers', authAdmin, getAllDrivers);

// Fine Management (Protected)
adminRouter.get('/paid-tickets', authAdmin, payFine);
adminRouter.get('/pending-tickets/:licenseId', authAdmin, getPendingFinesByLicenseId);
adminRouter.get('/all-tickets', authAdmin, getAllIssuedFines);

export default adminRouter;
