import fineModel from "../models/fine.js";

// 1. Add a new fine provision
export const addFineProvision = async (req, res) => {
  try {
    const { fineId, provisionId, provision, fineAmount } = req.body;

    const newFine = new fineModel({
      fineId,
      provisionId,
      provision,
      fineAmount,
    });

    await newFine.save();
    res.status(201).json({ message: "Fine provision added successfully", fine: newFine });
  } catch (error) {
    res.status(500).json({ message: "Error adding fine provision", error });
  }
};

// 2. Get all fine provisions
export const getAllFines = async (req, res) => {
  try {
    const fines = await fineModel.find();
    res.status(200).json(fines);
  } catch (error) {
    res.status(500).json({ message: "Error fetching fine provisions", error });
  }
};

// 3. Get a single fine provision by ID
export const getFineById = async (req, res) => {
  try {
    const { id } = req.params;
    const fine = await fineModel.findById(id);
    if (!fine) {
      return res.status(404).json({ message: "Fine provision not found" });
    }
    res.status(200).json(fine);
  } catch (error) {
    res.status(500).json({ message: "Error fetching fine provision", error });
  }
};

// 4. Update fine provision
export const updateFine = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    const updatedFine = await fineModel.findByIdAndUpdate(id, updatedData, { new: true });
    if (!updatedFine) {
      return res.status(404).json({ message: "Fine provision not found" });
    }

    res.status(200).json({ message: "Fine provision updated", fine: updatedFine });
  } catch (error) {
    res.status(500).json({ message: "Error updating fine provision", error });
  }
};

// 5. Delete fine provision
export const deleteFine = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedFine = await fineModel.findByIdAndDelete(id);
    if (!deletedFine) {
      return res.status(404).json({ message: "Fine provision not found" });
    }

    res.status(200).json({ message: "Fine provision deleted", fine: deletedFine });
  } catch (error) {
    res.status(500).json({ message: "Error deleting fine provision", error });
  }
};
