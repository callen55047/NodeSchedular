enum EInquiryFieldType {
  CHECKBOX = 'checkbox',
  SELECTION = 'selection',
  TEXT = 'text',
}

interface IInquiryField {
  type: EInquiryFieldType,
  field: string,
  options: string[],
  value: string | null
}

interface IInquiryTemplate {
  _id: string,
  owner_id: string,
  title: string,
  description: string,
  fields: IInquiryField[],
  created_at: string,
  updated_at: string,
}

function createDefaultITField(): IInquiryField {
  return {
    type: EInquiryFieldType.CHECKBOX,
    field: 'Are you of legal age to receive a tattoo?',
    options: [],
    value: null
  }
}

function createDefaultIT(index: number): Partial<IInquiryTemplate> {
  return {
    title: `Template ${index}`,
    description: 'Custom inquiry template created for client onboarding',
    fields: [createDefaultITField()]
  }
}

export {
  EInquiryFieldType,
  IInquiryField,
  IInquiryTemplate,
  createDefaultIT,
  createDefaultITField
}