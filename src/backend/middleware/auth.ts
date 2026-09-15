import { Request, Response, NextFunction } from 'express';
import { getAuth, DecodedIdToken } from 'firebase-admin/auth';
import { initializeApp, getApps, cert, applicationDefault } from 'firebase-admin/app';
import { User } from '../models/User.js';

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: DecodedIdToken;
      dbUser?: any;
    }
  }
}

// Initialize Firebase Admin (needs to be called in server.ts)
export const initFirebaseAdmin = () => {
  if (getApps().length === 0) {
    try {
      // In production, you would use a service account key file or environment variables
      // For local dev, ensure GOOGLE_APPLICATION_CREDENTIALS or FIREBASE_SERVICE_ACCOUNT is set
      const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT 
        ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT) 
        : undefined;

      // Fix escaped newlines in the private key if present
      if (serviceAccount && serviceAccount.private_key) {
        serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');
      }

      initializeApp({
        credential: serviceAccount ? cert(serviceAccount) : applicationDefault(),
      });
      console.log('Firebase Admin initialized successfully');
    } catch (error) {
      console.error('Firebase Admin initialization error:', error);
    }
  }
};

export const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Missing or invalid token' });
  }

  const token = authHeader.split('Bearer ')[1];

  try {
    const decodedToken = await getAuth().verifyIdToken(token);
    req.user = decodedToken;

    // Optionally fetch or create user in MongoDB
    let dbUser = await User.findOne({ firebaseUid: decodedToken.uid });
    if (!dbUser) {
      dbUser = await User.create({
        firebaseUid: decodedToken.uid,
        phoneNumber: decodedToken.phone_number,
        email: decodedToken.email,
        role: 'citizen', // Default to citizen
      });
    }
    
    req.dbUser = dbUser;
    next();
  } catch (error) {
    console.error('Auth verification error:', error);
    return res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }
};

export const optionalAuth = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split('Bearer ')[1];
    try {
      const decodedToken = await getAuth().verifyIdToken(token);
      req.user = decodedToken;
    } catch (error) {
      // Ignore error for optional auth
    }
  }
  next();
};
