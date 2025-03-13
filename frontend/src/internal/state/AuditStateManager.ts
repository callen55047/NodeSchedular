import { useState } from 'react'
import { EAuditRecordType, IAuditRecord } from '../models/AuditRecord'
import { removeDuplicatesBasedOnUpdatedAt } from '../ObjectHelpers'
import { ISession } from '../models/Session'

interface IAuditStateManager {
  update: (list: IAuditRecord[]) => void,
  getAll: () => IAuditRecord[],
  getForSession: (session: ISession) => IAuditRecord[],
  getAllForUserSessions: (sessions: ISession[]) => IAuditRecord[],
  chargesForSession: (session: ISession) => { charge: number, refund: number }
}

const AuditStateManager = (): IAuditStateManager => {
  const [auditRecords, setAuditRecords] = useState<IAuditRecord[]>([])

  return {

    update: (list: IAuditRecord[]) => {
      const combined = removeDuplicatesBasedOnUpdatedAt([...auditRecords, ...list])
      setAuditRecords([...combined])
    },

    getAll: () => {
      return auditRecords
    },

    getForSession: (session: ISession) => {
      return auditRecords.filter((a) => {
        return a.session_id === session._id && a.type !== EAuditRecordType.INTENT
      })
    },

    getAllForUserSessions: (sessions: ISession[]) => {
      const sessionIDs = sessions.map((s) => s._id)
      return auditRecords.filter((a) => {
        return sessionIDs.includes(a.session_id) && a.type !== EAuditRecordType.INTENT
      })
    },

    chargesForSession: (session: ISession) => {
      const records = auditRecords.filter((a) => a.session_id === session._id)
      let charge = 0, refund = 0
      records.forEach((r) => {
        if (r.type === EAuditRecordType.CONFIRM) {
          charge += r.charge || 0
        } else if (r.type === EAuditRecordType.REFUND) {
          refund += r.charge || 0
        }
      })

      return {
        charge: charge / 100,
        refund: refund / 100
      }
    }
  }
}

export default AuditStateManager

export {
  IAuditStateManager
}