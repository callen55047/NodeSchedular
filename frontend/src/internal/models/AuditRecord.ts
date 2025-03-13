enum EAuditRecordType {
  INTENT = 'intent',
  CONFIRM = 'confirm',
  CASH = 'cash',
  REMOVE_CASH = 'remove_cash',
  REFUND = 'refund',
  FAILED = 'failed'
}

interface IAuditRecord {
  _id: string,
  session_id: string,
  type: EAuditRecordType,
  message: string,
  charge: number | null,
  app_fee: number | null,
  created_at: string,
  updated_at: string
}

function objIsIAuditRecord(obj: any): obj is IAuditRecord {
  return obj.hasOwnProperty("charge") && obj.hasOwnProperty("message")
}

export {
  IAuditRecord,
  EAuditRecordType,
  objIsIAuditRecord
}