import { InferSchemaType, model, Schema, Types } from 'mongoose';
import { IModelID } from './shared/ModelBuilders.js';

const MessageModel = new Schema({
  thread_id: {
    type: Types.ObjectId,
    ref: 'Thread',
    required: true,
  },
  sender_id: {
    type: Types.ObjectId,
    ref: 'Account',
    required: true,
  },
  body: {
    type: String,
    default: "",
  },
  is_read: {
    type: Boolean,
    default: false,
  },
  attachments: [{
    type: Types.ObjectId,
    ref: 'File'
  }],
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
});

type IMessage = IModelID & InferSchemaType<typeof MessageModel>

export {
  IMessage,
};

export default model<IMessage>('Message', MessageModel);