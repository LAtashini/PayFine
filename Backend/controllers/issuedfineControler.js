import issuedfineModel from "../models/IssuedFineModels.js";
import fineModel from "../models/fineModel.js";
import policeModel from "../models/policeModel.js";
import mongoose from "mongoose";  
import Notification from '../models/notification.js';


export const addIssuedFine = async (req, res) => {
    try {
        const {
            driverName,
            address,
            licenseId,
            vehicleNo,
            vehicleClass,
            nic,
            policeId,
            officerName,
            court,
            issuedDate,
            issuedTime,
            expiredDate,
            courtDate,
            place,
            provision,
            amount,
            additionalProvisions,
            totalAmount
        } = req.body;

        const referenceNo = `REF-${Date.now()}`;

        const newFine = new issuedfineModel({
            referenceNo,
            policeId,
            licenseId,
            vehicleNo,
            issuedDate,
            issuedTime,
            expiredDate,
            court,
            courtDate,
            provision,
            amount,
            additionalProvisions,
            totalAmount,
            driverName,
            address,
            vehicleClass,
            nic,
            officerName,
            place,
            status: "unpaid"
        });

        await newFine.save();

        const notification = new Notification({
            nic: nic,
            referenceNo: referenceNo,
            provision: provision,
            vehicleNumber: vehicleNo,
            issuedDate: issuedDate,
            courtDate: courtDate,
            amount: amount,
            status: "unpaid"
        });

        await notification.save();

        res.status(201).json({
            message: "Fine issued and notification created successfully",
            fine: newFine,
            notification: notification
        });

    } catch (error) {
        console.error("Error issuing fine:", error);
        res.status(500).json({ message: "Error issuing fine", error });
    }
};


export const getAllIssuedFines = async (req, res) => {
    try {
        const { status, fromDate, toDate } = req.query;
        const filter = {};

        
        if (status) {
            filter.status = status;  
        }

        
        if (fromDate && toDate) {
            filter.issuedDate = {
                $gte: new Date(fromDate),
                $lte: new Date(toDate)
            };
        }

        const fines = await issuedfineModel.find(filter)
            .populate("provision")
            .populate("policeId");

        res.status(200).json(fines);
    } catch (error) {
        res.status(500).json({ message: "Error fetching fines", error });
    }
};



export const getFinesByLicenseId = async (req, res) => {
    try {
        const { licenseId } = req.params;
        const fines = await issuedfineModel.find({ licenseId })
            .populate("provision")
            .populate("policeId");

        res.status(200).json(fines);
    } catch (error) {
        res.status(500).json({ message: "Error fetching fines", error });
    }
};

export const markFineAsPaid = async (req, res) => {
    try {
        const { referenceNo } = req.params;

        const fine = await issuedfineModel.findOne({ referenceNo });
        if (!fine) {
            return res.status(404).json({ message: "Fine not found" });
        }

        
        fine.status = "paid";
        fine.paidDate = new Date();

        await fine.save();
        res.status(200).json({ message: "Fine marked as paid", fine });
    } catch (error) {
        console.error("Error marking fine as paid:", error);
        res.status(500).json({ message: "Error marking fine as paid", error: error.message });
    }
};


export const notifyDriver = async (req, res) => {
    try {
        const { referenceNo } = req.params;

        const fine = await issuedfineModel.findOne({ referenceNo });
        if (!fine) {
            return res.status(404).json({ message: "Fine not found" });
        }

        fine.status = "notified";
        fine.notified = true;

        await fine.save();
        res.status(200).json({ message: "Driver notified successfully", fine });
    } catch (error) {
        res.status(500).json({ message: "Error notifying driver", error });
    }
};


// export const getReportedFines = async (req, res) => {
//     try {
//         const { policeId } = req.params;
//         const fines = await issuedfineModel.find({ policeId }).populate("provision");

//         const reportedFineCount = fines.length;
//         const reportedFineAmount = fines.reduce((total, fine) => total + fine.totalAmount, 0);

//         res.status(200).json({
//             fines, 
//             count: reportedFineCount,
//             amount: reportedFineAmount,
//             station: fines[0]?.station || null,
//             court: fines[0]?.court || null
//         });
//     } catch (error) {
//         res.status(500).json({ message: "Error fetching reported fines", error });
//     }
// };


export const getReportedFines = async (req, res) => {
    try {
        const { policeId } = req.params;

        
        if (!mongoose.Types.ObjectId.isValid(policeId)) {
            return res.status(400).json({ message: "Invalid policeId format" });
        }

        const fines = await issuedfineModel.find({
            policeId: mongoose.Types.ObjectId(policeId)
        }).populate("policeId");

        const reportedFineCount = fines.length;
        const reportedFineAmount = fines.reduce((total, fine) => total + fine.totalAmount, 0);

        res.status(200).json({
            fines,
            count: reportedFineCount,
            amount: reportedFineAmount,
            station: fines[0]?.station || null,
            court: fines[0]?.court || null
        });
    } catch (error) {
        console.error("Error fetching reported fines:", error);
        res.status(500).json({ message: "Error fetching reported fines", error: error.message });
    }
};



export const getPendingFinesByLicenseId = async (req, res) => {
    try {
        const { licenseId } = req.params;

        const pendingFines = await issuedfineModel.find({
            licenseId,
            status: "unpaid"
        }).populate("provision").populate("policeId");

        res.status(200).json(pendingFines);
    } catch (error) {
        res.status(500).json({ message: "Error fetching pending fines", error });
    }
};


export const getProvisionByName = async (req, res) => {
    try {
        const { name } = req.params;
        // const provision = await fineModel.findOne({ name: name });
        const provision = await fineModel.findOne({ provision: name });

        if (!provision) {
            return res.status(404).json({ message: "Provision not found" });
        }
        res.status(200).json(provision);
    } catch (error) {
        console.error("Error fetching provision:", error);
        res.status(500).json({ message: "Error fetching provision", error: error.message });
    }
};




