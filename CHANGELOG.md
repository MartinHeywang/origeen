# Origeen's changelog


### v0.5.3

- Fixed: --open (or -o) flag not working
- Fixed: --no-git flag not working

### v0.5.2

- Fixed: can import the same project twice
- Fixed: can't create projects in sub folders of the workspace
- Fixed: confusion b/w the project name and the one passed as cmd argument (which may be a path too)
- Fixed: open command not exiting until the editor is opened

### v0.5.1

- Fixed "name" validator in the setup command

### v0.5.0

- Added the "git repo" feature : creates a git repo for each project.

- Optimization

---

### v0.4.0

- Added the LICENSE feature : add a license directly when creating a project.

- Rewrote and optimized some files

---
### v0.3.4

- Improved error handling and log system

- Fixed edge cases on templates
- Removed the ability to create a project in another project
- Added verification when deleting a project
- Deleting project recursively (so it works when the project is not empty)
- Changed Origeen's home to make it responsive on any OS

---
## **All the versions below are not working :**
**Even though some of them are published to the npm registry**

### v0.3.2 - v0.3.3

No bug fixes, no new feature

This is my first package published to the npm registry... and I made mistakes with dependencies, ignore files...

---

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