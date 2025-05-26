import express from 'express';
import { createRevenue, getAllRevenue, getRevenueByVehicleNo, deleteRevenue, getRevenueByLicenseNumber } from '../controllers/revenueController.js';

const revenueRouter = express.Router();

revenueRouter.post('/create', createRevenue);
revenueRouter.get('/all', getAllRevenue);
revenueRouter.get('/:vehicleNo', getRevenueByVehicleNo);
revenueRouter.delete('/:id', deleteRevenue);
revenueRouter.get('/revenue/:licenseNumber', getRevenueByLicenseNumber);

export default revenueRouter;
