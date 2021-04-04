import { Arguments } from "yargs"

import { openProject } from "../projects"
import { OrigeenError } from "../commands"

export function execute(args: Arguments): void {
    const projectName: string = args._[1]?.toString()
    if (projectName == undefined) {
        throw new OrigeenError("In order to open a project, you need to provide its name.", [
            "Provide '<projectName>' after the command name",
        ])
    }

    openProject(projectName)
}
