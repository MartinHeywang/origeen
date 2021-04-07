import { positionals } from "../cli"
import { Command } from "../commandUtils"
import { OrigeenError } from "../errors"

import { importProject } from "../projectUtils"

const descriptor: Command = {
    name: "import",
    description: "Imports an exisiting project into Origeen",
    run: async () => execute(),
    alias: [],

    positionals: [
        {
            name: "path",
            desc: "The absolute path to the project you want to import",
            required: true,
        },
    ],
    options: {},
}

function execute() {
    const pathToProject = positionals()[0]

    if (pathToProject == undefined) {
        throw new OrigeenError(
            "You did not provide a path to a project to import.",
            ["Provide the <pathToProject> after the command name."]
        )
    }

    importProject(pathToProject)
}

export default { descriptor }
