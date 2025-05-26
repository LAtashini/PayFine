import revenueModel from "../models/revenueModel.js";

// Create a new revenue license entry
export const createRevenue = async (req, res) => {
  try {
    const {
      vehicleNo,
      licenseNumber,
      referenceNo,
      vehicleType,
      fuelType,
      ownerName,
      ownerAddress,
      issuedDate,
      expiredDate
    } = req.body;

    const newRevenue = new revenueModel({
      vehicleNo,
      licenseNumber,
      referenceNo,
      vehicleType,
      fuelType,
      ownerName,
      ownerAddress,
      issuedDate,
      expiredDate
    });

    const savedRevenue = await newRevenue.save();
    res.status(201).json(savedRevenue);
  } catch (error) {
    res.status(500).json({ message: "Failed to create revenue license", error });
  }
};

// Get all revenue licenses
export const getAllRevenue = async (req, res) => {
  try {
    const revenues = await revenueModel.find();
    res.status(200).json(revenues);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch revenue licenses", error });
  }
};

// Get revenue license by vehicle number
export const getRevenueByVehicleNo = async (req, res) => {
  try {
    const { vehicleNo } = req.params;
    const revenue = await revenueModel.findOne({ vehicleNo });

    if (!revenue) {
      return res.status(404).json({ message: "Revenue license not found" });
    }

    res.status(200).json(revenue);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch revenue license", error });
  }
};

// Delete revenue license by ID
export const deleteRevenue = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await revenueModel.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: "Revenue license not found" });
    }

    res.status(200).json({ message: "Revenue license deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete revenue license", error });
  }
};

// revenueController.js
export const getRevenueByLicenseNumber = async (req, res) => {
  try {
    const { licenseNumber } = req.params;
    const revenue = await revenueModel.findOne({ licenseNumber });
    if (!revenue) {
      return res.status(404).json({ message: 'Revenue license not found' });
    }
    res.status(200).json({
      licenseNumber: revenue.licenseNumber,
      referenceNumber: revenue.referenceNo,
      vehicleNumber: revenue.vehicleNo,
      vehicleType: revenue.vehicleType,
      fuelType: revenue.fuelType,
      ownerName: revenue.ownerName,
      ownerAddress: revenue.ownerAddress,
      issueDate: revenue.issuedDate,
      expireDate: revenue.expiredDate
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch revenue license', error });
  }
};
