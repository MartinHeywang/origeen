import { openProject } from "../projectUtils"
import { Command } from "../commandUtils"
import { OrigeenError } from "../errors"

import { positionals } from "../cli"

const descriptor: Command = {
    name: "open",
    description: "Opens a project with your favourite editor",
    run: async () => execute(),
    alias: ["o"],

    positionals: [
        {
            name: "projectName",
            desc: "The name of the project that you want to open",
            required: true,
        },
    ],
    options: {},
}

async function execute() {
    const projectName: string = positionals()[0]

    if (projectName == undefined) {
        throw new OrigeenError(
            "In order to open a project, you need to provide its name.",
            ["Provide '<projectName>' after the command name"]
        )
    }

    openProject(projectName)
}

export default { descriptor }
