import { Router } from "express";
import { createRole, getAllRoles, getRoleById, updateRole, deleteRole } from "../controllers/role.controller.js";
import { jwtAuthenticator } from "../middlewares/passport.middleware.js";
import { authorizePermissionMiddleware } from "../middlewares/authorizePermission.middleware.js";

const router = Router();

router.use(jwtAuthenticator, authorizePermissionMiddleware('admin:all'));

router.post("/", createRole);
router.get("/", getAllRoles);
router.get("/:id", getRoleById);
router.put("/:id", updateRole);
router.delete("/:id", deleteRole);

export default router;
