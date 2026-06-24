import {Request, Response, NextFunction} from 'express';
import { ZodObject, ZodRawShape } from "zod";

export const validate = <T extends ZodRawShape>(schema: ZodObject<T>) =>
  (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse({
      body: req.body
    });

  if (!result.success) {
  const error = result.error;
  return res.status(400).json({
    message: error.issues[0]?.message
  });
}

    next();
  };