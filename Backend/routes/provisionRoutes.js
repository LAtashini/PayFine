// routes/provisionRoutes.js
import express from "express";
import { addProvision, getAllProvisions, updateProvision, deleteProvision } from "../controllers/provisionController.js";
import authAdmin from "../middlewares/authAdmin.js";

const router = express.Router();

router.post("/", authAdmin, addProvision);
router.get("/", authAdmin, getAllProvisions);
router.put("/:id", authAdmin, updateProvision);
router.delete("/:id", authAdmin, deleteProvision);

export default router;
