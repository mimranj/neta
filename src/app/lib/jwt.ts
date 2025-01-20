const jwt = require('jsonwebtoken')

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRY = process.env.JWT_EXPIRY || '365d';

/* eslint-disable  @typescript-eslint/no-explicit-any */
export const signToken = (payload: any) => {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRY });
};

/* eslint-disable  @typescript-eslint/no-explicit-any */
export const verifyToken = (req:any) => {
    const authHeader = req.headers['authorization'] || req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new Error('Unauthorized');
    }
    const token = authHeader.split(' ')[1];
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (error) {
        console.error('Error verifying token:', error);
        throw new Error('Invalid or expired token');
    }
};
