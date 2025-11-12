const jwt = require('jsonwebtoken');
const config = require('../config/config');

/**
 * Authentication Middleware
 * Verifies JWT token and attaches user info to request
 */
class AuthMiddleware {
    /**
     * Verify JWT token
     */
    static authenticate(req, res, next) {
        try {
            const token = req.header('Authorization')?.replace('Bearer ', '');
            
            if (!token) {
                return res.status(401).json({
                    success: false,
                    message: 'Authentication required'
                });
            }

            const decoded = jwt.verify(token, config.jwtSecret);
            req.user = decoded;
            next();
        } catch (error) {
            res.status(401).json({
                success: false,
                message: 'Invalid or expired token'
            });
        }
    }

    /**
     * Check if user has required role
     * @param {Array} roles - Array of allowed roles
     */
    static authorize(...roles) {
        return (req, res, next) => {
            if (!req.user) {
                return res.status(401).json({
                    success: false,
                    message: 'Authentication required'
                });
            }

            if (!roles.includes(req.user.role)) {
                return res.status(403).json({
                    success: false,
                    message: 'You do not have permission to perform this action'
                });
            }

            next();
        };
    }

    /**
     * Check if user is accessing their own resource or is admin
     */
    static authorizeOwnerOrAdmin(req, res, next) {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required'
            });
        }

        const resourceUserId = req.params.id || req.params.userId || req.params.studentId;
        
        if (req.user.userId.toString() === resourceUserId || req.user.role === 'admin') {
            next();
        } else {
            res.status(403).json({
                success: false,
                message: 'You do not have permission to access this resource'
            });
        }
    }
}

module.exports = AuthMiddleware;
