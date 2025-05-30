import Police from "../models/policeModel.js";
import bcrypt from "bcryptjs";
import issuedfineModel from "../models/IssuedFineModels.js";


export const addPolice = async (req, res) => {
  try {
    const { officerId, email, password, name, PoliceStation, court, registeredDate } = req.body;

    
    if (!officerId || !email || !password || !name || !PoliceStation || !court || !registeredDate) {
      return res.status(400).json({ message: "All fields are required" });
    }

    
    const existingOfficer = await Police.findOne({ $or: [{ policeId: officerId }, { email }] });
    if (existingOfficer) {
      return res.status(400).json({ message: "Officer with this ID or email already exists" });
    }

  
    const hashedPassword = await bcrypt.hash(password, 10);

    
    const newOfficer = new Police({
      policeId: officerId,
      email,
      password: hashedPassword,
      name,
      station: PoliceStation, 
      court,
      registeredDate,
      code: "POLICE" + Date.now(),
      status: "active",
      
    });

    await newOfficer.save();
    res.status(201).json({ message: "Police officer added successfully", officer: newOfficer });
  } catch (error) {
    console.error("Error adding police officer:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const policeLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const officer = await Police.findOne({ email });
    if (!officer) {
      return res.status(404).json({ message: "Police officer not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, officer.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    res.status(200).json({
      message: "Login successful",
      officer: {
        id: officer._id,
        policeId: officer.policeId,
        name: officer.name,
        email: officer.email,
        station: officer.station,
        court: officer.court,
        status: officer.status,
      },
    });
  } catch (error) {
    console.error("Police Login Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


export const getPoliceProfile = async (req, res) => {
  try {
    const policeId = req.params.id;

    const officer = await Police.findById(policeId).select("-password");
    if (!officer) {
      return res.status(404).json({ message: "Police officer not found" });
    }

    res.status(200).json(officer);
  } catch (error) {
    console.error("Get Police Profile Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


export const updatePoliceProfile = async (req, res) => {
  try {
    const policeId = req.params.id;
    const updates = req.body;

    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, 10);
    }

    const updatedOfficer = await Police.findByIdAndUpdate(policeId, updates, { new: true }).select("-password");

    if (!updatedOfficer) {
      return res.status(404).json({ message: "Police officer not found" });
    }

    res.status(200).json({ message: "Profile updated", officer: updatedOfficer });
  } catch (error) {
    console.error("Update Police Profile Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


export const getPoliceDashboard = async (req, res) => {
  try {
    const policeId = req.params.id;

    const officer = await Police.findById(policeId);
    if (!officer) {
      return res.status(404).json({ message: "Police officer not found" });
    }

    const reportedFines = await issuedfineModel.find({ policeId: officer.policeId });
    const totalReportedFines = reportedFines.length;
    const totalReportedAmount = reportedFines.reduce((sum, fine) => sum + (fine.totalAmount || 0), 0);

    res.status(200).json({
      reportedFineCount: totalReportedFines,
      reportedFineAmount: totalReportedAmount,
      station: officer.station,
      court: officer.court,
    });
  } catch (error) {
    console.error("Get Police Dashboard Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


export const getAllPolice = async (req, res) => {
  try {
    const officers = await Police.find().select("-password");
    res.status(200).json(officers);
  } catch (error) {
    console.error("Get All Police Officers Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


export const getReportedFinesByOfficerName = async (req, res) => {
  try {
    const { officerName } = req.params;

    console.log(`Fetching fines for officerName: ${officerName}`);

    const fines = await issuedfineModel.find({ officerName })
      .populate("provision")
      .populate("policeId");

    const reportedFineCount = fines.length;
    const reportedFineAmount = fines.reduce((total, fine) => total + fine.totalAmount, 0);

    res.status(200).json({
      fines,
      count: reportedFineCount,
      amount: reportedFineAmount
    });
  } catch (error) {
    console.error("Error fetching reported fines by officer name:", error);
    res.status(500).json({ message: "Error fetching reported fines by officer name", error });
  }
};
