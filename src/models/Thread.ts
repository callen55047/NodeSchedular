import { InferSchemaType, model, Schema, Types } from 'mongoose';
import { IModelID } from './shared/ModelBuilders.js';

const ThreadModel = new Schema({
  artist_id: {
    type: Types.ObjectId,
    ref: 'Account',
    required: true,
  },
  user_id: {
    type: Types.ObjectId,
    ref: 'Account',
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
  archived_at: {
    type: Date,
    default: null,
  },
});

type IThread = IModelID & InferSchemaType<typeof ThreadModel>

export {
  IThread,
};

export default model<IThread>('Thread', ThreadModel);