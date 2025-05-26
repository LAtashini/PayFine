import issuedfineModel from "../models/IssuedFineModels.js";
import fineModel from "../models/fineModel.js";
import policeModel from "../models/policeModel.js";

// 1. Police adds a new issued fine
export const addIssuedFine = async (req, res) => {
    try {
        const {
            driverName,
            address,
            licenseId,       // ✅ Match frontend's `licenseId`
            vehicleNo,       // ✅ Match frontend's `vehicleNo`
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

        // Generate a unique reference number
        const referenceNo = `REF-${Date.now()}`;

        const newFine = new issuedfineModel({
            referenceNo,
            policeId,
            licenseId,         // ✅ Now correctly assigned
            vehicleNo,         // ✅ Now correctly assigned
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
        res.status(201).json({ message: "Fine issued successfully", fine: newFine });
    } catch (error) {
        console.error("Error issuing fine:", error);
        res.status(500).json({ message: "Error issuing fine", error });
    }
};

// 2. Get all fines (admin or police)
export const getAllIssuedFines = async (req, res) => {
    try {
        const fines = await issuedfineModel.find()
            .populate("provision")
            .populate("policeId");

        res.status(200).json(fines);
    } catch (error) {
        res.status(500).json({ message: "Error fetching fines", error });
    }
};

// 3. Get fines by license ID (driver-specific)
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

// 4. Mark fine as paid
export const payFine = async (req, res) => {
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
        res.status(500).json({ message: "Error updating fine", error });
    }
};

// 5. Notify driver (change status to "notified")
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

// 6. Get reported fines (police dashboard)
export const getReportedFines = async (req, res) => {
    try {
        const { policeId } = req.params;
        const fines = await issuedfineModel.find({ policeId }).populate("provision");

        const reportedFineCount = fines.length;
        const reportedFineAmount = fines.reduce((total, fine) => total + fine.totalAmount, 0);

        res.status(200).json({
            fines, // Add this line to include fines
            count: reportedFineCount,
            amount: reportedFineAmount,
            station: fines[0]?.station || null,
            court: fines[0]?.court || null
        });
    } catch (error) {
        res.status(500).json({ message: "Error fetching reported fines", error });
    }
};


// 7. Get pending (unpaid) fines by license ID
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

// Get a fine provision by name
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




