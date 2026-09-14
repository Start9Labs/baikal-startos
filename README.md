<p align="center">
  <img src="icon.png" alt="Baïkal Logo" width="21%">
</p>

# Baïkal on StartOS

> Everything not listed in this document should behave the same as upstream
> Baïkal. If a feature, setting, or behavior is not mentioned here, the upstream
> documentation is accurate and fully applicable — see the Documentation section
> of `instructions.md` for links.

[Baïkal](https://github.com/sabre-io/Baikal) is a lightweight CalDAV and CardDAV server for calendars, tasks, and contacts.

---

## Table of Contents

This index covers the package's runtime, persistent state, lifecycle, and operable surface.

- [Image and Container Runtime](#image-and-container-runtime)
- [Volume and Data Layout](#volume-and-data-layout)
- [File Models](#file-models)
- [Dependencies](#dependencies)
- [Network Access and Interfaces](#network-access-and-interfaces)
- [Installation and First-Run Flow](#installation-and-first-run-flow)
- [Actions](#actions)
- [Tasks](#tasks)
- [Health Checks](#health-checks)
- [Backups and Restore](#backups-and-restore)
- [Limitations and Differences](#limitations-and-differences)
- [Quick Reference for AI Consumers](#quick-reference-for-ai-consumers)

---

## Image and Container Runtime

The package builds a custom image from Baïkal's checksummed upstream release archive on the official PHP Apache image. It supports x86_64 and aarch64.

The `baikal` subcontainer runs Apache with Baïkal's `html/` directory as the only document root. Application code is immutable in the image, and all persistent Baïkal state is written to the mounted data volume. The daemon uses `sdk.useEntrypoint()`, preserving the image's `docker-php-entrypoint` and default `apache2-foreground` command.

## Volume and Data Layout

The `data` volume is mounted at `/var/lib/baikal` and contains all mutable upstream state.

| Path                                    | Contents                                                       |
| --------------------------------------- | -------------------------------------------------------------- |
| `/var/lib/baikal/config/`               | Baïkal's generated YAML configuration                          |
| `/var/lib/baikal/Specific/`             | Installation marker and other instance state                   |
| `/var/lib/baikal/Specific/db/db.sqlite` | Users, calendars, events, tasks, contacts, and server metadata |

A startup oneshot creates these directories and assigns them to Apache's `www-data` user before the server starts.

## File Models

The package defines no StartOS file models. Baïkal's browser installer owns `config/baikal.yaml`, and the package does not rewrite manual or admin-interface changes.

`BAIKAL_PATH_CONFIG` and `BAIKAL_PATH_SPECIFIC` direct the application to the persistent volume on every launch.

## Dependencies

None. The supported deployment uses Baïkal's embedded SQLite database.

## Network Access and Interfaces

One HTTP binding on internal port `80` exports two paths from the same Baïkal server.

| Interface | Type | Path        | Purpose                                                   |
| --------- | ---- | ----------- | --------------------------------------------------------- |
| `admin`   | UI   | `/admin/`   | Initial setup and administration of users and collections |
| `dav`     | API  | `/dav.php/` | CalDAV and CardDAV client synchronization                 |

Baïkal performs authentication for both DAV users and its administration interface.

## Installation and First-Run Flow

None.

## Actions

None. User, calendar, address-book, and credential management remains in Baïkal's Administration interface.

## Tasks

None. The package does not block startup on a StartOS task; first-run setup is completed in Baïkal's Administration interface.

## Health Checks

The `baikal` daemon readiness check confirms that Apache is listening on its internal port. A failure after the startup grace period means the web server did not become reachable; inspect the `baikal` daemon logs.

The `configured` health check has no grace period and loads Baïkal's public page to exercise its configuration and SQLite database. It provides explicit guidance when setup or an upgrade is detected, reports a generic application failure for other configuration or database errors, and succeeds only when Baïkal returns its configured landing page.

## Backups and Restore

StartOS stops Baïkal and snapshots the complete `data` volume. This captures the quiescent SQLite database, generated configuration, installation marker, users, credentials, calendars, tasks, contacts, and sharing state together.

Restore returns the same volume contents and requires no package-side regeneration. Start the restored service and use the existing Baïkal credentials.

## Limitations and Differences

1. SQLite is the supported database. A database configured outside the package is not included in StartOS backups and is not covered by this package's restore guarantees.

---

## Quick Reference for AI Consumers

This summary identifies the package surfaces an administering agent can operate or inspect.

```yaml
package_id: baikal
image: local Dockerfile
architectures: [x86_64, aarch64]
subcontainers: [baikal]
volumes:
  data: /var/lib/baikal
file_models: []
startos_managed_env_vars:
  - BAIKAL_PATH_CONFIG
  - BAIKAL_PATH_SPECIFIC
dependencies: none
interfaces:
  admin: { type: ui, port: 80 }
  dav: { type: api, port: 80 }
actions: []
tasks: []
health_checks:
  - baikal
  - configured
```
