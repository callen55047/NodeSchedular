import { Schema, model, InferSchemaType } from 'mongoose';
import { IModelID } from './shared/ModelBuilders.js';

const SkillModel = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
});

type ISkill = IModelID & InferSchemaType<typeof SkillModel>

export {
  ISkill,
};

export default model<ISkill>('Skill', SkillModel);