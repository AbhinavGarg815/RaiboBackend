import { Router } from "express";
import { createPermission, getAllPermissions, getPermissionById, updatePermission, deletePermission } from "../controllers/permission.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { authorizePermissionMiddleware } from "../middlewares/authorizePermission.middleware.js";

const router = Router();

router.use(authMiddleware, authorizePermissionMiddleware('admin:all'));

router.post("/", createPermission);
router.get("/", getAllPermissions);
router.get("/:id", getPermissionById);
router.put("/:id", updatePermission);
router.delete("/:id", deletePermission);

export default router;