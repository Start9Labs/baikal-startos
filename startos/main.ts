import { i18n } from './i18n'
import { sdk } from './sdk'
import { dataPath, uiPort } from './utils'

export const main = sdk.setupMain(async ({ effects }) => {
  console.info(i18n('Starting Baïkal'))

  const baikalSub = sdk.SubContainer.of(
    effects,
    { imageId: 'baikal' },
    sdk.Mounts.of().mountVolume({
      volumeId: 'data',
      subpath: null,
      mountpoint: dataPath,
      readonly: false,
    }),
    'baikal',
  )

  return sdk.Daemons.of(effects)
    .addOneshot('prepare-data', {
      subcontainer: baikalSub,
      exec: {
        command: [
          'install',
          '-d',
          '-o',
          'www-data',
          '-g',
          'www-data',
          dataPath,
          `${dataPath}/config`,
          `${dataPath}/Specific`,
          `${dataPath}/Specific/db`,
        ],
        user: 'root',
      },
      requires: [],
    })
    .addDaemon('baikal', {
      subcontainer: baikalSub,
      exec: {
        command: sdk.useEntrypoint(),
        env: {
          BAIKAL_PATH_CONFIG: `${dataPath}/config/`,
          BAIKAL_PATH_SPECIFIC: `${dataPath}/Specific/`,
        },
      },
      ready: {
        display: i18n('Web Interface'),
        gracePeriod: 30_000,
        fn: () =>
          sdk.healthCheck.checkPortListening(effects, uiPort, {
            successMessage: i18n('Baïkal is ready'),
            errorMessage: i18n('Baïkal web server is unavailable'),
          }),
      },
      requires: ['prepare-data'],
    })
    .addHealthCheck('configured', {
      ready: {
        display: i18n('Configuration'),
        gracePeriod: 0,
        trigger: sdk.trigger.statusTrigger(300_000, {
          starting: 10_000,
          failure: 30_000,
        }),
        fn: async () => {
          const result = await baikalSub.exec([
            'curl',
            '--fail-with-body',
            '--location',
            '--silent',
            '--show-error',
            `http://127.0.0.1:${uiPort}/`,
          ])
          const body = result.stdout.toString()
          if (
            result.exitCode === 0 &&
            body.includes('Baïkal is running alright.')
          ) {
            return { result: 'success', message: i18n('Baïkal is ready') }
          }

          const installed = await baikalSub.exec([
            'test',
            '-f',
            `${dataPath}/Specific/INSTALL_DISABLED`,
          ])
          if (installed.exitCode !== 0) {
            return {
              result: 'failure',
              message: i18n(
                'Complete Baïkal setup in the Administration interface',
              ),
            }
          }
          if (body.includes('id="upgradeButton"')) {
            return {
              result: 'failure',
              message: i18n(
                'Complete the Baïkal upgrade in the Administration interface',
              ),
            }
          }
          return {
            result: 'failure',
            message: i18n('Baïkal failed its application check'),
          }
        },
      },
      requires: ['baikal'],
    })
})
