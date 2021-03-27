# Origeen's changelog

### v0.3.1

- Moved config.json and projects.json into the user root folder and undzer /origeen. Also, they are silently created when they does not exist.

---

### v0.3.0

- Added the import command (register a project into Origeen)
- Added the install-template command to make use install a template into the templates folder
- Added the delete-template command to get rid of templates that you no longer need

- Improved logs utils with bash blocks, links...

---

### v0.2.1

- Improved the setup command

- The 'cp' command is not available on Windows (it was used to copy templates when creating a project). We are now using fs-extra for all the file system work.
- Fixed logs flags (-X, -W, -E or --debug, --warning-only, --error-only)

---

### v0.2.0

- Added issues and features requests template
- Added the projects command (lists all your projects)
- Added support for templates when creating a project

- Improved the help command output
- Improved logging in general

- Optimization

---

### v0.1.0

- Added the delete command
- Added the create command
- Added the open command
- Added the config command