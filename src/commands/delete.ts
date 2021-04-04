import { Arguments } from "yargs"
import { OrigeenError } from "../commands"

import { deleteProject } from "../projects"

export async function execute(args: Arguments) {
    const projectName = args._[1]?.toString()

    if (projectName == undefined) {
        throw new OrigeenError("You did not provide any project name", [
            "Provide a <projectName> after the command name",
        ])
    }

    await deleteProject(projectName)
}
