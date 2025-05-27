import express from 'express';
import { addNotification, getNotificationsByNIC } from '../controllers/notificationController.js';

const router = express.Router();

router.post('/add', addNotification);
router.get('/fetch/:nic', getNotificationsByNIC);

export default router;
