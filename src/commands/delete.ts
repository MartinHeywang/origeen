 
import { positionals } from "../cli"
import { OrigeenError } from "../commands"

import { deleteProject } from "../projects"

export async function execute() {
    const projectName = positionals()[0]

    if (projectName == undefined) {
        throw new OrigeenError("You did not provide any project name", [
            "Provide a <projectName> after the command name",
        ])
    }

    await deleteProject(projectName)
}
