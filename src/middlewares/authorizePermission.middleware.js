import { Role } from "../models/role.model.js";

const authorizePermissionMiddleware = (...requiredPermission) => {
    return async (req, res, next) => {

        // Uncomment if user model is using role objects

    //     const user = req.user;
    //     if (!user) {
    //         return res.status(401).json({
    //             message: "Unauthorized"
    //         }); 
    //     }

    //     const roles = await Role.find({ _id: { $in: user.role } }).populate('permissions');
    //     if (!roles || roles.length === 0) {
    //         return res.status(403).json({
    //             message: "Forbidden"
    //         });
    //     }
    //     const permissions = roles.reduce((acc, role) => {
    //         return acc.concat(role.permissions.map(permission => permission.name));
    //     }, []);     
         
    //     if (!permissions.includes(requiredPermission)) {
    //         return res.status(403).json({ 
    //             message: "Forbidden"
    //         });
    //     }

    //     next();


        const user = req.user;
        if (!user) {
            return res.status(401).json({
                message: "Unauthorized"
            });
        }

        const userRoles = user.role;
        if (!userRoles || userRoles.length === 0) {
            return res.status(403).json({
                message: "Forbidden"
            });
        }

        const hasRequiredRole = requiredPermission.some(role => userRoles.includes(role));
        if (hasRequiredRole) {
            return next();
        }

        return res.status(403).json({
            message: "Forbidden"
        });
    };
}

export { authorizePermissionMiddleware };