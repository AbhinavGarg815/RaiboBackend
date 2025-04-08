import { Router } from "express";
import { createCategory, getCategories, getCategoryById, deleteCategory } from "../controllers/category.controller.js";

const router = Router();

router.post("/", createCategory);
router.get("/", getCategories);     
router.get("/:id", getCategoryById);
router.delete("/:id", deleteCategory);

export default router;