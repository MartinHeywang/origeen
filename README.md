# Origeen

<a href="https://npmjs.org/package/origeen" title="View this project on NPM"><img src="https://img.shields.io/npm/v/origeen.svg" alt="NPM version" /></a>
<a href="https://npmjs.org/package/origeen" title="View this project on NPM"><img src="https://img.shields.io/npm/dm/origeen.svg" alt="NPM version" /></a>

Origeen is based on the idea that managing projects is a loss of time. You want to spend more time coding and that's easy to understand.

It is a simple and intuitive tool, that works with projects of any scale. Its simplicity makes it really fast as well. You can get started in less that 60 seconds !

## Features

- Create/import/delete projects from your CLI
- Open projects with your favourite editor
- Use templates to create projects with basic files; skip the boring configuration steps.
- Avoid unnecessary `cd`(s)
- Easy-to-understand errors.

*Upcoming features:*
- Create a project with a license of your choice
- Create a git repo for your project and its remote on GitHub.
- ...

## Get Started

3 commands only!
```bash
$ npm install origeen --global
$ orgn setup

$ orgn create my-fancy-project --open
# or
$ orgn import X:/JohnDoe/.../project-name
```

For your new projects, you can install templates like this :
```bash
$ orgn install-template <templateName> --remote <urlToAGitRepo>

# To create a project with Parcel and Sass
$ orgn it sass --remote https://github.com/kevin-powell/sass-made-easy
$ orgn create my-sass-project --template sass
```

You can check the [wiki](/wiki), if you want to know more about Origeen and how to use it.

## Contributing

See the [CONTRIBUTING.md](./CONTRIBUTING.md) file for more.

## License

This project is licensed under the MIT.
See [LICENSE](./LICENSE).