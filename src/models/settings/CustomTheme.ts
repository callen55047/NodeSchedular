import { Schema, Types, InferSchemaType } from 'mongoose'

const CustomThemeSchema = new Schema({
  logo: {
    type: Types.ObjectId,
    ref: 'File'
  },
  inquiry_background: {
    type: Types.ObjectId,
    ref: 'File'
  },
}, { _id: false })

type ICustomTheme = InferSchemaType<typeof CustomThemeSchema>

export {
  ICustomTheme
}

export default CustomThemeSchema