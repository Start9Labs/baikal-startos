# AGENTS.md

This is a StartOS service-package repository — it builds a `.s9pk` for StartOS.

Work this package's `TODO.md` from top to bottom. Keep `README.md` and `instructions.md` synchronized with package behavior.

## This repo

- Build from Baïkal's official release ZIP; GitHub's generated source archives omit its Composer dependencies.
- Keep both `config/` and `Specific/` on the `data` volume. Baïkal requires the complete directories for backup and upgrade.
- SQLite is the supported database; adding an external database requires a coordinated backup and restore design.
