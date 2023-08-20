const getSuccess = (entityName: string) =>
  `${entityName} retrieved successfully`;
const notFoundWithId = (entityName: string, id: number) =>
  `Not Found: ${entityName} with id ${id} not found`;
const required = (entityName: string) =>
  `Field Required: ${entityName} is a required field`;
const invalidType = (entityName: string, typeName: string) =>
  `Invalid Type: ${entityName} is not a valid ${typeName}`;
const postSuccess = (entityName: string) =>
  `${entityName} created successfully`;

export default {
  getSuccess,
  notFoundWithId,
  required,
  invalidType,
  postSuccess,
};
