import { i18n } from './i18n'
import { sdk } from './sdk'
import { uiPort } from './utils'

export const setInterfaces = sdk.setupInterfaces(async ({ effects }) => {
  const web = sdk.MultiHost.of(effects, 'web')
  const origin = await web.bindPort(uiPort, {
    protocol: 'http',
    preferredExternalPort: 80,
  })

  const admin = sdk.createInterface(effects, {
    id: 'admin',
    name: i18n('Administration'),
    description: i18n('Manage users, calendars, and address books'),
    type: 'ui',
    masked: false,
    schemeOverride: null,
    username: null,
    path: '/admin/',
    query: {},
  })

  const dav = sdk.createInterface(effects, {
    id: 'dav',
    name: i18n('DAV'),
    description: i18n('Connect CalDAV and CardDAV clients'),
    type: 'api',
    masked: false,
    schemeOverride: null,
    username: null,
    path: '/dav.php/',
    query: {},
  })

  return [await origin.export([admin, dav])]
})
