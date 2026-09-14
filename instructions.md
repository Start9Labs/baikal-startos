# Baïkal

## Documentation

- [Baïkal documentation](https://sabre.io/baikal/) — upstream overview and client information.
- [Installation guide](https://sabre.io/baikal/install/) — details of the browser setup and DAV endpoints.
- [Troubleshooting guide](https://sabre.io/baikal/troubleshooting/) — solutions for common server and client problems.

## What you get on StartOS

Baïkal provides an **Administration** interface for managing the server and a **DAV** interface for synchronizing calendars, tasks, and contacts. Its configuration and embedded database are kept in the package's persistent storage and included in StartOS backups.

## Getting set up

1. Start Baïkal.
2. Open **Administration** and complete the setup wizard. Set the server time zone and an admin password, leave CalDAV and CardDAV enabled, and keep the default Digest authentication unless one of your clients requires Basic authentication.
3. Keep SQLite selected on the database screen. It is the database supported and backed up by this package.
4. Finish the wizard. The **Configuration** health check becomes healthy after setup completes.
5. Sign in to **Administration** with username `admin` and the password you chose.
6. Create a user for DAV access, then create or manage that user's calendars and address books.
7. Configure each calendar or contacts app with the **DAV** interface address and the DAV user's credentials.

The administration account is separate from DAV users. Do not use `admin` as a calendar or contacts login.

## Using Baïkal

### Administration

Use **Administration** to create users, change their passwords, and manage calendars and address books. If an update presents a database-upgrade screen, the **Configuration** health check remains unhealthy until you complete the upgrade without stopping Baïkal or closing the page.

### DAV clients

Use the **DAV** interface address as the server URL in a CalDAV or CardDAV client. Many clients can discover the correct endpoints from the server address automatically.

Digest authentication is the default. If a client only supports Basic authentication, change the WebDAV authentication type in Baïkal's settings and connect only through an HTTPS address.

## Limitations

Baïkal's browser interface is for administration only. View and edit calendars, tasks, and contacts with a CalDAV or CardDAV client.
