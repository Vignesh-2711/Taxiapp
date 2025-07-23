import { body, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

export const validateRegister = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('firstName')
    .trim()
    .isLength({ min: 2 })
    .withMessage('First name must be at least 2 characters long'),
  body('lastName')
    .trim()
    .isLength({ min: 2 })
    .withMessage('Last name must be at least 2 characters long'),
  body('phone')
    .trim()
    .isLength({ min: 10 })
    .withMessage('Phone number must be at least 10 characters long'),
  body('role')
    .optional()
    .isIn(['passenger', 'driver'])
    .withMessage('Role must be either passenger or driver'),
  body('licenseNumber')
    .if(body('role').equals('driver'))
    .notEmpty()
    .withMessage('License number is required for drivers'),
  body('vehicleInfo.make')
    .if(body('role').equals('driver'))
    .notEmpty()
    .withMessage('Vehicle make is required for drivers'),
  body('vehicleInfo.model')
    .if(body('role').equals('driver'))
    .notEmpty()
    .withMessage('Vehicle model is required for drivers'),
  body('vehicleInfo.year')
    .if(body('role').equals('driver'))
    .isInt({ min: 1990, max: new Date().getFullYear() + 1 })
    .withMessage('Vehicle year must be between 1990 and current year'),
  body('vehicleInfo.color')
    .if(body('role').equals('driver'))
    .notEmpty()
    .withMessage('Vehicle color is required for drivers'),
  body('vehicleInfo.licensePlate')
    .if(body('role').equals('driver'))
    .notEmpty()
    .withMessage('License plate is required for drivers')
];

export const validateLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

export const validateRideRequest = [
  body('pickupLocation.lat')
    .isFloat({ min: -90, max: 90 })
    .withMessage('Pickup latitude must be between -90 and 90'),
  body('pickupLocation.lng')
    .isFloat({ min: -180, max: 180 })
    .withMessage('Pickup longitude must be between -180 and 180'),
  body('pickupLocation.address')
    .trim()
    .notEmpty()
    .withMessage('Pickup address is required'),
  body('destination.lat')
    .isFloat({ min: -90, max: 90 })
    .withMessage('Destination latitude must be between -90 and 90'),
  body('destination.lng')
    .isFloat({ min: -180, max: 180 })
    .withMessage('Destination longitude must be between -180 and 180'),
  body('destination.address')
    .trim()
    .notEmpty()
    .withMessage('Destination address is required'),
  body('rideType')
    .optional()
    .isIn(['economy', 'premium', 'luxury'])
    .withMessage('Ride type must be economy, premium, or luxury'),
  body('notes')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Notes must be less than 500 characters')
];

export const validateRating = [
  body('rating')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5'),
  body('comment')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Comment must be less than 500 characters')
];

export const handleValidationErrors = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};