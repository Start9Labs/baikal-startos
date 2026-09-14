import { setupManifest } from '@start9labs/start-sdk'
import { long, short } from './i18n'

export const manifest = setupManifest({
  id: 'baikal',
  title: 'Baïkal',
  license: 'GPL-3.0-only',
  packageRepo: 'https://github.com/Start9Labs/baikal-startos',
  upstreamRepo: 'https://github.com/sabre-io/Baikal',
  marketingUrl: 'https://sabre.io/baikal/',
  donationUrl: null,
  description: { short, long },
  volumes: ['data'],
  images: {
    baikal: {
      source: { dockerBuild: {} },
      arch: ['x86_64', 'aarch64'],
    },
  },
  dependencies: {},
})
