import Admin from "../models/adminModel.js";
import Police from "../models/policeModel.js";
import Driver from "../models/driverModel.js";
import IssuedFine from "../models/IssuedFineModels.js";
import Feedback from "../models/feedbackModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import PDFDocument from 'pdfkit';
import { Readable } from 'stream';

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
            image: "",  
            code: "ADMIN" + Date.now(),
            status: "active"
        });

        await newAdmin.save();

        
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

export const getPaidFines = async (req, res) => {
    try {
        const { fromDate, toDate } = req.query;
        const filter = { status: 'paid' };
        if (fromDate && toDate) {
            filter.paidDate = {
                $gte: new Date(fromDate),
                $lte: new Date(toDate)
            };
        }
        const paidFines = await IssuedFine.find(filter);
        res.status(200).json(paidFines);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching paid fines', error: err.message });
    }
};



export const downloadTicket = async (req, res) => {
    try {
        const { id } = req.params;
        const fine = await IssuedFine.findById(id);

        if (!fine) {
            return res.status(404).json({ message: 'Fine not found' });
        }

        
        const doc = new PDFDocument();
        let buffers = [];
        doc.on('data', buffers.push.bind(buffers));
        doc.on('end', () => {
            const pdfData = Buffer.concat(buffers);
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename=Fine_${id}.pdf`);
            res.send(pdfData);
        });

        doc.fontSize(20).text('Fine Ticket', { align: 'center' });
        doc.moveDown();
        doc.fontSize(12).text(`Reference No: ${fine.referenceNo}`);
        doc.text(`License ID: ${fine.licenseId}`);
        doc.text(`Police ID: ${fine.policeId}`);
        doc.text(`Amount: ${fine.amount}`);
        doc.text(`Paid Date: ${fine.paidDate ? new Date(fine.paidDate).toLocaleDateString() : 'N/A'}`);
        doc.end();

    } catch (err) {
        console.error("Error generating ticket PDF:", err);
        res.status(500).json({ message: 'Error generating ticket PDF' });
    }
};


export const getPendingFiness = async (req, res) => {
    try {
        const { fromDate, toDate, status } = req.query;
        const filter = {};

        
        if (status === 'unpaid' || status === 'pending') {
            filter.status = 'unpaid';
        } else if (status === 'expired') {
            filter.status = 'expired';
        } else {
        
            const filter = { status: { $in: ['unpaid', 'pending', 'expired'] } };
        }

        if (fromDate && toDate) {
            filter.issuedDate = {
                $gte: new Date(fromDate),
                $lte: new Date(toDate)
            };
        }

        console.log("Fetching pending fines with filter:", filter);
        const pendingFines = await IssuedFine.find(filter);
        res.status(200).json(pendingFines);
    } catch (err) {
        console.error("Error fetching pending fines:", err);
        res.status(500).json({ message: 'Error fetching pending fines', error: err.message });
    }
};
