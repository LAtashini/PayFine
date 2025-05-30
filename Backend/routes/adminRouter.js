import express from 'express';
import {
    registerAdmin,
    loginAdmin,
    getAdminDashboard,
    getPaidFines,
    downloadTicket,
    getPendingFiness
} from '../controllers/adminController.js';
import {
    addPolice,
    getAllPolice
} from '../controllers/policeController.js';
import upload from '../middlewares/multer.js';
import authAdmin from '../middlewares/authAdmin.js';
import { getAllIssuedFines, getPendingFinesByLicenseId } from '../controllers/issuedfineControler.js';
import { getAllDrivers, getPendingFines } from '../controllers/driverController.js';

const adminRouter = express.Router();


adminRouter.post('/register', registerAdmin);  
adminRouter.post('/login', loginAdmin);        


adminRouter.get('/dashboard', authAdmin, getAdminDashboard);  


adminRouter.post('/add-police', authAdmin, upload.single('image'), addPolice);
adminRouter.get('/police', authAdmin, getAllPolice);


adminRouter.get('/drivers', authAdmin, getAllDrivers);


adminRouter.get('/pending-tickets', authAdmin, getPendingFiness);
adminRouter.get('/all-tickets', authAdmin, getAllIssuedFines);
adminRouter.get('/paid-tickets', authAdmin, getPaidFines);
adminRouter.get('/download-ticket/:id', authAdmin, downloadTicket);

export default adminRouter;
