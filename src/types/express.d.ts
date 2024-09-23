import * as express from 'express';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        role: string;
      };
      shop?: {
        categories: any[];
        limits: any;
        id: string;
      }
    }
  }
}
