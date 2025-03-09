import { Types } from 'mongoose';

interface IModelID {
  _id: Types.ObjectId
}

function toObjectIds(array: string[]): Types.ObjectId[] {
  return array.map(id => new Types.ObjectId(id))
}

export {
  IModelID,
  toObjectIds
}