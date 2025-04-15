import { validationResult } from "express-validator";

const  validationHandler = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            status: "fail",
            message: "Validation error",
            errors: errors.array(),
        });
    }
    next();

}

export { validationHandler };
