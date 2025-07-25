const { AppError } = require('./errorMiddleware');

const authorize = (...roles) => {
    return (req, res, next) => {
        // roles is an array like ['admin', 'user']
        if (!roles.includes(req.user.role)) {
            return next(
                new AppError('You do not have permission to perform this action', 403)
            );
        }
        next();
    };
};

// Middleware to check if user is accessing their own resource
const checkResourceOwnership = (req, res, next) => {
    if (req.user.role === 'admin') {
        return next(); // Admins can access any resource
    }

    const resourceUserId = req.params.userId || req.body.userId;
    if (resourceUserId && resourceUserId !== req.user.userId) {
        return next(
            new AppError('You do not have permission to access this resource', 403)
        );
    }
    next();
};

module.exports = {
    authorize,
    checkResourceOwnership
};
