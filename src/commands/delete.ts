import { positionals } from "../cli"
import { Command } from "../commandUtils"
import { OrigeenError } from "../errors"

import { deleteProject } from "../projectUtils"

const descriptor: Command = {
    name: "delete",
    description: "Deletes a project from the disk",
    run: async () => await execute(),
    alias: [],

    positionals: [
        {
            name: "projectName",
            desc: "The name of the project you are deleting",
            required: true,
        },
    ],
    options: {},
}

async function execute() {
    const projectName = positionals()[0]

    if (projectName == undefined) {
        throw new OrigeenError("You did not provide any project name", [
            "Provide a <projectName> after the command name",
        ])
    }

    await deleteProject(projectName)
}

export default { descriptor }
