import * as express from 'express';
import { IUser } from '@/domain/interfaces/IUser';

declare global {
  namespace Express {
    interface Request {
      currentUser: IUser; 
    }
  }
}
