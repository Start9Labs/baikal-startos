export const DEFAULT_LANG = 'en_US'

const dict = {
  'Starting Baïkal': 0,
  'Web Interface': 1,
  'Baïkal is ready': 2,
  'Baïkal web server is unavailable': 3,
  Administration: 4,
  'Manage users, calendars, and address books': 5,
  DAV: 6,
  'Connect CalDAV and CardDAV clients': 7,
  Configuration: 8,
  'Complete Baïkal setup in the Administration interface': 9,
  'Complete the Baïkal upgrade in the Administration interface': 10,
  'Baïkal failed its application check': 11,
} as const

/**
 * Plumbing. DO NOT EDIT.
 */
export type I18nKey = keyof typeof dict
export type LangDict = Record<(typeof dict)[I18nKey], string>
export default dict
