import Admin from "../models/adminModel.js";
import Police from "../models/policeModel.js";
import Driver from "../models/driverModel.js";
import IssuedFine from "../models/IssuedFineModels.js";
import Feedback from "../models/feedbackModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Admin Registration
export const registerAdmin = async (req, res) => {
    try {
        const { name, PoliceStation, email, password, confirmPassword, NIC, address, gender } = req.body;

        if (!name || !PoliceStation || !email || !password || !confirmPassword || !NIC || !address || !gender) {
            return res.status(400).json({ message: "All fields are required" });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({ message: "Passwords do not match" });
        }

        const existingAdmin = await Admin.findOne({ email });
        if (existingAdmin) {
            return res.status(400).json({ message: "Admin already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newAdmin = new Admin({
            adminId: NIC,
            name,
            PoliceStation,
            email,
            password: hashedPassword,
            image: "",  // Optionally handle image upload later
            code: "ADMIN" + Date.now(),
            status: "active"
        });

        await newAdmin.save();

        // Generate JWT token
        const token = jwt.sign(
            { id: newAdmin._id, role: 'admin' },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.status(201).json({
            message: "Admin registered successfully",
            token,
            admin: newAdmin
        });
    } catch (error) {
        console.error("Admin registration error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Admin Login
export const loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;

        const admin = await Admin.findOne({ email });
        if (!admin) {
            return res.status(404).json({ message: "Admin not found" });
        }

        const isPasswordCorrect = await bcrypt.compare(password, admin.password);
        if (!isPasswordCorrect) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: admin._id, role: admin.role },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.status(200).json({
            message: "Login successful",
            token,
            admin
        });
    } catch (error) {
        console.error("Admin login error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Admin Dashboard Summary
export const getAdminDashboard = async (req, res) => {
    try {
        const totalOfficers = await Police.countDocuments();
        const totalDrivers = await Driver.countDocuments();
        const paidTickets = await IssuedFine.countDocuments({ status: "paid" });
        const pendingTickets = await IssuedFine.countDocuments({ status: "unpaid" });
        const newFeedback = await Feedback.countDocuments({ read: false });

        res.status(200).json({
            totalOfficers,
            totalDrivers,
            paidTickets,
            pendingTickets,
            newFeedback
        });
    } catch (error) {
        console.error("Error fetching admin dashboard:", error);
        res.status(500).json({ message: "Error fetching dashboard data", error: error.message });
    }
};
