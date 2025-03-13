import { Colors } from '../../theme/Theme'

enum EEventLogType {
  INFO = 'info',
  DEBUG = 'debug',
  WARNING = 'warning',
  ERROR = 'error',
  EXCEPTION = 'exception'
}

enum EEventPlatform {
  SERVICES = 'services',
  ARTIST_PORTAL = 'artist portal',
  CLIENT_APP = 'client app'
}

interface IEventLog {
  _id: string,
  user_id: string | null,
  type: EEventLogType,
  platform: EEventPlatform,
  message: string,
  created_at: string,
  updated_at: string
}

function getLogColor(logType: EEventLogType): string {
  switch (logType) {
    case EEventLogType.ERROR: return Colors.RED_00
    case EEventLogType.EXCEPTION: return Colors.ORANGE
    default: return Colors.LIGHT_GREY_00
  }
}

export {
  IEventLog,
  EEventLogType,
  EEventPlatform,
  getLogColor
}