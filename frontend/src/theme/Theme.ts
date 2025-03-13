import { ESessionStatus } from '../internal/models/Session'

const Colors = {
  DARK_00: '#121212',
  DARKER_GREY: '#1f1f1f',
  DARK_GREY: '#2B2B2B',
  LIGHT_GREY_00: '#747373',
  LIGHT_GREY_01: '#74737366',
  RED_00: '#E30C0C',
  DARK_RED: '#7e0000',
  DANGER_RED: '#f49e8e',
  ORANGE: '#e36d0c',
  YELLOW: '#e3ce90',
  GOLD: '#ffbf11',
  GREEN_00: '#025755',
  BLUE_00: '#5797F8',
  DARK_BLUE: '#002f79',
  LIGHT_GREEN: '#CEFFB7',
  GREEN: '#0aab00',
  SUCCESS_GREEN: '#91ecac',
  MONEY_GREEN: '#CEFFB7',
  OFF_WHITE: '#EEEEEE',
  OFF_WHITE_2: '#d9d5d5',
  TRANSPARENT: 'transparent'
}

const getSessionStatusColor = (status: ESessionStatus): string => {
  switch (status) {
    case ESessionStatus.PENDING:
      return Colors.ORANGE
    case ESessionStatus.UPCOMING:
      return Colors.GREEN
    default:
      return Colors.BLUE_00
  }
}

const FontSizes = {
  NAV_ITEM: 15,
  BUTTON_LARGE: 19,
  f10: 10,
  f12: 12,
  f14: 14,
  f24: 24,
  f48: 48
}

const Dimensions = {
  NAV_HEADER_HEIGHT: '60px',
  NAV_BODY_HEIGHT: 'calc(100vh - 60px)',
  NAV_SIDEBAR_WIDTH: 74
}

const BorderRadius = {
  r10: 10,
  r4: 4
}

const Margins = {
  m15: 15
}

export {
  Colors,
  FontSizes,
  Dimensions,
  BorderRadius,
  Margins,
  getSessionStatusColor
}