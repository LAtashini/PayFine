
import express from "express";
import { addProvision, getAllProvisions, updateProvision, deleteProvision } from "../controllers/provisionController.js";
import authAdmin from "../middlewares/authAdmin.js";

const router = express.Router();

router.post("/", addProvision);
router.get("/", getAllProvisions);
router.put("/:id", updateProvision);
router.delete("/:id", deleteProvision);

export default router;
