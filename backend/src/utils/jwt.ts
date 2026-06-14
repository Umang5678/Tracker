import jwt from 'jsonwebtoken';
import { IUserPayload } from '../types';

const getSecret = (): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is not defined in environment variables');
  }
  return secret;
};

export const generateToken = (payload: IUserPayload): string => {
  const expire = process.env.JWT_EXPIRE || '7d';
  return jwt.sign(payload, getSecret(), { expiresIn: expire } as jwt.SignOptions);
};

export const verifyToken = (token: string): IUserPayload => {
  return jwt.verify(token, getSecret()) as IUserPayload;
};
