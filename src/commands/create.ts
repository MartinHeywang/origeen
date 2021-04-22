import { flags, positionals } from "../cli"
import { Command } from "../commandUtils"
import { OrigeenError } from "../errors"
import { createProject, openProject } from "../projectUtils"

const descriptor: Command = {
    name: "create",
    description: "Creates a new project",
    run: async () => execute(),
    alias: ["new", "c"],

    positionals: [
        {
            name: "projectName",
            desc: "The name of the project that you are creating",
            required: true,
        },
    ],
    options: {
        open: {
            desc: "Whether you want to open the project right after its creation",
            required: false,
            alias: ["o"],
        },
        license: {
            desc: "The name of the LICENSE you want to add",
            required: false,
        },
    },
}

async function execute() {
    const inputFlags = flags()

    const projectName = positionals()[0]
    if (projectName == undefined) {
        throw new OrigeenError("You need to provide a project name", [
            "Add a <projectName> after the command name",
        ])
    }

    const templateName = (inputFlags.template as string) || "@empty"
    const licenseName = inputFlags.license

    createProject(projectName, templateName, licenseName, inputFlags.git, inputFlags.open)
}

export default { descriptor }
