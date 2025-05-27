import Notification from '../models/notification.js';
import issuedfineModel from '../models/IssuedFineModels.js';
import fineModel from '../models/fineModel.js';

// Add notification based on issued fine
export const addNotification = async (req, res) => {
    try {
        const { referenceNo } = req.body;

        // Find fine details by referenceNo
        const fine = await issuedfineModel.findOne({ referenceNo });
        if (!fine) return res.status(404).json({ message: "Fine not found" });

        // Fetch provision details (based on fine.provisionId or provision field)
        const fineDetails = await fineModel.findOne({ provisionId: fine.provision });
        if (!fineDetails) return res.status(404).json({ message: "Provision details not found" });

        // Create notification with provision details directly
        const newNotification = new Notification({
            nic: fine.nic,
            referenceNo: fine.referenceNo,
            provision: fineDetails.provision,  // Name of provision (e.g., "Speeding")
            provisionAmount: fineDetails.fineAmount,  // Amount of provision
            vehicleNumber: fine.vehicleNo,
            issuedDate: fine.issuedDate,
            courtDate: fine.courtDate,
            amount: fine.amount,
            status: fine.status
        });

        await newNotification.save();
        res.status(201).json({ message: "Notification added", notification: newNotification });
    } catch (error) {
        console.error("Error adding notification:", error);
        res.status(500).json({ message: "Error adding notification", error: error.message });
    }
};

// Fetch notifications by NIC
export const getNotificationsByNIC = async (req, res) => {
    try {
        const { nic } = req.params;
        const notifications = await Notification.find({ nic })
            .populate('provision', 'name amount')  // Replace 'name amount' with the fields you need
            .exec();
        res.status(200).json(notifications);
    } catch (error) {
        console.error("Error fetching notifications:", error);
        res.status(500).json({ message: "Error fetching notifications", error: error.message });
    }
};
