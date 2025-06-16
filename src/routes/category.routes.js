import { Router } from "express";
import { createCategory, getAllCategories, getCategoryById, deleteCategory } from "../controllers/category.controller.js";

const router = Router();

router.post("/", createCategory);
router.get("/", getAllCategories);     
router.get("/:id", getCategoryById);
router.delete("/:id", deleteCategory);

export default router;