import { Request, Response, NextFunction } from "express";
import { AnyZodObject } from "zod";

const validate =
  (schema: {
    body?: AnyZodObject;
    query?: AnyZodObject;
    params?: AnyZodObject;
  }) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const bodyPromise = schema.body?.parseAsync(req.body);
      const paramsPromise = schema.params?.parseAsync(req.params);
      const queryPromise = schema.query?.parseAsync(req.query);

      await Promise.all([bodyPromise, paramsPromise, queryPromise]);

      next();
    } catch (e: any) {
      return res.status(400).send(e.errors);
    }
  };

export default validate;
