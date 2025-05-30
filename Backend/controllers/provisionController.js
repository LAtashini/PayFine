
import Provision from "../models/provisionModel.js";


export const addProvision = async (req, res) => {
    try {
        const { provisionId, sectionOfAct, fineAmount } = req.body;
        const newProvision = new Provision({ provisionId, sectionOfAct, fineAmount });
        await newProvision.save();
        res.status(201).json(newProvision);
    } catch (err) {
        res.status(500).json({ message: "Failed to add provision", error: err.message });
    }
};

export const getAllProvisions = async (req, res) => {
    try {
        const provisions = await Provision.find();
        const formatted = provisions.map(prov => ({
            fineId: prov.provisionId,
            section: prov.sectionOfAct,
            provision: `Provision for ${prov.sectionOfAct}`,  
            amount: prov.fineAmount
        }));
        res.status(200).json(formatted);
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch provisions", error: err.message });
    }
};



export const updateProvision = async (req, res) => {
    try {
        const updated = await Provision.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updated) return res.status(404).json({ message: "Provision not found" });
        res.status(200).json(updated);
    } catch (err) {
        res.status(500).json({ message: "Failed to update provision", error: err.message });
    }
};


export const deleteProvision = async (req, res) => {
    try {
        const deleted = await Provision.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ message: "Provision not found" });
        res.status(200).json({ message: "Provision deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: "Failed to delete provision", error: err.message });
    }
};
