import { Request } from 'express';
import { IAccount } from '../../models/Account.js';

const getUserFromRequest = (request: Request): IAccount => {
  return (request as any).user as IAccount
}

export {
  getUserFromRequest
}