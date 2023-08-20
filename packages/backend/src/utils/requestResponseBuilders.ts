import { Request } from "express";
import { ZodTypeAny, TypeOf, z } from "zod";

type ZodSchemaShape = {
  params?: ZodTypeAny;
  body?: ZodTypeAny;
  query?: ZodTypeAny;
};

export class RequestBuilder<Schema extends ZodSchemaShape> {
  schema: Schema;

  constructor(schema: Schema) {
    this.schema = schema;
  }

  getRequestType() {
    const zodObject = z.object(this.schema);
    type Type = TypeOf<typeof zodObject>;
    type Req = Request<Type["params"], {}, Type["body"], Type["query"]>;
    return {} as Req;
  }
}

// export function getRequestType<Schema extends ZodSchemaShape>(schema: Schema) {
//   const zodObject = z.object(schema);
//   type Type = TypeOf<typeof zodObject>;
//   type Req = Request<Type["params"], {}, Type["body"], Type["query"]>;
//   return {} as Req;
// }
