import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"; // Optional if using auth
import driverModel from "../models/driverModel.js";
import issuedfineModel from "../models/IssuedFineModels.js";
import fineModel from "../models/fineModel.js";

// 1. Register a new driver
export const registerDriver = async (req, res) => {
    try {
        const {
            name,
            email,
            password,
            confirmPassword,
            image,
            Address,
            LicenseNumber,
            LicenseIssedDate,
            LicenseExpiredDate,
            IDNumber,
            phoneNumber
        } = req.body;

        // Check if passwords match
        if (password !== confirmPassword) {
            return res.status(400).json({ message: "Passwords do not match" });
        }

        // Check if the driver already exists
        const existingDriver = await driverModel.findOne({ email });
        if (existingDriver) {
            return res.status(400).json({ message: "Driver already registered with this email" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new driver object
        const newDriver = new driverModel({
            role: "driver",
            name,
            email,
            password: hashedPassword,
            image: image || null,
            Address,
            LicenseNumber,
            LicenseIssedDate,
            LicenseExpiredDate,
            IDNumber,
            phoneNumber
        });

        // Save driver to database
        await newDriver.save();

        // Generate JWT token
        const token = jwt.sign({ id: newDriver._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

        res.status(201).json({
            message: "Driver registered successfully",
            driver: {
                id: newDriver._id,
                name: newDriver.name,
                email: newDriver.email,
                LicenseNumber: newDriver.LicenseNumber,
                IDNumber: newDriver.IDNumber
            },
            token
        });
    } catch (error) {
        console.error("Error registering driver:", error);
        res.status(500).json({ message: "Error registering driver", error: error.message });
    }
};


// 2. Driver login
export const loginDriver = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find driver by email
        const driver = await driverModel.findOne({ email });
        if (!driver) {
            return res.status(404).json({ message: "Driver not found" });
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(password, driver.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid password" });
        }

        // Optional JWT token
        const token = jwt.sign({ id: driver._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

        res.status(200).json({
            message: "Login successful",
            driver,
            token
        });
    } catch (error) {
        console.error("Error logging in:", error);  // Log the error for debugging
        res.status(500).json({ message: "Error logging in", error: error.message });
    }
};

// 3. Get pending fines for driver
export const getPendingFines = async (req, res) => {
    try {
        const { licenseId } = req.params;
        const pendingFines = await issuedfineModel.find({
            licenseId,
            status: "pending"
        });
        res.status(200).json(pendingFines);
    } catch (error) {
        console.error("Error fetching pending fines:", error);  // Log the error for debugging
        res.status(500).json({ message: "Error fetching pending fines", error: error.message });
    }
};

// 4. Get paid fines for driver
export const getPaidFines = async (req, res) => {
    try {
        const { licenseId } = req.params;
        const paidFines = await issuedfineModel.find({
            licenseId,
            status: "paid"
        });
        res.status(200).json(paidFines);
    } catch (error) {
        console.error("Error fetching paid fines:", error);  // Log the error for debugging
        res.status(500).json({ message: "Error fetching paid fines", error: error.message });
    }
};

// 5. Get provision (fine rule) details
export const getProvisionDetails = async (req, res) => {
    try {
        const provisions = await fineModel.find();
        res.status(200).json(provisions);
    } catch (error) {
        console.error("Error fetching fine provisions:", error);  // Log the error for debugging
        res.status(500).json({ message: "Error fetching fine provisions", error: error.message });
    }
};

// 6. Get notifications
export const getNotifications = async (req, res) => {
    try {
        const { licenseId } = req.params;
        const notifications = await issuedfineModel.find({
            licenseId,
            notification: { $exists: true, $ne: "" }
        });

        res.status(200).json(notifications);
    } catch (error) {
        console.error("Error fetching notifications:", error);  // Log the error for debugging
        res.status(500).json({ message: "Error fetching notifications", error: error.message });
    }
};

// Admin - Get all drivers
export const getAllDrivers = async (req, res) => {
    try {
        const drivers = await driverModel.find().select("-password");
        res.status(200).json(drivers);
    } catch (error) {
        console.error("Get All Drivers Error:", error);  // Log the error for debugging
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const getDriverDashboard = async (req, res) => {
    try {
        const { licenseId } = req.params;

        const pendingFines = await issuedfineModel.find({ licenseId, status: 'pending' });
        const paidFines = await issuedfineModel.find({ licenseId, status: 'paid' });

        const pendingAmount = pendingFines.reduce((sum, fine) => sum + (fine.amount || 0), 0);
        const paidAmount = paidFines.reduce((sum, fine) => sum + (fine.amount || 0), 0);

        const driver = await driverModel.findOne({ LicenseNumber: licenseId }).select('name image');

        res.status(200).json({
            pendingFineCount: pendingFines.length,
            pendingFineAmount: pendingAmount,
            paidFineCount: paidFines.length,
            paidFineAmount: paidAmount,
            user: driver
        });
    } catch (error) {
        console.error('Error fetching dashboard data:', error);
        res.status(500).json({ message: 'Error fetching dashboard data', error: error.message });
    }
};


// GET /api/driver/profile/:licenseId
export const getDriverProfile = async (req, res) => {
    try {
        const { licenseId } = req.params;
        const driver = await driverModel.findOne({ LicenseNumber: licenseId }).select('-password');

        if (!driver) {
            return res.status(404).json({ message: "Driver not found" });
        }

        res.status(200).json(driver);
    } catch (error) {
        console.error("Error fetching profile:", error);
        res.status(500).json({ message: "Error fetching profile", error: error.message });
    }
};

// PATCH /api/driver/profile/:licenseId
export const updateDriverProfile = async (req, res) => {
    try {
        const { licenseId } = req.params;
        const updates = req.body;

        if (updates.password) {
            return res.status(400).json({ message: "Password updates not allowed here" });
        }

        const updatedDriver = await driverModel.findOneAndUpdate(
            { LicenseNumber: licenseId },
            { $set: updates },
            { new: true }
        ).select('-password');

        if (!updatedDriver) {
            return res.status(404).json({ message: "Driver not found" });
        }

        res.status(200).json(updatedDriver);
    } catch (error) {
        console.error("Error updating profile:", error);
        res.status(500).json({ message: "Error updating profile", error: error.message });
    }
};

// PATCH /api/driver/change-password/:licenseId
export const changeDriverPassword = async (req, res) => {
    try {
        const { licenseId } = req.params;
        const { oldPassword, newPassword } = req.body;

        const driver = await driverModel.findOne({ LicenseNumber: licenseId });
        if (!driver) {
            return res.status(404).json({ message: "Driver not found" });
        }

        const isMatch = await bcrypt.compare(oldPassword, driver.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Old password is incorrect" });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        driver.password = hashedPassword;
        await driver.save();

        res.status(200).json({ message: "Password updated successfully" });
    } catch (error) {
        console.error("Error changing password:", error);
        res.status(500).json({ message: "Error changing password", error: error.message });
    }
};
