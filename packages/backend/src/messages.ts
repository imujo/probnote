const getSuccess = (entityName: string) =>
  `${entityName} retrieved successfully`;
const notFoundWithId = (entityName: string, id: number) =>
  `Not Found: ${entityName} with id ${id} not found`;
const notFound = (entityName: string) => `Not Found: ${entityName} not found`;
const required = (entityName: string) =>
  `Field Required: ${entityName} is a required field`;
const invalidType = (entityName: string, typeName: string) =>
  `Invalid Type: ${entityName} is not a valid ${typeName}`;
const postSuccess = (entityName: string) =>
  `${entityName} created successfully`;
const putSuccess = (entityName: string, id: number) =>
  `${entityName} with id ${id} updated successfully`;
const deleteSuccess = (entityName: string, id: number) =>
  `${entityName} with ${id} deleted successfully`;
const invalidSortOrder = `Invalid sort order: Please use 'asc' for ascending or 'desc' for descending order.`;

export default {
  getSuccess,
  notFoundWithId,
  notFound,
  required,
  invalidType,
  postSuccess,
  putSuccess,
  deleteSuccess,
  invalidSortOrder,
};
