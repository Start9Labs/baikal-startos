import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '0.12.1:0',
  releaseNotes: {
    en_US:
      'Initial Baïkal release for StartOS. Includes the upstream fix for an authenticated stored-XSS vulnerability in the administration interface. Full notes: https://github.com/sabre-io/Baikal/releases/tag/0.12.1',
    es_ES:
      'Versión inicial de Baïkal para StartOS. Incluye la corrección upstream de una vulnerabilidad XSS almacenada y autenticada en la interfaz de administración. Notas completas: https://github.com/sabre-io/Baikal/releases/tag/0.12.1',
    de_DE:
      'Erste Baïkal-Version für StartOS. Enthält die Upstream-Behebung einer authentifizierten Stored-XSS-Schwachstelle in der Verwaltungsoberfläche. Vollständige Hinweise: https://github.com/sabre-io/Baikal/releases/tag/0.12.1',
    pl_PL:
      'Pierwsze wydanie Baïkal dla StartOS. Zawiera poprawkę upstream dotyczącą uwierzytelnionej podatności stored XSS w interfejsie administracyjnym. Pełne informacje: https://github.com/sabre-io/Baikal/releases/tag/0.12.1',
    fr_FR:
      'Première version de Baïkal pour StartOS. Inclut le correctif upstream d’une vulnérabilité XSS persistante authentifiée dans l’interface d’administration. Notes complètes : https://github.com/sabre-io/Baikal/releases/tag/0.12.1',
  },
  migrations: {
    up: async () => {},
    down: IMPOSSIBLE,
  },
})
